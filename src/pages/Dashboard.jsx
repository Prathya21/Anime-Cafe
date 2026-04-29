import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import RightSidebar from '../components/RightSidebar'
import DashboardCard from '../components/DashboardCard'
import '../styles/dashboard.css'

const cards = [
  { title: 'Habit Tracker', icon: '🎯', description: 'Build daily habits', to: '/habits', color: '#FFB7C5' },
  { title: 'Daily Journal', icon: '📔', description: 'Write your thoughts', to: '/journal', color: '#B5EAD7' },
  { title: 'Goals & Milestones', icon: '🏆', description: 'Track your dreams', to: '/goals', color: '#FFDAC1' },
  { title: 'Wellness', icon: '💆', description: 'Mind & body care', to: '/wellness', color: '#C7CEEA' },
  { title: 'Food', icon: '🍱', description: 'Log your meals', to: '/food', color: '#FFE5B4' },
  { title: 'Finances', icon: '💰', description: 'Track spending', to: '/finances', color: '#D4F0F0' },
  { title: 'Focus Zone', icon: '⏱️', description: 'Pomodoro timer', to: '/focus', color: '#FCE4EC' },
  { title: 'Moodboard', icon: '🎨', description: 'Visual inspiration', to: '/moodboard', color: '#E8DFF5' },
  { title: 'Watch & Read', icon: '📚', description: 'Track media', to: '/watchread', color: '#FFF5BA' },
]

const Dashboard = ({ user }) => {
  return (
    <div className="dashboard-layout">
      <Navbar user={user} />
      <div className="banner">
        <div className="banner-overlay">
          <h1>Welcome to The Hub ☕</h1>
          <p>Your cozy anime café productivity dashboard</p>
        </div>
      </div>
      <div className="dashboard-content">
        <Sidebar userId={user.uid} />
        <main className="main-grid">
          <h2 className="section-title">✨ The Hub</h2>
          <div className="cards-grid">
            {cards.map((card, i) => (
              <DashboardCard key={i} {...card} />
            ))}
          </div>
        </main>
        <RightSidebar />
      </div>
    </div>
  )
}

export default Dashboard
