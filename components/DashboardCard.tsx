"use client";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color?: string;
}

export default function DashboardCard({ title, value, subtitle, icon, color = "var(--accent)" }: DashboardCardProps) {
  return (
    <div
      className="glass-card"
      style={{
        padding: "1.25rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>{title}</span>
        <span style={{ fontSize: "1.5rem" }}>{icon}</span>
      </div>
      <div style={{ fontSize: "2rem", fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      {subtitle && <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{subtitle}</div>}
    </div>
  );
}
