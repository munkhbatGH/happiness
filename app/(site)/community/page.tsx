'use client'

import { useAppState } from '@/state/useAppState'
import { Users, MessageCircle, Heart, Share2, Clock, Star, ArrowRight } from 'lucide-react'
import personas from '@/data/personas.json'

const samplePosts = {
  leaders: [
    {
      id: '1',
      author: 'Sarah M.',
      role: 'VP of Engineering',
      timestamp: '2 hours ago',
      content: 'Just finished my first week of daily gratitude practice. The shift in my team meetings has been remarkable - more appreciation, less blame. Anyone else notice this ripple effect?',
      principle: 'IF-Principle: Attitude Enhancement',
      likes: 12,
      comments: 5,
      tags: ['gratitude', 'leadership', 'team-culture']
    },
    {
      id: '2',
      author: 'Michael K.',
      role: 'CEO',
      timestamp: '5 hours ago',
      content: 'Vulnerability moment: I used to think asking questions showed weakness. Now I realize it shows curiosity and respect for others\' expertise. Game changer for authentic leadership.',
      principle: 'IF-Principle: Leadership & Communication',
      likes: 18,
      comments: 8,
      tags: ['vulnerability', 'authentic-leadership', 'questions']
    },
    {
      id: '3',
      author: 'Jennifer L.',
      role: 'Department Head',
      timestamp: '1 day ago',
      content: 'The values alignment check exercise helped me realize I was saying yes to projects that drained my energy. Now I\'m more selective and my team sees me as more focused and intentional.',
      principle: 'IF-Principle: Leadership & Excellence',
      likes: 15,
      comments: 7,
      tags: ['values', 'focus', 'intentionality']
    }
  ],
  career: [
    {
      id: '4',
      author: 'David R.',
      role: 'Marketing Manager',
      timestamp: '3 hours ago',
      content: 'That 60-second articulation exercise is gold! I\'ve been practicing daily and my presentations are so much clearer. Confidence is building naturally.',
      principle: 'IF-Principle: Communication & Excellence',
      likes: 9,
      comments: 4,
      tags: ['communication', 'presentations', 'confidence']
    },
    {
      id: '5',
      author: 'Amanda T.',
      role: 'Project Manager',
      timestamp: '6 hours ago',
      content: 'Week 3 of the Growth Accelerator journey and I finally asked for that promotion conversation. Sometimes the biggest barrier is just starting the conversation.',
      principle: 'IF-Principle: Communication & Career Growth',
      likes: 14,
      comments: 6,
      tags: ['career-growth', 'promotion', 'courage']
    },
    {
      id: '6',
      author: 'Carlos M.',
      role: 'Software Developer',
      timestamp: '12 hours ago',
      content: 'Imposter syndrome was killing my performance reviews. The reframing exercises helped me see my unique value. Now I document my wins weekly - perspective shift!',
      principle: 'IF-Principle: Attitude Enhancement & Self-Awareness',
      likes: 11,
      comments: 3,
      tags: ['imposter-syndrome', 'self-worth', 'documentation']
    }
  ],
  business: [
    {
      id: '7',
      author: 'Lisa H.',
      role: 'Startup Founder',
      timestamp: '4 hours ago',
      content: 'Resilience check: Failed at my first product launch, but the stress management techniques kept me grounded. Already planning v2.0 with lessons learned. Failure is data.',
      principle: 'IF-Principle: Mind Coaching & Resilience',
      likes: 22,
      comments: 9,
      tags: ['resilience', 'failure', 'learning']
    },
    {
      id: '8',
      author: 'Robert P.',
      role: 'Restaurant Owner',
      timestamp: '8 hours ago',
      content: 'The energy audit exercise revealed I was micromanaging everything. Delegating more now and my team is stepping up. My stress levels dropped significantly too.',
      principle: 'IF-Principle: Leadership & Stress Management',
      likes: 16,
      comments: 5,
      tags: ['delegation', 'micromanaging', 'trust']
    },
    {
      id: '9',
      author: 'Elena K.',
      role: 'Consulting Business',
      timestamp: '1 day ago',
      content: 'Decision fatigue was real until I implemented the values-based decision framework. Now I have clearer boundaries and make faster, more aligned choices.',
      principle: 'IF-Principle: Leadership & Decision Making',
      likes: 19,
      comments: 7,
      tags: ['decision-making', 'values', 'boundaries']
    }
  ],
  students: [
    {
      id: '10',
      author: 'Alex C.',
      role: 'MBA Student',
      timestamp: '2 hours ago',
      content: 'The focus sprint technique is a lifesaver during finals. 25 minutes of pure focus beats 3 hours of distracted studying. My comprehension improved dramatically.',
      principle: 'IF-Principle: Mind Coaching & Focus',
      likes: 8,
      comments: 2,
      tags: ['focus', 'studying', 'pomodoro']
    },
    {
      id: '11',
      author: 'Maya S.',
      role: 'Computer Science',
      timestamp: '7 hours ago',
      content: 'Presentation anxiety used to paralyze me. The box breathing + power pose combo before my thesis defense made all the difference. Confidence through preparation!',
      principle: 'IF-Principle: Communication & Stress Management',
      likes: 13,
      comments: 4,
      tags: ['presentation-anxiety', 'breathing', 'confidence']
    },
    {
      id: '12',
      author: 'Jordan B.',
      role: 'Pre-Med Student',
      timestamp: '10 hours ago',
      content: 'Career clarity exercise helped me realize medicine aligns with my core values of service and growth. No more second-guessing - just focused preparation now.',
      principle: 'IF-Principle: Purpose & Self-Awareness',
      likes: 10,
      comments: 3,
      tags: ['career-clarity', 'purpose', 'values']
    }
  ]
}

export default function CommunityPage() {
  const { selectedPersona } = useAppState()
  const currentPersona = personas.find(p => p.id === selectedPersona)
  const posts = samplePosts[selectedPersona as keyof typeof samplePosts] || samplePosts.career

  const otherCommunities = personas.filter(p => p.id !== selectedPersona)

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-happiness-purple p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Users className="w-6 h-6" />
          <h1 className="text-xl font-bold">
            {currentPersona?.name} Community
          </h1>
        </div>
        <p className="text-white/90 text-sm mb-4">
          Connect with like-minded individuals on similar journeys. Share insights, celebrate wins, and support each other's growth.
        </p>
        <p className="text-xs text-white/75 italic">
          [IF-Principle: Community Learning & Peer Accountability]
        </p>
      </div>

      {/* Join Notice */}
      <div className="mx-4 bg-happiness-yellow/10 border border-happiness-yellow/20 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-happiness-yellow/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Star className="w-4 h-4 text-happiness-yellow" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1">Community Preview</h3>
            <p className="text-sm text-gray-600 mb-3">
              You're viewing sample conversations from the {currentPersona?.name} community. Full community features with real-time chat, groups, and events coming soon!
            </p>
            <button className="bg-happiness-yellow text-white px-4 py-2 rounded-lg text-sm font-medium tap-highlight-transparent">
              Join Waitlist
            </button>
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="mx-4 grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-happiness-green mb-1">2.3k</div>
          <div className="text-xs text-gray-600">Members</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-happiness-purple mb-1">48</div>
          <div className="text-xs text-gray-600">Daily Posts</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-happiness-coral mb-1">91%</div>
          <div className="text-xs text-gray-600">Satisfaction</div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="mx-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Conversations</h2>
        
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-happiness-purple rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{post.author}</h4>
                  <p className="text-sm text-gray-500">{post.role}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-3 h-3 mr-1" />
                {post.timestamp}
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <p className="text-gray-800 text-sm leading-relaxed mb-3">
                {post.content}
              </p>
              <p className="text-xs text-gray-500 italic mb-3">
                {post.principle}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-happiness-coral tap-highlight-transparent">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 tap-highlight-transparent">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{post.comments}</span>
                </button>
              </div>
              <button className="text-gray-500 hover:text-gray-700 tap-highlight-transparent">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Other Communities */}
      <div className="mx-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Explore Other Communities</h2>
        <div className="space-y-3">
          {otherCommunities.map(persona => (
            <div key={persona.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{persona.emoji}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{persona.name}</h3>
                    <p className="text-sm text-gray-600">{persona.description}</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Notice */}
      <div className="mx-4 bg-gray-50 rounded-xl p-4">
        <h3 className="font-medium text-gray-900 mb-2">Community Guidelines</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Share experiences respectfully and constructively</li>
          <li>• Support others' growth and celebrate their wins</li>
          <li>• Keep conversations focused on development and well-being</li>
          <li>• No medical advice - always consult healthcare professionals</li>
          <li>• Respect privacy and confidentiality</li>
        </ul>
      </div>
    </div>
  )
}