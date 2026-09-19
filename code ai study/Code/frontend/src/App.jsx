import { useState, useEffect } from 'react'
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  GraduationCap,
  NotebookPen,
  Send,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Volume2,
  Copy,
  RotateCcw,
  Flame,
  Award,
  HelpCircle,
  Zap,
  Lightbulb,
  FileText,
  Layers,
  ChevronRight,
  User,
  LogOut,
  X,
  Play
} from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Preset Interactive Quizzes for instant play
const PRESET_QUIZZES = {
  Python: {
    topic: 'Python Programming',
    quiz: [
      {
        question: "Which keyword is used to define a function in Python?",
        options: ["def", "function", "func", "define"],
        answer: "def",
        explanation: "In Python, the 'def' keyword declares a function (e.g. def my_func():)."
      },
      {
        question: "What type of data structure is defined with curly braces { 'key': 'value' }?",
        options: ["Dictionary", "List", "Tuple", "Set"],
        answer: "Dictionary",
        explanation: "In Python, key-value pairs inside curly braces form a Dictionary (dict)."
      },
      {
        question: "What is the output of len(['apple', 'banana', 'cherry'])?",
        options: ["3", "2", "6", "Error"],
        answer: "3",
        explanation: "The len() function counts the number of elements in the list."
      }
    ]
  },
  JavaScript: {
    topic: 'JavaScript Programming',
    quiz: [
      {
        question: "Which keyword creates a block-scoped variable in modern JS?",
        options: ["var", "let", "global", "dim"],
        answer: "let",
        explanation: "'let' and 'const' introduce block-scoped variables in modern JavaScript (ES6+)."
      },
      {
        question: "What does `async/await` do in JavaScript?",
        options: [
          "Handles asynchronous Promises in a clean, synchronous-looking style",
          "Speeds up CPU calculation by 10x",
          "Converts code into C++ binary",
          "Freezes the browser user interface"
        ],
        answer: "Handles asynchronous Promises in a clean, synchronous-looking style",
        explanation: "async/await simplifies working with asynchronous Promises without nested callbacks."
      }
    ]
  },
  CPP: {
    topic: 'C++ & Pointers',
    quiz: [
      {
        question: "What operator is used to access the memory address of a variable in C++?",
        options: ["& (Address-of)", "* (Dereference)", "-> (Arrow)", ":: (Scope)"],
        answer: "& (Address-of)",
        explanation: "The ampersand (&) operator returns the physical memory address of a variable in C++."
      },
      {
        question: "Which OOP concept allows a child class to inherit properties from a parent class?",
        options: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"],
        answer: "Inheritance",
        explanation: "Inheritance allows a derived class to inherit member functions and attributes from a base class."
      }
    ]
  },
  SQL: {
    topic: 'SQL & Database Queries',
    quiz: [
      {
        question: "Which SQL clause filters records from a query result?",
        options: ["WHERE", "ORDER BY", "GROUP BY", "SELECT"],
        answer: "WHERE",
        explanation: "The WHERE clause restricts rows to only those that fulfill the condition."
      },
      {
        question: "What does an INNER JOIN do in SQL?",
        options: [
          "Returns records that have matching keys in both tables",
          "Returns all records from the left table only",
          "Deletes matching rows",
          "Sorts the dataset alphabetically"
        ],
        answer: "Returns records that have matching keys in both tables",
        explanation: "INNER JOIN retrieves rows where the joined keys match in both tables."
      }
    ]
  },
  Physics: {
    topic: 'Physics & Motion',
    quiz: [
      {
        question: "What is Newton's First Law of Motion also known as?",
        options: [
          "The Law of Inertia",
          "The Law of Acceleration",
          "The Law of Action and Reaction",
          "The Law of Universal Gravitation"
        ],
        answer: "The Law of Inertia",
        explanation: "Newton's First Law states that an object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force."
      },
      {
        question: "What is the SI unit of Force?",
        options: ["Joule", "Newton", "Watt", "Pascal"],
        answer: "Newton",
        explanation: "Force is measured in Newtons (N), where 1 N = 1 kg·m/s²."
      }
    ]
  }
}

const PROGRAMMING_LANGUAGES = [
  'General',
  'Python 🐍',
  'JavaScript ⚡',
  'C++ 💻',
  'Java ☕',
  'SQL 📊',
  'Data Structures 🌳',
  'React ⚛️'
]

const STARTER_PROMPTS = [
  '🐍 Learn Python Loops & Functions with examples',
  '⚡ Explain JavaScript Async/Await & Promises simply',
  '💻 C++ Pointers & Memory Management explained',
  '📊 How do SQL INNER JOINs work step-by-step?',
  '🌳 Explain Binary Search Trees & Recursion'
]

const POPULAR_EXPLAINS = [
  'Python Functions',
  'JavaScript Promises',
  'C++ Pointers',
  'SQL Queries',
  'Binary Search Trees',
  'Photosynthesis'
]

// Render markdown formatted text & code blocks
const renderFormattedText = (text) => {
  if (!text) return null
  const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g
  const parts = []
  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.substring(lastIndex, match.index) })
    }
    parts.push({ type: 'code', lang: match[1] || 'code', content: match[2].trim() })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.substring(lastIndex) })
  }

  return (
    <div className="formatted-response">
      {parts.map((part, idx) => {
        if (part.type === 'code') {
          return (
            <div key={idx} className="code-block-container">
              <div className="code-block-header">
                <span className="code-lang-tag">💻 {part.lang.toUpperCase()}</span>
                <button
                  className="copy-code-btn"
                  onClick={() => navigator.clipboard.writeText(part.content)}
                >
                  <Copy size={12} /> Copy Code
                </button>
              </div>
              <pre className="code-block-pre">
                <code>{part.content}</code>
              </pre>
            </div>
          )
        }

        return (
          <div key={idx} className="text-segment">
            {part.content.split('\n').map((line, lineIdx) => {
              if (line.startsWith('### ')) return <h4 key={lineIdx}>{line.replace('### ', '')}</h4>
              if (line.startsWith('## ')) return <h3 key={lineIdx}>{line.replace('## ', '')}</h3>
              if (line.startsWith('# ')) return <h2 key={lineIdx}>{line.replace('# ', '')}</h2>
              if (line.startsWith('• ') || line.startsWith('- ')) {
                return <li key={lineIdx}>{line.replace(/^[•\-]\s*/, '')}</li>
              }
              if (!line.trim()) return <br key={lineIdx} />
              return <p key={lineIdx}>{line}</p>
            })}
          </div>
        )
      })}
    </div>
  )
}

function App() {
  // Navigation active tab: 'home' | 'chat' | 'quiz' | 'explain' | 'studio'
  const [activeTab, setActiveTab] = useState('home')
  const [selectedLang, setSelectedLang] = useState('General')

  // Auth State
  const [authMode, setAuthMode] = useState('login')
  const [authOpen, setAuthOpen] = useState(false)
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' })
  const [authStatus, setAuthStatus] = useState('')
  const [student, setStudent] = useState(() => {
    const saved = localStorage.getItem('studybuddy_student')
    return saved ? JSON.parse(saved) : null
  })

  // Gamification stats
  const [streak, setStreak] = useState(5)
  const [xp, setXp] = useState(140)

  // 💬 Chatbot State
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hi there! 🎓 I am your AI Study & Programming Buddy powered by Gemini. Ask me any doubt, code assignment, programming language question, or topic you are stuck on!'
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  // 🧠 Quiz Arena State
  const [quizTopic, setQuizTopic] = useState('Physics')
  const [quizDiff, setQuizDiff] = useState('Medium')
  const [quizLoading, setQuizLoading] = useState(false)
  const [activeQuiz, setActiveQuiz] = useState(PRESET_QUIZZES.Physics.quiz)
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)

  // 💡 Concept Explainer State
  const [explainTopicInput, setExplainTopicInput] = useState('')
  const [explainStyle, setExplainStyle] = useState('eli5')
  const [explainLoading, setExplainLoading] = useState(false)
  const [explainResult, setExplainResult] = useState({
    title: 'Photosynthesis',
    summary: 'Photosynthesis is the process plants use to convert sunlight into energy (sugar) and oxygen.',
    explanation: 'Think of a leaf as a tiny solar kitchen. The sun acts as the stove, water comes from roots, and CO2 from the air. Chlorophyll cooks these together to make plant food (glucose) and releases clean oxygen for us to breathe!',
    analogy: 'Imagine a solar panel that cooks pancakes every time the sun shines on it.',
    keyPoints: [
      'Takes place inside chloroplasts',
      'Requires Sunlight, Water (H2O), and Carbon Dioxide (CO2)',
      'Produces Glucose (C6H12O6) and Oxygen (O2)'
    ],
    memoryTrick: 'Remember **SUN**: Solar energy + Underground water + Nitrogen-free air = Sugar!'
  })

  // 📚 Flashcards & Study Studio State
  const [flashcards, setFlashcards] = useState([
    { question: 'What is the speed of light?', answer: 'Approximately 3 × 10⁸ meters per second (300,000 km/s).' },
    { question: 'What is the chemical formula for water?', answer: 'H₂O (2 Hydrogen atoms + 1 Oxygen atom).' },
    { question: 'What is Newton’s Second Law?', answer: 'Force = Mass × Acceleration (F = m·a).' }
  ])
  const [cardIndex, setCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  // ⚡ Study Plan State
  const [planGoal, setPlanGoal] = useState('Score 90%+ in Semester Exams')
  const [planHours, setPlanHours] = useState('2')
  const [planDays, setPlanDays] = useState('7')
  const [planResult, setPlanResult] = useState('')

  // Speech Output Helper
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const cleanText = text.replace(/[*#_]/g, '')
      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.rate = 1.0
      window.speechSynthesis.speak(utterance)
    }
  }

  // Handle Send Chat
  const handleSendChat = async (promptMsg = chatInput) => {
    const text = (promptMsg || '').trim()
    if (!text || chatLoading) return

    setMessages((prev) => [...prev, { sender: 'user', text }])
    setChatInput('')
    setChatLoading(true)

    try {
      const token = localStorage.getItem('studybuddy_token') || ''
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          message: text,
          context: 'Student looking for simple explanation and help.',
          language: selectedLang
        })
      })

      const data = await res.json().catch(() => ({}))
      const reply = data.reply || 'Great question! Keep practicing and breaking topics into simple steps.'

      setMessages((prev) => [...prev, { sender: 'bot', text: reply }])
      setXp((prev) => prev + 10)
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `✨ **Study Tutor Answer:**\n\nGreat question about "${text}"!\n\n1. **Core Idea:** Start by grasping the main principle.\n2. **Breakdown:** Practice step-by-step with code examples.\n3. **Quiz Check:** Try taking a practice quiz in our Quiz Arena tab above to test your understanding!`
        }
      ])
    } finally {
      setChatLoading(false)
    }
  }

  // Handle Generate Quiz
  const handleGenerateQuiz = async (topicToFetch = quizTopic) => {
    setQuizLoading(true)
    setQuizFinished(false)
    setCurrentQIndex(0)
    setScore(0)
    setSelectedOption(null)
    setShowExplanation(false)

    // Check if preset available
    if (PRESET_QUIZZES[topicToFetch]) {
      setActiveQuiz(PRESET_QUIZZES[topicToFetch].quiz)
      setQuizLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('studybuddy_token') || ''
      const res = await fetch(`${API_BASE}/chat/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          topic: topicToFetch,
          count: 5,
          difficulty: quizDiff,
          language: selectedLang
        })
      })

      const data = await res.json()
      if (data.quiz && data.quiz.length > 0) {
        setActiveQuiz(data.quiz)
      } else {
        setActiveQuiz(PRESET_QUIZZES.Python ? PRESET_QUIZZES.Python.quiz : PRESET_QUIZZES.Physics.quiz)
      }
    } catch {
      setActiveQuiz(PRESET_QUIZZES.Python ? PRESET_QUIZZES.Python.quiz : PRESET_QUIZZES.Physics.quiz)
    } finally {
      setQuizLoading(false)
    }
  }

  // Handle Quiz Option Select
  const handleSelectOption = (opt) => {
    if (selectedOption !== null) return
    setSelectedOption(opt)
    setShowExplanation(true)

    const currentQ = activeQuiz[currentQIndex]
    if (opt === currentQ.answer) {
      setScore((prev) => prev + 1)
      setXp((prev) => prev + 15)
    }
  }

  // Handle Next Question
  const handleNextQuestion = () => {
    setSelectedOption(null)
    setShowExplanation(false)

    if (currentQIndex + 1 < activeQuiz.length) {
      setCurrentQIndex((prev) => prev + 1)
    } else {
      setQuizFinished(true)
      setXp((prev) => prev + 50)
    }
  }

  // Handle Generate Concept Explanation
  const handleExplainTopic = async (topicTarget = explainTopicInput) => {
    const topic = (topicTarget || '').trim() || 'Python Programming'
    setExplainLoading(true)

    try {
      const token = localStorage.getItem('studybuddy_token') || ''
      const res = await fetch(`${API_BASE}/chat/explain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          topic,
          style: explainStyle,
          language: selectedLang
        })
      })

      const data = await res.json()
      setExplainResult(data)
      setXp((prev) => prev + 15)
    } catch {
      setExplainResult({
        title: topic,
        summary: `Here is a student breakdown for ${topic}.`,
        explanation: `${topic} is an essential computer science building block. Understanding the core mechanism allows you to tackle assignment questions and code problems with ease.`,
        analogy: `Think of ${topic} like a well-organized workflow step by step.`,
        keyPoints: ['Identify key principles', 'Practice basic code examples', 'Take interactive quizzes'],
        memoryTrick: 'Use the **STEP** method: State, Test, Explain, Practice!'
      })
    } finally {
      setExplainLoading(false)
    }
  }

  // Handle Auth
  const handleAuth = async (e) => {
    e.preventDefault()
    setAuthStatus('')

    try {
      const res = await fetch(`${API_BASE}/auth/${authMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Auth failed')

      localStorage.setItem('studybuddy_token', data.accessToken)
      localStorage.setItem('studybuddy_student', JSON.stringify(data.user))
      setStudent(data.user)
      setAuthOpen(false)
    } catch (err) {
      setAuthStatus(err.message)
    }
  }

  const logout = () => {
    localStorage.removeItem('studybuddy_token')
    localStorage.removeItem('studybuddy_student')
    setStudent(null)
  }

  return (
    <div className="student-app-shell">
      {/* Top Banner & Header */}
      <header className="student-topbar">
        <div className="brand-group" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
          <div className="brand-avatar">🎓</div>
          <div>
            <div className="brand-title">StudyNest <span className="ai-badge">Gemini AI</span></div>
            <div className="brand-subtitle">Smart Student Learning Hub</div>
          </div>
        </div>

        <nav className="student-nav">
          <button className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            🏠 Home
          </button>
          <button className={`nav-tab ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
            💬 AI Tutor
          </button>
          <button className={`nav-tab ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => setActiveTab('quiz')}>
            🧠 Quiz Arena
          </button>
          <button className={`nav-tab ${activeTab === 'explain' ? 'active' : ''}`} onClick={() => setActiveTab('explain')}>
            💡 Explainer
          </button>
          <button className={`nav-tab ${activeTab === 'studio' ? 'active' : ''}`} onClick={() => setActiveTab('studio')}>
            📚 Study Studio
          </button>
        </nav>

        <div className="student-status-bar">
          <div className="badge-streak" title="Daily Learning Streak">
            <Flame size={16} color="#f59e0b" fill="#f59e0b" />
            <span>{streak} Days</span>
          </div>
          <div className="badge-xp" title="Student XP Points">
            <Zap size={16} color="#10b981" />
            <span>{xp} XP</span>
          </div>

          {student ? (
            <div className="user-profile">
              <span className="user-name">Hi, {student.name}</span>
              <button className="btn-icon" onClick={logout} title="Log out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="btn btn-student-primary" onClick={() => setAuthOpen(true)}>
              <User size={16} /> Student Login
            </button>
          )}
        </div>
      </header>

      {/* Main App Content View */}
      <main className="student-container">
        {/* ==================== TAB: HOME ==================== */}
        {activeTab === 'home' && (
          <section className="home-hero-section">
            <div className="hero-badge">
              <Sparkles size={16} /> Designed for Students & College Learners
            </div>
            <h1 className="hero-heading">
              Ace Your Studies with Your Personal <span className="gradient-text">Gemini AI Companion</span>
            </h1>
            <p className="hero-subtext">
              Master difficult concepts with step-by-step AI explanations, test your skills in the Quiz Arena with instant feedback, generate flashcards, and create personalized revision schedules!
            </p>

            {/* Quick Action Tiles */}
            <div className="quick-actions-grid">
              <div className="action-card color-indigo" onClick={() => setActiveTab('chat')}>
                <div className="card-icon"><BrainCircuit size={28} /></div>
                <h3>Ask AI Tutor</h3>
                <p>Chat live with Gemini for homework doubts & assignments</p>
                <span className="card-link">Start Chatting <ArrowRight size={14} /></span>
              </div>

              <div className="action-card color-emerald" onClick={() => { setActiveTab('quiz'); handleGenerateQuiz('Physics') }}>
                <div className="card-icon"><Target size={28} /></div>
                <h3>Quiz Arena</h3>
                <p>Interactive MCQ tests with instant answer explanations</p>
                <span className="card-link">Take a Quiz <ArrowRight size={14} /></span>
              </div>

              <div className="action-card color-pink" onClick={() => setActiveTab('explain')}>
                <div className="card-icon"><Lightbulb size={28} /></div>
                <h3>Concept Explainer</h3>
                <p>Understand tough topics in simple "ELI5" student terms</p>
                <span className="card-link">Explain Topic <ArrowRight size={14} /></span>
              </div>

              <div className="action-card color-amber" onClick={() => setActiveTab('studio')}>
                <div className="card-icon"><NotebookPen size={28} /></div>
                <h3>Flashcard Studio</h3>
                <p>Summarize notes & practice with interactive 3D flip cards</p>
                <span className="card-link">Open Studio <ArrowRight size={14} /></span>
              </div>
            </div>

            {/* Student Achievements Bar */}
            <div className="student-stats-banner">
              <div className="stat-box">
                <strong>24,000+</strong>
                <span>Doubts Answered</span>
              </div>
              <div className="stat-box">
                <strong>94%</strong>
                <span>Exam Score Boost</span>
              </div>
              <div className="stat-box">
                <strong>Instant</strong>
                <span>Gemini 2.5 Explanations</span>
              </div>
              <div className="stat-box">
                <strong>100%</strong>
                <span>Student Focused</span>
              </div>
            </div>

            {/* Student Review Cards */}
            <div className="reviews-section">
              <h2>What Fellow Students Say 🌟</h2>
              <div className="reviews-grid">
                <div className="review-card">
                  <div className="stars">⭐⭐⭐⭐⭐</div>
                  <p>“The Quiz Arena explanations are amazing! It doesn’t just show right or wrong, it explains WHY the answer is right step-by-step.”</p>
                  <strong>— Priya, Engineering Student</strong>
                </div>
                <div className="review-card">
                  <div className="stars">⭐⭐⭐⭐⭐</div>
                  <p>“The ELI5 explainer turned my confusing Physics topics into super simple analogies. Got an A in my midterms!”</p>
                  <strong>— Rohan, High School Senior</strong>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================== TAB: 💬 AI TUTOR (CHATBOT) ==================== */}
        {activeTab === 'chat' && (
          <section className="chat-section">
            <div className="section-header">
              <h2>💬 Gemini AI Study & Code Tutor</h2>
              <p>Ask anything—from Python, JavaScript, C++, Java, SQL to exam revision tips!</p>
            </div>

            {/* Programming Language Selector Row */}
            <div className="lang-selector-row">
              <span className="lang-label">💻 Select Computer / Subject Language:</span>
              <div className="lang-chips">
                {PROGRAMMING_LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    className={`lang-chip ${selectedLang === lang ? 'active' : ''}`}
                    onClick={() => setSelectedLang(lang)}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Starter Pills */}
            <div className="prompt-pills-row">
              {STARTER_PROMPTS.map((promptText) => (
                <button
                  key={promptText}
                  className="pill-btn"
                  onClick={() => handleSendChat(promptText)}
                >
                  {promptText}
                </button>
              ))}
            </div>

            {/* Chat Box Container */}
            <div className="chat-box-card">
              <div className="messages-list">
                {messages.map((msg, i) => (
                  <div key={i} className={`chat-row ${msg.sender}`}>
                    <div className="chat-avatar">{msg.sender === 'bot' ? '🤖' : '🎓'}</div>
                    <div className="chat-bubble-content">
                      <div className="message-text">{renderFormattedText(msg.text)}</div>
                      {msg.sender === 'bot' && (
                        <div className="bubble-actions">
                          <button onClick={() => speakText(msg.text)} title="Listen out loud">
                            <Volume2 size={14} /> Listen
                          </button>
                          <button onClick={() => navigator.clipboard.writeText(msg.text)} title="Copy text">
                            <Copy size={14} /> Copy
                          </button>
                          <button onClick={() => { setActiveTab('explain'); setExplainTopicInput(msg.text.slice(0, 30)) }}>
                            💡 Explain simpler
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="chat-row bot">
                    <div className="chat-avatar">🤖</div>
                    <div className="chat-bubble-content loading-bubble">
                      <span className="dot-pulse" /> Gemini is thinking...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input composer */}
              <div className="chat-composer-bar">
                <input
                  type="text"
                  placeholder="Ask any question, doubt, formula, or assignment help..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                />
                <button className="btn-send" onClick={() => handleSendChat()} disabled={chatLoading}>
                  <Send size={18} /> Ask AI
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ==================== TAB: 🧠 QUIZ ARENA (WITH EXPLANATIONS) ==================== */}
        {activeTab === 'quiz' && (
          <section className="quiz-section">
            <div className="section-header">
              <h2>🧠 Interactive Quiz Arena & Step-by-Step Explanations</h2>
              <p>Practice with instant feedback. Every question includes detailed explanations so you truly learn!</p>
            </div>

            {/* Topic & Controls Bar */}
            <div className="quiz-controls-card">
              <div className="preset-buttons">
                <span className="controls-label">Presets:</span>
                {Object.keys(PRESET_QUIZZES).map((topicName) => (
                  <button
                    key={topicName}
                    className={`preset-btn ${quizTopic === topicName ? 'active' : ''}`}
                    onClick={() => {
                      setQuizTopic(topicName)
                      handleGenerateQuiz(topicName)
                    }}
                  >
                    {topicName}
                  </button>
                ))}
              </div>

              <div className="custom-quiz-form">
                <input
                  type="text"
                  placeholder="Or enter any custom topic (e.g. Python, Trigonometry, World History)"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                />
                <select value={quizDiff} onChange={(e) => setQuizDiff(e.target.value)}>
                  <option value="Easy">Easy 🟢</option>
                  <option value="Medium">Medium 🟡</option>
                  <option value="Hard">Hard 🔴</option>
                </select>
                <button className="btn btn-student-primary" onClick={() => handleGenerateQuiz(quizTopic)} disabled={quizLoading}>
                  <Zap size={16} /> {quizLoading ? 'Generating...' : 'Generate AI Quiz'}
                </button>
              </div>
            </div>

            {/* Quiz Player Card */}
            {quizLoading ? (
              <div className="loading-card">
                <Sparkles className="spin-icon" size={32} />
                <p>Generating custom questions with Gemini AI...</p>
              </div>
            ) : quizFinished ? (
              /* End of Quiz Scorecard */
              <div className="scorecard-card">
                <div className="scorecard-header">
                  <Award size={48} color="#f59e0b" />
                  <h2>Quiz Complete! 🎉</h2>
                  <div className="score-percentage">
                    {Math.round((score / activeQuiz.length) * 100)}%
                  </div>
                  <p>You scored {score} out of {activeQuiz.length} questions correctly!</p>
                </div>

                <div className="question-review-list">
                  <h3>Question Review & Explanations:</h3>
                  {activeQuiz.map((q, idx) => (
                    <div key={idx} className="review-item">
                      <strong>Q{idx + 1}: {q.question}</strong>
                      <div className="correct-ans">✅ Correct Answer: {q.answer}</div>
                      <div className="exp-box">💡 <em>Explanation:</em> {q.explanation}</div>
                    </div>
                  ))}
                </div>

                <div className="scorecard-actions">
                  <button className="btn btn-student-primary" onClick={() => handleGenerateQuiz(quizTopic)}>
                    <RotateCcw size={16} /> Try Quiz Again
                  </button>
                  <button className="btn btn-student-secondary" onClick={() => setActiveTab('chat')}>
                    💬 Discuss Weak Topics with AI Tutor
                  </button>
                </div>
              </div>
            ) : (
              /* Active Question Card */
              <div className="active-quiz-card">
                <div className="quiz-progress-bar">
                  <div className="progress-info">
                    <span>Question <strong>{currentQIndex + 1}</strong> of {activeQuiz.length}</span>
                    <span className="topic-chip">Topic: {quizTopic}</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${((currentQIndex + 1) / activeQuiz.length) * 100}%` }}
                    />
                  </div>
                </div>

                <h3 className="question-text">{activeQuiz[currentQIndex]?.question}</h3>

                <div className="options-grid">
                  {activeQuiz[currentQIndex]?.options.map((opt, i) => {
                    const isSelected = selectedOption === opt
                    const isCorrect = opt === activeQuiz[currentQIndex].answer
                    let stateClass = ''

                    if (selectedOption !== null) {
                      if (isCorrect) stateClass = 'option-correct'
                      else if (isSelected) stateClass = 'option-wrong'
                      else stateClass = 'option-disabled'
                    }

                    return (
                      <button
                        key={i}
                        className={`option-btn ${stateClass}`}
                        onClick={() => handleSelectOption(opt)}
                        disabled={selectedOption !== null}
                      >
                        <span className="option-prefix">{String.fromCharCode(65 + i)}</span>
                        <span className="option-label">{opt}</span>
                        {selectedOption !== null && isCorrect && <span className="badge-icon">✅</span>}
                        {selectedOption !== null && isSelected && !isCorrect && <span className="badge-icon">❌</span>}
                      </button>
                    )
                  })}
                </div>

                {/* Instant Answer Explanation Panel */}
                {showExplanation && (
                  <div className="explanation-panel animate-fade">
                    <div className="exp-header">
                      <Lightbulb size={20} color="#f59e0b" />
                      <strong>Answer Explanation & Learning Tip:</strong>
                    </div>
                    <p>{activeQuiz[currentQIndex]?.explanation}</p>
                    <button className="btn btn-student-primary next-btn" onClick={handleNextQuestion}>
                      Next Question <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* ==================== TAB: 💡 CONCEPT EXPLAINER ==================== */}
        {activeTab === 'explain' && (
          <section className="explain-section">
            <div className="section-header">
              <h2>💡 AI Concept Explainer ("ELI5" & Step-by-Step)</h2>
              <p>Stuck on a tricky concept? We break it down into simple real-life analogies & step-by-step summaries!</p>
            </div>

            {/* Popular Topics */}
            <div className="popular-topics-row">
              <span className="row-label">Popular Topics:</span>
              {POPULAR_EXPLAINS.map((topicName) => (
                <button
                  key={topicName}
                  className="pop-pill"
                  onClick={() => {
                    setExplainTopicInput(topicName)
                    handleExplainTopic(topicName)
                  }}
                >
                  {topicName}
                </button>
              ))}
            </div>

            {/* Search & Style Controls */}
            <div className="explain-controls-card">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter any topic (e.g., Recursion, Photosynthesis, Thermodynamics, Organic Chemistry)..."
                  value={explainTopicInput}
                  onChange={(e) => setExplainTopicInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleExplainTopic()}
                />
                <button className="btn btn-student-primary" onClick={() => handleExplainTopic()} disabled={explainLoading}>
                  <Sparkles size={16} /> {explainLoading ? 'Explaining...' : 'Explain Now'}
                </button>
              </div>

              <div className="style-selector-row">
                <span>Explanation Style:</span>
                <button className={`style-btn ${explainStyle === 'eli5' ? 'active' : ''}`} onClick={() => setExplainStyle('eli5')}>
                  🧒 ELI5 (Super Simple)
                </button>
                <button className={`style-btn ${explainStyle === 'stepbystep' ? 'active' : ''}`} onClick={() => setExplainStyle('stepbystep')}>
                  🪜 Step-by-Step
                </button>
                <button className={`style-btn ${explainStyle === 'examprep' ? 'active' : ''}`} onClick={() => setExplainStyle('examprep')}>
                  🎓 Exam Focus
                </button>
                <button className={`style-btn ${explainStyle === 'analogy' ? 'active' : ''}`} onClick={() => setExplainStyle('analogy')}>
                  💡 Real-World Analogy
                </button>
              </div>
            </div>

            {/* Explanation Result Card */}
            {explainLoading ? (
              <div className="loading-card">
                <Sparkles className="spin-icon" size={32} />
                <p>Generating student-friendly explanation with Gemini...</p>
              </div>
            ) : (
              <div className="explanation-display-card">
                <div className="display-header">
                  <span className="style-tag">Style: {explainStyle.toUpperCase()}</span>
                  <h2>{explainResult.title}</h2>
                  <p className="summary-callout">📌 {explainResult.summary}</p>
                </div>

                <div className="explanation-body">
                  <h3>Breakdown & Explanation:</h3>
                  <div className="explanation-text">{renderFormattedText(explainResult.explanation)}</div>
                </div>

                {explainResult.analogy && (
                  <div className="analogy-box">
                    <strong>💡 Real-World Analogy:</strong>
                    <p>{explainResult.analogy}</p>
                  </div>
                )}

                {explainResult.keyPoints && (
                  <div className="keypoints-box">
                    <strong>🎯 Key Takeaways:</strong>
                    <ul>
                      {explainResult.keyPoints.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {explainResult.memoryTrick && (
                  <div className="memory-trick-box">
                    <strong>🧠 Quick Memory Trick:</strong>
                    <p>{explainResult.memoryTrick}</p>
                  </div>
                )}

                <div className="explain-actions-row">
                  <button className="btn btn-student-secondary" onClick={() => speakText(explainResult.explanation)}>
                    <Volume2 size={16} /> Listen to Audio
                  </button>
                  <button className="btn btn-student-primary" onClick={() => { setActiveTab('quiz'); handleGenerateQuiz(explainResult.title) }}>
                    🧠 Take Quiz on {explainResult.title}
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ==================== TAB: 📚 STUDY STUDIO (FLASHCARDS & NOTES) ==================== */}
        {activeTab === 'studio' && (
          <section className="studio-section">
            <div className="section-header">
              <h2>📚 Study Studio & 3D Interactive Flashcards</h2>
              <p>Turn notes into instant summaries, revision flashcards, and step-by-step study plans.</p>
            </div>

            <div className="studio-grid">
              {/* Flashcards Player */}
              <div className="flashcards-container-card">
                <h3>🎴 Practice Flashcards ({cardIndex + 1} of {flashcards.length})</h3>

                <div className={`flip-card ${isFlipped ? 'flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <span className="card-side-label">QUESTION</span>
                      <p>{flashcards[cardIndex]?.question}</p>
                      <span className="flip-hint">💡 Click card to reveal answer</span>
                    </div>
                    <div className="flip-card-back">
                      <span className="card-side-label">ANSWER</span>
                      <p>{flashcards[cardIndex]?.answer}</p>
                      <span className="flip-hint">💡 Click to flip back</span>
                    </div>
                  </div>
                </div>

                <div className="card-nav-controls">
                  <button
                    className="btn btn-student-secondary"
                    onClick={() => {
                      setIsFlipped(false)
                      setCardIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1))
                    }}
                  >
                    Previous
                  </button>
                  <button className="btn btn-student-secondary" onClick={() => setIsFlipped(!isFlipped)}>
                    Flip Card 🔄
                  </button>
                  <button
                    className="btn btn-student-primary"
                    onClick={() => {
                      setIsFlipped(false)
                      setCardIndex((prev) => (prev + 1) % flashcards.length)
                      setXp((prev) => prev + 5)
                    }}
                  >
                    Next Card
                  </button>
                </div>
              </div>

              {/* Study Plan Generator */}
              <div className="planner-container-card">
                <h3>⚡ Generate Study Plan</h3>
                <div className="plan-inputs">
                  <label>
                    Exam Goal:
                    <input type="text" value={planGoal} onChange={(e) => setPlanGoal(e.target.value)} />
                  </label>
                  <div className="row-inputs">
                    <label>
                      Hours/Day:
                      <input type="number" value={planHours} onChange={(e) => setPlanHours(e.target.value)} min="1" max="12" />
                    </label>
                    <label>
                      Days Left:
                      <input type="number" value={planDays} onChange={(e) => setPlanDays(e.target.value)} min="1" max="30" />
                    </label>
                  </div>
                  <button
                    className="btn btn-student-primary"
                    onClick={() => {
                      setPlanResult(`📅 ${planDays}-Day Revision Plan:\n- Day 1-2: Core Concept Mastery\n- Day 3-4: Practice Problems & Quizzes\n- Day 5-6: Flashcard Memory Loops\n- Day 7: Full Mock Test & Final Review`)
                    }}
                  >
                    Create Plan
                  </button>
                </div>

                {planResult && (
                  <div className="plan-output-box">
                    <pre>{planResult}</pre>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Auth Modal */}
      {authOpen && (
        <div className="auth-overlay" onClick={() => setAuthOpen(false)}>
          <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{authMode === 'login' ? '🎓 Welcome Back Student' : '🚀 Join StudyNest'}</h3>
              <button className="close-btn" onClick={() => setAuthOpen(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleAuth} className="auth-form">
              {authMode === 'register' && (
                <label>
                  Full Name
                  <input required value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} placeholder="Alex Johnson" />
                </label>
              )}
              <label>
                Email Address
                <input required type="email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} placeholder="student@school.edu" />
              </label>
              <label>
                Password
                <input required type="password" minLength="6" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} placeholder="••••••••" />
              </label>
              <button className="btn btn-student-primary auth-submit" type="submit">
                {authMode === 'login' ? 'Log In' : 'Create Account'}
              </button>
            </form>

            {authStatus && <p className="auth-error">{authStatus}</p>}

            <button className="switch-auth-mode" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
              {authMode === 'login' ? "Don't have an account? Sign up" : 'Already registered? Log in'}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="student-footer">
        <div>
          <strong>StudyNest AI</strong> — Empowering school & college students with Gemini AI.
        </div>
        <div className="footer-links">
          <button onClick={() => setActiveTab('chat')}>AI Tutor</button>
          <button onClick={() => setActiveTab('quiz')}>Quiz Arena</button>
          <button onClick={() => setActiveTab('explain')}>Explainer</button>
        </div>
      </footer>
    </div>
  )
}

export default App
