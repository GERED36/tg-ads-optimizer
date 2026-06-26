import { useState } from 'react'
import { login } from '../api/client'

interface LoginProps {
  onLogin: () => void
}

export default function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const token = await login(password)
      localStorage.setItem('auth-token', token)
      onLogin()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)',
    }}>
      <div style={{
        background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
        padding: 40, border: '1px solid var(--border)', width: 380, maxWidth: '90%',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Маркетинговый агент</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Войдите в панель управления</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Введите пароль"
              autoFocus
              style={{
                width: '100%', padding: '10px 14px', fontSize: 14,
                background: 'var(--bg-primary)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{ color: '#ff6b6b', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '10px 0', fontSize: 14, fontWeight: 600,
            background: loading ? 'var(--accent-secondary)' : 'var(--accent-primary)',
            color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)',
            cursor: loading ? 'default' : 'pointer', opacity: loading ? .7 : 1,
            transition: 'opacity .15s',
          }}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 24 }}>
          Пароль по умолчанию: admin
        </p>
      </div>
    </div>
  )
}
