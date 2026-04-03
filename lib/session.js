import { cookies } from "next/headers";

export const SURVEY_SESSION_COOKIE = "komdigi_staff_survey_session";

export async function getSurveySessionId() {
  const cookieStore = await cookies();
  return cookieStore.get(SURVEY_SESSION_COOKIE)?.value ?? null;
}

export async function setSurveySessionId(sessionId) {
  const cookieStore = await cookies();

  cookieStore.set(SURVEY_SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearSurveySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SURVEY_SESSION_COOKIE);
}
