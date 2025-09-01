import quizItems from '@/data/quiz_items.json'
import { QuizScore } from '@/state/useAppState'

export interface QuizAnswer {
  questionId: string
  value: number // 1-5 Likert scale
}

export interface ConstructScore {
  construct: string
  rawScore: number
  normalizedScore: number // 0-100
}

export function calculateQuizScores(answers: QuizAnswer[]): QuizScore {
  // Group answers by construct
  const constructAnswers: { [construct: string]: number[] } = {}
  
  answers.forEach(answer => {
    const question = quizItems.find(q => q.id === answer.questionId)
    if (!question) return
    
    const construct = question.construct
    if (!constructAnswers[construct]) {
      constructAnswers[construct] = []
    }
    
    // Handle reverse-scored items
    const score = question.reverse ? (6 - answer.value) : answer.value
    constructAnswers[construct].push(score)
  })
  
  // Calculate normalized scores (0-100) for each construct
  const scores: QuizScore = {
    stress_regulation: 0,
    focus_control: 0,
    comm_confidence: 0,
    leadership_clarity: 0,
    resilience: 0,
    attitude_positivity: 0,
    purpose_alignment: 0,
  }
  
  Object.keys(constructAnswers).forEach(construct => {
    const answers = constructAnswers[construct]
    const average = answers.reduce((sum, score) => sum + score, 0) / answers.length
    const normalized = ((average - 1) / 4) * 100 // Convert 1-5 scale to 0-100
    
    if (construct in scores) {
      scores[construct as keyof QuizScore] = Math.round(normalized)
    }
  })
  
  return scores
}

export function getConstructInsights(scores: QuizScore): {
  strengths: string[]
  developmentAreas: string[]
  topConstruct: string
  lowestConstruct: string
} {
  const constructLabels = {
    stress_regulation: 'Stress Regulation',
    focus_control: 'Focus Control',
    comm_confidence: 'Communication Confidence',
    leadership_clarity: 'Leadership Clarity',
    resilience: 'Resilience',
    attitude_positivity: 'Positive Attitude',
    purpose_alignment: 'Purpose Alignment',
  }
  
  const sortedScores = Object.entries(scores)
    .map(([construct, score]) => ({ construct, score, label: constructLabels[construct as keyof typeof constructLabels] }))
    .sort((a, b) => b.score - a.score)
  
  const strengths = sortedScores
    .filter(item => item.score >= 70)
    .map(item => item.label)
  
  const developmentAreas = sortedScores
    .filter(item => item.score < 50)
    .map(item => item.label)
  
  return {
    strengths,
    developmentAreas,
    topConstruct: sortedScores[0].label,
    lowestConstruct: sortedScores[sortedScores.length - 1].label,
  }
}

export function generatePersonalityInsight(scores: QuizScore, persona: string): string {
  const insights = getConstructInsights(scores)
  const personaLabels: { [key: string]: string } = {
    leaders: 'leader',
    career: 'professional',
    business: 'entrepreneur',
    students: 'student'
  }
  
  const personaLabel = personaLabels[persona] || 'individual'
  
  let insight = `As a ${personaLabel}, your strongest area is ${insights.topConstruct.toLowerCase()}, which is excellent for your role. `
  
  if (insights.developmentAreas.length > 0) {
    insight += `You have opportunities to grow in ${insights.developmentAreas.join(' and ').toLowerCase()}, `
    insight += `which will significantly enhance your ${persona === 'leaders' ? 'leadership effectiveness' : 
                                                        persona === 'career' ? 'career progression' :
                                                        persona === 'business' ? 'entrepreneurial success' :
                                                        'academic performance'}. `
  }
  
  if (insights.strengths.length > 1) {
    insight += `Your combination of strengths in ${insights.strengths.slice(0, 2).join(' and ').toLowerCase()} `
    insight += `gives you a solid foundation to build upon.`
  }
  
  return insight
}