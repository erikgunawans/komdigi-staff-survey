export default function SubmittedState({ teamName, completionMode = "token" }) {
  const sourceLabel =
    completionMode === "account"
      ? "Akun kerja ini sudah dipakai untuk mengirim survei"
      : "Tautan ini sudah dipakai untuk mengirim survei";

  const followUp =
    completionMode === "account"
      ? "Jika Anda perlu revisi, minta admin membuka ulang akses akun Anda."
      : "Jika Anda perlu revisi, minta admin menerbitkan token baru.";

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
      <div style={{ maxWidth: 540, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#111827", marginBottom: 10 }}>
          Survei Sudah Terkirim
        </h1>
        <p style={{ fontSize: 18, color: "#4b5563", lineHeight: 1.7 }}>
          {sourceLabel}
          {teamName ? ` untuk tim ${teamName}` : ""}. {followUp}
        </p>
      </div>
    </div>
  );
}
