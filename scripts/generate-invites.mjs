import fs from "node:fs/promises";
import path from "node:path";
import { cleanupExpiredSessions, insertInvite } from "../lib/repository.js";
import { createRawInviteToken, hashInviteToken } from "../lib/token.js";

function parseArgs(argv) {
  const args = {
    count: 1,
    team: null,
    baseUrl: "https://staff-survey-app.vercel.app",
    out: null,
    insert: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (value === "--count") {
      args.count = Number(argv[index + 1] ?? 1);
      index += 1;
      continue;
    }

    if (value === "--team") {
      args.team = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (value === "--base-url") {
      args.baseUrl = argv[index + 1] ?? args.baseUrl;
      index += 1;
      continue;
    }

    if (value === "--out") {
      args.out = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (value === "--insert") {
      args.insert = true;
    }
  }

  return args;
}

function toCsvCell(value) {
  const normalized = value ?? "";
  const stringValue = String(normalized);
  return `"${stringValue.replaceAll('"', '""')}"`;
}

const args = parseArgs(process.argv.slice(2));

if (!Number.isInteger(args.count) || args.count < 1) {
  throw new Error("--count must be a positive integer.");
}

const rows = [];

if (args.insert) {
  await cleanupExpiredSessions();
}

for (let index = 0; index < args.count; index += 1) {
  const token = createRawInviteToken();
  const tokenHash = hashInviteToken(token);
  const url = `${args.baseUrl.replace(/\/$/, "")}/?token=${token}`;

  if (args.insert) {
    await insertInvite({ tokenHash, team: args.team });
  }

  rows.push({
    number: index + 1,
    team: args.team ?? "",
    token,
    tokenHash,
    url,
    inserted: args.insert ? "yes" : "no",
  });
}

const header = ["number", "team", "token", "tokenHash", "url", "inserted"];
const csv = [
  header.join(","),
  ...rows.map((row) => header.map((key) => toCsvCell(row[key])).join(",")),
].join("\n");

if (args.out) {
  const targetPath = path.resolve(args.out);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, `${csv}\n`, "utf8");
  console.log(`Wrote ${rows.length} invite(s) to ${targetPath}`);
} else {
  console.log(csv);
}
