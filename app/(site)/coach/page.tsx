'use client'

import { useState, useRef, useEffect } from 'react'
import { useAppState } from '@/state/useAppState'
import { Send, ThumbsUp, ThumbsDown, RefreshCw, User, Bot } from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'user' | 'coach'
  content: string
  timestamp: Date
  coachType?: string
  principle?: string
}

interface CoachResponse {
  content: string
  principle: string
  followUp?: string
}

export default function CoachPage() {
  const { primaryArchetype, secondaryArchetype, setCoachFeedback, coachSatisfaction } = useAppState()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  // Canned responses based on coach archetype and user input
  const getCoachResponse = (userInput: string, archetype: any): CoachResponse => {
    const input = userInput.toLowerCase()
    
    const responses = {
      leadership: {
        stress: {
          content: "When leaders feel stressed, it's often because we're carrying more than our share. Here's a powerful reframe: stress is information, not instruction. Take a deep breath and ask yourself: 'What is this stress trying to tell me?' Then, delegate what you can, eliminate what doesn't serve your vision, and focus on what only you can do.",
          principle: "IF-Principle: Leadership & Mind Coaching",
          followUp: "Try this: List 3 things causing stress. For each, ask 'Can I delegate this? Can I eliminate this? Or do I need to tackle this differently?'"
        },
        communication: {
          content: "Great leaders are made in moments of authentic communication. Before your next important conversation, take 60 seconds to clarify your intention: What outcome do you want? What value do you want to create? Then speak from that place of clarity and service.",
          principle: "IF-Principle: Leadership & Communication",
          followUp: "Practice this today: Before any important conversation, pause and set a clear, value-based intention."
        },
        decisions: {
          content: "Decision-making is the ultimate leadership skill. Here's Ian Faria's framework: First, get clear on your values. Second, gather the minimum viable information. Third, trust your experience and intuition. Remember, a good decision executed quickly often beats a perfect decision that comes too late.",
          principle: "IF-Principle: Leadership & Excellence",
          followUp: "Think of one decision you've been postponing. Apply this framework and make that decision today."
        },
        default: {
          content: "Leadership is not about having all the answers—it's about asking the right questions and creating space for others to shine. Your role is to provide clarity, direction, and support. What's one way you can elevate someone else's potential today?",
          principle: "IF-Principle: Leadership & Attitude Enhancement",
          followUp: "Identify one person you can help elevate this week. What specific support can you provide?"
        }
      },
      communication: {
        confidence: {
          content: "Confidence isn't the absence of fear—it's feeling the fear and speaking your truth anyway. Here's a Toastmasters technique: before any important communication, remind yourself of your value and expertise. You have something important to contribute. The world needs to hear your perspective.",
          principle: "IF-Principle: Communication & Attitude Enhancement",
          followUp: "Practice this affirmation: 'I have valuable insights to share, and people benefit from hearing my perspective.'"
        },
        presentation: {
          content: "Great presentations start with great preparation. Use the 3-P framework: Purpose (why are you speaking?), People (who needs to hear this?), and Point (what's your one key message?). When you're clear on these three, your confidence will follow naturally.",
          principle: "IF-Principle: Communication & Excellence",
          followUp: "For your next presentation, write down your Purpose, People, and Point in one sentence each."
        },
        listening: {
          content: "Master communicators know that listening is not waiting for your turn to speak—it's seeking to understand deeply. Try this: In your next conversation, ask one follow-up question before sharing your own thoughts. Notice how this changes the dynamic.",
          principle: "IF-Principle: Communication & Mind Coaching",
          followUp: "Practice the 2:1 ratio today: For every statement you make, ask two questions."
        },
        default: {
          content: "Communication is the bridge between confusion and clarity. Your job isn't to be perfect—it's to be authentic and clear. Remember: people connect with your humanity, not your perfection. What message does the world need to hear from you?",
          principle: "IF-Principle: Communication & Authenticity",
          followUp: "What's one important message you've been holding back? How can you share it authentically?"
        }
      },
      resilience: {
        overwhelm: {
          content: "When overwhelm hits, your nervous system is trying to protect you. Here's an instant reset: Box breathing (4 counts in, 4 hold, 4 out, 4 hold). Then ask: 'What's the most important thing right now?' Focus on that one thing. Remember, you don't have to carry everything at once.",
          principle: "IF-Principle: Mind Coaching & Stress Management",
          followUp: "Practice box breathing for 2 minutes right now. Then choose your ONE most important task for today."
        },
        setback: {
          content: "Setbacks are setups for comebacks—but only if you extract the learning. Here's the resilience formula: Acknowledge the disappointment (feel it fully), Extract the lesson (what can this teach you?), then Channel the energy forward (what's your next move?). You're not broken; you're being forged.",
          principle: "IF-Principle: Mind Coaching & Attitude Enhancement",
          followUp: "For your recent setback: What's one specific lesson you can extract? How can you use this lesson moving forward?"
        },
        energy: {
          content: "Energy management trumps time management. Your energy has four levels: physical, emotional, mental, and spiritual. Audit each level right now. What's draining you unnecessarily? What activities restore you? Design your day around your energy patterns, not just your schedule.",
          principle: "IF-Principle: Mind Coaching & Excellence",
          followUp: "Rate your energy in each area (1-10): Physical, Emotional, Mental, Spiritual. What's your lowest score and how can you address it?"
        },
        default: {
          content: "Resilience isn't about being unbreakable—it's about being bendable without breaking. Like a bamboo in the wind, you can adapt while staying rooted in your values. What's one small step you can take today to build your resilience muscle?",
          principle: "IF-Principle: Mind Coaching & Personal Growth",
          followUp: "What's one small resilience practice you can commit to this week? (Exercise, meditation, journaling, etc.)"
        }
      },
      focus: {
        distraction: {
          content: "In our hyperconnected world, focus is your superpower. Try the 'Focus Fortress' technique: Choose your most important task, eliminate all distractions (phone in another room, notifications off), set a timer for 25 minutes, and work on that ONE thing. Your brain will thank you.",
          principle: "IF-Principle: Mind Coaching & Excellence",
          followUp: "Right after this chat, try one 25-minute Focus Fortress session. What's the one task that deserves your undivided attention?"
        },
        productivity: {
          content: "Productivity isn't about doing more—it's about doing what matters most. Use the Eisenhower Matrix: Important & Urgent (do first), Important & Not Urgent (schedule), Not Important & Urgent (delegate), Not Important & Not Urgent (eliminate). Where are you spending most of your time?",
          principle: "IF-Principle: Excellence & Personal Effectiveness",
          followUp: "List your top 5 activities from yesterday. Which quadrant does each one belong to? What can you eliminate or delegate?"
        },
        studying: {
          content: "Effective studying is about quality, not quantity. Use active recall: After reading something, close the book and explain it out loud. Use spaced repetition: review information at increasing intervals. And remember, teaching others is the ultimate test of understanding.",
          principle: "IF-Principle: Mind Coaching & Learning Excellence",
          followUp: "Pick one topic you're studying. Explain it out loud right now as if teaching a friend. What parts need more work?"
        },
        default: {
          content: "Focus is a skill, not a talent. Like any skill, it improves with deliberate practice. Start small: can you focus completely on one task for just 10 minutes without checking your phone? Build from there. Your future self will thank you for the focus you develop today.",
          principle: "IF-Principle: Mind Coaching & Skill Development",
          followUp: "What's the smallest focus challenge you can set for yourself today? (10 minutes of undivided attention on one task?)"
        }
      },
      attitude: {
        negativity: {
          content: "Your attitude is your altitude. When negative thoughts spiral, use the 3R technique: Recognize (notice the negative pattern), Reframe (find one alternative perspective), and Redirect (take one positive action). You can't always control what happens, but you can always control your response.",
          principle: "IF-Principle: Attitude Enhancement & Mind Coaching",
          followUp: "What's one negative thought pattern you've noticed lately? How can you reframe it more positively?"
        },
        motivation: {
          content: "Motivation gets you started, but excellence becomes your standard through daily habits. Instead of waiting for motivation, create momentum with micro-actions. What's the smallest positive thing you can do right now? Do that, then build from there.",
          principle: "IF-Principle: Attitude Enhancement & Excellence",
          followUp: "What's one tiny positive action you can take right now? (It can be as small as making your bed or writing one thank-you text.)"
        },
        gratitude: {
          content: "Gratitude is the antidote to almost everything negative. But it's not just saying 'I'm grateful'—it's feeling it deeply. Try this: Think of someone who made your life better. Feel that appreciation in your body. Now carry that feeling into your next interaction.",
          principle: "IF-Principle: Attitude Enhancement & Positive Psychology",
          followUp: "Right now, think of someone you're grateful for. Send them a quick message expressing your appreciation."
        },
        default: {
          content: "Your attitude is contagious—make sure it's worth catching. Excellence isn't a one-time achievement; it's a daily choice. Every moment is a chance to choose a positive, growth-oriented mindset. What choice will you make right now?",
          principle: "IF-Principle: Attitude Enhancement & Personal Excellence",
          followUp: "What's one area of your life where you can raise your standards today? How can you approach it with excellence?"
        }
      }
    }

    const archetypeId = archetype?.id || 'attitude'
    const archetypeResponses = responses[archetypeId as keyof typeof responses] || responses.attitude

    // Match user input to appropriate response
    if (input.includes('stress') || input.includes('anxious') || input.includes('overwhelm')) {
      return (archetypeResponses as any).stress || (archetypeResponses as any).overwhelm || archetypeResponses.default
    }
    if (input.includes('present') || input.includes('speak') || input.includes('talk') || input.includes('meeting')) {
      return (archetypeResponses as any).presentation || (archetypeResponses as any).communication || archetypeResponses.default
    }
    if (input.includes('focus') || input.includes('distract') || input.includes('concentrate')) {
      return (archetypeResponses as any).distraction || (archetypeResponses as any).focus || archetypeResponses.default
    }
    if (input.includes('decision') || input.includes('choose') || input.includes('decide')) {
      return (archetypeResponses as any).decisions || archetypeResponses.default
    }
    if (input.includes('negative') || input.includes('down') || input.includes('bad')) {
      return (archetypeResponses as any).negativity || archetypeResponses.default
    }
    if (input.includes('confident') || input.includes('confidence')) {
      return (archetypeResponses as any).confidence || archetypeResponses.default
    }
    if (input.includes('energy') || input.includes('tired') || input.includes('drain')) {
      return (archetypeResponses as any).energy || archetypeResponses.default
    }
    if (input.includes('motivat') || input.includes('lazy')) {
      return (archetypeResponses as any).motivation || archetypeResponses.default
    }

    return archetypeResponses.default
  }

  // Quick prompt buttons
  const quickPrompts = [
    "I feel stressed today",
    "I have a presentation coming up",
    "I'm struggling with focus",
    "I need motivation",
    "Help me make a decision",
    "I'm feeling overwhelmed",
    "How do I build confidence?",
    "I'm dealing with negativity"
  ]

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim()
    if (!messageText) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const response = getCoachResponse(messageText, primaryArchetype)
      
      const coachMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'coach',
        content: response.content,
        timestamp: new Date(),
        coachType: primaryArchetype?.name,
        principle: response.principle
      }

      setMessages(prev => [...prev, coachMessage])
      
      // Add follow-up if exists
      if (response.followUp) {
        setTimeout(() => {
          const followUpMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            type: 'coach',
            content: `💡 **Action Step:** ${response.followUp}`,
            timestamp: new Date(),
            coachType: primaryArchetype?.name,
            principle: response.principle
          }
          setMessages(prev => [...prev, followUpMessage])
        }, 1500)
      }
      
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleFeedback = (messageId: string, positive: boolean) => {
    setCoachFeedback(messageId, positive)
  }

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0 && primaryArchetype) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'coach',
        content: `Hello! I'm your ${primaryArchetype.name}. I'm here to support you with ${primaryArchetype.desc.toLowerCase()}. What's on your mind today?`,
        timestamp: new Date(),
        coachType: primaryArchetype.name,
        principle: `IF-Principle: ${primaryArchetype.principles.join(' & ')}`
      }
      setMessages([welcomeMessage])
    }
  }, [primaryArchetype, messages.length])

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">
              {primaryArchetype?.name || 'Your Coach'}
            </h1>
            <p className="text-sm text-gray-500">
              {primaryArchetype?.desc || 'Ready to help you grow'}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-primary-600' 
                  : 'bg-gray-200'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-gray-600" />
                )}
              </div>
              
              <div className={`rounded-2xl px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.principle && (
                  <p className="text-xs mt-2 opacity-75 italic">
                    {message.principle}
                  </p>
                )}
                
                {/* Feedback buttons for coach messages */}
                {message.type === 'coach' && !message.content.includes('💡') && (
                  <div className="flex items-center justify-end space-x-2 mt-3 pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">Helpful?</span>
                    <button
                      onClick={() => handleFeedback(message.id, true)}
                      className={`p-1 rounded ${
                        coachSatisfaction[message.id] === true
                          ? 'bg-green-100 text-green-600'
                          : 'text-gray-400 hover:text-green-600'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, false)}
                      className={`p-1 rounded ${
                        coachSatisfaction[message.id] === false
                          ? 'bg-red-100 text-red-600'
                          : 'text-gray-400 hover:text-red-600'
                      }`}
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="p-4 bg-white border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.slice(0, 4).map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 tap-highlight-transparent"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask your coach anything..."
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isTyping}
            className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center disabled:bg-gray-300 tap-highlight-transparent"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          Your coach provides guidance, not professional therapy. In crisis, contact a healthcare professional.
        </p>
      </div>
    </div>
  )
}