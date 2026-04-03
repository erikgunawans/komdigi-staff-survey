import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";

export const dynamic = "force-dynamic";

async function runHealthChecks() {
  const startedAt = Date.now();

  const result = await sql(`
    select
      1 as db_ok,
      to_regclass('public.survey_invites') as invites_table,
      to_regclass('public.survey_auth_identities') as identities_table,
      to_regclass('public.survey_responses') as responses_table,
      to_regclass('public.survey_sessions') as sessions_table
  `);

  const row = result.rows[0] ?? {};
  const missingTables = [
    ["survey_invites", row.invites_table],
    ["survey_auth_identities", row.identities_table],
    ["survey_responses", row.responses_table],
    ["survey_sessions", row.sessions_table],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  return {
    ok: missingTables.length === 0,
    checkedAt: new Date().toISOString(),
    latencyMs: Date.now() - startedAt,
    services: {
      app: "ok",
      database: missingTables.length === 0 ? "ok" : "degraded",
    },
    database: {
      reachable: Boolean(row.db_ok),
      missingTables,
    },
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
  };
}

export async function GET() {
  try {
    const health = await runHealthChecks();
    const status = health.ok ? 200 : 503;

    return NextResponse.json(health, {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("health check failed", error);

    return NextResponse.json(
      {
        ok: false,
        checkedAt: new Date().toISOString(),
        services: {
          app: "ok",
          database: "down",
        },
        error: "health-check-failed",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
