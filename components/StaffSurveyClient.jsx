"use client";

import { useEffect, useMemo, useState } from "react";
import {
  COMMON_QS,
  SPECIFIC_QS,
  SUBDIRS,
  findFirstIncompleteStep,
  getQuestionsForSubdir,
  getSubdirById,
} from "../lib/questionnaire";

function ProgressBar({ current, total, color }) {
  return (
    <div style={{ width: "100%", height: 6, background: "#e5e7eb", borderRadius: 9999, overflow: "hidden" }}>
      <div
        style={{
          height: "100%",
          borderRadius: 9999,
          background: color,
          width: `${(current / total) * 100}%`,
          transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
}

function ScenarioQ({ q, onAnswer, answered, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {q.options.map((option) => (
        <button
          key={option.val}
          type="button"
          onClick={() => onAnswer(option.val)}
          style={{
            padding: "14px 18px",
            borderRadius: 14,
            textAlign: "left",
            border: answered === option.val ? `2px solid ${color}` : "2px solid #e5e7eb",
            background: answered === option.val ? `${color}14` : "#fff",
            color: "#1f2937",
            fontSize: 15,
            cursor: "pointer",
            boxShadow: answered === option.val ? `0 0 0 4px ${color}22` : "none",
            transition: "all 0.2s",
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function MCQ({ q, onAnswer, answered, color }) {
  return <ScenarioQ q={q} onAnswer={onAnswer} answered={answered} color={color} />;
}

function SliderQ({ q, onAnswer, answered, color }) {
  const initialValue = answered ?? Math.floor((q.min + q.max) / 2);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(answered ?? Math.floor((q.min + q.max) / 2));
  }, [answered, q.max, q.min]);

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 44, fontWeight: 800, color }}>{value}</span>
        <span style={{ fontSize: 16, color: "#6b7280", marginLeft: 6 }}>{q.unit}</span>
      </div>
      <input
        type="range"
        min={q.min}
        max={q.max}
        step={q.step}
        value={value}
        onChange={(event) => {
          const nextValue = Number(event.target.value);
          setValue(nextValue);
          onAnswer(nextValue);
        }}
        style={{ width: "100%", accentColor: color, cursor: "pointer", height: 6 }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        {q.labels.map((label) => (
          <span key={label} style={{ fontSize: 11, color: "#9ca3af", maxWidth: 60, textAlign: "center" }}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function RatingQ({ q, onAnswer, answered, color }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 12 }}>
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => onAnswer(score)}
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              border: answered === score ? `2px solid ${color}` : "2px solid #e5e7eb",
              background: answered === score ? color : "#fff",
              color: answered === score ? "#fff" : "#374151",
              fontSize: 18,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: answered === score ? `0 4px 12px ${color}44` : "none",
              transition: "all 0.2s",
            }}
          >
            {score}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px" }}>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>{q.labels[0]}</span>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>{q.labels[4]}</span>
      </div>
    </div>
  );
}

function OpenQ({ q, onAnswer, answered, color }) {
  return (
    <textarea
      value={answered ?? ""}
      onChange={(event) => onAnswer(event.target.value)}
      placeholder={q.placeholder}
      rows={4}
      style={{
        width: "100%",
        borderRadius: 14,
        border: `2px solid ${answered ? color : "#e5e7eb"}`,
        padding: "14px 16px",
        fontSize: 15,
        resize: "vertical",
        outline: "none",
        color: "#1f2937",
        lineHeight: 1.6,
        transition: "border-color 0.2s",
      }}
    />
  );
}

function QuestionCard({ q, onAnswer, answered, color }) {
  const renderer = {
    scenario: <ScenarioQ q={q} onAnswer={onAnswer} answered={answered} color={color} />,
    mcq: <MCQ q={q} onAnswer={onAnswer} answered={answered} color={color} />,
    slider: <SliderQ q={q} onAnswer={onAnswer} answered={answered} color={color} />,
    rating: <RatingQ q={q} onAnswer={onAnswer} answered={answered} color={color} />,
    open: <OpenQ q={q} onAnswer={onAnswer} answered={answered} color={color} />,
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: "28px 28px 24px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        border: "1px solid #f3f4f6",
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 12 }}>{q.emoji}</div>
      <p style={{ fontSize: 16, color: "#1f2937", lineHeight: 1.65, marginBottom: 22, fontWeight: 500 }}>
        {q.q}
      </p>
      {renderer[q.type]}
    </div>
  );
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? "request-failed");
  }

  return payload;
}

export default function StaffSurveyClient({ initialTeam, initialResponses }) {
  const [subdir, setSubdir] = useState(initialTeam ?? null);
  const [step, setStep] = useState(
    initialTeam ? findFirstIncompleteStep(initialTeam, initialResponses) : 0,
  );
  const [answers, setAnswers] = useState(initialResponses);
  const [phase, setPhase] = useState(initialTeam ? "survey" : "pick");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const currentSubdir = getSubdirById(subdir);
  const questions = useMemo(() => getQuestionsForSubdir(subdir), [subdir]);
  const currentQuestion = questions[step];
  const totalQuestions = questions.length;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const canNext = currentAnswer !== undefined && currentAnswer !== "";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, phase]);

  function handleAnswer(value) {
    if (!currentQuestion) {
      return;
    }

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: value,
    }));
  }

  async function saveCurrentAnswer() {
    if (!currentQuestion || !subdir) {
      return;
    }

    await postJson("/api/responses/save", {
      team: subdir,
      questionId: currentQuestion.id,
      answer: currentAnswer,
    });
  }

  async function handleNext() {
    if (!canNext) {
      return;
    }

    try {
      setIsSaving(true);
      setSaveError("");
      await saveCurrentAnswer();

      if (step < totalQuestions - 1) {
        setStep((value) => value + 1);
        return;
      }

      await postJson("/api/submit", {
        team: subdir,
      });
      setPhase("done");
    } catch (error) {
      setSaveError(
        error.message === "already-submitted"
          ? "Tautan ini sudah dipakai untuk mengirim survei."
          : "Jawaban belum tersimpan. Coba lagi sebentar.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleBack() {
    if (step > 0) {
      setStep((value) => value - 1);
    }
  }

  if (phase === "pick") {
    return (
      <div style={{ minHeight: "100vh", padding: "40px 24px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <img
            src="/covers/cover-common.png"
            alt="Survei Staf Komdigi 2026"
            style={{
              width: "100%",
              borderRadius: 18,
              boxShadow: "0 16px 40px rgba(15, 23, 42, 0.18)",
              marginBottom: 24,
              display: "block",
            }}
          />
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 8 }}>
            Anda dari tim mana?
          </h2>
          <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 28, lineHeight: 1.6 }}>
            Pilih tim Anda. Satu identitas responden hanya berlaku untuk satu respons final.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SUBDIRS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => {
                  setSubdir(entry.id);
                  setStep(findFirstIncompleteStep(entry.id, answers));
                  setPhase("survey");
                }}
                style={{
                  padding: "20px 22px",
                  borderRadius: 18,
                  textAlign: "left",
                  border: `2px solid ${entry.color}33`,
                  background: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}
              >
                <span style={{ fontSize: 36, flexShrink: 0 }}>{entry.emoji}</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>{entry.name}</div>
                  <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{entry.tagline}</div>
                </div>
                <span style={{ marginLeft: "auto", color: "#d1d5db", fontSize: 20 }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "done" && currentSubdir) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: `linear-gradient(160deg, ${currentSubdir.light} 0%, #f9fafb 60%)`,
          padding: "48px 24px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
          <img
            src="/covers/cover-common.png"
            alt="Survei Staf Komdigi 2026"
            style={{
              width: "100%",
              borderRadius: 18,
              boxShadow: "0 16px 40px rgba(15, 23, 42, 0.18)",
              marginBottom: 24,
              display: "block",
            }}
          />
          <div style={{ fontSize: 64, marginBottom: 16 }}>🙏</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 10 }}>
            Terima kasih, {currentSubdir.lead}!
          </h2>
          <p style={{ fontSize: 16, color: "#4b5563", lineHeight: 1.7, marginBottom: 28 }}>
            Jawaban Anda sudah tersimpan dan token ini sekarang ditutup untuk mencegah pengiriman ulang.
          </p>

          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: currentSubdir.color,
                marginBottom: 14,
                letterSpacing: "0.05em",
              }}
            >
              RINGKASAN JAWABAN TERSIMPAN
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Object.entries(answers)
                .slice(0, 5)
                .map(([questionId, value]) => {
                  const question = getQuestionsForSubdir(subdir).find((entry) => entry.id === questionId);

                  if (!question) {
                    return null;
                  }

                  const label =
                    typeof value === "number" && question.type === "slider"
                      ? `${value} ${question.unit}`
                      : typeof value === "number" && question.type === "rating"
                        ? `${value} / 5`
                        : question.options
                          ? question.options.find((option) => option.val === value)?.label
                          : value;

                  return (
                    <div key={questionId} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{question.emoji}</span>
                      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
                        <span style={{ color: "#6b7280" }}>{question.q.slice(0, 60)}... </span>
                        <span style={{ fontWeight: 700, color: currentSubdir.color }}>
                          {typeof label === "string" && label.length > 60 ? `${label.slice(0, 60)}...` : label}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentSubdir || !currentQuestion) {
    return null;
  }

  const isCommonSection = step < COMMON_QS.length;
  const sectionLabel = isCommonSection
    ? "Pertanyaan Umum"
    : `Khusus Tim ${currentSubdir.name.split(" ")[0]}`;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, ${currentSubdir.light} 0%, #ffffff 60%)`,
        padding: "32px 24px 80px",
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <img
          src="/covers/cover-common.png"
          alt="Survei Staf Komdigi 2026"
          style={{
            width: "100%",
            borderRadius: 18,
            boxShadow: "0 16px 40px rgba(15, 23, 42, 0.18)",
            marginBottom: 24,
            display: "block",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 28 }}>{currentSubdir.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: currentSubdir.color, letterSpacing: "0.04em" }}>
              {sectionLabel.toUpperCase()}
            </div>
            <div style={{ fontSize: 14, color: "#6b7280" }}>
              Pertanyaan {step + 1} dari {totalQuestions}
            </div>
          </div>
        </div>

        <ProgressBar current={step + 1} total={totalQuestions} color={currentSubdir.color} />

        {step === COMMON_QS.length && (
          <div
            style={{
              background: currentSubdir.color,
              color: "#fff",
              borderRadius: 14,
              padding: "14px 18px",
              marginTop: 20,
              marginBottom: 4,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {currentSubdir.emoji} Sekarang pertanyaan khusus untuk {currentSubdir.name}
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <QuestionCard
            q={currentQuestion}
            onAnswer={handleAnswer}
            answered={currentAnswer}
            color={currentSubdir.color}
          />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSaving}
              style={{
                padding: "13px 22px",
                borderRadius: 14,
                border: "2px solid #e5e7eb",
                background: "#fff",
                color: "#374151",
                fontSize: 15,
                cursor: isSaving ? "wait" : "pointer",
              }}
            >
              ← Kembali
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={!canNext || isSaving}
            style={{
              flex: 1,
              padding: "14px 20px",
              borderRadius: 14,
              border: "none",
              background: canNext && !isSaving ? currentSubdir.color : "#e5e7eb",
              color: canNext && !isSaving ? "#fff" : "#9ca3af",
              fontSize: 16,
              fontWeight: 700,
              cursor: canNext && !isSaving ? "pointer" : "not-allowed",
              boxShadow: canNext && !isSaving ? `0 4px 14px ${currentSubdir.color}55` : "none",
              transition: "all 0.2s",
            }}
          >
            {isSaving ? "Menyimpan..." : step < totalQuestions - 1 ? "Lanjut →" : "Selesai ✓"}
          </button>
        </div>

        {saveError ? (
          <p style={{ textAlign: "center", fontSize: 13, color: "#dc2626", marginTop: 10 }}>{saveError}</p>
        ) : !canNext ? (
          <p style={{ textAlign: "center", fontSize: 13, color: "#9ca3af", marginTop: 10 }}>
            Pilih atau isi jawaban untuk melanjutkan
          </p>
        ) : null}
      </div>
    </div>
  );
}
