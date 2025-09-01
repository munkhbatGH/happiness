'use client'

import { useState, useEffect } from 'react'
import { useAppState } from '@/state/useAppState'
import mindGymExercises from '@/data/mind_gym_exercises.json'
import { Play, Clock, ArrowLeft, CheckCircle, Star, RotateCcw } from 'lucide-react'

interface ExerciseSession {
  exercise: typeof mindGymExercises[0]
  currentStep: number
  isActive: boolean
  isCompleted: boolean
  startTime: number
  timeRemaining: number
}

export default function MindGymPage() {
  const { completeMindGymSession, mindGymSessions } = useAppState()
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)
  const [session, setSession] = useState<ExerciseSession | null>(null)
  const [reflection, setReflection] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const [showCompletion, setShowCompletion] = useState(false)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (session?.isActive && session.timeRemaining > 0) {
      interval = setInterval(() => {
        setSession(prev => {
          if (!prev || prev.timeRemaining <= 1) {
            return prev ? { ...prev, timeRemaining: 0, isActive: false } : null
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 }
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [session?.isActive, session?.timeRemaining])

  // Get today's completed sessions
  const today = new Date().toDateString()
  const todaysCompleted = mindGymSessions.filter(s => 
    new Date(s.completedAt).toDateString() === today
  )

  const startExercise = (exerciseId: string) => {
    const exercise = mindGymExercises.find(e => e.id === exerciseId)
    if (!exercise) return

    setSession({
      exercise,
      currentStep: 0,
      isActive: false,
      isCompleted: false,
      startTime: Date.now(),
      timeRemaining: exercise.duration * 60 // Convert to seconds
    })
    setSelectedExercise(exerciseId)
  }

  const startTimer = () => {
    if (session) {
      setSession(prev => prev ? { ...prev, isActive: true } : null)
    }
  }

  const pauseTimer = () => {
    if (session) {
      setSession(prev => prev ? { ...prev, isActive: false } : null)
    }
  }

  const nextStep = () => {
    if (!session) return
    
    if (session.currentStep < session.exercise.steps.length - 1) {
      setSession(prev => prev ? { ...prev, currentStep: prev.currentStep + 1 } : null)
    } else {
      // Exercise completed
      setSession(prev => prev ? { ...prev, isCompleted: true, isActive: false } : null)
      setShowCompletion(true)
    }
  }

  const completeSession = () => {
    if (session) {
      completeMindGymSession(session.exercise.id, reflection, rating || undefined)
      setSession(null)
      setSelectedExercise(null)
      setReflection('')
      setRating(null)
      setShowCompletion(false)
    }
  }

  const resetExercise = () => {
    setSession(null)
    setSelectedExercise(null)
    setReflection('')
    setRating(null)
    setShowCompletion(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getExerciseColor = (tags: string[]) => {
    if (tags.includes('stress')) return 'bg-red-500'
    if (tags.includes('focus')) return 'bg-blue-500'
    if (tags.includes('communication')) return 'bg-green-500'
    if (tags.includes('attitude')) return 'bg-yellow-500'
    if (tags.includes('leadership')) return 'bg-purple-500'
    return 'bg-gray-500'
  }

  // If showing exercise session
  if (session) {
    return (
      <div className="min-h-screen bg-white">
        {/* Exercise Header */}
        <div className="bg-gradient-to-r from-happiness-purple to-happiness-coral p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={resetExercise}
              className="p-2 rounded-full bg-white/20 tap-highlight-transparent"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold">{session.exercise.title}</h1>
              <p className="text-sm opacity-90">{session.exercise.principle}</p>
            </div>
            
            <button 
              onClick={resetExercise}
              className="p-2 rounded-full bg-white/20 tap-highlight-transparent"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
          
          {/* Timer */}
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {formatTime(session.timeRemaining)}
            </div>
            <div className="flex justify-center space-x-3">
              {!session.isActive && session.timeRemaining > 0 && (
                <button 
                  onClick={startTimer}
                  className="bg-white/20 px-4 py-2 rounded-lg flex items-center space-x-2 tap-highlight-transparent"
                >
                  <Play className="w-4 h-4" />
                  <span>Start</span>
                </button>
              )}
              
              {session.isActive && (
                <button 
                  onClick={pauseTimer}
                  className="bg-white/20 px-4 py-2 rounded-lg tap-highlight-transparent"
                >
                  Pause
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Exercise Content */}
        <div className="p-6 space-y-6">
          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Step {session.currentStep + 1} of {session.exercise.steps.length}</span>
              <span>{Math.round(((session.currentStep + 1) / session.exercise.steps.length) * 100)}% Complete</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-happiness-purple rounded-full h-2 transition-all duration-300"
                style={{ width: `${((session.currentStep + 1) / session.exercise.steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Step */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {session.exercise.steps[session.currentStep]}
            </h3>
            
            {session.currentStep === 0 && (
              <div className="space-y-3">
                <p className="text-gray-600">{session.exercise.description}</p>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium mb-2">Benefits:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {session.exercise.benefits.map((benefit, idx) => (
                      <li key={idx}>• {benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* All Steps Overview */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Exercise Steps:</h4>
            {session.exercise.steps.map((step, idx) => (
              <div 
                key={idx}
                className={`
                  p-3 rounded-lg border-l-4 text-sm
                  ${idx === session.currentStep 
                    ? 'border-happiness-purple bg-happiness-purple/5 text-gray-900' 
                    : idx < session.currentStep
                    ? 'border-green-500 bg-green-50 text-gray-700'
                    : 'border-gray-200 bg-gray-50 text-gray-500'
                  }
                `}
              >
                <div className="flex items-center space-x-2">
                  {idx < session.currentStep && <CheckCircle className="w-4 h-4 text-green-500" />}
                  <span className="font-medium">{idx + 1}.</span>
                  <span>{step}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              onClick={nextStep}
              className="w-full bg-happiness-purple text-white py-3 rounded-xl font-medium tap-highlight-transparent"
            >
              {session.currentStep === session.exercise.steps.length - 1 ? 'Complete Exercise' : 'Next Step'}
            </button>
          </div>
        </div>

        {/* Completion Modal */}
        {showCompletion && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Exercise Complete!</h3>
                <p className="text-gray-600 text-sm">How did that feel?</p>
              </div>
              
              {/* Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rate this exercise:</label>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`tap-highlight-transparent ${
                        rating && star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Reflection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Quick reflection (optional):</label>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="How do you feel? Any insights?"
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                  rows={3}
                />
              </div>
              
              <button
                onClick={completeSession}
                className="w-full bg-happiness-green text-white py-3 rounded-lg font-medium tap-highlight-transparent"
              >
                Save & Continue
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Main Mind Gym page
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mind Gym</h1>
        <p className="text-gray-600">
          5-minute exercises to strengthen your mental fitness
        </p>
        <p className="text-xs text-gray-500 mt-1">
          [IF-Principle: Mind Coaching & Daily Practice]
        </p>
      </div>

      {/* Today's Progress */}
      {todaysCompleted.length > 0 && (
        <div className="bg-happiness-green/10 rounded-xl p-4 border border-happiness-green/20">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-happiness-green" />
            <span className="font-medium text-happiness-green">Great work today!</span>
          </div>
          <p className="text-sm text-gray-600">
            You've completed {todaysCompleted.length} exercise{todaysCompleted.length > 1 ? 's' : ''} today.
          </p>
        </div>
      )}

      {/* Exercise Categories */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Choose Your Exercise</h2>
        
        {mindGymExercises.map((exercise) => {
          const isCompletedToday = todaysCompleted.some(s => s.exerciseId === exercise.id)
          
          return (
            <div 
              key={exercise.id}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{exercise.title}</h3>
                    {isCompletedToday && (
                      <CheckCircle className="w-4 h-4 text-happiness-green" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{exercise.description}</p>
                  <p className="text-xs text-gray-500 mb-3">{exercise.principle}</p>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{exercise.duration}m</span>
                </div>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {exercise.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Benefits */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-1">Benefits:</p>
                <div className="text-xs text-gray-600 space-y-1">
                  {exercise.benefits.slice(0, 2).map((benefit, idx) => (
                    <p key={idx}>• {benefit}</p>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => startExercise(exercise.id)}
                className={`
                  w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2
                  transition-colors tap-highlight-transparent
                  ${isCompletedToday
                    ? 'bg-happiness-green/10 text-happiness-green border border-happiness-green/20'
                    : 'bg-happiness-purple text-white hover:bg-happiness-purple/80'
                  }
                `}
              >
                <Play className="w-4 h-4" />
                <span>{isCompletedToday ? 'Practice Again' : 'Start Exercise'}</span>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}