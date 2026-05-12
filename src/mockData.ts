import type { CoachingResult } from './types'

export const MOCK_RESULT: CoachingResult = {
  signal: 'AI raised the floor here',
  signalType: 'floor',
  context: {
    sourceType: 'Email / Written Update',
    jobFamily: 'TPM',
    level: 'Senior (P3/T3)',
  },
  findings: [
    {
      skillId: 'CS2',
      skillName: 'Execute with Rigor',
      whatChanged:
        'AI can generate trade-off analysis, risk registers, and structured recommendations at speed. The craft has shifted from producing these artifacts to pressure-testing them -- interrogating what AI missed before the output reaches stakeholders.',
      humanContribution:
        'Stress-testing assumptions before a recommendation goes out is yours. AI surfaces the options; your judgment determines which option holds under scrutiny. This update shows you found the risks -- the gap is whether you challenged your own analysis as hard as a skeptical executive would.',
      aiRaisedFloor:
        'You defined success metrics and surfaced two delivery risks. The structure is clean and the recommendation is clear. That\'s the IC-to-Senior bar -- and AI likely accelerated getting there.',
      judgmentDifferentiator:
        'The trade-off analysis is asserted, not stress-tested. At Senior level, the rubric expects pressure-tested assumptions before the recommendation reaches stakeholders. The strongest argument against your recommendation isn\'t addressed -- which means a skeptical executive will raise it in the room instead of you raising it first.',
      aiFluencyLens:
        'Judgment behavior: if you used AI to generate this analysis, the craft lives in interrogating what it missed. Try: "What\'s the strongest argument against this recommendation? What assumptions am I making that could be wrong?"',
      oneAction:
        'Before your next recommendation goes to stakeholders, add a one-paragraph "assumptions tested" section that names the strongest counterargument and how you addressed it.',
    },
    {
      skillId: 'CS4',
      skillName: 'Lead Change',
      whatChanged:
        'AI can draft change communications faster than ever. The craft is no longer in producing the update -- it\'s in anticipating the resistance before it surfaces and designing the communication to address it proactively.',
      humanContribution:
        'Understanding what stakeholders are being asked to give up -- and naming it before they do -- is a distinctly human skill. It requires reading the room, knowing your audience, and having the confidence to surface discomfort rather than paper over it.',
      aiRaisedFloor:
        'You named the change, the timeline, and the path forward. That\'s table stakes -- and the update is well-structured. The floor has been raised: this communication is clear and complete on the surface.',
      judgmentDifferentiator:
        'There\'s no acknowledgment of what stakeholders are being asked to give up. At Senior level, CS4 expects you to surface resistance proactively, not wait for it to emerge in replies or follow-up meetings. The absence of friction acknowledgment signals either that you don\'t see it, or you\'re hoping they won\'t notice.',
      aiFluencyLens:
        'Adoption behavior: a well-structured change communication is a great AI starting point -- but the human layer is what makes it land. Try: "What objections will each stakeholder group have to this change? Draft a paragraph that acknowledges the friction and explains the mitigation."',
      oneAction:
        'In your next stakeholder update involving a change, add one sentence explicitly naming what the change asks people to give up and how you\'re addressing it: "I know this creates friction for X -- here\'s how we\'re mitigating it."',
    },
  ],
  summary: {
    skillsAssessed: ['CS2', 'CS4'],
    strongestSignal: 'Risk identification and structured recommendation in CS2 -- you arrived prepared.',
    clearestGrowthEdge: 'Assumption stress-testing (CS2) and proactive change framing (CS4) -- both are about anticipating the room rather than reacting to it.',
    aiNativePgmSignal: 'Judgment is your differentiator here. AI raised the floor -- now raise the ceiling by stress-testing what you produce before it reaches stakeholders.',
  },
}
