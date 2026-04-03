import { createHash, randomBytes } from "node:crypto";

export function hashInviteToken(token) {
  const secret = process.env.SURVEY_TOKEN_SECRET;

  if (!secret) {
    throw new Error("SURVEY_TOKEN_SECRET is not configured.");
  }

  return createHash("sha256")
    .update(`${secret}:${token.trim()}`)
    .digest("hex");
}

export function createRawInviteToken() {
  return randomBytes(24).toString("base64url");
}
