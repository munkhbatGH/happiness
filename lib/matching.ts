import coachArchetypes from '@/data/coach_archetypes.json'
import personas from '@/data/personas.json'
import { QuizScore, CoachArchetype } from '@/state/useAppState'

export interface CoachMatchResult {
  primaryArchetype: CoachArchetype
  secondaryArchetype: CoachArchetype
  rationale: string
  nextSteps: string[]
  confidence: number
}

export function matchCoach(
  persona: string,
  scores: QuizScore,
  goals: string[],
  preference?: string
): CoachMatchResult {
  const personaData = personas.find(p => p.id === persona)
  if (!personaData) {
    throw new Error(`Persona ${persona} not found`)
  }
  
  // Calculate weighted scores based on persona
  const weights = personaData.weights
  const weightedScores: { [archetypeId: string]: number } = {}
  
  // Map constructs to archetype preferences
  const archetypeMapping = {
    leadership: ['leadership_clarity', 'purpose_alignment'],
    communication: ['comm_confidence'],
    resilience: ['stress_regulation', 'resilience'],
    clarity: ['leadership_clarity', 'purpose_alignment'],
    focus: ['focus_control'],
    attitude: ['attitude_positivity']
  }
  
  // Calculate match scores for each archetype
  coachArchetypes.forEach(archetype => {
    let score = 0
    const relevantConstructs = archetypeMapping[archetype.id as keyof typeof archetypeMapping] || []
    
    relevantConstructs.forEach(construct => {
      const weight = weights[construct as keyof typeof weights] || 0
      const constructScore = scores[construct as keyof QuizScore] || 0
      score += weight * constructScore
    })
    
    // Apply persona-specific bonuses
    if (archetype.id === 'leadership' && persona === 'leaders') score *= 1.3
    if (archetype.id === 'communication' && persona === 'career') score *= 1.2
    if (archetype.id === 'resilience' && persona === 'business') score *= 1.2
    if (archetype.id === 'focus' && persona === 'students') score *= 1.3
    
    // Apply preference bonus
    if (preference === archetype.id) score *= 1.5
    
    weightedScores[archetype.id] = score
  })
  
  // Find top 2 matches
  const sortedMatches = Object.entries(weightedScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
  
  const primaryArchetypeData = coachArchetypes.find(a => a.id === sortedMatches[0][0])!
  const secondaryArchetypeData = coachArchetypes.find(a => a.id === sortedMatches[1][0])!
  
  // Create coach archetype objects with confidence scores
  const primaryArchetype: CoachArchetype = {
    ...primaryArchetypeData,
    confidence: Math.round((sortedMatches[0][1] / 100) * 100)
  }
  
  const secondaryArchetype: CoachArchetype = {
    ...secondaryArchetypeData,
    confidence: Math.round((sortedMatches[1][1] / 100) * 100)
  }
  
  // Generate rationale
  const rationale = generateRationale(persona, scores, primaryArchetype, secondaryArchetype)
  
  // Generate next steps
  const nextSteps = generateNextSteps(persona, primaryArchetype, scores)
  
  return {
    primaryArchetype,
    secondaryArchetype,
    rationale,
    nextSteps,
    confidence: primaryArchetype.confidence
  }
}

function generateRationale(
  persona: string,
  scores: QuizScore,
  primary: CoachArchetype,
  secondary: CoachArchetype
): string {
  const personaLabels: { [key: string]: string } = {
    leaders: 'corporate leader',
    career: 'career professional',
    business: 'business owner',
    students: 'student'
  }
  
  const personaLabel = personaLabels[persona] || 'individual'
  
  let rationale = `Based on your profile as a ${personaLabel}, I've matched you with a ${primary.name} as your primary coach. `
  
  // Add specific reasoning based on scores
  const topScores = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
  
  if (primary.id === 'leadership') {
    rationale += `Your strong leadership clarity (${scores.leadership_clarity}%) and need for authentic influence make this an ideal match. `
  } else if (primary.id === 'communication') {
    rationale += `Your communication confidence score (${scores.comm_confidence}%) indicates great potential that this coach can unlock. `
  } else if (primary.id === 'resilience') {
    rationale += `Your stress regulation (${scores.stress_regulation}%) and resilience (${scores.resilience}%) patterns show you'd benefit most from mental coaching techniques. `
  } else if (primary.id === 'focus') {
    rationale += `Your focus control score (${scores.focus_control}%) suggests concentration and study strategies will have the biggest impact. `
  } else if (primary.id === 'attitude') {
    rationale += `Your attitude positivity (${scores.attitude_positivity}%) shows strong foundation for developing an excellence mindset. `
  }
  
  rationale += `Your ${secondary.name} as a secondary coach will complement this by addressing ${secondary.desc.toLowerCase()}.`
  
  return rationale
}

function generateNextSteps(persona: string, primary: CoachArchetype, scores: QuizScore): string[] {
  const steps: string[] = []
  
  // Primary coach specific steps
  if (primary.id === 'leadership') {
    steps.push('Complete your leadership values assessment')
    steps.push('Practice authentic leadership scenarios daily')
    steps.push('Implement one new influence technique this week')
  } else if (primary.id === 'communication') {
    steps.push('Record yourself explaining a key concept for 60 seconds')
    steps.push('Practice active listening in your next 3 conversations')
    steps.push('Join a speaking opportunity this month')
  } else if (primary.id === 'resilience') {
    steps.push('Implement daily stress regulation breathing exercises')
    steps.push('Practice cognitive reframing for one challenge today')
    steps.push('Create a resilience recovery routine')
  } else if (primary.id === 'focus') {
    steps.push('Try the Pomodoro technique for your most important task')
    steps.push('Audit and minimize your digital distractions')
    steps.push('Establish a consistent focus ritual')
  } else if (primary.id === 'attitude') {
    steps.push('Write down 3 wins from today before bed')
    steps.push('Set one higher standard for yourself this week')
    steps.push('Practice gratitude reframing for any setbacks')
  }
  
  return steps
}