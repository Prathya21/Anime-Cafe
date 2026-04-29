import React, { useState, useEffect, useRef } from 'react'
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../services/firebase'
import Navbar from '../components/Navbar'
import { FiPlay, FiPause, FiRotateCcw, FiClock } from 'react-icons/fi'
import '../styles/pages.css'

const FocusZone = ({ user }) => {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [sessions, setSessions] = useState([])
  const [customTime, setCustomTime] = useState(25)
  const intervalRef = useRef(null)

  useEffect(() => {
    const q = query(collection(db, 'focusSessions'), where('userId', '==', user.uid))
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      data.sort((a, b) => b.createdAt?.localeCompare(a.createdAt))
      setSessions(data)
    })
    return () => unsub()
  }, [user.uid])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev === 0) {
            setMinutes(prevMin => {
              if (prevMin === 0) {
                clearInterval(intervalRef.current)
                setIsRunning(false)
                handleSessionComplete()
                return 0
              }
              return prevMin - 1
            })
            return 59
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  const handleSessionComplete = async () => {
    if (!isBreak) {
      await addDoc(collection(db, 'focusSessions'), {
        userId: user.uid,
        duration: customTime,
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      })
    }
    // Switch between work and break
    if (isBreak) {
      setMinutes(customTime)
      setIsBreak(false)
    } else {
      setMinutes(5)
      setIsBreak(true)
    }
    setSeconds(0)
  }

  const toggleTimer = () => setIsRunning(!isRunning)

  const resetTimer = () => {
    setIsRunning(false)
    clearInterval(intervalRef.current)
    setMinutes(isBreak ? 5 : customTime)
    setSeconds(0)
  }

  const setPreset = (mins) => {
    setCustomTime(mins)
    setMinutes(mins)
    setSeconds(0)
    setIsRunning(false)
    setIsBreak(false)
    clearInterval(intervalRef.current)
  }

  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0)

  return (
    <div className="page-layout">
      <Navbar user={user} />
      <div className="page-container focus-page">
        <h1 className="page-title">⏱️ Focus Zone</h1>
        <div className="timer-container">
          <div className={`timer-circle ${isRunning ? 'active' : ''} ${isBreak ? 'break' : ''}`}>
            <span className="timer-label">{isBreak ? '☕ Break' : '🎯 Focus'}</span>
            <span className="timer-display">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
          <div className="timer-controls">
            <button onClick={toggleTimer} className="btn btn-primary timer-btn">
              {isRunning ? <><FiPause /> Pause</> : <><FiPlay /> Start</>}
            </button>
            <button onClick={resetTimer} className="btn btn-secondary timer-btn">
              <FiRotateCcw /> Reset
            </button>
          </div>
          <div className="timer-presets">
            {[15, 25, 45, 60].map(t => (
              <button key={t} onClick={() => setPreset(t)} className={`preset-btn ${customTime === t ? 'active' : ''}`}>
                {t}m
              </button>
            ))}
          </div>
        </div>
        <div className="focus-stats">
          <div className="summary-card">
            <h3><FiClock /> Total Focus Time</h3>
            <p className="summary-amount">{totalMinutes} minutes</p>
            <small>{sessions.length} sessions completed</small>
          </div>
        </div>
        <div className="items-list">
          <h3>Session History</h3>
          {sessions.slice(0, 10).map(s => (
            <div key={s.id} className="item-card">
              <div className="item-content">
                <span>🎯 {s.duration} min session</span>
                <span className="item-date">{new Date(s.completedAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
          {sessions.length === 0 && <p className="empty-state">Start your first focus session! 🧠</p>}
        </div>
      </div>
    </div>
  )
}

export default FocusZone
