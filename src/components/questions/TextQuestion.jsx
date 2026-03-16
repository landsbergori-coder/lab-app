import { useState, useEffect, useRef } from 'react'
import { saveAnswer } from '../../firebase/db'

export default function TextQuestion({
  questionKey,
  number,
  points,
  subLabel = null,
  text,
  placeholder = 'כתב את תשובתך כאן...',
  hint = null,
  user,
  initialValue = '',
  onAnswered,
  minRows = 3,
}) {
  const [value, setValue] = useState(initialValue)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const debounceRef = useRef(null)
  const isAnswered = value.trim().length > 0

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    if (isAnswered) onAnswered?.(questionKey, true)
    else onAnswered?.(questionKey, false)
  }, [isAnswered, questionKey]) // eslint-disable-line

  const handleChange = (e) => {
    const v = e.target.value
    setValue(v)
    setSaved(false)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSaving(true)
      try {
        await saveAnswer(user.idNumber, questionKey, { type: 'text', value: v })
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } catch (err) {
        console.error('Save error:', err)
      } finally {
        setSaving(false)
      }
    }, 1500)
  }

  return (
    <div className={`rounded-xl border-2 transition-all duration-200 ${
      isAnswered ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
    } shadow-sm`}>
      {/* Question header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
              isAnswered ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              {isAnswered ? '✓' : number}
            </span>
            {subLabel && (
              <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                {subLabel}
              </span>
            )}
            <span className="text-xs text-gray-400">({points} נקודות)</span>
          </div>
          <p className="text-green-900 font-medium leading-relaxed pr-2" dir="rtl">
            {text}
          </p>
          {hint && (
            <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-800" dir="rtl">
              💡 {hint}
            </div>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className="px-4 pb-4">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={minRows}
          dir="rtl"
          className={`w-full px-3 py-2.5 rounded-lg border text-sm leading-relaxed resize-y transition-colors focus:outline-none ${
            isAnswered
              ? 'border-green-300 bg-white focus:border-green-500'
              : 'border-gray-200 bg-gray-50 focus:border-green-400'
          }`}
        />
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>{value.length} תווים</span>
          <span>
            {saving && <span className="text-blue-500 animate-pulse">שומר...</span>}
            {saved && <span className="text-green-600">✓ נשמר</span>}
          </span>
        </div>
      </div>
    </div>
  )
}
