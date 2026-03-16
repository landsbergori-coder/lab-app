# הוראות הגדרה ופריסה – מעבדה יבשה

## שלב 1: התקנת Node.js

1. לך ל: https://nodejs.org
2. הורד והתקן את הגרסה LTS (הירוקה)
3. לאחר ההתקנה, פתח Terminal/PowerShell ובדוק: `node -v`

---

## שלב 2: יצירת פרויקט Firebase

1. לך ל: https://console.firebase.google.com
2. לחץ **"Add project"** → תן שם → המשך
3. בצד שמאל: **Build → Firestore Database → Create database**
   - בחר **"Start in test mode"** (לתקופת הפיתוח)
   - בחר אזור: `europe-west3` (פרנקפורט)
4. בצד שמאל: **Project Settings** (גלגל שיניים) → **Your apps**
5. לחץ על סמל הווב `</>` → תן שם → לחץ **Register app**
6. **העתק את ה-firebaseConfig** שמופיע

---

## שלב 3: עדכון Firebase config

פתח את הקובץ: `src/firebase/config.js`

החלף את הערכים:
```js
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
}
```

---

## שלב 4: הגדרת Firestore Rules

ב-Firebase Console → Firestore → Rules, הדבק:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

(לאחר מכן – לאחר הפיתוח – שנה לכללים מאובטחים יותר)

---

## שלב 5: התקנת תלויות

פתח Terminal בתיקיית `lab-app`:

```bash
npm install
```

---

## שלב 6: הרצה מקומית

```bash
npm run dev
```

פתח את הדפדפן בכתובת שמופיעה (בד"כ http://localhost:5173)

---

## שלב 7: פריסה ב-Netlify

### 7א: יצירת חשבון Netlify
לך ל: https://netlify.com → הירשם (חינמי)

### 7ב: העלאה לGitHub (מומלץ)
1. צור repository חדש ב-GitHub
2. העלה את תיקיית `lab-app`:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/lab-app.git
   git push -u origin main
   ```

### 7ג: חיבור Netlify ל-GitHub
1. ב-Netlify Dashboard → **Add new site → Import from Git**
2. בחר GitHub → בחר את ה-repository
3. הגדרות build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### 7ד: הגדרת Environment Variables ב-Netlify
ב-Netlify → Site settings → Environment variables → הוסף:

```
ANTHROPIC_API_KEY = sk-ant-... (המפתח שלך מ-Anthropic Console)
```

> לקבל מפתח API: https://console.anthropic.com

### 7ה: Deploy!
לחץ **Deploy site** – האתר יהיה פעיל בעוד כמה דקות.

---

## סיסמת מורה
- הסיסמה הנוכחית: `bio2014`
- לשינוי: ערוך שורה 3 ב-`src/components/auth/TeacherLogin.jsx`

---

## שאלות נפוצות

**ש: הגרף לא נשמר?**
ת: בדוק שFirebase מחובר (ב-config.js)

**ש: הבדיקה עם AI לא עובדת?**
ת: בדוק שמפתח ANTHROPIC_API_KEY הוגדר ב-Netlify

**ש: כיצד לשנות את סיסמת המורה?**
ת: ערוך `TEACHER_PASSWORD` ב-`src/components/auth/TeacherLogin.jsx`
