import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getAuthSession } from "./auth";
import { isSuperAdminEmail } from "./work-auth";

export const ADMIN_SESSION_COOKIE = "komdigi_staff_admin_session";

function getAdminAccessKey() {
  return process.env.ADMIN_ACCESS_KEY?.trim() ?? "";
}

function hashValue(value) {
  return createHash("sha256").update(value).digest();
}

function getAdminSessionValue() {
  const adminKey = getAdminAccessKey();

  if (!adminKey) {
    return null;
  }

  return createHash("sha256")
    .update(`komdigi-admin:${adminKey}`)
    .digest("hex");
}

export function isAdminConfigured() {
  return Boolean(getAdminAccessKey());
}

export function verifyAdminAccessKey(input) {
  const adminKey = getAdminAccessKey();

  if (!adminKey || !input?.trim()) {
    return false;
  }

  const expected = hashValue(adminKey);
  const actual = hashValue(input.trim());
  return timingSafeEqual(expected, actual);
}

export async function isAdminAuthenticated() {
  const authSession = await getAuthSession();
  const sessionEmail = authSession?.user?.email ?? null;
  const isSessionSuperAdmin = Boolean(authSession?.user?.isSuperAdmin);

  if (isSessionSuperAdmin || isSuperAdminEmail(sessionEmail)) {
    console.info("admin.auth", {
      mode: "super-admin",
      sessionEmail,
      isSessionSuperAdmin,
    });
    return true;
  }

  const expected = getAdminSessionValue();

  if (!expected) {
    console.warn("admin.auth.denied", {
      reason: "missing-admin-access-key",
      sessionEmail,
      isSessionSuperAdmin,
    });
    return false;
  }

  const cookieStore = await cookies();
  const current = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!current) {
    console.warn("admin.auth.denied", {
      reason: "missing-admin-cookie",
      sessionEmail,
      isSessionSuperAdmin,
    });
    return false;
  }

  const cookieAllowed = timingSafeEqual(hashValue(expected), hashValue(current));

  console.info("admin.auth", {
    mode: "admin-cookie",
    sessionEmail,
    isSessionSuperAdmin,
    cookieAllowed,
  });

  return cookieAllowed;
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  const sessionValue = getAdminSessionValue();

  if (!sessionValue) {
    throw new Error("ADMIN_ACCESS_KEY is not configured.");
  }

  cookieStore.set(ADMIN_SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
