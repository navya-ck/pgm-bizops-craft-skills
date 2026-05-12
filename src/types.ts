export interface SkillFinding {
  skillId: string        // e.g. "CS2"
  skillName: string      // e.g. "Execute with Rigor"
  whatChanged: string
  humanContribution: string
  aiRaisedFloor: string
  judgmentDifferentiator: string
  aiFluencyLens: string
  oneAction: string
}

export interface CoachingResult {
  signal: string                  // e.g. "AI raised the floor here"
  signalType: 'floor' | 'judgment' | 'both'
  context: {
    sourceType: string
    jobFamily: string
    level: string
  }
  findings: SkillFinding[]
  summary: {
    skillsAssessed: string[]
    strongestSignal: string
    clearestGrowthEdge: string
    aiNativePgmSignal: string
  }
}
