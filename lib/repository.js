import { randomUUID } from "node:crypto";
import { sql, withTransaction } from "./db.js";
import { hashInviteToken } from "./token.js";

function normalizeEmail(email) {
  return email?.trim().toLowerCase() ?? null;
}

function mapInvite(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    status: row.status,
    team: row.team,
    startedAt: row.started_at,
    submittedAt: row.submitted_at,
  };
}

async function getSurveyContextByInviteId(inviteId) {
  const inviteResult = await sql(
    `
      select
        i.id,
        i.status,
        i.team,
        i.started_at,
        i.submitted_at,
        ai.email as identity_email,
        ai.name as identity_name,
        ai.provider as identity_provider
      from survey_invites i
      left join lateral (
        select email, name, provider
        from survey_auth_identities
        where invite_id = i.id
        order by last_login_at desc, created_at asc
        limit 1
      ) ai on true
      where i.id = $1
      limit 1
    `,
    [inviteId],
  );

  const invite = mapInvite(inviteResult.rows[0]);

  if (!invite) {
    return null;
  }

  const responseResult = await sql(
    `
      select question_id, answer
      from survey_responses
      where invite_id = $1
      order by updated_at asc
    `,
    [invite.id],
  );

  const responses = Object.fromEntries(
    responseResult.rows.map((row) => [row.question_id, row.answer]),
  );

  return {
    invite,
    responses,
    identity: {
      email: inviteResult.rows[0]?.identity_email ?? null,
      name: inviteResult.rows[0]?.identity_name ?? null,
      provider: inviteResult.rows[0]?.identity_provider ?? null,
    },
  };
}

async function saveSurveyResponseForInvite({
  client,
  inviteId,
  team,
  questionId,
  answer,
}) {
  const inviteResult = await client.query(
    `
      select id, status
      from survey_invites
      where id = $1
      limit 1
      for update
    `,
    [inviteId],
  );

  const invite = inviteResult.rows[0];

  if (!invite) {
    return { error: "invalid-session" };
  }

  if (invite.status === "submitted") {
    return { error: "already-submitted" };
  }

  await client.query(
    `
      update survey_invites
      set team = coalesce(team, $2)
      where id = $1
    `,
    [invite.id, team],
  );

  await client.query(
    `
      insert into survey_responses (id, invite_id, question_id, answer)
      values ($1, $2, $3, $4::jsonb)
      on conflict (invite_id, question_id)
      do update set
        answer = excluded.answer,
        updated_at = now()
    `,
    [randomUUID(), invite.id, questionId, JSON.stringify(answer)],
  );

  return { ok: true };
}

async function submitSurveyForInvite({ client, inviteId, team }) {
  const inviteResult = await client.query(
    `
      select id, status
      from survey_invites
      where id = $1
      limit 1
      for update
    `,
    [inviteId],
  );

  const invite = inviteResult.rows[0];

  if (!invite) {
    return { error: "invalid-session" };
  }

  if (invite.status === "submitted") {
    return { error: "already-submitted" };
  }

  await client.query(
    `
      update survey_invites
      set status = 'submitted',
          team = coalesce(team, $2),
          submitted_at = now()
      where id = $1
    `,
    [invite.id, team],
  );

  await client.query(
    `
      delete from survey_sessions
      where invite_id = $1
    `,
    [invite.id],
  );

  return { ok: true };
}

export async function getInviteByRawToken(rawToken) {
  const tokenHash = hashInviteToken(rawToken);
  const result = await sql(
    `
      select id, status, team, started_at, submitted_at
      from survey_invites
      where token_hash = $1
      limit 1
    `,
    [tokenHash],
  );

  return mapInvite(result.rows[0]);
}

export async function startSurveySession(rawToken) {
  return withTransaction(async (client) => {
    const tokenHash = hashInviteToken(rawToken);
    const inviteResult = await client.query(
      `
        select id, status, team, started_at, submitted_at
        from survey_invites
        where token_hash = $1
        limit 1
        for update
      `,
      [tokenHash],
    );

    const invite = inviteResult.rows[0];

    if (!invite) {
      return { error: "invalid-token" };
    }

    if (invite.status === "submitted") {
      return { error: "already-submitted" };
    }

    await client.query(
      `
        delete from survey_sessions
        where invite_id = $1
          and expires_at <= now()
      `,
      [invite.id],
    );

    const activeSessionResult = await client.query(
      `
        select id
        from survey_sessions
        where invite_id = $1
          and expires_at > now()
        limit 1
      `,
      [invite.id],
    );

    if (activeSessionResult.rows[0]) {
      return { error: "already-started" };
    }

    await client.query(
      `
        update survey_invites
        set status = 'started',
            started_at = coalesce(started_at, now())
        where id = $1
      `,
      [invite.id],
    );

    const sessionId = randomUUID();
    await client.query(
      `
        insert into survey_sessions (id, invite_id, expires_at)
        values ($1, $2, now() + interval '12 hours')
      `,
      [sessionId, invite.id],
    );

    return {
      sessionId,
      invite: mapInvite({ ...invite, status: "started" }),
    };
  });
}

export async function getSurveyContextBySession(sessionId) {
  const result = await sql(
    `
      select
        i.id,
        i.status,
        i.team,
        i.started_at,
        i.submitted_at
      from survey_sessions s
      join survey_invites i on i.id = s.invite_id
      where s.id = $1
        and s.expires_at > now()
      limit 1
    `,
    [sessionId],
  );

  const invite = mapInvite(result.rows[0]);

  if (!invite) {
    return null;
  }

  return getSurveyContextByInviteId(invite.id);
}

export async function saveSurveyResponse({
  sessionId,
  team,
  questionId,
  answer,
}) {
  return withTransaction(async (client) => {
    const inviteResult = await client.query(
      `
        select i.id, i.status
        from survey_sessions s
        join survey_invites i on i.id = s.invite_id
        where s.id = $1
          and s.expires_at > now()
        limit 1
        for update
      `,
      [sessionId],
    );

    const invite = inviteResult.rows[0];

    if (!invite) {
      return { error: "invalid-session" };
    }

    return saveSurveyResponseForInvite({
      client,
      inviteId: invite.id,
      team,
      questionId,
      answer,
    });
  });
}

export async function cleanupExpiredSessions() {
  const result = await sql(
    `
      delete from survey_sessions
      where expires_at <= now()
    `,
  );

  return result.rowCount ?? 0;
}

export async function insertInvite({ tokenHash, team = null }) {
  const result = await sql(
    `
      insert into survey_invites (token_hash, team)
      values ($1, $2)
      returning id, status, team, started_at, submitted_at
    `,
    [tokenHash, team],
  );

  return mapInvite(result.rows[0]);
}

export async function listSurveyExportRows() {
  const result = await sql(
    `
      select
        i.id as invite_id,
        i.team,
        i.status,
        i.started_at,
        i.submitted_at,
        ai.email as identity_email,
        ai.name as identity_name,
        ai.provider as identity_provider,
        r.question_id,
        r.answer,
        r.updated_at as response_updated_at
      from survey_invites i
      left join lateral (
        select email, name, provider
        from survey_auth_identities
        where invite_id = i.id
        order by last_login_at desc, created_at asc
        limit 1
      ) ai on true
      left join survey_responses r on r.invite_id = i.id
      order by i.created_at asc, r.question_id asc
    `,
  );

  return result.rows;
}

export async function submitSurvey({ sessionId, team }) {
  return withTransaction(async (client) => {
    const inviteResult = await client.query(
      `
        select i.id, i.status
        from survey_sessions s
        join survey_invites i on i.id = s.invite_id
        where s.id = $1
          and s.expires_at > now()
        limit 1
        for update
      `,
      [sessionId],
    );

    const invite = inviteResult.rows[0];

    if (!invite) {
      return { error: "invalid-session" };
    }

    return submitSurveyForInvite({ client, inviteId: invite.id, team });
  });
}

export async function getOrCreateSurveyContextByIdentity({
  provider,
  providerUserId,
  email = null,
  name = null,
}) {
  const normalizedEmail = normalizeEmail(email);

  const inviteId = await withTransaction(async (client) => {
    const identityResult = await client.query(
      `
        select ai.invite_id
        from survey_auth_identities ai
        join survey_invites i on i.id = ai.invite_id
        where ai.provider = $1
          and ai.provider_user_id = $2
        limit 1
        for update of ai, i
      `,
      [provider, providerUserId],
    );

    const existingIdentity = identityResult.rows[0];

    if (existingIdentity) {
      await client.query(
        `
          update survey_auth_identities
          set email = $3,
              name = $4,
              last_login_at = now()
          where provider = $1
            and provider_user_id = $2
        `,
        [provider, providerUserId, normalizedEmail, name],
      );

      return existingIdentity.invite_id;
    }

    if (normalizedEmail) {
      const emailIdentityResult = await client.query(
        `
          select invite_id
          from survey_auth_identities
          where lower(email) = $1
          order by last_login_at desc, created_at asc
          limit 1
          for update
        `,
        [normalizedEmail],
      );

      const emailIdentity = emailIdentityResult.rows[0];

      if (emailIdentity) {
        await client.query(
          `
            insert into survey_auth_identities (invite_id, provider, provider_user_id, email, name)
            values ($1, $2, $3, $4, $5)
          `,
          [emailIdentity.invite_id, provider, providerUserId, normalizedEmail, name],
        );

        return emailIdentity.invite_id;
      }
    }

    const syntheticTokenHash = `auth:${provider}:${providerUserId}`;
    const inviteInsert = await client.query(
      `
        insert into survey_invites (token_hash)
        values ($1)
        returning id
      `,
      [syntheticTokenHash],
    );

    const inviteId = inviteInsert.rows[0].id;

    await client.query(
      `
        insert into survey_auth_identities (invite_id, provider, provider_user_id, email, name)
        values ($1, $2, $3, $4, $5)
      `,
      [inviteId, provider, providerUserId, normalizedEmail, name],
    );

    return inviteId;
  });

  return getSurveyContextByInviteId(inviteId);
}

export async function saveSurveyResponseByIdentity({
  provider,
  providerUserId,
  email = null,
  name = null,
  team,
  questionId,
  answer,
}) {
  const normalizedEmail = normalizeEmail(email);

  return withTransaction(async (client) => {
    const identityResult = await client.query(
      `
        select invite_id
        from survey_auth_identities
        where provider = $1
          and provider_user_id = $2
        limit 1
        for update
      `,
      [provider, providerUserId],
    );

    const identity = identityResult.rows[0];

    if (!identity) {
      return { error: "invalid-session" };
    }

    await client.query(
      `
        update survey_auth_identities
        set email = $3,
            name = $4,
            last_login_at = now()
        where provider = $1
          and provider_user_id = $2
      `,
      [provider, providerUserId, normalizedEmail, name],
    );

    return saveSurveyResponseForInvite({
      client,
      inviteId: identity.invite_id,
      team,
      questionId,
      answer,
    });
  });
}

export async function submitSurveyByIdentity({
  provider,
  providerUserId,
  email = null,
  name = null,
  team,
}) {
  const normalizedEmail = normalizeEmail(email);

  return withTransaction(async (client) => {
    const identityResult = await client.query(
      `
        select invite_id
        from survey_auth_identities
        where provider = $1
          and provider_user_id = $2
        limit 1
        for update
      `,
      [provider, providerUserId],
    );

    const identity = identityResult.rows[0];

    if (!identity) {
      return { error: "invalid-session" };
    }

    await client.query(
      `
        update survey_auth_identities
        set email = $3,
            name = $4,
            last_login_at = now()
        where provider = $1
          and provider_user_id = $2
      `,
      [provider, providerUserId, normalizedEmail, name],
    );

    return submitSurveyForInvite({
      client,
      inviteId: identity.invite_id,
      team,
    });
  });
}
