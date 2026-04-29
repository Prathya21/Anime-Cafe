import React, { useState, useEffect } from 'react'
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../services/firebase'
import { FiSun, FiCloud, FiDroplet, FiPlus, FiTrash2, FiCheck } from 'react-icons/fi'

const affirmations = [
  "You're doing amazing, keep going! 🌸",
  "Every small step counts towards your dreams ✨",
  "Be gentle with yourself today 🍃",
  "You are worthy of rest and joy 🌙",
  "Today is full of possibilities 🌈",
  "Your effort matters, even when unseen 💫",
  "Breathe in calm, breathe out stress 🍵",
  "You're stronger than you think 🌻",
  "Embrace progress, not perfection 🦋",
  "The café of life serves you good things ☕"
]

const WeatherWidget = () => {
  const [weather, setWeather] = useState({ temp: '22°C', condition: 'Partly Cloudy', icon: 'cloud' })

  // Mock weather - replace with real API if desired
  const weatherIcons = {
    sun: <FiSun />,
    cloud: <FiCloud />,
    rain: <FiDroplet />
  }

  return (
    <div className="sidebar-widget weather-widget">
      <h3>🌤 Weather</h3>
      <div className="weather-display">
        <span className="weather-icon">{weatherIcons[weather.icon]}</span>
        <span className="weather-temp">{weather.temp}</span>
      </div>
      <p className="weather-condition">{weather.condition}</p>
    </div>
  )
}

const AffirmationsWidget = () => {
  const [affirmation, setAffirmation] = useState('')

  useEffect(() => {
    setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)])
  }, [])

  const shuffle = () => {
    setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)])
  }

  return (
    <div className="sidebar-widget affirmations-widget" onClick={shuffle}>
      <h3>💭 Daily Affirmation</h3>
      <p className="affirmation-text">{affirmation}</p>
      <small>Click to shuffle</small>
    </div>
  )
}

const PlannerWidget = ({ userId }) => {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    if (!userId) return
    const q = query(collection(db, 'plannerTasks'), where('userId', '==', userId))
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [userId])

  const addTask = async (e) => {
    e.preventDefault()
    if (!newTask.trim()) return
    await addDoc(collection(db, 'plannerTasks'), {
      userId,
      text: newTask.trim(),
      done: false,
      createdAt: new Date().toISOString()
    })
    setNewTask('')
  }

  const removeTask = async (id) => {
    await deleteDoc(doc(db, 'plannerTasks', id))
  }

  return (
    <div className="sidebar-widget planner-widget">
      <h3>📋 Daily Planner</h3>
      <form onSubmit={addTask} className="planner-form">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a task..."
          className="planner-input"
        />
        <button type="submit" className="planner-add-btn"><FiPlus /></button>
      </form>
      <ul className="planner-list">
        {tasks.map(t => (
          <li key={t.id} className="planner-item">
            <span>{t.text}</span>
            <button onClick={() => removeTask(t.id)} className="planner-del-btn"><FiTrash2 /></button>
          </li>
        ))}
      </ul>
    </div>
  )
}

const Sidebar = ({ userId }) => {
  return (
    <aside className="left-sidebar">
      <WeatherWidget />
      <AffirmationsWidget />
      <PlannerWidget userId={userId} />
    </aside>
  )
}

export default Sidebar
