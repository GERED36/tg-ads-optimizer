import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import GlowButton from '../../components/GlowButton'

const checklistItems = [
  'Campaign generated',
  'Landing page optimized',
  'SEO completed',
  'Competitor analyzed',
  '18 new leads',
  'Ad budget optimized',
]

export default function Hero() {
  const [visibleIndex, setVisibleIndex] = useState(0)

  useEffect(() => {
    if (visibleIndex >= checklistItems.length) return
    const t = setTimeout(() => setVisibleIndex(v => v + 1), 800)
    return () => clearTimeout(t)
  }, [visibleIndex])

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden', padding: '0 80px',
    }}>
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Blurred circles */}
      <div style={{
        position: 'absolute', top: '10%', left: '-10%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'rgba(34,197,94,.08)', filter: 'blur(120px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '-5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'rgba(6,182,212,.06)', filter: 'blur(100px)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', gap: 80, alignItems: 'center', width: '100%', maxWidth: 1400, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .8, ease: 'easeOut' }}
          style={{ flex: 1, maxWidth: 600 }}
        >
          <h1 style={{
            fontSize: 72, fontWeight: 800, letterSpacing: '-.04em',
            lineHeight: 1.1, marginBottom: 24,
          }}>
            Marketing.<br />
            <span style={{ color: 'var(--accent-primary)', textShadow: '0 0 40px rgba(34,197,94,.3)' }}>
              Completely autonomous.
            </span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 40, maxWidth: 480, lineHeight: 1.7 }}>
            Create campaigns. Analyze competitors. Generate content. Launch ads.
            All without hiring a marketing team.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <GlowButton>Start Free</GlowButton>
            <GlowButton variant="ghost">Watch Demo</GlowButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: .95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: .8, delay: .3 }}
          style={{
            flex: 1, maxWidth: 500,
            background: 'rgba(17,17,17,.7)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,.08)',
            borderRadius: 16,
            padding: 32,
            boxShadow: '0 32px 64px rgba(0,0,0,.5)',
          }}
        >
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24, fontWeight: 600, letterSpacing: '.5px' }}>
            MARKETING AGENT
          </div>
          {checklistItems.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -20 }}
              animate={i < visibleIndex ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: .4 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0', borderBottom: i < checklistItems.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none',
              }}
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={i < visibleIndex ? { scale: 1 } : {}}
                transition={{ type: 'spring', stiffness: 300, delay: .1 }}
                style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: '#000', fontWeight: 700,
                  boxShadow: '0 0 12px rgba(34,197,94,.4)',
                }}
              >
                ✓
              </motion.span>
              <span style={{ fontSize: 15, color: i < visibleIndex ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {item}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
