import fs from "node:fs/promises";
import path from "node:path";
import { listSurveyExportRows } from "../lib/repository.js";
import { createSurveyCsv } from "../lib/reporting.js";

function parseArgs(argv) {
  const args = {
    out: "exports/survey-responses.csv",
  };

  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--out") {
      args.out = argv[index + 1] ?? args.out;
      index += 1;
    }
  }

  return args;
}

const args = parseArgs(process.argv.slice(2));
const rows = await listSurveyExportRows();
const csv = createSurveyCsv(rows);

const targetPath = path.resolve(args.out);
await fs.mkdir(path.dirname(targetPath), { recursive: true });
await fs.writeFile(targetPath, csv, "utf8");
console.log(`Exported survey results to ${targetPath}`);
