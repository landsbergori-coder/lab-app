import { useState, useEffect, useCallback } from 'react'
import { getSubmission, submitSubmission } from '../../firebase/db'
import { gradeAllAnswers } from '../../grading/grader'
import TextQuestion from '../questions/TextQuestion'
import GraphBuilder from '../questions/GraphBuilder'

const QUESTIONS_C = [
  {
    key: 'q55a', number: '55', subLabel: 'א', points: 4,
    text: 'תאר את תוצאות הניסוי.',
    placeholder: 'תאר את תוצאות הניסוי בפירוט...',
    minRows: 4,
  },
  {
    key: 'q55b', number: '55', subLabel: 'ב', points: 6,
    text: 'בתהליך הפוטוסינתזה יש מגיבים (חומרי מוצא) ותוצרים. הסבר מה ההבדל בין דרך המדידה שהשתמשת בה בניסוי שערכת בחלק א, לבין דרך המדידה של הניסוי המתואר בחלק ג.',
    placeholder: 'הסבר את ההבדל בין שיטות המדידה...',
    minRows: 4,
  },
  {
    key: 'q56', number: '56', points: 6,
    text: 'אחד החוקרים טען שאי-אפשר להסיק מסקנות בדבר השפעת האנתוציאנינים בעלים על קצב הפוטוסינתזה, ללא בדיקה של כמות הכלורופיל בעלי שני הזנים. הסבר מדוע.',
    placeholder: 'הסבר את טענת החוקר...',
    minRows: 4,
  },
  {
    key: 'q57', number: '57', points: 5,
    text: 'הסבר מדוע בטווח בין עוצמות אור 1,000–1,500 (יחידות יחסיות) אין שינוי בקצב תהליך הפוטוסינתזה בשני הזנים.',
    placeholder: 'הסבר את היעדר השינוי בטווח עוצמות האור הגבוהות...',
    minRows: 4,
  },
  {
    key: 'q58', number: '58', points: 5,
    text: 'הסבר כיצד יכלו תוצאות הניסוי שערכו החוקרים (עמ׳ 8) להסביר את התוצאות שקיבלו החוקרים בהשוואת הביומסה של שני הזנים.\n\nרקע: במחקר שנעשה בתנאי חממה, גידלו בתנאים זהים מכל אחד מהזנים. כעבור 4 חודשים נבדק השינוי בביומסה של הצמחים. נמצא כי הגידול בביומסה של הצמחים של חלקים העל-אדמתיים של זמחים מזן א׳ היה גבוה יותר מזה של צמחים מזן ב׳.',
    placeholder: 'הסבר את הקשר בין תוצאות הניסוי לגידול הביומסה...',
    minRows: 5,
  },
  {
    key: 'q59', number: '59', points: 6,
    text: 'חשיפה ממושכת של עלים לעוצמות אור גבוהות פוגעת בכלורופלסטידות. חוקרים סבורים שאנתוציאנינים בעלים מגנים על העלים מפני פגיעה זו.\n\nאם הנחה שהחוקרים צודקים, כיצד תשפיע חשיפת העלים לעוצמות אור מ-2,000 יחידות יחסיות על קצב הפוטוסינתזה בכל אחד מהזנים א׳, ב׳?\n\nנמק.',
    placeholder: 'הסבר את השפעת האור הגבוה על כל זן...',
    minRows: 5,
  },
]

export default function PartC({ user, onAnswered, onSubmit }) {
  const [answers, setAnswers]     = useState({})
  const [answered, setAnswered]   = useState({})
  const [loading, setLoading]     = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    getSubmission(user.idNumber).then(sub => {
      if (sub?.answers) setAnswers(sub.answers)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user.idNumber])

  const handleAnswered = useCallback((key, isAns) => {
    setAnswered(prev => {
      const updated = { ...prev, [key]: isAns }
      const count = Object.values(updated).filter(Boolean).length
      onAnswered?.(count)
      return updated
    })
  }, [onAnswered])

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError('')
    try {
      const sub = await getSubmission(user.idNumber)
      const { scores, totalScore } = await gradeAllAnswers(sub)
      await submitSubmission(user.idNumber, scores, totalScore)
      onSubmit?.()
    } catch (err) {
      console.error(err)
      setSubmitError('שגיאה בשליחה. נסה שוב.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="text-green-600 animate-pulse">טוען...</div>
    </div>
  )

  return (
    <div className="space-y-5 fade-in">
      {/* Instructions */}
      <div className="bg-white rounded-2xl shadow-md border border-green-100">
        <div className="bg-gradient-to-l from-green-600 to-green-700 px-6 py-4 flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <h2 className="text-white font-bold text-lg">חלק ג׳ – ניתוח תוצאות ניסוי: השפעת עוצמת האור על קצב הפוטוסינתזה בשני זנים של צמח</h2>
        </div>
        <div className="p-5 text-sm text-green-900 space-y-4" dir="rtl">
          <p>לצמח "זקן נחש" (Ophiopogon planiscapus) יש שני זנים. העלים של הצמחים מזן א׳ הם ירוקים, ואלה של זן ב׳ — סגולים-אדומים. מקור הצבע הוא בצבעונים שנקראים <strong>אנתוציאניניים</strong>. חוקרים ערכו ניסויים בשני הזנים של הצמח, כדי לבדוק את תפקוד האנתוציאניניים בצמח.</p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="font-bold text-green-800 mb-2">ניסוי – השוואת קצב הפוטוסינתזה בשני הזנים</p>
            <p>בניסוי זה בדקו החוקרים את קצב הפוטוסינתזה של צמחים משני הזנים, בעוצמות שונות של אור. קצב התהליך נבדק על פי כמות ה-CO₂ שנקלטה בעלים בתנאי מעבדה. בכל טיפול נבדקו 8 צמחים, וחושבה כמות ה-CO₂ הממוצעת שנקלטה בהם.</p>
            <p className="mt-2">תוצאות הניסוי מוצגות בטבלה 1.</p>
          </div>

          {/* Table 1 */}
          <div>
            <p className="font-bold text-green-800 mb-2">טבלה 1</p>
            <table className="border-collapse text-center text-xs w-full max-w-lg">
              <thead>
                <tr className="bg-green-700 text-white">
                  <th className="border border-green-600 px-3 py-2" rowSpan="2">עוצמת אור<br/>(יחידות יחסיות)</th>
                  <th className="border border-green-600 px-3 py-2" colSpan="2">כמות CO₂ ממוצעת שנקלטה<br/>(מיקרומול/יחידת שטח עלה/יחידת זמן)</th>
                </tr>
                <tr className="bg-green-600 text-white">
                  <th className="border border-green-600 px-3 py-2">זן א׳ (צמח ירוק)</th>
                  <th className="border border-green-600 px-3 py-2">זן ב׳ (צמח סגול-אדום)</th>
                </tr>
              </thead>
              <tbody>
                {[[100,'4.0','3.5'],[250,'7.5','6.0'],[500,'9.5','8.0'],[1000,'12.0','9.5'],[1500,'12.0','9.5']].map(([x,a,b],i) => (
                  <tr key={x} className={i % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
                    <td className="border border-green-200 px-3 py-1 font-semibold">{x}</td>
                    <td className="border border-green-200 px-3 py-1 text-green-700">{a}</td>
                    <td className="border border-green-200 px-3 py-1 text-purple-700">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Questions header */}
      <div className="flex items-center gap-3">
        <div className="h-px bg-green-300 flex-1" />
        <h3 className="font-bold text-green-800 text-lg px-3">ענה על שאלות 54–59</h3>
        <div className="h-px bg-green-300 flex-1" />
      </div>

      {/* Q54a */}
      <TextQuestion
        questionKey="q54a"
        number="54"
        subLabel="א"
        points={3}
        text="מהו סוג ההצגה הגרפית המתאים ביותר לתיאור התוצאות – גרף רציף או דיאגרמת עמודות? נמק את תשובתך."
        placeholder="ציין את סוג הגרף ונמק את בחירתך..."
        minRows={3}
        user={user}
        initialValue={answers.q54a?.value || ''}
        onAnswered={handleAnswered}
      />

      {/* Q54b – Graph */}
      <GraphBuilder
        user={user}
        initialValue={answers.q54b?.value}
        onAnswered={handleAnswered}
      />

      {/* Rest of questions */}
      {QUESTIONS_C.map(q => (
        <TextQuestion
          key={q.key}
          questionKey={q.key}
          number={q.number}
          subLabel={q.subLabel}
          points={q.points}
          text={q.text}
          placeholder={q.placeholder}
          hint={q.hint}
          minRows={q.minRows}
          user={user}
          initialValue={answers[q.key]?.value || ''}
          onAnswered={handleAnswered}
        />
      ))}

      {/* Submit button */}
      <div className="bg-white rounded-2xl shadow-md border border-green-200 p-6 mt-8">
        <div className="text-center space-y-3">
          <h3 className="text-lg font-bold text-green-800">סיום הבחינה</h3>
          <p className="text-sm text-green-700">
            לאחר הגשה, התשובות שלך יישלחו לבדיקה ותקבל ציון.<br/>
            <strong>שים לב:</strong> לאחר הגשה לא ניתן לערוך את התשובות.
          </p>

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-red-700 text-sm">
              ⚠️ {submitError}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full max-w-sm mx-auto block py-4 bg-gradient-to-l from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                בודק תשובות...
              </span>
            ) : '📤 שלח את הבחינה'}
          </button>
        </div>
      </div>
    </div>
  )
}
