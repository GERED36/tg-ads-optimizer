import GlassCard from '../../components/GlassCard'
import AnimatedCounter from '../../components/AnimatedCounter'
import SectionHeading from '../../components/SectionHeading'

const metrics = [
  { value: 400, suffix: '%', label: 'Average ROI' },
  { value: 18, suffix: 'M', label: 'Generated words' },
  { value: 52, suffix: 'K', label: 'Campaigns' },
  { value: 98, suffix: '%', label: 'Client satisfaction' },
]

export default function MetricsStrip() {
  return (
    <section style={{ padding: '120px 80px' }}>
      <SectionHeading title="Results that speak" subtitle="Trusted by teams worldwide" />
      <div style={{
        display: 'flex', gap: 24, justifyContent: 'center',
        maxWidth: 1000, margin: '0 auto',
      }}>
        {metrics.map(m => (
          <GlassCard key={m.label} style={{
            flex: 1, padding: '32px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-.03em', marginBottom: 8 }}>
              <AnimatedCounter to={m.value} suffix={m.suffix} />
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{m.label}</div>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}
