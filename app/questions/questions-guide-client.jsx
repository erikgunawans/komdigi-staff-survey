"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { COMMON_QS, SPECIFIC_QS, SUBDIRS } from "../../lib/questionnaire";
import { QUESTION_EXPLANATIONS } from "../../lib/question-explanations";

function buildGroups() {
  return [
    {
      id: "umum",
      label: "Pertanyaan umum",
      emoji: "📋",
      accent: "#0f766e",
      questions: COMMON_QS,
    },
    ...SUBDIRS.map((t) => ({
      id: t.id,
      label: t.name,
      emoji: t.emoji,
      accent: t.color,
      questions: SPECIFIC_QS[t.id] ?? [],
    })),
  ];
}

const PRINSIP_ITEMS = [
  "Jawaban lambat atau sulit biasanya menunjukkan masalah visibilitas informasi, bukan kurangnya komitmen staf.",
  "Pertanyaan terbuka dipakai untuk menemukan rasa sakit operasional yang sering tidak tertangkap dalam skala angka.",
  "Nilai tertinggi dari survei ini muncul saat jawaban dipadukan dengan keputusan tindak lanjut yang jelas: apa yang dihilangkan, dipusatkan, atau diotomatisasi.",
  "Hasil paling kuat biasanya bukan satu jawaban tunggal, melainkan pola yang berulang antar tim.",
];

const OUTPUT_ITEMS = [
  "Prioritas perbaikan proses harian yang paling membuang waktu staf.",
  "Daftar kebutuhan visibilitas data atau status untuk pimpinan dan lintas tim.",
  "Kandidat pekerjaan yang paling layak diotomatisasi atau disederhanakan lebih dulu.",
  "Ringkasan bottleneck per tim untuk dasar diskusi lanjutan dengan pimpinan unit.",
];

const BACA_HASIL_ITEMS = [
  "Gunakan jawaban untuk membaca masalah sistem, bukan untuk menilai individu secara terpisah.",
  "Lihat pola lintas tim lebih dulu, lalu dalami jawaban terbuka untuk memahami akar masalahnya.",
  "Ambil 2–3 bottleneck paling sering muncul sebagai prioritas awal agar tindak lanjut terasa nyata.",
  "Komunikasikan kembali hasil dan rencana perbaikannya supaya staf melihat bahwa survei benar-benar dipakai.",
];

export default function QuestionsGuideClient() {
  const groups = useMemo(() => buildGroups(), []);
  const [view, setView] = useState("browse"); // browse | context
  const [groupFilter, setGroupFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [explainTab, setExplainTab] = useState("why"); // why | use
  const [openAccordion, setOpenAccordion] = useState(null);

  const flatIndex = useMemo(() => {
    const list = [];
    for (const g of groups) {
      for (const q of g.questions) {
        list.push({ group: g, question: q });
      }
    }
    return list;
  }, [groups]);

  const filteredFlat = useMemo(() => {
    const q = query.trim().toLowerCase();
    return flatIndex.filter(({ group, question }) => {
      if (groupFilter !== "all" && group.id !== groupFilter) return false;
      if (!q) return true;
      const exp = QUESTION_EXPLANATIONS[question.id];
      const hay = [
        question.q,
        question.id,
        exp?.why,
        exp?.use,
        group.label,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [flatIndex, groupFilter, query]);

  const selectedEntry = useMemo(() => {
    if (!selectedId) return null;
    return flatIndex.find((e) => e.question.id === selectedId) ?? null;
  }, [flatIndex, selectedId]);

  const selectedPos = useMemo(() => {
    if (!selectedId) return -1;
    return filteredFlat.findIndex((e) => e.question.id === selectedId);
  }, [filteredFlat, selectedId]);

  const goPrev = useCallback(() => {
    if (selectedPos <= 0) return;
    setSelectedId(filteredFlat[selectedPos - 1].question.id);
    setExplainTab("why");
  }, [filteredFlat, selectedPos]);

  const goNext = useCallback(() => {
    if (selectedPos < 0 || selectedPos >= filteredFlat.length - 1) return;
    setSelectedId(filteredFlat[selectedPos + 1].question.id);
    setExplainTab("why");
  }, [filteredFlat, selectedPos]);

  useEffect(() => {
    if (view !== "browse" || !selectedId) return;
    const onKey = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, selectedId, goPrev, goNext]);

  const totalInFilter = filteredFlat.length;

  return (
    <main
      className="qg-main"
      style={{
        minHeight: "100vh",
        padding: "24px 16px 48px",
        background: "linear-gradient(165deg, #f0fdfa 0%, #f8fafc 45%, #f1f5f9 100%)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <header style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(148, 163, 184, 0.3)",
              color: "#0f766e",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Komdigi Staff Survey Guide
          </div>
          <h1
            style={{
              margin: "14px 0 0",
              fontSize: "clamp(1.35rem, 4vw, 2rem)",
              lineHeight: 1.2,
              color: "#0f172a",
              fontWeight: 800,
            }}
          >
            Kenapa ditanyakan &amp; bagaimana jawaban dipakai
          </h1>
          <p style={{ margin: "10px 0 0", fontSize: 15, color: "#475569", lineHeight: 1.65, maxWidth: 640 }}>
            Jelajahi per pertanyaan—tanpa scroll panjang. Gunakan pencarian atau langkah berikutnya.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "10px 16px",
                borderRadius: 12,
                background: "#0f172a",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              ← Halaman utama
            </a>
            <a
              href="/admin"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "10px 16px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.9)",
                color: "#0f172a",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                border: "1px solid #cbd5e1",
              }}
            >
              Dashboard admin
            </a>
          </div>
        </header>

        {/* View switcher */}
        <div
          role="tablist"
          aria-label="Mode panduan"
          style={{
            display: "flex",
            gap: 8,
            padding: 6,
            borderRadius: 16,
            background: "rgba(255,255,255,0.75)",
            border: "1px solid #e2e8f0",
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          {[
            { id: "browse", label: "Jelajahi pertanyaan" },
            { id: "context", label: "Konteks survei" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={view === t.id}
              onClick={() => setView(t.id)}
              style={{
                flex: "1 1 140px",
                padding: "12px 14px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                fontWeight: 800,
                fontSize: 14,
                background: view === t.id ? "#0f766e" : "transparent",
                color: view === t.id ? "#fff" : "#475569",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {view === "context" ? (
          <ContextAccordions openKey={openAccordion} onToggle={(key) => setOpenAccordion((prev) => (prev === key ? null : key))} />
        ) : (
          <div
            className="qg-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.15fr)",
              gap: 16,
              alignItems: "start",
            }}
          >
            {/* Left: filters + list */}
            <div
              style={{
                background: "rgba(255,255,255,0.92)",
                borderRadius: 20,
                border: "1px solid #e2e8f0",
                padding: 16,
                position: "sticky",
                top: 12,
                maxHeight: "min(78vh, 720px)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
              className="qg-panel-left qg-sticky-panel"
            >
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Cari pertanyaan atau penjelasan
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ketik kata kunci…"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1px solid #cbd5e1",
                    fontSize: 15,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </label>

              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                  Filter tim
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <Chip active={groupFilter === "all"} onClick={() => setGroupFilter("all")}>
                    Semua
                  </Chip>
                  {groups.map((g) => (
                    <Chip key={g.id} active={groupFilter === g.id} onClick={() => setGroupFilter(g.id)}>
                      {g.emoji} {g.id === "umum" ? "Umum" : g.id}
                    </Chip>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>
                {totalInFilter} pertanyaan{query.trim() ? " cocok" : ""}
              </div>

              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  overflowY: "auto",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {filteredFlat.length === 0 ? (
                  <li style={{ padding: 16, color: "#64748b", textAlign: "center" }}>Tidak ada yang cocok. Ubah pencarian atau filter.</li>
                ) : (
                  filteredFlat.map(({ group, question }) => {
                    const active = selectedId === question.id;
                    return (
                      <li key={question.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedId(question.id);
                            setExplainTab("why");
                          }}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "10px 12px",
                            borderRadius: 12,
                            border: active ? `2px solid ${group.accent}` : "1px solid #e2e8f0",
                            background: active ? `${group.accent}12` : "#fff",
                            cursor: "pointer",
                            display: "grid",
                            gap: 4,
                          }}
                        >
                          <span style={{ fontSize: 11, fontWeight: 800, color: group.accent }}>
                            {group.emoji} {question.id}
                          </span>
                          <span
                            style={{
                              fontSize: 13,
                              color: "#0f172a",
                              lineHeight: 1.45,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {question.q}
                          </span>
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>

            {/* Right: detail */}
            <div
              style={{
                background: "rgba(255,255,255,0.95)",
                borderRadius: 20,
                border: "1px solid #e2e8f0",
                padding: 20,
                minHeight: 320,
                boxShadow: "0 12px 40px rgba(15, 23, 42, 0.06)",
              }}
              className="qg-panel-right"
            >
              {!selectedEntry ? (
                <div style={{ padding: "32px 16px", textAlign: "center", color: "#64748b", lineHeight: 1.7 }}>
                  <div style={{ fontSize: 44, marginBottom: 12 }}>👈</div>
                  <strong style={{ color: "#0f172a" }}>Pilih satu pertanyaan</strong> di daftar untuk melihat teks lengkap, alasan survei, dan pemakaian jawaban.
                  <p style={{ marginTop: 16, fontSize: 14 }}>
                    Tip: setelah memilih pertanyaan, pakai tombol di bawah atau tombol panah{" "}
                    <kbd style={{ padding: "2px 6px", borderRadius: 6, background: "#f1f5f9" }}>←</kbd>{" "}
                    <kbd style={{ padding: "2px 6px", borderRadius: 6, background: "#f1f5f9" }}>→</kbd> di keyboard (kecuali sedang mengetik di kotak cari).
                  </p>
                </div>
              ) : (
                <QuestionDetail
                  entry={selectedEntry}
                  explainTab={explainTab}
                  setExplainTab={setExplainTab}
                  onPrev={goPrev}
                  onNext={goNext}
                  canPrev={selectedPos > 0}
                  canNext={selectedPos >= 0 && selectedPos < filteredFlat.length - 1}
                  indexLabel={`${selectedPos + 1} / ${filteredFlat.length}`}
                />
              )}
            </div>
          </div>
        )}
      </div>

    </main>
  );
}

function Chip({ children, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "8px 12px",
        borderRadius: 999,
        border: active ? "2px solid #0f766e" : "1px solid #e2e8f0",
        background: active ? "#ccfbf1" : "#fff",
        fontSize: 12,
        fontWeight: 700,
        color: active ? "#0f766e" : "#475569",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function QuestionDetail({ entry, explainTab, setExplainTab, onPrev, onNext, canPrev, canNext, indexLabel }) {
  const { group, question } = entry;
  const exp = QUESTION_EXPLANATIONS[question.id];
  if (!exp) return null;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", minWidth: 0 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              display: "grid",
              placeItems: "center",
              background: `${group.accent}22`,
              fontSize: 26,
              flexShrink: 0,
            }}
          >
            {question.emoji}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: group.accent, letterSpacing: "0.06em" }}>{question.id}</div>
            <h2 style={{ margin: "6px 0 0", fontSize: "clamp(1rem, 2.5vw, 1.2rem)", lineHeight: 1.45, color: "#0f172a" }}>{question.q}</h2>
            <div style={{ marginTop: 8, fontSize: 13, color: "#64748b", fontWeight: 600 }}>
              {group.emoji} {group.label}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.04em" }}>{indexLabel}</div>
      </div>

      <div
        role="tablist"
        aria-label="Penjelasan"
        style={{ display: "flex", gap: 8, marginTop: 20, padding: 4, background: "#f1f5f9", borderRadius: 14 }}
      >
        {[
          { id: "why", label: "Kenapa ditanyakan" },
          { id: "use", label: "Bagaimana dipakai" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={explainTab === t.id}
            onClick={() => setExplainTab(t.id)}
            style={{
              flex: 1,
              padding: "12px 10px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontWeight: 800,
              fontSize: 13,
              background: explainTab === t.id ? "#fff" : "transparent",
              color: explainTab === t.id ? "#0f172a" : "#64748b",
              boxShadow: explainTab === t.id ? "0 2px 8px rgba(15,23,42,0.08)" : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        style={{
          marginTop: 16,
          padding: 18,
          borderRadius: 16,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          color: "#334155",
          lineHeight: 1.75,
          fontSize: 15,
          minHeight: 120,
        }}
      >
        {explainTab === "why" ? exp.why : exp.use}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          style={{
            padding: "12px 18px",
            borderRadius: 12,
            border: "1px solid #cbd5e1",
            background: canPrev ? "#fff" : "#f1f5f9",
            color: canPrev ? "#0f172a" : "#94a3b8",
            fontWeight: 700,
            cursor: canPrev ? "pointer" : "not-allowed",
          }}
        >
          ← Sebelumnya
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          style={{
            padding: "12px 18px",
            borderRadius: 12,
            border: "none",
            background: canNext ? group.accent : "#e2e8f0",
            color: canNext ? "#fff" : "#94a3b8",
            fontWeight: 700,
            cursor: canNext ? "pointer" : "not-allowed",
          }}
        >
          Berikutnya →
        </button>
      </div>
    </div>
  );
}

function ContextAccordions({ openKey, onToggle }) {
  const items = [
    {
      key: "tujuan",
      title: "Tujuan survei",
      body: "Mengukur bottleneck nyata dalam pekerjaan harian staf, terutama yang berhubungan dengan pencarian informasi, pelaporan, koordinasi lintas unit, dan tugas berulang.",
      tone: "blue",
    },
    {
      key: "pakai",
      title: "Cara jawaban dipakai",
      body: "Jawaban dipakai untuk menentukan prioritas perbaikan proses, kebutuhan dashboard atau knowledge base, peluang otomasi, dan area koordinasi yang paling membutuhkan visibilitas bersama.",
      tone: "green",
    },
    {
      key: "bukan",
      title: "Yang tidak dilakukan",
      body: "Survei ini tidak dimaksudkan untuk menilai kinerja personal. Tujuannya adalah membaca desain kerja dan sistem pendukung, bukan menilai individu.",
      tone: "amber",
    },
    {
      key: "prinsip",
      title: "Prinsip interpretasi",
      body: null,
      list: PRINSIP_ITEMS,
    },
    {
      key: "output",
      title: "Output yang diharapkan",
      body: null,
      list: OUTPUT_ITEMS,
    },
    {
      key: "baca",
      title: "Cara membaca hasil dengan bijak",
      body: null,
      list: BACA_HASIL_ITEMS,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <p style={{ margin: "0 0 8px", color: "#475569", fontSize: 15, lineHeight: 1.65 }}>
        Buka satu bagian pada satu waktu—survei ini adalah alat diagnosis operasional, bukan sekadar formulir opini.
      </p>
      {items.map((item) => {
        const open = openKey === item.key;
        return (
          <div
            key={item.key}
            style={{
              borderRadius: 18,
              border: "1px solid #e2e8f0",
              background: "rgba(255,255,255,0.95)",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => onToggle(item.key)}
              aria-expanded={open}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "16px 18px",
                border: "none",
                background: open ? "#f8fafc" : "#fff",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>{item.title}</span>
              <span style={{ fontSize: 18, color: "#64748b", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                ▼
              </span>
            </button>
            {open && (
              <div style={{ padding: "0 18px 18px", color: "#334155", lineHeight: 1.75, fontSize: 15 }}>
                {item.body && <p style={{ margin: 0 }}>{item.body}</p>}
                {item.list && (
                  <ol style={{ margin: 0, paddingLeft: 20 }}>
                    {item.list.map((line, i) => (
                      <li key={i} style={{ marginTop: i ? 10 : 0 }}>
                        {line}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
