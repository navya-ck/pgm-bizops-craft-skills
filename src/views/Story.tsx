import { useState } from 'react'
import styles from './Story.module.css'

type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday'
type Persona = 'maya' | 'jordan'

const DAYS: { id: Day; label: string; sublabel: string }[] = [
  { id: 'monday',    label: 'Monday',    sublabel: '4 days out' },
  { id: 'tuesday',   label: 'Tuesday',   sublabel: '3 days out' },
  { id: 'wednesday', label: 'Wednesday', sublabel: '2 days out' },
  { id: 'thursday',  label: 'Thursday',  sublabel: 'The room' },
]

interface Beat {
  time: string
  text: string
  type?: 'action' | 'prompt' | 'moment' | 'gap'
}

interface DayContent {
  maya: { headline: string; beats: Beat[] }
  jordan: { headline: string; beats: Beat[] }
}

const STORY: Record<Day, DayContent> = {
  monday: {
    maya: {
      headline: 'Before the deck exists, Maya is already stress-testing it.',
      beats: [
        {
          time: '8:14 am',
          type: 'action',
          text: 'Maya opens a blank conversation before she opens a slide. She pastes in the strategy doc, last quarter\'s performance data, and the stakeholder map for Thursday\'s review.',
        },
        {
          time: '8:21 am',
          type: 'prompt',
          text: '"What are the strongest arguments against this prioritization? What questions will the CFO ask that I haven\'t answered yet? What signals in this data am I probably underweighting?"',
        },
        {
          time: '8:47 am',
          type: 'action',
          text: 'She reads the output carefully. Rejects two of the objections as not applicable. Keeps three. Adds a fourth that the AI missed — she knows this stakeholder personally. She starts the deck with four pre-answered objections baked into the narrative.',
        },
        {
          time: '11:30 am',
          type: 'moment',
          text: 'By lunch, Maya has three prioritization options — not one. Each has a named trade-off. She didn\'t build them because she was unsure. She built them because she knows the room will ask.',
        },
      ],
    },
    jordan: {
      headline: 'Jordan is solid. Experienced. He\'s done this before.',
      beats: [
        {
          time: '9:00 am',
          type: 'action',
          text: 'Jordan opens the deck template and starts building. He knows the structure. He\'s run this kind of review before and he knows what leadership wants to see.',
        },
        {
          time: '10:45 am',
          type: 'action',
          text: 'He pulls together the performance data, adds his commentary, drops in the prioritization recommendation he\'s been thinking about since last week.',
        },
        {
          time: '2:00 pm',
          type: 'action',
          text: 'He sends a draft to his manager with a note: "Early look — would love your eyes before Thursday."',
        },
        {
          time: '4:30 pm',
          type: 'gap',
          text: 'Manager replies with six comments. A few are quick fixes. Two are harder — angles Jordan hadn\'t considered. He flags them as things to think through Tuesday.',
        },
      ],
    },
  },
  tuesday: {
    maya: {
      headline: 'Maya runs a simulation. She\'s not in the room yet, but she\'s already been in five versions of it.',
      beats: [
        {
          time: '9:00 am',
          type: 'prompt',
          text: '"Role-play as a skeptical CFO. You\'ve seen a hundred prioritization decks. You\'re pressed for time and you trust data over narrative. What do you push back on in slide 4?"',
        },
        {
          time: '9:20 am',
          type: 'action',
          text: 'She runs the simulation twice — once as the CFO, once as the head of engineering who she knows will be in the room and has a competing priority. She finds two slides that don\'t hold up under the engineering lens. She revises them.',
        },
        {
          time: '1:00 pm',
          type: 'action',
          text: 'She shares a draft with her team in Slack — not for approval, for input. She pastes the two objections the simulation flagged as unresolved. "Anyone have data I\'m missing on these?"',
        },
        {
          time: '3:15 pm',
          type: 'moment',
          text: 'A teammate replies with a customer research link that directly addresses one of the gaps. Maya adds it to slide 6. She marks that objection as handled.',
        },
      ],
    },
    jordan: {
      headline: 'Jordan works through his manager\'s comments. He\'s thorough about it.',
      beats: [
        {
          time: '9:30 am',
          type: 'action',
          text: 'Jordan addresses the quick fixes first. Tightens the data visualization on slide 3, clarifies the success metrics on slide 7.',
        },
        {
          time: '11:00 am',
          type: 'action',
          text: 'He sits with the two harder comments. One is about the trade-off framing — his manager thinks the deck undersells the risk of option B. Jordan adds a risk column to the comparison table.',
        },
        {
          time: '2:30 pm',
          type: 'action',
          text: 'He sends an updated version back. "Incorporated your notes — let me know if this lands better."',
        },
        {
          time: '4:00 pm',
          type: 'gap',
          text: 'Manager says it looks good. Jordan feels ready. The deck is cleaner. He\'s not anticipating what other people in the room might push on — he\'s responded to the one person who\'s already seen it.',
        },
      ],
    },
  },
  wednesday: {
    maya: {
      headline: 'Maya runs one more pass. Not on the deck — on herself.',
      beats: [
        {
          time: '8:30 am',
          type: 'prompt',
          text: '"Here is my recommendation and the three options I\'m presenting. What am I most likely wrong about? What would I need to see to change my mind on option A?"',
        },
        {
          time: '9:00 am',
          type: 'action',
          text: 'She reads the response and sits with it for ten minutes. She doesn\'t change her recommendation. But she adds one sentence to her opening: an acknowledgment of the biggest risk in her own position. She wants to name it before someone else does.',
        },
        {
          time: '10:00 am',
          type: 'action',
          text: 'She builds a one-page leave-behind — a simple decision doc with the recommendation, the trade-offs, and a clear ask. She\'ll share it in the room if anyone wants to take the conversation async.',
        },
        {
          time: 'afternoon',
          type: 'moment',
          text: 'Maya is done preparing. She closes her laptop at 3pm. She\'s not anxious about Thursday — she\'s already been in the hard version of it. Tomorrow is the easy version.',
        },
      ],
    },
    jordan: {
      headline: 'Jordan does a final polish. The deck looks good.',
      beats: [
        {
          time: '9:00 am',
          type: 'action',
          text: 'He walks through the deck slide by slide. Fixes a font inconsistency. Tightens two bullets that are running long.',
        },
        {
          time: '11:30 am',
          type: 'action',
          text: 'He runs through his talking points mentally on the way to lunch. He feels prepared. He\'s presented to this audience before.',
        },
        {
          time: '2:00 pm',
          type: 'action',
          text: 'He sends the final deck to the attendees. "Sharing ahead of Thursday — happy to answer any questions beforehand."',
        },
        {
          time: '4:00 pm',
          type: 'gap',
          text: 'No one responds ahead of the meeting. Jordan takes that as a good sign. He\'ll find out Thursday what they actually think.',
        },
      ],
    },
  },
  thursday: {
    maya: {
      headline: 'Maya already knows which slide will get pushback. She has a response ready.',
      beats: [
        {
          time: 'The room',
          type: 'action',
          text: 'Maya opens with the recommendation — one sentence, no preamble. Then the trade-offs. She names the biggest risk in her own position before anyone asks. The CFO looks up.',
        },
        {
          time: '10 minutes in',
          type: 'moment',
          text: 'The CFO pushes on option B. Maya was expecting this — she ran this exact objection on Tuesday. She has the customer research link queued. She doesn\'t flip to it defensively. She was planning to bring it up anyway.',
        },
        {
          time: '20 minutes in',
          type: 'action',
          text: 'The head of engineering raises a competing priority. Maya acknowledges it directly — she had pre-built a response for his lens specifically. She offers a sequencing option that threads both. The room pauses.',
        },
        {
          time: 'Closing',
          type: 'moment',
          text: 'They leave with a decision. Not a follow-up. A director catches Maya in the hallway: "You always come in pre-tested. I trust your recommendations differently." Maya doesn\'t explain how. She just says thank you.',
        },
      ],
    },
    jordan: {
      headline: 'Jordan presents well. The room just isn\'t done when it should be.',
      beats: [
        {
          time: 'The room',
          type: 'action',
          text: 'Jordan walks the room through the deck clearly. He knows the material. He\'s comfortable. The first ten minutes go smoothly.',
        },
        {
          time: '15 minutes in',
          type: 'gap',
          text: 'A VP asks about the risk of option B — the same angle his manager flagged on Monday. Jordan has the table he added, but doesn\'t have a confident answer on the magnitude. He says he can get more data.',
        },
        {
          time: '20 minutes in',
          type: 'gap',
          text: 'The head of engineering raises a competing priority Jordan hadn\'t accounted for. Jordan listens, takes notes, promises to factor it in. The meeting runs five minutes over.',
        },
        {
          time: 'Closing',
          type: 'moment',
          text: 'They leave with a follow-up action item: Jordan to come back with updated analysis. Not a bad outcome. But not a decision. Jordan doesn\'t know yet that the gap is forming. He thinks they performed about the same.',
        },
      ],
    },
  },
}

const REVEAL = `The difference isn't talent. Jordan is good. Maya is good. They have the same title, the same tenure, the same audience.

The difference is what happened before Thursday. Maya spent four days in the hard version of the room — stress-testing her thinking, running simulations, anticipating every lens in the audience. Jordan spent four days refining the deck.

One arrived with a recommendation that had already survived pressure. The other arrived to find out if it would.

The director who pulled Maya aside in the hallway wasn't commenting on her slides. She was commenting on something harder to name: the feeling that Maya had already done the thinking. That the recommendation was earned, not assembled.

In the AI era, the PgM who wins the room is the one who already left it once.`

export default function Story() {
  const [activeDay, setActiveDay] = useState<Day>('monday')
  const [focusPersona, setFocusPersona] = useState<Persona | 'both'>('both')

  const day = STORY[activeDay]

  return (
    <div className={styles.story}>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerMeta}>A story in 4 days</div>
          <h1 className={styles.title}>The Monday Before the Room</h1>
          <p className={styles.subtitle}>Same meeting. Same audience. Two PgMs preparing differently. Follow Maya and Jordan through the four days before a high-stakes leadership review.</p>
        </div>
      </div>

      {/* Persona toggle */}
      <div className={styles.controls}>
        <div className={styles.personaToggle}>
          <button
            className={`${styles.personaBtn} ${focusPersona === 'both' ? styles.personaBtnActive : ''}`}
            onClick={() => setFocusPersona('both')}
          >
            Both
          </button>
          <button
            className={`${styles.personaBtn} ${styles.mayaBtn} ${focusPersona === 'maya' ? styles.personaBtnActiveMaya : ''}`}
            onClick={() => setFocusPersona('maya')}
          >
            ★ Maya
          </button>
          <button
            className={`${styles.personaBtn} ${styles.jordanBtn} ${focusPersona === 'jordan' ? styles.personaBtnActiveJordan : ''}`}
            onClick={() => setFocusPersona('jordan')}
          >
            ✕ Jordan
          </button>
        </div>

        {/* Day nav */}
        <div className={styles.dayNav}>
          {DAYS.map((d, i) => (
            <button
              key={d.id}
              className={`${styles.dayBtn} ${activeDay === d.id ? styles.dayBtnActive : ''}`}
              onClick={() => setActiveDay(d.id)}
            >
              <span className={styles.dayStep}>{i + 1}</span>
              <span className={styles.dayLabel}>{d.label}</span>
              <span className={styles.daySub}>{d.sublabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Split view */}
      <div className={`${styles.split} ${focusPersona !== 'both' ? styles.splitFocused : ''}`}>

        {/* Maya */}
        {(focusPersona === 'both' || focusPersona === 'maya') && (
          <div className={`${styles.panel} ${styles.panelMaya}`}>
            <div className={styles.panelHeader}>
              <div className={styles.personaChip} data-persona="maya">★ Maya</div>
              <div className={styles.personaRole}>Senior PgM · AI-native</div>
            </div>
            <p className={styles.panelHeadline}>{day.maya.headline}</p>
            <div className={styles.beats}>
              {day.maya.beats.map((beat, i) => (
                <div key={i} className={`${styles.beat} ${styles[`beat_${beat.type}`]}`}>
                  <div className={styles.beatTime}>{beat.time}</div>
                  <div className={styles.beatText}>{beat.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jordan */}
        {(focusPersona === 'both' || focusPersona === 'jordan') && (
          <div className={`${styles.panel} ${styles.panelJordan}`}>
            <div className={styles.panelHeader}>
              <div className={styles.personaChip} data-persona="jordan">✕ Jordan</div>
              <div className={styles.personaRole}>Senior PgM · Traditional approach</div>
            </div>
            <p className={styles.panelHeadline}>{day.jordan.headline}</p>
            <div className={styles.beats}>
              {day.jordan.beats.map((beat, i) => (
                <div key={i} className={`${styles.beat} ${styles[`beat_${beat.type}`]}`}>
                  <div className={styles.beatTime}>{beat.time}</div>
                  <div className={styles.beatText}>{beat.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reveal — only on Thursday */}
      {activeDay === 'thursday' && (
        <div className={styles.reveal}>
          <div className={styles.revealLabel}>The gap</div>
          {REVEAL.split('\n\n').map((para, i) => (
            <p key={i} className={styles.revealText}>{para}</p>
          ))}
          <div className={styles.revealSignal}>
            "In the AI era, the PgM who wins the room is the one who already left it once."
          </div>
        </div>
      )}

      {/* Day-to-day nav footer */}
      <div className={styles.footerNav}>
        {DAYS.map((d, i) => {
          const prev = DAYS[i - 1]
          const next = DAYS[i + 1]
          if (d.id !== activeDay) return null
          return (
            <div key={d.id} className={styles.footerNavInner}>
              {prev ? (
                <button className={styles.footerNavBtn} onClick={() => setActiveDay(prev.id)}>
                  ← {prev.label}
                </button>
              ) : <div />}
              <div className={styles.footerNavDay}>{d.label} · {d.sublabel}</div>
              {next ? (
                <button className={styles.footerNavBtn} onClick={() => setActiveDay(next.id)}>
                  {next.label} →
                </button>
              ) : <div />}
            </div>
          )
        })}
      </div>

    </div>
  )
}
