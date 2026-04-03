import { NextResponse } from "next/server";
import { getHealthSnapshot } from "../../../lib/health";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const health = await getHealthSnapshot();
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
