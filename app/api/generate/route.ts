import { NextRequest, NextResponse } from "next/server";
import { safeParseQuestion } from "@/lib/validators";
import { TOPICS } from "@/lib/topics";
import { FALLBACK_QUESTIONS } from "@/lib/fallback-questions";

// ── Rate Limiting (simple in-memory, resets per serverless instance) ───────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60; // requests per minute

// ── Circuit Breaker (skip OpenAI if quota is exhausted) ────────────────────────
let quotaExhausted = false;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) ?? { count: 0, resetAt: now + 60_000 };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + 60_000;
  }
  entry.count++;
  rateLimitMap.set(ip, entry);
  return entry.count <= RATE_LIMIT;
}

// ── Prompt Builder ─────────────────────────────────────────────────────────────
function buildPrompt(topic: string, difficulty: string, questionType: string, excludeCount: number = 0): string {
  const topicDef = TOPICS.find((t) => t.id === topic);
  const topicLabel = topicDef?.label ?? topic;
  const keywords = topicDef?.keywords.join(", ") ?? "";
  const description = topicDef?.description ?? "";

  const typeMap: Record<string, string> = {
    "multiple-choice": "multiple choice with 4 options (A–D)",
    "true-false": "true/false with options ['True', 'False']",
    "predict-output": "predict the output — open ended or MCQ",
    "find-bug": "find the bug — multiple choice identifying the issue",
    "identify-error": "identify the error type — multiple choice",
    "explain-bug": "explain what is wrong — open ended short answer",
    "explain-code": "explain what the code does — open ended short answer",
    mixed: "choose any appropriate type from: multiple choice, predict output, find the bug, explain the bug",
  };
  const typeInstruction = typeMap[questionType] ?? "multiple choice";

  const isOpenEnded = ["explain-bug", "explain-code"].includes(questionType) ||
    (questionType === "mixed");

  return `You are an expert CT1001 Introduction to Computational Thinking and Programming exam question generator.

Generate ONE exam-style Python code question with the following specifications:
- Topic: ${topicLabel} (${description})
- Relevant keywords: ${keywords}
- Difficulty: ${difficulty}
- Question type: ${typeInstruction}

STRICT RULES:
1. Code snippet must be 3–12 lines of Python only
2. Stay 100% within CT1001 syllabus scope (no decorators, async, metaclasses, complex recursion)
3. Test ONE main concept from the topic
4. ${difficulty === "hard" ? "Code may have subtly tricky logic requiring careful tracing" : difficulty === "medium" ? "Code should be clear but require understanding" : "Code should be simple and beginner-friendly"}
5. If question type is open-ended, include a detailed rubric. Otherwise set rubric to null.
6. options must be an array of 4 strings for MCQ/find-bug/identify-error. For open-ended, set options to null.
7. correct_answer must be the exact text of the correct option (for MCQ) or the ideal answer string (for open-ended)
${excludeCount > 0 ? `8. CRITICAL: This is question #${excludeCount + 1} in the user's session. Generate a COMPLETELY DIFFERENT question from all previous ones. 
   - Use different variable names, function names, and data structures
   - Test a different sub-concept within the topic
   - Use different algorithm patterns or execution flows
   - NEVER reuse the same code structure or edge cases from previous questions` : ""}

Return ONLY valid JSON (no markdown, no backticks) matching this schema exactly:
{
  "question_id": "gen-${Date.now()}-${Math.random().toString(36).slice(2, 7)}",
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "question_type": "${questionType === "mixed" ? "<chosen type>" : questionType}",
  "prompt": "<clear question prompt>",
  "code_snippet": "<python code>",
  "options": <["A", "B", "C", "D"] or null>,
  "correct_answer": "<answer>",
  "rubric": <"marking rubric string" or null>,
  "hint_level_1": "<conceptual hint, do NOT reveal answer>",
  "hint_level_2": "<more direct clue, still do NOT fully reveal>",
  "explanation": "<complete explanation of why the answer is correct and why distractors are wrong>",
  "common_trap": "<one common misconception students have>"
}`;
}

// ── Handler ────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    // Rate limited — serve a fallback question rather than blocking the user
    const fallback = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
    return NextResponse.json({ question: fallback, fallback: true });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || quotaExhausted) {
    const fallback = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
    return NextResponse.json({ question: fallback, fallback: true });
  }

  let body: { topic?: string; difficulty?: string; questionType?: string; excludeQuestionIds?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { topic = "python-basics", difficulty = "medium", questionType = "mixed", excludeQuestionIds = [] } = body;
  const prompt = buildPrompt(topic, difficulty, questionType, excludeQuestionIds.length);
  const model = process.env.OPENAI_MODEL ?? "gpt-5.4-mini";

  // Try up to 2 times for valid JSON
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
          max_completion_tokens: 1200,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`[generate] OpenAI error ${response.status}:`, errText);
        try {
          const errJson = JSON.parse(errText);
          if (errJson?.error?.code === "insufficient_quota") {
            quotaExhausted = true;
            console.warn("[generate] Quota exhausted — switching to fallback mode.");
          }
        } catch { /* ignore parse errors */ }
        break;
      }

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content;
      if (!raw) break;

      const parsed = JSON.parse(raw);
      const question = safeParseQuestion(parsed);

      if (question) {
        return NextResponse.json({ question, fallback: false });
      }
      console.warn(`[generate] Attempt ${attempt + 1}: invalid JSON shape, retrying...`);
    } catch (err) {
      console.error(`[generate] Attempt ${attempt + 1} failed:`, err);
    }
  }

  // All attempts failed — return a topic-matched fallback if possible
  const topicFallbacks = FALLBACK_QUESTIONS.filter((q) => q.topic === topic);
  const fallback = topicFallbacks.length > 0
    ? topicFallbacks[Math.floor(Math.random() * topicFallbacks.length)]
    : FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];

  return NextResponse.json({ question: fallback, fallback: true });
}
