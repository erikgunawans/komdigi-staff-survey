"use client";

import { signIn } from "next-auth/react";

function getFriendlyAuthError(error) {
  if (error === "AccessDenied") {
    return "Akun Anda belum diizinkan untuk mengakses survei ini. Pastikan Anda memakai email kerja yang benar.";
  }

  if (error === "Configuration") {
    return "Login kantor belum selesai dikonfigurasi. Untuk sementara gunakan tautan token dari admin.";
  }

  return "";
}

export default function WorkSignIn({ providers, allowedDomains, error }) {
  const message = getFriendlyAuthError(error);

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
          maxWidth: 620,
          background: "rgba(255,255,255,0.88)",
          borderRadius: 30,
          padding: 34,
          boxShadow: "0 24px 80px rgba(15, 23, 42, 0.12)",
          backdropFilter: "blur(14px)",
        }}
      >
        <p style={{ margin: 0, color: "#0f766e", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Internal Staff Survey
        </p>
        <h1 style={{ margin: "10px 0 12px", fontSize: 36, lineHeight: 1.1 }}>
          Masuk dengan akun kerja Anda
        </h1>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>
          Anda tidak perlu menerima token manual lagi. Sistem akan memastikan satu akun kantor hanya
          bisa mengirim satu survei.
        </p>

        <div
          style={{
            marginTop: 20,
            background: "#f8fafc",
            borderRadius: 18,
            padding: 18,
            color: "#334155",
            lineHeight: 1.7,
          }}
        >
          Domain yang diizinkan: <strong>{allowedDomains.join(", ")}</strong>
        </div>

        {message ? (
          <p style={{ color: "#dc2626", fontSize: 14, margin: "16px 0 0", lineHeight: 1.6 }}>{message}</p>
        ) : null}

        <div style={{ display: "grid", gap: 12, marginTop: 22 }}>
          {providers.map((provider) => (
            <button
              key={provider.id}
              type="button"
              onClick={() => signIn(provider.id, { callbackUrl: "/survey" })}
              style={{
                border: "none",
                borderRadius: 18,
                padding: "16px 18px",
                background: "#0f172a",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Masuk dengan {provider.name}
            </button>
          ))}
        </div>

        <p style={{ margin: "18px 0 0", color: "#94a3b8", fontSize: 13, lineHeight: 1.6 }}>
          Jika login kantor belum aktif, admin masih bisa memakai flow token sementara sampai
          kredensial SSO selesai dikonfigurasi.
        </p>
      </div>
    </div>
  );
}
