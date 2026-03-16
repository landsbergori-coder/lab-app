import { useState, useEffect, useRef, useCallback } from 'react'
import { savePartTime } from '../../firebase/db'
import PartA from './PartA'
import PartB from './PartB'
import PartC from './PartC'

const PARTS = [
  { key: 'A', label: 'חלק א\'', subtitle: 'הכנת מערכת הניסוי', icon: '🔬' },
  { key: 'B', label: 'חלק ב\'', subtitle: 'שאלות 46–53', icon: '📊' },
  { key: 'C', label: 'חלק ג\'', subtitle: 'שאלות 54–59', icon: '📈' },
]

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

export default function LabLayout({ user, onLogout }) {
  const [activePart, setActivePart] = useState('A')
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [partSeconds, setPartSeconds] = useState({ A: 0, B: 0, C: 0 })
  const [submitted, setSubmitted] = useState(user.alreadySubmitted ?? false)
  const [answeredCount, setAnsweredCount] = useState(0)
  const partStartRef = useRef(Date.now())
  const currentPartRef = useRef('A')

  // Global timer
  useEffect(() => {
    const interval = setInterval(() => setTotalSeconds(s => s + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  // Part timer
  useEffect(() => {
    const interval = setInterval(() => {
      setPartSeconds(prev => ({
        ...prev,
        [currentPartRef.current]: prev[currentPartRef.current] + 1,
      }))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Save part time when switching
  const switchPart = useCallback(async (newPart) => {
    const elapsed = partSeconds[currentPartRef.current]
    await savePartTime(user.idNumber, currentPartRef.current, elapsed).catch(console.error)
    currentPartRef.current = newPart
    setActivePart(newPart)
  }, [partSeconds, user.idNumber])

  const totalQuestions = 14 // 46a,46b,47,48a,48b,49,50,51a,51b,52,53,54a,54b,55a,55b,56,57,58,59
  const progressPct = Math.round((answeredCount / 19) * 100)

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md text-center fade-in">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-800 mb-3">הבחינה נשלחה בהצלחה!</h2>
          <p className="text-green-700 mb-2">שם: <strong>{user.name}</strong></p>
          <p className="text-green-700 mb-2">ת.ז.: <strong>{user.idNumber}</strong></p>
          <p className="text-green-600 mb-6">זמן כולל: <strong>{formatTime(totalSeconds)}</strong></p>
          <p className="text-green-500 text-sm">הציון יהיה זמין לאחר בדיקת המורה</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-50 flex flex-col" dir="rtl">
      {/* Top Header */}
      <header className="bg-gradient-to-l from-green-700 to-green-800 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌿</span>
            <div>
              <h1 className="font-bold text-lg leading-tight">מעבדה יבשה – בעיה 4</h1>
              <p className="text-green-200 text-xs">פוטוסינתזה בצמחים צבעוניים | יהודי נודד</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Timer */}
            <div className="text-center">
              <div className="text-xs text-green-300 mb-0.5">זמן כולל</div>
              <div className="font-mono font-bold text-xl bg-green-900 px-3 py-1 rounded-lg">
                {formatTime(totalSeconds)}
              </div>
            </div>

            {/* Student info */}
            <div className="text-left hidden sm:block">
              <div className="text-green-200 text-xs">שם תלמיד</div>
              <div className="font-semibold text-sm">{user.name}</div>
              <div className="text-green-300 text-xs">ת.ז. {user.idNumber}</div>
            </div>

            <button
              onClick={onLogout}
              className="text-green-300 hover:text-white text-xs border border-green-500 hover:border-white px-2 py-1 rounded-lg transition-colors"
            >
              יציאה
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-green-900/40 h-1.5">
          <div
            className="h-full bg-gradient-to-l from-emerald-300 to-green-400 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="max-w-6xl mx-auto px-4 py-1 flex justify-between text-green-300 text-xs">
          <span>התקדמות: {answeredCount}/19 שאלות</span>
          <span>{progressPct}%</span>
        </div>
      </header>

      {/* Part Tabs */}
      <nav className="bg-white border-b border-green-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex gap-0">
          {PARTS.map(part => (
            <button
              key={part.key}
              onClick={() => switchPart(part.key)}
              className={`flex items-center gap-2 px-6 py-3.5 font-semibold text-sm border-b-3 transition-all duration-200 ${
                activePart === part.key
                  ? 'border-b-4 border-green-500 text-green-800 bg-green-50'
                  : 'border-b-4 border-transparent text-gray-500 hover:text-green-700 hover:bg-green-50'
              }`}
            >
              <span>{part.icon}</span>
              <div className="text-right">
                <div>{part.label}</div>
                <div className={`text-xs font-normal ${activePart === part.key ? 'text-green-600' : 'text-gray-400'}`}>
                  {part.subtitle}
                </div>
              </div>
              {/* Part timer */}
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                activePart === part.key ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-500'
              }`}>
                {formatTime(partSeconds[part.key])}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        {activePart === 'A' && <PartA user={user} />}
        {activePart === 'B' && <PartB user={user} onAnswered={setAnsweredCount} />}
        {activePart === 'C' && (
          <PartC
            user={user}
            onAnswered={setAnsweredCount}
            onSubmit={() => {
              setSubmitted(true)
              sessionStorage.setItem('labUser', JSON.stringify({ ...user, alreadySubmitted: true }))
            }}
          />
        )}
      </main>
    </div>
  )
}
