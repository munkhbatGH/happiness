import { NextRequest, NextResponse } from 'next/server'
import { matchCoach } from '@/lib/matching'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { persona, scores, goals, preference } = body
    
    if (!persona || !scores) {
      return NextResponse.json(
        { error: 'Missing required fields: persona and scores' },
        { status: 400 }
      )
    }
    
    // Match coach based on persona, scores, goals, and preference
    const matchResult = matchCoach(persona, scores, goals || [], preference)
    
    return NextResponse.json({
      ...matchResult,
      success: true
    })
    
  } catch (error) {
    console.error('Coach matching error:', error)
    return NextResponse.json(
      { error: 'Failed to match coach' },
      { status: 500 }
    )
  }
}