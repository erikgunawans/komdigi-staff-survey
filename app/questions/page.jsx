import { COMMON_QS, SPECIFIC_QS, SUBDIRS } from "../../lib/questionnaire";
import { QUESTION_EXPLANATIONS } from "../../lib/question-explanations";

export const metadata = {
  title: "Penjelasan Pertanyaan Survei | Komdigi Staff Survey",
  description: "Halaman penjelasan untuk pimpinan dan stakeholder tentang tujuan setiap pertanyaan survei staf Komdigi dan bagaimana jawabannya akan digunakan.",
};

function HeaderPill({ children }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(148, 163, 184, 0.25)",
        color: "#0f766e",
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function ActionLink({ href, children, kind = "primary" }) {
  const palette =
    kind === "primary"
      ? { bg: "#0f172a", fg: "#fff", border: "#0f172a" }
      : { bg: "rgba(255,255,255,0.82)", fg: "#0f172a", border: "#cbd5e1" };

  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "14px 18px",
        borderRadius: 16,
        background: palette.bg,
        color: palette.fg,
        border: `1px solid ${palette.border}`,
        fontWeight: 700,
        textDecoration: "none",
      }}
    >
      {children}
    </a>
  );
}

function OverviewCard({ title, body, tone }) {
  const palette = {
    blue: { bg: "#eff6ff", border: "#bfdbfe", fg: "#1d4ed8" },
    amber: { bg: "#fff7ed", border: "#fed7aa", fg: "#c2410c" },
    green: { bg: "#ecfdf5", border: "#bbf7d0", fg: "#047857" },
  }[tone];

  return (
    <div
      style={{
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        borderRadius: 24,
        padding: 22,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 800, color: palette.fg }}>{title}</div>
      <p style={{ margin: "10px 0 0", color: "#334155", lineHeight: 1.7 }}>{body}</p>
    </div>
  );
}

function QuestionExplanationCard({ question, explanation, accent }) {
  return (
    <article
      style={{
        background: "#fff",
        borderRadius: 24,
        padding: 24,
        border: `1px solid ${accent}33`,
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 18,
            display: "grid",
            placeItems: "center",
            background: `${accent}18`,
            fontSize: 28,
            flexShrink: 0,
          }}
        >
          {question.emoji}
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, color: accent, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {question.id}
          </div>
          <h3 style={{ margin: "8px 0 0", fontSize: 20, lineHeight: 1.45, color: "#0f172a" }}>{question.q}</h3>
        </div>
      </div>

      <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
        <div
          style={{
            borderRadius: 18,
            background: "#f8fafc",
            padding: 16,
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Kenapa Ditanyakan
          </div>
          <p style={{ margin: "8px 0 0", color: "#334155", lineHeight: 1.75 }}>{explanation.why}</p>
        </div>

        <div
          style={{
            borderRadius: 18,
            background: "#f8fafc",
            padding: 16,
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Bagaimana Jawabannya Akan Dipakai
          </div>
          <p style={{ margin: "8px 0 0", color: "#334155", lineHeight: 1.75 }}>{explanation.use}</p>
        </div>
      </div>
    </article>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section style={{ marginTop: 34 }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontSize: 32, lineHeight: 1.15, color: "#0f172a" }}>{title}</h2>
        <p style={{ margin: "10px 0 0", color: "#475569", lineHeight: 1.7, maxWidth: 860 }}>{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

export default function QuestionsExplanationPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "40px 20px 80px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <HeaderPill>Komdigi Staff Survey Guide</HeaderPill>

        <div style={{ marginTop: 18, maxWidth: 920 }}>
          <h1 style={{ margin: 0, fontSize: 52, lineHeight: 1.04, color: "#0f172a" }}>
            Kenapa pertanyaan-pertanyaan ini ditanyakan, dan bagaimana jawabannya akan dipakai
          </h1>
          <p style={{ margin: "18px 0 0", fontSize: 18, lineHeight: 1.8, color: "#334155" }}>
            Halaman ini dibuat untuk pimpinan dan stakeholder internal agar dapat membaca survei staf
            sebagai alat diagnosis operasional, bukan sekadar formulir pengumpulan opini. Fokusnya adalah
            menemukan hambatan kerja harian, beban koordinasi, titik buta informasi, dan pekerjaan
            berulang yang layak disederhanakan atau diotomatisasi.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
          <ActionLink href="/">Kembali ke halaman utama</ActionLink>
          <ActionLink href="/admin" kind="secondary">
            Buka dashboard admin
          </ActionLink>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginTop: 26 }}>
          <OverviewCard
            title="Tujuan Survei"
            body="Mengukur bottleneck nyata dalam pekerjaan harian staf, terutama yang berhubungan dengan pencarian informasi, pelaporan, koordinasi lintas unit, dan tugas berulang."
            tone="blue"
          />
          <OverviewCard
            title="Cara Jawaban Dipakai"
            body="Jawaban dipakai untuk menentukan prioritas perbaikan proses, kebutuhan dashboard atau knowledge base, peluang otomasi, dan area koordinasi yang paling membutuhkan visibilitas bersama."
            tone="green"
          />
          <OverviewCard
            title="Yang Tidak Dilakukan"
            body="Survei ini tidak dimaksudkan untuk menilai kinerja personal. Tujuannya adalah membaca desain kerja dan sistem pendukung, bukan menilai individu."
            tone="amber"
          />
        </div>

        <Section
          title="Prinsip Interpretasi"
          subtitle="Agar hasil survei tidak disalahartikan, berikut konteks yang perlu dibaca bersama oleh pimpinan."
        >
          <div
            style={{
              background: "rgba(255,255,255,0.82)",
              borderRadius: 28,
              padding: 26,
              border: "1px solid #e2e8f0",
              display: "grid",
              gap: 12,
              color: "#334155",
              lineHeight: 1.8,
            }}
          >
            <div><strong style={{ color: "#0f172a" }}>1.</strong> Jawaban lambat atau sulit biasanya menunjukkan masalah visibilitas informasi, bukan kurangnya komitmen staf.</div>
            <div><strong style={{ color: "#0f172a" }}>2.</strong> Pertanyaan terbuka dipakai untuk menemukan rasa sakit operasional yang sering tidak tertangkap dalam skala angka.</div>
            <div><strong style={{ color: "#0f172a" }}>3.</strong> Nilai tertinggi dari survei ini muncul saat jawaban dipadukan dengan keputusan tindak lanjut yang jelas: apa yang dihilangkan, dipusatkan, atau diotomatisasi.</div>
            <div><strong style={{ color: "#0f172a" }}>4.</strong> Hasil paling kuat biasanya bukan satu jawaban tunggal, melainkan pola yang berulang antar tim.</div>
          </div>
        </Section>

        <Section
          title="Pertanyaan Umum untuk Semua Tim"
          subtitle="Lima pertanyaan ini dipakai untuk membangun baseline lintas sub-direktorat tentang kecepatan respons, beban pelaporan, akses dokumen, koordinasi, dan pekerjaan yang paling terasa tidak bernilai."
        >
          <div style={{ display: "grid", gap: 16 }}>
            {COMMON_QS.map((question) => (
              <QuestionExplanationCard
                key={question.id}
                question={question}
                explanation={QUESTION_EXPLANATIONS[question.id]}
                accent="#0f766e"
              />
            ))}
          </div>
        </Section>

        {SUBDIRS.map((team) => (
          <Section
            key={team.id}
            title={`${team.emoji} ${team.name}`}
            subtitle={`Pertanyaan khusus untuk ${team.name} dirancang untuk membaca bottleneck yang khas pada domain kerja ini. Jawaban-jawabannya akan dipakai untuk menilai di mana sistem informasi, template kerja, atau monitoring status perlu diperkuat.`}
          >
            <div style={{ display: "grid", gap: 16 }}>
              {(SPECIFIC_QS[team.id] ?? []).map((question) => (
                <QuestionExplanationCard
                  key={question.id}
                  question={question}
                  explanation={QUESTION_EXPLANATIONS[question.id]}
                  accent={team.color}
                />
              ))}
            </div>
          </Section>
        ))}

        <Section
          title="Output yang Diharapkan Setelah Survei"
          subtitle="Halaman ini juga menjelaskan bagaimana jawaban seharusnya diterjemahkan menjadi keputusan nyata."
        >
          <div
            style={{
              background: "rgba(255,255,255,0.82)",
              borderRadius: 28,
              padding: 26,
              border: "1px solid #e2e8f0",
              display: "grid",
              gap: 12,
              color: "#334155",
              lineHeight: 1.8,
            }}
          >
            <div>Prioritas perbaikan proses harian yang paling membuang waktu staf.</div>
            <div>Daftar kebutuhan visibilitas data atau status untuk pimpinan dan lintas tim.</div>
            <div>Kandidat pekerjaan yang paling layak diotomatisasi atau disederhanakan lebih dulu.</div>
            <div>Ringkasan bottleneck per tim untuk dasar diskusi lanjutan dengan pimpinan unit.</div>
          </div>
        </Section>

        <Section
          title="Cara Membaca Hasil dengan Bijak"
          subtitle="Untuk pimpinan, bagian terpenting setelah membaca dashboard adalah mengubah pola jawaban menjadi keputusan yang adil dan operasional."
        >
          <div
            style={{
              background: "rgba(255,255,255,0.82)",
              borderRadius: 28,
              padding: 26,
              border: "1px solid #e2e8f0",
              display: "grid",
              gap: 12,
              color: "#334155",
              lineHeight: 1.8,
            }}
          >
            <div>Gunakan jawaban untuk membaca masalah sistem, bukan untuk menilai individu secara terpisah.</div>
            <div>Lihat pola lintas tim lebih dulu, lalu dalami jawaban terbuka untuk memahami akar masalahnya.</div>
            <div>Ambil 2-3 bottleneck paling sering muncul sebagai prioritas awal agar tindak lanjut terasa nyata.</div>
            <div>Komunikasikan kembali hasil dan rencana perbaikannya supaya staf melihat bahwa survei benar-benar dipakai.</div>
          </div>
        </Section>
      </div>
    </main>
  );
}
