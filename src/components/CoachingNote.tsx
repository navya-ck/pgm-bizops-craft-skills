import { useState } from 'react'
import type { CoachingResult } from '../types'
import styles from './CoachingNote.module.css'

interface CoachingNoteProps {
  result: CoachingResult
  onReset: () => void
}

function buildPlainText(result: CoachingResult): string {
  const lines: string[] = []
  lines.push(`CRAFT SKILLS COACHING NOTE`)
  lines.push(`${result.context.jobFamily} · ${result.context.level} · ${result.context.sourceType}`)
  lines.push(`Signal: ${result.signal}`)
  lines.push('')

  for (const f of result.findings) {
    lines.push(`── ${f.skillId} · ${f.skillName} ──`)
    lines.push(`What changed: ${f.whatChanged}`)
    lines.push(`Human contribution: ${f.humanContribution}`)
    lines.push(`AI raised the floor: ${f.aiRaisedFloor}`)
    lines.push(`Judgment differentiator: ${f.judgmentDifferentiator}`)
    lines.push(`AI Fluency lens: ${f.aiFluencyLens}`)
    lines.push(`→ One action: ${f.oneAction}`)
    lines.push('')
  }

  lines.push(`── Summary ──`)
  lines.push(`Skills assessed: ${result.summary.skillsAssessed.join(', ')}`)
  lines.push(`Strongest signal: ${result.summary.strongestSignal}`)
  lines.push(`Clearest growth edge: ${result.summary.clearestGrowthEdge}`)
  lines.push(`AI-Native PgM signal: ${result.summary.aiNativePgmSignal}`)

  return lines.join('\n')
}

export default function CoachingNote({ result, onReset }: CoachingNoteProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildPlainText(result))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select a textarea
    }
  }

  return (
    <div className={styles.root}>

      {/* Signal banner */}
      <div className={`${styles.signalBanner} ${styles[result.signalType]}`}>
        <div className={styles.signalIcon}>
          {result.signalType === 'floor' ? '⬆' : result.signalType === 'judgment' ? '⚡' : '◈'}
        </div>
        <div>
          <div className={styles.signalLabel}>AI-Native PgM Signal</div>
          <div className={styles.signalText}>{result.signal}</div>
        </div>
        <div className={styles.signalMeta}>
          <span className={styles.metaChip}>{result.context.jobFamily}</span>
          <span className={styles.metaChip}>{result.context.level}</span>
          <span className={styles.metaChip}>{result.context.sourceType}</span>
        </div>
      </div>

      {/* Skill finding cards */}
      {result.findings.map((finding) => (
        <div key={finding.skillId} className={styles.findingCard}>
          <div className={styles.findingHeader}>
            <span className={styles.skillBadge}>{finding.skillId}</span>
            <span className={styles.skillName}>{finding.skillName}</span>
          </div>

          <div className={styles.findingBody}>
            <Row
              label="What changed"
              icon="↻"
              color="blue"
              text={finding.whatChanged}
            />
            <Row
              label="What humans uniquely contribute"
              icon="◉"
              color="navy"
              text={finding.humanContribution}
            />
            <Row
              label="Where AI raised the floor"
              icon="⬆"
              color="green"
              text={finding.aiRaisedFloor}
            />
            <Row
              label="Where judgment is the differentiator"
              icon="⚡"
              color="orange"
              text={finding.judgmentDifferentiator}
            />
            <Row
              label="AI Fluency lens"
              icon="◈"
              color="purple"
              text={finding.aiFluencyLens}
            />
          </div>

          <div className={styles.actionRow}>
            <div className={styles.actionLabel}>
              <span className={styles.actionIcon}>→</span>
              One action
            </div>
            <p className={styles.actionText}>{finding.oneAction}</p>
          </div>
        </div>
      ))}

      {/* Summary card */}
      <div className={styles.summaryCard}>
        <div className={styles.summaryHeader}>Summary</div>
        <div className={styles.summaryGrid}>
          <SummaryRow
            label="Craft skills assessed"
            value={result.summary.skillsAssessed.join(', ')}
          />
          <SummaryRow
            label="Strongest signal"
            value={result.summary.strongestSignal}
          />
          <SummaryRow
            label="Clearest growth edge"
            value={result.summary.clearestGrowthEdge}
          />
          <div className={styles.pgmSignalRow}>
            <div className={styles.pgmSignalLabel}>AI-Native PgM signal</div>
            <p className={styles.pgmSignalText}>{result.summary.aiNativePgmSignal}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.footer}>
        <button className={styles.resetBtn} onClick={onReset}>
          ← Evaluate another artifact
        </button>
        <button className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ''}`} onClick={handleCopy}>
          {copied ? '✓ Copied' : '⎘ Copy coaching note'}
        </button>
      </div>
    </div>
  )
}

function Row({ label, icon, color, text }: { label: string; icon: string; color: string; text: string }) {
  return (
    <div className={`${styles.row} ${styles[`row_${color}`]}`}>
      <div className={styles.rowLabel}>
        <span className={styles.rowIcon}>{icon}</span>
        {label}
      </div>
      <p className={styles.rowText}>{text}</p>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.summaryRow}>
      <div className={styles.summaryLabel}>{label}</div>
      <p className={styles.summaryValue}>{value}</p>
    </div>
  )
}
