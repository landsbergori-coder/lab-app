import { useState, useEffect, useCallback } from 'react'
import { getSubmission } from '../../firebase/db'
import TextQuestion from '../questions/TextQuestion'
import TableBuilder from '../questions/TableBuilder'

const QUESTIONS_B = [
  {
    key: 'q46b', number: '46', subLabel: 'ב', points: 3,
    text: 'כתוב כותרת לטבלה שהכנת.',
    placeholder: 'כתב כותרת מתאימה לטבלה...',
    minRows: 2,
  },
  {
    key: 'q47', number: '47', points: 5,
    text: 'מהו המשתנה הבלתי-תלוי בניסוי שערכת בחלקים א1 ור׳ א2?',
    placeholder: 'ציין את המשתנה הבלתי-תלוי...',
    minRows: 2,
  },
  {
    key: 'q48a', number: '48', subLabel: 'א', points: 3,
    text: 'מהו המשתנה התלוי בניסוי שערכת?',
    placeholder: 'ציין את המשתנה התלוי...',
    minRows: 2,
  },
  {
    key: 'q48b', number: '48', subLabel: 'ב', points: 4,
    text: 'התבסס על המידע שבקטע "לידיעתך" (בעמוד 5) והסבר את הקשר בין המשתנה התלוי לבין דרך המדידה שלו.',
    hint: 'לידיעתך: תמיסת האתנול שבמבחנה היא "נוזל מריץ". הנוזל נע לאורך הנייר בכוח הנימיות, ויחד אתו נעים הצבעונים (הפיגמנטים) השונים. כל צבע שונה האופייני לו.',
    placeholder: 'הסבר את הקשר בין המשתנה התלוי לדרך המדידה...',
    minRows: 4,
  },
  {
    key: 'q49', number: '49', points: 4,
    text: 'מבחנה ג היא בקרה. הסבר מדוע היה חשוב לכלול אותה בניסוי.',
    placeholder: 'הסבר את חשיבות מבחנת הבקרה...',
    minRows: 3,
  },
  {
    key: 'q50', number: '50', points: 8,
    text: 'הסבר את ההבדל בין התוצאה שהתקבלה במבחנה א לבין התוצאה שהתקבלה במבחנה ב.',
    placeholder: 'הסבר את ההבדל בין התוצאות...',
    minRows: 4,
  },
  {
    key: 'q51a', number: '51', subLabel: 'א', points: 5,
    text: 'הסבר מדוע היה חשוב להשתמש בכמות שווה של עלים בכל אחת ממבחנות הניסוי.',
    placeholder: 'הסבר את החשיבות של כמות שווה של עלים...',
    minRows: 3,
  },
  {
    key: 'q51b', number: '51', subLabel: 'ב', points: 2,
    text: 'כתוב שני גורמים נוספים שנשמרו קבועים במהלך הניסוי.',
    placeholder: 'ציין שני גורמים קבועים נוספים:\n1. \n2. ',
    minRows: 3,
  },
  {
    key: 'q52', number: '52', points: 5,
    text: 'אילו צבעים התקבלו ממיצוי העלים לאחר ההפרדה באמצעות הנוזל המריץ (בסעיף יח)?',
    placeholder: 'ציין את הצבעים שהתקבלו...',
    minRows: 2,
  },
  {
    key: 'q53', number: '53', points: 7,
    text: 'אחד מבין הצבעים שציינת בתשובתך לשאלה 52 הוא צבעו של חומר החיוני לקיום התהלך שבדקת בחלק א. ציין מהו החומר, והסבר את חשיבותו לתהלוך זה.',
    placeholder: 'ציין את החומר והסבר את חשיבותו...',
    minRows: 4,
  },
]

export default function PartB({ user, onAnswered }) {
  const [answers, setAnswers]   = useState({})
  const [answered, setAnswered] = useState({})
  const [loading, setLoading]   = useState(true)

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

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="text-green-600 animate-pulse">טוען...</div>
    </div>
  )

  return (
    <div className="space-y-5 fade-in">
      {/* Video */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-green-100">
        <div className="bg-gradient-to-l from-green-600 to-green-700 px-6 py-4 flex items-center gap-3">
          <span className="text-2xl">🎬</span>
          <div>
            <h2 className="text-white font-bold text-lg">סרטון – הפרדת צבעוניים</h2>
            <p className="text-green-200 text-sm">צפה לפני מענה על השאלות</p>
          </div>
        </div>
        <div className="p-4 bg-black">
          <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src="https://drive.google.com/file/d/1F9aK55i_Yupg8hGe66idgMCiNH8GMVFw/preview"
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              allow="autoplay"
              title="סרטון חלק ב'"
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-2xl shadow-md border border-green-100">
        <div className="bg-gradient-to-l from-green-600 to-green-700 px-6 py-4 flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <h2 className="text-white font-bold text-lg">הנחיות חלק ב׳ – הפרדת צבענים (פיגמנטים) בעלים צבעוניים</h2>
        </div>
        <div className="p-5 text-sm text-green-900 space-y-3" dir="rtl">
          <p>לצבעונים שונים המצוויים בעלי צמחים יש מסיסות שונה במים ובאתנול (כוהל / אלכוהול). בסעיף יב עבוד יב בהתאם לעצמאותך.</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="border border-green-200 rounded-lg p-3 bg-green-50">
              <p className="font-bold text-green-800 mb-2">🟢 יהודי נודד</p>
              <ul className="space-y-1 text-xs">
                <li>יב. על שולחנך עלי ומכתש. החזק עלה אחד מעל המכתש וגזור אותו לחתיכות קטנות. גזור גם את חתיכות העלים שנותרו מסעיף ג.</li>
              </ul>
            </div>
            <div className="border border-purple-200 rounded-lg p-3 bg-purple-50">
              <p className="font-bold text-purple-800 mb-2">🟣 אחירנטוס / שזיף פיסרדי</p>
              <ul className="space-y-1 text-xs">
                <li>יב. על שולחנך עלי ומכתש. החזק 5 עלים מעל המכתש וגזור אותם לחתיכות קטנות. בעזרת מספריים.</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="font-semibold text-amber-800 mb-1">⏱️ שים לב:</p>
            <p>עליך להמתין כ־8 דקות. אין לטלטל את המבחנה.</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="font-bold text-blue-800">חלק א2 – בדיקת תוצאות הפוטוסינתזה בעלים</p>
            <p className="text-xs mt-1">אם לא עברו 15 דקות מהשעה שרשמת בסעיף יא, המתן. לאחר שעברו 15 דקות, כבה את המנורה ובדוק יסתיים חלק א של הניסוי.</p>
          </div>
        </div>
      </div>

      {/* Questions header */}
      <div className="flex items-center gap-3">
        <div className="h-px bg-green-300 flex-1" />
        <h3 className="font-bold text-green-800 text-lg px-3">ענה על שאלות 46–53</h3>
        <div className="h-px bg-green-300 flex-1" />
      </div>

      {/* Q46a – Table */}
      <TableBuilder
        user={user}
        initialValue={answers.q46a?.value}
        onAnswered={handleAnswered}
      />

      {/* Rest of questions */}
      {QUESTIONS_B.map(q => (
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
    </div>
  )
}
