# Craft Skills Coach

An AI-powered coaching tool for PgM, TPM, and BizOps practitioners at Intuit. Paste a real work artifact — a strategy doc, email, Slack thread, stakeholder feedback, or meeting notes — and get a structured coaching note grounded in the AI-native craft skills rubric.

Built for the 3X PM/XD Claude Hackathon · May 2026.

---

## What it does

- **Skills Coach** — evaluates a pasted artifact against the AI-native craft skills (CS1–CS7), calibrated to your job family and level. Returns findings across five lenses: what changed, human contribution, where AI raised the floor, where judgment is the differentiator, and AI fluency behavior.
- **Browse the Skills** — interactive walkthrough of all craft skills with expandable cards, a level slider, and section filters.
- **The Story** — a split-screen narrative following two PgMs (Maya and Jordan) preparing for the same high-stakes leadership review — four days, two approaches, one reveal.

Accepts Google Doc/Sheet/Slides URLs and Slack thread URLs directly — no copy-pasting required.

---

## Running locally

### Prerequisites

- Node 18+
- [Claude Code](https://claude.ai/claude-code) installed and logged in (`claude --version`)

### 1. Install dependencies

```bash
npm install
```

### 2. Start the proxy server

The app authenticates via your Claude Code session — no API key needed.

```bash
node proxy.mjs
```

This starts the proxy at `http://localhost:3001`. Keep it running in a separate terminal.

### 3. Start the dev server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Deploying to GitHub Pages

The repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml` that builds and deploys automatically on every push to `main`.

### One-time setup

1. Go to your repo on GitHub → **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Push to `main` — the workflow handles the rest

The app will be live at `https://navya-ck.github.io/pgm-bizops-craft-skills/`

> **Note:** The deployed static build is a demo shell. Live evaluation requires the local proxy (`node proxy.mjs`) and a Claude Code session running on the same machine.

---

## Updating content

### Evaluation rubric

The system prompt (what Claude evaluates against) is in **`src/lib/claudeClient.ts`**, `const SYSTEM_PROMPT` at the top of the file. It contains the full CS1–CS7 rubric, five evaluation lenses, source-type conditioning, level calibration, and output schema.

### Skills Walkthrough content

All skill definitions, examples, prompts, and level descriptions are in the `SKILLS` array in **`src/views/SkillsWalkthrough.tsx`**. Each entry has:

```ts
{
  id: 'CS1',
  name: 'Connect Strategy to Execution',
  jobFamily?: 'BizOps only' | 'PgM / PjM only' | 'TPM only',
  tagline: '...',
  good: '...',            // What good looks like
  changed: '...',         // What changed with AI
  hero: '...',            // Hero example
  antihero: '...',        // Anti-hero example
  prompt: '...',          // Prompt to try
  fluencyBehavior: '...', // AI Fluency lens
  levelDescriptions: { Manager: '...', Senior: '...', Staff: '...', Principal: '...', Director: '...', VP: '...' }
}
```

### The Story

The four-day narrative is in the `STORY` object in **`src/views/Story.tsx`**. Each day has `maya` and `jordan` panels with a `headline` and `beats[]` array. Beat types: `action` | `prompt` | `moment` | `gap`.

---

## Architecture

```
craft-skills-coach/
├── proxy.mjs              # Local proxy — spawns claude CLI, handles SSE streaming + GDrive/Slack URLs
├── src/
│   ├── lib/
│   │   └── claudeClient.ts   # System prompt + streaming client
│   ├── views/
│   │   ├── SkillsCoach.tsx       # Input form + evaluation flow
│   │   ├── SkillsWalkthrough.tsx # Browse the Skills
│   │   └── Story.tsx             # The Story (Maya vs Jordan)
│   └── components/
│       └── CoachingNote.tsx      # Output rendering + copy button
├── .github/workflows/
│   └── deploy.yml         # GitHub Pages deployment
└── vite.config.ts         # base: '/craft-skills-coach/'
```

**Auth:** The proxy spawns a `claude` CLI subprocess using your existing Claude Code login session. No Anthropic API key is required.

**Google Docs / Slack:** When a URL is detected, the proxy signals this Claude Code session to fetch content via MCP, caches it, and retries evaluation with the content injected.

---

## Tech stack

- React 19 + TypeScript, Vite
- CSS Modules (no UI library)
- `vite-plugin-singlefile` — bundles to a single HTML file for easy sharing
- Local Express proxy (`proxy.mjs`) — SSE streaming bridge to `claude` CLI
