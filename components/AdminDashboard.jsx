"use client";

import { useDeferredValue, useState } from "react";

function formatDate(value) {
  if (!value) {
    return "Belum ada";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatMetric(value, suffix = "") {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "Belum ada";
  }

  return `${value.toFixed(1)}${suffix}`;
}

function SummaryCard({ label, value, tone, detail }) {
  const palette = {
    slate: { bg: "#f8fafc", fg: "#0f172a" },
    green: { bg: "#ecfdf5", fg: "#065f46" },
    amber: { bg: "#fff7ed", fg: "#9a3412" },
    blue: { bg: "#eff6ff", fg: "#1d4ed8" },
    rose: { bg: "#fff1f2", fg: "#be123c" },
    teal: { bg: "#f0fdfa", fg: "#0f766e" },
  }[tone];

  return (
    <div
      style={{
        background: palette.bg,
        color: palette.fg,
        borderRadius: 22,
        padding: 22,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          opacity: 0.82,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </div>
      <div style={{ marginTop: 10, fontSize: 36, fontWeight: 800 }}>{value}</div>
      {detail ? <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6, opacity: 0.82 }}>{detail}</div> : null}
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <section
      style={{
        background: "#fff",
        borderRadius: 26,
        padding: 24,
        border: "1px solid #e2e8f0",
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontSize: 24 }}>{title}</h2>
        {subtitle ? <p style={{ margin: "8px 0 0", color: "#64748b", lineHeight: 1.6 }}>{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function MetricPill({ label, value, tone = "slate" }) {
  const palette = {
    slate: { bg: "#f8fafc", fg: "#0f172a" },
    blue: { bg: "#eff6ff", fg: "#1d4ed8" },
    green: { bg: "#ecfdf5", fg: "#047857" },
    amber: { bg: "#fff7ed", fg: "#b45309" },
    rose: { bg: "#fff1f2", fg: "#be123c" },
  }[tone];

  return (
    <div
      style={{
        background: palette.bg,
        color: palette.fg,
        borderRadius: 16,
        padding: "12px 14px",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.78 }}>
        {label}
      </div>
      <div style={{ marginTop: 6, fontSize: 22, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function HorizontalBars({ items, color }) {
  const maxCount = Math.max(...items.map((item) => item.count), 1);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {items.map((item) => (
        <div key={item.label}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14, marginBottom: 6 }}>
            <span style={{ color: "#334155" }}>{item.label}</span>
            <strong style={{ color: "#0f172a" }}>{item.count}</strong>
          </div>
          <div style={{ height: 10, background: "#e2e8f0", borderRadius: 9999, overflow: "hidden" }}>
            <div
              style={{
                width: `${(item.count / maxCount) * 100}%`,
                height: "100%",
                background: color,
                borderRadius: 9999,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function SparkBars({ items, color }) {
  const maxCount = Math.max(...items.map((item) => item.count), 1);

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length || 1}, minmax(0, 1fr))`, gap: 10, alignItems: "end", minHeight: 180 }}>
      {items.map((item) => (
        <div key={item.date} style={{ display: "flex", flexDirection: "column", justifyContent: "end", gap: 8, minWidth: 0 }}>
          <div
            style={{
              height: `${Math.max((item.count / maxCount) * 130, item.count ? 18 : 8)}px`,
              background: color,
              borderRadius: "14px 14px 6px 6px",
            }}
          />
          <div style={{ fontSize: 12, color: "#64748b", textAlign: "center" }}>{item.label}</div>
          <div style={{ fontSize: 12, fontWeight: 700, textAlign: "center", color: "#0f172a" }}>{item.count}</div>
        </div>
      ))}
    </div>
  );
}

function matchesSearch(entry, query) {
  if (!query) {
    return true;
  }

  const haystacks = [
    entry.inviteId,
    entry.identityEmail,
    entry.identityName,
    entry.identityProvider,
    entry.team,
    entry.teamMeta?.name ?? "",
    entry.status,
    ...entry.questionItems.flatMap((item) => [item.prompt, item.answerText]),
  ];

  return haystacks.some((value) => String(value).toLowerCase().includes(query));
}

export default function AdminDashboard({ entries, summary }) {
  const [teamFilter, setTeamFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredEntries = entries.filter((entry) => {
    const matchesTeam = teamFilter === "all" || entry.team === teamFilter;
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
    return matchesTeam && matchesStatus && matchesSearch(entry, deferredQuery);
  });

  const urgencyInsight = summary.questionInsights.find((item) => item.id === "c1");
  const hoursInsight = summary.questionInsights.find((item) => item.id === "c2");
  const accessInsight = summary.questionInsights.find((item) => item.id === "c4");

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          marginTop: 26,
        }}
      >
        <SummaryCard label="Total Invite" value={summary.totalInvites} tone="slate" />
        <SummaryCard label="Sudah Submit" value={summary.totalResponses} tone="green" />
        <SummaryCard label="Sedang Berjalan" value={summary.totalInProgress} tone="amber" />
        <SummaryCard label="Belum Dipakai" value={summary.totalUnused} tone="blue" />
        <SummaryCard label="Completion Rate" value={`${summary.completionRate}%`} tone="teal" detail="Proporsi invite yang benar-benar selesai." />
        <SummaryCard
          label="Jam Laporan / Minggu"
          value={summary.avgWeeklyHours ? `${summary.avgWeeklyHours.toFixed(1)} jam` : "Belum ada"}
          tone="rose"
          detail="Rata-rata dari pertanyaan pekerjaan berulang."
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16, marginTop: 24 }}>
        <SectionCard title="Pulse Utama" subtitle="Tiga metrik yang cepat dibaca pimpinan sebelum masuk ke jawaban detail.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            {summary.insightCards.map((card, index) => (
              <MetricPill
                key={card.id}
                label={card.label}
                value={card.value}
                tone={index === 0 ? "blue" : index === 1 ? "rose" : "green"}
              />
            ))}
          </div>

          <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
            <div style={{ color: "#475569", lineHeight: 1.7 }}>
              Aktivasi survei: <strong style={{ color: "#0f172a" }}>{summary.activationRate}%</strong> invite sudah dipakai minimal sekali.
            </div>
            <div style={{ color: "#475569", lineHeight: 1.7 }}>
              Pengiriman terakhir: <strong style={{ color: "#0f172a" }}>{summary.latestSubmission ? formatDate(summary.latestSubmission) : "Belum ada"}</strong>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Metode Masuk" subtitle="Lihat apakah responden lebih banyak masuk via token atau akun kerja.">
          <HorizontalBars items={summary.providerBreakdown} color="#0f766e" />
        </SectionCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <SectionCard
          title="Tren Respons"
          subtitle="Volume submission per hari. Berguna buat lihat kapan kampanye reminder perlu dikirim."
        >
          {summary.responseTrend.length ? (
            <SparkBars items={summary.responseTrend} color="#2563eb" />
          ) : (
            <div style={{ color: "#64748b" }}>Belum ada submission untuk divisualisasikan.</div>
          )}
        </SectionCard>

        <SectionCard
          title="Friction Saat Diminta Jawaban Dadakan"
          subtitle="Distribusi dari pertanyaan skenario Senin pagi. Ini biasanya paling cepat menjelaskan rasa sakit operasional."
        >
          {summary.urgencyBreakdown.some((item) => item.count > 0) ? (
            <HorizontalBars items={summary.urgencyBreakdown} color="#d97706" />
          ) : (
            <div style={{ color: "#64748b" }}>Belum ada jawaban cukup untuk membaca polanya.</div>
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="Analisis Per Tim"
        subtitle="Bukan cuma siapa yang submit, tapi tim mana yang paling berat beban laporannya dan paling sulit akses info lintas unit."
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          {summary.byTeam.map((team) => (
            <div
              key={team.id}
              style={{
                background: team.light,
                borderRadius: 22,
                padding: 20,
                border: `1px solid ${team.color}22`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
                <div>
                  <div style={{ fontSize: 28 }}>{team.emoji}</div>
                  <div style={{ marginTop: 8, fontWeight: 800, fontSize: 18 }}>{team.name}</div>
                  <div style={{ marginTop: 4, color: "#475569", fontSize: 14 }}>{team.tagline}</div>
                </div>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 999,
                    padding: "8px 12px",
                    fontWeight: 800,
                    color: team.color,
                  }}
                >
                  {team.completionRate}%
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, marginTop: 14 }}>
                <MetricPill label="Submit" value={`${team.submitted}/${team.total || 0}`} tone="green" />
                <MetricPill label="In Progress" value={`${team.inProgress}`} tone="amber" />
                <MetricPill label="Jam Laporan" value={formatMetric(team.avgWeeklyHours, " jam")} tone="rose" />
                <MetricPill label="Akses Info" value={formatMetric(team.avgAccessScore, " / 5")} tone="blue" />
              </div>

              <div style={{ marginTop: 14, color: "#475569", fontSize: 14, lineHeight: 1.7 }}>
                Submission terakhir: <strong style={{ color: "#0f172a" }}>{team.latestSubmission ? formatDate(team.latestSubmission) : "Belum ada"}</strong>
              </div>

              {team.highlight ? (
                <div
                  style={{
                    marginTop: 14,
                    padding: 14,
                    borderRadius: 16,
                    background: "#fff",
                    color: "#334155",
                    lineHeight: 1.7,
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: team.color }}>
                    Highlight
                  </div>
                  <div style={{ marginTop: 8, fontWeight: 700 }}>{team.highlightPrompt}</div>
                  <div style={{ marginTop: 8 }}>{team.highlight}</div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </SectionCard>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 16 }}>
        <SectionCard title="Jam Kerja Berulang" subtitle="Rata-rata jam per minggu yang habis buat rekap atau laporan berulang.">
          <div style={{ fontSize: 40, fontWeight: 800, color: "#be123c" }}>
            {summary.avgWeeklyHours ? `${summary.avgWeeklyHours.toFixed(1)} jam` : "Belum ada"}
          </div>
          <p style={{ margin: "10px 0 0", color: "#475569", lineHeight: 1.7 }}>
            {hoursInsight?.responseCount
              ? `${hoursInsight.responseCount} responden sudah menjawab pertanyaan ini.`
              : "Belum ada responden yang menjawab metrik ini."}
          </p>
        </SectionCard>

        <SectionCard title="Akses Lintas Tim" subtitle="Skor rata-rata kemudahan mendapat informasi dari tim lain.">
          <div style={{ fontSize: 40, fontWeight: 800, color: "#0284c7" }}>
            {summary.avgAccessScore ? `${summary.avgAccessScore.toFixed(1)} / 5` : "Belum ada"}
          </div>
          <p style={{ margin: "10px 0 0", color: "#475569", lineHeight: 1.7 }}>
            {accessInsight?.topChoiceLabel
              ? `Pilihan paling dominan saat ini: ${accessInsight.topChoiceLabel}.`
              : "Belum ada distribusi yang cukup untuk dibaca."}
          </p>
        </SectionCard>

        <SectionCard title="Bottleneck Teratas" subtitle="Opsi skenario yang paling sering dipilih pada pertanyaan dadakan Direktur.">
          <div style={{ fontSize: 22, fontWeight: 800, color: "#b45309", lineHeight: 1.4 }}>
            {urgencyInsight?.topChoiceLabel || "Belum ada"}
          </div>
          <p style={{ margin: "10px 0 0", color: "#475569", lineHeight: 1.7 }}>
            {urgencyInsight?.topChoiceCount
              ? `Dipilih oleh ${urgencyInsight.topChoiceCount} responden.`
              : "Belum ada pola mayoritas."}
          </p>
        </SectionCard>
      </div>

      <SectionCard
        title="Jawaban Terbuka yang Perlu Dibaca"
        subtitle="Potongan suara responden terbaru. Biasanya ini bagian paling berguna buat nentuin prioritas aksi setelah survei selesai."
      >
        {summary.openHighlights.length ? (
          <div style={{ display: "grid", gap: 12 }}>
            {summary.openHighlights.map((item) => (
              <article
                key={`${item.inviteId}-${item.prompt}`}
                style={{
                  background: "#f8fafc",
                  borderRadius: 20,
                  padding: 18,
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f766e", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {item.teamName}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>{formatDate(item.submittedAt)}</div>
                </div>
                <div style={{ marginTop: 8, fontWeight: 800, lineHeight: 1.5 }}>{item.prompt}</div>
                <div style={{ marginTop: 10, color: "#334155", lineHeight: 1.8 }}>{item.answerText}</div>
                <div style={{ marginTop: 10, color: "#64748b", fontSize: 13 }}>Responden: {item.respondent}</div>
              </article>
            ))}
          </div>
        ) : (
          <div style={{ color: "#64748b" }}>Belum ada jawaban terbuka untuk diringkas.</div>
        )}
      </SectionCard>

      <section style={{ marginTop: 30 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "end" }}>
          <div>
            <h2 style={{ margin: "0 0 6px", fontSize: 24 }}>Raw Responses</h2>
            <p style={{ margin: 0, color: "#64748b" }}>
              Menampilkan {filteredEntries.length} dari {entries.length} respons. Gunakan ini untuk audit detail per responden.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(220px, 1.4fr) repeat(2, minmax(160px, 0.8fr))",
              gap: 12,
              width: "100%",
              maxWidth: 760,
            }}
          >
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari token, tim, pertanyaan, atau jawaban"
              style={{
                width: "100%",
                borderRadius: 16,
                border: "1px solid #cbd5e1",
                padding: "14px 16px",
                background: "#fff",
                outline: "none",
              }}
            />

            <select
              value={teamFilter}
              onChange={(event) => setTeamFilter(event.target.value)}
              style={{
                width: "100%",
                borderRadius: 16,
                border: "1px solid #cbd5e1",
                padding: "14px 16px",
                background: "#fff",
                outline: "none",
              }}
            >
              <option value="all">Semua tim</option>
              {summary.byTeam.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              style={{
                width: "100%",
                borderRadius: 16,
                border: "1px solid #cbd5e1",
                padding: "14px 16px",
                background: "#fff",
                outline: "none",
              }}
            >
              <option value="all">Semua status</option>
              <option value="submitted">Submitted</option>
              <option value="started">Started</option>
              <option value="unused">Unused</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gap: 16, marginTop: 18 }}>
          {filteredEntries.length === 0 ? (
            <div
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: 28,
                border: "1px solid #e2e8f0",
                color: "#475569",
              }}
            >
              Tidak ada respons yang cocok dengan filter saat ini.
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <article
                key={entry.inviteId}
                style={{
                  background: "#fff",
                  borderRadius: 24,
                  padding: 22,
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 13, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {entry.teamMeta?.name ?? "Belum pilih tim"}
                    </div>
                    <div style={{ marginTop: 6, fontSize: 22, fontWeight: 800 }}>
                      {entry.inviteId.slice(0, 8)}...
                    </div>
                    {entry.identityEmail ? (
                      <div style={{ marginTop: 6, color: "#0f172a", fontSize: 14, fontWeight: 600 }}>
                        {entry.identityName ? `${entry.identityName} · ` : ""}
                        {entry.identityEmail}
                      </div>
                    ) : null}
                    <div style={{ marginTop: 6, color: "#475569", fontSize: 14 }}>
                      Mulai: {formatDate(entry.startedAt)} · Submit: {formatDate(entry.submittedAt)}
                    </div>
                  </div>

                  <div
                    style={{
                      alignSelf: "flex-start",
                      background:
                        entry.status === "submitted"
                          ? "#ecfdf5"
                          : entry.status === "started"
                            ? "#fff7ed"
                            : "#eff6ff",
                      color:
                        entry.status === "submitted"
                          ? "#065f46"
                          : entry.status === "started"
                            ? "#9a3412"
                            : "#1d4ed8",
                      borderRadius: 999,
                      padding: "10px 14px",
                      fontWeight: 700,
                    }}
                  >
                    {entry.status}
                  </div>
                </div>

                <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
                  {entry.questionItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: "#f8fafc",
                        borderRadius: 18,
                        padding: 16,
                      }}
                    >
                      <div style={{ fontWeight: 700, lineHeight: 1.5 }}>
                        <span style={{ marginRight: 8 }}>{item.emoji}</span>
                        {item.prompt}
                      </div>
                      <div style={{ marginTop: 8, color: "#334155", lineHeight: 1.7 }}>
                        {item.answerText || <span style={{ color: "#94a3b8" }}>Belum dijawab</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </>
  );
}
