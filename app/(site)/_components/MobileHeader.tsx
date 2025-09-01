'use client'

import { useAppState } from '@/state/useAppState'
import { Sparkles, Bell } from 'lucide-react'

export default function MobileHeader() {
  const { primaryArchetype, currentStreak } = useAppState()

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 safe-area-inset-top">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-happiness-purple to-happiness-coral rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Happiness</h1>
            {primaryArchetype && (
              <p className="text-xs text-gray-500">
                with your {primaryArchetype.name}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {currentStreak > 0 && (
            <div className="flex items-center space-x-1 bg-happiness-yellow/10 px-2 py-1 rounded-full">
              <span className="text-xs text-happiness-yellow font-medium">🔥</span>
              <span className="text-xs font-medium text-gray-700">{currentStreak}</span>
            </div>
          )}
          
          <button 
            className="p-2 tap-highlight-transparent"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  )
}