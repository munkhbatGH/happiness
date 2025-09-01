'use client'

import { useAppState } from '@/state/useAppState'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import BottomNavigation from './_components/BottomNavigation'
import MobileHeader from './_components/MobileHeader'
import ServiceWorkerRegister from './_components/ServiceWorkerRegister'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { onboardingComplete, quizComplete } = useAppState()
  const router = useRouter()

  useEffect(() => {
    // Redirect logic for onboarding
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      
      if (!onboardingComplete && currentPath !== '/onboarding') {
        router.push('/onboarding')
      } else if (onboardingComplete && !quizComplete && currentPath !== '/quiz') {
        router.push('/quiz')
      }
    }
  }, [onboardingComplete, quizComplete, router])

  // Don't show layout during onboarding/quiz
  if (!onboardingComplete || !quizComplete) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ServiceWorkerRegister />
      <MobileHeader />
      
      <main className="flex-1 pb-20 pt-16">
        {children}
      </main>
      
      <BottomNavigation />
    </div>
  )
}