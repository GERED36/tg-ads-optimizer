import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  style?: React.CSSProperties
  hover?: boolean
  glow?: boolean
  className?: string
}

export default function GlassCard({ children, style, hover = true, glow = false, className }: GlassCardProps) {
  return (
    <motion.div
      className={className}
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius)',
        boxShadow: glow ? 'var(--accent-glow)' : 'var(--glass-shadow)',
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}
