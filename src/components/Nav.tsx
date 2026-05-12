import styles from './Nav.module.css'
import type { View } from '../App'

interface NavProps {
  current: View
  navigate: (v: View) => void
}

export default function Nav({ current, navigate }: NavProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <button className={styles.logo} onClick={() => navigate('home')}>
          <span className={styles.logoText}>Craft Skills Coach</span>
          <span className={styles.logoSub}>AI-Native PgM Rubric</span>
        </button>
        <nav className={styles.nav}>
          <button
            className={`${styles.tab} ${current === 'coach' ? styles.active : ''}`}
            onClick={() => navigate('coach')}
          >
            Skills Coach
          </button>
          <button
            className={`${styles.tab} ${current === 'walkthrough' ? styles.active : ''}`}
            onClick={() => navigate('walkthrough')}
          >
            Skills Walkthrough
          </button>
          <button
            className={`${styles.tab} ${current === 'story' ? styles.active : ''}`}
            onClick={() => navigate('story')}
          >
            The Story
          </button>
        </nav>
      </div>
    </header>
  )
}
