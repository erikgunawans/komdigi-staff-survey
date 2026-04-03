import { NextResponse } from "next/server";
import { isAdminConfigured, setAdminSession, verifyAdminAccessKey } from "../../../../lib/admin";

export async function POST(request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json({ error: "admin-not-configured" }, { status: 503 });
    }

    const { accessKey } = await request.json();

    if (!verifyAdminAccessKey(accessKey)) {
      return NextResponse.json({ error: "invalid-access-key" }, { status: 401 });
    }

    await setAdminSession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("admin login failed", error);
    return NextResponse.json({ error: "admin-login-failed" }, { status: 500 });
  }
}
