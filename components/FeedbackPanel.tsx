"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertCircle, BookOpen, Sparkles, TrendingUp } from "lucide-react";
import type { MarkingResult } from "@/lib/validators";

interface FeedbackPanelProps {
  verdict: string;
  score: number;
  maxScore: number;
  correctAnswer: string;
  explanation: string;
  markingResult?: MarkingResult | null;
  selectedOption?: string | null;
  isOpenEnded?: boolean;
  commonTrap?: string | null;
}

const VERDICT_CONFIG = {
  correct: { icon: CheckCircle2, color: "var(--success)", cls: "verdict-correct", label: "Correct!" },
  partial: { icon: AlertCircle, color: "var(--warning)", cls: "verdict-partial", label: "Partially Correct" },
  incorrect: { icon: XCircle, color: "var(--danger)", cls: "verdict-incorrect", label: "Incorrect" },
};

function scoreBar(score: number, max: number) {
  const pct = max > 0 ? (score / max) * 100 : 0;
  const color = pct >= 80 ? "var(--success)" : pct >= 50 ? "var(--warning)" : "var(--danger)";
  return (
    <div style={{ marginTop: "0.375rem" }}>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function FeedbackPanel({
  verdict,
  score,
  maxScore,
  correctAnswer,
  explanation,
  markingResult,
  selectedOption,
  isOpenEnded = false,
  commonTrap,
}: FeedbackPanelProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const cfg = VERDICT_CONFIG[verdict as keyof typeof VERDICT_CONFIG] ?? VERDICT_CONFIG.incorrect;
  const Icon = cfg.icon;

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Verdict header */}
      <div
        className={cfg.cls}
        style={{
          border: "1px solid",
          borderRadius: 12,
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <Icon size={22} />
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, margin: 0 }}>{cfg.label}</p>
          {maxScore > 1 && (
            <p style={{ fontSize: "0.8rem", opacity: 0.8, margin: "0.25rem 0 0 0" }}>
              Score: {score} / {maxScore}
            </p>
          )}
        </div>
        {maxScore > 1 && scoreBar(score, maxScore)}
      </div>

      {/* For open-ended: full AI feedback */}
      {isOpenEnded && markingResult && (
        <div
          className="glass-card"
          style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}
        >
          {markingResult.what_is_correct && (
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--success)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <CheckCircle2 size={13} /> What you got right
              </p>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>{markingResult.what_is_correct}</p>
            </div>
          )}
          {markingResult.what_is_missing && (
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--danger)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <XCircle size={13} /> What was missing
              </p>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>{markingResult.what_is_missing}</p>
            </div>
          )}
          {markingResult.improvement_tip && (
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--warning)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <TrendingUp size={13} /> Improvement tip
              </p>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>{markingResult.improvement_tip}</p>
            </div>
          )}
          {markingResult.model_answer && (
            <div
              style={{
                background: "rgba(59, 130, 246, 0.06)",
                borderRadius: 8,
                padding: "0.75rem",
                borderLeft: "3px solid var(--accent)",
              }}
            >
              <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--accent-bright)", marginBottom: "0.375rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <Sparkles size={13} /> Model Answer
              </p>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.65 }}>{markingResult.model_answer}</p>
            </div>
          )}
        </div>
      )}

      {/* For MCQ: show correct answer */}
      {!isOpenEnded && (
        <div
          style={{
            background: "rgba(59, 130, 246, 0.06)",
            borderRadius: 10,
            padding: "0.875rem 1rem",
            borderLeft: "3px solid var(--accent)",
          }}
        >
          <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--accent-bright)", marginBottom: "0.375rem" }}>
            Correct Answer
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-primary)", margin: 0 }}>{correctAnswer}</p>
        </div>
      )}

      {/* Expandable explanation */}
      <div
        className="glass-card"
        style={{ overflow: "hidden", cursor: "pointer" }}
        onClick={() => setShowExplanation((v) => !v)}
      >
        <div
          style={{
            padding: "0.875rem 1.125rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--accent-bright)" }}>
            <BookOpen size={15} /> Full Explanation
          </span>
          {showExplanation ? <ChevronUp size={16} style={{ color: "var(--text-muted)" }} /> : <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />}
        </div>
        {showExplanation && (
          <div
            className="animate-fade-in"
            style={{ padding: "0 1.125rem 1rem", borderTop: "1px solid var(--border-subtle)" }}
          >
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: "0.875rem 0 0 0", lineHeight: 1.7 }}>
              {explanation}
            </p>
            {commonTrap && (
              <div style={{ marginTop: "0.875rem", padding: "0.625rem 0.875rem", background: "var(--danger-glow)", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)" }}>
                <p style={{ fontSize: "0.75rem", color: "var(--danger)", fontWeight: 600, margin: "0 0 0.25rem 0" }}>⚠️ Common Exam Trap</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>{commonTrap}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
