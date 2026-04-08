"use client";

import { useEffect, useState, useCallback } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  totalSeconds: number;
  onExpired?: () => void;
}

export default function Timer({ totalSeconds, onExpired }: TimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);

  const tick = useCallback(() => {
    setRemaining((prev) => {
      if (prev <= 1) {
        onExpired?.();
        return 0;
      }
      return prev - 1;
    });
  }, [onExpired]);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick, remaining]);

  const pct = (remaining / totalSeconds) * 100;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const color = pct > 50 ? "var(--success)" : pct > 20 ? "var(--warning)" : "var(--danger)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.625rem",
        padding: "0.5rem 0.875rem",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 10,
      }}
    >
      <Clock size={15} style={{ color }} />
      <div>
        <div style={{ fontSize: "1rem", fontWeight: 700, color, fontFamily: "JetBrains Mono, monospace" }}>
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
        <div className="progress-bar" style={{ width: 80, marginTop: "0.25rem" }}>
          <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>
    </div>
  );
}
