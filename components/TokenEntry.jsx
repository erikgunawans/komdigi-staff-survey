"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

function getFriendlyError(message) {
  if (message === "invalid-token") {
    return "Tautan survei tidak valid atau sudah berubah. Cek kembali link yang Anda terima.";
  }

  if (message === "already-submitted") {
    return "Tautan ini sudah dipakai untuk mengirim survei. Jika ini keliru, minta token baru ke admin.";
  }

  if (message === "already-started") {
    return "Token ini sedang aktif di sesi lain. Lanjutkan dari browser yang sama atau tunggu sesi sebelumnya berakhir.";
  }

  return "Kami belum bisa memulai survei sekarang. Silakan coba lagi.";
}

export default function TokenEntry({ initialToken = "" }) {
  const router = useRouter();
  const [token, setToken] = useState(initialToken);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const hasAutoSubmitted = useRef(false);

  async function handleStart(rawToken) {
    setError("");

    const response = await fetch("/api/session/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: rawToken }),
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(getFriendlyError(payload.error));
      return;
    }

    router.push("/survey");
    router.refresh();
  }

  function submitCurrentToken() {
    if (!token.trim()) {
      setError("Masukkan token survei Anda terlebih dahulu.");
      return;
    }

    startTransition(() => {
      handleStart(token.trim());
    });
  }

  useEffect(() => {
    if (!initialToken || hasAutoSubmitted.current) {
      return;
    }

    hasAutoSubmitted.current = true;
    startTransition(() => {
      handleStart(initialToken.trim());
    });
  }, [initialToken]);

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
      <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
        <img
          src="/covers/cover-common.png"
          alt="Survei Staf Komdigi 2026"
          style={{
            width: "100%",
            maxWidth: 520,
            borderRadius: 18,
            boxShadow: "0 16px 40px rgba(15, 23, 42, 0.18)",
            margin: "0 auto 22px",
            display: "block",
          }}
        />
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔐</div>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "#111827",
            marginBottom: 10,
            lineHeight: 1.2,
          }}
        >
          Masuk ke Survei Staf
        </h1>
        <p style={{ fontSize: 18, color: "#4b5563", lineHeight: 1.7, marginBottom: 28 }}>
          Setiap tautan survei hanya bisa dipakai satu kali. Masukkan token Anda atau buka link
          undangan yang diberikan admin.
        </p>

        <a
          href="/questions"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 22,
            color: "#0f766e",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Lihat penjelasan lengkap pertanyaan survei
        </a>

        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "24px 28px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            marginBottom: 24,
            textAlign: "left",
          }}
        >
          <label
            htmlFor="survey-token"
            style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 10 }}
          >
            Token survei
          </label>
          <input
            id="survey-token"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Contoh: kdgm-7W2..."
            style={{
              width: "100%",
              borderRadius: 14,
              border: `2px solid ${error ? "#dc2626" : "#e5e7eb"}`,
              padding: "14px 16px",
              fontSize: 15,
              color: "#1f2937",
              outline: "none",
            }}
          />

          {error ? (
            <p style={{ color: "#dc2626", fontSize: 13, marginTop: 10, lineHeight: 1.6 }}>{error}</p>
          ) : (
            <p style={{ color: "#6b7280", fontSize: 13, marginTop: 10, lineHeight: 1.6 }}>
              Kami tidak meminta email. Token ini yang memastikan satu orang hanya mengirim sekali.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={submitCurrentToken}
          disabled={isPending}
          style={{
            background: isPending ? "#9ca3af" : "#111827",
            color: "#fff",
            padding: "16px 40px",
            borderRadius: 16,
            fontSize: 17,
            fontWeight: 700,
            border: "none",
            cursor: isPending ? "wait" : "pointer",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          }}
        >
          {isPending ? "Memeriksa token..." : "Masuk ke Survei →"}
        </button>

        <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 14 }}>
          Inisiatif Direktorat Penataan Spektrum · Komdigi
        </p>
      </div>
    </div>
  );
}
