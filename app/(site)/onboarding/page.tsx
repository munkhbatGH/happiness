'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppState } from '@/state/useAppState'
import personas from '@/data/personas.json'
import { ArrowRight, Check } from 'lucide-react'

const availableGoals = [
  'Reduce stress and anxiety',
  'Improve focus and concentration',
  'Build confidence',
  'Develop leadership skills',
  'Better work-life balance',
  'Enhance communication',
  'Find purpose and clarity',
  'Build resilience',
  'Increase motivation',
  'Manage time better'
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [selectedPersona, setSelectedPersona] = useState<string>('')
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  
  const { completeOnboarding } = useAppState()
  const router = useRouter()

  const handlePersonaSelect = (personaId: string) => {
    setSelectedPersona(personaId)
  }

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    )
  }

  const handleComplete = () => {
    if (selectedPersona && selectedGoals.length > 0 && agreedToTerms) {
      completeOnboarding(selectedPersona, selectedGoals)
      router.push('/quiz')
    }
  }

  const canProceed = () => {
    if (step === 1) return selectedPersona !== ''
    if (step === 2) return selectedGoals.length > 0
    if (step === 3) return agreedToTerms
    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-happiness-purple flex flex-col">
      {/* Progress Bar */}
      <div className="p-4">
        <div className="bg-white/20 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
        <p className="text-white/80 text-sm mt-2 text-center">
          Step {step} of 3
        </p>
      </div>

      <div className="flex-1 p-4">
        {step === 1 && (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to Happiness</h1>
            <p className="text-white/80 mb-8">
              Your personal journey to mindfulness and well-being starts here.
              <br />
              <span className="text-sm italic">
                [IF-Principle: Mind Coaching & Attitude Enhancement]
              </span>
            </p>
            
            <h2 className="text-xl font-semibold text-white mb-6">
              Which category describes you best?
            </h2>
            
            <div className="space-y-3">
              {personas.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => handlePersonaSelect(persona.id)}
                  className={`
                    w-full p-4 rounded-xl text-left transition-all duration-200 tap-highlight-transparent
                    ${selectedPersona === persona.id
                      ? 'bg-white text-gray-900 shadow-lg scale-105'
                      : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{persona.emoji}</span>
                      <div>
                        <h3 className="font-medium">{persona.name}</h3>
                        <p className="text-sm opacity-80">{persona.ageRange}</p>
                      </div>
                    </div>
                    {selectedPersona === persona.id && (
                      <Check className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                  <p className="text-sm mt-2 opacity-90">
                    {persona.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">What are your goals?</h2>
            <p className="text-white/80 mb-8">
              Select all that apply. We'll personalize your experience.
            </p>
            
            <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
              {availableGoals.map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleGoalToggle(goal)}
                  className={`
                    p-3 rounded-lg text-left transition-all duration-200 tap-highlight-transparent
                    ${selectedGoals.includes(goal)
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{goal}</span>
                    {selectedGoals.includes(goal) && (
                      <Check className="w-4 h-4 text-primary-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            <p className="text-white/60 text-xs mt-4">
              Selected: {selectedGoals.length} goal{selectedGoals.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Almost there!</h2>
            
            <div className="bg-white/10 rounded-xl p-6 mb-6 text-left">
              <h3 className="font-semibold text-white mb-4">Important Notice</h3>
              <div className="text-white/90 text-sm space-y-3">
                <p>
                  • This app provides coaching guidance, not professional therapy
                </p>
                <p>
                  • If you're experiencing a mental health crisis, please contact a healthcare professional
                </p>
                <p>
                  • Your data stays private and secure on your device
                </p>
                <p>
                  • You can export or delete your data anytime
                </p>
              </div>
            </div>
            
            <label className="flex items-start space-x-3 cursor-pointer tap-highlight-transparent">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-white/90 text-sm text-left">
                I understand this is coaching guidance, not therapy, and I agree to use this app responsibly.
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="p-4">
        <div className="flex space-x-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 bg-white/20 text-white py-3 rounded-xl font-medium tap-highlight-transparent"
            >
              Back
            </button>
          )}
          
          <button
            onClick={() => {
              if (step < 3) {
                setStep(step + 1)
              } else {
                handleComplete()
              }
            }}
            disabled={!canProceed()}
            className={`
              flex-1 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 tap-highlight-transparent
              transition-all duration-200
              ${canProceed()
                ? 'bg-white text-primary-600 shadow-lg'
                : 'bg-white/20 text-white/50 cursor-not-allowed'
              }
            `}
          >
            <span>{step === 3 ? 'Start Your Journey' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}