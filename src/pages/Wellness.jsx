import React, { useState, useEffect } from 'react'
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../services/firebase'
import Navbar from '../components/Navbar'
import { FiPlus, FiDroplet, FiMoon, FiSmile } from 'react-icons/fi'
import '../styles/pages.css'

const moodEmojis = ['😊', '😐', '😢', '😡', '😴', '🤩', '😰']

const Wellness = ({ user }) => {
  const [logs, setLogs] = useState([])
  const [water, setWater] = useState(0)
  const [sleep, setSleep] = useState('')
  const [mood, setMood] = useState('')

  useEffect(() => {
    const q = query(collection(db, 'wellness'), where('userId', '==', user.uid))
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      data.sort((a, b) => b.date?.localeCompare(a.date))
      setLogs(data)
    })
    return () => unsub()
  }, [user.uid])

  const logWellness = async (e) => {
    e.preventDefault()
    await addDoc(collection(db, 'wellness'), {
      userId: user.uid,
      water,
      sleep: parseFloat(sleep) || 0,
      mood,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    })
    setWater(0)
    setSleep('')
    setMood('')
  }

  return (
    <div className="page-layout">
      <Navbar user={user} />
      <div className="page-container">
        <h1 className="page-title">💆 Wellness Tracker</h1>
        <form onSubmit={logWellness} className="add-form wellness-form">
          <div className="wellness-input-group">
            <label><FiDroplet /> Water (glasses)</label>
            <div className="water-counter">
              <button type="button" onClick={() => setWater(Math.max(0, water - 1))} className="btn btn-sm">-</button>
              <span className="water-count">{water} 💧</span>
              <button type="button" onClick={() => setWater(water + 1)} className="btn btn-sm">+</button>
            </div>
          </div>
          <div className="wellness-input-group">
            <label><FiMoon /> Sleep (hours)</label>
            <input type="number" value={sleep} onChange={(e) => setSleep(e.target.value)} placeholder="8" step="0.5" className="form-input" />
          </div>
          <div className="wellness-input-group">
            <label><FiSmile /> Mood</label>
            <div className="mood-selector">
              {moodEmojis.map(emoji => (
                <button type="button" key={emoji} onClick={() => setMood(emoji)} className={`mood-btn ${mood === emoji ? 'selected' : ''}`}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary"><FiPlus /> Log Today</button>
        </form>
        <div className="items-list">
          {logs.map(log => (
            <div key={log.id} className="item-card wellness-card">
              <div className="item-content wellness-display">
                <span className="wellness-date">{log.date}</span>
                <span>💧 {log.water} glasses</span>
                <span>🌙 {log.sleep}h sleep</span>
                <span className="mood-display">{log.mood}</span>
              </div>
            </div>
          ))}
          {logs.length === 0 && <p className="empty-state">Start tracking your wellness journey! 🌿</p>}
        </div>
      </div>
    </div>
  )
}

export default Wellness
