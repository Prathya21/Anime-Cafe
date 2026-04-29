import React, { useState, useEffect } from 'react'
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../services/firebase'
import Navbar from '../components/Navbar'
import { FiPlus, FiTrash2, FiDollarSign } from 'react-icons/fi'
import '../styles/pages.css'

const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Other']

const Finances = ({ user }) => {
  const [expenses, setExpenses] = useState([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')

  useEffect(() => {
    const q = query(collection(db, 'finances'), where('userId', '==', user.uid))
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      data.sort((a, b) => b.createdAt?.localeCompare(a.createdAt))
      setExpenses(data)
    })
    return () => unsub()
  }, [user.uid])

  const addExpense = async (e) => {
    e.preventDefault()
    if (!description.trim() || !amount) return
    await addDoc(collection(db, 'finances'), {
      userId: user.uid,
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    })
    setDescription('')
    setAmount('')
  }

  const deleteExpense = async (id) => {
    await deleteDoc(doc(db, 'finances', id))
  }

  const totalSpent = expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
  const thisMonth = expenses.filter(e => e.date?.startsWith(new Date().toISOString().slice(0, 7)))
  const monthlyTotal = thisMonth.reduce((sum, e) => sum + (e.amount || 0), 0)

  return (
    <div className="page-layout">
      <Navbar user={user} />
      <div className="page-container">
        <h1 className="page-title">💰 Finance Tracker</h1>
        <div className="finance-summary">
          <div className="summary-card">
            <h3>This Month</h3>
            <p className="summary-amount">${monthlyTotal.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <h3>All Time</h3>
            <p className="summary-amount">${totalSpent.toFixed(2)}</p>
          </div>
        </div>
        <form onSubmit={addExpense} className="add-form">
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What did you spend on?" className="form-input" />
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount ($)" step="0.01" className="form-input" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-input">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="submit" className="btn btn-primary"><FiPlus /> Add Expense</button>
        </form>
        <div className="items-list">
          {expenses.map(exp => (
            <div key={exp.id} className="item-card">
              <div className="item-content">
                <h3><FiDollarSign /> {exp.description}</h3>
                <div className="expense-details">
                  <span className="expense-amount">${exp.amount?.toFixed(2)}</span>
                  <span className="meal-type-badge">{exp.category}</span>
                  <span className="item-date">{exp.date}</span>
                </div>
              </div>
              <button onClick={() => deleteExpense(exp.id)} className="btn btn-danger"><FiTrash2 /></button>
            </div>
          ))}
          {expenses.length === 0 && <p className="empty-state">No expenses tracked yet 💸</p>}
        </div>
      </div>
    </div>
  )
}

export default Finances
