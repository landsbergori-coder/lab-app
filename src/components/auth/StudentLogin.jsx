import { useState } from 'react'
import { getOrCreateStudent, getSubmission, createSubmission } from '../../firebase/db'

export default function StudentLogin({ onLogin, onShowTeacher }) {
  const [name, setName] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const trimName = name.trim()
    const trimId   = idNumber.trim()

    if (!trimName || trimName.length < 2) { setError('נא להזין שם מלא'); return }
    if (!/^\d{7,9}$/.test(trimId))        { setError('מספר תעודת זהות חייב להכיל 7–9 ספרות'); return }

    setLoading(true)
    try {
      await getOrCreateStudent(trimName, trimId)
      let submission = await getSubmission(trimId)
      if (!submission) {
        await createSubmission(trimId, trimName)
      }
      onLogin({ name: trimName, idNumber: trimId, alreadySubmitted: submission?.submitted ?? false })
    } catch (err) {
      console.error(err)
      setError('שגיאה בהתחברות. בדוק את חיבור האינטרנט ונסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌿</div>
          <h1 className="text-3xl font-bold text-green-900 mb-1">מעבדה יבשה</h1>
          <h2 className="text-xl font-semibold text-green-700 mb-2">בעיה 4 – פוטוסינתזה בצמחים צבעוניים</h2>
          <p className="text-green-600 text-sm">ביולוגיה מעשית, קיץ תשע"ד | מס' 043008</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
          <h3 className="text-xl font-bold text-green-900 mb-6 text-center">כניסת תלמיד</h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-green-800 mb-1.5">
                שם מלא
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="שם פרטי + שם משפחה"
                className="w-full px-4 py-3 rounded-xl border-2 border-green-200 focus:border-green-500 focus:outline-none transition-colors text-right bg-green-50 text-green-900 placeholder-green-300"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-green-800 mb-1.5">
                מספר תעודת זהות
              </label>
              <input
                type="text"
                value={idNumber}
                onChange={e => setIdNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                placeholder="הכנס מספר ת.ז."
                className="w-full px-4 py-3 rounded-xl border-2 border-green-200 focus:border-green-500 focus:outline-none transition-colors text-right bg-green-50 text-green-900 placeholder-green-300"
                dir="ltr"
                inputMode="numeric"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-l from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  מתחבר...
                </span>
              ) : 'כניסה לחלל המעבדה →'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-green-100 text-center">
            <button
              onClick={onShowTeacher}
              className="text-sm text-green-600 hover:text-green-800 underline underline-offset-2 transition-colors"
            >
              כניסת מורה
            </button>
          </div>
        </div>

        <p className="text-center text-green-600 text-xs mt-4">
          נתונייך נשמרים בצורה מאובטחת
        </p>
      </div>
    </div>
  )
}
