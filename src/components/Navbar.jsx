import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../services/firebase'
import { FiLogOut, FiHome, FiCoffee } from 'react-icons/fi'

const Navbar = ({ user }) => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <FiCoffee className="brand-icon" />
        <span>Anime Café</span>
      </Link>
      <div className="navbar-right">
        <span className="navbar-user">Welcome, {user?.email?.split('@')[0]} ☕</span>
        <Link to="/" className="nav-btn"><FiHome /></Link>
        <button onClick={handleLogout} className="nav-btn logout-btn">
          <FiLogOut /> Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
