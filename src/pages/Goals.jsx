import React, { useState, useEffect } from 'react'
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where, updateDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import Navbar from '../components/Navbar'
import { FiPlus, FiTrash2, FiTarget } from 'react-icons/fi'
import '../styles/pages.css'

const Goals = ({ user }) => {
  const [goals, setGoals] = useState([])
  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState('')
  const [milestones, setMilestones] = useState('')

  useEffect(() => {
    const q = query(collection(db, 'goals'), where('userId', '==', user.uid))
    const unsub = onSnapshot(q, (snap) => {
      setGoals(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [user.uid])

  const addGoal = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    await addDoc(collection(db, 'goals'), {
      userId: user.uid,
      title: title.trim(),
      deadline,
      milestones: milestones.split(',').map(m => ({ text: m.trim(), done: false })).filter(m => m.text),
      progress: 0,
      createdAt: new Date().toISOString()
    })
    setTitle('')
    setDeadline('')
    setMilestones('')
  }

  const toggleMilestone = async (goal, index) => {
    const updated = [...goal.milestones]
    updated[index].done = !updated[index].done
    const doneCount = updated.filter(m => m.done).length
    const progress = updated.length > 0 ? Math.round((doneCount / updated.length) * 100) : 0
    await updateDoc(doc(db, 'goals', goal.id), { milestones: updated, progress })
  }

  const deleteGoal = async (id) => {
    await deleteDoc(doc(db, 'goals', id))
  }

  return (
    <div className="page-layout">
      <Navbar user={user} />
      <div className="page-container">
        <h1 className="page-title">🏆 Goals & Milestones</h1>
        <form onSubmit={addGoal} className="add-form">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Goal title..." className="form-input" />
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="form-input" />
          <input value={milestones} onChange={(e) => setMilestones(e.target.value)} placeholder="Milestones (comma-separated)" className="form-input" />
          <button type="submit" className="btn btn-primary"><FiPlus /> Add Goal</button>
        </form>
        <div className="items-list">
          {goals.map(goal => (
            <div key={goal.id} className="item-card goal-card">
              <div className="item-content">
                <h3><FiTarget /> {goal.title}</h3>
                {goal.deadline && <small className="item-date">Deadline: {goal.deadline}</small>}
                <div className="progress-container">
                  <div className="progress-bar-outer">
                    <div className="progress-bar-inner" style={{ width: `${goal.progress || 0}%` }}></div>
                  </div>
                  <span className="progress-text">{goal.progress || 0}%</span>
                </div>
                <ul className="milestone-list">
                  {(goal.milestones || []).map((m, i) => (
                    <li key={i} className={`milestone ${m.done ? 'done' : ''}`} onClick={() => toggleMilestone(goal, i)}>
                      <span className="milestone-check">{m.done ? '✅' : '⬜'}</span> {m.text}
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={() => deleteGoal(goal.id)} className="btn btn-danger"><FiTrash2 /></button>
            </div>
          ))}
          {goals.length === 0 && <p className="empty-state">Set your first goal! Dream big 🌟</p>}
        </div>
      </div>
    </div>
  )
}

export default Goals
