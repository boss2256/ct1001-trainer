"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Timer as TimerIcon } from "lucide-react";
import TopicSelector from "@/components/TopicSelector";
import { getSettings, saveSettings, type AppSettings } from "@/lib/storage";

const QUESTION_TYPES = [
  { id: "mixed", label: "Mixed", emoji: "🎲" },
  { id: "multiple-choice", label: "Multiple Choice", emoji: "🔘" },
  { id: "predict-output", label: "Predict Output", emoji: "🖥️" },
  { id: "find-bug", label: "Find Bug", emoji: "🐛" },
  { id: "identify-error", label: "Identify Error", emoji: "🚨" },
  { id: "explain-bug", label: "Explain Bug", emoji: "💬" },
  { id: "explain-code", label: "Explain Code", emoji: "📖" },
  { id: "true-false", label: "True / False", emoji: "✅" },
];

const DIFFICULTIES = [
  { id: "easy", label: "Easy", color: "var(--success)", desc: "Short, beginner-friendly snippets" },
  { id: "medium", label: "Medium", color: "var(--warning)", desc: "Moderate complexity, requires understanding" },
  { id: "hard", label: "Hard", color: "var(--danger)", desc: "Tricky logic, careful tracing needed" },
];

function SetupContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load settings only after hydration
  useEffect(() => {
    setSettings(getSettings());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const presetTopic = params.get("topic");
    if (presetTopic && settings) {
      setSettings((s) => s ? { ...s, selectedTopics: [presetTopic] } : null);
    }
  }, [params]);

  const handleStart = () => {
    if (settings) {
      saveSettings(settings);
      router.push("/practice");
    }
  };

  if (!isHydrated || !settings) {
    return (
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>Practice Setup</h1>
        <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
      </div>
    );
  }

  const canStart = settings.selectedTopics.length > 0;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>Practice Setup</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Choose your topic, question type, and difficulty to start a focused session.</p>

      {/* Topics */}
      <section className="glass-card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
        <h2 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: 700 }}>📚 Topics</h2>
        <TopicSelector
          selected={settings.selectedTopics}
          onChange={(topics) => setSettings((s) => s ? { ...s, selectedTopics: topics } : { ...settings, selectedTopics: topics })}
        />
        {settings.selectedTopics.length === 0 && (
          <p style={{ color: "var(--danger)", fontSize: "0.8rem", marginTop: "0.5rem" }}>Select at least one topic.</p>
        )}
      </section>

      {/* Question Type */}
      <section className="glass-card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
        <h2 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: 700 }}>❓ Question Type</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "0.5rem" }}>
          {QUESTION_TYPES.map((qt) => {
            const selected = settings.selectedQuestionType === qt.id;
            return (
              <button
                key={qt.id}
                onClick={() => setSettings((s) => s ? { ...s, selectedQuestionType: qt.id } : null)}
                style={{
                  background: selected ? "var(--accent-glow)" : "var(--bg-elevated)",
                  border: `1px solid ${selected ? "var(--accent)" : "var(--border-subtle)"}`,
                  borderRadius: 10,
                  padding: "0.625rem 0.875rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>{qt.emoji}</span>
                <span style={{ fontSize: "0.8rem", fontWeight: selected ? 600 : 400, color: selected ? "var(--accent-bright)" : "var(--text-secondary)" }}>
                  {qt.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Difficulty */}
      <section className="glass-card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
        <h2 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: 700 }}>⚡ Difficulty</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
          {DIFFICULTIES.map((d) => {
            const selected = settings.selectedDifficulty === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSettings((s) => s ? { ...s, selectedDifficulty: d.id as "easy" | "medium" | "hard" } : null)}
                style={{
                  background: selected ? `${d.color}15` : "var(--bg-elevated)",
                  border: `2px solid ${selected ? d.color : "var(--border-subtle)"}`,
                  borderRadius: 12,
                  padding: "1rem",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ fontWeight: 700, color: selected ? d.color : "var(--text-secondary)", marginBottom: "0.25rem" }}>{d.label}</div>
                <div style={{ fontSize: "0.73rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{d.desc}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Session Options */}
      <section className="glass-card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        <h2 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: 700 }}>⚙️ Session Options</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.375rem" }}>Questions per session</label>
            <input
              type="number"
              min={1}
              max={50}
              value={settings.questionCount}
              onChange={(e) => setSettings((s) => s ? { ...s, questionCount: Math.min(50, Math.max(1, Number(e.target.value))) } : null)}
              style={{
                width: "100%",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "0.5rem 0.75rem",
                color: "var(--text-primary)",
                fontSize: "0.875rem",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.375rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <TimerIcon size={13} /> Timed mode
            </label>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", height: 38 }}>
              <button
                onClick={() => setSettings((s) => s ? { ...s, timedMode: !s.timedMode } : null)}
                style={{
                  width: 48,
                  height: 26,
                  borderRadius: 13,
                  background: settings.timedMode ? "var(--accent)" : "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background 0.2s",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "white",
                    position: "absolute",
                    top: 2,
                    left: settings.timedMode ? 24 : 2,
                    transition: "left 0.2s",
                  }}
                />
              </button>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                {settings.timedMode ? `${settings.timerMinutes} min` : "Untimed"}
              </span>
            </div>
          </div>

          {settings.timedMode && (
            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.375rem" }}>Timer duration (minutes)</label>
              <input
                type="number"
                min={5}
                max={120}
                value={settings.timerMinutes}
                onChange={(e) => setSettings((s) => s ? { ...s, timerMinutes: Math.min(120, Math.max(5, Number(e.target.value))) } : null)}
                style={{
                  width: "100%",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "0.5rem 0.75rem",
                  color: "var(--text-primary)",
                  fontSize: "0.875rem",
                  outline: "none",
                }}
              />
            </div>
          )}
        </div>
      </section>

      {/* Start button */}
      <button className="btn-primary" onClick={handleStart} disabled={!canStart} style={{ width: "100%", justifyContent: "center", padding: "0.875rem", fontSize: "1rem" }}>
        Start Session <ArrowRight size={18} />
      </button>
    </div>
  );
}

export default function SetupPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", color: "var(--text-secondary)" }}>Loading...</div>}>
      <SetupContent />
    </Suspense>
  );
}
