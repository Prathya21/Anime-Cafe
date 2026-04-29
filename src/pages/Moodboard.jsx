import React, { useState, useEffect } from 'react'
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../services/firebase'
import Navbar from '../components/Navbar'
import { FiPlus, FiTrash2, FiImage } from 'react-icons/fi'
import '../styles/pages.css'

const Moodboard = ({ user }) => {
  const [images, setImages] = useState([])
  const [imageUrl, setImageUrl] = useState('')
  const [caption, setCaption] = useState('')

  useEffect(() => {
    const q = query(collection(db, 'moodboard'), where('userId', '==', user.uid))
    const unsub = onSnapshot(q, (snap) => {
      setImages(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [user.uid])

  const addImage = async (e) => {
    e.preventDefault()
    if (!imageUrl.trim()) return
    await addDoc(collection(db, 'moodboard'), {
      userId: user.uid,
      url: imageUrl.trim(),
      caption: caption.trim(),
      createdAt: new Date().toISOString()
    })
    setImageUrl('')
    setCaption('')
  }

  const removeImage = async (id) => {
    await deleteDoc(doc(db, 'moodboard', id))
  }

  return (
    <div className="page-layout">
      <Navbar user={user} />
      <div className="page-container">
        <h1 className="page-title">🎨 Moodboard</h1>
        <form onSubmit={addImage} className="add-form">
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL..." className="form-input" />
          <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption (optional)" className="form-input" />
          <button type="submit" className="btn btn-primary"><FiPlus /> Add Image</button>
        </form>
        <div className="moodboard-grid">
          {images.map(img => (
            <div key={img.id} className="moodboard-card">
              <img src={img.url} alt={img.caption || 'Moodboard'} className="moodboard-image" />
              {img.caption && <p className="moodboard-caption">{img.caption}</p>}
              <button onClick={() => removeImage(img.id)} className="moodboard-delete"><FiTrash2 /></button>
            </div>
          ))}
          {images.length === 0 && (
            <div className="empty-state moodboard-empty">
              <FiImage size={48} />
              <p>Add images to create your moodboard! 🖼️</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Moodboard
