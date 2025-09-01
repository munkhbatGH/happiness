'use client'

import { useAppState } from '@/state/useAppState'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const { onboardingComplete, quizComplete } = useAppState()
  const router = useRouter()

  useEffect(() => {
    if (!onboardingComplete) {
      router.push('/onboarding')
    } else if (!quizComplete) {
      router.push('/quiz')
    } else {
      router.push('/dashboard')
    }
  }, [onboardingComplete, quizComplete, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-happiness-purple">
      <div className="text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✨</span>
        </div>
        <h1 className="text-white text-xl font-semibold mb-2">Happiness</h1>
        <p className="text-white/80 text-sm">Loading your journey...</p>
      </div>
    </div>
  )
}