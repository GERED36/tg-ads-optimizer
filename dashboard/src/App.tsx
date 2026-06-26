import { useState, createContext, useContext, useEffect } from 'react'
import Overview from './pages/Overview'
import Campaigns from './pages/Campaigns'
import CampaignDetail from './pages/CampaignDetail'
import Settings from './pages/Settings'
import Login from './pages/Login'
import { checkAuth } from './api/client'

type Page = 'overview' | 'campaigns' | 'settings'

interface ThemeContextType {
  primary: string
  secondary: string
  setTheme: (primary: string, secondary: string) => void
}

const defaultTheme = { primary: '#6c8cff', secondary: '#4caf50' }

export const ThemeContext = createContext<ThemeContextType>({
  ...defaultTheme,
  setTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [page, setPage] = useState<Page>('overview')
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)
  const [themeColors, setThemeColors] = useState(() => {
    const saved = localStorage.getItem('theme-colors')
    return saved ? JSON.parse(saved) : defaultTheme
  })

  const [themePreset, setThemePreset] = useState(() => localStorage.getItem('theme-preset') || 'indigo-green')

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    if (!token) { setChecking(false); return }
    checkAuth().then(ok => {
      setAuthed(ok)
      if (!ok) localStorage.removeItem('auth-token')
      setChecking(false)
    })
  }, [])

  useEffect(() => {
    if (themePreset === 'custom') document.documentElement.removeAttribute('data-theme')
    else document.documentElement.setAttribute('data-theme', themePreset === 'default' ? '' : themePreset)
    localStorage.setItem('theme-preset', themePreset)
  }, [themePreset])

  useEffect(() => {
    localStorage.setItem('theme-colors', JSON.stringify(themeColors))
  }, [themeColors])

  const setTheme = (primary: string, secondary: string) => {
    setThemeColors({ primary, secondary })
    document.documentElement.style.setProperty('--accent-primary', primary)
    document.documentElement.style.setProperty('--accent-secondary', secondary)
  }

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    setAuthed(false)
  }

  if (checking) return null

  if (!authed) return <Login onLogin={() => setAuthed(true)} />

  const navStyle: React.CSSProperties = {
    display: 'flex', gap: 16, padding: '16px 24px', background: 'var(--bg-card)',
    borderBottom: '1px solid var(--border)', alignItems: 'center',
    position: 'sticky' as any, top: 0, zIndex: 100,
  }

  const linkStyle = (active: boolean): React.CSSProperties => ({
    cursor: 'pointer',
    color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
    fontWeight: active ? 600 : 400,
    fontSize: 14, background: 'none', border: 'none',
    padding: '4px 8px', position: 'relative' as any, transition: 'color .2s',
  })

  return (
    <ThemeContext.Provider value={{ primary: themeColors.primary, secondary: themeColors.secondary, setTheme }}>
      <div>
        <nav style={navStyle}>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', marginRight: 16 }}>
            Маркетинговый агент
          </span>
          <button style={linkStyle(page === 'overview')}
            onClick={() => { setPage('overview'); setSelectedCampaignId(null); }}>
            Обзор
          </button>
          <button style={linkStyle(page === 'campaigns')} onClick={() => setPage('campaigns')}>
            Кампании
          </button>
          <button style={linkStyle(page === 'settings')} onClick={() => setPage('settings')}>
            Настройки
          </button>
          <span style={{ flex: 1 }} />
          <button onClick={handleLogout} style={{
            background: 'none', border: '1px solid var(--border)', color: 'var(--text-secondary)',
            padding: '4px 12px', borderRadius: 'var(--radius-sm)', fontSize: 12, cursor: 'pointer',
          }}>
            Выйти
          </button>
        </nav>
        <main style={{ padding: 24 }} className="fade-in">
          {page === 'overview' && <Overview />}
          {page === 'campaigns' && !selectedCampaignId && (
            <Campaigns onSelect={(id: string) => { setSelectedCampaignId(id); setPage('campaigns'); }} />
          )}
          {page === 'campaigns' && selectedCampaignId && (
            <CampaignDetail campaignId={selectedCampaignId} onBack={() => setSelectedCampaignId(null)} />
          )}
          {page === 'settings' && <Settings />}
        </main>
      </div>
    </ThemeContext.Provider>
  )
}
