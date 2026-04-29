import React, { useState, useEffect } from 'react'
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where, updateDoc, orderBy } from 'firebase/firestore'
import { db } from '../services/firebase'
import Navbar from '../components/Navbar'
import { FiPlus, FiTrash2, FiEdit3, FiSave } from 'react-icons/fi'
import '../styles/pages.css'

const DailyJournal = ({ user }) => {
  const [entries, setEntries] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    const q = query(collection(db, 'journal'), where('userId', '==', user.uid))
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      data.sort((a, b) => b.createdAt?.localeCompare(a.createdAt))
      setEntries(data)
    })
    return () => unsub()
  }, [user.uid])

  const addEntry = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    await addDoc(collection(db, 'journal'), {
      userId: user.uid,
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString()
    })
    setTitle('')
    setContent('')
  }

  const startEdit = (entry) => {
    setEditingId(entry.id)
    setEditTitle(entry.title)
    setEditContent(entry.content)
  }

  const saveEdit = async () => {
    await updateDoc(doc(db, 'journal', editingId), {
      title: editTitle,
      content: editContent
    })
    setEditingId(null)
  }

  const deleteEntry = async (id) => {
    await deleteDoc(doc(db, 'journal', id))
  }

  return (
    <div className="page-layout">
      <Navbar user={user} />
      <div className="page-container">
        <h1 className="page-title">📔 Daily Journal</h1>
        <form onSubmit={addEntry} className="add-form journal-form">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry title..."
            className="form-input"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts..."
            className="form-textarea"
            rows={4}
          />
          <button type="submit" className="btn btn-primary"><FiPlus /> Add Entry</button>
        </form>
        <div className="items-list">
          {entries.map(entry => (
            <div key={entry.id} className="item-card journal-card">
              {editingId === entry.id ? (
                <div className="edit-form">
                  <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="form-input" />
                  <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="form-textarea" rows={3} />
                  <button onClick={saveEdit} className="btn btn-primary"><FiSave /> Save</button>
                </div>
              ) : (
                <>
                  <div className="item-content">
                    <h3>{entry.title}</h3>
                    <p className="journal-content">{entry.content}</p>
                    <small className="item-date">{new Date(entry.createdAt).toLocaleDateString()}</small>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => startEdit(entry)} className="btn btn-secondary"><FiEdit3 /></button>
                    <button onClick={() => deleteEntry(entry.id)} className="btn btn-danger"><FiTrash2 /></button>
                  </div>
                </>
              )}
            </div>
          ))}
          {entries.length === 0 && <p className="empty-state">Your journal awaits... Start writing! ✍️</p>}
        </div>
      </div>
    </div>
  )
}

export default DailyJournal
