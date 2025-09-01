'use client'

import { useAppState } from '@/state/useAppState'
import { calculateKPIs } from '@/lib/kpis'
import { downloadData } from '@/lib/storage'
import { useState } from 'react'
import { 
  User, 
  Settings, 
  Download, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Award,
  Target,
  TrendingUp,
  Calendar,
  RefreshCw
} from 'lucide-react'
import personas from '@/data/personas.json'

export default function ProfilePage() {
  const {
    selectedPersona,
    selectedGoals,
    primaryArchetype,
    secondaryArchetype,
    quizScores,
    mindGymSessions,
    happinessHistory,
    coachSatisfaction,
    currentStreak,
    notificationsEnabled,
    toggleNotifications,
    exportData,
    resetApp
  } = useAppState()

  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showExportSuccess, setShowExportSuccess] = useState(false)

  const persona = personas.find(p => p.id === selectedPersona)
  const kpis = calculateKPIs(mindGymSessions, happinessHistory, coachSatisfaction, currentStreak)

  const handleExportData = () => {
    const data = exportData()
    downloadData(data, `happiness-data-${new Date().toISOString().split('T')[0]}.json`)
    setShowExportSuccess(true)
    setTimeout(() => setShowExportSuccess(false), 3000)
  }

  const handleReset = () => {
    resetApp()
    setShowResetConfirm(false)
    // Note: In a real app, you might want to redirect to onboarding
  }

  const joinDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
  const daysActive = Math.floor((Date.now() - joinDate.getTime()) / (24 * 60 * 60 * 1000))

  return (
    <div className="space-y-6 pb-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary-500 to-happiness-purple p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Your Profile</h1>
            <p className="text-white/90 text-sm">
              {persona?.name} • {daysActive} days active
            </p>
            {primaryArchetype && (
              <p className="text-white/75 text-sm">
                Primary Coach: {primaryArchetype.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mx-4 grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-happiness-coral/10 rounded-full flex items-center justify-center">
              <Award className="w-4 h-4 text-happiness-coral" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{kpis.totalSessions}</div>
              <div className="text-xs text-gray-600">Total Sessions</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-happiness-green/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-happiness-green" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{kpis.currentStreak}</div>
              <div className="text-xs text-gray-600">Day Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="mx-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Persona</label>
            <div className="mt-1 flex items-center space-x-2">
              <span className="text-xl">{persona?.emoji}</span>
              <span className="text-gray-900">{persona?.name}</span>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">Primary Goals</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedGoals?.map(goal => (
                <span 
                  key={goal}
                  className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                >
                  {goal}
                </span>
              ))}
            </div>
          </div>

          {primaryArchetype && (
            <div>
              <label className="text-sm font-medium text-gray-700">Coach Assignment</label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Primary: {primaryArchetype.name}</div>
                    <div className="text-sm text-gray-600">{primaryArchetype.desc}</div>
                  </div>
                  <div className="text-sm text-primary-600 font-medium">
                    {primaryArchetype.confidence}%
                  </div>
                </div>
                
                {secondaryArchetype && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Secondary: {secondaryArchetype.name}</div>
                      <div className="text-sm text-gray-600">{secondaryArchetype.desc}</div>
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      {secondaryArchetype.confidence}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="mx-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          <button 
            onClick={toggleNotifications}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 tap-highlight-transparent"
          >
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="text-gray-900">Notifications</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {notificationsEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <div className={`
                w-12 h-6 rounded-full transition-colors
                ${notificationsEnabled ? 'bg-primary-600' : 'bg-gray-300'}
              `}>
                <div className={`
                  w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5
                  ${notificationsEnabled ? 'translate-x-6 ml-0.5' : 'translate-x-0.5'}
                `} />
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="mx-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Data & Privacy</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          <button 
            onClick={handleExportData}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 tap-highlight-transparent"
          >
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5 text-gray-500" />
              <div className="text-left">
                <div className="text-gray-900">Export My Data</div>
                <div className="text-sm text-gray-500">Download all your data as JSON</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900 mb-1">Privacy Notice</div>
                <div className="text-sm text-gray-600">
                  Your data is stored locally on your device and never sent to external servers. 
                  You have full control over your information.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support & Help */}
      <div className="mx-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Support & Resources</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <HelpCircle className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900 mb-1">Crisis Resources</div>
                <div className="text-sm text-gray-600 mb-2">
                  If you're experiencing a mental health crisis, please contact:
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>• National Suicide Prevention Lifeline: 988</div>
                  <div>• Crisis Text Line: Text HOME to 741741</div>
                  <div>• Or contact your local emergency services</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                <strong>Remember:</strong> This app provides coaching guidance and wellness tools, 
                not professional therapy or medical advice.
              </p>
              <p>
                For serious mental health concerns, please consult with a qualified healthcare professional.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="mx-4 bg-white rounded-xl shadow-sm border border-red-100">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-red-600">Advanced Options</h2>
        </div>
        
        <div className="p-4">
          <button 
            onClick={() => setShowResetConfirm(true)}
            className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 hover:bg-red-100 tap-highlight-transparent"
          >
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Reset All Data</span>
            </div>
          </button>
        </div>
      </div>

      {/* Export Success Toast */}
      {showExportSuccess && (
        <div className="fixed top-4 left-4 right-4 bg-happiness-green text-white p-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Data exported successfully!</span>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2 text-red-600">Reset All Data</h3>
            <p className="text-gray-600 text-sm mb-6">
              This will permanently delete all your data including quiz results, coach assignments, 
              Mind Gym sessions, and happiness tracking. This action cannot be undone.
            </p>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleReset}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Info */}
      <div className="mx-4 text-center text-sm text-gray-500 pt-4">
        <p>Happiness v1.0</p>
        <p className="text-xs mt-1">Built with Ian Faria's coaching principles</p>
        <p className="text-xs mt-2 italic">
          [IF-Principle: Continuous Growth & Self-Mastery]
        </p>
      </div>
    </div>
  )
}