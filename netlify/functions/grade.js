// Netlify Serverless Function – Grade student answers with Claude AI
// Environment variable required: ANTHROPIC_API_KEY

export const handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Missing API key' }) }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const { questionKey, question, criteria, maxPoints, studentAnswer } = body

  if (!studentAnswer?.trim()) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ points: 0, explanation: 'לא ניתנה תשובה' }),
    }
  }

  const prompt = `אתה מורה לביולוגיה שבודק עבודת מעבדה של תלמיד יב'. עליך לבדוק את תשובת התלמיד ולתת ניקוד לפי המחוון שלהלן.

**שאלה (${questionKey}):**
${question}

**מחוון – קריטריונים לניקוד:**
${criteria}

**ניקוד מקסימלי:** ${maxPoints} נקודות

**תשובת התלמיד:**
${studentAnswer}

---

הוראות בדיקה:
1. בדוק את תשובת התלמיד מול המחוון
2. תן ניקוד מ-0 עד ${maxPoints} נקודות
3. חשוב מאוד: תן קרדיט מלא לתשובה נכונה מבחינה ביולוגית גם אם הניסוח שונה מהמחוון – הרעיון חשוב, לא הניסוח המדויק
4. שגיאות לשון ושגיאות כתיב אינן מצדיקות הורדת ניקוד
5. הסבר בעברית: מה נכון בתשובה. אם הורד ניקוד – ציין ספציפית מה חסר (לדוגמה: "הורדו 2 נקודות כי לא הוזכר..."). אם הציון מלא – כתוב מה היה מצוין בתשובה.

ענה **אך ורק** בפורמט JSON הבא (ללא טקסט נוסף):
{
  "points": <מספר בין 0 ל-${maxPoints}>,
  "explanation": "<הסבר בעברית עם פירוט מה נכון ועל מה הורד ניקוד, עד 4 משפטים>"
}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ''

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')

    const parsed = JSON.parse(jsonMatch[0])
    const points = Math.min(maxPoints, Math.max(0, Number(parsed.points) || 0))

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ points, explanation: parsed.explanation || '' }),
    }
  } catch (err) {
    console.error('Grade function error:', err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    }
  }
}
