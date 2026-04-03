import { insertInvite } from "../lib/repository.js";
import { createRawInviteToken, hashInviteToken } from "../lib/token.js";

const team = process.argv[2] ?? null;
const shouldInsert = process.argv.includes("--insert");

const rawToken = createRawInviteToken();
const tokenHash = hashInviteToken(rawToken);
const teamValue = team ? `'${team}'` : "null";

if (shouldInsert) {
  await insertInvite({ tokenHash, team });
}

console.log(`Raw token: ${rawToken}`);
console.log(`Token hash: ${tokenHash}`);
console.log(`Team: ${team ?? "-"}`);
console.log(`Inserted: ${shouldInsert ? "yes" : "no"}`);
console.log("");
console.log("SQL:");
console.log(`insert into survey_invites (token_hash, team) values ('${tokenHash}', ${teamValue});`);
