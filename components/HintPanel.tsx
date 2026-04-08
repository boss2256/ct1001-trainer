"use client";

import { useState } from "react";
import { Lightbulb, ChevronDown } from "lucide-react";

interface HintPanelProps {
  hint1: string;
  hint2: string;
}

export default function HintPanel({ hint1, hint2 }: HintPanelProps) {
  const [level, setLevel] = useState(0); // 0=hidden, 1=hint1, 2=hint2

  return (
    <div>
      {level === 0 && (
        <button
          className="btn-secondary"
          onClick={() => setLevel(1)}
          style={{ gap: "0.5rem" }}
        >
          <Lightbulb size={15} style={{ color: "var(--warning)" }} />
          Show Hint
        </button>
      )}

      {level >= 1 && (
        <div
          className="animate-fade-in"
          style={{
            background: "var(--warning-glow)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            borderRadius: 12,
            padding: "0.875rem 1.125rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
            <Lightbulb size={16} style={{ color: "var(--warning)", flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--warning)", marginBottom: "0.25rem" }}>
                Hint {level}
              </p>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                {level === 1 ? hint1 : hint2}
              </p>
            </div>
          </div>

          {level === 1 && (
            <button
              onClick={() => setLevel(2)}
              style={{
                marginTop: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                background: "none",
                border: "none",
                color: "var(--warning)",
                fontSize: "0.78rem",
                cursor: "pointer",
                padding: 0,
                fontWeight: 500,
              }}
            >
              <ChevronDown size={13} />
              I need another hint
            </button>
          )}
        </div>
      )}
    </div>
  );
}
