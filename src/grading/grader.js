import { RUBRIC, MAX_TOTAL_SCORE } from './rubric'

// ─── Graph auto-grading (no AI needed) ──────────────────────────────────────
function gradeGraph(answer) {
  const { expected } = RUBRIC.q54b
  if (!answer?.value) return { points: 0, maxPoints: 7, explanation: 'לא סומנו נקודות בגרף' }

  const { zoneA = {}, zoneB = {}, title = '', xLabel = '', yLabel = '' } = answer.value
  let score = 0
  const issues = []

  // Title (15%)
  if (title.trim().length > 5) score += 15
  else issues.push('חסרה כותרת לגרף')

  // X label (15%)
  if (xLabel.trim().length > 3) score += 15
  else issues.push('חסרה תווית לציר X')

  // Y label (15%)
  if (yLabel.trim().length > 3) score += 15
  else issues.push('חסרה תווית לציר Y')

  // Zone A points (25%)
  const aKeys = Object.keys(expected.zoneA)
  const aCorrect = aKeys.filter(x => zoneA[x] !== undefined && Math.abs(zoneA[x] - expected.zoneA[x]) <= expected.tolerance)
  score += Math.round((aCorrect.length / aKeys.length) * 25)
  if (aCorrect.length < aKeys.length) issues.push(`זן א': ${aCorrect.length}/${aKeys.length} נקודות נכונות`)

  // Zone B points (25%)
  const bKeys = Object.keys(expected.zoneB)
  const bCorrect = bKeys.filter(x => zoneB[x] !== undefined && Math.abs(zoneB[x] - expected.zoneB[x]) <= expected.tolerance)
  score += Math.round((bCorrect.length / bKeys.length) * 25)
  if (bCorrect.length < bKeys.length) issues.push(`זן ב': ${bCorrect.length}/${bKeys.length} נקודות נכונות`)

  // Lines connecting (5%) – give credit if has multiple points in each zone
  if (Object.keys(zoneA).length >= 3 && Object.keys(zoneB).length >= 3) score += 5

  const points = Math.round((score / 100) * 7 * 10) / 10
  const explanation = score >= 90
    ? 'גרף מלא ונכון עם כותרת, תוויות צירים ונקודות נכונות'
    : `ציון: ${score}/100. ${issues.join(', ')}`

  return { points, maxPoints: 7, explanation }
}

// ─── Table auto-grading ──────────────────────────────────────────────────────
function gradeTable(answer) {
  const val = answer?.value
  if (!val) return { points: 0, maxPoints: 7, explanation: 'הטבלה לא מולאה' }

  let rowA, rowB, rowC

  if (val.colHeaders && val.cells) {
    // New format: find column indices by header keywords
    const headers = val.colHeaders.map(h => (h || '').toLowerCase())
    const concIdx = headers.findIndex(h => h.includes('ריכוז') || h.includes('ביקרבונט'))
    const leafIdx = headers.findIndex(h => h.includes('עלים') || h.includes('על'))
    const distIdx = headers.findIndex(h => h.includes('מרחק') || h.includes('נוזל') || h.includes('ס"מ') || h.includes('cm'))

    // Fallback to positional index if keyword not found
    const cIdx = concIdx >= 0 ? concIdx : 0
    const lIdx = leafIdx >= 0 ? leafIdx : 1
    const dIdx = distIdx >= 0 ? distIdx : 2
    const getCell = (rowId, idx) => val.cells[rowId]?.[idx] ?? ''

    rowA = { concentration: getCell('א', cIdx), leaves: getCell('א', lIdx), distance: getCell('א', dIdx) }
    rowB = { concentration: getCell('ב', cIdx), leaves: getCell('ב', lIdx), distance: getCell('ב', dIdx) }
    rowC = { concentration: getCell('ג', cIdx), leaves: getCell('ג', lIdx), distance: getCell('ג', dIdx) }
  } else if (val.rows) {
    // Legacy format
    const rows = val.rows
    rowA = rows.find(r => r.id === 'א')
    rowB = rows.find(r => r.id === 'ב')
    rowC = rows.find(r => r.id === 'ג')
  } else {
    return { points: 0, maxPoints: 7, explanation: 'הטבלה לא מולאה' }
  }

  let score = 0
  const issues = []

  // Concentration column (30% total – 10% per row)
  if (rowA?.concentration?.includes('1')) score += 10; else issues.push('ריכוז א לא נכון')
  if (rowB?.concentration?.includes('2')) score += 10; else issues.push('ריכוז ב לא נכון')
  if (rowC?.concentration?.includes('2')) score += 10; else issues.push('ריכוז ג לא נכון')

  // Leaves column (15% – 5% per row)
  const hasLeaves = (v) => v && (v.includes('+') || /\d/.test(v))
  const noLeaves  = (v) => v && (v.includes('-') || v === '0' || v.toLowerCase() === 'לא')
  if (hasLeaves(rowA?.leaves))  score += 5; else issues.push('נוכחות עלים א לא נכון')
  if (hasLeaves(rowB?.leaves))  score += 5; else issues.push('נוכחות עלים ב לא נכון')
  if (noLeaves(rowC?.leaves))   score += 5; else issues.push('נוכחות עלים ג לא נכון (צריך ריק/-)' )

  // Distance column (30% – 10% per row)
  const distA = parseFloat(rowA?.distance)
  const distB = parseFloat(rowB?.distance)
  const distC = parseFloat(rowC?.distance)
  if (!isNaN(distA) && distA > 0 && distA < 5)  score += 10; else issues.push('מרחק א לא נכון')
  if (!isNaN(distB) && distB > distA)            score += 10; else issues.push('מרחק ב אמור להיות גדול ממרחק א')
  if (!isNaN(distC) && distC === 0)              score += 10; else issues.push('מרחק ג אמור להיות 0')

  const points = Math.round((score / 100) * 7 * 10) / 10
  const explanation = score >= 85
    ? 'טבלה נכונה ומלאה'
    : `ציון: ${score}/100. ${issues.join(', ')}`

  return { points, maxPoints: 7, explanation }
}

// ─── AI grading via Netlify Function ────────────────────────────────────────
async function gradeWithAI(questionKey, answer, studentText) {
  const q = RUBRIC[questionKey]
  if (!q || !studentText?.trim()) {
    return { points: 0, maxPoints: q?.maxPoints || 0, explanation: 'לא ניתנה תשובה' }
  }

  try {
    const response = await fetch('/.netlify/functions/grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionKey,
        question: q.question,
        criteria: q.criteria,
        maxPoints: q.maxPoints,
        studentAnswer: studentText,
      }),
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return {
      points: data.points,
      maxPoints: q.maxPoints,
      explanation: data.explanation,
    }
  } catch (err) {
    console.error('AI grading error:', err)
    // Fallback: give partial credit based on length
    const words = studentText.trim().split(/\s+/).length
    const fallback = words > 20 ? Math.round(q.maxPoints * 0.5) : Math.round(q.maxPoints * 0.2)
    return {
      points: fallback,
      maxPoints: q.maxPoints,
      explanation: `בדיקה אוטומטית זמנית (${fallback}/${q.maxPoints}). המורה יוכל לעדכן.`,
    }
  }
}

// ─── Grade all answers ────────────────────────────────────────────────────────
export async function gradeAllAnswers(submission) {
  const { answers = {} } = submission
  const scores = {}

  // Grade all questions
  const gradePromises = Object.entries(RUBRIC).map(async ([key, rubricEntry]) => {
    const answer = answers[key]

    let result
    if (key === 'q46a') {
      result = gradeTable(answer)
    } else if (key === 'q54b') {
      result = gradeGraph(answer)
    } else {
      // Text answer → AI
      const text = answer?.value || ''
      result = await gradeWithAI(key, answer, text)
    }

    scores[key] = result
  })

  await Promise.all(gradePromises)

  const totalScore = Math.round(
    Object.values(scores).reduce((sum, s) => sum + (s.points || 0), 0) * 10
  ) / 10

  return { scores, totalScore, maxScore: MAX_TOTAL_SCORE }
}
