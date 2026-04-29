import React, { useState, useEffect } from 'react'
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where, updateDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import Navbar from '../components/Navbar'
import { FiPlus, FiTrash2, FiCheck } from 'react-icons/fi'
import '../styles/pages.css'

const HabitTracker = ({ user }) => {
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState('')

  useEffect(() => {
    const q = query(collection(db, 'habits'), where('userId', '==', user.uid))
    const unsub = onSnapshot(q, (snap) => {
      setHabits(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [user.uid])

  const addHabit = async (e) => {
    e.preventDefault()
    if (!newHabit.trim()) return
    await addDoc(collection(db, 'habits'), {
      userId: user.uid,
      name: newHabit.trim(),
      completedDates: [],
      createdAt: new Date().toISOString()
    })
    setNewHabit('')
  }

  const toggleToday = async (habit) => {
    const today = new Date().toISOString().split('T')[0]
    const completed = habit.completedDates || []
    const updated = completed.includes(today)
      ? completed.filter(d => d !== today)
      : [...completed, today]
    await updateDoc(doc(db, 'habits', habit.id), { completedDates: updated })
  }

  const removeHabit = async (id) => {
    await deleteDoc(doc(db, 'habits', id))
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="page-layout">
      <Navbar user={user} />
      <div className="page-container">
        <h1 className="page-title">🎯 Habit Tracker</h1>
        <form onSubmit={addHabit} className="add-form">
          <input
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Add a new habit..."
            className="form-input"
          />
          <button type="submit" className="btn btn-primary"><FiPlus /> Add</button>
        </form>
        <div className="items-list">
          {habits.map(h => (
            <div key={h.id} className={`item-card ${(h.completedDates || []).includes(today) ? 'completed' : ''}`}>
              <div className="item-content">
                <button
                  onClick={() => toggleToday(h)}
                  className={`check-btn ${(h.completedDates || []).includes(today) ? 'checked' : ''}`}
                >
                  <FiCheck />
                </button>
                <span className="item-text">{h.name}</span>
                <span className="streak-badge">
                  🔥 {(h.completedDates || []).length} days
                </span>
              </div>
              <button onClick={() => removeHabit(h.id)} className="btn btn-danger"><FiTrash2 /></button>
            </div>
          ))}
          {habits.length === 0 && <p className="empty-state">No habits yet. Start building good habits! 🌱</p>}
        </div>
      </div>
    </div>
  )
}

export default HabitTracker
