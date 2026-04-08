"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Trash2, BookmarkX, Filter } from "lucide-react";
import CodeSnippet from "@/components/CodeSnippet";
import QuestionBadges from "@/components/QuestionBadges";
import { getAttempts, getBookmarks, clearAttempts, removeBookmark, type Attempt, type Bookmark } from "@/lib/storage";
import { TOPICS } from "@/lib/topics";

type Tab = "incorrect" | "bookmarks";

export default function ReviewPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("incorrect");
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filterTopic, setFilterTopic] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setAttempts(getAttempts().filter((a) => a.verdict !== "correct"));
    setBookmarks(getBookmarks());
  }, []);

  const filteredAttempts = filterTopic === "all" ? attempts : attempts.filter((a) => a.topic === filterTopic);

  const practiceAgain = (topic: string) => {
    router.push(`/setup?topic=${topic}`);
    router.push("/practice");
  };

  const handleRemoveBookmark = (questionId: string) => {
    removeBookmark(questionId);
    setBookmarks((b) => b.filter((bm) => bm.question.question_id !== questionId));
  };

  const handleClearHistory = () => {
    if (confirm("Clear all attempt history? This cannot be undone.")) {
      clearAttempts();
      setAttempts([]);
    }
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "0.5rem 1.25rem",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.875rem",
    background: active ? "var(--accent-glow)" : "transparent",
    color: active ? "var(--accent-bright)" : "var(--text-muted)",
    transition: "all 0.15s",
  });

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 800 }}>Review</h1>
          <p style={{ margin: "0.375rem 0 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>Revisit incorrect answers and saved questions.</p>
        </div>
        {tab === "incorrect" && attempts.length > 0 && (
          <button className="btn-secondary" onClick={handleClearHistory} style={{ padding: "0.5rem 0.875rem", fontSize: "0.8rem", color: "var(--danger)", borderColor: "rgba(239,68,68,0.3)" }}>
            <Trash2 size={13} /> Clear History
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.5rem", background: "var(--bg-card)", padding: "0.25rem", borderRadius: 10, width: "fit-content" }}>
        <button style={tabStyle(tab === "incorrect")} onClick={() => setTab("incorrect")}>
          ❌ Incorrect ({attempts.length})
        </button>
        <button style={tabStyle(tab === "bookmarks")} onClick={() => setTab("bookmarks")}>
          🔖 Bookmarks ({bookmarks.length})
        </button>
      </div>

      {/* Topic filter (incorrect tab) */}
      {tab === "incorrect" && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          <Filter size={14} style={{ color: "var(--text-muted)" }} />
          <select
            value={filterTopic}
            onChange={(e) => setFilterTopic(e.target.value)}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "0.375rem 0.75rem",
              color: "var(--text-secondary)",
              fontSize: "0.8rem",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="all">All Topics</option>
            {TOPICS.map((t) => (
              <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>
            ))}
          </select>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{filteredAttempts.length} question(s)</span>
        </div>
      )}

      {/* Incorrect attempts list */}
      {tab === "incorrect" && (
        <>
          {filteredAttempts.length === 0 ? (
            <div className="glass-card" style={{ padding: "3rem", textAlign: "center" }}>
              <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎉</p>
              <p style={{ color: "var(--text-secondary)" }}>No incorrect answers to review! Great job!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {filteredAttempts.map((a, i) => {
                const isExpanded = expanded === `attempt-${i}`;
                return (
                  <div key={i} className="glass-card" style={{ overflow: "hidden" }}>
                    <div
                      style={{ padding: "1rem 1.25rem", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}
                      onClick={() => setExpanded(isExpanded ? null : `attempt-${i}`)}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <QuestionBadges topic={a.topic} difficulty={a.difficulty} questionType={a.question_type} />
                        <p style={{ margin: "0.5rem 0 0", fontSize: "0.875rem", color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: isExpanded ? "normal" : "nowrap" }}>
                          {a.prompt}
                        </p>
                        <p style={{ margin: "0.25rem 0 0", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          {new Date(a.attempted_at).toLocaleString()} · Score: {a.score}/{a.max_score}
                        </p>
                      </div>
                      <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>
                        {a.verdict === "partial" ? "⚠️" : "❌"}
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="animate-fade-in" style={{ borderTop: "1px solid var(--border-subtle)", padding: "1.25rem" }}>
                        <CodeSnippet code={a.code_snippet} />
                        <div style={{ marginTop: "1rem", padding: "0.875rem", background: "rgba(239,68,68,0.05)", borderRadius: 8, borderLeft: "3px solid var(--danger)" }}>
                          <p style={{ fontSize: "0.75rem", color: "var(--danger)", fontWeight: 600, margin: "0 0 0.25rem" }}>Your Answer</p>
                          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>{a.user_answer || "(blank)"}</p>
                        </div>
                        <div style={{ marginTop: "0.75rem", padding: "0.875rem", background: "var(--success-glow)", borderRadius: 8, borderLeft: "3px solid var(--success)" }}>
                          <p style={{ fontSize: "0.75rem", color: "var(--success)", fontWeight: 600, margin: "0 0 0.25rem" }}>Correct Answer</p>
                          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>{a.correct_answer}</p>
                        </div>
                        <button
                          className="btn-primary"
                          onClick={() => router.push(`/setup?topic=${a.topic}`)}
                          style={{ marginTop: "1rem", padding: "0.5rem 1rem", fontSize: "0.8rem" }}
                        >
                          <RotateCcw size={13} /> Practise This Topic
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Bookmarks list */}
      {tab === "bookmarks" && (
        <>
          {bookmarks.length === 0 ? (
            <div className="glass-card" style={{ padding: "3rem", textAlign: "center" }}>
              <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔖</p>
              <p style={{ color: "var(--text-secondary)" }}>No saved questions yet. Click Save on any question during practice.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {bookmarks.map((bm, i) => {
                const q = bm.question;
                const isExpanded = expanded === `bm-${i}`;
                return (
                  <div key={i} className="glass-card" style={{ overflow: "hidden" }}>
                    <div
                      style={{ padding: "1rem 1.25rem", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}
                      onClick={() => setExpanded(isExpanded ? null : `bm-${i}`)}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <QuestionBadges topic={q.topic} difficulty={q.difficulty} questionType={q.question_type} />
                        <p style={{ margin: "0.5rem 0 0", fontSize: "0.875rem", color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: isExpanded ? "normal" : "nowrap" }}>
                          {q.prompt}
                        </p>
                        <p style={{ margin: "0.25rem 0 0", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          Saved {new Date(bm.saved_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveBookmark(q.question_id); }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0.125rem" }}
                        title="Remove bookmark"
                      >
                        <BookmarkX size={16} />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="animate-fade-in" style={{ borderTop: "1px solid var(--border-subtle)", padding: "1.25rem" }}>
                        <CodeSnippet code={q.code_snippet} />
                        <div style={{ marginTop: "1rem", padding: "0.875rem", background: "var(--success-glow)", borderRadius: 8, borderLeft: "3px solid var(--success)" }}>
                          <p style={{ fontSize: "0.75rem", color: "var(--success)", fontWeight: 600, margin: "0 0 0.25rem" }}>Answer</p>
                          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>{q.correct_answer}</p>
                        </div>
                        <div style={{ marginTop: "0.875rem", padding: "0.875rem", background: "var(--accent-glow)", borderRadius: 8, borderLeft: "3px solid var(--accent)" }}>
                          <p style={{ fontSize: "0.75rem", color: "var(--accent-bright)", fontWeight: 600, margin: "0 0 0.375rem" }}>Explanation</p>
                          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>{q.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
