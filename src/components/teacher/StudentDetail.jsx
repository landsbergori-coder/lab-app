import { useState } from 'react'
import { updateTeacherNotes, updateQuestionScore } from '../../firebase/db'
import { RUBRIC } from '../../grading/rubric'

// ─── Read-only graph constants (mirrors GraphBuilder) ────────────────────────
const G = { W:560, H:380, PL:70, PR:30, PT:30, PB:60, XMAX:1600, YMAX:14, YSTEP:2 }
const GX_VALUES = [100, 250, 500, 1000, 1500]
const gToSVG = (x, y) => ({
  x: G.PL + (x / G.XMAX) * (G.W - G.PL - G.PR),
  y: G.PT + (1 - y / G.YMAX) * (G.H - G.PT - G.PB),
})
const gYTicks = []; for (let y = 0; y <= G.YMAX; y += G.YSTEP) gYTicks.push(y)
const gXGrid  = []; for (let x = 100; x <= 1400; x += 100) gXGrid.push(x)

function GraphView({ value }) {
  const { zoneA = {}, zoneB = {}, title = '', xLabel = '', yLabel = '' } = value
  const polyA = GX_VALUES.filter(x => zoneA[x] !== undefined).map(x => { const p = gToSVG(x, zoneA[x]); return `${p.x},${p.y}` }).join(' ')
  const polyB = GX_VALUES.filter(x => zoneB[x] !== undefined).map(x => { const p = gToSVG(x, zoneB[x]); return `${p.x},${p.y}` }).join(' ')
  return (
    <div className="mt-1">
      {title && <p className="text-xs font-semibold text-center text-gray-700 mb-1">{title}</p>}
      <div className="border border-green-200 rounded-lg p-1 bg-white overflow-x-auto">
        <svg viewBox={`0 0 ${G.W} ${G.H}`} className="w-full">
          {gYTicks.map(y => { const {y:yy}=gToSVG(0,y); return (
            <g key={y}>
              <line x1={G.PL} y1={yy} x2={G.W-G.PR} y2={yy} stroke={y===0?'#374151':'#e5e7eb'} strokeWidth={y===0?1.5:1}/>
              <text x={G.PL-6} y={yy+4} textAnchor="end" fontSize="11" fill="#6b7280">{y}</text>
            </g>
          )})}
          {gXGrid.map(x => { const {x:px}=gToSVG(x,0); return <line key={x} x1={px} y1={G.PT} x2={px} y2={G.H-G.PB} stroke="#e5e7eb" strokeWidth="1"/> })}
          {GX_VALUES.map(x => { const p=gToSVG(x,0); return (
            <g key={x}>
              <line x1={p.x} y1={G.H-G.PB} x2={p.x} y2={G.H-G.PB+5} stroke="#374151" strokeWidth="1.5"/>
              <text x={p.x} y={G.H-G.PB+18} textAnchor="middle" fontSize="11" fill="#6b7280">{x}</text>
            </g>
          )})}
          <line x1={G.PL} y1={G.PT} x2={G.PL} y2={G.H-G.PB} stroke="#374151" strokeWidth="2"/>
          <line x1={G.PL} y1={G.H-G.PB} x2={G.W-G.PR} y2={G.H-G.PB} stroke="#374151" strokeWidth="2"/>
          {polyA && <polyline points={polyA} fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinejoin="round"/>}
          {polyB && <polyline points={polyB} fill="none" stroke="#9333ea" strokeWidth="2.5" strokeLinejoin="round" strokeDasharray="6,3"/>}
          {GX_VALUES.filter(x=>zoneA[x]!==undefined).map(x=>{const p=gToSVG(x,zoneA[x]);return <circle key={x} cx={p.x} cy={p.y} r="6" fill="#16a34a" stroke="white" strokeWidth="2"/>})}
          {GX_VALUES.filter(x=>zoneB[x]!==undefined).map(x=>{const p=gToSVG(x,zoneB[x]);return <rect key={x} x={p.x-5} y={p.y-5} width="10" height="10" fill="#9333ea" stroke="white" strokeWidth="2"/>})}
          <text x={(G.PL+G.W-G.PR)/2} y={G.H-8} textAnchor="middle" fontSize="12" fill="#374151">{xLabel}</text>
          <text x={15} y={(G.PT+G.H-G.PB)/2} textAnchor="middle" fontSize="12" fill="#374151" transform={`rotate(-90,15,${(G.PT+G.H-G.PB)/2})`}>{yLabel}</text>
        </svg>
      </div>
      <div className="flex justify-center gap-4 mt-1 text-xs" dir="rtl">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-green-600"/>זן א׳ (ירוק)</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-purple-600"/>זן ב׳ (סגול-אדום)</span>
      </div>
    </div>
  )
}

const QUESTION_LABELS = {
  q46a: '46א', q46b: '46ב', q47: '47', q48a: '48א', q48b: '48ב',
  q49: '49', q50: '50', q51a: '51א', q51b: '51ב', q52: '52', q53: '53',
  q54a: '54א', q54b: '54ב', q55a: '55א', q55b: '55ב',
  q56: '56', q57: '57', q58: '58', q59: '59',
}

function ScoreBar({ points, maxPoints }) {
  const pct = maxPoints > 0 ? Math.round((points / maxPoints) * 100) : 0
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap">{points}/{maxPoints}</span>
    </div>
  )
}

function QuestionRow({ qKey, submission, onScoreUpdate }) {
  const rubric  = RUBRIC[qKey]
  const score   = submission.scores?.[qKey]
  const answer  = submission.answers?.[qKey]
  const [editing, setEditing] = useState(false)
  const [newPoints, setNewPoints]   = useState(score?.points ?? 0)
  const [newExpl, setNewExpl]       = useState(score?.explanation ?? '')
  const [saving, setSaving]         = useState(false)

  const isTable = answer?.type === 'table' && answer.value?.colHeaders
  const answerText = answer?.value
    ? (typeof answer.value === 'string'
        ? answer.value
        : '(נתונים מובנים)')
    : '(לא ניתנה תשובה)'

  const save = async () => {
    setSaving(true)
    try {
      await updateQuestionScore(submission.id, qKey, Number(newPoints), newExpl)
      onScoreUpdate(qKey, Number(newPoints), newExpl)
      setEditing(false)
    } catch(e) { console.error(e) }
    finally { setSaving(false) }
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-green-50 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-green-800">שאלה {QUESTION_LABELS[qKey]}</span>
          <span className="text-xs text-gray-500">{rubric?.description}</span>
        </div>
        <div className="flex items-center gap-3">
          {score && <ScoreBar points={score.points} maxPoints={rubric?.maxPoints || 0} />}
          <button
            onClick={() => setEditing(!editing)}
            className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded-lg transition-colors"
          >
            {editing ? 'ביטול' : '✏️ ערוך'}
          </button>
        </div>
      </div>

      {/* Answer */}
      <div className="px-4 py-3 bg-white">
        <p className="text-xs font-semibold text-gray-500 mb-1">תשובת התלמיד:</p>
        {answer?.type === 'graph' && answer.value ? (
          <GraphView value={answer.value} />
        ) : isTable ? (
          <div className="overflow-x-auto mt-1">
            <table className="w-full text-xs border-collapse" dir="rtl">
              <thead>
                <tr className="bg-green-100">
                  <th className="border border-green-300 px-2 py-1 font-semibold">מבחנה</th>
                  {answer.value.colHeaders.map((h, i) => (
                    <th key={i} className="border border-green-300 px-2 py-1 font-semibold">{h || `עמודה ${i + 2}`}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['א', 'ב', 'ג'].map((rowId, ri) => (
                  <tr key={rowId} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-200 px-2 py-1 font-bold text-center text-green-800">מבחנה {rowId}</td>
                    {(answer.value.cells?.[rowId] || []).map((cell, ci) => (
                      <td key={ci} className="border border-gray-200 px-2 py-1 text-center">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm whitespace-pre-wrap max-h-32 overflow-y-auto" dir="rtl">
            {answerText}
          </div>
        )}

        {score?.explanation && (
          <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            <p className="text-xs font-semibold text-blue-700 mb-0.5">הסבר AI:</p>
            <p className="text-xs text-blue-800" dir="rtl">{score.explanation}</p>
          </div>
        )}

        {rubric?.criteria && (
          <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <p className="text-xs font-semibold text-amber-700 mb-0.5">תשובת המחוון:</p>
            <p className="text-xs text-amber-900 whitespace-pre-wrap" dir="rtl">{rubric.criteria.trim()}</p>
          </div>
        )}

        {editing && (
          <div className="mt-3 space-y-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-yellow-800">עריכה ידנית:</p>
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-600">ניקוד:</label>
              <input
                type="number"
                min="0"
                max={rubric?.maxPoints}
                step="0.5"
                value={newPoints}
                onChange={e => setNewPoints(e.target.value)}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                dir="ltr"
              />
              <span className="text-xs text-gray-400">/ {rubric?.maxPoints}</span>
            </div>
            <div>
              <label className="text-xs text-gray-600">הערה:</label>
              <input
                type="text"
                value={newExpl}
                onChange={e => setNewExpl(e.target.value)}
                className="w-full mt-1 px-2 py-1 border border-gray-300 rounded text-sm"
                dir="rtl"
              />
            </div>
            <button
              onClick={save}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-1.5 rounded-lg transition-colors disabled:opacity-60"
            >
              {saving ? 'שומר...' : '💾 שמור'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function StudentDetail({ submission: initialSub, onBack, onUpdate }) {
  const [sub, setSub] = useState(initialSub)
  const [notes, setNotes]   = useState(sub.teacherNotes || '')
  const [savingNotes, setSavingNotes] = useState(false)

  const handleScoreUpdate = (key, points, explanation) => {
    const updated = {
      ...sub,
      scores: { ...sub.scores, [key]: { ...sub.scores?.[key], points, explanation } },
    }
    const total = Object.values(updated.scores).reduce((s, v) => s + (v.points || 0), 0)
    updated.totalScore = Math.round(total * 10) / 10
    setSub(updated)
    onUpdate?.(updated)
  }

  const saveNotes = async () => {
    setSavingNotes(true)
    try {
      await updateTeacherNotes(sub.id, notes)
    } catch(e) { console.error(e) }
    finally { setSavingNotes(false) }
  }

  const pct = sub.totalScore != null
    ? Math.round((sub.totalScore / (sub.maxScore || 95)) * 100)
    : null

  return (
    <div className="min-h-screen bg-green-50" dir="rtl">
      <header className="bg-gradient-to-l from-green-800 to-green-900 text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-green-200 hover:text-white transition-colors text-xl">←</button>
            <div>
              <h1 className="font-bold text-xl">{sub.studentName}</h1>
              <p className="text-green-200 text-sm">ת.ז.: {sub.studentId}</p>
            </div>
          </div>
          {pct != null && (
            <div className="text-center">
              <div className="text-3xl font-bold">{sub.totalScore}</div>
              <div className="text-green-200 text-sm">מתוך {sub.maxScore || 95} | {pct}%</div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {/* Summary card */}
        <div className="bg-white rounded-2xl shadow-md border border-green-100 p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-500">ציון חלק ב׳</div>
              <div className="font-bold text-green-700">
                {Object.entries(sub.scores || {})
                  .filter(([k]) => ['q46a','q46b','q47','q48a','q48b','q49','q50','q51a','q51b','q52','q53'].includes(k))
                  .reduce((s, [,v]) => s + (v.points || 0), 0).toFixed(1)} / 53
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">ציון חלק ג׳</div>
              <div className="font-bold text-green-700">
                {Object.entries(sub.scores || {})
                  .filter(([k]) => ['q54a','q54b','q55a','q55b','q56','q57','q58','q59'].includes(k))
                  .reduce((s, [,v]) => s + (v.points || 0), 0).toFixed(1)} / 42
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">זמן עבודה</div>
              <div className="font-bold text-green-700 text-sm">
                א: {Math.round((sub.timePerPart?.A || 0) / 60)}' |
                ב: {Math.round((sub.timePerPart?.B || 0) / 60)}' |
                ג: {Math.round((sub.timePerPart?.C || 0) / 60)}'
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">סטטוס</div>
              <div className={`font-bold text-sm ${sub.submitted ? 'text-green-600' : 'text-yellow-600'}`}>
                {sub.submitted ? '✓ הוגש' : '⏳ בתהליך'}
              </div>
            </div>
          </div>
        </div>

        {/* Teacher notes */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-4">
          <h3 className="font-bold text-green-800 mb-2">📝 הערות מורה</h3>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="הוסף הערות ידניות לציון..."
            rows={3}
            dir="rtl"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-400"
          />
          <button
            onClick={saveNotes}
            disabled={savingNotes}
            className="mt-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
          >
            {savingNotes ? 'שומר...' : '💾 שמור הערות'}
          </button>
        </div>

        {/* Questions */}
        <div>
          <h3 className="font-bold text-green-800 text-lg mb-3">שאלות חלק ב׳ (46–53)</h3>
          <div className="space-y-3">
            {['q46a','q46b','q47','q48a','q48b','q49','q50','q51a','q51b','q52','q53'].map(key => (
              <QuestionRow key={key} qKey={key} submission={sub} onScoreUpdate={handleScoreUpdate} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-green-800 text-lg mb-3">שאלות חלק ג׳ (54–59)</h3>
          <div className="space-y-3">
            {['q54a','q54b','q55a','q55b','q56','q57','q58','q59'].map(key => (
              <QuestionRow key={key} qKey={key} submission={sub} onScoreUpdate={handleScoreUpdate} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
