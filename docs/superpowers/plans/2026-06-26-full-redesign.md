# Full Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the marketing-agent SPA into a Linear/OpenAI-style product with a public landing page and glass-morphism dashboard.

**Architecture:** Single SPA with react-router-dom v6 — public routes (`/`) serve the landing page, auth-protected routes (`/dashboard/*`) serve the dashboard. All pages share the new dark glass design system with Framer Motion animations. Dashboard API and auth logic remain untouched.

**Tech Stack:** Vite + React 18, react-router-dom v6, Framer Motion v11, recharts, Inter font, CSS custom properties.

---

### Task 1: Install dependencies

**Files:**
- Modify: `dashboard/package.json`

- [ ] **Step 1: Install react-router-dom and framer-motion**

Run from `dashboard/`:
```bash
npm install react-router-dom framer-motion
```

- [ ] **Step 2: Verify install**

Check `package.json` includes `react-router-dom` and `framer-motion` in dependencies.

- [ ] **Step 3: Commit**

```bash
git add dashboard/package.json dashboard/package-lock.json
git commit -m "chore: install react-router-dom and framer-motion"
```

---

### Task 2: Update index.html — new design system CSS variables

**Files:**
- Modify: `dashboard/index.html`

Replace the entire `<style>` block with the new dark glass design system.

- [ ] **Step 1: Write new CSS**

Replace `<style>` content in `dashboard/index.html`:

```html
<style>
  :root {
    --bg-primary: #070707;
    --bg-card: #111111;
    --bg-elevated: #1a1a1a;
    --border: rgba(255,255,255,.08);
    --text-primary: #FFFFFF;
    --text-secondary: #9CA3AF;
    --text-muted: #6B7280;
    --accent-primary: #22C55E;
    --accent-secondary: #06B6D4;
    --accent-glow: 0 0 24px rgba(34,197,94,.25);
    --radius-sm: 8px;
    --radius: 12px;
    --radius-lg: 16px;
    --shadow: 0 2px 8px rgba(0,0,0,.5);
    --shadow-lg: 0 8px 32px rgba(0,0,0,.6);
    --font: 'Inter', system-ui, -apple-system, sans-serif;
    --transition: .2s cubic-bezier(.4,0,.2,1);
    --glass-bg: rgba(17,17,17,.8);
    --glass-border: rgba(255,255,255,.08);
    --glass-shadow: 0 8px 32px rgba(0,0,0,.4);
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: var(--font);
    background: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  ::selection { background: rgba(34,197,94,.3); }
  @keyframes pulse {
    0%, 100% { opacity: .3; }
    50% { opacity: .6; }
  }
  .skeleton {
    background: var(--bg-elevated);
    border-radius: var(--radius-sm);
    animation: pulse 1.5s ease-in-out infinite;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-in { animation: fadeIn .4s ease; }
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .shimmer {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.06), transparent);
    animation: shimmer 2s infinite;
    pointer-events: none;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add dashboard/index.html
git commit -m "refactor: update CSS to dark glass design system"
```

---

### Task 3: Create shared GlassCard, GlowButton, AnimatedCounter components

**Files:**
- Create: `dashboard/src/components/GlassCard.tsx`
- Create: `dashboard/src/components/GlowButton.tsx`
- Create: `dashboard/src/components/AnimatedCounter.tsx`
- Create: `dashboard/src/components/SectionHeading.tsx`

- [ ] **Step 1: Create GlassCard**

`dashboard/src/components/GlassCard.tsx`:
```tsx
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  style?: React.CSSProperties
  hover?: boolean
  glow?: boolean
  className?: string
}

export default function GlassCard({ children, style, hover = true, glow = false, className }: GlassCardProps) {
  return (
    <motion.div
      className={className}
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius)',
        boxShadow: glow ? 'var(--accent-glow)' : 'var(--glass-shadow)',
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Create GlowButton**

`dashboard/src/components/GlowButton.tsx`:
```tsx
import { ReactNode } from 'react'

interface GlowButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost'
  style?: React.CSSProperties
  disabled?: boolean
}

export default function GlowButton({ children, onClick, variant = 'primary', style, disabled }: GlowButtonProps) {
  const isPrimary = variant === 'primary'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: isPrimary ? 'var(--accent-primary)' : 'transparent',
        color: isPrimary ? '#000' : 'var(--text-primary)',
        border: isPrimary ? 'none' : '1px solid var(--glass-border)',
        padding: '12px 28px',
        borderRadius: 'var(--radius-sm)',
        fontSize: 14,
        fontWeight: 600,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? .5 : 1,
        transition: 'all var(--transition)',
        ...style,
      }}
      onMouseEnter={e => {
        if (!isPrimary) e.currentTarget.style.background = 'rgba(255,255,255,.05)'
      }}
      onMouseLeave={e => {
        if (!isPrimary) e.currentTarget.style.background = 'transparent'
      }}
    >
      {children}
      <span className="shimmer" />
    </button>
  )
}
```

- [ ] **Step 3: Create AnimatedCounter**

`dashboard/src/components/AnimatedCounter.tsx`:
```tsx
import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'

interface AnimatedCounterProps {
  from?: number
  to: number
  suffix?: string
  duration?: number
}

export default function AnimatedCounter({ from = 0, to, suffix = '', duration = 2 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [displayed, setDisplayed] = useState(from)

  useEffect(() => {
    if (!inView) return
    const controls = animate(from, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplayed(Math.round(v)),
    })
    return controls.stop
  }, [inView, from, to, duration])

  return <motion.span ref={ref}>{displayed}{suffix}</motion.span>
}
```

- [ ] **Step 4: Create SectionHeading**

`dashboard/src/components/SectionHeading.tsx`:
```tsx
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
```

- [ ] **Step 5: Commit**

```bash
git add dashboard/src/components/GlassCard.tsx dashboard/src/components/GlowButton.tsx dashboard/src/components/AnimatedCounter.tsx dashboard/src/components/SectionHeading.tsx
git commit -m "feat: add shared GlassCard, GlowButton, AnimatedCounter, SectionHeading"
```

---

### Task 4: Create Landing page components

**Files:**
- Create: `dashboard/src/pages/landing/Hero.tsx`
- Create: `dashboard/src/pages/landing/TrustedBy.tsx`
- Create: `dashboard/src/pages/landing/CreateContent.tsx`
- Create: `dashboard/src/pages/landing/LaunchCampaigns.tsx`
- Create: `dashboard/src/pages/landing/AnalyzeCompetitors.tsx`
- Create: `dashboard/src/pages/landing/AutomationFlow.tsx`
- Create: `dashboard/src/pages/landing/MetricsStrip.tsx`
- Create: `dashboard/src/pages/landing/Testimonials.tsx`
- Create: `dashboard/src/pages/landing/Pricing.tsx`
- Create: `dashboard/src/pages/landing/Footer.tsx`
- Create: `dashboard/src/pages/landing/Landing.tsx`

- [ ] **Step 1: Create Hero.tsx**

`dashboard/src/pages/landing/Hero.tsx`:
```tsx
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
        {/* Left: text */}
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

        {/* Right: live dashboard mockup */}
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
```

- [ ] **Step 2: Create TrustedBy.tsx**

`dashboard/src/pages/landing/TrustedBy.tsx`:
```tsx
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
```

- [ ] **Step 3: Create CreateContent.tsx**

`dashboard/src/pages/landing/CreateContent.tsx`:
```tsx
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
```

- [ ] **Step 4: Create LaunchCampaigns.tsx**

`dashboard/src/pages/landing/LaunchCampaigns.tsx`:
```tsx
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
```

- [ ] **Step 5: Create AnalyzeCompetitors.tsx**

`dashboard/src/pages/landing/AnalyzeCompetitors.tsx`:
```tsx
import { motion } from 'framer-motion'
import GlassCard from '../../components/GlassCard'

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
```

- [ ] **Step 6: Create AutomationFlow.tsx**

`dashboard/src/pages/landing/AutomationFlow.tsx`:
```tsx
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
        {/* Vertical line */}
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
```

- [ ] **Step 7: Create MetricsStrip.tsx**

`dashboard/src/pages/landing/MetricsStrip.tsx`:
```tsx
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
```

- [ ] **Step 8: Create Testimonials.tsx**

`dashboard/src/pages/landing/Testimonials.tsx`:
```tsx
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
```

- [ ] **Step 9: Create Pricing.tsx**

`dashboard/src/pages/landing/Pricing.tsx`:
```tsx
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
```

- [ ] **Step 10: Create Footer.tsx**

`dashboard/src/pages/landing/Footer.tsx`:
```tsx
export default function Footer() {
  const linkStyle: React.CSSProperties = {
    fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer',
    transition: 'color var(--transition)',
  }
  return (
    <footer style={{
      borderTop: '1px solid var(--glass-border)',
      padding: '40px 80px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Marketing Agent</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>© 2026 Marketing Agent. All rights reserved.</div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Product', 'Company', 'Legal', 'Contact'].map(l => (
            <span key={l} style={linkStyle}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              onMouseLeave={e => e.currentTarget.style.color = ''}
            >{l}</span>
          ))}
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 11: Create Landing.tsx (parent)**

`dashboard/src/pages/landing/Landing.tsx`:
```tsx
import Hero from './Hero'
import TrustedBy from './TrustedBy'
import CreateContent from './CreateContent'
import LaunchCampaigns from './LaunchCampaigns'
import AnalyzeCompetitors from './AnalyzeCompetitors'
import AutomationFlow from './AutomationFlow'
import MetricsStrip from './MetricsStrip'
import Testimonials from './Testimonials'
import Pricing from './Pricing'
import Footer from './Footer'

export default function Landing() {
  return (
    <div>
      <Hero />
      <TrustedBy />
      <CreateContent />
      <LaunchCampaigns />
      <AnalyzeCompetitors />
      <AutomationFlow />
      <MetricsStrip />
      <Testimonials />
      <Pricing />
      <Footer />
    </div>
  )
}
```

- [ ] **Step 12: Commit**

```bash
git add dashboard/src/pages/landing/
git commit -m "feat: add landing page with Hero, Features, Metrics, Testimonials, Pricing"
```

---

### Task 5: Refactor App.tsx to router-based with auth guard

**Files:**
- Modify: `dashboard/src/App.tsx`
- Modify: `dashboard/src/main.tsx`

Replace `App.tsx` with a router-based setup. The login state is lifted to a top-level wrapper.

- [ ] **Step 1: Replace App.tsx**

`dashboard/src/App.tsx`:
```tsx
import { useState, createContext, useContext, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { checkAuth } from './api/client'
import Login from './pages/Login'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Campaigns from './pages/dashboard/Campaigns'
import CampaignDetail from './pages/dashboard/CampaignDetail'
import Settings from './pages/dashboard/Settings'
import Landing from './pages/landing/Landing'

interface ThemeContextType {
  primary: string
  secondary: string
  setTheme: (primary: string, secondary: string) => void
}

const defaultTheme = { primary: '#22C55E', secondary: '#06B6D4' }

export const ThemeContext = createContext<ThemeContextType>({
  ...defaultTheme,
  setTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [themeColors, setThemeColors] = useState(defaultTheme)

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    if (!token) { setChecking(false); return }
    checkAuth().then(ok => {
      setAuthed(ok)
      if (!ok) localStorage.removeItem('auth-token')
      setChecking(false)
    })
  }, [])

  const setTheme = (primary: string, secondary: string) => {
    setThemeColors({ primary, secondary })
    document.documentElement.style.setProperty('--accent-primary', primary)
    document.documentElement.style.setProperty('--accent-secondary', secondary)
  }

  if (checking) return null

  return (
    <ThemeContext.Provider value={{ primary: themeColors.primary, secondary: themeColors.secondary, setTheme }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={
            authed ? <Navigate to="/dashboard" /> : <Login onLogin={() => setAuthed(true)} />
          } />
          <Route path="/dashboard" element={
            authed ? <DashboardLayout /> : <Navigate to="/login" />
          }>
            <Route index element={<Overview />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="campaigns/:id" element={<CampaignDetail />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeContext.Provider>
  )
}
```

- [ ] **Step 2: Update main.tsx** — wrap with BrowserRouter is now inside App, so no change needed (App handles it).

- [ ] **Step 3: Commit**

```bash
git add dashboard/src/App.tsx
git commit -m "refactor: switch to react-router with landing, login, and dashboard routes"
```

---

### Task 6: Create DashboardLayout with glass navbar

**Files:**
- Create: `dashboard/src/pages/dashboard/DashboardLayout.tsx`
- Move: `dashboard/src/pages/Login.tsx` (no changes needed — already exists)

The navbar from old App.tsx becomes the layout wrapper with `<Outlet />`.

- [ ] **Step 1: Create DashboardLayout.tsx**

`dashboard/src/pages/dashboard/DashboardLayout.tsx`:
```tsx
import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

type Page = 'overview' | 'campaigns' | 'settings'

const navItems: { key: Page; label: string; path: string }[] = [
  { key: 'overview', label: 'Обзор', path: '/dashboard' },
  { key: 'campaigns', label: 'Кампании', path: '/dashboard/campaigns' },
  { key: 'settings', label: 'Настройки', path: '/dashboard/settings' },
]

export default function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const currentPage: Page = location.pathname === '/dashboard' ? 'overview'
    : location.pathname.startsWith('/dashboard/campaigns') ? 'campaigns'
    : location.pathname.startsWith('/dashboard/settings') ? 'settings'
    : 'overview'

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    navigate('/login')
  }

  return (
    <div>
      <nav style={{
        display: 'flex', gap: 16, padding: '12px 24px', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(7,7,7,.8)', backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
      }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginRight: 24, cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}>
          Маркетинговый агент
        </span>
        {navItems.map(item => (
          <button key={item.key} onClick={() => navigate(item.path)} style={{
            cursor: 'pointer', background: 'none', border: 'none',
            color: currentPage === item.key ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: currentPage === item.key ? 600 : 400,
            fontSize: 13, padding: '4px 8px',
            textShadow: currentPage === item.key ? '0 0 20px rgba(34,197,94,.2)' : 'none',
            transition: 'color var(--transition)',
          }}>
            {item.label}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <button onClick={handleLogout} style={{
          background: 'none', border: '1px solid var(--glass-border)', color: 'var(--text-muted)',
          padding: '4px 12px', borderRadius: 'var(--radius-sm)', fontSize: 12, cursor: 'pointer',
          transition: 'color var(--transition), border-color var(--transition)',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)' }}
          onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = '' }}
        >
          Выйти
        </button>
      </nav>
      <main style={{ padding: 24 }} className="fade-in">
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Move page files to dashboard/ subfolder**

Move (rename) the existing dashboard pages:
```bash
mkdir dashboard/src/pages/dashboard
git mv dashboard/src/pages/Overview.tsx dashboard/src/pages/dashboard/Overview.tsx
git mv dashboard/src/pages/Campaigns.tsx dashboard/src/pages/dashboard/Campaigns.tsx
git mv dashboard/src/pages/CampaignDetail.tsx dashboard/src/pages/dashboard/CampaignDetail.tsx
git mv dashboard/src/pages/Settings.tsx dashboard/src/pages/dashboard/Settings.tsx
git mv dashboard/src/pages/Login.tsx dashboard/src/pages/Login.tsx  # stays at root
```

- [ ] **Step 3: Commit**

```bash
git add dashboard/src/pages/dashboard/ dashboard/src/pages/dashboard/DashboardLayout.tsx
git commit -m "feat: add DashboardLayout with glass navbar, organize pages"
```

---

### Task 7: Restyle Login page

**Files:**
- Modify: `dashboard/src/pages/Login.tsx`

Apply the new glass design to the Login page.

- [ ] **Step 1: Rewrite Login.tsx**

`dashboard/src/pages/Login.tsx`:
```tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { login } from '../api/client'
import GlowButton from '../components/GlowButton'

interface LoginProps {
  onLogin: () => void
}

export default function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const token = await login(password)
      localStorage.setItem('auth-token', token)
      onLogin()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '20%', left: '30%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'rgba(34,197,94,.06)', filter: 'blur(100px)',
      }} />
      <motion.div
        initial={{ opacity: 0, scale: .97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: .4 }}
        style={{
          background: 'rgba(17,17,17,.8)', backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--glass-border)',
          padding: 40, width: 380, maxWidth: '90%',
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Маркетинговый агент</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Войдите в панель управления</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Введите пароль"
              autoFocus
              style={{
                width: '100%', padding: '10px 14px', fontSize: 14,
                background: 'var(--bg-primary)', border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)',
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color var(--transition)',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.2)'}
              onBlur={e => e.currentTarget.style.borderColor = ''}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ color: '#ef4444', fontSize: 13, marginBottom: 16, textAlign: 'center' }}
            >
              {error}
            </motion.div>
          )}

          <GlowButton disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Вход...' : 'Войти'}
          </GlowButton>
        </form>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add dashboard/src/pages/Login.tsx
git commit -m "refactor: restyle Login with glass card and blur background"
```

---

### Task 8: Restyle Overview page

**Files:**
- Modify: `dashboard/src/pages/dashboard/Overview.tsx`

Apply glass design to KPICards, chart, and layout.

- [ ] **Step 1: Rewrite Overview.tsx**

`dashboard/src/pages/dashboard/Overview.tsx`:
```tsx
import { motion } from 'framer-motion'
import { useDashboard, useWebSocketUpdates } from '../../hooks/useMetrics'
import KPICard from '../../components/KPICard'
import MetricsChart from '../../components/MetricsChart'

export default function Overview() {
  const { data, isLoading } = useDashboard()
  const wsData = useWebSocketUpdates()
  const displayData = wsData ?? data

  if (isLoading && !data) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          {Array.from({ length: 6 }).map((_, i) => <KPICard key={i} label="" value="" loading />)}
        </div>
        <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius)', marginBottom: 24 }} />
      </motion.div>
    )
  }

  if (!displayData) return (
    <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 60 }}>
      Нет данных
    </div>
  )

  const { overview, campaigns, statsHistory } = displayData

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <KPICard label="Общий расход" value={`${overview.totalSpend.toFixed(2)} ₽`} subtitle="За всё время" />
        <KPICard label="Средний CPC" value={`${overview.avgCpc.toFixed(4)} ₽`} subtitle="Цена за клик" />
        <KPICard label="Средний CPM" value={`${overview.avgCpm.toFixed(2)} ₽`} subtitle="Цена за 1000 показов" />
        <KPICard label="Средний CPO" value={`${overview.avgCpo.toFixed(2)} ₽`} subtitle="Цена за заказ" />
        <KPICard label="Конверсии" value={String(overview.totalConversions)} subtitle="Всего" />
        <KPICard label="Активные кампании" value={String(overview.activeCampaigns)} subtitle={`${campaigns.length} всего`} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12, fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>
          История метрик
        </h3>
        <MetricsChart
          data={statsHistory as unknown as Array<{ timestamp: string } & Record<string, number>>}
          lines={[
            { key: 'cpc', color: '#22C55E', name: 'CPC' },
            { key: 'cpm', color: '#06B6D4', name: 'CPM' },
            { key: 'ctr', color: '#f59e0b', name: 'CTR' },
          ]}
        />
      </div>
    </motion.div>
  )
}
```

Note: KPICard and MetricsChart already use CSS var theming, so they will inherit the new palette automatically. No changes needed for them.

- [ ] **Step 2: Commit**

```bash
git add dashboard/src/pages/dashboard/Overview.tsx
git commit -m "refactor: restyle Overview with Framer Motion entrance, new palette"
```

---

### Task 9: Restyle Campaigns page + CampaignsTable

**Files:**
- Modify: `dashboard/src/pages/dashboard/Campaigns.tsx`
- Modify: `dashboard/src/components/CampaignsTable.tsx`

- [ ] **Step 1: Rewrite Campaigns.tsx**

`dashboard/src/pages/dashboard/Campaigns.tsx`:
```tsx
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useDashboard } from '../../hooks/useMetrics'
import CampaignsTable from '../../components/CampaignsTable'

export default function Campaigns() {
  const navigate = useNavigate()
  const { data, isLoading } = useDashboard()

  if (isLoading) return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>Загрузка...</div>
  if (!data) return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>Нет данных</div>

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 700 }}>Все кампании</h2>
      <CampaignsTable campaigns={data.campaigns} onSelect={(id) => navigate(`/dashboard/campaigns/${id}`)} />
    </motion.div>
  )
}
```

- [ ] **Step 2: Rewrite CampaignsTable.tsx**

Add glass style, hover scale effect, status badge colors.

`dashboard/src/components/CampaignsTable.tsx`:
```tsx
import { motion } from 'framer-motion'
import { CampaignRow } from '../api/client'

interface CampaignsTableProps {
  campaigns: CampaignRow[]
  onSelect: (id: string) => void
}

const statusLabels: Record<string, string> = {
  active: 'Активна',
  paused: 'Пауза',
  archived: 'Архив',
}

export default function CampaignsTable({ campaigns, onSelect }: CampaignsTableProps) {
  const cellStyle: React.CSSProperties = {
    padding: '12px 16px', fontSize: 13, borderBottom: '1px solid var(--glass-border)',
  }

  return (
    <div style={{
      background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--glass-border)',
      overflow: 'auto', maxHeight: 600,
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1 }}>
            {['Название', 'Статус', 'Бюджет', 'CPC', 'CPO', 'CTR', 'Расход', 'Конверсии'].map(h => (
              <th key={h} style={{
                textAlign: 'left', padding: '12px 16px', fontSize: 11, color: 'var(--text-muted)',
                borderBottom: '1px solid var(--glass-border)', fontWeight: 600, letterSpacing: '.5px',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c, i) => (
            <motion.tr
              key={c.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * .02 }}
              style={{ cursor: 'pointer', transition: 'all var(--transition)' }}
              onClick={() => onSelect(c.id)}
              whileHover={{ scale: 1.01, background: 'rgba(255,255,255,.03)', boxShadow: '0 0 20px rgba(34,197,94,.08)' }}
            >
              <td style={{ ...cellStyle, color: 'var(--text-primary)', fontWeight: 500 }}>{c.name}</td>
              <td style={cellStyle}>
                <span style={{
                  display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                  background: c.status === 'active' ? 'rgba(34,197,94,.15)' : 'rgba(255,255,255,.05)',
                  color: c.status === 'active' ? '#22C55E' : 'var(--text-secondary)',
                }}>
                  {statusLabels[c.status] || c.status}
                </span>
              </td>
              <td style={cellStyle}>{c.dailyBudget.toLocaleString('ru')} ₽</td>
              <td style={cellStyle}>{c.cpc.toFixed(4)} ₽</td>
              <td style={cellStyle}>{c.cpo.toFixed(2)} ₽</td>
              <td style={cellStyle}>{(c.ctr * 100).toFixed(2)}%</td>
              <td style={cellStyle}>{c.spend.toFixed(2)} ₽</td>
              <td style={cellStyle}>{c.conversions}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add dashboard/src/pages/dashboard/Campaigns.tsx dashboard/src/components/CampaignsTable.tsx
git commit -m "refactor: restyle Campaigns page with glass table and row animations"
```

---

### Task 10: Restyle CampaignDetail page

**Files:**
- Modify: `dashboard/src/pages/dashboard/CampaignDetail.tsx`

Apply glass design, Framer Motion animations, update to use `useParams` from react-router.

- [ ] **Step 1: Rewrite CampaignDetail.tsx**

`dashboard/src/pages/dashboard/CampaignDetail.tsx`:
```tsx
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchCampaignDetail, CampaignDetail as CampaignDetailType } from '../../api/client'
import MetricsChart from '../../components/MetricsChart'
import GlassCard from '../../components/GlassCard'

const actionLabels: Record<string, { label: string; color: string; bg: string }> = {
  raise: { label: 'Повышение', color: '#22C55E', bg: 'rgba(34,197,94,.15)' },
  lower: { label: 'Понижение', color: '#ef4444', bg: 'rgba(239,68,68,.15)' },
  pause: { label: 'Пауза', color: '#f59e0b', bg: 'rgba(245,158,11,.15)' },
  hold: { label: 'Без изменений', color: 'var(--text-secondary)', bg: 'rgba(255,255,255,.05)' },
  reallocate: { label: 'Перераспределение', color: '#06B6D4', bg: 'rgba(6,182,212,.15)' },
}

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery<CampaignDetailType>({
    queryKey: ['campaign', id],
    queryFn: () => fetchCampaignDetail(id!),
    refetchInterval: 30_000,
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="skeleton" style={{ width: 120, height: 36, marginBottom: 16, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: '60%', height: 28, marginBottom: 24, borderRadius: 8 }} />
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ flex: 1, height: 80, borderRadius: 'var(--radius)' }} />
          ))}
        </div>
        <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius)' }} />
        <div className="skeleton" style={{ height: 200, borderRadius: 'var(--radius)', marginTop: 24 }} />
      </motion.div>
    )
  }

  if (!data) return <div style={{ color: '#ef4444', textAlign: 'center', padding: 40 }}>Кампания не найдена</div>

  const chartData = data.stats.map(s => ({
    timestamp: s.timestamp,
    cpc: s.cpc,
    cpm: s.cpm,
    ctr: s.ctr,
    spend: s.spend,
    conversions: s.conversions + s.conversionsExternal,
  }))

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
      <button onClick={() => navigate('/dashboard/campaigns')} style={{
        background: 'none', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)',
        padding: '8px 16px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', marginBottom: 16, fontSize: 13,
        transition: 'all var(--transition)',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.05)'; e.currentTarget.style.color = 'var(--text-primary)' }}
        onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '' }}
      >
        ← Назад к кампаниям
      </button>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>{data.name}</h2>
        <span style={{
          padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
          background: data.status === 'active' ? 'rgba(34,197,94,.15)' : 'rgba(255,255,255,.05)',
          color: data.status === 'active' ? '#22C55E' : 'var(--text-secondary)',
        }}>
          {data.status === 'active' ? 'Активна' : data.status === 'paused' ? 'Пауза' : data.status}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Дневной бюджет', value: `${data.dailyBudget.toLocaleString('ru')} ₽` },
          { label: 'Целевой CPC', value: `${data.cpcTarget} ₽` },
          { label: 'Целевой CPO', value: `${data.cpoTarget} ₽` },
        ].map(m => (
          <GlassCard key={m.label} style={{ padding: '12px 16px', minWidth: 140 }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{m.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{m.value}</div>
          </GlassCard>
        ))}
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12, fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>
          Производительность
        </h3>
        <MetricsChart
          data={chartData as unknown as Array<{ timestamp: string } & Record<string, number>>}
          lines={[
            { key: 'cpc', color: '#22C55E', name: 'CPC' },
            { key: 'spend', color: '#f59e0b', name: 'Расход' },
            { key: 'conversions', color: '#06B6D4', name: 'Конверсии' },
          ]}
        />
      </div>

      <div>
        <h3 style={{ marginBottom: 12, fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>
          Журнал оптимизаций
        </h3>
        <div style={{
          background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 'var(--radius)', border: '1px solid var(--glass-border)', overflow: 'hidden',
        }}>
          {data.optimizations.length === 0 ? (
            <div style={{ padding: 20, color: 'var(--text-muted)', textAlign: 'center' }}>Оптимизаций ещё не было</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ position: 'sticky', top: 0, background: 'var(--bg-card)' }}>
                  {['Время', 'Действие', 'Причина', 'Изменение бюджета'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '12px 16px', fontSize: 11, color: 'var(--text-muted)',
                      borderBottom: '1px solid var(--glass-border)', fontWeight: 600, letterSpacing: '.5px',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.optimizations.map(o => {
                  const action = actionLabels[o.action] || { label: o.action, color: 'var(--text-secondary)', bg: 'rgba(255,255,255,.05)' }
                  return (
                    <tr key={o.id}>
                      <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                        {new Date(o.timestamp).toLocaleString('ru')}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid var(--glass-border)' }}>
                        <span style={{
                          display: 'inline-block', padding: '1px 6px', borderRadius: 3, fontSize: 11, fontWeight: 600,
                          background: action.bg, color: action.color,
                        }}>{action.label}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                        {o.reason}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid var(--glass-border)' }}>
                        {o.oldBudget != null && o.newBudget != null
                          ? `${o.oldBudget.toLocaleString('ru')} → ${o.newBudget.toLocaleString('ru')} ₽`
                          : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add dashboard/src/pages/dashboard/CampaignDetail.tsx
git commit -m "refactor: restyle CampaignDetail with glass cards, new accent colors, route-based navigation"
```

---

### Task 11: Restyle Settings page

**Files:**
- Modify: `dashboard/src/pages/dashboard/Settings.tsx`

Replace old card borders with glass backgrounds, update accent colors to emerald/cyan.

- [ ] **Step 1: Rewrite Settings.tsx**

`dashboard/src/pages/dashboard/Settings.tsx`:
```tsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../App'
import { fetchSettings, saveSetting, testTelegramConnection } from '../../api/client'
import GlassCard from '../../components/GlassCard'
import GlowButton from '../../components/GlowButton'

const themePresets = [
  { id: 'emerald', name: 'Изумрудный', primary: '#22C55E', secondary: '#06B6D4' },
  { id: 'blue-purple', name: 'Синий + Фиолетовый', primary: '#5b7dff', secondary: '#9c27b0' },
  { id: 'green-orange', name: 'Зелёный + Оранжевый', primary: '#4caf50', secondary: '#ff9800' },
  { id: 'rose-amber', name: 'Розовый + Янтарь', primary: '#e91e63', secondary: '#ffc107' },
]

export default function Settings() {
  const { primary, secondary, setTheme } = useTheme()
  const [customPrimary, setCustomPrimary] = useState(primary)
  const [customSecondary, setCustomSecondary] = useState(secondary)
  const [saved, setSaved] = useState(false)
  const [tgToken, setTgToken] = useState('')
  const [tgBaseUrl, setTgBaseUrl] = useState('https://api.telegram.org/ads/v1')
  const [tgStatus, setTgStatus] = useState<'idle' | 'testing' | 'ok' | 'error'>('idle')
  const [tgMessage, setTgMessage] = useState('')
  const [tgLoaded, setTgLoaded] = useState(false)

  useEffect(() => {
    fetchSettings().then(s => {
      if (s.telegram_api_token) setTgToken(s.telegram_api_token)
      if (s.telegram_api_base_url) setTgBaseUrl(s.telegram_api_base_url)
      setTgLoaded(true)
    }).catch(() => setTgLoaded(true))
  }, [])

  const handleSaveTg = async () => {
    setTgStatus('testing')
    setTgMessage('')
    try {
      await saveSetting('telegram_api_token', tgToken)
      await saveSetting('telegram_api_base_url', tgBaseUrl)
      const msg = await testTelegramConnection(tgToken, tgBaseUrl)
      setTgStatus('ok')
      setTgMessage(msg)
    } catch (e: any) {
      setTgStatus('error')
      setTgMessage(e.message)
    }
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const applyPreset = (preset: typeof themePresets[0]) => {
    setCustomPrimary(preset.primary)
    setCustomSecondary(preset.secondary)
    setTheme(preset.primary, preset.secondary)
    document.documentElement.removeAttribute('data-theme')
    localStorage.setItem('theme-preset', preset.id)
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg-primary)', border: '1px solid var(--glass-border)',
    color: 'var(--text-primary)', padding: '8px 12px',
    borderRadius: 'var(--radius-sm)', fontSize: 14, width: '100%', outline: 'none',
    transition: 'border-color var(--transition)',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6,
  }
  const sectionTitle: React.CSSProperties = {
    marginBottom: 16, fontSize: 15, fontWeight: 600, color: 'var(--accent-primary)',
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
      <h2 style={{ marginBottom: 24, fontSize: 20, fontWeight: 700 }}>Настройки</h2>

      {/* Theme */}
      <GlassCard style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={sectionTitle}>Оформление</h3>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Готовая тема</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {themePresets.map(p => (
              <button key={p.id} onClick={() => applyPreset(p)} style={{
                padding: '6px 14px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 500,
                background: p.id === 'emerald' ? '#22C55E' : `linear-gradient(135deg, ${p.primary}, ${p.secondary})`,
                color: p.id === 'emerald' ? '#000' : '#fff', border: 'none', cursor: 'pointer',
                transition: 'opacity .15s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >{p.name}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 150 }}>
            <label style={labelStyle}>Акцентный цвет 1</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={customPrimary}
                onChange={e => { setCustomPrimary(e.target.value); setTheme(e.target.value, customSecondary); localStorage.setItem('theme-preset', 'custom') }}
                style={{ width: 40, height: 40, border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'none' }}
              />
              <input style={inputStyle} type="text" value={customPrimary} readOnly />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 150 }}>
            <label style={labelStyle}>Акцентный цвет 2</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={customSecondary}
                onChange={e => { setCustomSecondary(e.target.value); setTheme(customPrimary, e.target.value); localStorage.setItem('theme-preset', 'custom') }}
                style={{ width: 40, height: 40, border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'none' }}
              />
              <input style={inputStyle} type="text" value={customSecondary} readOnly />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Telegram Ads */}
      <GlassCard style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={sectionTitle}>Telegram Ads</h3>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>API Токен</label>
          <input style={inputStyle} type="password" value={tgToken}
            onChange={e => setTgToken(e.target.value)} placeholder="Введите токен из ads.telegram.org" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>API URL</label>
          <input style={inputStyle} type="text" value={tgBaseUrl}
            onChange={e => setTgBaseUrl(e.target.value)} />
        </div>
        <GlowButton onClick={handleSaveTg} disabled={!tgLoaded || !tgToken}>
          {tgStatus === 'testing' ? 'Проверка...' : 'Сохранить и проверить'}
        </GlowButton>
        {tgStatus === 'ok' && (
          <div style={{ color: '#22C55E', fontSize: 13, marginTop: 8 }}>✓ {tgMessage}</div>
        )}
        {tgStatus === 'error' && (
          <div style={{ color: '#ef4444', fontSize: 13, marginTop: 8 }}>✕ {tgMessage}</div>
        )}
      </GlassCard>

      {/* Optimization targets */}
      <GlassCard style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={sectionTitle}>Цели оптимизации</h3>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Целевой CPC (₽)</label>
          <input style={inputStyle} type="number" step="0.01" defaultValue={0.5} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Целевой CPO (₽)</label>
          <input style={inputStyle} type="number" step="0.1" defaultValue={10} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Мин. CTR (%)</label>
          <input style={inputStyle} type="number" step="0.1" defaultValue={0.5} />
        </div>
      </GlassCard>

      {/* PID */}
      <GlassCard style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={sectionTitle}>PID-регулятор</h3>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Kp (Пропорциональный)</label>
          <input style={inputStyle} type="number" step="0.01" defaultValue={0.1} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Ki (Интегральный)</label>
          <input style={inputStyle} type="number" step="0.001" defaultValue={0.01} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Kd (Дифференциальный)</label>
          <input style={inputStyle} type="number" step="0.01" defaultValue={0.05} />
        </div>
      </GlassCard>

      {/* Schedule */}
      <GlassCard style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={sectionTitle}>Расписание</h3>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Интервал оптимизации (мин)</label>
          <input style={inputStyle} type="number" step="5" defaultValue={15} />
        </div>
      </GlassCard>

      <GlowButton onClick={handleSave}>
        {saved ? 'Сохранено ✓' : 'Сохранить настройки'}
      </GlowButton>
    </motion.div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add dashboard/src/pages/dashboard/Settings.tsx
git commit -m "refactor: restyle Settings with glass cards and GlowButton"
```

---

### Task 12: Update tsconfig to allow the new directory structure

**Files:**
- Modify: `dashboard/tsconfig.json` (if needed)

Check that the project compiles with the new file layout.

- [ ] **Step 1: Build and check for errors**

```bash
cd dashboard && npx tsc --noEmit
```

Fix any import path issues if they arise.

- [ ] **Step 2: Full build**

```bash
cd dashboard && npm run build
```

Expected: clean build.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: fix build after redesign restructure"
```

---

### Task 13: Deploy to Vercel

- [ ] **Step 1: Push to GitHub**

```bash
git push
```

Wait for Vercel auto-deploy.

- [ ] **Step 2: Verify deployment**

Open `https://marketing-agent-liart.vercel.app` and confirm:
- Landing page loads with Hero animation
- Login works
- Dashboard shows with new glass design

- [ ] **Step 3: Tag release**

```bash
git tag v0.3.0-redesign
git push origin v0.3.0-redesign
```

---

## Spec Coverage Check

| Spec section | Tasks |
|---|---|
| Design system (palette, typography, glassmorphism) | Task 2 (index.html CSS) |
| Framer Motion animations | Task 3 (shared components), Tasks 7-11 (page restyles) |
| Hero with live dashboard mockup | Task 4 Step 1 (Hero.tsx) |
| Trusted by logos | Task 4 Step 2 |
| Create Content feature section | Task 4 Step 3 |
| Launch Campaigns feature section | Task 4 Step 4 |
| Analyze Competitors bento grid | Task 4 Step 5 |
| Automation workflow timeline | Task 4 Step 6 |
| Metrics counters | Task 4 Step 7 |
| Testimonials cards | Task 4 Step 8 |
| Pricing 3-tier | Task 4 Step 9 |
| Footer | Task 4 Step 10 |
| Landing parent page | Task 4 Step 11 |
| Router setup (/, /login, /dashboard/*) | Task 5 |
| DashboardLayout glass navbar | Task 6 |
| Login restyle | Task 7 |
| Overview restyle | Task 8 |
| Campaigns restyle | Task 9 |
| CampaignDetail restyle | Task 10 |
| Settings restyle | Task 11 |
| Build verification | Task 12 |
| Deploy | Task 13 |
