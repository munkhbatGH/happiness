import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface QuizScore {
  stress_regulation: number
  focus_control: number
  comm_confidence: number
  leadership_clarity: number
  resilience: number
  attitude_positivity: number
  purpose_alignment: number
}

export interface CoachArchetype {
  id: string
  name: string
  desc: string
  principles: string[]
  confidence: number
}

export interface MindGymSession {
  exerciseId: string
  completedAt: string
  reflection?: string
  rating?: number
}

export interface HappinessScore {
  date: string
  score: number
  mood: number
  mindGymCompleted: boolean
  coachFeedback?: number
}

export interface AppState {
  // Onboarding
  onboardingComplete: boolean
  selectedPersona: string | null
  selectedGoals: string[]
  
  // Quiz & Scoring
  quizComplete: boolean
  quizScores: QuizScore | null
  primaryArchetype: CoachArchetype | null
  secondaryArchetype: CoachArchetype | null
  
  // Mind Gym
  mindGymSessions: MindGymSession[]
  currentStreak: number
  
  // Happiness tracking
  happinessHistory: HappinessScore[]
  
  // Coach feedback
  coachSatisfaction: { [messageId: string]: boolean }
  
  // Settings
  notificationsEnabled: boolean
}

export interface AppActions {
  // Onboarding
  completeOnboarding: (persona: string, goals: string[]) => void
  
  // Quiz
  completeQuiz: (scores: QuizScore, primary: CoachArchetype, secondary: CoachArchetype) => void
  
  // Mind Gym
  completeMindGymSession: (exerciseId: string, reflection?: string, rating?: number) => void
  updateStreak: () => void
  
  // Happiness
  addHappinessScore: (score: number, mood: number, mindGymCompleted: boolean, coachFeedback?: number) => void
  
  // Coach feedback
  setCoachFeedback: (messageId: string, positive: boolean) => void
  
  // Settings
  toggleNotifications: () => void
  
  // Data export
  exportData: () => string
  
  // Reset (for testing)
  resetApp: () => void
}

const initialState: AppState = {
  onboardingComplete: false,
  selectedPersona: null,
  selectedGoals: [],
  quizComplete: false,
  quizScores: null,
  primaryArchetype: null,
  secondaryArchetype: null,
  mindGymSessions: [],
  currentStreak: 0,
  happinessHistory: [],
  coachSatisfaction: {},
  notificationsEnabled: true,
}

export const useAppState = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      completeOnboarding: (persona: string, goals: string[]) =>
        set({
          onboardingComplete: true,
          selectedPersona: persona,
          selectedGoals: goals,
        }),
      
      completeQuiz: (scores: QuizScore, primary: CoachArchetype, secondary: CoachArchetype) =>
        set({
          quizComplete: true,
          quizScores: scores,
          primaryArchetype: primary,
          secondaryArchetype: secondary,
        }),
      
      completeMindGymSession: (exerciseId: string, reflection?: string, rating?: number) => {
        const session: MindGymSession = {
          exerciseId,
          completedAt: new Date().toISOString(),
          reflection,
          rating,
        }
        
        set((state) => ({
          mindGymSessions: [...state.mindGymSessions, session]
        }))
        
        get().updateStreak()
      },
      
      updateStreak: () => {
        const sessions = get().mindGymSessions
        const today = new Date().toDateString()
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
        
        const todaySessions = sessions.filter(s => 
          new Date(s.completedAt).toDateString() === today
        )
        
        if (todaySessions.length > 0) {
          let streak = 1
          let checkDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
          
          while (checkDate) {
            const dayString = checkDate.toDateString()
            const daySessions = sessions.filter(s => 
              new Date(s.completedAt).toDateString() === dayString
            )
            
            if (daySessions.length > 0) {
              streak++
              checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000)
            } else {
              break
            }
          }
          
          set({ currentStreak: streak })
        }
      },
      
      addHappinessScore: (score: number, mood: number, mindGymCompleted: boolean, coachFeedback?: number) => {
        const happinessScore: HappinessScore = {
          date: new Date().toDateString(),
          score,
          mood,
          mindGymCompleted,
          coachFeedback,
        }
        
        set((state) => ({
          happinessHistory: [...state.happinessHistory, happinessScore]
        }))
      },
      
      setCoachFeedback: (messageId: string, positive: boolean) =>
        set((state) => ({
          coachSatisfaction: {
            ...state.coachSatisfaction,
            [messageId]: positive
          }
        })),
      
      toggleNotifications: () =>
        set((state) => ({
          notificationsEnabled: !state.notificationsEnabled
        })),
      
      exportData: () => {
        const state = get()
        return JSON.stringify({
          ...state,
          exportedAt: new Date().toISOString(),
          version: '1.0'
        }, null, 2)
      },
      
      resetApp: () => set(initialState),
    }),
    {
      name: 'happiness.v1',
    }
  )
)