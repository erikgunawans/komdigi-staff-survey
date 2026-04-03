import { NextResponse } from "next/server";
import { clearAdminSession } from "../../../../lib/admin";

export async function POST(request) {
  await clearAdminSession();
  return NextResponse.redirect(new URL("/admin", request.url), 303);
}
