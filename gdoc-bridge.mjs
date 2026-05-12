/**
 * Google Doc bridge — fetches Google Docs/Sheets/Slides content
 * using the Google Docs export API with the user's browser session.
 *
 * The Vite app calls this with credentials: 'include' so browser
 * cookies (Google login) are sent automatically.
 *
 * Run with: node gdoc-bridge.mjs
 */
import express from 'express'
import cors from 'cors'

const app = express()

// Allow credentials from Vite dev server
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}))
app.use(express.json())

const EXPORT_MIME = {
  document: 'text/plain',
  spreadsheets: 'text/csv',
  presentation: 'text/plain',
}

app.get('/read-gdoc', async (req, res) => {
  const { fileId, type } = req.query
  if (!fileId) return res.status(400).json({ error: 'fileId required' })

  const docType = type ?? 'document'
  const format = docType === 'spreadsheets' ? 'csv' : 'txt'
  const exportUrl = `https://docs.google.com/${docType}/d/${fileId}/export?format=${format}`

  console.log(`[bridge] Fetching ${docType} id=${fileId}`)

  // Forward all browser cookies — the browser sends Google session cookies
  // because this request comes from a page at localhost which has access to
  // the cookies the browser holds for docs.google.com via the browser's own
  // cookie jar (the fetch happens server-side using forwarded Cookie header)
  const cookies = req.headers.cookie || ''
  const authHeader = req.headers.authorization || ''

  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Accept': 'text/html,text/csv,text/plain,*/*',
    }
    if (cookies) headers['Cookie'] = cookies
    if (authHeader) headers['Authorization'] = authHeader

    const googleRes = await fetch(exportUrl, { headers, redirect: 'follow' })
    console.log(`[bridge] Google response: ${googleRes.status}`)

    if (googleRes.status === 401 || googleRes.status === 403) {
      return res.status(401).json({
        error: `Google returned ${googleRes.status} — not authorized. Open the doc in Chrome first to ensure you're logged in, then try again.`
      })
    }

    if (!googleRes.ok) {
      return res.status(googleRes.status).json({ error: `Google returned ${googleRes.status}` })
    }

    const content = await googleRes.text()
    if (!content || content.length < 10) {
      return res.status(400).json({ error: 'Document appears to be empty.' })
    }

    console.log(`[bridge] Got content, length: ${content.length}`)
    res.json({ content, length: content.length })
  } catch (err) {
    console.error('[bridge] Error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.listen(3002, () => {
  console.log('✅ Google Doc bridge running at http://localhost:3002')
  console.log('   Uses browser Google session via cookie forwarding')
})

process.on('uncaughtException', (err) => console.error('[bridge] uncaughtException:', err.message))
process.on('unhandledRejection', (err) => console.error('[bridge] unhandledRejection:', err))
