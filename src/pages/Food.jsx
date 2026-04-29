import React, { useState, useEffect } from 'react'
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../services/firebase'
import Navbar from '../components/Navbar'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import '../styles/pages.css'

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

const Food = ({ user }) => {
  const [meals, setMeals] = useState([])
  const [name, setName] = useState('')
  const [mealType, setMealType] = useState('Breakfast')
  const [calories, setCalories] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const q = query(collection(db, 'food'), where('userId', '==', user.uid))
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      data.sort((a, b) => b.createdAt?.localeCompare(a.createdAt))
      setMeals(data)
    })
    return () => unsub()
  }, [user.uid])

  const addMeal = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    await addDoc(collection(db, 'food'), {
      userId: user.uid,
      name: name.trim(),
      mealType,
      calories: parseInt(calories) || 0,
      notes: notes.trim(),
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    })
    setName('')
    setCalories('')
    setNotes('')
  }

  const deleteMeal = async (id) => {
    await deleteDoc(doc(db, 'food', id))
  }

  const todayMeals = meals.filter(m => m.date === new Date().toISOString().split('T')[0])
  const todayCalories = todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0)

  return (
    <div className="page-layout">
      <Navbar user={user} />
      <div className="page-container">
        <h1 className="page-title">🍱 Food Log</h1>
        <div className="calorie-summary">Today's calories: <strong>{todayCalories} kcal</strong></div>
        <form onSubmit={addMeal} className="add-form">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="What did you eat?" className="form-input" />
          <select value={mealType} onChange={(e) => setMealType(e.target.value)} className="form-input">
            {mealTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="Calories" className="form-input" />
          <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes..." className="form-input" />
          <button type="submit" className="btn btn-primary"><FiPlus /> Log Meal</button>
        </form>
        <div className="items-list">
          {meals.map(meal => (
            <div key={meal.id} className="item-card">
              <div className="item-content">
                <h3>{meal.name}</h3>
                <div className="meal-details">
                  <span className="meal-type-badge">{meal.mealType}</span>
                  <span>{meal.calories} kcal</span>
                  <span className="item-date">{meal.date}</span>
                </div>
                {meal.notes && <p className="meal-notes">{meal.notes}</p>}
              </div>
              <button onClick={() => deleteMeal(meal.id)} className="btn btn-danger"><FiTrash2 /></button>
            </div>
          ))}
          {meals.length === 0 && <p className="empty-state">Log your first meal! 🍜</p>}
        </div>
      </div>
    </div>
  )
}

export default Food
