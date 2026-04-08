"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Bookmark, Send, ChevronRight, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import CodeSnippet from "@/components/CodeSnippet";
import HintPanel from "@/components/HintPanel";
import FeedbackPanel from "@/components/FeedbackPanel";
import QuestionBadges from "@/components/QuestionBadges";
import Timer from "@/components/Timer";
import { getSettings, saveAttempt, saveBookmark, getBookmarks, type AppSettings, initializeSession, addToSessionHistory, getSessionHistory } from "@/lib/storage";
import type { Question, MarkingResult } from "@/lib/validators";

type Phase = "loading" | "answering" | "feedback" | "error";

const OPEN_ENDED_TYPES = ["explain-bug", "explain-code"];

function isOpenEnded(qt: string): boolean {
  return OPEN_ENDED_TYPES.includes(qt) || (qt === "mixed");
}

function pickRandomTopic(topics: string[]): string {
  return topics[Math.floor(Math.random() * topics.length)];
}

export default function PracticePage() {
  const router = useRouter();
  const hasGeneratedRef = useRef(false);
  const [settings, setSettingsState] = useState<AppSettings | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [openText, setOpenText] = useState("");
  const [marking, setMarking] = useState(false);
  const [markingResult, setMarkingResult] = useState<MarkingResult | null>(null);
  const [verdict, setVerdict] = useState<string>("incorrect");
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(1);
  const [isFallback, setIsFallback] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Load settings only after hydration
  useEffect(() => {
    const loadedSettings = getSettings();
    setSettingsState(loadedSettings);
    hasGeneratedRef.current = false; // Reset ref when settings load
    initializeSession(); // Start session history tracking
  }, []);

  // Use default settings as fallback while loading
  const currentSettings = settings || {
    selectedTopics: [],
    selectedQuestionType: "mixed",
    selectedDifficulty: "medium" as const,
    timedMode: false,
    questionCount: 10,
    timerMinutes: 30,
  };

  const { selectedTopics, selectedQuestionType, selectedDifficulty, timedMode, timerMinutes, questionCount } = currentSettings;

  const generateQuestion = useCallback(async () => {
    if (selectedTopics.length === 0) {
      router.push("/setup");
      return;
    }
    setPhase("loading");
    setSelectedOption(null);
    setOpenText("");
    setMarkingResult(null);
    setIsBookmarked(false);
    setErrorMsg("");

    const topic = pickRandomTopic(selectedTopics);
    const sessionHistory = getSessionHistory();
    const body = JSON.stringify({ 
      topic, 
      difficulty: selectedDifficulty, 
      questionType: selectedQuestionType,
      excludeQuestionIds: sessionHistory, // Pass questions we've already shown
    });

    let lastErr: unknown;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });

        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();

        setQuestion(data.question);
        setIsFallback(data.fallback ?? false);

        // Track this question in the session
        addToSessionHistory(data.question.question_id);

        const qt = data.question.question_type;
        setMaxScore(OPEN_ENDED_TYPES.includes(qt) ? 5 : 1);
        setPhase("answering");
        return;
      } catch (err) {
        lastErr = err;
        console.warn(`[practice] generate attempt ${attempt + 1} failed:`, err);
      }
    }

    console.error("[practice] all generate attempts failed:", lastErr);
    setErrorMsg("Failed to generate question. Check your connection or API key.");
    setPhase("error");
  }, [selectedTopics, selectedDifficulty, selectedQuestionType, router]);

  // Generate question after settings are loaded (only once)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!settings || hasGeneratedRef.current) return;
    
    if (selectedTopics.length === 0) {
      router.push("/setup");
      return;
    }
    
    hasGeneratedRef.current = true;
    generateQuestion();
  }, [settings]);

  // Check bookmark status when question changes
  useEffect(() => {
    if (question) {
      const bookmarks = getBookmarks();
      setIsBookmarked(bookmarks.some((b) => b.question.question_id === question.question_id));
    }
  }, [question]);

  // Early exit if settings not loaded
  if (!settings) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
  }

  const handleMCQSubmit = () => {
    if (!question || !selectedOption) return;
    const correct = selectedOption.trim() === question.correct_answer.trim();
    const v = correct ? "correct" : "incorrect";
    const s = correct ? 1 : 0;

    setVerdict(v);
    setScore(s);
    setMaxScore(1);

    saveAttempt({
      question_id: question.question_id,
      topic: question.topic,
      difficulty: question.difficulty,
      question_type: question.question_type,
      prompt: question.prompt,
      code_snippet: question.code_snippet,
      correct_answer: question.correct_answer,
      user_answer: selectedOption,
      score: s,
      max_score: 1,
      verdict: v,
      feedback: null,
      attempted_at: new Date().toISOString(),
    });

    setQuestionsAnswered((n) => n + 1);
    setPhase("feedback");
  };

  const handleOpenEndedSubmit = async () => {
    if (!question) return;
    setMarking(true);

    try {
      const res = await fetch("/api/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: question.prompt,
          code_snippet: question.code_snippet,
          correct_answer: question.correct_answer,
          rubric: question.rubric ?? "",
          user_answer: openText,
        }),
      });

      if (!res.ok) throw new Error("Marking API error");
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      const result: MarkingResult = data.result;
      setMarkingResult(result);

      const s = result.score;
      const m = result.max_score;
      const v = result.verdict;

      setScore(s);
      setMaxScore(m);
      setVerdict(v);

      saveAttempt({
        question_id: question.question_id,
        topic: question.topic,
        difficulty: question.difficulty,
        question_type: question.question_type,
        prompt: question.prompt,
        code_snippet: question.code_snippet,
        correct_answer: question.correct_answer,
        user_answer: openText,
        score: s,
        max_score: m,
        verdict: v,
        feedback: result,
        attempted_at: new Date().toISOString(),
      });

      setQuestionsAnswered((n) => n + 1);
      setPhase("feedback");
    } catch (err) {
      console.error("[practice] marking failed:", err);
      setErrorMsg("Marking failed. Please try again.");
    } finally {
      setMarking(false);
    }
  };

  const handleBookmark = () => {
    if (!question) return;
    saveBookmark(question);
    setIsBookmarked(true);
  };

  const openEndedMode = question ? OPEN_ENDED_TYPES.includes(question.question_type) : false;

  // Progress
  const progressPct = questionCount > 0 ? Math.min((questionsAnswered / questionCount) * 100, 100) : 0;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1.5rem" }}>
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button className="btn-secondary" onClick={() => router.push("/setup")} style={{ padding: "0.375rem 0.75rem", fontSize: "0.8rem" }}>
            <ArrowLeft size={14} /> Setup
          </button>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {questionsAnswered} / {questionCount} answered
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {isFallback && (
            <span style={{ fontSize: "0.72rem", color: "var(--warning)", background: "var(--warning-glow)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 6, padding: "0.25rem 0.5rem" }}>
              ⚡ Fallback Q
            </span>
          )}
          {timedMode && <Timer totalSeconds={timerMinutes * 60} onExpired={() => router.push("/dashboard")} />}
        </div>
      </div>

      {/* Session progress bar */}
      <div className="progress-bar" style={{ marginBottom: "1.5rem" }}>
        <div className="progress-fill" style={{ width: `${progressPct}%`, background: "var(--accent)" }} />
      </div>

      {/* Loading */}
      {phase === "loading" && (
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <Loader2 size={36} style={{ color: "var(--accent-bright)", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} />
          <p style={{ color: "var(--text-secondary)" }}>Generating your question…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Error */}
      {phase === "error" && (
        <div className="glass-card" style={{ padding: "2.5rem", textAlign: "center" }}>
          <AlertTriangle size={40} style={{ color: "var(--danger)", margin: "0 auto 1rem" }} />
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>{errorMsg}</p>
          <button className="btn-primary" onClick={generateQuestion}>
            <RefreshCw size={15} /> Try Again
          </button>
        </div>
      )}

      {/* Question card */}
      {question && (phase === "answering" || phase === "feedback") && (
        <div className="animate-fade-in">
          {/* Badges + action buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <QuestionBadges topic={question.topic} difficulty={question.difficulty} questionType={question.question_type} />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                className="btn-secondary"
                onClick={handleBookmark}
                disabled={isBookmarked}
                style={{ padding: "0.375rem 0.75rem", fontSize: "0.78rem" }}
                title="Save question"
              >
                <Bookmark size={13} fill={isBookmarked ? "currentColor" : "none"} />
                {isBookmarked ? "Saved" : "Save"}
              </button>
              <button
                className="btn-secondary"
                onClick={generateQuestion}
                style={{ padding: "0.375rem 0.75rem", fontSize: "0.78rem" }}
              >
                <RefreshCw size={13} /> New Q
              </button>
            </div>
          </div>

          {/* Prompt */}
          <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
            <p style={{ margin: 0, fontSize: "1rem", fontWeight: 600, lineHeight: 1.6 }}>{question.prompt}</p>
          </div>

          {/* Code snippet */}
          {question.code_snippet && (
            <div style={{ marginBottom: "1.25rem" }}>
              <CodeSnippet code={question.code_snippet} />
            </div>
          )}

          {/* Answer area */}
          {phase === "answering" && (
            <div style={{ marginBottom: "1.25rem" }}>
              {/* MCQ options */}
              {question.options && question.options.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                  {question.options.map((opt, i) => {
                    const isSelected = selectedOption === opt;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedOption(opt)}
                        style={{
                          background: isSelected ? "var(--accent-glow)" : "var(--bg-card)",
                          border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
                          borderRadius: 10,
                          padding: "0.75rem 1rem",
                          cursor: "pointer",
                          textAlign: "left",
                          color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                          fontSize: "0.875rem",
                          fontWeight: isSelected ? 500 : 400,
                          transition: "all 0.15s",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                        }}
                      >
                        <span
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: isSelected ? "var(--accent)" : "var(--bg-elevated)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            color: isSelected ? "white" : "var(--text-muted)",
                            flexShrink: 0,
                          }}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Open-ended textarea */}
              {openEndedMode && (
                <textarea
                  value={openText}
                  onChange={(e) => setOpenText(e.target.value)}
                  placeholder="Type your answer here… Explain clearly in your own words."
                  rows={5}
                  style={{
                    width: "100%",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: "0.875rem 1rem",
                    color: "var(--text-primary)",
                    fontSize: "0.875rem",
                    resize: "vertical",
                    outline: "none",
                    fontFamily: "Inter, sans-serif",
                    lineHeight: 1.65,
                    marginBottom: "0.75rem",
                    boxSizing: "border-box",
                  }}
                />
              )}

              {/* Hint */}
              <div style={{ marginBottom: "0.875rem" }}>
                <HintPanel hint1={question.hint_level_1} hint2={question.hint_level_2} />
              </div>

              {/* Submit */}
              <button
                className="btn-primary"
                onClick={openEndedMode ? handleOpenEndedSubmit : handleMCQSubmit}
                disabled={marking || (openEndedMode ? !openText.trim() : !selectedOption)}
                style={{ width: "100%", justifyContent: "center", padding: "0.75rem" }}
              >
                {marking ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Marking…</> : <><Send size={15} /> Submit Answer</>}
              </button>
            </div>
          )}

          {/* Feedback */}
          {phase === "feedback" && (
            <div style={{ marginBottom: "1.25rem" }}>
              <FeedbackPanel
                verdict={verdict}
                score={score}
                maxScore={maxScore}
                correctAnswer={question.correct_answer}
                explanation={question.explanation}
                markingResult={markingResult}
                selectedOption={selectedOption}
                isOpenEnded={openEndedMode}
                commonTrap={question.common_trap}
              />
              <button
                className="btn-primary"
                onClick={generateQuestion}
                style={{ width: "100%", justifyContent: "center", padding: "0.75rem", marginTop: "1rem" }}
              >
                Next Question <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
