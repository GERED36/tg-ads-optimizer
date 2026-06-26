import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

type Page = 'overview' | 'campaigns' | 'settings'

const navItems: { key: Page; label: string; path: string }[] = [
  { key: 'overview', label: 'Обзор', path: '/dashboard' },
  { key: 'campaigns', label: 'Кампании', path: '/dashboard/campaigns' },
  { key: 'settings', label: 'Настройки', path: '/dashboard/settings' },
]

export default function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const currentPage: Page = location.pathname === '/dashboard' ? 'overview'
    : location.pathname.startsWith('/dashboard/campaigns') ? 'campaigns'
    : location.pathname.startsWith('/dashboard/settings') ? 'settings'
    : 'overview'

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    navigate('/login')
  }

  return (
    <div>
      <nav style={{
        display: 'flex', gap: 16, padding: '12px 24px', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(7,7,7,.8)', backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
      }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginRight: 24, cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}>
          Маркетинговый агент
        </span>
        {navItems.map(item => (
          <button key={item.key} onClick={() => navigate(item.path)} style={{
            cursor: 'pointer', background: 'none', border: 'none',
            color: currentPage === item.key ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: currentPage === item.key ? 600 : 400,
            fontSize: 13, padding: '4px 8px',
            textShadow: currentPage === item.key ? '0 0 20px rgba(34,197,94,.2)' : 'none',
            transition: 'color var(--transition)',
          }}>
            {item.label}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <button onClick={handleLogout} style={{
          background: 'none', border: '1px solid var(--glass-border)', color: 'var(--text-muted)',
          padding: '4px 12px', borderRadius: 'var(--radius-sm)', fontSize: 12, cursor: 'pointer',
          transition: 'color var(--transition), border-color var(--transition)',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)' }}
          onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = '' }}
        >
          Выйти
        </button>
      </nav>
      <main style={{ padding: 24 }} className="fade-in">
        <Outlet />
      </main>
    </div>
  )
}
