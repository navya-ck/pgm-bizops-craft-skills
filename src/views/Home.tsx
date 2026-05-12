import type { View } from '../App'
import styles from './Home.module.css'

interface HomeProps {
  navigate: (v: View) => void
}

export default function Home({ navigate }: HomeProps) {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Craft Skills Coach</h1>
        <p className={styles.tagline}>
          See your work through the lens of the AI-native PgM rubric.
          <br />
          Know where AI raised the floor -- and where your judgment is the differentiator.
        </p>
      </section>

      <section className={styles.entryPoints}>
        <button className={styles.card} onClick={() => navigate('coach')}>
          <div className={styles.cardIcon}>⚡</div>
          <h2 className={styles.cardTitle}>Evaluate My Work</h2>
          <p className={styles.cardDesc}>
            Paste a real artifact -- an email, a strategy doc, a Slack thread, or feedback you received. Get a coaching note grounded in the craft skills rubric.
          </p>
          <span className={styles.cardCta}>Start evaluation →</span>
        </button>

        <button className={styles.card} onClick={() => navigate('walkthrough')}>
          <div className={styles.cardIcon}>📖</div>
          <h2 className={styles.cardTitle}>Browse the Skills</h2>
          <p className={styles.cardDesc}>
            See what good looks like across all 6 craft skills. Hero examples, anti-hero contrasts, and one prompt to build each skill.
          </p>
          <span className={styles.cardCta}>Explore skills →</span>
        </button>
      </section>

      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How it works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <h3 className={styles.stepTitle}>Submit an artifact</h3>
            <p className={styles.stepDesc}>Paste real work you produced -- a stakeholder update, a planning doc, feedback you received, or a Slack thread.</p>
          </div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <h3 className={styles.stepTitle}>Get a coaching note</h3>
            <p className={styles.stepDesc}>Claude evaluates it against the craft skills rubric and returns a structured note: what changed, what's still human, where you're growing.</p>
          </div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <h3 className={styles.stepTitle}>Find your differentiator</h3>
            <p className={styles.stepDesc}>Every coaching note ends with one action. That's where judgment -- not AI -- closes the gap.</p>
          </div>
        </div>
      </section>

    </div>
  )
}
