import { useState, useEffect } from 'react'
import { saveAnswer } from '../../firebase/db'

const ROWS = ['א', 'ב', 'ג']
const ROW_LABELS = { א: 'מבחנה א', ב: 'מבחנה ב', ג: 'מבחנה ג' }
const NUM_DATA_COLS = 3

const emptyCell = () => ['', '', '']
const emptyCells = () => ({ א: emptyCell(), ב: emptyCell(), ג: emptyCell() })

export default function TableBuilder({ user, initialValue, onAnswered }) {
  const [step, setStep] = useState(1)
  const [colHeaders, setColHeaders] = useState(['', '', ''])
  const [cells, setCells] = useState(emptyCells())
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!initialValue) return
    // New format
    if (initialValue.colHeaders) {
      setColHeaders(initialValue.colHeaders)
      setCells(initialValue.cells || emptyCells())
      setStep(2)
    } else if (initialValue.rows) {
      // Legacy format – migrate: use old column names as headers, values as cells
      const legacyHeaders = ['ריכוז ביקרבונט (%)', 'נוכחות / מספר / אורך עלים', 'המרחק שהתקדם הנוזל (ס"מ)']
      setColHeaders(legacyHeaders)
      const migratedCells = {}
      const rowIds = ['א', 'ב', 'ג']
      initialValue.rows.forEach((r, i) => {
        const id = rowIds[i] || r.id
        migratedCells[id] = [r.concentration || '', r.leaves || '', r.distance || '']
      })
      setCells({ ...emptyCells(), ...migratedCells })
      setStep(2)
    }
  }, [initialValue])

  const isAnswered = Object.values(cells).some(row => row.some(v => v !== ''))

  useEffect(() => {
    onAnswered?.('q46a', isAnswered)
  }, [isAnswered]) // eslint-disable-line

  const persist = async (newColHeaders, newCells) => {
    setSaving(true)
    try {
      await saveAnswer(user.idNumber, 'q46a', {
        type: 'table',
        value: { colHeaders: newColHeaders, cells: newCells },
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const updateHeader = (i, val) => {
    const updated = colHeaders.map((h, idx) => (idx === i ? val : h))
    setColHeaders(updated)
  }

  const updateCell = (rowId, colIdx, val) => {
    const updated = {
      ...cells,
      [rowId]: cells[rowId].map((v, i) => (i === colIdx ? val : v)),
    }
    setCells(updated)
    setSaved(false)
    persist(colHeaders, updated)
  }

  const canBuild = colHeaders.some(h => h.trim() !== '')

  return (
    <div className={`rounded-xl border-2 transition-all ${isAnswered ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'} shadow-sm`}>
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${isAnswered ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
            {isAnswered ? '✓' : '46'}
          </span>
          <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">א</span>
          <span className="text-xs text-gray-400">(7 נקודות)</span>
        </div>
        <p className="text-green-900 font-medium leading-relaxed" dir="rtl">
          הכן במחברתך טבלה לסיכום מערך הניסוי שערכת (חלק א1) ותוצאותיו (חלק א2).
        </p>
      </div>

      <div className="px-4 pb-4">
        {step === 1 ? (
          /* Step 1 – define column headers */
          <div dir="rtl">
            <p className="text-sm font-semibold text-green-800 mb-3">
              לפני מילוי הטבלה, הגדר את כותרות העמודות. העמודה הראשונה ("מבחנה") קבועה.
            </p>
            <div className="space-y-3">
              {/* Fixed first column */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-16 text-left shrink-0">עמודה 1</span>
                <input
                  type="text"
                  value="מבחנה"
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 text-sm cursor-not-allowed"
                  dir="rtl"
                />
              </div>
              {colHeaders.map((h, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-16 text-left shrink-0">עמודה {i + 2}</span>
                  <input
                    type="text"
                    value={h}
                    onChange={e => updateHeader(i, e.target.value)}
                    placeholder="כגון: גובה (ס״מ)"
                    className="flex-1 px-3 py-2 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none text-sm"
                    dir="rtl"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => { setStep(2); persist(colHeaders, cells) }}
              disabled={!canBuild}
              className="mt-4 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              בנה טבלה →
            </button>
          </div>
        ) : (
          /* Step 2 – fill in the table */
          <div>
            <div className="flex items-center justify-between mb-3" dir="rtl">
              <p className="text-sm text-green-700">מלא את הטבלה לפי תוצאות הניסוי שלך:</p>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-green-700 underline hover:text-green-900"
              >
                ערוך כותרות
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm" dir="rtl">
                <thead>
                  <tr className="bg-green-700 text-white">
                    <th className="border border-green-600 px-3 py-2 font-semibold w-24">מבחנה</th>
                    {colHeaders.map((h, i) => (
                      <th key={i} className="border border-green-600 px-3 py-2 font-semibold">
                        {h || <span className="text-green-300 font-normal text-xs">(ריק)</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((rowId, rowIdx) => (
                    <tr key={rowId} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
                      <td className="border border-green-200 px-3 py-1 text-center font-bold text-green-800">
                        {ROW_LABELS[rowId]}
                      </td>
                      {colHeaders.map((_, colIdx) => (
                        <td key={colIdx} className="border border-green-200 px-1 py-1">
                          <input
                            type="text"
                            value={cells[rowId]?.[colIdx] ?? ''}
                            onChange={e => updateCell(rowId, colIdx, e.target.value)}
                            className="w-full px-2 py-1.5 rounded bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-400 text-center"
                            dir="rtl"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-2 text-xs text-gray-400">
              {saving && <span className="text-blue-500 animate-pulse">שומר...</span>}
              {saved && <span className="text-green-600">✓ נשמר</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
