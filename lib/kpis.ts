import { HappinessScore, MindGymSession } from '@/state/useAppState'

export interface KPIData {
  weeklyMindGymSessions: number
  currentStreak: number
  coachSatisfactionRate: number
  happinessScoreDelta7Day: number
  happinessScoreDelta30Day: number
  averageHappinessScore: number
  totalSessions: number
  favoriteExerciseType: string
}

export function calculateKPIs(
  mindGymSessions: MindGymSession[],
  happinessHistory: HappinessScore[],
  coachSatisfaction: { [messageId: string]: boolean },
  currentStreak: number
): KPIData {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  // Weekly Mind Gym sessions
  const weeklyMindGymSessions = mindGymSessions.filter(session => 
    new Date(session.completedAt) >= sevenDaysAgo
  ).length
  
  // Coach satisfaction rate
  const feedbackValues = Object.values(coachSatisfaction)
  const coachSatisfactionRate = feedbackValues.length > 0 
    ? Math.round((feedbackValues.filter(Boolean).length / feedbackValues.length) * 100)
    : 0
  
  // Happiness score deltas
  const recent7DayScores = happinessHistory.filter(h => 
    new Date(h.date) >= sevenDaysAgo
  )
  const recent30DayScores = happinessHistory.filter(h => 
    new Date(h.date) >= thirtyDaysAgo
  )
  
  const happinessScoreDelta7Day = calculateHappinessDelta(recent7DayScores)
  const happinessScoreDelta30Day = calculateHappinessDelta(recent30DayScores)
  
  // Average happiness score
  const averageHappinessScore = happinessHistory.length > 0
    ? Math.round(happinessHistory.reduce((sum, h) => sum + h.score, 0) / happinessHistory.length)
    : 0
  
  // Favorite exercise type (most common)
  const favoriteExerciseType = getFavoriteExerciseType(mindGymSessions)
  
  return {
    weeklyMindGymSessions,
    currentStreak,
    coachSatisfactionRate,
    happinessScoreDelta7Day,
    happinessScoreDelta30Day,
    averageHappinessScore,
    totalSessions: mindGymSessions.length,
    favoriteExerciseType
  }
}

function calculateHappinessDelta(scores: HappinessScore[]): number {
  if (scores.length < 2) return 0
  
  const sortedScores = scores.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const firstScore = sortedScores[0].score
  const lastScore = sortedScores[sortedScores.length - 1].score
  
  return Math.round(lastScore - firstScore)
}

function getFavoriteExerciseType(sessions: MindGymSession[]): string {
  if (sessions.length === 0) return 'None yet'
  
  const exerciseCounts: { [exerciseId: string]: number } = {}
  
  sessions.forEach(session => {
    exerciseCounts[session.exerciseId] = (exerciseCounts[session.exerciseId] || 0) + 1
  })
  
  const sortedExercises = Object.entries(exerciseCounts)
    .sort(([, a], [, b]) => b - a)
  
  const favoriteExerciseId = sortedExercises[0][0]
  
  // Map exercise IDs to readable names
  const exerciseNames: { [key: string]: string } = {
    gratitude_3x3: 'Gratitude',
    cognitive_reframe: 'Reframing',
    box_breathing: 'Breathing',
    focus_sprint: 'Focus',
    communication_drill: 'Communication',
    values_check: 'Values',
    energy_audit: 'Energy',
    micro_win: 'Victories',
    presence_practice: 'Presence',
    stress_reset: 'Stress Relief'
  }
  
  return exerciseNames[favoriteExerciseId] || 'Various'
}

export function getStreakMessage(streak: number): string {
  if (streak === 0) return "Ready to start your journey?"
  if (streak === 1) return "Great start! Keep going."
  if (streak < 7) return `${streak} days strong! Building momentum.`
  if (streak < 21) return `${streak} days! You're forming a habit.`
  if (streak < 30) return `${streak} days! Incredible consistency.`
  return `${streak} days! You're a happiness champion!`
}

export function getHappinessScoreMessage(score: number): string {
  if (score >= 80) return "You're thriving! Keep up the excellent work."
  if (score >= 60) return "You're doing well. Small improvements compound."
  if (score >= 40) return "You're making progress. Stay consistent."
  if (score >= 20) return "Every step forward counts. You've got this."
  return "Starting your journey is the hardest part. Be kind to yourself."
}

export function generateWeeklyInsight(kpis: KPIData): string {
  let insight = ""
  
  if (kpis.weeklyMindGymSessions >= 5) {
    insight += "🎉 Excellent commitment this week! "
  } else if (kpis.weeklyMindGymSessions >= 3) {
    insight += "👏 Good consistency this week. "
  } else if (kpis.weeklyMindGymSessions >= 1) {
    insight += "🌱 You're making progress. "
  } else {
    insight += "💭 Ready for a fresh start? "
  }
  
  if (kpis.happinessScoreDelta7Day > 5) {
    insight += "Your happiness is trending upward - keep doing what's working!"
  } else if (kpis.happinessScoreDelta7Day > 0) {
    insight += "Small positive changes are accumulating nicely."
  } else if (kpis.happinessScoreDelta7Day === 0) {
    insight += "Consistency is key - you're maintaining your baseline well."
  } else {
    insight += "This week was challenging, but tomorrow is a new opportunity."
  }
  
  return insight
}