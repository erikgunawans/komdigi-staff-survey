import TokenEntry from "../components/TokenEntry";
import WorkSignIn from "../components/WorkSignIn";
import { getWorkProviderButtons } from "../lib/auth";
import { getAllowedEmailDomains, isWorkAuthEnabled } from "../lib/work-auth";

export default async function SurveyEntryLanding({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const mode = resolvedSearchParams?.mode ?? "";
  const forceTokenMode = mode === "token";

  if (isWorkAuthEnabled() && !forceTokenMode) {
    return (
      <WorkSignIn
        providers={getWorkProviderButtons()}
        allowedDomains={getAllowedEmailDomains()}
        error={resolvedSearchParams?.error ?? ""}
      />
    );
  }

  const token = resolvedSearchParams?.token ?? "";
  return <TokenEntry initialToken={token} />;
}
