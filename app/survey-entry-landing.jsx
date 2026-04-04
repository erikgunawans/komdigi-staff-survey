import { redirect } from "next/navigation";
import TokenEntry from "../components/TokenEntry";
import WorkSignIn from "../components/WorkSignIn";
import { getAuthSession, getWorkProviderButtons } from "../lib/auth";
import { getSurveySessionId } from "../lib/session";
import { getAllowedEmailDomains, isWorkAuthEnabled } from "../lib/work-auth";

export default async function SurveyEntryLanding({ searchParams }) {
  const resolvedSearchParams = await searchParams;

  if (isWorkAuthEnabled()) {
    const session = await getAuthSession();

    if (session?.user?.authSubject) {
      redirect("/survey");
    }

    return (
      <WorkSignIn
        providers={getWorkProviderButtons()}
        allowedDomains={getAllowedEmailDomains()}
        error={resolvedSearchParams?.error ?? ""}
      />
    );
  }

  const sessionId = await getSurveySessionId();

  if (sessionId) {
    redirect("/survey");
  }

  const token = resolvedSearchParams?.token ?? "";
  return <TokenEntry initialToken={token} />;
}
