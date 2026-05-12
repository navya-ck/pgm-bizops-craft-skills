import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import Home from './views/Home'
import SkillsCoach from './views/SkillsCoach'
import SkillsWalkthrough from './views/SkillsWalkthrough'
import Story from './views/Story'
import styles from './App.module.css'

export type View = 'home' | 'coach' | 'walkthrough' | 'story'

function getViewFromHash(): View {
  const hash = window.location.hash.replace(/^#\/?/, '')
  if (hash === 'coach') return 'coach'
  if (hash === 'walkthrough') return 'walkthrough'
  if (hash === 'story') return 'story'
  return 'home'
}

export default function App() {
  const [view, setView] = useState<View>(getViewFromHash)

  useEffect(() => {
    const onHash = () => setView(getViewFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (v: View) => {
    window.location.hash = v === 'home' ? '' : v
    setView(v)
  }

  return (
    <div className={styles.app}>
      <Nav current={view} navigate={navigate} />
      <main className={styles.main}>
        {view === 'home' && <Home navigate={navigate} />}
        {view === 'coach' && <SkillsCoach />}
        {view === 'walkthrough' && <SkillsWalkthrough />}
        {view === 'story' && <Story />}
      </main>
      <footer className={styles.footer}>
        <span>PgM &amp; BizOps AI-Native Craft Skills Refresh</span>
        <span className={styles.dot}>·</span>
        <span>Intuit Confidential</span>
        <span className={styles.dot}>·</span>
        <a
          href="https://claude.ai"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.claudeBadge}
        >
          <span className={styles.claudeIcon}>◆</span>
          Powered by Claude
        </a>
      </footer>
    </div>
  )
}
