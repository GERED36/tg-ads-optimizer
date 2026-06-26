import { useState, createContext, useContext, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { checkAuth } from './api/client'
import Login from './pages/Login'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Campaigns from './pages/dashboard/Campaigns'
import CampaignDetail from './pages/dashboard/CampaignDetail'
import Settings from './pages/dashboard/Settings'
import Landing from './pages/landing/Landing'

interface ThemeContextType {
  primary: string
  secondary: string
  setTheme: (primary: string, secondary: string) => void
}

const defaultTheme = { primary: '#22C55E', secondary: '#06B6D4' }

export const ThemeContext = createContext<ThemeContextType>({
  ...defaultTheme,
  setTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [themeColors, setThemeColors] = useState(defaultTheme)

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    if (!token) { setChecking(false); return }
    checkAuth().then(ok => {
      setAuthed(ok)
      if (!ok) localStorage.removeItem('auth-token')
      setChecking(false)
    })
  }, [])

  const setTheme = (primary: string, secondary: string) => {
    setThemeColors({ primary, secondary })
    document.documentElement.style.setProperty('--accent-primary', primary)
    document.documentElement.style.setProperty('--accent-secondary', secondary)
  }

  if (checking) return null

  return (
    <ThemeContext.Provider value={{ primary: themeColors.primary, secondary: themeColors.secondary, setTheme }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={
            authed ? <Navigate to="/dashboard" /> : <Login onLogin={() => setAuthed(true)} />
          } />
          <Route path="/dashboard" element={
            authed ? <DashboardLayout /> : <Navigate to="/login" />
          }>
            <Route index element={<Overview />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="campaigns/:id" element={<CampaignDetail />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeContext.Provider>
  )
}
