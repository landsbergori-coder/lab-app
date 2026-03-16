import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from './config'

// ─── Students ───────────────────────────────────────────────────────────────

export async function getOrCreateStudent(name, idNumber) {
  const ref = doc(db, 'students', idNumber)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, { name, idNumber, createdAt: serverTimestamp() })
  }
  return snap.data() ?? { name, idNumber }
}

// ─── Submissions ─────────────────────────────────────────────────────────────

export async function getSubmission(idNumber) {
  const ref = doc(db, 'submissions', idNumber)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function createSubmission(idNumber, studentName) {
  const ref = doc(db, 'submissions', idNumber)
  const data = {
    studentId: idNumber,
    studentName,
    startTime: serverTimestamp(),
    endTime: null,
    timePerPart: { A: 0, B: 0, C: 0 },
    answers: {},
    scores: {},
    totalScore: null,
    maxScore: 95,
    submitted: false,
    graded: false,
    teacherNotes: '',
  }
  await setDoc(ref, data)
  return data
}

export async function saveAnswer(idNumber, questionKey, value) {
  const ref = doc(db, 'submissions', idNumber)
  await updateDoc(ref, {
    [`answers.${questionKey}`]: value,
  })
}

export async function savePartTime(idNumber, part, seconds) {
  const ref = doc(db, 'submissions', idNumber)
  await updateDoc(ref, {
    [`timePerPart.${part}`]: seconds,
  })
}

export async function submitSubmission(idNumber, scores, totalScore) {
  const ref = doc(db, 'submissions', idNumber)
  await updateDoc(ref, {
    submitted: true,
    graded: true,
    endTime: serverTimestamp(),
    scores,
    totalScore,
  })
}

// ─── Teacher ─────────────────────────────────────────────────────────────────

export async function getAllSubmissions() {
  const q = query(collection(db, 'submissions'), orderBy('startTime', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function updateTeacherNotes(idNumber, notes) {
  const ref = doc(db, 'submissions', idNumber)
  await updateDoc(ref, { teacherNotes: notes })
}

export async function deleteStudent(idNumber) {
  await deleteDoc(doc(db, 'students', idNumber))
  await deleteDoc(doc(db, 'submissions', idNumber))
}

export async function unsubmitSubmission(idNumber) {
  const ref = doc(db, 'submissions', idNumber)
  await updateDoc(ref, {
    submitted: false,
    graded: false,
    scores: {},
    totalScore: null,
    endTime: null,
  })
}

export async function updateQuestionScore(idNumber, questionKey, points, explanation) {
  const ref = doc(db, 'submissions', idNumber)
  // Recalculate total
  const snap = await getDoc(ref)
  const data = snap.data()
  const updatedScores = {
    ...data.scores,
    [questionKey]: { ...data.scores[questionKey], points, explanation },
  }
  const total = Object.values(updatedScores).reduce((s, v) => s + (v.points || 0), 0)
  await updateDoc(ref, {
    [`scores.${questionKey}`]: { points, explanation },
    totalScore: Math.round(total * 10) / 10,
  })
}
