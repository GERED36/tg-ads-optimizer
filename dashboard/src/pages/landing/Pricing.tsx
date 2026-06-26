import { motion } from 'framer-motion'
import GlassCard from '../../components/GlassCard'
import GlowButton from '../../components/GlowButton'
import SectionHeading from '../../components/SectionHeading'

const tiers = [
  {
    name: 'Starter', price: '$29', period: '/mo',
    features: ['Up to 3 campaigns', 'Basic analytics', 'Email support'],
  },
  {
    name: 'Pro', price: '$99', period: '/mo',
    features: ['Unlimited campaigns', 'Advanced analytics + AI insights', 'Priority support', 'Custom integrations'],
    highlighted: true,
  },
  {
    name: 'Enterprise', price: 'Custom', period: '',
    features: ['Everything in Pro', 'Dedicated account manager', 'SLA guarantee', 'On-premise option'],
  },
]

export default function Pricing() {
  return (
    <section style={{ padding: '120px 80px' }}>
      <SectionHeading title="Simple pricing" subtitle="Start free, scale as you grow" />
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', maxWidth: 1000, margin: '0 auto', alignItems: 'flex-start' }}>
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * .1 }}
            style={{ flex: 1, maxWidth: 300 }}
          >
            <GlassCard
              glow={tier.highlighted}
              style={{
                padding: 32, textAlign: 'center',
                ...(tier.highlighted ? { border: '1px solid rgba(34,197,94,.3)', y: -8 } : {}),
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: tier.highlighted ? 'var(--accent-primary)' : 'var(--text-secondary)', marginBottom: 16 }}>
                {tier.name}
              </div>
              <div style={{ fontSize: 48, fontWeight: 700, marginBottom: 4 }}>
                {tier.price}
                <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 400 }}>{tier.period}</span>
              </div>
              <div style={{ margin: '24px 0', textAlign: 'left' }}>
                {tier.features.map(f => (
                  <div key={f} style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '6px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--accent-primary)' }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <GlowButton variant={tier.highlighted ? 'primary' : 'ghost'} style={{ width: '100%' }}>
                {tier.name === 'Enterprise' ? 'Contact us' : 'Start Free'}
              </GlowButton>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
