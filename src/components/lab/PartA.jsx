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
            <div className="p-4 space-y-3 text-sm">
              <p><span className="font-semibold text-green-700">א.</span> באמצעות עט לסימון זכוכית, סמן שלוש מבחנות באותיות א, ב, ג.</p>
              <p><span className="font-semibold text-green-700">ב.</span> על שולחנך כלי ובו תמיסת נתרן ביקרבונט (NaHCO₃) בריכוז 1%, וכלי ובו תמיסת נתרן ביקרבונט בריכוז 2%.</p>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="font-semibold mb-1">מלא את המבחנות א–ג בתמיסות הביקרבונט (אין צורך לדייק):</p>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>מלא את מבחנה <strong>א</strong> בתמיסת נתרן ביקרבונט בריכוז <strong>1%</strong></li>
                  <li>מלא את מבחנות <strong>ב, ג</strong> בתמיסת נתרן ביקרבונט בריכוז <strong>2%</strong></li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p><strong>💡 לידיעתך:</strong> תמיסה מימית של נתרן ביקרבונט היא מקור של פחמן דו-חמצני לצמח.</p>
              </div>

              <p><span className="font-semibold text-green-700">ג.</span> על שולחנך שתי צלחות לשימוש חד-פעמי. סמן אותן באותיות א-ב.</p>

              {/* Leaf strip preparation */}
              <div className="mt-3">
                <p className="font-semibold mb-2 text-green-800">על שולחנך עלים של צמח. עבד לפי ההנחיות:</p>
                <div className="border-2 border-green-300 rounded-xl p-4 bg-green-50">
                  <div className="space-y-2 text-xs">
                    <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
                      💡 את סעיפים א–יא תוכל לראות בסרטון ההדגמה למעלה.
                    </div>
                    <p><strong>ד.</strong> הכן שתי רצועות של עלה ברוחב כ-1 ס"מ ובאורך כולל של 12 ס"מ. הצוּר באיורים I–IV ופעל כך:</p>
                    <ul className="space-y-1 list-disc list-inside mr-2">
                      <li>בחר את העלה הגדול ביותר והנח אותו על נייר מגבת. הנח את הסרגל ביותר בקצה העליון של העלה במקום שרוחבו הוא 2 ס"מ. בעזרת סכין חתוך את העלה לרוחבו.</li>
                      <li>חזור על הפעולה בקצה האחר של העלה.</li>
                      <li>הנח את הסרגל במרכז גדלות העלה לאורכו. חתוך את העלה לאורך הסרגל כך שתקבל שתי רצועות ארוכות של עלה.</li>
                      <li>רצועה אחת הנח בצלחת א ורצועה שנייה – בצלחת ב.</li>
                      <li>רשום את אורך הרצועות שהכנת: _____ ס"מ.</li>
                    </ul>
                    <p className="mt-2"><strong>ה.</strong> אם הרצועה שהכנת קצרה מ-12 ס"מ, חזור על ההוראות בסעיף ד: הכן רצועות נוספות ברוחב כ-1 ס"מ ובאורך שהכנת קודם לכ-13 ס"מ.</p>
                    <ul className="space-y-1 list-disc list-inside mr-2">
                      <li>הוסף רצועה אחת לצלחת א, ואת הרצועה האחרת לצלחת ב.</li>
                      <li>הנח את שתי הרצועות שבצלחות על נייר המגבת. הנח את הקצה של אחת הרצועות על הרצועה האחרת, וחבר אותן זו לזו באמצעות "מהדק מסרדי" (שדכן). הקפד שהסיכה תמוקם לאורך הרצועות.</li>
                      <li>באותו אופן חבר את שתי הרצועות שבצלחת ב.</li>
                      <li>שמור את חלקי העלים הגזורים להמשך העבודה.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p><span className="font-semibold text-green-700">ו.</span> הכנס כל אחת מהרצועות שהכנת לפי ההוראות בסעיף ד-ה את הרצועה לכל אחת מהמבחנות א-ב. אם הרצועות העלים "נשברות", התעלם מכך.</p>
              <p className="bg-yellow-50 border border-yellow-200 rounded p-2"><strong>אל</strong> תכניס רצועות עלה למבחנה ג.</p>

              <p><span className="font-semibold text-green-700">ז.</span> הוסף למבחנה א תמיסת נתרן ביקרבונט בריכוז 1% עד שהמבחנה תהיה מלאה לגמרי.</p>
              <p><span className="font-semibold text-green-700">ח.</span> לרשותך פקק שבכל אחד מהם נועצה מחט המחוברת לפיפטה באמצעות צינורית גומי. פרוס נייר מגבת על השולחן. הוצא את מבחנה א מעל כלי הפסולת, ופקוק אותה היטב בפקק המחובר לפיפטה, כך שכמות מהנוזל שבה תעבור דרך הצינורית אל הפיפטה.</p>
              <div className="bg-gray-50 border border-gray-200 rounded p-2 text-xs">הנוזל שנשפך מהמבחנה אינו מסוכן למגע. הנח את המבחנה הפקוקה על נייר מגבת.</div>
              <p><span className="font-semibold text-green-700">ט.</span> אם אינך רואה את קו הנוזל בפיפטה, הרם את המבחנה ושחרר את הפקק ממנה, הוסף תמיסת ביקרבונט 1%, ושוב הדק היטב את הפקק.</p>
              <p><span className="font-semibold text-green-700">י.</span> הוסף למבחנות ב ו-ג תמיסת נתרן ביקרבונט בריכוז 2% עד שהמבחנות יהיו מלאות לגמרי. חזור על ההוראות בסעיפים ח-ט עם מבחנות ב-ג ועם תמיסת נתרן ביקרבונט בריכוז 2%. הנח את שלוש המבחנות על נייר המגבת בצורה שהעלים בשתי המבחנות יפנו כלפי מעלה באופן דומה ככל האפשר.</p>
              <p><span className="font-semibold text-green-700">יא.</span> כוון את המנורה כך שהמרחק בין המנורה לבין המבחנות יהיה כ-10 ס"מ והדלק אותה. על המנורה לאייר מלמעלה את כל המבחנות באופן אחיד.</p>
              <ul className="list-disc list-inside mr-4 space-y-1">
                <li>המתן 3 דקות להתייצבות מערכת הניסוי.</li>
                <li>כעבור 3 דקות סמן על כל פיפטה, בעזרת עט לרישום על זכוכית, את המקום של קו הנוזל. זהו קו הנוזל ההתחלתי.</li>
                <li>רשום את השעה: _______</li>
              </ul>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
                <p><strong>💡 לידיעתך:</strong> פליטת גז במבחנה גורמת לדחיקת הנוזל מהמבחנה אל הפיפטה, על כן יש התקדמות של קו הנוזל בפיפטה.</p>
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
