import { motion } from 'framer-motion'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({ title, subtitle, align = 'center' }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: .6 }}
      style={{ textAlign: align, marginBottom: 64 }}
    >
      <h2 style={{
        fontSize: 48, fontWeight: 700, letterSpacing: '-.03em',
        marginBottom: subtitle ? 16 : 0,
      }}>{title}</h2>
      {subtitle && (
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
