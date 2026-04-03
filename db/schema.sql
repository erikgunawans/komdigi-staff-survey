create extension if not exists pgcrypto;

create table if not exists survey_invites (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  team text,
  status text not null default 'unused' check (status in ('unused', 'started', 'submitted')),
  started_at timestamptz,
  submitted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists survey_auth_identities (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid not null references survey_invites(id) on delete cascade,
  provider text not null,
  provider_user_id text not null,
  email text,
  name text,
  created_at timestamptz not null default now(),
  last_login_at timestamptz not null default now(),
  unique (provider, provider_user_id)
);

alter table survey_auth_identities drop constraint if exists survey_auth_identities_invite_id_key;
create index if not exists survey_auth_identities_invite_id_idx on survey_auth_identities(invite_id);
create index if not exists survey_auth_identities_email_idx on survey_auth_identities(lower(email));

create table if not exists survey_sessions (
  id uuid primary key,
  invite_id uuid not null references survey_invites(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

delete from survey_sessions
where id in (
  select id
  from (
    select
      id,
      row_number() over (
        partition by invite_id
        order by expires_at desc, created_at desc, id desc
      ) as row_number
    from survey_sessions
  ) ranked
  where ranked.row_number > 1
);

create index if not exists survey_sessions_invite_id_idx on survey_sessions(invite_id);
create unique index if not exists survey_sessions_single_active_idx on survey_sessions(invite_id);

create table if not exists survey_responses (
  id uuid primary key,
  invite_id uuid not null references survey_invites(id) on delete cascade,
  question_id text not null,
  answer jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (invite_id, question_id)
);

create index if not exists survey_responses_invite_id_idx on survey_responses(invite_id);
