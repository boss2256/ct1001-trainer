"use client";

import Link from "next/link";
import { ArrowRight, Brain, Zap, BarChart2, RefreshCw, BookOpen, CheckCircle } from "lucide-react";
import { TOPICS } from "@/lib/topics";

const FEATURES = [
  { icon: Brain, title: "AI-Generated Questions", desc: "Fresh Python snippet questions on every regeneration, powered by GPT-4o-mini." },
  { icon: Zap, title: "Instant Feedback", desc: "Multiple choice graded instantly. Open-ended answers scored by AI with detailed rubric." },
  { icon: RefreshCw, title: "Unlimited Practice", desc: "Generate as many variants as you need on the same concept until you've mastered it." },
  { icon: BarChart2, title: "Progress Tracking", desc: "Dashboard shows accuracy by topic stored locally — no login required." },
  { icon: BookOpen, title: "2-Level Hints", desc: "Get a concept nudge first, then a more direct clue — without spoiling the answer." },
  { icon: CheckCircle, title: "Exam Realistic", desc: "Questions test code reading: predict output, find bugs, identify errors, explain logic." },
];

const QUESTION_TYPES = [
  "Predict the Output",
  "Find the Bug",
  "Identify the Error Type",
  "Explain What's Wrong",
  "Multiple Choice",
  "Trace the Logic",
  "Concept Recognition",
];

export default function LandingPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
      {/* Hero */}
      <section style={{ textAlign: "center", padding: "5rem 1rem 3.5rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--accent-glow)", border: "1px solid var(--border)", borderRadius: 20, padding: "0.375rem 1rem", marginBottom: "2rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--accent-bright)", fontWeight: 600 }}>🎓 CT1001 · Introduction to Computational Thinking</span>
        </div>

        <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 1.25rem" }}>
          Ace Your Exam with{" "}
          <span className="gradient-text">Smart Practice</span>
        </h1>

        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 580, margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
          AI-generated Python snippet questions that match your exam style. Read, analyze, and debug short code — not write full programs.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/setup" className="btn-primary" style={{ padding: "0.875rem 2rem", fontSize: "1rem" }}>
            Start Practising <ArrowRight size={18} />
          </Link>
          <Link href="/dashboard" className="btn-secondary" style={{ padding: "0.875rem 2rem", fontSize: "1rem" }}>
            View Dashboard <BarChart2 size={16} />
          </Link>
        </div>

        {/* Floating question type pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginTop: "2.5rem" }}>
          {QUESTION_TYPES.map((qt) => (
            <span key={qt} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, padding: "0.25rem 0.75rem", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
              {qt}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "2.5rem 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--accent-glow)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={18} style={{ color: "var(--accent-bright)" }} />
                </div>
                <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>{title}</h3>
              </div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Topics Overview */}
      <section style={{ padding: "2.5rem 0 5rem" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.5rem" }}>
          📚 All 20 CT1001 Topics Covered
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.5rem" }}>
          {TOPICS.map((t) => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.625rem 0.875rem", background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 10 }}>
              <span style={{ fontSize: "1.1rem" }}>{t.emoji}</span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{t.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
