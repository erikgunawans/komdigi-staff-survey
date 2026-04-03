import { NextResponse } from "next/server";
import { getAuthSession } from "../../../lib/auth";
import { getSubdirById } from "../../../lib/questionnaire";
import { submitSurvey, submitSurveyByIdentity } from "../../../lib/repository";
import { clearSurveySession, getSurveySessionId } from "../../../lib/session";
import { getIdentityFromSession, isWorkAuthEnabled } from "../../../lib/work-auth";

export async function POST(request) {
  try {
    const { team } = await request.json();

    if (!getSubdirById(team)) {
      return NextResponse.json({ error: "invalid-team" }, { status: 400 });
    }

    let result;

    if (isWorkAuthEnabled()) {
      const authSession = await getAuthSession();
      const identity = getIdentityFromSession(authSession);

      if (!identity) {
        return NextResponse.json({ error: "invalid-session" }, { status: 401 });
      }

      result = await submitSurveyByIdentity({
        ...identity,
        team,
      });
    } else {
      const sessionId = await getSurveySessionId();

      if (!sessionId) {
        return NextResponse.json({ error: "invalid-session" }, { status: 401 });
      }

      result = await submitSurvey({ sessionId, team });
      await clearSurveySession();
    }

    if (result.error) {
      const status = result.error === "already-submitted" ? 409 : 401;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("survey submit failed", error);
    return NextResponse.json({ error: "submit-failed" }, { status: 500 });
  }
}
