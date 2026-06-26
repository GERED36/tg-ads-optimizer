import { useTheme } from '../App'

interface KPICardProps {
  label: string
  value: string
  subtitle?: string
  loading?: boolean
}

export default function KPICard({ label, value, subtitle, loading }: KPICardProps) {
  const { primary, secondary } = useTheme()

  if (loading) {
    return (
      <div style={{
        background: 'var(--bg-card)', borderRadius: 'var(--radius)',
        padding: '20px 24px', border: '1px solid var(--border)',
        flex: 1, minWidth: 180,
      }}>
        <div className="skeleton" style={{ width: '60%', height: 14, marginBottom: 12 }} />
        <div className="skeleton" style={{ width: '40%', height: 28 }} />
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: 'var(--radius)',
      padding: '20px 24px', border: '1px solid var(--border)',
      flex: 1, minWidth: 180, position: 'relative', overflow: 'hidden',
      transition: 'transform var(--transition), box-shadow var(--transition)',
      cursor: 'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${primary}, ${secondary})`,
      }} />
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: primary }}>{value}</div>
      {subtitle && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{subtitle}</div>}
    </div>
  )
}
