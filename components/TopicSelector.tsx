"use client";

import { TOPICS } from "@/lib/topics";

interface TopicSelectorProps {
  selected: string[];
  onChange: (topics: string[]) => void;
}

export default function TopicSelector({ selected, onChange }: TopicSelectorProps) {
  const toggleTopic = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((t) => t !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const allSelected = selected.length === TOPICS.length;

  return (
    <div>
      {/* Select All toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>
          {selected.length} of {TOPICS.length} selected
        </p>
        <button
          className="btn-secondary"
          style={{ padding: "0.375rem 0.875rem", fontSize: "0.78rem" }}
          onClick={() => onChange(allSelected ? [] : TOPICS.map((t) => t.id))}
        >
          {allSelected ? "Deselect All" : "Select All"}
        </button>
      </div>

      {/* Topic grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "0.5rem",
        }}
      >
        {TOPICS.map((topic) => {
          const isSelected = selected.includes(topic.id);
          return (
            <button
              key={topic.id}
              onClick={() => toggleTopic(topic.id)}
              style={{
                background: isSelected ? "var(--accent-glow)" : "var(--bg-card)",
                border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 10,
                padding: "0.625rem 0.875rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = "var(--border-hover)";
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <span style={{ fontSize: "1rem" }}>{topic.emoji}</span>
              <span style={{ fontSize: "0.8rem", fontWeight: isSelected ? 600 : 400, color: isSelected ? "var(--accent-bright)" : "var(--text-secondary)" }}>
                {topic.label}
              </span>
              {isSelected && (
                <span
                  style={{
                    marginLeft: "auto",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    flexShrink: 0,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
