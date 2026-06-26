import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { register as registerApi } from '../api/client'
import GlowButton from '../components/GlowButton'

export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const token = await registerApi(email, password, name || undefined)
      localStorage.setItem('auth-token', token)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '20%', right: '30%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'rgba(34,197,94,.06)', filter: 'blur(100px)',
      }} />
      <motion.div
        initial={{ opacity: 0, scale: .97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: .4 }}
        style={{
          background: 'rgba(17,17,17,.8)', backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--glass-border)',
          padding: 40, width: 380, maxWidth: '90%',
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Маркетинговый агент</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Создайте аккаунт</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Имя (необязательно)
            </label>
            <input
              type="text" value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ваше имя"
              style={{
                width: '100%', padding: '10px 14px', fontSize: 14,
                background: 'var(--bg-primary)', border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)',
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color var(--transition)',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.2)'}
              onBlur={e => e.currentTarget.style.borderColor = ''}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoFocus
              style={{
                width: '100%', padding: '10px 14px', fontSize: 14,
                background: 'var(--bg-primary)', border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)',
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color var(--transition)',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.2)'}
              onBlur={e => e.currentTarget.style.borderColor = ''}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Пароль
            </label>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Минимум 4 символа"
              style={{
                width: '100%', padding: '10px 14px', fontSize: 14,
                background: 'var(--bg-primary)', border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)',
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color var(--transition)',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.2)'}
              onBlur={e => e.currentTarget.style.borderColor = ''}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ color: '#ef4444', fontSize: 13, marginBottom: 16, textAlign: 'center' }}
            >
              {error}
            </motion.div>
          )}

          <GlowButton disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </GlowButton>
        </form>

        <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginTop: 20 }}>
          Уже есть аккаунт?{' '}
          <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
            Войти
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
