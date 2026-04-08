import { z } from "zod";

// ── Question Schema ────────────────────────────────────────────────────────────

export const QuestionSchema = z.object({
  question_id: z.string(),
  topic: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  question_type: z.string(),
  prompt: z.string(),
  code_snippet: z.string(),
  options: z.array(z.string()).nullable().optional(),
  correct_answer: z.string(),
  rubric: z.string().optional().nullable(),
  hint_level_1: z.string(),
  hint_level_2: z.string(),
  explanation: z.string(),
  common_trap: z.string().optional().nullable(),
});

export type Question = z.infer<typeof QuestionSchema>;

// ── Marking Schema ─────────────────────────────────────────────────────────────

export const MarkingResultSchema = z.object({
  score: z.number(),
  max_score: z.number(),
  verdict: z.enum(["correct", "partial", "incorrect"]),
  what_is_correct: z.string(),
  what_is_missing: z.string(),
  improvement_tip: z.string(),
  model_answer: z.string(),
});

export type MarkingResult = z.infer<typeof MarkingResultSchema>;

// ── Attempt Schema ─────────────────────────────────────────────────────────────

export const AttemptSchema = z.object({
  question_id: z.string(),
  topic: z.string(),
  difficulty: z.string(),
  question_type: z.string(),
  prompt: z.string(),
  code_snippet: z.string(),
  correct_answer: z.string(),
  user_answer: z.string(),
  score: z.number(),
  max_score: z.number(),
  verdict: z.string(),
  feedback: MarkingResultSchema.nullable().optional(),
  attempted_at: z.string(),
  is_bookmarked: z.boolean().optional(),
});

export type Attempt = z.infer<typeof AttemptSchema>;

// ── Helpers ────────────────────────────────────────────────────────────────────

export function safeParseQuestion(raw: unknown): Question | null {
  const result = QuestionSchema.safeParse(raw);
  if (result.success) return result.data;
  console.error("[validators] Question parse failed:", result.error.flatten());
  return null;
}

export function safeParseMarkingResult(raw: unknown): MarkingResult | null {
  const result = MarkingResultSchema.safeParse(raw);
  if (result.success) return result.data;
  console.error("[validators] Marking parse failed:", result.error.flatten());
  return null;
}
