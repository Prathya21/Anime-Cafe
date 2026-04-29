import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './services/firebase'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import HabitTracker from './pages/HabitTracker'
import DailyJournal from './pages/DailyJournal'
import Goals from './pages/Goals'
import Wellness from './pages/Wellness'
import Food from './pages/Food'
import Finances from './pages/Finances'
import FocusZone from './pages/FocusZone'
import Moodboard from './pages/Moodboard'
import WatchRead from './pages/WatchRead'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading your cozy café...</p>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
        <Route path="/" element={<ProtectedRoute user={user}><Dashboard user={user} /></ProtectedRoute>} />
        <Route path="/habits" element={<ProtectedRoute user={user}><HabitTracker user={user} /></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute user={user}><DailyJournal user={user} /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute user={user}><Goals user={user} /></ProtectedRoute>} />
        <Route path="/wellness" element={<ProtectedRoute user={user}><Wellness user={user} /></ProtectedRoute>} />
        <Route path="/food" element={<ProtectedRoute user={user}><Food user={user} /></ProtectedRoute>} />
        <Route path="/finances" element={<ProtectedRoute user={user}><Finances user={user} /></ProtectedRoute>} />
        <Route path="/focus" element={<ProtectedRoute user={user}><FocusZone user={user} /></ProtectedRoute>} />
        <Route path="/moodboard" element={<ProtectedRoute user={user}><Moodboard user={user} /></ProtectedRoute>} />
        <Route path="/watchread" element={<ProtectedRoute user={user}><WatchRead user={user} /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App
