'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppState } from '@/state/useAppState'
import quizItems from '@/data/quiz_items.json'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { selectedPersona, selectedGoals, completeQuiz } = useAppState()
  const router = useRouter()

  const handleAnswer = (value: number) => {
    const questionId = quizItems[currentQuestion].id
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleNext = () => {
    if (currentQuestion < quizItems.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== quizItems.length) return
    
    setIsSubmitting(true)
    
    try {
      // Submit to scoring API
      const scoreResponse = await fetch('/api/quiz/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([questionId, value]) => ({
            questionId,
            value
          })),
          persona: selectedPersona
        })
      })
      
      const scoreData = await scoreResponse.json()
      
      if (!scoreData.success) throw new Error('Scoring failed')
      
      // Submit to coach matching API
      const matchResponse = await fetch('/api/coach/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: selectedPersona,
          scores: scoreData.scores,
          goals: selectedGoals
        })
      })
      
      const matchData = await matchResponse.json()
      
      if (!matchData.success) throw new Error('Coach matching failed')
      
      // Save to state
      completeQuiz(scoreData.scores, matchData.primaryArchetype, matchData.secondaryArchetype)
      
      // Navigate to dashboard
      router.push('/dashboard')
      
    } catch (error) {
      console.error('Quiz submission error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((currentQuestion + 1) / quizItems.length) * 100
  const currentAnswer = answers[quizItems[currentQuestion]?.id]
  const isLastQuestion = currentQuestion === quizItems.length - 1
  const canContinue = currentAnswer !== undefined

  if (quizItems.length === 0) {
    return <div className="p-4">Loading quiz...</div>
  }

  const currentItem = quizItems[currentQuestion]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Brain Mapping Assessment</span>
          <span className="text-sm text-gray-500">
            {currentQuestion + 1} of {quizItems.length}
          </span>
        </div>
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 rounded-full h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 p-6 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-xl font-semibold text-gray-900 mb-8 text-center leading-relaxed">
            {currentItem.text}
          </h2>
          
          {/* Likert Scale */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-gray-500 px-2">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
            </div>
            
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className={`
                    w-12 h-12 rounded-full border-2 flex items-center justify-center
                    transition-all duration-200 tap-highlight-transparent
                    ${currentAnswer === value
                      ? 'border-primary-600 bg-primary-600 text-white scale-110'
                      : 'border-gray-300 text-gray-600 hover:border-primary-400 active:scale-95'
                    }
                  `}
                >
                  {value}
                </button>
              ))}
            </div>
            
            <div className="flex justify-between text-xs text-gray-400 px-2">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex space-x-3 max-w-md mx-auto">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`
              px-4 py-3 rounded-xl font-medium flex items-center space-x-2 tap-highlight-transparent
              ${currentQuestion === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-50 active:bg-gray-100'
              }
            `}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <button
            onClick={isLastQuestion ? handleSubmit : handleNext}
            disabled={!canContinue || isSubmitting}
            className={`
              flex-1 py-3 rounded-xl font-medium flex items-center justify-center space-x-2
              transition-all duration-200 tap-highlight-transparent
              ${canContinue && !isSubmitting
                ? 'bg-primary-600 text-white shadow-lg hover:bg-primary-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isSubmitting ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>{isLastQuestion ? 'Complete Assessment' : 'Next'}</span>
                {!isLastQuestion && <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-3">
          [IF-Principle: Self-awareness & Mind Coaching]
        </p>
      </div>
    </div>
  )
}