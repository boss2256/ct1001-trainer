"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import TopicProgressBar from "@/components/TopicProgressBar";
import { getAttempts, getTopicStats, getTotalStats, type Attempt } from "@/lib/storage";
import { TOPICS } from "@/lib/topics";

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, correct: 0, accuracy: 0, streak: 0 });
  const [topicStats, setTopicStats] = useState<ReturnType<typeof getTopicStats>>([]);
  const [recentAttempts, setRecentAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    setStats(getTotalStats());
    setTopicStats(getTopicStats().sort((a, b) => b.attempted - a.attempted));
    setRecentAttempts(getAttempts().slice(0, 10));
  }, []);

  const weakest = topicStats.filter((s) => s.accuracy < 60).sort((a, b) => a.accuracy - b.accuracy);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 800 }}>Your Dashboard</h1>
          <p style={{ margin: "0.375rem 0 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            All practice history stored locally in your browser.
          </p>
        </div>
        <Link href="/setup" className="btn-primary">
          New Session <ArrowRight size={16} />
        </Link>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <DashboardCard title="Questions Attempted" value={stats.total} icon="📝" color="var(--accent-bright)" subtitle="All time" />
        <DashboardCard title="Overall Accuracy" value={`${stats.accuracy}%`} icon="🎯" color={stats.accuracy >= 70 ? "var(--success)" : stats.accuracy >= 50 ? "var(--warning)" : "var(--danger)"} subtitle={`${stats.correct} correct`} />
        <DashboardCard title="Practice Streak" value={`${stats.streak}d`} icon="🔥" color="var(--warning)" subtitle="Consecutive days" />
        <DashboardCard title="Topics Practised" value={topicStats.length} icon="📚" color="var(--purple)" subtitle={`of ${TOPICS.length} total`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Topic performance */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h2 style={{ margin: "0 0 1.25rem", fontSize: "1rem", fontWeight: 700 }}>📊 Topic Performance</h2>
          {topicStats.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No attempts yet. Start practising!</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {topicStats.map((s) => (
                <TopicProgressBar key={s.topicId} stat={s} />
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Weakest topics */}
          {weakest.length > 0 && (
            <div className="glass-card" style={{ padding: "1.5rem" }}>
              <h2 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: 700 }}>⚠️ Weakest Topics</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {weakest.slice(0, 5).map((s) => {
                  const topic = TOPICS.find((t) => t.id === s.topicId);
                  return (
                    <div key={s.topicId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        {topic?.emoji} {topic?.label}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.78rem", color: "var(--danger)", fontWeight: 600 }}>{s.accuracy}%</span>
                        <Link
                          href={`/setup?topic=${s.topicId}`}
                          style={{ fontSize: "0.72rem", background: "var(--accent-glow)", color: "var(--accent-bright)", border: "1px solid var(--border)", borderRadius: 6, padding: "0.125rem 0.5rem", textDecoration: "none" }}
                        >
                          Practice
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent attempts */}
          <div className="glass-card" style={{ padding: "1.5rem", flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>🕒 Recent Attempts</h2>
              <Link href="/review" style={{ fontSize: "0.78rem", color: "var(--accent-bright)", textDecoration: "none" }}>
                View all →
              </Link>
            </div>
            {recentAttempts.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No attempts yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {recentAttempts.map((a, i) => {
                  const topic = TOPICS.find((t) => t.id === a.topic);
                  const isCorrect = a.verdict === "correct";
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5rem", borderRadius: 8, background: "var(--bg-elevated)" }}>
                      <span style={{ fontSize: "0.9rem" }}>{isCorrect ? "✅" : a.verdict === "partial" ? "⚠️" : "❌"}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {a.prompt}
                        </p>
                        <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          {topic?.label} · {new Date(a.attempted_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span style={{ fontSize: "0.78rem", color: isCorrect ? "var(--success)" : "var(--danger)", fontWeight: 600, flexShrink: 0 }}>
                        {a.score}/{a.max_score}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
