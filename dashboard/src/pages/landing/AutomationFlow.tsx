import { motion } from 'framer-motion'
import GlassCard from '../../components/GlassCard'

const steps = [
  { label: 'Research', desc: 'Analyze market & competitors' },
  { label: 'Content', desc: 'Generate ad creatives & landing pages' },
  { label: 'Landing', desc: 'Build & optimize landing pages' },
  { label: 'Ads', desc: 'Launch & manage campaigns' },
  { label: 'Analytics', desc: 'Track performance & ROI' },
  { label: 'Optimization', desc: 'Auto-adjust bids & budgets' },
]

export default function AutomationFlow() {
  return (
    <section style={{ padding: '120px 80px' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        style={{ textAlign: 'center', marginBottom: 80 }}
      >
        <h2 style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-.03em', marginBottom: 16 }}>
          Fully automated workflow
        </h2>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
          From research to optimization — no human intervention needed.
        </p>
      </motion.div>

      <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: 40, top: 0, width: 2,
            background: 'linear-gradient(to bottom, var(--accent-primary), var(--accent-secondary))',
            opacity: .3,
          }}
        />

        {steps.map((step, i) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * .15 }}
            style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 32, position: 'relative' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, delay: i * .15 }}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--accent-primary)', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: '#000',
                boxShadow: '0 0 20px rgba(34,197,94,.3)',
                zIndex: 1,
              }}
            >
              {i + 1}
            </motion.div>
            <GlassCard style={{ flex: 1, padding: '16px 20px' }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{step.label}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{step.desc}</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
