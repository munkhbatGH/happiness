# Happiness - Your Daily Mind Gym

A mobile-first Progressive Web App (PWA) designed to help users understand their mind, achieve mindfulness, and make happiness a daily goal. Built with coaching principles inspired by Ian Faria's methodologies.

## 🎯 Target Personas

- **Corporate Leaders (40+)**: Seeking authentic leadership and work-life balance
- **Career Professionals (25-40)**: Focused on career growth and skill development
- **Business Owners (30-50)**: Navigating entrepreneurial challenges and growth
- **Students (18-25)**: Seeking focus, clarity, and academic excellence

## 🌟 Core Features

### 1. **Onboarding & Brain Mapping Assessment**
- Persona selection and goal setting
- Comprehensive quiz measuring 7 key constructs
- AI-powered coach matching based on personality and needs

### 2. **Happiness Dashboard**
- Daily Happiness Score tracking with trends
- Personalized coaching insights
- Quick access to Mind Gym exercises
- Progress KPIs and streak tracking

### 3. **Mind Gym**
- 5-minute scientifically-backed exercises
- Categories: stress management, focus, communication, leadership, attitude
- Progress tracking with reflections and ratings
- Streak building and gamification

### 4. **AI Coach Interface**
- Chat-based coaching with persona-specific responses
- Canned responses tagged with Ian Faria principles
- Feedback system for continuous improvement
- Crisis resources and ethical boundaries

### 5. **Community Pods** (Preview)
- Persona-specific discussion feeds
- Sample conversations and insights
- Future: real-time chat and peer accountability

### 6. **Profile & Settings**
- Personal information and coach assignments
- Data export and privacy controls
- Notification preferences
- Crisis resources and support information

## 🧠 Ian Faria Coaching Principles

The app integrates six core principles:

1. **Leadership**: Authentic leadership development and influence
2. **Communication**: Public speaking, interpersonal skills, and confidence
3. **Mind Coaching**: Stress management, resilience, and mental fitness
4. **Attitude Enhancement**: Positive psychology and growth mindset
5. **Excellence**: High standards and continuous improvement
6. **Purpose Alignment**: Values-based decision making

Each feature is tagged with relevant principles (e.g., `[IF-Principle: Mind Coaching]`)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS (mobile-first, responsive design)
- **State Management**: Zustand with localStorage persistence
- **PWA**: Service Worker, offline support, installable
- **Icons**: Lucide React
- **Data Storage**: Local JSON files + localStorage (no external database)

## 🏗️ Project Structure

```
happiness_app/
├── app/
│   ├── (site)/              # Main app pages
│   │   ├── dashboard/       # Happiness dashboard
│   │   ├── mind-gym/        # Exercise interface
│   │   ├── coach/           # AI chat interface
│   │   ├── community/       # Community preview
│   │   ├── profile/         # User settings
│   │   ├── onboarding/      # Persona selection
│   │   └── quiz/            # Brain mapping assessment
│   ├── api/                 # Next.js API routes
│   │   ├── quiz/score/      # Quiz scoring logic
│   │   └── coach/match/     # Coach matching algorithm
│   └── layout.tsx           # Root layout
├── data/                    # Static data files
│   ├── personas.json        # User personas
│   ├── quiz_items.json      # Assessment questions
│   ├── coach_archetypes.json # Coach types
│   ├── mind_gym_exercises.json # Exercise library
│   └── content_library.json # Journey content
├── lib/                     # Core business logic
│   ├── scoring.ts           # Quiz scoring algorithms
│   ├── matching.ts          # Coach matching logic
│   ├── kpis.ts              # Analytics and insights
│   └── storage.ts           # Local storage utilities
├── state/                   # Global state management
│   └── useAppState.ts       # Zustand store
├── public/                  # Static assets
│   ├── manifest.json        # PWA manifest
│   ├── sw.js                # Service worker
│   └── icons/               # App icons
└── styles/
    └── globals.css          # Global styles
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## 📱 PWA Features

- **Offline Support**: Core pages cached for offline access
- **Installable**: Can be installed as native app on mobile/desktop
- **Fast Loading**: Service worker caching for instant app shell
- **Background Sync**: Future-ready for data synchronization
- **Push Notifications**: Prepared for coaching reminders

## 🔒 Privacy & Ethics

- **Local-First**: All data stored locally, no external servers
- **Export Control**: Users can download their complete data
- **Crisis Resources**: Clear boundaries and emergency contacts
- **Coaching vs Therapy**: Explicit disclaimers about professional help

## 🎨 Design Principles

- **Mobile-First**: Designed for smartphone usage patterns
- **Accessibility**: High contrast, large touch targets, keyboard navigation
- **Performance**: Lighthouse-optimized for speed and usability
- **Calm Aesthetics**: Soothing color palette promoting well-being

## 📊 Key Performance Indicators

The app tracks and displays:

- Weekly Mind Gym session count
- Current streak length
- Coach satisfaction ratings
- 7-day and 30-day happiness score trends
- Favorite exercise types
- Overall engagement metrics

## 🔄 Future Roadmap

- **Real-time Community**: Live chat and peer accountability groups
- **LLM Integration**: Advanced AI coaching with personalized responses
- **Wearable Integration**: Heart rate variability and stress monitoring
- **Advanced Analytics**: Deeper insights and pattern recognition
- **Content Expansion**: More exercises and journey modules
- **Multi-language Support**: Internationalization and localization

## 🤝 Contributing

This project follows Ian Faria's coaching methodologies and focuses on ethical, user-centered design. When contributing:

1. Maintain the mobile-first approach
2. Tag new features with relevant IF-Principles
3. Ensure accessibility compliance
4. Test offline functionality
5. Preserve privacy-first architecture

## 📄 License

Built for educational and coaching purposes, incorporating Ian Faria's principles with proper attribution.

---

**"Your attitude determines your altitude. Make happiness a daily choice."** - Ian Faria Principle