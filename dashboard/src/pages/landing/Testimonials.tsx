import { motion } from 'framer-motion'
import GlassCard from '../../components/GlassCard'
import SectionHeading from '../../components/SectionHeading'

const reviews = [
  {
    stars: 5,
    text: 'We replaced two marketers with one AI agent.',
    author: 'Founder',
    company: 'BluePixel',
  },
  {
    stars: 5,
    text: 'Our ROI tripled in the first month. The agent works 24/7.',
    author: 'CEO',
    company: 'DataFlow',
  },
  {
    stars: 5,
    text: 'Campaign management that actually saves time. Not another dashboard to check.',
    author: 'Marketing Lead',
    company: 'CloudBase',
  },
]

export default function Testimonials() {
  return (
    <section style={{ padding: '120px 80px' }}>
      <SectionHeading title="What teams say" />
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', maxWidth: 1000, margin: '0 auto' }}>
        {reviews.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * .1 }}
            style={{ flex: 1, maxWidth: 320 }}
          >
            <GlassCard style={{ padding: 24 }}>
              <div style={{ fontSize: 14, color: '#f59e0b', marginBottom: 12 }}>
                {'★'.repeat(r.stars)}
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 16, fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                "{r.text}"
              </p>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{r.author}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.company}</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
