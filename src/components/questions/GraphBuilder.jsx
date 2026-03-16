import { useState, useEffect, useRef } from 'react'
import { saveAnswer } from '../../firebase/db'

// Graph data: X = light intensity, Y = CO2 absorbed
const X_VALUES  = [100, 250, 500, 1000, 1500]
const ZONE_A_Y  = [4.0, 7.5, 9.5, 12.0, 12.0]  // Expected (for reference)
const ZONE_B_Y  = [3.5, 6.0, 8.0,  9.5,  9.5]  // Expected

// SVG dimensions
const SVG_W  = 560
const SVG_H  = 380
const PAD_L  = 70
const PAD_R  = 30
const PAD_T  = 30
const PAD_B  = 60

const X_MAX  = 1600
const Y_MAX  = 14
const Y_STEP = 2

// Map data coords → SVG coords
const toSVG = (xVal, yVal) => ({
  x: PAD_L + ((xVal / X_MAX) * (SVG_W - PAD_L - PAD_R)),
  y: PAD_T + ((1 - yVal / Y_MAX) * (SVG_H - PAD_T - PAD_B)),
})

// Snap click to nearest X tick
const snapX = (svgX) => {
  const plotW = SVG_W - PAD_L - PAD_R
  const rawX  = ((svgX - PAD_L) / plotW) * X_MAX
  const closest = X_VALUES.reduce((a, b) => Math.abs(b - rawX) < Math.abs(a - rawX) ? b : a)
  return closest
}

const clampY = (svgY) => {
  const plotH = SVG_H - PAD_T - PAD_B
  const rawY  = (1 - (svgY - PAD_T) / plotH) * Y_MAX
  return Math.max(0, Math.min(Y_MAX, Math.round(rawY * 2) / 2)) // 0.5 precision
}

export default function GraphBuilder({ user, initialValue, onAnswered }) {
  const [zoneA, setZoneA] = useState({})  // { 100: 4.0, 250: 7.5, ... }
  const [zoneB, setZoneB] = useState({})
  const [title, setTitle]   = useState('')
  const [xLabel, setXLabel] = useState('')
  const [yLabel, setYLabel] = useState('')
  const [activeZone, setActiveZone] = useState('A')
  const svgRef = useRef(null)
  const debounceRef = useRef(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  useEffect(() => {
    if (initialValue) {
      if (initialValue.zoneA) setZoneA(initialValue.zoneA)
      if (initialValue.zoneB) setZoneB(initialValue.zoneB)
      if (initialValue.title)  setTitle(initialValue.title)
      if (initialValue.xLabel) setXLabel(initialValue.xLabel)
      if (initialValue.yLabel) setYLabel(initialValue.yLabel)
    }
  }, [initialValue])

  const isAnswered = Object.keys(zoneA).length > 0 || Object.keys(zoneB).length > 0

  useEffect(() => {
    onAnswered?.('q54b', isAnswered)
  }, [isAnswered]) // eslint-disable-line

  const persist = (newZoneA, newZoneB, newTitle, newXLabel, newYLabel) => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSaving(true)
      try {
        await saveAnswer(user.idNumber, 'q54b', {
          type: 'graph',
          value: { zoneA: newZoneA, zoneB: newZoneB, title: newTitle, xLabel: newXLabel, yLabel: newYLabel },
        })
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } catch(e) { console.error(e) }
      finally { setSaving(false) }
    }, 1200)
  }

  const handleSVGClick = (e) => {
    const rect = svgRef.current.getBoundingClientRect()
    const scaleX = SVG_W / rect.width
    const scaleY = SVG_H / rect.height
    const svgX = (e.clientX - rect.left) * scaleX
    const svgY = (e.clientY - rect.top)  * scaleY

    // Only inside plot area
    if (svgX < PAD_L || svgX > SVG_W - PAD_R || svgY < PAD_T || svgY > SVG_H - PAD_B) return

    const xVal = snapX(svgX)
    const yVal = clampY(svgY)

    if (activeZone === 'A') {
      const updated = { ...zoneA, [xVal]: yVal }
      setZoneA(updated)
      persist(updated, zoneB, title, xLabel, yLabel)
    } else {
      const updated = { ...zoneB, [xVal]: yVal }
      setZoneB(updated)
      persist(zoneA, updated, title, xLabel, yLabel)
    }
  }

  const removePoint = (zone, xVal) => {
    if (zone === 'A') {
      const updated = { ...zoneA }; delete updated[xVal]; setZoneA(updated)
      persist(updated, zoneB, title, xLabel, yLabel)
    } else {
      const updated = { ...zoneB }; delete updated[xVal]; setZoneB(updated)
      persist(zoneA, updated, title, xLabel, yLabel)
    }
  }

  const handleLabel = (setter, field) => (e) => {
    setter(e.target.value)
    const vals = { title, xLabel, yLabel, [field]: e.target.value }
    persist(zoneA, zoneB, vals.title, vals.xLabel, vals.yLabel)
  }

  // Build polyline points string
  const polylinePoints = (zone) => {
    const data = zone === 'A' ? zoneA : zoneB
    return X_VALUES
      .filter(x => data[x] !== undefined)
      .map(x => { const p = toSVG(x, data[x]); return `${p.x},${p.y}` })
      .join(' ')
  }

  // Y-axis ticks
  const yTicks = []
  for (let y = 0; y <= Y_MAX; y += Y_STEP) yTicks.push(y)

  // X-axis uniform grid lines every 100 units
  const xGridLines = []
  for (let x = 100; x <= 1400; x += 100) xGridLines.push(x)

  return (
    <div className={`rounded-xl border-2 transition-all ${isAnswered ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'} shadow-sm`}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${isAnswered ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
            {isAnswered ? '✓' : '54'}
          </span>
          <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">ב</span>
          <span className="text-xs text-gray-400">(7 נקודות)</span>
        </div>
        <p className="text-green-900 font-medium" dir="rtl">
          הצג בדרך גרפית את תוצאות הניסוי שבטבלה.
        </p>
        <p className="text-sm text-green-700 mt-1" dir="rtl">
          לחץ על הגרף כדי להוסיף נקודות עבור כל זן. בחר קודם את הזן הרצוי.
        </p>
      </div>

      <div className="px-4 pb-4 space-y-4">
        {/* Graph title input */}
        <div dir="rtl">
          <label className="block text-sm font-semibold text-green-800 mb-1">כותרת הגרף:</label>
          <input
            type="text"
            value={title}
            onChange={handleLabel(setTitle, 'title')}
            placeholder="כתב כותרת מתאימה לגרף..."
            className="w-full px-3 py-2 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none text-sm"
            dir="rtl"
          />
        </div>

        {/* Zone selector */}
        <div className="flex gap-3 items-center" dir="rtl">
          <span className="text-sm font-semibold text-green-800">בחר זן לסימון:</span>
          <button
            onClick={() => setActiveZone('A')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeZone === 'A' ? 'bg-green-500 text-white shadow-md' : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            <span className="w-3 h-3 rounded-full bg-green-600 inline-block" />
            זן א׳ (ירוק)
          </button>
          <button
            onClick={() => setActiveZone('B')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeZone === 'B' ? 'bg-purple-500 text-white shadow-md' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            <span className="w-3 h-3 rounded-full bg-purple-600 inline-block" />
            זן ב׳ (סגול-אדום)
          </button>
        </div>

        {/* Reference data */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs" dir="rtl">
          <strong className="text-blue-800">טבלה 1 – נתוני הניסוי לסימון:</strong>
          <table className="mt-2 w-full text-center border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-blue-200 px-2 py-1">עוצמת אור (יח׳ יחסיות)</th>
                <th className="border border-blue-200 px-2 py-1 text-green-700">זן א׳ – CO₂ (ירוק)</th>
                <th className="border border-blue-200 px-2 py-1 text-purple-700">זן ב׳ – CO₂ (סגול-אדום)</th>
              </tr>
            </thead>
            <tbody>
              {X_VALUES.map((x, i) => (
                <tr key={x} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                  <td className="border border-blue-200 px-2 py-1">{x}</td>
                  <td className="border border-blue-200 px-2 py-1 text-green-700">
                    {zoneA[x] !== undefined ? <strong>{zoneA[x]}</strong> : ZONE_A_Y[i]}
                  </td>
                  <td className="border border-blue-200 px-2 py-1 text-purple-700">
                    {zoneB[x] !== undefined ? <strong>{zoneB[x]}</strong> : ZONE_B_Y[i]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SVG Graph */}
        <div className="bg-white border-2 border-green-300 rounded-xl p-2 overflow-x-auto">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full cursor-crosshair select-none"
            onClick={handleSVGClick}
          >
            {/* Grid lines */}
            {yTicks.map(y => {
              const { x: x0, y: yy } = toSVG(0, y)
              const { x: x1 }        = toSVG(X_MAX, y)
              return (
                <g key={y}>
                  <line x1={PAD_L} y1={yy} x2={SVG_W - PAD_R} y2={yy}
                    stroke={y === 0 ? '#374151' : '#e5e7eb'} strokeWidth={y === 0 ? 1.5 : 1} />
                  <text x={PAD_L - 6} y={yy + 4} textAnchor="end" fontSize="11" fill="#6b7280">
                    {y}
                  </text>
                </g>
              )
            })}

            {/* X-axis uniform grid lines every 100 units */}
            {xGridLines.map(x => {
              const p = toSVG(x, 0)
              return (
                <line key={`xg-${x}`}
                  x1={p.x} y1={PAD_T} x2={p.x} y2={SVG_H - PAD_B}
                  stroke="#e5e7eb" strokeWidth="1" />
              )
            })}

            {/* X-axis ticks at data points (with labels) */}
            {X_VALUES.map(x => {
              const p = toSVG(x, 0)
              return (
                <g key={x}>
                  <line x1={p.x} y1={PAD_T} x2={p.x} y2={SVG_H - PAD_B}
                    stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4,3" />
                  <line x1={p.x} y1={SVG_H - PAD_B} x2={p.x} y2={SVG_H - PAD_B + 5} stroke="#374151" strokeWidth="1.5" />
                  <text x={p.x} y={SVG_H - PAD_B + 18} textAnchor="middle" fontSize="11" fill="#6b7280">
                    {x}
                  </text>
                </g>
              )
            })}

            {/* Axes */}
            <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={SVG_H - PAD_B} stroke="#374151" strokeWidth="2" />
            <line x1={PAD_L} y1={SVG_H - PAD_B} x2={SVG_W - PAD_R} y2={SVG_H - PAD_B} stroke="#374151" strokeWidth="2" />

            {/* Zone A polyline */}
            {Object.keys(zoneA).length > 1 && (
              <polyline
                points={polylinePoints('A')}
                fill="none"
                stroke="#16a34a"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            )}
            {/* Zone B polyline */}
            {Object.keys(zoneB).length > 1 && (
              <polyline
                points={polylinePoints('B')}
                fill="none"
                stroke="#9333ea"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeDasharray="6,3"
              />
            )}

            {/* Zone A points */}
            {X_VALUES.filter(x => zoneA[x] !== undefined).map(x => {
              const p = toSVG(x, zoneA[x])
              return (
                <g key={`a-${x}`}>
                  <circle cx={p.x} cy={p.y} r="7" fill="#16a34a" stroke="white" strokeWidth="2"
                    className="cursor-pointer hover:r-9"
                    onClick={e => { e.stopPropagation(); removePoint('A', x) }} />
                  <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fill="#15803d">
                    {zoneA[x]}
                  </text>
                </g>
              )
            })}

            {/* Zone B points */}
            {X_VALUES.filter(x => zoneB[x] !== undefined).map(x => {
              const p = toSVG(x, zoneB[x])
              return (
                <g key={`b-${x}`}>
                  <rect x={p.x - 6} y={p.y - 6} width="12" height="12" fill="#9333ea" stroke="white" strokeWidth="2"
                    className="cursor-pointer"
                    onClick={e => { e.stopPropagation(); removePoint('B', x) }} />
                  <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize="10" fill="#7e22ce">
                    {zoneB[x]}
                  </text>
                </g>
              )
            })}

            {/* Axis title placeholders */}
            <text
              x={(PAD_L + SVG_W - PAD_R) / 2}
              y={SVG_H - 8}
              textAnchor="middle"
              fontSize="12"
              fill={xLabel ? '#374151' : '#9ca3af'}
              fontWeight={xLabel ? '600' : '400'}
            >
              {xLabel || 'תווית ציר X'}
            </text>
            <text
              x={15}
              y={(PAD_T + SVG_H - PAD_B) / 2}
              textAnchor="middle"
              fontSize="12"
              fill={yLabel ? '#374151' : '#9ca3af'}
              fontWeight={yLabel ? '600' : '400'}
              transform={`rotate(-90, 15, ${(PAD_T + SVG_H - PAD_B) / 2})`}
            >
              {yLabel || 'תווית ציר Y'}
            </text>
          </svg>
          {/* Legend below SVG */}
          <div className="flex justify-center gap-6 mt-2 text-sm" dir="rtl">
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full bg-green-600" />
              <span className="text-gray-700">זן א׳ (ירוק)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-purple-600" />
              <span className="text-gray-700">זן ב׳ (סגול-אדום)</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-1">לחץ על נקודה קיימת כדי למחוק אותה</p>
        </div>

        {/* Axis labels */}
        <div className="grid grid-cols-2 gap-4" dir="rtl">
          <div>
            <label className="block text-sm font-semibold text-green-800 mb-1">תווית ציר X (אופקי):</label>
            <input
              type="text"
              value={xLabel}
              onChange={handleLabel(setXLabel, 'xLabel')}
              placeholder="כגון: זמן (שניות)"
              className="w-full px-3 py-2 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none text-sm"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-green-800 mb-1">תווית ציר Y (אנכי):</label>
            <input
              type="text"
              value={yLabel}
              onChange={handleLabel(setYLabel, 'yLabel')}
              placeholder="כגון: מהירות (מ/ש)"
              className="w-full px-3 py-2 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none text-sm"
              dir="rtl"
            />
          </div>
        </div>

        <div className="flex justify-end text-xs text-gray-400">
          {saving && <span className="text-blue-500 animate-pulse">שומר...</span>}
          {saved && <span className="text-green-600">✓ נשמר</span>}
        </div>
      </div>
    </div>
  )
}
