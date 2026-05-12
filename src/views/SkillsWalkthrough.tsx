import { useState } from 'react'
import styles from './SkillsWalkthrough.module.css'

type FilterKey = 'all' | 'changed' | 'human' | 'fluency'
type LevelKey = 'Manager' | 'Senior' | 'Staff' | 'Principal' | 'Director' | 'VP'

const LEVELS: LevelKey[] = ['Manager', 'Senior', 'Staff', 'Principal', 'Director', 'VP']

interface Skill {
  id: string
  name: string
  tagline: string
  jobFamily?: string   // e.g. "BizOps only" | "PgM/PjM only" | "TPM only"
  good: string
  changed: string
  hero: string
  antihero: string
  prompt: string
  fluencyBehavior: string
  levelDescriptions: Record<LevelKey, string>
}

const SKILLS: Skill[] = [
  {
    id: 'CS1',
    name: 'Connect Strategy to Execution',
    tagline: 'Connect external context and internal realities to clear priorities and decisions',
    good: 'Connects external context and internal realities with business strategy to clear priorities, decisions, and execution paths that keep teams focused on the highest-impact outcomes.',
    changed: 'Synthesis that used to take days now takes hours. AI compresses domain ramp time and surfaces signals before you walk in -- there is no longer a reason to form strategy live in the room.',
    hero: 'Before a leadership review, synthesizes external signals, business strategy, and team realities into three pressure-tested sequencing options. Spends the meeting advancing the decision, not forming it.',
    antihero: 'Spends the first 20 minutes of the stakeholder meeting summarizing background. The thinking that should have happened before the room is happening inside it.',
    prompt: '"What are the strongest arguments against my current prioritization? What external signals or internal realities am I missing?"',
    fluencyBehavior: 'Better Starting Points — synthesizes context across external signals, business strategy, and internal realities before entering stakeholder conversations.',
    levelDescriptions: {
      Manager: 'Applies understanding of business strategy, operating model, performance drivers, and relevant external context to connect strategy to execution within a project or program. Helps prioritize the work that matters most within scope. Identifies decisions and tradeoffs, develops data-informed recommendations, and supports clear follow-through with guidance.',
      Senior: 'Synthesizes business strategy, operating model, performance drivers, and relevant external context to contribute to strategy and drive execution across teams. Prioritizes across teams to focus effort on the highest-impact outcomes. Independently frames decisions and tradeoffs, recommends a path forward, and drives follow-through.',
      Staff: 'Synthesizes business strategy, external signals, and internal realities across multiple organizations or a large function to help shape strategy and drive execution. Drives decision clarity by leading tradeoff discussions, recommending execution paths, and ensuring follow-through with stakeholders.',
      Principal: 'Demonstrates deep understanding of business outcomes, external environment, and customer context to shape strategy at project, program, or portfolio level. Drives principled, data-informed decisions across a portfolio, clarifying execution paths and implications beyond the immediate area.',
      Director: 'Expert in connecting business strategy, business outcomes, external context, and internal realities to lead strategic planning and execution across a large segment, function, or company-level domain. Shapes consequential decisions and tradeoffs across portfolios, providing principled recommendations and aligning leaders around execution paths that account for enterprise-wide impact.',
      VP: 'Defines and cascades strategy based on evolving business, technology, customer, and external realities, and champions major strategic change initiatives for company-level impact. Makes or sponsors enterprise decisions and tradeoffs, aligning senior leaders around clear execution paths and follow-through.',
    },
  },
  {
    id: 'CS2',
    name: 'Execute with Rigor',
    tagline: 'Use the best available tools and human intelligence to accelerate decisions',
    good: 'Executes with rigor across the full program lifecycle by applying program management and business operations methodologies, instilling accountability, and using the best available tools and HI (human intelligence) to accelerate decisions and deliver clear outcomes.',
    changed: 'The prescriptive AI use-case list is gone. The differentiator is not which AI tools you use -- it is the quality of the judgment you apply. "With clarity" is the new signal: communication that cuts through noise is a craft behavior, not a technical one.',
    hero: 'Identifies risks and dependencies upfront across the full program lifecycle, escalates blockers before they become issues, and communicates with clarity on progress and decisions -- using data to drive alignment, not just to report status.',
    antihero: 'Develops a plan and drives an operating rhythm but communicates in ways that create noise rather than clarity. Stakeholders leave syncs uncertain about decisions or next steps.',
    prompt: '"What risks or dependencies in this plan am I underweighting? What would a skeptical executive ask that I haven\'t answered yet?"',
    fluencyBehavior: 'Judgment — uses the best available tools and human intelligence together. AI accelerates initial planning and risk detection; human judgment drives accountability and decision clarity.',
    levelDescriptions: {
      Manager: 'Develops and executes a high-quality plan with clear milestones and well-defined success measures. Contributes to operating rhythm at project or program level. Understands risks and dependencies and proactively escalates blockers. Communicates with clarity on progress and decisions, using data to drive alignment.',
      Senior: 'Develops and executes a high-quality adaptive plan to deliver business outcomes. Drives operating rhythm at project or program level. Helps uncover risks and dependencies, escalates blockers, and determines optimal paths to green. Communicates clearly on program progress using data to inform trends, decisions, and next steps.',
      Staff: 'Partners across teams to define program outcomes, build an end-to-end delivery plan, and establish governance. Develops and drives operating rhythm. Partners across teams to uncover risks and dependencies and quickly determines optimal paths to green. Communicates clearly on program progress, leveraging data and insights to recommend decisions.',
      Principal: 'Leads teams to define program outcomes and governance for large-scale, complex programs. Develops and drives operating rhythm at organizational level. Creates an environment of rigor with clarity on accountability, outcomes, and success measures. Communicates with a clear narrative on the need for strategic changes and adjustments to plan.',
      Director: 'Develops a high-quality portfolio management plan with clear owners across multiple organizations. Owns operating rhythm at the organizational level. Leads teams to improve operational rigor with clarity on accountability and success measures. Develops a reporting structure that surfaces strategic changes needed across the portfolio.',
      VP: 'Establishes cross-functional priorities and delivers on a high-quality portfolio management plan. Leads and empowers teams to execute with operational rigor at any level. Maintains a clear view of portfolio health and emphasizes the need for strategic changes when the external landscape or business priorities warrant.',
    },
  },
  {
    id: 'CS3',
    name: 'Enable Scale and Velocity',
    tagline: 'Experiment with new approaches, anchor to outcomes, scale what works',
    good: 'Drives continuous improvement by developing repeatable frameworks, building capabilities in others, and advancing craft development. Experiments with new approaches, including AI, anchors them to outcomes, treats both what works and what doesn\'t as a signal, and scales learnings into common practices that drive quality and velocity across programs, teams, and the craft.',
    changed: 'Speed is no longer the differentiator -- AI gives everyone speed. Quality alongside velocity is the new expectation. Experimentation is only valuable when it\'s anchored to outcomes and scaled through others.',
    hero: 'Identifies a recurring bottleneck, runs a structured experiment with new approaches including AI, validates quality and outcome impact, then scales what works by documenting it and sharing it across the team -- including what didn\'t work.',
    antihero: 'Experiments with AI occasionally but can\'t connect any specific experiment to a business outcome. When asked "what have you learned?" produces anecdotes but no documented findings or shared practices.',
    prompt: '"Help me design a two-week experiment to test whether this approach can improve [specific outcome]. What would success look like and how would I measure quality and impact?"',
    fluencyBehavior: 'Adoption — experiments with new approaches including AI, anchors to outcomes, and shares learnings so the community -- not just the individual -- benefits.',
    levelDescriptions: {
      Manager: 'Leverages proven frameworks, best practices, tools, and templates. Contributes to the identification of continuous improvement opportunities and executes on them. Participates in craft development opportunities.',
      Senior: 'Identifies, recommends, and drives continuous improvement opportunities. Participates in craft improvement and coaches others on PgM and BizOps fundamentals. Experiments with new approaches and shares learnings to improve practices across the team.',
      Staff: 'Contributes to new frameworks, best practices, and templates. Experiments with new approaches, including AI, anchors them to outcomes, validates quality and impact, and scales proven approaches across programs. Coaches others and is viewed by peers as an expert.',
      Principal: 'Defines and drives adoption of proven frameworks that are repeatable, durable, and scalable. Establishes and scales an experimentation-to-adoption model, rigorously testing new approaches and anchoring them to outcomes before scaling. Shares learnings across the community and drives adoption of proven practices.',
      Director: 'Champions proven frameworks and continuous improvement to senior leaders. Creates an environment for teams to experiment, share learnings, and drive improvement at scale. Recognized as a role model and works to mature the craft across Intuit.',
      VP: 'Builds the culture to capture and scale proven frameworks across Intuit. Champions continuous improvement and adopts new ways of working with transformative impact. Leads the evolution of the craft across Intuit.',
    },
  },
  {
    id: 'CS4',
    name: 'Lead Change',
    tagline: 'Coach and influence stakeholders from plan to sustained adoption',
    good: 'Builds credibility and trust across teams, develops and drives change strategy with extreme ownership, and coaches and influences cross-functional stakeholders to move from plan to sustained adoption.',
    changed: '"Coach and influence" is restored as the foundation of this skill -- the most unanimously flagged gap in focus groups. Change management is a human dynamic. AI is not the primary frame here; accountability for driving change is.',
    hero: 'Identifies the impact of a major change, formulates a change strategy with clear adoption milestones, galvanizes stakeholders to build momentum, and tracks that change is not just delivered but embedded -- it\'s the actual adoption, not just the adoption plan.',
    antihero: 'Develops a strong change plan but loses ownership after launch. When adoption stalls, treats it as someone else\'s problem. The plan was thorough; the follow-through wasn\'t.',
    prompt: '"What are stakeholders being asked to give up in this change? How do I name that upfront to build trust rather than waiting for pushback?"',
    fluencyBehavior: 'Judgment — change management is a human dynamic. AI can help draft communications and anticipate objections, but coaching, trust-building, and sustained adoption are irreducibly human.',
    levelDescriptions: {
      Manager: 'Establishes trusted relationships with the team to lead change. Understands impact of key changes and actively supports execution of the change management plan. Exhibits extreme ownership to drive change actions. Communicates a clear case for change.',
      Senior: 'Establishes credibility and strengthens trust across teams. Helps develop a clear change management plan and supports execution. Coaches and influences stakeholders and communicates a compelling data-backed case for change to drive action and build momentum.',
      Staff: 'Acts as a boundaryless change leader. Develops a clear change management plan and drives end-to-end execution. Coaches and influences stakeholders with a compelling case for change, and drives from plan to sustained adoption -- tracking that change is not just delivered but embedded.',
      Principal: 'Known as a credible, influential, and boundaryless change leader. Leads formulation of change strategy for large-scale, complex programs. Proactively manages stakeholder relationships at all levels and influences them to take actions. Inspires and instills confidence in the team.',
      Director: 'Recognized as a credible, transformational change leader across a large segment or function. Sets change management vision. Leads conversations with senior leaders and champions change throughout organizations. Inspires confidence in teams, stakeholders, and senior leaders.',
      VP: 'Generates executive-level support across the company. Sets change management vision for strategic, long-term change efforts. Gets alignment and commitment from senior leaders including CEO Staff with a compelling, data-backed case for change.',
    },
  },
  {
    id: 'CS5',
    name: 'Solve Business Problems',
    jobFamily: 'BizOps only',
    tagline: 'Develop data-backed recommendations to shape strategy and improve efficiency',
    good: 'Quickly ramps up to build expertise in new areas, proactively identifies and articulates problem statements, and applies a structured approach to solve complex customer problems and business challenges. Develops data-backed recommendations to shape organizational and business strategy, enhance operating systems, and improve business efficiency, using AI and analytical tools to accelerate insights and strengthen recommendations.',
    changed: 'The strategy lens is explicitly preserved. BizOps sessions confirmed that prior refreshes made this skill too operationally focused -- the external and customer dimension must stay. AI is a light reference near "improve business efficiency," not the primary frame.',
    hero: 'Ramps quickly in a new domain, proactively identifies the problem statement before being asked, and develops a structured, data-backed recommendation with clearly structured logic tailored to the audience -- using analytical tools to sharpen the analysis.',
    antihero: 'Waits to be handed a problem statement rather than identifying it proactively. Develops recommendations that are solid analytically but don\'t connect to organizational strategy or business outcomes.',
    prompt: '"What problem am I actually solving here? What\'s the most important thing a senior leader needs to make a decision, and what\'s missing from my current analysis?"',
    fluencyBehavior: 'Better Starting Points — uses data and available analytical tools to support problem-solving and accelerate insights, while preserving human judgment for the strategic recommendation.',
    levelDescriptions: {
      Manager: 'Gathers and reviews internal and external information to quickly ramp up in new domains, with guidance. Develops data-backed recommendations with clearly structured logic. Uses data and available analytical tools to support problem-solving and strengthen recommendations.',
      Senior: 'Frames strategic questions, runs experiments or pilots, and conducts error-free analysis independently. Develops data-backed recommendations with well-structured arguments. Uses data and available analytical tools to support problem-solving and strengthen recommendations.',
      Staff: 'Leads end-to-end problem solving from defining problems to ideating solutions. Develops recommendations tailored to all stakeholder levels. Applies data-informed and AI-assisted analysis to accelerate problem-solving and sharpen the quality of recommendations.',
      Principal: 'Sets direction and approach to solve complex problems. Challenges assumptions and sees several steps ahead. Facilitates discussions with senior leaders. Quickly identifies high-impact opportunities to shape organizational strategy.',
      Director: 'Navigates any domain, drawing on pattern recognition to quickly add value. Recognized as a sought-after thought partner for senior leaders. Champions high-impact opportunities to shape organizational strategy, enhance operating systems, and improve business efficiency.',
      VP: 'Orients to any situation irrespective of domain and quickly adds value. Leads organizations to develop and implement creative solutions to pressing business problems at Intuit-wide scale. Challenges status quo and inspires bold ideas in others.',
    },
  },
  {
    id: 'CS6',
    name: 'Domain Expertise',
    jobFamily: 'PgM / PjM only',
    tagline: 'Leverage deep domain expertise and continuously build knowledge',
    good: 'Leverages deep domain expertise and continuously builds knowledge to add immediate value within a program. Brings together the right experts and leaders to mobilize cross-functional teams and deliver on program outcomes, applying curiosity and the best available tools to stay ahead of the domain.',
    changed: 'The shift from "deep domain expertise" to "quickly builds domain knowledge" was the most negatively received single edit in focus groups -- and was confirmed as unintentional. Deep expertise is restored. "Continuously builds" honors adaptability without implying depth is no longer expected.',
    hero: 'Rapidly navigates a new program area, develops an end-to-end blueprint, drives domain-specific discussions using domain knowledge and the right tools, and identifies the right experts to shape critical decisions -- demonstrating credibility across the program.',
    antihero: 'Can get up to speed quickly but doesn\'t go deep. Relies on others for domain judgment rather than building genuine expertise. When domain-specific decisions arise, defers rather than leads.',
    prompt: '"What domain-specific risks or patterns am I not seeing yet? Who are the right experts I should bring in to test my current assumptions?"',
    fluencyBehavior: 'Judgment — applies curiosity and the best available tools to stay ahead of the domain. Tools accelerate analysis; deep expertise is what makes the judgment credible.',
    levelDescriptions: {
      Manager: 'Demonstrates curiosity and asks the right questions, leveraging available tools to come up to speed quickly and accelerate program delivery. Applies domain knowledge to identify gaps within a program and works with the team to address them. Partners with stakeholders to identify workstreams and mobilize program delivery.',
      Senior: 'Quickly absorbs and processes information in new program areas, parsing what is important and relevant, and applies it to problem solving. Demonstrates valuable knowledge in the domain to mobilize teams and navigate issues and risks. Independently identifies workstreams and owners to mobilize program delivery and inform key decisions.',
      Staff: 'Rapidly navigates new program areas, diving deep into a subject area and resurfacing to develop an end-to-end blueprint. Leverages extensive domain knowledge to drive domain-specific discussions, navigate risks, and address process and priority gaps. Leads experts through active problem solving, using tools to accelerate analysis and shape decisions.',
      Principal: 'Navigates all program areas with ease, drawing from deep domain experience to accelerate outcomes, predict challenges, and prevent failures. Connects the dots across domains using outside-in knowledge to proactively shape program approaches. Identifies and mobilizes the right experts, applying tools as thought partners to test assumptions and sharpen judgment.',
      Director: 'Walks into any room or situation and orients quickly, drawing on broad cross-domain knowledge to add immediate value. Connects the dots across programs and portfolios to shape program approach and manage risks at scale. Works boundarylessly across orgs and builds team capability in how tools and frameworks are applied.',
      VP: 'Deeply understands how program outcomes deliver customer benefit and Intuit-level strategic outcomes. Lays out vision for the program approach through continuous development of deep expertise across multiple domains. Builds cross-domain expertise in leaders to apply the best solution to any complex program or portfolio.',
    },
  },
  {
    id: 'CS7',
    name: 'Technical Domain Expertise',
    jobFamily: 'TPM only',
    tagline: 'Apply technical depth to accelerate product and platform decisions',
    good: 'Leverages technical domain expertise and a deep understanding of the software development lifecycle and AI-native product development to rapidly onboard, partner with technical SMEs, and deliver on tech strategy. Applies AI and emerging tools as thought partners to accelerate analysis, shape technical approaches, and deepen influence on product and platform decisions.',
    changed: 'Universal AI fluency and TPM-specific technical depth are now kept separate. The three-part AI checklist is removed -- it was described as vague and aging poorly. The TPM differentiator is depth in products and platforms, not general AI fluency. Scope expands beyond SDLC to data, security, and platform domains.',
    hero: 'When an engineering partner proposes a new AI-native delivery approach, engages substantively -- applies SDLC and platform knowledge, asks the right technical questions, shapes the approach, and translates the implications for business stakeholders. Credible on both sides of the conversation.',
    antihero: 'Defers to technical SMEs on anything beyond SDLC basics. Visible discomfort when platform architecture, data, or security decisions come up in cross-functional reviews. Loses influence as the team\'s technical scope evolves.',
    prompt: '"What technical risks or architectural tradeoffs in this approach am I underweighting? What would a senior technical leader ask that I haven\'t addressed yet?"',
    fluencyBehavior: 'Better Starting Points — applies AI and emerging tools as thought partners to accelerate analysis and shape technical approaches, while maintaining depth in SDLC, AI-native product development, and platform architecture.',
    levelDescriptions: {
      Manager: 'Quickly learns in new program areas and comes up to speed. Has a firm grasp of SDLC methodologies. Understands technology solutions within projects and resolves technological risks and issues independently. Drives communication with technical experts to deliver on the program\'s technical and operational strategy.',
      Senior: 'Rapidly absorbs information in new program areas and applies critical thinking to problem-solving. Has a firm grasp of SDLC methodologies. Builds awareness of AI-native product development patterns alongside SDLC. Understands technical solutions and communicates with technical experts to resolve risks, issues, and tradeoff discussions.',
      Staff: 'Swiftly navigates new program areas, diving deep to form an end-to-end blueprint. Possesses extensive knowledge of software development approaches, architecture, and lifecycle, including AI-native product development and platform architectures. Steers domain-specific discussions and drives trade-off discussions with technical experts.',
      Principal: 'Navigates all program and portfolio areas with ease using deep domain experience. Designs AI capabilities that can be leveraged across multiple programs. Shapes how AI and emerging technologies are applied across programs, contributing technical depth that accelerates product and platform decisions. Recognized by technical stakeholders as a strong thought partner.',
      Director: 'Adapts to any situation or program area, quickly providing key insights. Exhibits deep understanding of software development, architecture, and lifecycle. Shapes how AI and emerging technologies are applied across the broader TPM community, contributing scalable patterns that accelerate product and platform decisions across the company.',
      VP: 'Lays out vision for the program approach through deep understanding of software development, architecture, and lifecycle with the most senior tech executives. Shapes how AI and emerging technologies are applied company-wide. Influences Intuit strategy and priorities and contributes to fiscal year plan.',
    },
  },
]

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All sections' },
  { key: 'changed', label: 'What changed' },
  { key: 'human', label: 'Human contribution' },
  { key: 'fluency', label: 'AI Fluency' },
]

export default function SkillsWalkthrough() {
  const [expandedSkills, setExpandedSkills] = useState<Set<string>>(new Set())
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
  const [activeLevel, setActiveLevel] = useState<LevelKey>('Senior')

  const toggleSkill = (id: string) => {
    setExpandedSkills(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const expandAll = () => setExpandedSkills(new Set(SKILLS.map(s => s.id)))
  const collapseAll = () => setExpandedSkills(new Set())

  return (
    <div className={styles.walkthrough}>
      <div className={styles.header}>
        <h1 className={styles.title}>Browse the Skills</h1>
        <p className={styles.subtitle}>What good looks like across all 6 AI-native craft skills — hero examples, anti-hero contrasts, and one prompt to build each.</p>
      </div>

      {/* ── Controls bar ── */}
      <div className={styles.controls}>

        {/* Level slider */}
        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>Level:</span>
          <div className={styles.levelPills}>
            {LEVELS.map(l => (
              <button
                key={l}
                className={`${styles.levelPill} ${activeLevel === l ? styles.levelPillActive : ''}`}
                onClick={() => setActiveLevel(l)}
              >{l}</button>
            ))}
          </div>
        </div>

        {/* Filter toggles */}
        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>Show:</span>
          <div className={styles.filterPills}>
            {FILTERS.map(f => (
              <button
                key={f.key}
                className={`${styles.filterPill} ${activeFilter === f.key ? styles.filterPillActive : ''}`}
                onClick={() => setActiveFilter(f.key)}
              >{f.label}</button>
            ))}
          </div>
        </div>

        {/* Expand / collapse all */}
        <div className={styles.expandControls}>
          <button className={styles.expandBtn} onClick={expandAll}>Expand all</button>
          <button className={styles.expandBtn} onClick={collapseAll}>Collapse all</button>
        </div>

      </div>

      {/* ── Skill cards ── */}
      <div className={styles.skills}>
        {SKILLS.map((skill, idx) => {
          const isOpen = expandedSkills.has(skill.id)
          return (
            <div key={skill.id} className={`${styles.skillCard} ${isOpen ? styles.skillCardOpen : ''}`}>

              {/* Clickable header */}
              <button
                className={styles.skillHeader}
                onClick={() => toggleSkill(skill.id)}
                aria-expanded={isOpen}
              >
                <div className={styles.skillId} data-chip={idx + 1}>{skill.id}</div>
                <div className={styles.skillNameGroup}>
                  <div className={styles.skillNameRow}>
                    <div className={styles.skillName}>{skill.name}</div>
                    {skill.jobFamily && (
                      <span className={styles.jobFamilyBadge}>{skill.jobFamily}</span>
                    )}
                  </div>
                  <div className={styles.skillTagline}>"{skill.tagline}"</div>
                </div>
                <div className={styles.chevron} aria-hidden="true">
                  {isOpen ? '▲' : '▼'}
                </div>
              </button>

              {/* Expandable body */}
              {isOpen && (
                <div className={styles.skillBody}>

                  {/* Level callout */}
                  <div className={styles.levelCallout}>
                    <span className={styles.levelCalloutLabel}>{activeLevel}</span>
                    <span className={styles.levelCalloutText}>{skill.levelDescriptions[activeLevel]}</span>
                  </div>

                  <div className={styles.bodyGrid}>
                    <div className={styles.leftCol}>
                      {(activeFilter === 'all' || activeFilter === 'human') && (
                        <>
                          <div className={styles.sectionLabel}>What good looks like</div>
                          <p className={styles.bodyText}>{skill.good}</p>
                        </>
                      )}
                      {(activeFilter === 'all' || activeFilter === 'changed') && (
                        <>
                          <div className={styles.sectionLabel} style={{ marginTop: activeFilter === 'all' ? 14 : 0 }}>What changed with AI</div>
                          <p className={styles.bodyText}>{skill.changed}</p>
                        </>
                      )}
                      {(activeFilter === 'all' || activeFilter === 'fluency') && (
                        <>
                          <div className={styles.sectionLabel} style={{ marginTop: activeFilter === 'all' ? 14 : 0 }}>AI Fluency behavior</div>
                          <p className={styles.bodyText}>{skill.fluencyBehavior}</p>
                        </>
                      )}
                    </div>

                    <div className={styles.rightCol}>
                      {(activeFilter === 'all' || activeFilter === 'human') && (
                        <>
                          <div className={styles.heroBox}>
                            <div className={styles.heroLabel}>HERO EXAMPLE</div>
                            <p className={styles.bodyText}>{skill.hero}</p>
                          </div>
                          <div className={styles.antiHeroBox}>
                            <div className={styles.antiHeroLabel}>ANTI-HERO EXAMPLE</div>
                            <p className={styles.bodyText}>{skill.antihero}</p>
                          </div>
                        </>
                      )}
                      {(activeFilter === 'all' || activeFilter === 'fluency') && (
                        <div className={styles.promptBox}>
                          <div className={styles.promptLabel}>PROMPT TO TRY</div>
                          <p className={styles.promptText}>{skill.prompt}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
