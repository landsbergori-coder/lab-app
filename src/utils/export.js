import * as XLSX from 'xlsx'
import { RUBRIC } from '../grading/rubric'

const QUESTION_LABELS = {
  q46a: '46א – טבלה', q46b: '46ב – כותרת טבלה',
  q47:  '47 – משתנה בלתי-תלוי',
  q48a: '48א – משתנה תלוי', q48b: '48ב – קשר למדידה',
  q49:  '49 – חשיבות בקרה',
  q50:  '50 – הבדל מבחנה א/ב',
  q51a: '51א – כמות עלים', q51b: '51ב – גורמים קבועים',
  q52:  '52 – צבעים',
  q53:  '53 – חומר חיוני',
  q54a: '54א – סוג גרף', q54b: '54ב – ציור גרף',
  q55a: '55א – תיאור תוצאות', q55b: '55ב – הבדל מדידה',
  q56:  '56 – כלורופיל וטענת חוקר',
  q57:  '57 – אין שינוי 1000-1500',
  q58:  '58 – קשר לביומסה',
  q59:  '59 – חשיפה לאור גבוה',
}

function formatTime(seconds) {
  if (!seconds) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function exportToExcel(submissions) {
  const questionKeys = Object.keys(RUBRIC)

  // Build rows
  const rows = submissions.map(sub => {
    const row = {
      'שם תלמיד': sub.studentName || '',
      'מספר ת.ז.': sub.studentId || '',
      'ציון כולל': sub.totalScore ?? '',
      'ציון מקסימלי': sub.maxScore ?? 95,
      'אחוז': sub.totalScore != null ? `${Math.round((sub.totalScore / (sub.maxScore || 95)) * 100)}%` : '',
      'זמן כולל (דקות)': sub.timePerPart
        ? Math.round(((sub.timePerPart.A || 0) + (sub.timePerPart.B || 0) + (sub.timePerPart.C || 0)) / 60)
        : '',
      'זמן חלק א׳': formatTime(sub.timePerPart?.A),
      'זמן חלק ב׳': formatTime(sub.timePerPart?.B),
      'זמן חלק ג׳': formatTime(sub.timePerPart?.C),
      'הוגש': sub.submitted ? 'כן' : 'לא',
      'הערות מורה': sub.teacherNotes || '',
    }

    // Per-question scores
    questionKeys.forEach(key => {
      const scoreEntry = sub.scores?.[key]
      const label = QUESTION_LABELS[key] || key
      row[`${label} (נק')`]   = scoreEntry?.points ?? ''
      row[`${label} (מקס')`]  = RUBRIC[key]?.maxPoints ?? ''
    })

    return row
  })

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'תוצאות')

  // Auto column widths
  const maxWidths = {}
  rows.forEach(row => {
    Object.entries(row).forEach(([k, v]) => {
      maxWidths[k] = Math.max(maxWidths[k] || 0, String(k).length, String(v).length)
    })
  })
  ws['!cols'] = Object.keys(rows[0] || {}).map(k => ({ wch: Math.min(maxWidths[k] + 2, 40) }))

  XLSX.writeFile(wb, `תוצאות_מעבדה_יבשה_${new Date().toLocaleDateString('he-IL').replace(/\//g, '-')}.xlsx`)
}

export function exportToCSV(submissions) {
  const questionKeys = Object.keys(RUBRIC)
  const headers = [
    'שם תלמיד', 'מספר ת.ז.', 'ציון כולל', 'ציון מקסימלי', 'אחוז',
    'זמן חלק א׳', 'זמן חלק ב׳', 'זמן חלק ג׳', 'הוגש', 'הערות מורה',
    ...questionKeys.flatMap(k => [`${QUESTION_LABELS[k]} (נק')`, `${QUESTION_LABELS[k]} (מקס')`]),
  ]

  const rows = submissions.map(sub => {
    const baseRow = [
      sub.studentName || '',
      sub.studentId || '',
      sub.totalScore ?? '',
      sub.maxScore ?? 95,
      sub.totalScore != null ? `${Math.round((sub.totalScore / (sub.maxScore || 95)) * 100)}%` : '',
      formatTime(sub.timePerPart?.A),
      formatTime(sub.timePerPart?.B),
      formatTime(sub.timePerPart?.C),
      sub.submitted ? 'כן' : 'לא',
      sub.teacherNotes || '',
    ]
    const scoreRow = questionKeys.flatMap(k => [
      sub.scores?.[k]?.points ?? '',
      RUBRIC[k]?.maxPoints ?? '',
    ])
    return [...baseRow, ...scoreRow]
  })

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const BOM = '\uFEFF' // UTF-8 BOM for Hebrew Excel compatibility
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `תוצאות_מעבדה_יבשה_${new Date().toLocaleDateString('he-IL').replace(/\//g, '-')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
