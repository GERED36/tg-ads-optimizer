import { ReactNode } from 'react'

interface GlowButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost'
  style?: React.CSSProperties
  disabled?: boolean
}

export default function GlowButton({ children, onClick, variant = 'primary', style, disabled }: GlowButtonProps) {
  const isPrimary = variant === 'primary'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: isPrimary ? 'var(--accent-primary)' : 'transparent',
        color: isPrimary ? '#000' : 'var(--text-primary)',
        border: isPrimary ? 'none' : '1px solid var(--glass-border)',
        padding: '12px 28px',
        borderRadius: 'var(--radius-sm)',
        fontSize: 14,
        fontWeight: 600,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? .5 : 1,
        transition: 'all var(--transition)',
        ...style,
      }}
      onMouseEnter={e => {
        if (!isPrimary) e.currentTarget.style.background = 'rgba(255,255,255,.05)'
      }}
      onMouseLeave={e => {
        if (!isPrimary) e.currentTarget.style.background = 'transparent'
      }}
    >
      {children}
      <span className="shimmer" />
    </button>
  )
}
