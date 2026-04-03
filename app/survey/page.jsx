import { redirect } from "next/navigation";
import StaffSurveyClient from "../../components/StaffSurveyClient";
import SubmittedState from "../../components/SubmittedState";
import { getAuthSession } from "../../lib/auth";
import { getSubdirById } from "../../lib/questionnaire";
import {
  getOrCreateSurveyContextByIdentity,
  getSurveyContextBySession,
} from "../../lib/repository";
import { getSurveySessionId } from "../../lib/session";
import { getIdentityFromSession, isWorkAuthEnabled } from "../../lib/work-auth";

export default async function SurveyPage() {
  if (isWorkAuthEnabled()) {
    const session = await getAuthSession();
    const identity = getIdentityFromSession(session);

    console.info("survey.page", {
      email: session?.user?.email ?? null,
      authProvider: session?.user?.authProvider ?? null,
      authSubject: session?.user?.authSubject ?? null,
      isSuperAdmin: Boolean(session?.user?.isSuperAdmin),
      hasIdentity: Boolean(identity),
    });

    if (!identity) {
      redirect("/");
    }

    const context = await getOrCreateSurveyContextByIdentity(identity);

    if (!context) {
      redirect("/");
    }

    if (context.invite.status === "submitted") {
      const subdir = getSubdirById(context.invite.team);
      return <SubmittedState teamName={subdir?.name ?? null} completionMode="account" />;
    }

    return (
      <StaffSurveyClient
        initialTeam={context.invite.team}
        initialResponses={context.responses}
      />
    );
  }

  const sessionId = await getSurveySessionId();

  if (!sessionId) {
    redirect("/");
  }

  const context = await getSurveyContextBySession(sessionId);

  if (!context) {
    redirect("/");
  }

  if (context.invite.status === "submitted") {
    const subdir = getSubdirById(context.invite.team);
    return <SubmittedState teamName={subdir?.name ?? null} />;
  }

  return (
    <StaffSurveyClient
      initialTeam={context.invite.team}
      initialResponses={context.responses}
    />
  );
}
