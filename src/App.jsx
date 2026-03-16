import { useState, useEffect } from 'react'
import StudentLogin from './components/auth/StudentLogin'
import TeacherLogin from './components/auth/TeacherLogin'
import LabLayout from './components/lab/LabLayout'
import TeacherDashboard from './components/teacher/TeacherDashboard'

export default function App() {
  const [user, setUser] = useState(null)
  const [showTeacherLogin, setShowTeacherLogin] = useState(false)

  // Restore session from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('labUser')
    if (saved) {
      try { setUser(JSON.parse(saved)) } catch {}
    }
  }, [])

  const loginStudent = (studentData) => {
    const u = { ...studentData, role: 'student' }
    setUser(u)
    sessionStorage.setItem('labUser', JSON.stringify(u))
  }

  const loginTeacher = () => {
    const u = { role: 'teacher', name: 'מורה' }
    setUser(u)
    sessionStorage.setItem('labUser', JSON.stringify(u))
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('labUser')
    setShowTeacherLogin(false)
  }

  if (!user) {
    return showTeacherLogin
      ? <TeacherLogin onLogin={loginTeacher} onBack={() => setShowTeacherLogin(false)} />
      : <StudentLogin onLogin={loginStudent} onShowTeacher={() => setShowTeacherLogin(true)} />
  }

  if (user.role === 'teacher') {
    return <TeacherDashboard onLogout={logout} />
  }

  return <LabLayout user={user} onLogout={logout} />
}
