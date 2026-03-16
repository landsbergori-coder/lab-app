export default function PartA({ user }) {
  return (
    <div className="space-y-6 fade-in">
      {/* Video */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-green-100">
        <div className="bg-gradient-to-l from-green-600 to-green-700 px-6 py-4 flex items-center gap-3">
          <span className="text-2xl">🎬</span>
          <div>
            <h2 className="text-white font-bold text-lg">סרטון הדגמה – ביצוע הניסוי</h2>
            <p className="text-green-200 text-sm">צפה בסרטון לפני תחילת הניסוי</p>
          </div>
        </div>
        <div className="p-4 bg-black">
          <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src="https://drive.google.com/file/d/1zWqgVR8qWKuVoADR0lJnx3nS4aWyYdGu/preview"
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              allow="autoplay"
              title="סרטון הניסוי - חלק א'"
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-2xl shadow-md border border-green-100">
        <div className="bg-gradient-to-l from-green-600 to-green-700 px-6 py-4 flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <div>
            <h2 className="text-white font-bold text-lg">הנחיות חלק א׳ – בדיקת תהליך הפוטוסינתזה בעלים</h2>
            <p className="text-green-200 text-sm">בעיה 4 | ביולוגיה מעשית</p>
          </div>
        </div>

        <div className="p-6 space-y-6 text-green-900" dir="rtl">
          <div className="bg-green-50 border-r-4 border-green-500 rounded-lg p-4">
            <p className="font-bold text-green-800 text-lg mb-1">בעיה 4</p>
            <p className="font-semibold">בבעיה זו תבדוק צמח שלו צבעוניים בכל עונות השנה.</p>
            <p className="text-sm mt-1">השאלות בשאלון זה ממוספרות במספרים <strong>46–59</strong>. מספר הנקודות לכל שאלה רשום לימינה. ענה על <strong>כל</strong> השאלות במחברת.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-green-800 mb-3 border-b border-green-200 pb-2">
              חלק א׳ – בדיקת תהליך הפוטוסינתזה בעלים
            </h3>
            <p className="mb-3">בחלק זה תבדוק את אחד הגורמים המשפיעים על תהליך הפוטוסינתזה בעלים.</p>
          </div>

          {/* Section A1 */}
          <div className="border border-green-200 rounded-xl overflow-hidden">
            <div className="bg-green-100 px-4 py-2 font-bold text-green-800">
              חלק א׳.1 – הכנת מערכת הניסוי
            </div>
            <div className="p-4 space-y-3">
              <p><span className="font-semibold text-green-700">א.</span> באמצעות עט לסימון זכוכית, סמן שלוש מבחנות באותיות א, ב, ג.</p>
              <p><span className="font-semibold text-green-700">ב.</span> על שולחנך כלי ובו תמיסת ביקרבונט (NaHCO₃) בריכוז 1%, וכלי ובו תמיסת נתרן ביקרבונט בריכוז 2%.</p>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                <strong>מלא את המבחנות א–ג בתמיסות הביקרבונט (אין צורך לדייק):</strong>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>מלא את מבחנה <strong>א</strong> בתמיסת נתרן ביקרבונט <strong>בריכוז 1%</strong></li>
                  <li>מלא את מבחנות <strong>ב, ג</strong> בתמיסת נתרן ביקרבונט <strong>בריכוז 2%</strong></li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <strong>💡 לידיעתך:</strong> תמיסה מימית של נתרן ביקרבונט היא מקור של פחמן דו-חמצני לצמח.
              </div>

              {/* Two-column table */}
              <div className="mt-4">
                <p className="font-semibold mb-2 text-green-800">על שולחנך עלים של צמח. עבד לפי ההנחיות:</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-2 border-green-300 rounded-xl p-4 bg-green-50">
                    <h4 className="font-bold text-green-800 text-center mb-3 pb-2 border-b border-green-300">
                      🟢 יהודי נודד
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>יב.</strong> על שולחנך עלי ומכתש. החזק עלה אחד מעל המכתש וגזור אותו בעזרת מספריים לחתיכות קטנות.</li>
                      <li>• גזור גם את חתיכות העלים שנותרו מסעיף ג.</li>
                      <li>• <strong>יג.</strong> כתוש את חתיכות העלים שבמכתש.</li>
                      <li>• <strong>יד.</strong> על שולחנך מבחנה המסומנת "אתנול" ובה תמיסת אתנול, וכלי ובו מי ברז.</li>
                    </ul>
                  </div>
                  <div className="border-2 border-purple-300 rounded-xl p-4 bg-purple-50">
                    <h4 className="font-bold text-purple-800 text-center mb-3 pb-2 border-b border-purple-300">
                      🟣 אחירנטוס / שזיף פיסרדי
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>יב.</strong> על שולחנך עלי ומכתש. החזק 5 עלים מעל המכתש וגזור אותם בעזרת מספריים לחתיכות קטנות.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section A2 */}
          <div className="border border-green-200 rounded-xl overflow-hidden">
            <div className="bg-green-100 px-4 py-2 font-bold text-green-800">
              חלק א׳.2 – בדיקת תוצאות הפוטוסינתזה בעלים
            </div>
            <div className="p-4 space-y-3 text-sm">
              <p><span className="font-semibold text-green-700">יט.</span> אם לא עברו 15 דקות מהשעה שרשמת בסעיף יא, המתן עד לתום הזמן הנדרש.</p>
              <p>לאחר שעברו 15 דקות (או יותר) כבה את המנורה ובדוק יסתיים חלק א של הניסוי.</p>
              <p>סמן את המקום של קו הנוזל בכל אחת מהפיפטות המחוברות למבחנות א–ג.</p>
              <p>מדוד באמצעות סרגל את המרחק בין שני הקווים (התחלתי וסופי) של הפיפטה של כל אחת מהמבחנות, ורשום אותו:</p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1">
                <p>המרחק בין שני הקווים של הפיפטה המחוברת למבחנה א: _______ ס"מ</p>
                <p>המרחק בין שני הקווים של הפיפטה המחוברת למבחנה ב: _______ ס"מ</p>
                <p>המרחק בין שני הקווים של הפיפטה המחוברת למבחנה ג: _______ ס"מ</p>
              </div>

              <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 mt-3">
                <p className="font-bold text-amber-800">⏱️ עליך להמתין לפחות 15 דקות. בזמן ההמתנה המשך לחלק ב.</p>
                <p className="text-amber-700 text-xs mt-1">בסיום עבודתך בחלק ב תעבור לחלק א2 לסיים.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
