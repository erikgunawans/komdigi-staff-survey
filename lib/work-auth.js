export function getAllowedEmailDomains() {
  return (process.env.ALLOWED_EMAIL_DOMAINS ?? "")
    .split(",")
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean);
}

export function getSuperAdminEmails() {
  return (process.env.SUPER_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function getConfiguredWorkProviders() {
  const providers = [];

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push({
      id: "google",
      name: "Google Workspace",
    });
  }

  if (
    process.env.AZURE_AD_CLIENT_ID &&
    process.env.AZURE_AD_CLIENT_SECRET &&
    process.env.AZURE_AD_TENANT_ID
  ) {
    providers.push({
      id: "azure-ad",
      name: "Microsoft Work Account",
    });
  }

  return providers;
}

export function isWorkAuthEnabled() {
  return Boolean(
    process.env.NEXTAUTH_SECRET &&
      (getAllowedEmailDomains().length > 0 || getSuperAdminEmails().length > 0) &&
      getConfiguredWorkProviders().length > 0,
  );
}

export function getEmailDomain(email) {
  return email?.split("@")[1]?.trim().toLowerCase() ?? "";
}

export function isSuperAdminEmail(email) {
  const normalizedEmail = email?.trim().toLowerCase() ?? "";

  if (!normalizedEmail) {
    return false;
  }

  return getSuperAdminEmails().includes(normalizedEmail);
}

export function getIdentityFromSession(session) {
  const provider = session?.user?.authProvider ?? null;
  const providerUserId = session?.user?.authSubject ?? null;

  if (!provider || !providerUserId) {
    return null;
  }

  return {
    provider,
    providerUserId,
    email: session.user.email ?? null,
    name: session.user.name ?? null,
  };
}
