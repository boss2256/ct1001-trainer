import type { Attempt, Question } from "./validators";

// ── Keys ───────────────────────────────────────────────────────────────────────

const KEYS = {
  settings: "ct1001_settings",
  questionHistory: "ct1001_question_history",
  attempts: "ct1001_attempts",
  bookmarks: "ct1001_bookmarks",
} as const;

// ── Settings ───────────────────────────────────────────────────────────────────

export interface AppSettings {
  selectedTopics: string[];
  selectedQuestionType: string;
  selectedDifficulty: "easy" | "medium" | "hard";
  timedMode: boolean;
  questionCount: number;
  timerMinutes: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  selectedTopics: [],
  selectedQuestionType: "mixed",
  selectedDifficulty: "medium",
  timedMode: false,
  questionCount: 10,
  timerMinutes: 30,
};

export function getSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(KEYS.settings);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<AppSettings>): void {
  if (typeof window === "undefined") return;
  const current = getSettings();
  localStorage.setItem(KEYS.settings, JSON.stringify({ ...current, ...settings }));
}

// ── Question History (cache) ───────────────────────────────────────────────────

export function getQuestionHistory(): Question[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEYS.questionHistory);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveQuestion(question: Question): void {
  if (typeof window === "undefined") return;
  const history = getQuestionHistory();
  const exists = history.find((q) => q.question_id === question.question_id);
  if (!exists) {
    history.unshift(question);
    // Keep last 200
    localStorage.setItem(KEYS.questionHistory, JSON.stringify(history.slice(0, 200)));
  }
}

// ── Attempts ───────────────────────────────────────────────────────────────────

export function getAttempts(): Attempt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEYS.attempts);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAttempt(attempt: Attempt): void {
  if (typeof window === "undefined") return;
  const attempts = getAttempts();
  attempts.unshift(attempt);
  // Keep last 500
  localStorage.setItem(KEYS.attempts, JSON.stringify(attempts.slice(0, 500)));
}

export function clearAttempts(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.attempts);
}

// ── Bookmarks ──────────────────────────────────────────────────────────────────

export interface Bookmark {
  question: Question;
  label: string;
  saved_at: string;
}

export function getBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEYS.bookmarks);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBookmark(question: Question, label = ""): void {
  if (typeof window === "undefined") return;
  const bookmarks = getBookmarks();
  const exists = bookmarks.find((b) => b.question.question_id === question.question_id);
  if (!exists) {
    bookmarks.unshift({ question, label, saved_at: new Date().toISOString() });
    localStorage.setItem(KEYS.bookmarks, JSON.stringify(bookmarks));
  }
}

export function removeBookmark(questionId: string): void {
  if (typeof window === "undefined") return;
  const bookmarks = getBookmarks().filter((b) => b.question.question_id !== questionId);
  localStorage.setItem(KEYS.bookmarks, JSON.stringify(bookmarks));
}

// ── Analytics Helpers ──────────────────────────────────────────────────────────

export interface TopicStat {
  topicId: string;
  attempted: number;
  correct: number;
  accuracy: number;
  avgScore: number;
}

export function getTopicStats(): TopicStat[] {
  const attempts = getAttempts();
  const map = new Map<string, { attempted: number; correct: number; totalScore: number; maxScore: number }>();

  for (const a of attempts) {
    const entry = map.get(a.topic) ?? { attempted: 0, correct: 0, totalScore: 0, maxScore: 0 };
    entry.attempted++;
    if (a.verdict === "correct") entry.correct++;
    entry.totalScore += a.score;
    entry.maxScore += a.max_score;
    map.set(a.topic, entry);
  }

  return Array.from(map.entries()).map(([topicId, data]) => ({
    topicId,
    attempted: data.attempted,
    correct: data.correct,
    accuracy: data.attempted > 0 ? Math.round((data.correct / data.attempted) * 100) : 0,
    avgScore: data.maxScore > 0 ? Math.round((data.totalScore / data.maxScore) * 100) : 0,
  }));
}

export function getTotalStats() {
  const attempts = getAttempts();
  const correct = attempts.filter((a) => a.verdict === "correct").length;
  const accuracy = attempts.length > 0 ? Math.round((correct / attempts.length) * 100) : 0;

  // Streak: count consecutive days with at least one attempt
  const days = new Set(attempts.map((a) => a.attempted_at.split("T")[0]));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if (days.has(key)) streak++;
    else break;
  }

  return { total: attempts.length, correct, accuracy, streak };
}

// ── Session Question History (in-memory, not persisted) ──────────────────────────
let sessionQuestionIds: Set<string> = new Set();

export function initializeSession(): void {
  sessionQuestionIds = new Set();
}

export function addToSessionHistory(questionId: string): void {
  sessionQuestionIds.add(questionId);
}

export function getSessionHistory(): string[] {
  return Array.from(sessionQuestionIds);
}

export function clearSessionHistory(): void {
  sessionQuestionIds.clear();
}
