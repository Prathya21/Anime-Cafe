import React, { useState, useEffect } from 'react'
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where, updateDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import Navbar from '../components/Navbar'
import { FiPlus, FiTrash2, FiCheck, FiBook, FiTv } from 'react-icons/fi'
import '../styles/pages.css'

const WatchRead = ({ user }) => {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [type, setType] = useState('anime')
  const [status, setStatus] = useState('planned')
  const [rating, setRating] = useState('')
  const [tab, setTab] = useState('all')

  useEffect(() => {
    const q = query(collection(db, 'watchread'), where('userId', '==', user.uid))
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [user.uid])

  const addItem = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    await addDoc(collection(db, 'watchread'), {
      userId: user.uid,
      title: title.trim(),
      type,
      status,
      rating: parseInt(rating) || 0,
      createdAt: new Date().toISOString()
    })
    setTitle('')
    setRating('')
  }

  const updateStatus = async (id, newStatus) => {
    await updateDoc(doc(db, 'watchread', id), { status: newStatus })
  }

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'watchread', id))
  }

  const filteredItems = tab === 'all' ? items : items.filter(i => i.type === tab)

  const typeIcons = { anime: '🎬', manga: '📖', book: '📚', show: '📺' }

  return (
    <div className="page-layout">
      <Navbar user={user} />
      <div className="page-container">
        <h1 className="page-title">📚 Watch & Read</h1>
        <form onSubmit={addItem} className="add-form">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title..." className="form-input" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="form-input">
            <option value="anime">🎬 Anime</option>
            <option value="manga">📖 Manga</option>
            <option value="book">📚 Book</option>
            <option value="show">📺 Show</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-input">
            <option value="planned">Planned</option>
            <option value="watching">Watching/Reading</option>
            <option value="completed">Completed</option>
            <option value="dropped">Dropped</option>
          </select>
          <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Rating (1-10)" min="1" max="10" className="form-input" />
          <button type="submit" className="btn btn-primary"><FiPlus /> Add</button>
        </form>
        <div className="tabs">
          {['all', 'anime', 'manga', 'book', 'show'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`tab-btn ${tab === t ? 'active' : ''}`}>
              {t === 'all' ? '📋 All' : `${typeIcons[t]} ${t.charAt(0).toUpperCase() + t.slice(1)}`}
            </button>
          ))}
        </div>
        <div className="items-list">
          {filteredItems.map(item => (
            <div key={item.id} className="item-card">
              <div className="item-content">
                <h3>{typeIcons[item.type]} {item.title}</h3>
                <div className="watchread-details">
                  <select
                    value={item.status}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="planned">Planned</option>
                    <option value="watching">Watching/Reading</option>
                    <option value="completed">Completed</option>
                    <option value="dropped">Dropped</option>
                  </select>
                  {item.rating > 0 && <span className="rating-badge">⭐ {item.rating}/10</span>}
                </div>
              </div>
              <button onClick={() => deleteItem(item.id)} className="btn btn-danger"><FiTrash2 /></button>
            </div>
          ))}
          {filteredItems.length === 0 && <p className="empty-state">Nothing here yet. Add something to watch or read! 📖</p>}
        </div>
      </div>
    </div>
  )
}

export default WatchRead
