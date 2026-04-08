"use client";

import { TOPICS } from "@/lib/topics";

const DIFFICULTY_CONFIG = {
  easy: { label: "Easy", cls: "badge-easy" },
  medium: { label: "Medium", cls: "badge-medium" },
  hard: { label: "Hard", cls: "badge-hard" },
};

const TYPE_LABELS: Record<string, string> = {
  "multiple-choice": "MCQ",
  "true-false": "True/False",
  "predict-output": "Predict Output",
  "find-bug": "Find Bug",
  "identify-error": "Identify Error",
  "explain-bug": "Explain Bug",
  "explain-code": "Explain Code",
  mixed: "Mixed",
};

interface QuestionBadgesProps {
  topic: string;
  difficulty: string;
  questionType: string;
}

export default function QuestionBadges({ topic, difficulty, questionType }: QuestionBadgesProps) {
  const topicDef = TOPICS.find((t) => t.id === topic);
  const diffCfg = DIFFICULTY_CONFIG[difficulty as keyof typeof DIFFICULTY_CONFIG] ?? DIFFICULTY_CONFIG.medium;

  const badgeStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
    padding: "0.25rem 0.625rem",
    borderRadius: 6,
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.01em",
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      {topicDef && (
        <span
          style={{
            ...badgeStyle,
            background: "var(--accent-glow)",
            color: "var(--accent-bright)",
            border: "1px solid var(--border)",
          }}
        >
          {topicDef.emoji} {topicDef.label}
        </span>
      )}
      <span className={diffCfg.cls} style={badgeStyle}>
        {diffCfg.label}
      </span>
      <span
        style={{
          ...badgeStyle,
          background: "var(--purple-glow)",
          color: "var(--purple)",
          border: "1px solid rgba(139, 92, 246, 0.25)",
        }}
      >
        {TYPE_LABELS[questionType] ?? questionType}
      </span>
    </div>
  );
}
