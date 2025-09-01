import { NextRequest, NextResponse } from 'next/server'
import { calculateQuizScores, getConstructInsights, generatePersonalityInsight } from '@/lib/scoring'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers, persona } = body
    
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Invalid answers format' },
        { status: 400 }
      )
    }
    
    // Calculate normalized scores
    const scores = calculateQuizScores(answers)
    
    // Generate insights
    const insights = getConstructInsights(scores)
    
    // Generate personality insight
    const personalityInsight = persona ? generatePersonalityInsight(scores, persona) : null
    
    return NextResponse.json({
      scores,
      insights,
      personalityInsight,
      success: true
    })
    
  } catch (error) {
    console.error('Quiz scoring error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate quiz scores' },
      { status: 500 }
    )
  }
}