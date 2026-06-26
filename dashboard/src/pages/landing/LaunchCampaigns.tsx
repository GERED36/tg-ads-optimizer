import { motion } from 'framer-motion'
import GlassCard from '../../components/GlassCard'

export default function LaunchCampaigns() {
  return (
    <section style={{ padding: '120px 80px' }}>
      <div style={{ display: 'flex', gap: 80, alignItems: 'center', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: .6 }}
          style={{ flex: 1 }}
        >
          <GlassCard style={{ padding: 24 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, letterSpacing: '1px' }}>ANALYTICS</div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              {[
                { label: 'Impressions', value: '142K' },
                { label: 'Clicks', value: '4.2K' },
                { label: 'CTR', value: '2.9%' },
              ].map(m => (
                <div key={m.label} style={{ flex: 1 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-primary)' }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.label}</div>
                </div>
              ))}
            </div>
            <div style={{
              height: 60, display: 'flex', alignItems: 'flex-end', gap: 4,
            }}>
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${20 + Math.sin(i * .8) * 25 + 15}px` }}
                  viewport={{ once: true }}
                  transition={{ duration: .6, delay: i * .03 }}
                  style={{
                    flex: 1, borderRadius: '2px 2px 0 0',
                    background: i > 13 ? 'var(--accent-primary)' : 'rgba(255,255,255,.1)',
                  }}
                />
              ))}
            </div>
          </GlassCard>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: .6, delay: .1 }}
          style={{ flex: 1 }}
        >
          <h2 style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-.03em', marginBottom: 20 }}>
            Launch campaigns
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Set your budget and goals. The agent deploys campaigns across Telegram Ads,
            tracks performance, and optimizes in real time.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
