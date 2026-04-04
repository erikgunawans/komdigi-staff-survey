import { getServerSession } from "next-auth";
import NextAuthImport from "next-auth/next";
import AzureADProviderImport from "next-auth/providers/azure-ad";
import GoogleProviderImport from "next-auth/providers/google";
import {
  getAllowedEmailDomains,
  getConfiguredWorkProviders,
  getEmailDomain,
  getSuperAdminEmails,
  isSuperAdminEmail,
} from "./work-auth";

const NextAuth = NextAuthImport.default;
const AzureADProvider = AzureADProviderImport.default;
const GoogleProvider = GoogleProviderImport.default;

function buildProviders() {
  const domains = getAllowedEmailDomains();
  const superAdminEmails = getSuperAdminEmails();
  const hasExternalSuperAdmins = superAdminEmails.some(
    (email) => !domains.includes(getEmailDomain(email)),
  );
  const providers = [];

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: "select_account",
            ...(!hasExternalSuperAdmins && domains[0] ? { hd: domains[0] } : {}),
          },
        },
      }),
    );
  }

  if (
    process.env.AZURE_AD_CLIENT_ID &&
    process.env.AZURE_AD_CLIENT_SECRET &&
    process.env.AZURE_AD_TENANT_ID
  ) {
    providers.push(
      AzureADProvider({
        clientId: process.env.AZURE_AD_CLIENT_ID,
        clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
        tenantId: process.env.AZURE_AD_TENANT_ID,
      }),
    );
  }

  return providers;
}

export const authOptions = {
  providers: buildProviders(),
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, profile, account }) {
      const email =
        user?.email ??
        profile?.email ??
        profile?.preferred_username ??
        profile?.upn ??
        null;
      const allowedDomains = getAllowedEmailDomains();
      const superAdmin = isSuperAdminEmail(email);

      console.info("auth.signIn", {
        provider: account?.provider ?? null,
        email,
        superAdmin,
        allowedDomains,
      });

      if (!email) {
        console.warn("auth.signIn.denied", { reason: "missing-email", provider: account?.provider ?? null });
        return false;
      }

      if (superAdmin) {
        console.info("auth.signIn.allowed", { reason: "super-admin", email });
        return true;
      }

      if (allowedDomains.length === 0) {
        console.warn("auth.signIn.denied", { reason: "no-allowed-domains", email });
        return false;
      }

      const allowed = allowedDomains.includes(getEmailDomain(email));
      console.info("auth.signIn.domain-check", {
        email,
        allowed,
        emailDomain: getEmailDomain(email),
      });
      return allowed;
    },
    async jwt({ token, account, profile, user }) {
      if (account) {
        token.authProvider = account.provider;
        token.authSubject = account.providerAccountId;
      }

      const email =
        user?.email ??
        profile?.email ??
        profile?.preferred_username ??
        profile?.upn ??
        token.email ??
        null;

      if (email) {
        token.email = email;
        token.isSuperAdmin = isSuperAdminEmail(email);
      }

      const name = user?.name ?? profile?.name ?? token.name ?? null;

      if (name) {
        token.name = name;
      }

      if (token.isSuperAdmin === undefined) {
        token.isSuperAdmin = isSuperAdminEmail(token.email ?? null);
      }

      if (account || user) {
        console.info("auth.jwt", {
          provider: token.authProvider ?? null,
          authSubject: token.authSubject ?? null,
          email: token.email ?? null,
          isSuperAdmin: Boolean(token.isSuperAdmin),
        });
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.authProvider = token.authProvider ?? null;
        session.user.authSubject = token.authSubject ?? null;
        session.user.email = token.email ?? session.user.email ?? null;
        session.user.name = token.name ?? session.user.name ?? null;
        session.user.isSuperAdmin = Boolean(token.isSuperAdmin);
      }

      console.info("auth.session", {
        provider: session.user?.authProvider ?? null,
        authSubject: session.user?.authSubject ?? null,
        email: session.user?.email ?? null,
        isSuperAdmin: Boolean(session.user?.isSuperAdmin),
      });

      return session;
    },
  },
};

export const nextAuthHandler = NextAuth(authOptions);

export async function getAuthSession() {
  return getServerSession(authOptions);
}

export function getWorkProviderButtons() {
  return getConfiguredWorkProviders();
}
