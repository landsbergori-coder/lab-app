import { useState, useEffect } from 'react'
import { getAllSubmissions, deleteStudent, unsubmitSubmission } from '../../firebase/db'
import StudentDetail from './StudentDetail'
import ClassStats from './ClassStats'
import { exportToExcel, exportToCSV } from '../../utils/export'

function formatTime(seconds) {
  if (!seconds) return '0:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
  return `${m}:${String(s).padStart(2,'0')}`
}

function totalTime(sub) {
  const t = sub.timePerPart || {}
  return (t.A || 0) + (t.B || 0) + (t.C || 0)
}

export default function TeacherDashboard({ onLogout }) {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading]         = useState(true)
  const [selected, setSelected]       = useState(null)
  const [activeTab, setActiveTab]     = useState('list') // 'list' | 'stats'
  const [search, setSearch]           = useState('')

  const handleDelete = async (sub) => {
    if (!window.confirm(`למחוק את ${sub.studentName}? פעולה זו אינה הפיכה.`)) return
    await deleteStudent(sub.studentId)
    setSubmissions(prev => prev.filter(s => s.id !== sub.id))
  }

  const handleUnsubmit = async (sub) => {
    if (!window.confirm(`לאפשר ל-${sub.studentName} לחזור לעבוד על המעבדה?`)) return
    await unsubmitSubmission(sub.studentId)
    setSubmissions(prev => prev.map(s => s.id === sub.id
      ? { ...s, submitted: false, graded: false, scores: {}, totalScore: null, endTime: null }
      : s
    ))
  }

  const load = async () => {
    setLoading(true)
    try {
      const data = await getAllSubmissions()
      setSubmissions(data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const filtered = submissions.filter(s =>
    s.studentName?.includes(search) || s.studentId?.includes(search)
  )

  const submitted = submissions.filter(s => s.submitted)
  const avgScore  = submitted.length
    ? Math.round((submitted.reduce((a, s) => a + (s.totalScore || 0), 0) / submitted.length) * 10) / 10
    : null

  if (selected) {
    return (
      <StudentDetail
        submission={selected}
        onBack={() => { setSelected(null); load() }}
        onUpdate={(updated) => {
          setSubmissions(prev => prev.map(s => s.id === updated.id ? updated : s))
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-green-50" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-l from-green-800 to-green-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏫</span>
            <div>
              <h1 className="font-bold text-xl">לוח בקרת מורה</h1>
              <p className="text-green-200 text-sm">מעבדה יבשה – בעיה 4 | פוטוסינתזה בצמחים צבעוניים</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={load}
              className="text-green-200 hover:text-white border border-green-600 px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              🔄 רענן
            </button>
            <button
              onClick={onLogout}
              className="text-green-200 hover:text-white border border-green-600 px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              יציאה
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
        {/* Stats overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '👥', label: 'סה"כ תלמידים', value: submissions.length },
            { icon: '✅', label: 'הגישו', value: submitted.length },
            { icon: '⏳', label: 'טרם הגישו', value: submissions.length - submitted.length },
            { icon: '📊', label: 'ציון ממוצע', value: avgScore != null ? `${avgScore}/95` : '–' },
          ].map(({ icon, label, value }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm border border-green-100 p-4 text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-2xl font-bold text-green-800">{value}</div>
              <div className="text-xs text-green-600">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-md border border-green-100 overflow-hidden">
          <div className="flex border-b border-green-100">
            {[
              { key: 'list', label: '📋 רשימת תלמידים' },
              { key: 'stats', label: '📈 גרפים וסטטיסטיקה' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3.5 font-semibold text-sm border-b-4 transition-all ${
                  activeTab === tab.key
                    ? 'border-green-500 text-green-800 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-green-700'
                }`}
              >
                {tab.label}
              </button>
            ))}

            {/* Export buttons */}
            <div className="mr-auto flex items-center gap-2 px-4">
              <button
                onClick={() => exportToExcel(submissions)}
                disabled={submissions.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-lg disabled:opacity-40 transition-colors"
              >
                📊 ייצוא Excel
              </button>
              <button
                onClick={() => exportToCSV(submissions)}
                disabled={submissions.length === 0}
                className="bg-green-100 hover:bg-green-200 text-green-800 text-xs px-3 py-1.5 rounded-lg disabled:opacity-40 transition-colors"
              >
                📄 ייצוא CSV
              </button>
            </div>
          </div>

          {activeTab === 'list' && (
            <div className="p-4 space-y-4">
              {/* Search */}
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="חפש לפי שם או מספר ת.ז..."
                className="w-full max-w-sm px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                dir="rtl"
              />

              {loading ? (
                <div className="text-center py-10 text-green-600 animate-pulse">טוען נתונים...</div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  {search ? 'לא נמצאו תלמידים' : 'אין תלמידים רשומים עדיין'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-green-700 text-white">
                        {['שם', 'ת.ז.', 'ציון', 'אחוז', 'זמן עבודה', 'סטטוס', 'הוגש', 'פרטים'].map(h => (
                          <th key={h} className="px-3 py-2 text-right font-semibold whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((sub, i) => {
                        const pct = sub.totalScore != null
                          ? Math.round((sub.totalScore / (sub.maxScore || 95)) * 100)
                          : null
                        const tt  = totalTime(sub)
                        return (
                          <tr key={sub.id} className={`border-b border-green-100 hover:bg-green-50 ${i % 2 === 0 ? '' : 'bg-gray-50'}`}>
                            <td className="px-3 py-2 font-medium">{sub.studentName}</td>
                            <td className="px-3 py-2 text-gray-500 font-mono">{sub.studentId}</td>
                            <td className="px-3 py-2">
                              {sub.totalScore != null
                                ? <span className="font-bold text-green-700">{sub.totalScore}</span>
                                : <span className="text-gray-400 text-xs">–</span>
                              }
                            </td>
                            <td className="px-3 py-2">
                              {pct != null ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-400'}`}
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                  <span className="text-xs">{pct}%</span>
                                </div>
                              ) : '–'}
                            </td>
                            <td className="px-3 py-2 font-mono text-xs">{tt ? formatTime(tt) : '–'}</td>
                            <td className="px-3 py-2">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                sub.submitted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {sub.submitted ? '✓ הוגש' : '⏳ בתהליך'}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-400">
                              {sub.endTime?.toDate ? sub.endTime.toDate().toLocaleDateString('he-IL') : '–'}
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setSelected(sub)}
                                  className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded-lg transition-colors"
                                >
                                  צפייה
                                </button>
                                {sub.submitted && (
                                  <button
                                    onClick={() => handleUnsubmit(sub)}
                                    className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-2 py-1 rounded-lg transition-colors"
                                    title="אפשר חזרה לעבודה"
                                  >
                                    ↩ חזרה
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(sub)}
                                  className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-lg transition-colors"
                                  title="מחק תלמיד"
                                >
                                  🗑
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <ClassStats submissions={submissions} />
          )}
        </div>
      </div>
    </div>
  )
}
