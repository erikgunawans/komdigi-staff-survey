import { NextResponse } from "next/server";
import { startSurveySession } from "../../../../lib/repository";
import { setSurveySessionId } from "../../../../lib/session";

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token || !token.trim()) {
      return NextResponse.json({ error: "invalid-token" }, { status: 400 });
    }

    const result = await startSurveySession(token.trim());

    if (result.error) {
      const status =
        result.error === "already-submitted" || result.error === "already-started"
          ? 409
          : 404;
      return NextResponse.json({ error: result.error }, { status });
    }

    await setSurveySessionId(result.sessionId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("session start failed", error);
    return NextResponse.json({ error: "session-start-failed" }, { status: 500 });
  }
}
