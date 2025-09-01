'use client'

import { useAppState } from '@/state/useAppState'
import { calculateKPIs, getStreakMessage, getHappinessScoreMessage, generateWeeklyInsight } from '@/lib/kpis'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Play, TrendingUp, Award, MessageCircle, ArrowRight, Plus } from 'lucide-react'
import mindGymExercises from '@/data/mind_gym_exercises.json'

export default function DashboardPage() {
  const {
    primaryArchetype,
    secondaryArchetype,
    currentStreak,
    mindGymSessions,
    happinessHistory,
    coachSatisfaction,
    addHappinessScore,
    selectedPersona
  } = useAppState()

  const [todaysHappinessScore, setTodaysHappinessScore] = useState<number | null>(null)
  const [todaysMood, setTodaysMood] = useState<number | null>(null)
  const [showMoodCheck, setShowMoodCheck] = useState(false)

  const kpis = calculateKPIs(mindGymSessions, happinessHistory, coachSatisfaction, currentStreak)
  const todaysExercise = mindGymExercises[Math.floor(Math.random() * mindGymExercises.length)]
  const weeklyInsight = generateWeeklyInsight(kpis)
  
  // Get today's sessions
  const today = new Date().toDateString()
  const todaysSessions = mindGymSessions.filter(s => 
    new Date(s.completedAt).toDateString() === today
  )
  
  // Check if user has recorded happiness today
  const todaysHappiness = happinessHistory.find(h => h.date === today)

  useEffect(() => {
    // Show mood check-in if not done today
    if (!todaysHappiness && !showMoodCheck) {
      const timer = setTimeout(() => setShowMoodCheck(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [todaysHappiness, showMoodCheck])

  const handleMoodSubmit = () => {
    if (todaysMood && todaysHappinessScore) {
      addHappinessScore(
        todaysHappinessScore, 
        todaysMood, 
        todaysSessions.length > 0
      )
      setShowMoodCheck(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const coachTips = {
    leadership: [
      "Leaders inspire by example. What example will you set today? [IF-Principle: Leadership]",
      "Authentic leadership starts with self-awareness. Take 5 minutes to reflect. [IF-Principle: Leadership]",
      "Great leaders ask great questions. What's one question that could unlock clarity today? [IF-Principle: Communication]"
    ],
    communication: [
      "Confidence grows through practice. Try one small communication win today. [IF-Principle: Communication]",
      "Listen more than you speak today. Notice what changes. [IF-Principle: Communication]",
      "Your voice matters. Find one opportunity to share your perspective. [IF-Principle: Communication]"
    ],
    resilience: [
      "Resilience is built in small moments. How will you practice it today? [IF-Principle: Mind Coaching]",
      "When stress rises, your breath is your anchor. Use it wisely. [IF-Principle: Mind Coaching]",
      "Every challenge is training for the next one. What is today teaching you? [IF-Principle: Mind Coaching]"
    ],
    clarity: [
      "Clarity comes from alignment. Check in with your values today. [IF-Principle: Leadership]",
      "Decision paralysis dissolves with action. What's one small step you can take? [IF-Principle: Excellence]",
      "Your purpose is your compass. Let it guide today's choices. [IF-Principle: Leadership]"
    ],
    focus: [
      "Focus is a superpower in a distracted world. Guard it carefully. [IF-Principle: Mind Coaching]",
      "Deep work happens when you eliminate, not when you multitask. [IF-Principle: Excellence]",
      "Your attention is your most valuable asset. Invest it wisely. [IF-Principle: Mind Coaching]"
    ],
    attitude: [
      "Your attitude determines your altitude. Choose elevation today. [IF-Principle: Attitude Enhancement]",
      "Gratitude transforms ordinary moments into extraordinary ones. [IF-Principle: Attitude Enhancement]",
      "Excellence is not an act but a habit. What habit will you build today? [IF-Principle: Excellence]"
    ]
  }

  const getTodaysTip = () => {
    if (!primaryArchetype) return "Welcome to your happiness journey!"
    const tips = coachTips[primaryArchetype.id as keyof typeof coachTips] || coachTips.attitude
    return tips[new Date().getDate() % tips.length]
  }

  return (
    <div className="p-4 space-y-6 pb-8">
      {/* Mood Check-in Modal */}
      {showMoodCheck && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">How are you feeling today?</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Overall Mood (1-10)</label>
                <div className="flex justify-between">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                    <button
                      key={val}
                      onClick={() => setTodaysMood(val)}
                      className={`
                        w-8 h-8 rounded-full border-2 text-sm
                        ${todaysMood === val
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-gray-300 text-gray-600'
                        }
                      `}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Happiness Level (1-10)</label>
                <div className="flex justify-between">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                    <button
                      key={val}
                      onClick={() => setTodaysHappinessScore(val)}
                      className={`
                        w-8 h-8 rounded-full border-2 text-sm
                        ${todaysHappinessScore === val
                          ? 'border-happiness-yellow bg-happiness-yellow text-white'
                          : 'border-gray-300 text-gray-600'
                        }
                      `}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setShowMoodCheck(false)}
                className="flex-1 py-2 text-gray-600 border border-gray-300 rounded-lg"
              >
                Skip
              </button>
              <button 
                onClick={handleMoodSubmit}
                disabled={!todaysMood || !todaysHappinessScore}
                className="flex-1 py-2 bg-primary-600 text-white rounded-lg disabled:bg-gray-300"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}! 👋
        </h1>
        {primaryArchetype && (
          <p className="text-gray-600 mt-1">
            Your {primaryArchetype.name} has some insights for you
          </p>
        )}
      </div>

      {/* Happiness Score Card */}
      <div className="bg-gradient-to-r from-happiness-yellow to-happiness-coral rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Happiness Score</h3>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold">
                {todaysHappiness?.score || kpis.averageHappinessScore || '--'}
              </span>
              <span className="text-sm opacity-80">/ 10</span>
              {kpis.happinessScoreDelta7Day !== 0 && (
                <div className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded-full">
                  <TrendingUp className={`w-3 h-3 ${kpis.happinessScoreDelta7Day > 0 ? 'text-green-300' : 'text-red-300'}`} />
                  <span className="text-xs">
                    {kpis.happinessScoreDelta7Day > 0 ? '+' : ''}{kpis.happinessScoreDelta7Day}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm opacity-80">7-day trend</p>
            <p className="text-xs opacity-70">
              {getHappinessScoreMessage(todaysHappiness?.score || kpis.averageHappinessScore)}
            </p>
          </div>
        </div>
      </div>

      {/* Today's Mind Gym */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Today's Mind Gym</h3>
          <Award className="w-5 h-5 text-happiness-purple" />
        </div>
        
        <div className="bg-gradient-to-r from-happiness-purple/10 to-happiness-coral/10 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-2">{todaysExercise.title}</h4>
          <p className="text-sm text-gray-600 mb-3">{todaysExercise.description}</p>
          <p className="text-xs text-gray-500 mb-3">{todaysExercise.principle}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{todaysExercise.duration} minutes</span>
            <Link 
              href="/mind-gym"
              className="bg-happiness-purple text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 hover:bg-happiness-purple/80"
            >
              <Play className="w-3 h-3" />
              <span>Start</span>
            </Link>
          </div>
        </div>
        
        {todaysSessions.length > 0 && (
          <div className="text-center text-sm text-happiness-green">
            ✅ Completed {todaysSessions.length} session{todaysSessions.length > 1 ? 's' : ''} today!
          </div>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-happiness-coral mb-1">
            {kpis.currentStreak}
          </div>
          <div className="text-sm text-gray-600 mb-2">Day Streak</div>
          <div className="text-xs text-gray-500">
            {getStreakMessage(kpis.currentStreak)}
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-happiness-green mb-1">
            {kpis.weeklyMindGymSessions}
          </div>
          <div className="text-sm text-gray-600 mb-2">This Week</div>
          <div className="text-xs text-gray-500">
            Mind Gym sessions
          </div>
        </div>
      </div>

      {/* Coach Message */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-2">
              Today's Coaching Insight
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {getTodaysTip()}
            </p>
            
            <Link 
              href="/coach"
              className="inline-flex items-center space-x-1 text-primary-600 text-sm mt-3 hover:text-primary-700"
            >
              <span>Chat with your coach</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Weekly Insight */}
      {weeklyInsight && (
        <div className="bg-gradient-to-r from-primary-500 to-happiness-purple rounded-xl p-6 text-white">
          <h3 className="font-semibold mb-2">Weekly Insight</h3>
          <p className="text-sm opacity-90">
            {weeklyInsight}
          </p>
          <p className="text-xs opacity-75 mt-2">
            [IF-Principle: Continuous Improvement & Self-Awareness]
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link 
          href="/mind-gym"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
        >
          <div className="w-8 h-8 bg-happiness-purple/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Plus className="w-4 h-4 text-happiness-purple" />
          </div>
          <div className="text-sm font-medium text-gray-900">Start Exercise</div>
        </Link>
        
        <Link 
          href="/coach"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
        >
          <div className="w-8 h-8 bg-primary-600/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <MessageCircle className="w-4 h-4 text-primary-600" />
          </div>
          <div className="text-sm font-medium text-gray-900">Ask Coach</div>
        </Link>
      </div>
    </div>
  )
}