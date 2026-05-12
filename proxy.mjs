/**
 * Local proxy server — calls the claude CLI directly so no API key is needed.
 * Uses your existing Claude Code login session for auth.
 * Run with: node proxy.mjs
 */
import express from 'express'
import cors from 'cors'
import { spawn } from 'child_process'

const app = express()
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }))
app.use(express.json({ limit: '4mb' }))

// ── In-memory store for prefetched Google doc content ─────────────────────
const gdocCache = new Map() // fileId → { content, expiresAt }

// POST /gdoc-content — called by Claude Code session after fetching any content (doc or Slack)
app.post('/gdoc-content', (req, res) => {
  const { fileId, cacheKey, content } = req.body
  const key = cacheKey || fileId
  if (!key || !content) return res.status(400).json({ error: 'cacheKey/fileId and content required' })
  gdocCache.set(key, { content, expiresAt: Date.now() + 5 * 60 * 1000 })
  console.log(`[proxy] Cached content for key=${key}, length: ${content.length}`)
  res.json({ ok: true })
})

// GET /gdoc-pending/:key — polled by the Vite app to check if content is ready
app.get('/gdoc-pending/:key', (req, res) => {
  const key = decodeURIComponent(req.params.key)
  const cached = gdocCache.get(key)
  res.json({ ready: !!(cached && cached.expiresAt > Date.now()) })
})

// ── Helper: run claude CLI and collect full stdout ─────────────────────────
function runClaude(prompt, { systemPrompt = '', useMcp = false, model = 'claude-sonnet-4-5' } = {}) {
  return new Promise((resolve, reject) => {
    const args = ['-p', prompt, '--output-format', 'stream-json', '--verbose', '--model', model]
    if (systemPrompt) args.push('--system-prompt', systemPrompt)
    if (!useMcp) args.push('--strict-mcp-config')

    const proc = spawn('claude', args, { env: { ...process.env }, stdio: ['ignore', 'pipe', 'pipe'] })
    let buffer = '', result = ''

    proc.stdout.on('data', (chunk) => {
      buffer += chunk.toString()
      const lines = buffer.split('\n')
      buffer = lines.pop()
      for (const line of lines) {
        if (!line.trim()) continue
        try { const e = JSON.parse(line); if (e.type === 'result') result = e.result ?? '' } catch {}
      }
    })
    proc.stderr.on('data', (chunk) => console.error('[claude stderr]', chunk.toString().slice(0, 200)))
    proc.on('close', (code) => { if (code !== 0 && !result) reject(new Error(`claude exited ${code}`)); else resolve(result) })
    proc.on('error', reject)
  })
}

// ── Helper: stream claude CLI output as SSE ────────────────────────────────
function streamClaude(prompt, systemPrompt, res) {
  const args = ['-p', prompt, '--system-prompt', systemPrompt, '--output-format', 'stream-json', '--verbose', '--model', 'claude-sonnet-4-5', '--strict-mcp-config']
  const proc = spawn('claude', args, { env: { ...process.env }, stdio: ['ignore', 'pipe', 'pipe'] })
  let buffer = ''

  proc.stdout.on('data', (chunk) => {
    buffer += chunk.toString()
    const lines = buffer.split('\n')
    buffer = lines.pop()
    for (const line of lines) {
      if (!line.trim()) continue
      try {
        const event = JSON.parse(line)
        if (event.type === 'assistant' && event.message?.content) {
          for (const block of event.message.content) {
            if (block.type === 'text') {
              res.write(`event: content_block_delta\ndata: ${JSON.stringify({ type: 'content_block_delta', delta: { type: 'text_delta', text: block.text } })}\n\n`)
            }
          }
        }
      } catch {}
    }
  })
  proc.stderr.on('data', (chunk) => console.error('[claude stderr]', chunk.toString().slice(0, 200)))
  proc.on('close', (code) => {
    if (code !== 0) res.write(`event: error\ndata: ${JSON.stringify({ error: 'claude CLI error (code ' + code + ')' })}\n\n`)
    else res.write('event: message_stop\ndata: {}\n\n')
    res.end()
  })
  proc.on('error', (err) => { res.write(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`); res.end() })
}

// ── URL detection helpers ──────────────────────────────────────────────────
function extractSlackUrl(text) {
  const m = text.trim().match(/https:\/\/[a-z0-9-]+\.slack\.com\/[^\s]+/)
  return m ? m[0] : null
}

function parseSlackUrl(url) {
  const m = url.match(/\/archives\/([A-Z0-9]+)\/p(\d+)/)
  if (!m) return null
  return { channelId: m[1], threadTs: m[2].slice(0, 10) + '.' + m[2].slice(10) }
}

function extractGoogleUrl(text) {
  const m = text.trim().match(/https:\/\/docs\.google\.com\/(document|spreadsheets|presentation)\/d\/([a-zA-Z0-9_-]+)/)
  return m ? { url: m[0], gType: m[1], fileId: m[2] } : null
}

const GDOC_LABEL = { document: 'Google Doc', spreadsheets: 'Google Sheet', presentation: 'Google Slides' }

// ── Main messages endpoint ─────────────────────────────────────────────────
app.post('/v1/messages', async (req, res) => {
  const { system, messages } = req.body
  const userMessage = messages[messages.length - 1]?.content ?? ''

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const slackUrl = extractSlackUrl(userMessage)
  const googleMatch = extractGoogleUrl(userMessage)

  if (slackUrl) {
    const parsed = parseSlackUrl(slackUrl)
    const cacheKey = parsed ? `${parsed.channelId}:${parsed.threadTs}` : slackUrl
    const cached = gdocCache.get(cacheKey)

    if (cached && cached.expiresAt > Date.now()) {
      console.log('[proxy] Using cached Slack thread content')
      gdocCache.delete(cacheKey)
      streamClaude(userMessage.replace(slackUrl, `\n\n--- Slack Thread ---\n${cached.content}\n---`), system, res)
    } else {
      console.log('[proxy] Requesting Slack thread fetch for:', slackUrl)
      res.write(`event: slack_needs_fetch\ndata: ${JSON.stringify({ url: slackUrl, cacheKey, channelId: parsed?.channelId, threadTs: parsed?.threadTs })}\n\n`)
      res.write('event: message_stop\ndata: {}\n\n')
      res.end()
    }

  } else if (googleMatch) {
    const { url: gUrl, gType, fileId } = googleMatch
    const docType = GDOC_LABEL[gType] ?? 'Google file'
    const cached = gdocCache.get(fileId)

    if (cached && cached.expiresAt > Date.now()) {
      // Content already fetched — evaluate it
      console.log(`[proxy] Using cached ${docType} for ${fileId}`)
      gdocCache.delete(fileId)
      streamClaude(userMessage.replace(gUrl, `\n\n--- ${docType} Content ---\n${cached.content}\n---`), system, res)
    } else {
      // Tell the client to fetch it via Claude Code session, then retry
      console.log(`[proxy] Requesting ${docType} fetch for ${fileId}`)
      res.write(`event: gdrive_needs_fetch\ndata: ${JSON.stringify({ fileId, docType, gType, url: gUrl })}\n\n`)
      res.write('event: message_stop\ndata: {}\n\n')
      res.end()
    }

  } else {
    streamClaude(userMessage, system, res)
  }
})

app.listen(3001, () => {
  console.log('✅ Proxy running at http://localhost:3001')
  console.log('   Auth: claude CLI session (no API key needed)')
})

process.on('uncaughtException', (err) => console.error('[proxy] uncaughtException:', err.message))
process.on('unhandledRejection', (err) => console.error('[proxy] unhandledRejection:', err))
