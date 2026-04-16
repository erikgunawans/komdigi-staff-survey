import { isAdminAuthenticated, isAdminConfigured } from "../../lib/admin";
import { listSurveyExportRows } from "../../lib/repository";
import { buildSurveyDataset } from "../../lib/reporting";
import AdminLogin from "../../components/AdminLogin";
import AdminDashboard from "../../components/AdminDashboard";
import { getAuthSession, getWorkProviderButtons } from "../../lib/auth";
import { getHealthSnapshot } from "../../lib/health";
import { isWorkAuthEnabled } from "../../lib/work-auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const configured = isAdminConfigured();

  if (!configured) {
    return (
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "72px 24px" }}>
        <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 30, padding: 32, boxShadow: "0 20px 80px rgba(15, 23, 42, 0.12)" }}>
          <p style={{ margin: 0, color: "#b45309", fontWeight: 700 }}>Admin belum diaktifkan</p>
          <h1 style={{ margin: "10px 0 12px", fontSize: 34 }}>Tambahkan `ADMIN_ACCESS_KEY` dulu</h1>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>
            Dashboard admin butuh satu environment variable tambahan agar hasil survei tidak terbuka ke publik.
            Setelah `ADMIN_ACCESS_KEY` ditambahkan dan app dideploy ulang, buka lagi `/admin`.
          </p>
        </div>
      </main>
    );
  }

  const authSession = await getAuthSession();
  const authenticated = await isAdminAuthenticated();

  console.info("admin.page", {
    authenticated,
    email: authSession?.user?.email ?? null,
    authSubject: authSession?.user?.authSubject ?? null,
    isSuperAdmin: Boolean(authSession?.user?.isSuperAdmin),
  });

  if (!authenticated) {
    return (
      <AdminLogin
        providers={isWorkAuthEnabled() ? getWorkProviderButtons() : []}
        currentEmail={authSession?.user?.email ?? ""}
        hasWorkSession={Boolean(authSession?.user?.authSubject)}
      />
    );
  }

  const rows = await listSurveyExportRows();
  const { entries, summary } = buildSurveyDataset(rows);
  const health = await getHealthSnapshot();

  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 20px 72px" }}>
      <div
        style={{
          background: "rgba(255,255,255,0.82)",
          borderRadius: 30,
          padding: 28,
          boxShadow: "0 24px 80px rgba(15, 23, 42, 0.12)",
          backdropFilter: "blur(14px)",
        }}
      >
        <img
          src="/covers/cover-common.png"
          alt="Survei Staf Komdigi 2026"
          style={{
            width: "100%",
            maxWidth: 560,
            borderRadius: 18,
            boxShadow: "0 16px 40px rgba(15, 23, 42, 0.18)",
            marginBottom: 24,
            display: "block",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <p style={{ margin: 0, color: "#0f766e", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Komdigi Survey Admin
            </p>
            <h1 style={{ margin: "10px 0 8px", fontSize: 36, lineHeight: 1.1 }}>Dashboard hasil survei staf</h1>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>
              Pantau progres pengisian, baca jawaban lengkap, dan unduh data final kapan saja.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="/questions?from=%2Fadmin"
              style={{
                textDecoration: "none",
                background: "#ecfeff",
                color: "#0f766e",
                border: "1px solid #99f6e4",
                borderRadius: 16,
                padding: "14px 18px",
                fontWeight: 700,
              }}
            >
              Komdigi Staff Survey Guide
            </a>
            <a
              href="/api/admin/export"
              style={{
                textDecoration: "none",
                background: "#0f172a",
                color: "#fff",
                borderRadius: 16,
                padding: "14px 18px",
                fontWeight: 700,
              }}
            >
              Unduh CSV Hasil
            </a>
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                style={{
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  color: "#0f172a",
                  borderRadius: 16,
                  padding: "14px 18px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Keluar
              </button>
            </form>
          </div>
        </div>

        <AdminDashboard entries={entries} summary={summary} health={health} />
      </div>
    </main>
  );
}
