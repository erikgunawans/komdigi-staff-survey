import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../lib/admin";
import { listSurveyExportRows } from "../../../../lib/repository";
import { createSurveyCsv } from "../../../../lib/reporting";

export async function GET() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const rows = await listSurveyExportRows();
  const csv = createSurveyCsv(rows);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="komdigi-staff-survey-results.csv"',
      "Cache-Control": "no-store",
    },
  });
}
