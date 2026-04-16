import { COMMON_QS, SPECIFIC_QS, SUBDIRS, getSubdirById } from "./questionnaire.js";

function getQuestionDefinitions() {
  return [
    ...COMMON_QS.map((question) => ({ ...question, teamScope: "all" })),
    ...Object.entries(SPECIFIC_QS).flatMap(([teamId, questions]) =>
      questions.map((question) => ({ ...question, teamScope: teamId })),
    ),
  ];
}

function toCsvCell(value) {
  const normalized = value ?? "";
  return `"${String(normalized).replaceAll('"', '""')}"`;
}

function mean(values) {
  if (!values.length) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function toPercent(part, total) {
  if (!total) {
    return 0;
  }

  return Math.round((part / total) * 100);
}

function getDateKey(value) {
  if (!value) {
    return "";
  }

  return String(value).slice(0, 10);
}

function formatDateLabel(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

function getNumericAnswer(answer) {
  return typeof answer === "number" && Number.isFinite(answer) ? answer : null;
}

function getOptionLabel(definition, answer) {
  if (!definition) {
    return formatAnswer(answer);
  }

  if (definition.options) {
    const matchedOption = definition.options.find((option) => String(option.val) === String(answer));
    return matchedOption?.label ?? formatAnswer(answer);
  }

  if (definition.type === "rating") {
    return `${answer} / 5`;
  }

  return formatAnswer(answer);
}

function buildDistribution(definition, values) {
  if (!definition || !values.length) {
    return [];
  }

  if (definition.options) {
    return definition.options.map((option) => ({
      value: option.val,
      label: option.label,
      count: values.filter((value) => String(value) === String(option.val)).length,
    }));
  }

  if (definition.type === "rating") {
    return [1, 2, 3, 4, 5].map((score) => ({
      value: score,
      label: `${score}`,
      count: values.filter((value) => Number(value) === score).length,
    }));
  }

  return [];
}

function getTopDistributionItem(distribution) {
  return distribution
    .filter((item) => item.count > 0)
    .sort((left, right) => right.count - left.count)[0] ?? null;
}

export function formatAnswer(answer) {
  if (answer === undefined || answer === null || answer === "") {
    return "";
  }

  if (typeof answer === "string" || typeof answer === "number" || typeof answer === "boolean") {
    return String(answer);
  }

  return JSON.stringify(answer);
}

export function buildSurveyDataset(rows) {
  const questionDefinitions = getQuestionDefinitions();
  const questionMap = new Map(questionDefinitions.map((question) => [question.id, question]));
  const questionIds = questionDefinitions.map((question) => question.id);
  const grouped = new Map();

  for (const row of rows) {
    if (!grouped.has(row.invite_id)) {
      grouped.set(row.invite_id, {
        inviteId: row.invite_id,
        team: row.team ?? "",
        teamMeta: getSubdirById(row.team ?? "") ?? null,
        rawStatus: row.status,
        status: row.status,
        hasActiveSession: Boolean(row.has_active_session),
        identityEmail: row.identity_email ?? "",
        identityName: row.identity_name ?? "",
        identityProvider: row.identity_provider ?? "",
        startedAt: row.started_at ? new Date(row.started_at).toISOString() : "",
        submittedAt: row.submitted_at ? new Date(row.submitted_at).toISOString() : "",
        responseUpdatedAt: "",
        answers: {},
      });
    }

    if (row.question_id) {
      const entry = grouped.get(row.invite_id);
      entry.answers[row.question_id] = row.answer;
      entry.responseUpdatedAt = row.response_updated_at
        ? new Date(row.response_updated_at).toISOString()
        : entry.responseUpdatedAt;
    }
  }

  const entries = Array.from(grouped.values())
    .map((entry) => ({
      ...entry,
      questionItems: questionIds
        .filter((questionId) => {
          const definition = questionMap.get(questionId);

          if (!definition) {
            return false;
          }

          return definition.teamScope === "all" || definition.teamScope === entry.team;
        })
        .map((questionId) => {
          const definition = questionMap.get(questionId);
          return {
            id: questionId,
            emoji: definition?.emoji ?? "•",
            prompt: definition?.q ?? questionId,
            answer: entry.answers[questionId],
            answerText: getOptionLabel(definition, entry.answers[questionId]),
            type: definition?.type ?? "unknown",
          };
        }),
    }))
    .map((entry) => {
      const hasAnyAnswer = entry.questionItems.some((item) => {
        const value = item.answer;
        return value !== undefined && value !== null && value !== "";
      });

      const effectiveStatus =
        entry.rawStatus === "started" && !entry.hasActiveSession && !hasAnyAnswer
          ? "unused"
          : entry.rawStatus;

      return {
        ...entry,
        hasAnyAnswer,
        status: effectiveStatus,
      };
    })
    .sort((left, right) => {
      const leftDate = left.submittedAt || left.startedAt || "";
      const rightDate = right.submittedAt || right.startedAt || "";
      return rightDate.localeCompare(leftDate);
    });

  const submittedEntries = entries.filter((entry) => entry.status === "submitted");
  const activeEntries = entries.filter((entry) => entry.status !== "unused");
  const byStatus = {
    unused: entries.filter((entry) => entry.status === "unused").length,
    started: entries.filter((entry) => entry.status === "started").length,
    submitted: submittedEntries.length,
  };

  const weeklyHoursDefinition = questionMap.get("c2");
  const accessDefinition = questionMap.get("c4");
  const urgencyDefinition = questionMap.get("c1");

  const weeklyHoursValues = submittedEntries
    .map((entry) => getNumericAnswer(entry.answers.c2))
    .filter((value) => value !== null);
  const accessValues = submittedEntries
    .map((entry) => getNumericAnswer(entry.answers.c4))
    .filter((value) => value !== null);
  const urgencyValues = submittedEntries
    .map((entry) => entry.answers.c1)
    .filter((value) => value !== undefined && value !== null && value !== "");

  const providerBreakdown = Array.from(
    entries.reduce((accumulator, entry) => {
      const key = entry.identityProvider || "token";
      accumulator.set(key, (accumulator.get(key) ?? 0) + 1);
      return accumulator;
    }, new Map()).entries(),
  )
    .map(([id, count]) => ({
      id,
      label:
        id === "google"
          ? "Google"
          : id === "azure-ad"
            ? "Microsoft"
            : "Token / manual",
      count,
      share: toPercent(count, entries.length),
    }))
    .sort((left, right) => right.count - left.count);

  const responseTrend = Array.from(
    submittedEntries.reduce((accumulator, entry) => {
      const key = getDateKey(entry.submittedAt);
      if (!key) {
        return accumulator;
      }

      accumulator.set(key, (accumulator.get(key) ?? 0) + 1);
      return accumulator;
    }, new Map()).entries(),
  )
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-10)
    .map(([date, count]) => ({
      date,
      label: formatDateLabel(date),
      count,
    }));

  const teamInsights = SUBDIRS.map((team) => {
    const teamEntries = entries.filter((entry) => entry.team === team.id);
    const teamSubmitted = teamEntries.filter((entry) => entry.status === "submitted");
    const teamHours = teamSubmitted
      .map((entry) => getNumericAnswer(entry.answers.c2))
      .filter((value) => value !== null);
    const teamAccess = teamSubmitted
      .map((entry) => getNumericAnswer(entry.answers.c4))
      .filter((value) => value !== null);
    const openHighlights = teamSubmitted
      .flatMap((entry) =>
        entry.questionItems
          .filter((item) => item.type === "open" && item.answerText)
          .map((item) => ({
            answerText: item.answerText,
            prompt: item.prompt,
            submittedAt: entry.submittedAt,
          })),
      )
      .sort((left, right) => right.submittedAt.localeCompare(left.submittedAt));

    return {
      ...team,
      total: teamEntries.length,
      submitted: teamSubmitted.length,
      inProgress: teamEntries.filter((entry) => entry.status === "started").length,
      completionRate: toPercent(teamSubmitted.length, teamEntries.length),
      avgWeeklyHours: mean(teamHours),
      avgAccessScore: mean(teamAccess),
      latestSubmission: teamSubmitted[0]?.submittedAt ?? "",
      highlight: openHighlights[0]?.answerText ?? "",
      highlightPrompt: openHighlights[0]?.prompt ?? "",
    };
  });

  const questionInsights = ["c1", "c2", "c3", "c4", "c5"]
    .map((questionId) => {
      const definition = questionMap.get(questionId);

      if (!definition) {
        return null;
      }

      const answers = submittedEntries
        .map((entry) => entry.answers[questionId])
        .filter((value) => value !== undefined && value !== null && value !== "");

      const numericAnswers = answers
        .map((value) => getNumericAnswer(value))
        .filter((value) => value !== null);
      const distribution = buildDistribution(definition, answers);
      const topChoice = getTopDistributionItem(distribution);

      return {
        id: questionId,
        emoji: definition.emoji,
        prompt: definition.q,
        type: definition.type,
        responseCount: answers.length,
        average: numericAnswers.length ? mean(numericAnswers) : null,
        distribution,
        topChoiceLabel: topChoice?.label ?? "",
        topChoiceCount: topChoice?.count ?? 0,
      };
    })
    .filter(Boolean);

  const openHighlights = submittedEntries
    .flatMap((entry) =>
      entry.questionItems
        .filter((item) => item.type === "open" && item.answerText)
        .map((item) => ({
          inviteId: entry.inviteId,
          team: entry.team,
          teamName: entry.teamMeta?.name ?? "Belum pilih tim",
          respondent: entry.identityName || entry.identityEmail || entry.inviteId.slice(0, 8),
          prompt: item.prompt,
          answerText: item.answerText,
          submittedAt: entry.submittedAt,
        })),
    )
    .sort((left, right) => right.submittedAt.localeCompare(left.submittedAt))
    .slice(0, 8);

  return {
    questionIds,
    entries,
    summary: {
      totalInvites: entries.length,
      totalResponses: byStatus.submitted,
      totalInProgress: byStatus.started,
      totalUnused: byStatus.unused,
      byStatus,
      byTeam: teamInsights,
      completionRate: toPercent(byStatus.submitted, entries.length),
      activationRate: toPercent(activeEntries.length, entries.length),
      avgWeeklyHours: mean(weeklyHoursValues),
      avgAccessScore: mean(accessValues),
      urgencyBreakdown: buildDistribution(urgencyDefinition, urgencyValues),
      providerBreakdown,
      responseTrend,
      questionInsights,
      openHighlights,
      latestSubmission: submittedEntries[0]?.submittedAt ?? "",
      totalOpenHighlights: openHighlights.length,
      insightCards: [
        {
          id: "completion-rate",
          label: "Completion Rate",
          value: `${toPercent(byStatus.submitted, entries.length)}%`,
          detail: `${byStatus.submitted} dari ${entries.length} invite selesai`,
        },
        {
          id: "weekly-hours",
          label: "Rata-rata Jam Laporan",
          value: weeklyHoursValues.length ? `${mean(weeklyHoursValues).toFixed(1)} jam` : "Belum ada",
          detail: weeklyHoursDefinition?.q ?? "",
        },
        {
          id: "cross-team-access",
          label: "Skor Akses Lintas Tim",
          value: accessValues.length ? `${mean(accessValues).toFixed(1)} / 5` : "Belum ada",
          detail: accessDefinition?.q ?? "",
        },
      ],
    },
  };
}

export function createSurveyCsv(rows) {
  const { entries, questionIds } = buildSurveyDataset(rows);
  const header = [
    "invite_id",
    "identity_name",
    "identity_email",
    "identity_provider",
    "team",
    "status",
    "started_at",
    "submitted_at",
    "response_updated_at",
    ...questionIds,
  ];

  const csv = [
    header.join(","),
    ...entries.map((entry) =>
      header
        .map((column) => {
          if (questionIds.includes(column)) {
            return toCsvCell(formatAnswer(entry.answers[column]));
          }

          const lookup = {
            invite_id: entry.inviteId,
            identity_name: entry.identityName,
            identity_email: entry.identityEmail,
            identity_provider: entry.identityProvider,
            team: entry.team,
            status: entry.rawStatus ?? entry.status,
            started_at: entry.startedAt,
            submitted_at: entry.submittedAt,
            response_updated_at: entry.responseUpdatedAt,
          };

          return toCsvCell(lookup[column]);
        })
        .join(","),
    ),
  ].join("\n");

  return `${csv}\n`;
}
