import { motion } from 'framer-motion'

const logos = ['Stripe', 'Notion', 'Slack', 'Figma', 'Vercel', 'GitHub', 'Linear']

export default function TrustedBy() {
  return (
    <section style={{ padding: '80px 80px', textAlign: 'center' }}>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ fontSize: 13, color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 32 }}
      >
        Trusted by modern companies
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}
      >
        {logos.map((name, i) => (
          <motion.span
            key={name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * .05 }}
            style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '.5px' }}
          >
            {name}
          </motion.span>
        ))}
      </motion.div>
    </section>
  )
}
