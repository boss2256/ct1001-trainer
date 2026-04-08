# CT1001 Exam Practice Trainer

An AI-powered practice app for CT1001 Introduction to Computational Thinking and Programming.

## What it does

- Generates exam-style Python code snippet questions using AI (GPT-4o-mini)
- Supports multiple choice, predict output, find the bug, identify error type, and open-ended questions
- Covers all 20 CT1001 topics
- AI marks open-ended answers with detailed feedback
- Two-level hints that don't spoil the answer
- Dashboard with accuracy tracking per topic (all stored locally — no login needed)
- Review page for incorrect answers and saved bookmarks
- Falls back to 15 built-in questions if the API is unavailable

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```
Then edit `.env.local` and add your OpenAI API key.

### 3. Run locally
```bash
npm run dev
```
Open http://localhost:3000

## Deploying to Railway

1. Push this repo to GitHub
2. Create a new project on [Railway](https://railway.app)
3. Connect your GitHub repo
4. Add the environment variable `OPENAI_API_KEY` in Railway's Variables tab
5. Deploy — Railway will automatically detect Next.js and build it

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- OpenAI API (gpt-4o-mini)
- Local browser storage (no database)

## Project Structure

```text
app/
  page.tsx          — Landing page
  layout.tsx        — Root layout + nav
  dashboard/        — Progress dashboard
  setup/            — Practice session setup
  practice/         — Question answering page
  review/           — Incorrect answers + bookmarks
  api/
    generate/       — Question generation endpoint
    mark/           — Open-ended marking endpoint

components/         — Reusable UI components
lib/
  topics.ts         — 20 CT1001 topic definitions
  storage.ts        — localStorage utilities
  validators.ts     — Zod schemas
  fallback-questions.ts — Static question bank
```

## Notes

- All user data is stored in your browser's localStorage. Clearing browser storage will reset your history.
- The API key is never exposed to the browser — all OpenAI calls go through Next.js API routes.
