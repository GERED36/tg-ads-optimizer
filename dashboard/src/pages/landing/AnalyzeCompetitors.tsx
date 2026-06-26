import { motion } from 'framer-motion'

export default function AnalyzeCompetitors() {
  return (
    <section style={{ padding: '120px 80px' }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: .6 }}
        style={{ marginBottom: 24, textAlign: 'center' }}
      >
        <h2 style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-.03em', marginBottom: 16 }}>
          Analyze competitors
        </h2>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
          Deep competitive intelligence in one dashboard.
        </p>
      </motion.div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16, maxWidth: 1100, margin: '0 auto',
      }}>
        {[
          { label: 'AI Insight', value: 'Competitor X increased CPC by 23% this week. Recommend pausing non-converting keywords.', color: 'var(--accent-primary)', span: 2 },
          { label: 'SEO Score', value: '87/100', color: 'var(--accent-secondary)' },
          { label: 'Keywords', value: '342 tracked', color: 'var(--text-secondary)' },
          { label: 'Traffic Trend', value: '+12.4% MoM', color: 'var(--accent-primary)' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * .1 }}
            style={{
              gridColumn: item.span ? `span ${item.span}` : undefined,
              background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
              border: '1px solid var(--glass-border)', borderRadius: 'var(--radius)',
              padding: 20,
            }}
          >
            <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: 8 }}>{item.label}</div>
            <div style={{ fontSize: 14, color: item.color, lineHeight: 1.5 }}>{item.value}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
