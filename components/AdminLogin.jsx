"use client";

import { signIn, signOut } from "next-auth/react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin({
  providers = [],
  currentEmail = "",
  hasWorkSession = false,
}) {
  const router = useRouter();
  const [accessKey, setAccessKey] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessKey }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error === "invalid-access-key" ? "Kunci akses admin tidak cocok." : "Login admin gagal.");
        return;
      }

      router.push("/admin");
      router.refresh();
    });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "rgba(255,255,255,0.88)",
          borderRadius: 28,
          padding: 32,
          boxShadow: "0 24px 80px rgba(15, 23, 42, 0.12)",
          backdropFilter: "blur(14px)",
        }}
      >
        <p style={{ margin: 0, color: "#0f766e", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Admin Dashboard
        </p>
        <h1 style={{ margin: "10px 0 12px", fontSize: 34, lineHeight: 1.1 }}>
          Lihat hasil survei tanpa ekspor manual
        </h1>
        <p style={{ margin: "0 0 24px", color: "#475569", lineHeight: 1.7 }}>
          Masukkan kunci akses admin untuk membuka ringkasan hasil, progres per tim, dan jawaban lengkap responden.
        </p>

        {hasWorkSession ? (
          <div
            style={{
              marginBottom: 24,
              padding: 18,
              borderRadius: 18,
              background: "#fff7ed",
              border: "1px solid #fed7aa",
            }}
          >
            <div style={{ fontWeight: 800, color: "#9a3412" }}>Sudah login, tapi belum bisa masuk admin</div>
            <p style={{ margin: "8px 0 0", color: "#7c2d12", lineHeight: 1.6 }}>
              Akun yang sedang terbaca sistem:
              {" "}
              <strong>{currentEmail || "email tidak terbaca"}</strong>.
              Jika ini bukan email super admin yang diizinkan, keluar dulu lalu masuk lagi dengan akun yang benar.
            </p>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/admin" })}
              style={{
                marginTop: 14,
                border: "1px solid #fdba74",
                borderRadius: 14,
                padding: "12px 14px",
                background: "#fff",
                color: "#9a3412",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Keluar dari akun ini
            </button>
          </div>
        ) : null}

        {providers.length ? (
          <div
            style={{
              marginBottom: 24,
              padding: 18,
              borderRadius: 18,
              background: "#f8fafc",
              border: "1px solid #dbe4f0",
            }}
          >
            <div style={{ fontWeight: 800, color: "#0f172a" }}>Masuk sebagai super admin</div>
            <p style={{ margin: "8px 0 0", color: "#475569", lineHeight: 1.6 }}>
              Jika email Anda masuk allowlist super admin, Anda bisa langsung buka dashboard tanpa mengetik kunci admin.
            </p>

            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => signIn(provider.id, { callbackUrl: "/admin" })}
                  style={{
                    border: "none",
                    borderRadius: 16,
                    padding: "14px 16px",
                    background: "#0f172a",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Masuk dengan {provider.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-access-key" style={{ display: "block", fontWeight: 700, marginBottom: 10 }}>
            Kunci akses admin
          </label>
          <input
            id="admin-access-key"
            type="password"
            value={accessKey}
            onChange={(event) => setAccessKey(event.target.value)}
            placeholder="Masukkan ADMIN_ACCESS_KEY"
            style={{
              width: "100%",
              borderRadius: 16,
              border: `2px solid ${error ? "#dc2626" : "#dbe4f0"}`,
              padding: "14px 16px",
              background: "#fff",
              outline: "none",
            }}
          />

          {error ? (
            <p style={{ color: "#dc2626", fontSize: 14, margin: "12px 0 0" }}>{error}</p>
          ) : (
            <p style={{ color: "#64748b", fontSize: 14, margin: "12px 0 0" }}>
              Tip: simpan kunci ini hanya untuk admin internal yang perlu melihat hasil survei.
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            style={{
              marginTop: 22,
              width: "100%",
              border: "none",
              borderRadius: 16,
              padding: "15px 18px",
              background: isPending ? "#94a3b8" : "#0f172a",
              color: "#fff",
              fontWeight: 700,
              cursor: isPending ? "wait" : "pointer",
            }}
          >
            {isPending ? "Memeriksa akses..." : "Masuk ke Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
