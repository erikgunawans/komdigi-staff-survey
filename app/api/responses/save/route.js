import { NextResponse } from "next/server";
import { getAuthSession } from "../../../../lib/auth";
import { getQuestionById, getSubdirById } from "../../../../lib/questionnaire";
import {
  saveSurveyResponse,
  saveSurveyResponseByIdentity,
} from "../../../../lib/repository";
import { getSurveySessionId } from "../../../../lib/session";
import { getIdentityFromSession, isWorkAuthEnabled } from "../../../../lib/work-auth";

export async function POST(request) {
  try {
    const { team, questionId, answer } = await request.json();

    if (!getSubdirById(team) || !getQuestionById(questionId, team)) {
      return NextResponse.json({ error: "invalid-question" }, { status: 400 });
    }

    if (answer === undefined || answer === "") {
      return NextResponse.json({ error: "missing-answer" }, { status: 400 });
    }

    let result;

    if (isWorkAuthEnabled()) {
      const authSession = await getAuthSession();
      const identity = getIdentityFromSession(authSession);

      if (!identity) {
        return NextResponse.json({ error: "invalid-session" }, { status: 401 });
      }

      result = await saveSurveyResponseByIdentity({
        ...identity,
        team,
        questionId,
        answer,
      });
    } else {
      const sessionId = await getSurveySessionId();

      if (!sessionId) {
        return NextResponse.json({ error: "invalid-session" }, { status: 401 });
      }

      result = await saveSurveyResponse({
        sessionId,
        team,
        questionId,
        answer,
      });
    }

    if (result.error) {
      const status = result.error === "already-submitted" ? 409 : 401;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("response save failed", error);
    return NextResponse.json({ error: "response-save-failed" }, { status: 500 });
  }
}
