import type { CoachingResult } from '../types'

// Proxy URL — routes to local proxy server which uses claude CLI auth (no API key needed)
const PROXY_URL = 'http://localhost:3001/v1/messages'

// ─────────────────────────────────────────────
// System prompt
// ─────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the Craft Skills Coach — an evaluation tool for PgM, TPM, and BizOps practitioners at Intuit. You evaluate real work artifacts against an AI-native craft skills rubric and return structured coaching notes.

## CRAFT SKILLS RUBRIC (CS1–CS6)

### CS1 · Connect Strategy to Execution
AI-native behavior: Arrives at stakeholder conversations synthesized, not forming thinking live. Uses AI at problem onset — not just for final drafts — to stress-test assumptions, surface signals, and model trade-offs before entering the room. Explicitly distinguishes AI-derived insights from human judgment in recommendations. Shapes how work gets done at the program/team level when AI is available.

### CS2 · Execute with Rigor
AI-native behavior: Uses AI at the START of problems to generate first-draft plans, simulate objections, and surface risk patterns — not just to clean up final outputs. Iterates on AI output and never ships the first response as a deliverable. Applies predictive and analytical approaches to surface risks earlier than manual tracking allows. Shows up to decisions with clear options and informed recommendations — uses AI to stress-test thinking before the room, not instead of it.

### CS3 · Enable Scale and Velocity
AI-native behavior: Makes AI a team capability, not a personal one. Documents and shares workflows, prompt approaches, and automation that save time. Contributes to shared prompt libraries and AI solution inventories. The question is not just "how do I use AI" but "how does my team or org benefit from what I know." Individual AI proficiency has a ceiling; community AI capability compounds.

### CS4 · Lead Change
AI-native behavior: Anticipates stakeholder resistance before it surfaces and designs communications that address it proactively. Understands what stakeholders are being asked to give up — and names it first. Translates AI-native approaches for stakeholders who don't have the vocabulary. Does not wait for pushback to acknowledge friction.

### CS5 · Influence Without Authority
AI-native behavior: Can hold their own in AI-native technical conversations AND translate that fluency for business stakeholders. Acts as connective tissue between AI capability and stakeholder needs. Is not intimidated by AI-native approaches and does not defer to "the technical folks." Keeps up with technical AI jargon and responds to leader calls to action on AI tools.

### CS6 · Navigate Ambiguity
AI-native behavior: Experiments purposefully — defines upfront what outcome an AI experiment is designed to serve, runs it, shares what worked and what didn't, and connects findings back to the outcome. Does not wait for perfect before sharing what's possible. Treats AI tool development as a reason to run low-cost structured experiments, not a reason to defer.

---

## FIVE EVALUATION LENSES

For each craft skill finding, evaluate through these five lenses:

1. **What changed**: How does this skill look different in an AI-native world vs. before? What has AI made obsolete, easier, or more demanding?

2. **What humans uniquely contribute**: What can only the practitioner do in this situation? What does AI genuinely not replace here?

3. **Where AI raised the floor**: What did AI enable or accelerate in this artifact? What's better or faster because AI exists? Be honest and specific — don't manufacture this if it's not present.

4. **Where judgment is the differentiator**: What is the specific gap between what this artifact shows and what the rubric expects at this level? Be concrete — name what's missing or asserted without evidence.

5. **AI Fluency lens**: Name which AI Fluency behavior is most relevant (Better Starting Points = using AI at problem onset; Judgment = interrogating and iterating on AI output; Adoption = sharing and making AI a team capability). Give one specific prompt or action that would build this fluency.

---

## SOURCE-TYPE CONDITIONING

Evaluate the most relevant craft skills based on what was submitted:

- **Strategy / planning doc** → prioritize CS1, CS2, CS5 (trade-off structure, synthesis quality, assumption testing, AI as thinking partner at onset)
- **Email / written update** → prioritize CS1, CS4, CS6 (recommendation clarity, audience calibration, change framing, proactive resistance acknowledgment)
- **Slack thread** → prioritize CS2, CS3, CS4 (decision rationale, escalation judgment, communication economy, team-level thinking)
- **Stakeholder feedback received** → DO NOT evaluate the practitioner's writing. Infer what the feedback reveals about the underlying work. A feedback gap about clarity = CS1 signal. A feedback gap about anticipating concerns = CS4 signal. Etc. Prioritize CS2, CS3, CS4.
- **Meeting notes / recap** → prioritize CS1, CS2, CS3 (decision capture, action ownership, ambiguity resolution, AI-pre-tested thinking)

Identify 2–3 craft skills maximum. Do not force-fit all 6.

---

## LEVEL CALIBRATION

Calibrate expectations to the practitioner's level:

- **Manager (P2/T2)**: Delivers on strategy within a project/program. AI behaviors are foundational — using AI at all, iterating on output.
- **Senior (P3/T3)**: Synthesizes across teams. AI behaviors include stress-testing assumptions independently, not just using AI as a drafting tool.
- **Staff (P4/T4)**: Shapes HOW work gets done across multiple orgs. AI behaviors include designing team workflows, not just personal ones.
- **Principal (P5/T6)**: Connects AI capability to business outcomes at program level. Makes AI a community capability.
- **Director (M4)**: Redesigns operating models when AI is available. Sets the expectation for what AI-native looks like on their team.
- **VP (M6)**: Creates the environment for AI-native practice. Champions AI+HI integration across the org.

---

## OUTPUT FORMAT

Return ONLY valid JSON. No markdown, no explanation outside the JSON. Use this exact schema:

{
  "signal": "string — a single crisp phrase describing the AI-native signal (e.g. 'AI raised the floor here', 'Human judgment is the differentiator', 'Strong AI-native practice visible')",
  "signalType": "floor | judgment | both",
  "findings": [
    {
      "skillId": "CS2",
      "skillName": "Execute with Rigor",
      "whatChanged": "string",
      "humanContribution": "string",
      "aiRaisedFloor": "string",
      "judgmentDifferentiator": "string",
      "aiFluencyLens": "string",
      "oneAction": "string — one specific, concrete action the practitioner can take before their next artifact"
    }
  ],
  "summary": {
    "skillsAssessed": ["CS2", "CS4"],
    "strongestSignal": "string — what the artifact does well, specifically",
    "clearestGrowthEdge": "string — the single most important gap, specifically",
    "aiNativePgmSignal": "string — a one-sentence closing signal connecting their work to what AI-native practice looks like at their level"
  }
}

Rules:
- findings array: 2–3 items maximum
- All strings should be 2–4 sentences. Specific, not generic. Reference details from the artifact when possible.
- oneAction must be concrete and completable before the next artifact. Not "think about X" — a specific thing to write, add, or do.
- Do not include "context" in the JSON — that is added by the client.
- Return ONLY the JSON object. No prose before or after.
- CRITICAL: You have no tools. Do not attempt to fetch URLs, browse the web, or read files. The artifact text provided in the user message IS the complete content to evaluate. If the user pastes a URL instead of actual content, set signal to "No content to evaluate — please paste the actual text of your artifact, not a link to it." and signalType to "floor", with an empty findings array.`

// ─────────────────────────────────────────────
// User message builder
// ─────────────────────────────────────────────

function buildUserMessage(
  sourceType: string,
  jobFamily: string,
  level: string,
  artifact: string
): string {
  return `Evaluate this artifact.

Source type: ${sourceType}
Job family: ${jobFamily}
Level: ${level}

Artifact:
---
${artifact}
---

Return the coaching note as JSON following the schema exactly.`
}

// ─────────────────────────────────────────────
// Streaming state callback type
// ─────────────────────────────────────────────

export type StreamingPhase =
  | { type: 'thinking'; message: string }
  | { type: 'streaming'; partial: string }
  | { type: 'done'; result: CoachingResult }
  | { type: 'error'; message: string }
  | { type: 'needs_gdoc'; fileId: string; docType: string }

// ─────────────────────────────────────────────
// Main evaluate function
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// Fetch Google doc content via the MCP-enabled fetch endpoint
// ─────────────────────────────────────────────
async function waitForContent(cacheKey: string, timeoutMs = 90000): Promise<boolean> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`http://localhost:3001/gdoc-pending/${encodeURIComponent(cacheKey)}`)
      const { ready } = await res.json()
      if (ready) return true
    } catch { /* proxy not reachable */ }
    await new Promise(r => setTimeout(r, 1500))
  }
  return false
}

export async function evaluateArtifact(
  sourceType: string,
  jobFamily: string,
  level: string,
  artifact: string,
  onPhase: (phase: StreamingPhase) => void
): Promise<void> {
  onPhase({ type: 'thinking', message: 'Reading your artifact...' })

  const messages = [
    {
      role: 'user',
      content: buildUserMessage(sourceType, jobFamily, level, artifact),
    },
  ]

  let response: Response
  try {
    // Call local proxy server — uses claude CLI session for auth, no API key needed
    response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages,
        stream: true,
      }),
    })
  } catch (err) {
    onPhase({ type: 'error', message: 'Could not reach the local proxy. Make sure it\'s running: node proxy.mjs' })
    return
  }

  if (!response.ok) {
    const errBody = await response.text()
    let msg = `API error ${response.status}`
    try {
      const parsed = JSON.parse(errBody)
      msg = parsed?.error?.message ?? msg
    } catch { /* ignore */ }
    onPhase({ type: 'error', message: msg })
    return
  }

  // Stream SSE
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  let accumulated = ''

  if (!reader) {
    onPhase({ type: 'error', message: 'No response body from API.' })
    return
  }

  const thinkingMessages = [
    'Reading your artifact...',
    'Identifying craft skill signals...',
    'Calibrating to your level...',
    'Building your coaching note...',
  ]
  let thinkingIdx = 0
  const thinkingInterval = setInterval(() => {
    thinkingIdx = (thinkingIdx + 1) % thinkingMessages.length
    onPhase({ type: 'thinking', message: thinkingMessages[thinkingIdx] })
  }, 1800)

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n')

      // Parse SSE events — track current event name then pair with data line
      let currentEventName = ''
      for (const line of lines) {
        if (line.startsWith('event: ')) {
          currentEventName = line.slice(7).trim()

          if (currentEventName === 'slack_fetching') {
            onPhase({ type: 'thinking', message: 'Reading your Slack thread...' })
          }
          if (currentEventName === 'gdrive_fetching') {
            onPhase({ type: 'thinking', message: 'Reading your Google doc...' })
          }
          continue
        }

        if (!line.startsWith('data: ')) { currentEventName = ''; continue }
        const data = line.slice(6).trim()
        if (data === '[DONE]' || data === '{}') { currentEventName = ''; continue }

        // Handle named SSE events (gdrive_needs_fetch, error, etc.)
        if (currentEventName === 'slack_needs_fetch') {
          clearInterval(thinkingInterval)
          try {
            const payload = JSON.parse(data)
            onPhase({ type: 'thinking', message: 'Reading your Slack thread...' })
            const ready = await waitForContent(payload.cacheKey, 90000)
            if (!ready) {
              onPhase({ type: 'error', message: 'Could not read Slack thread. Try pasting the message text directly.' })
              return
            }
            await evaluateArtifact(sourceType, jobFamily, level, artifact, onPhase)
            return
          } catch {
            onPhase({ type: 'error', message: 'Failed to fetch Slack thread content.' })
            return
          }
        }

        if (currentEventName === 'gdrive_needs_fetch') {
          clearInterval(thinkingInterval)
          try {
            const payload = JSON.parse(data)
            // Signal the UI to show a "fetching" state while we wait
            onPhase({ type: 'thinking', message: `Reading your ${payload.docType}...` })
            const ready = await waitForGdocContent(payload.fileId, 90000)
            if (!ready) {
              onPhase({ type: 'error', message: `Timed out waiting for ${payload.docType} content.` })
              return
            }
            // Content is now cached on proxy — retry evaluation
            await evaluateArtifact(sourceType, jobFamily, level, artifact, onPhase)
            return
          } catch {
            onPhase({ type: 'error', message: 'Failed to fetch Google doc content.' })
            return
          }
        }

        if (currentEventName === 'error') {
          clearInterval(thinkingInterval)
          try {
            const payload = JSON.parse(data)
            onPhase({ type: 'error', message: payload.error ?? 'Something went wrong.' })
          } catch {
            onPhase({ type: 'error', message: 'Unknown error from proxy.' })
          }
          return
        }

        // Default: parse as content_block_delta
        try {
          const event = JSON.parse(data)
          if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
            accumulated += event.delta.text
            clearInterval(thinkingInterval)
            onPhase({ type: 'streaming', partial: accumulated })
          }
          if (event.type === 'error') {
            clearInterval(thinkingInterval)
            onPhase({ type: 'error', message: event.error ?? 'Something went wrong.' })
            return
          }
        } catch { /* skip malformed lines */ }

        currentEventName = ''
      }
    }
  } finally {
    clearInterval(thinkingInterval)
  }

  // Parse final JSON
  console.log('[claudeClient] accumulated length:', accumulated.length)
  console.log('[claudeClient] accumulated preview:', accumulated.slice(0, 300))

  const jsonStr = extractJSON(accumulated)
  if (!jsonStr) {
    onPhase({ type: 'error', message: `Unexpected response format. Raw: ${accumulated.slice(0, 200)}` })
    return
  }

  try {
    const parsed = JSON.parse(jsonStr)
    const result: CoachingResult = {
      signal: parsed.signal ?? 'Evaluation complete',
      signalType: parsed.signalType ?? 'both',
      context: { sourceType, jobFamily, level },
      findings: parsed.findings ?? [],
      summary: parsed.summary ?? {
        skillsAssessed: [],
        strongestSignal: '',
        clearestGrowthEdge: '',
        aiNativePgmSignal: '',
      },
    }
    onPhase({ type: 'done', result })
  } catch {
    onPhase({ type: 'error', message: 'Could not parse the coaching note. Try again.' })
  }
}

// ─────────────────────────────────────────────
// Helper: pull JSON object out of a string
// (handles cases where model wraps in ```json blocks)
// ─────────────────────────────────────────────

function extractJSON(text: string): string | null {
  const trimmed = text.trim()
  // Try direct parse first
  if (trimmed.startsWith('{')) return trimmed

  // Strip ```json ... ``` wrapper
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) return fenced[1].trim()

  // Find first { to last }
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start !== -1 && end !== -1) return trimmed.slice(start, end + 1)

  return null
}
