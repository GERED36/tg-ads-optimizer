import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../App'
import { fetchSettings, saveSetting, testTelegramConnection } from '../../api/client'
import GlassCard from '../../components/GlassCard'
import GlowButton from '../../components/GlowButton'

const themePresets = [
  { id: 'emerald', name: 'Изумрудный', primary: '#22C55E', secondary: '#06B6D4' },
  { id: 'blue-purple', name: 'Синий + Фиолетовый', primary: '#5b7dff', secondary: '#9c27b0' },
  { id: 'green-orange', name: 'Зелёный + Оранжевый', primary: '#4caf50', secondary: '#ff9800' },
  { id: 'rose-amber', name: 'Розовый + Янтарь', primary: '#e91e63', secondary: '#ffc107' },
]

export default function Settings() {
  const { primary, secondary, setTheme } = useTheme()
  const [customPrimary, setCustomPrimary] = useState(primary)
  const [customSecondary, setCustomSecondary] = useState(secondary)
  const [saved, setSaved] = useState(false)
  const [tgToken, setTgToken] = useState('')
  const [tgBaseUrl, setTgBaseUrl] = useState('https://api.telegram.org/ads/v1')
  const [tgStatus, setTgStatus] = useState<'idle' | 'testing' | 'ok' | 'error'>('idle')
  const [tgMessage, setTgMessage] = useState('')
  const [tgLoaded, setTgLoaded] = useState(false)

  useEffect(() => {
    fetchSettings().then(s => {
      if (s.telegram_api_token) setTgToken(s.telegram_api_token)
      if (s.telegram_api_base_url) setTgBaseUrl(s.telegram_api_base_url)
      setTgLoaded(true)
    }).catch(() => setTgLoaded(true))
  }, [])

  const handleSaveTg = async () => {
    setTgStatus('testing')
    setTgMessage('')
    try {
      await saveSetting('telegram_api_token', tgToken)
      await saveSetting('telegram_api_base_url', tgBaseUrl)
      const msg = await testTelegramConnection(tgToken, tgBaseUrl)
      setTgStatus('ok')
      setTgMessage(msg)
    } catch (e: any) {
      setTgStatus('error')
      setTgMessage(e.message)
    }
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const applyPreset = (preset: typeof themePresets[0]) => {
    setCustomPrimary(preset.primary)
    setCustomSecondary(preset.secondary)
    setTheme(preset.primary, preset.secondary)
    document.documentElement.removeAttribute('data-theme')
    localStorage.setItem('theme-preset', preset.id)
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg-primary)', border: '1px solid var(--glass-border)',
    color: 'var(--text-primary)', padding: '8px 12px',
    borderRadius: 'var(--radius-sm)', fontSize: 14, width: '100%', outline: 'none',
    transition: 'border-color var(--transition)',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6,
  }
  const sectionTitle: React.CSSProperties = {
    marginBottom: 16, fontSize: 15, fontWeight: 600, color: 'var(--accent-primary)',
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
      <h2 style={{ marginBottom: 24, fontSize: 20, fontWeight: 700 }}>Настройки</h2>

      <GlassCard style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={sectionTitle}>Оформление</h3>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Готовая тема</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {themePresets.map(p => (
              <button key={p.id} onClick={() => applyPreset(p)} style={{
                padding: '6px 14px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 500,
                background: p.id === 'emerald' ? '#22C55E' : `linear-gradient(135deg, ${p.primary}, ${p.secondary})`,
                color: p.id === 'emerald' ? '#000' : '#fff', border: 'none', cursor: 'pointer',
                transition: 'opacity .15s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >{p.name}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 150 }}>
            <label style={labelStyle}>Акцентный цвет 1</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={customPrimary}
                onChange={e => { setCustomPrimary(e.target.value); setTheme(e.target.value, customSecondary); localStorage.setItem('theme-preset', 'custom') }}
                style={{ width: 40, height: 40, border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'none' }}
              />
              <input style={inputStyle} type="text" value={customPrimary} readOnly />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 150 }}>
            <label style={labelStyle}>Акцентный цвет 2</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={customSecondary}
                onChange={e => { setCustomSecondary(e.target.value); setTheme(customPrimary, e.target.value); localStorage.setItem('theme-preset', 'custom') }}
                style={{ width: 40, height: 40, border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'none' }}
              />
              <input style={inputStyle} type="text" value={customSecondary} readOnly />
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={sectionTitle}>Telegram Ads</h3>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>API Токен</label>
          <input style={inputStyle} type="password" value={tgToken}
            onChange={e => setTgToken(e.target.value)} placeholder="Введите токен из ads.telegram.org" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>API URL</label>
          <input style={inputStyle} type="text" value={tgBaseUrl}
            onChange={e => setTgBaseUrl(e.target.value)} />
        </div>
        <GlowButton onClick={handleSaveTg} disabled={!tgLoaded || !tgToken}>
          {tgStatus === 'testing' ? 'Проверка...' : 'Сохранить и проверить'}
        </GlowButton>
        {tgStatus === 'ok' && (
          <div style={{ color: '#22C55E', fontSize: 13, marginTop: 8 }}>✓ {tgMessage}</div>
        )}
        {tgStatus === 'error' && (
          <div style={{ color: '#ef4444', fontSize: 13, marginTop: 8 }}>✕ {tgMessage}</div>
        )}
      </GlassCard>

      <GlassCard style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={sectionTitle}>Цели оптимизации</h3>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Целевой CPC (₽)</label>
          <input style={inputStyle} type="number" step="0.01" defaultValue={0.5} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Целевой CPO (₽)</label>
          <input style={inputStyle} type="number" step="0.1" defaultValue={10} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Мин. CTR (%)</label>
          <input style={inputStyle} type="number" step="0.1" defaultValue={0.5} />
        </div>
      </GlassCard>

      <GlassCard style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={sectionTitle}>PID-регулятор</h3>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Kp (Пропорциональный)</label>
          <input style={inputStyle} type="number" step="0.01" defaultValue={0.1} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Ki (Интегральный)</label>
          <input style={inputStyle} type="number" step="0.001" defaultValue={0.01} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Kd (Дифференциальный)</label>
          <input style={inputStyle} type="number" step="0.01" defaultValue={0.05} />
        </div>
      </GlassCard>

      <GlassCard style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={sectionTitle}>Расписание</h3>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Интервал оптимизации (мин)</label>
          <input style={inputStyle} type="number" step="5" defaultValue={15} />
        </div>
      </GlassCard>

      <GlowButton onClick={handleSave}>
        {saved ? 'Сохранено ✓' : 'Сохранить настройки'}
      </GlowButton>
    </motion.div>
  )
}
