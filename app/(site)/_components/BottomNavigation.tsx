'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Dumbbell, MessageCircle, Users, User } from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/mind-gym', icon: Dumbbell, label: 'Mind Gym' },
  { href: '/coach', icon: MessageCircle, label: 'Coach' },
  { href: '/community', icon: Users, label: 'Community' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-40">
      <div className="grid grid-cols-5">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center py-2 px-1 tap-highlight-transparent
                transition-colors duration-200 min-h-[64px]
                ${isActive 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-500 hover:text-gray-700 active:bg-gray-50'
                }
              `}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-primary-600' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-primary-600' : ''}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}