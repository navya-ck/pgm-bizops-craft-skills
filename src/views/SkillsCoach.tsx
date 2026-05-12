import { useState } from 'react'
import styles from './SkillsCoach.module.css'
import CoachingNote from '../components/CoachingNote'
import { evaluateArtifact, type StreamingPhase } from '../lib/claudeClient'
import type { CoachingResult } from '../types'

type SourceType = 'strategy' | 'email' | 'slack' | 'feedback' | 'meeting'
type JobFamily = 'PgM' | 'TPM' | 'BizOps'
type Level = 'Manager (P2/T2)' | 'Senior (P3/T3)' | 'Staff (P4/T4)' | 'Principal (P5/T6)' | 'Director (M4)' | 'VP (M6)'

const SOURCE_TYPES: { id: SourceType; label: string; placeholder: string }[] = [
  { id: 'strategy', label: 'Strategy / Planning Doc', placeholder: 'Paste a Google Doc/Slides link or the document text directly...' },
  { id: 'email',    label: 'Email / Written Update',  placeholder: 'Paste your stakeholder email, written update, or communication...' },
  { id: 'slack',    label: 'Slack Thread',             placeholder: 'Paste a Slack thread URL (e.g. https://intuit.slack.com/archives/...) or paste the message text directly...' },
  { id: 'feedback', label: 'Stakeholder Feedback Received', placeholder: 'Paste feedback you received from a stakeholder, manager, or peer...' },
  { id: 'meeting',  label: 'Meeting Notes / Recap',   placeholder: 'Paste a Google Doc link or the notes text directly...' },
]

const JOB_FAMILIES: JobFamily[] = ['PgM', 'TPM', 'BizOps']
const LEVELS: Level[] = ['Manager (P2/T2)', 'Senior (P3/T3)', 'Staff (P4/T4)', 'Principal (P5/T6)', 'Director (M4)', 'VP (M6)']

type LoadingState =
  | { status: 'idle' }
  | { status: 'thinking'; message: string }
  | { status: 'streaming'; partial: string }
  | { status: 'error'; message: string }

export default function SkillsCoach() {
  const [sourceType, setSourceType] = useState<SourceType>('strategy')
  const [jobFamily, setJobFamily] = useState<JobFamily>('PgM')
  const [level, setLevel]         = useState<Level>('Senior (P3/T3)')
  const [artifact, setArtifact]   = useState('')
  const [loadingState, setLoadingState] = useState<LoadingState>({ status: 'idle' })
  const [result, setResult]       = useState<CoachingResult | null>(null)

  const placeholder = SOURCE_TYPES.find(s => s.id === sourceType)?.placeholder ?? ''
  const isLoading = loadingState.status === 'thinking' || loadingState.status === 'streaming'
  const sourceLabel = SOURCE_TYPES.find(s => s.id === sourceType)?.label ?? sourceType

  const handleSubmit = async () => {
    if (!artifact.trim() || isLoading) return
    setLoadingState({ status: 'idle' })
    setResult(null)

    await evaluateArtifact(
      sourceLabel,
      jobFamily,
      level,
      artifact,
      (phase: StreamingPhase) => {
        if (phase.type === 'thinking')  setLoadingState({ status: 'thinking', message: phase.message })
        if (phase.type === 'streaming') setLoadingState({ status: 'streaming', partial: phase.partial })
        if (phase.type === 'error')     setLoadingState({ status: 'error', message: phase.message })
        if (phase.type === 'done') {
          setLoadingState({ status: 'idle' })
          setResult(phase.result)
        }
      }
    )
  }

  const handleReset = () => {
    setResult(null)
    setArtifact('')
    setLoadingState({ status: 'idle' })
  }

  // ── Result view ──────────────────────────────────────────
  if (result) {
    return (
      <div className={styles.coach}>
        <div className={styles.header}>
          <h1 className={styles.title}>Skills Coach</h1>
          <p className={styles.subtitle}>Your coaching note is ready.</p>
        </div>
        <CoachingNote result={result} onReset={handleReset} />
      </div>
    )
  }

  // ── Loading view ─────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={styles.coach}>
        <div className={styles.header}>
          <h1 className={styles.title}>Skills Coach</h1>
        </div>
        <div className={styles.loadingView}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingMessage}>
            {loadingState.status === 'thinking'
              ? loadingState.message
              : 'Building your coaching note...'}
          </p>
          {loadingState.status === 'streaming' && loadingState.partial.length > 20 && (
            <div className={styles.streamingPreview}>
              <div className={styles.streamingLabel}>Generating</div>
              <div className={styles.streamingDots}>
                <span /><span /><span />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Input form ───────────────────────────────────────────
  return (
    <div className={styles.coach}>
      <div className={styles.header}>
        <h1 className={styles.title}>Skills Coach</h1>
        <p className={styles.subtitle}>Paste real work. Get a coaching note grounded in the AI-native craft skills rubric.</p>
      </div>

      <div className={styles.form}>

        {/* Error banner */}
        {loadingState.status === 'error' && (
          <div className={styles.errorBanner}>
            <strong>Something went wrong:</strong> {loadingState.message}
          </div>
        )}

        {/* Source type */}
        <section className={styles.section}>
          <label className={styles.label}>What are you evaluating?</label>
          <div className={styles.sourceGrid}>
            {SOURCE_TYPES.map(s => (
              <button
                key={s.id}
                className={`${styles.sourceCard} ${sourceType === s.id ? styles.sourceActive : ''}`}
                onClick={() => setSourceType(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          {sourceType === 'slack' && (
            <div className={styles.infoCallout}>
              <strong>Tip:</strong> Paste a Slack thread URL directly — the app will fetch the content automatically. Or paste the message text if you prefer.
            </div>
          )}
          {(sourceType === 'strategy' || sourceType === 'meeting') && (
            <div className={styles.infoCallout}>
              <strong>Tip:</strong> Paste a Google Doc, Sheet, or Slides link directly — the app will read the content automatically. Make sure the doc is shared with your Google account.
            </div>
          )}
          {sourceType === 'feedback' && (
            <div className={styles.infoCallout}>
              <strong>Note:</strong> For stakeholder feedback, Claude evaluates what the feedback <em>reveals about the underlying work</em> — not your writing. This is the highest-value input type.
            </div>
          )}
        </section>

        {/* Job Family + Level */}
        <section className={styles.section}>
          <div className={styles.metaRow}>
            <div className={styles.metaField}>
              <label className={styles.label}>Job Family</label>
              <div className={styles.pillGroup}>
                {JOB_FAMILIES.map(j => (
                  <button
                    key={j}
                    className={`${styles.pill} ${jobFamily === j ? styles.pillActive : ''}`}
                    onClick={() => setJobFamily(j)}
                  >{j}</button>
                ))}
              </div>
            </div>
            <div className={styles.metaField}>
              <label className={styles.label}>Level</label>
              <div className={styles.pillGroup}>
                {LEVELS.map(l => (
                  <button
                    key={l}
                    className={`${styles.pill} ${level === l ? styles.pillActive : ''}`}
                    onClick={() => setLevel(l)}
                  >{l}</button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Artifact */}
        <section className={styles.section}>
          <label className={styles.label}>Paste your artifact</label>
          <textarea
            className={styles.textarea}
            placeholder={placeholder}
            value={artifact}
            onChange={e => setArtifact(e.target.value)}
            rows={12}
          />
          <div className={styles.charCount}>
            {artifact.length > 0 ? `${artifact.length} characters` : 'No minimum length required'}
          </div>
        </section>

        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={!artifact.trim()}
        >
          Get Coaching Note →
        </button>
      </div>
    </div>
  )
}
