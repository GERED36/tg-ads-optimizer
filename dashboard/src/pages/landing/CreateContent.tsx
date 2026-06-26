import { motion } from 'framer-motion'
import GlassCard from '../../components/GlassCard'

export default function CreateContent() {
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
          <h2 style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-.03em', marginBottom: 20 }}>
            Create content
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            AI generates ad copy, landing pages, and social posts tailored to your brand voice.
            Just describe what you need — the agent handles the rest.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: .6, delay: .1 }}
          style={{ flex: 1 }}
        >
          <GlassCard style={{ padding: 24 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, letterSpacing: '1px' }}>CONTENT EDITOR</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Write a landing page for our new SaaS product...</div>
            <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.8 }}>
              <span style={{ color: 'var(--accent-primary)' }}>#</span> Transform workflows with AI-powered automation<br />
              <span style={{ color: 'var(--text-secondary)' }}>Stop doing repetitive tasks. Let our agent handle...</span>
            </div>
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ duration: .8, repeat: Infinity }}
              style={{ width: 2, height: 16, background: 'var(--accent-primary)', marginTop: 4 }}
            />
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}
