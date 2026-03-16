import { useState } from 'react'

const TEACHER_PASSWORD = 'bio2014'

export default function TeacherLogin({ onLogin, onBack }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 500)) // small delay for UX
    if (password === TEACHER_PASSWORD) {
      onLogin()
    } else {
      setError('סיסמה שגויה')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-900 to-emerald-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm fade-in">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔑</div>
          <h1 className="text-2xl font-bold text-white mb-1">לוח בקרת מורה</h1>
          <p className="text-green-300 text-sm">מעבדה יבשה – בעיה 4</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-7 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-green-200 mb-1.5">
                סיסמת מורה
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="הכנס סיסמה"
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus:border-green-300 focus:outline-none text-white placeholder-green-400 transition-colors"
                dir="ltr"
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3 text-red-200 text-sm">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-400 hover:bg-green-300 text-green-950 font-bold rounded-xl transition-all duration-200 disabled:opacity-60"
            >
              {loading ? 'בודק...' : 'כניסה'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              onClick={onBack}
              className="text-green-300 hover:text-white text-sm underline underline-offset-2 transition-colors"
            >
              ← חזרה לכניסת תלמיד
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
