import React from 'react'
import { Link } from 'react-router-dom'

const DashboardCard = ({ title, icon, description, to, color }) => {
  return (
    <Link to={to} className="dashboard-card" style={{ '--card-accent': color }}>
      <div className="card-icon">{icon}</div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      <div className="card-arrow">→</div>
    </Link>
  )
}

export default DashboardCard
