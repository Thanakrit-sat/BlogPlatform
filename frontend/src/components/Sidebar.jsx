import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import './Sidebar.css'

const NAV_ITEMS = [
  { to: '/',            icon: '◎', label: 'Home' },
  { to: '/create',      icon: '✦', label: 'New Post',  auth: true },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setCollapsed(c => !c)}
      >
        {collapsed ? '✕' : '☰'}
      </button>

      <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <span className="sidebar-logo-mark">✦</span>
          <span className="sidebar-logo-text">Pencraft</span>
        </div>

        <div className="sidebar-divider" />

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">Navigate</div>
          {NAV_ITEMS.map(item => {
            if (item.auth && !user) return null
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `sidebar-link${isActive ? ' sidebar-link--active' : ''}`
                }
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span className="sidebar-link-label">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="sidebar-spacer" />

        {/* Theme toggle */}
        <button className="sidebar-theme-btn" onClick={toggleTheme}>
          <span>{theme === 'dark' ? '○' : '●'}</span>
          <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>

        <div className="sidebar-divider" />

        {/* User section */}
        {user ? (
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user.username?.[0]?.toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.username}</div>
              <div className="sidebar-user-email">{user.email}</div>
            </div>
            <button className="sidebar-logout-btn" onClick={handleLogout} title="Logout">
              ⇥
            </button>
          </div>
        ) : (
          <div className="sidebar-auth-links">
            <NavLink to="/login" className="sidebar-link">
              <span className="sidebar-link-icon">→</span>
              <span className="sidebar-link-label">Sign in</span>
            </NavLink>
            <NavLink to="/register" className="sidebar-link">
              <span className="sidebar-link-icon">+</span>
              <span className="sidebar-link-label">Register</span>
            </NavLink>
          </div>
        )}
      </aside>
    </>
  )
}