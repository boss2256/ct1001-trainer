import { NextRequest, NextResponse } from "next/server";
import { safeParseMarkingResult } from "@/lib/validators";

// ── Rate Limiting ──────────────────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30; // marks per minute

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
function buildMarkingPrompt(
  prompt: string,
  codeSnippet: string,
  correctAnswer: string,
  rubric: string,
  userAnswer: string
): string {
  return `You are a CT1001 Python exam marker. Mark the student's open-ended answer fairly.

QUESTION:
${prompt}

CODE:
\`\`\`python
${codeSnippet}
\`\`\`

EXPECTED ANSWER / IDEAL RESPONSE:
${correctAnswer}

MARKING RUBRIC:
${rubric || "Award marks based on correctness and completeness of the conceptual explanation."}

STUDENT'S ANSWER:
${userAnswer || "(blank)"}

MARKING INSTRUCTIONS:
- Score out of 5 (5=perfect, 4=minor omissions, 3=partial, 2=major gap, 1=slight relevance, 0=irrelevant/blank)
- Mark meaning, NOT exact wording. Accept correct paraphrases.
- what_is_correct: what the student got right (be specific)
- what_is_missing: what key points were missing or wrong (be specific)
- improvement_tip: one actionable improvement tip
- model_answer: a concise ideal answer (2-4 sentences)

Return ONLY valid JSON (no markdown, no backticks):
{
  "score": <0-5>,
  "max_score": 5,
  "verdict": <"correct" | "partial" | "incorrect">,
  "what_is_correct": "<string>",
  "what_is_missing": "<string>",
  "improvement_tip": "<string>",
  "model_answer": "<string>"
}`;
}

// ── Handler ────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({
      result: {
        score: 0,
        max_score: 5,
        verdict: "incorrect",
        what_is_correct: "",
        what_is_missing: "Rate limit reached. Please wait a moment before submitting again.",
        improvement_tip: "Try again in a minute.",
        model_answer: "",
      },
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key not configured. Cannot mark open-ended answers." },
      { status: 503 }
    );
  }

  let body: {
    prompt?: string;
    code_snippet?: string;
    correct_answer?: string;
    rubric?: string;
    user_answer?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { prompt = "", code_snippet = "", correct_answer = "", rubric = "", user_answer = "" } = body;
  const markingPrompt = buildMarkingPrompt(prompt, code_snippet, correct_answer, rubric, user_answer);
  const model = process.env.OPENAI_MODEL ?? "gpt-4-mini";

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
          messages: [{ role: "user", content: markingPrompt }],
          temperature: 0.3,
          max_completion_tokens: 600,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`[mark] OpenAI error ${response.status}:`, errText);
        break;
      }

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content;
      if (!raw) break;

      const parsed = JSON.parse(raw);
      const result = safeParseMarkingResult(parsed);

      if (result) {
        return NextResponse.json({ result });
      }
      console.warn(`[mark] Attempt ${attempt + 1}: invalid JSON shape, retrying...`);
    } catch (err) {
      console.error(`[mark] Attempt ${attempt + 1} failed:`, err);
    }
  }

  return NextResponse.json({ error: "Marking service temporarily unavailable. Please try again." }, { status: 500 });
}
