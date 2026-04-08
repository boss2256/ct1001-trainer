"use client";

import { TOPICS } from "@/lib/topics";
import type { TopicStat } from "@/lib/storage";

interface TopicProgressBarProps {
  stat: TopicStat;
}

export default function TopicProgressBar({ stat }: TopicProgressBarProps) {
  const topic = TOPICS.find((t) => t.id === stat.topicId);
  const pct = stat.accuracy;
  const color = pct >= 75 ? "var(--success)" : pct >= 50 ? "var(--warning)" : "var(--danger)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
          {topic?.emoji} {topic?.label ?? stat.topicId}
        </span>
        <span style={{ fontSize: "0.78rem", fontWeight: 600, color }}>
          {pct}% <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({stat.attempted} Q)</span>
        </span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
