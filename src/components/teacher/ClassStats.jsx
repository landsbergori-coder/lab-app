import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts'
import { RUBRIC } from '../../grading/rubric'

const QUESTION_LABELS = {
  q46a:'46א', q46b:'46ב', q47:'47', q48a:'48א', q48b:'48ב',
  q49:'49', q50:'50', q51a:'51א', q51b:'51ב', q52:'52', q53:'53',
  q54a:'54א', q54b:'54ב', q55a:'55א', q55b:'55ב',
  q56:'56', q57:'57', q58:'58', q59:'59',
}

export default function ClassStats({ submissions }) {
  const submitted = submissions.filter(s => s.submitted && s.totalScore != null)

  if (submitted.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        אין עדיין תלמידים שהגישו – הגרפים יוצגו לאחר הגשה ראשונה
      </div>
    )
  }

  // Score distribution
  const bins = [0,10,20,30,40,50,60,70,80,90,100]
  const distData = bins.slice(0, -1).map((low, i) => {
    const high = bins[i + 1]
    return {
      range: `${low}–${high}`,
      count: submitted.filter(s => {
        const pct = Math.round((s.totalScore / (s.maxScore || 95)) * 100)
        return pct >= low && pct < high
      }).length,
    }
  })

  // Per-question average score (%)
  const qData = Object.keys(RUBRIC).map(key => {
    const maxPts = RUBRIC[key].maxPoints
    const scores = submitted
      .map(s => s.scores?.[key]?.points)
      .filter(p => p != null)
    const avg = scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length / maxPts) * 100)
      : 0
    return { label: QUESTION_LABELS[key], avg, maxPts }
  })

  const avgScore = Math.round(
    submitted.reduce((a, s) => a + (s.totalScore || 0), 0) / submitted.length * 10
  ) / 10
  const maxScore = Math.max(...submitted.map(s => s.totalScore || 0))
  const minScore = Math.min(...submitted.map(s => s.totalScore || 0))

  // Time data
  const timeData = submitted.map(s => ({
    name: s.studentName?.split(' ')[0] || s.studentId,
    'חלק א': Math.round((s.timePerPart?.A || 0) / 60),
    'חלק ב': Math.round((s.timePerPart?.B || 0) / 60),
    'חלק ג': Math.round((s.timePerPart?.C || 0) / 60),
  }))

  return (
    <div className="p-5 space-y-6" dir="rtl">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'ציון ממוצע', value: `${avgScore}/95`, sub: `${Math.round((avgScore/95)*100)}%` },
          { label: 'ציון גבוה', value: maxScore, sub: `${Math.round((maxScore/95)*100)}%` },
          { label: 'ציון נמוך', value: minScore, sub: `${Math.round((minScore/95)*100)}%` },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <div className="text-xl font-bold text-green-800">{value}</div>
            <div className="text-green-600 text-xs">{sub}</div>
            <div className="text-gray-500 text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Score distribution */}
      <div>
        <h3 className="font-bold text-green-800 mb-3">📊 התפלגות ציונות (באחוזים)</h3>
        <div className="bg-white rounded-xl border border-green-100 p-4">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={distData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [v, 'תלמידים']} />
              <Bar dataKey="count" fill="#52b788" radius={[4,4,0,0]} name="תלמידים" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-question performance */}
      <div>
        <h3 className="font-bold text-green-800 mb-3">📈 ממוצע לפי שאלה (%)</h3>
        <div className="bg-white rounded-xl border border-green-100 p-4">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={qData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`${v}%`, 'ממוצע']} />
              <Bar dataKey="avg" fill="#2d6a4f" radius={[4,4,0,0]} name="ממוצע %">
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Time per part */}
      {timeData.length > 0 && (
        <div>
          <h3 className="font-bold text-green-800 mb-3">⏱️ זמן עבודה לפי חלק (דקות)</h3>
          <div className="bg-white rounded-xl border border-green-100 p-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={timeData} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => [`${v} דק'`]} />
                <Legend />
                <Bar dataKey="חלק א" fill="#86d9a9" radius={[4,4,0,0]} />
                <Bar dataKey="חלק ב" fill="#52b788" radius={[4,4,0,0]} />
                <Bar dataKey="חלק ג" fill="#2d6a4f" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
