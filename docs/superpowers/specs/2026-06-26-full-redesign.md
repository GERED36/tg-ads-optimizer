# Full Redesign: AI Marketing Agent Landing + Dashboard

## Scope
Transform the existing `tg-ads-optimizer` SPA into a two-part product:
- **Public Landing Page** (`/`) — Hero, Features, Workflow, Metrics, Testimonials, Pricing, Footer
- **Authenticated Dashboard** (`/dashboard/*`) — Overview, Campaigns, CampaignDetail, Settings

Both share the same design system, same build, same deployment.

## Design System

### Palette
| Role | Value |
|------|-------|
| Background | `#070707` |
| Cards / surfaces | `#111111` |
| Border | `rgba(255,255,255,.08)` |
| Primary text | `#FFFFFF` |
| Secondary text | `#9CA3AF` |
| Accent primary | `#22C55E` (emerald) |
| Accent secondary | `#06B6D4` (cyan) |
| Accent glow | `0 0 24px rgba(34,197,94,.25)` |

### Typography
- Font: `Inter` (Google Fonts), fallback system-ui
- Headings: 64–72px, 700–800 weight
- Body: 14–16px, 400–500 weight
- Monospace numbers for metrics

### Glassmorphism
- Card background: `rgba(17,17,17,.8)`
- Backdrop blur: `blur(20px)` on navbars, modals, floating elements
- Border: `1px solid rgba(255,255,255,.08)`
- Subtle inner shadow on hover

### Animations (Framer Motion)
- `fade-up` — elements fade + translateY on scroll
- `stagger` — children animate in sequence
- `scale(1.02)` + glow on hover for cards
- Shimmer line on buttons (left→right)
- Number counters in Metrics section
- Parallax for background blobs
- Cursor glow follower (landing only)
- Magnetic button effect (optional)

## Page Structure

### 1. Landing Page (`/`)

#### 1.1 Hero
- Full viewport height
- Subtle grid background (`rgba(255,255,255,.02)` lines)
- Large blurred circles (emerald/cyan, ~600px, opacity 0.08)
- Left: heading "Marketing. Completely autonomous." (72px, 800)
- Subtitle: "Create campaigns. Analyze competitors. Generate content. Launch ads. All without hiring a marketing team."
- Two buttons: "Start Free" (primary filled) / "Watch Demo" (ghost with shimmer)
- Right: live AI Dashboard mockup panel (animated checklist)
  - Items appear sequentially every 800ms:
    - ✓ Campaign generated
    - ✓ Landing page optimized
    - ✓ SEO completed
    - ✓ Competitor analyzed
    - ✓ 18 new leads
    - ✓ Ad budget optimized
  - Panel has glass background, subtle border

#### 1.2 Trusted By
- "Trusted by modern companies" centered
- Row of monochrome logo placeholders (7 items)
- Auto-scroll animation (optional)

#### 1.3 Feature Sections (alternating layout)

**1.3.1 Create Content**
- Left: text block describing AI content generation
- Right: mini mockup of content editor interface
- Glass card with animated typing cursor

**1.3.2 Launch Campaigns**
- Right: text
- Left: analytics mini-panel with animated metrics

**1.3.3 Analyze Competitors**
- Full-width bento grid:
  - Graphs (mini chart)
  - AI Insight callout
  - SEO score
  - Keyword table
  - Heatmap placeholder
  - Traffic line

**1.3.4 Automation Workflow**
- Full-width vertical timeline:
  Research → Content → Landing → Ads → Analytics → Optimization
  Connected by animated lines (draw SVG path on scroll)
  Each node has a glass card, icon, short description

#### 1.4 Metrics Strip
- 4 large numbers with counters (spring animation)
- Each: value (animated from 0), label, small context
- Metric 1: 400% — Average ROI
- Metric 2: 18M — Generated words
- Metric 3: 52K — Campaigns
- Metric 4: 98% — Client satisfaction
- Scroll-triggered counter animation via `useInView`

#### 1.5 Testimonials
- 3 glass cards in a row
- Each: star rating (★★★★★), quote, author name, company
- Design: chat/comment card style
- "We replaced two marketers with one AI agent. — Founder, BluePixel"

#### 1.6 Pricing
- 3 cards (Starter / Pro / Enterprise)
- Pro card highlighted (slightly larger, glow border)
- Minimal: price, key feature list, CTA button
- No feature comparison table

#### 1.7 Footer
- Large logo/name
- Row of links (Product, Company, Legal, Contact)
- Social icons (placeholder)
- Copyright line
- Minimal, no columns

### 2. Auth (`/login`)
- Same dark glass design
- Centered card with logo, password field, submit button
- On success → redirect to `/dashboard`

### 3. Dashboard (`/dashboard/*`)

#### 3.1 Global
- Sticky top navbar with glass background (blur)
- Left: logo + "Маркетинговый агент"
- Center: nav links (Обзор, Кампании, Настройки)
- Right: user menu (кнопка выхода)
- Active link: accent color + subtle glow

#### 3.2 Overview
- 6 KPICards in 3×2 grid (or 6 in a row on wide)
  - Total Spend, Avg CPC, Avg CPM, Avg CPO, Conversions, Active Campaigns
- Each card: glass bg, top accent bar (gradient), large mono number, secondary label
- Skeleton loading state (pulse animation)
- Below: MetricsChart (AreaChart with gradient fill)
- All labels in Russian

#### 3.3 Campaigns
- Table with glass header (sticky)
- Columns: Название, Статус, Дневной бюджет, CPC, CTR, CPM, CPO, Конверсии, Расход
- Status badges: Активна (green) / Пауза (amber)
- Row hover: `scale(1.01)` + subtle glow
- ₽ formatting for monetary values

#### 3.4 Campaign Detail
- Back button, campaign name heading
- Stats chart
- Optimization log table
- Action buttons

#### 3.5 Settings
- Theme section (4 glass preset buttons + color pickers)
- Telegram API section (token input + test button)
- PID coefficients, optimization targets, schedule
- Save button with shimmer animation

### 4. Component Tree (new)

```
Landing/
  Hero.tsx              — heading, subtitle, CTA, live mockup
  TrustedBy.tsx         — logo strip
  Features/
    CreateContent.tsx   — text + editor mockup
    LaunchCampaigns.tsx — text + analytics mockup
    AnalyzeCompetitors.tsx — bento grid
    AutomationFlow.tsx  — timeline
  MetricsStrip.tsx      — animated counters
  Testimonials.tsx      — review cards
  Pricing.tsx           — 3-tier cards
  Footer.tsx            — minimal footer

Dashboard/
  Layout.tsx            — glass navbar + outlet
  Overview.tsx          — KPICards + chart
  Campaigns.tsx         — table
  CampaignDetail.tsx    — detail + chart + log
  Settings.tsx          — settings form

Shared/
  GlassCard.tsx         — reusable glass card wrapper
  GlowButton.tsx        — button with shimmer effect
  AnimatedCounter.tsx   — number counter animation
  SectionHeading.tsx    — consistent section header
  GradientBorder.tsx    — animated gradient border wrapper
```

## Tech Decisions

- **react-router-dom v6** for routing (BrowserRouter)
- **Framer Motion** for all animations
- **Inter** from Google Fonts (already in index.html)
- **CSS custom properties** for theme (no CSS-in-JS library)
- No external icon library — inline SVG or minimal heroicons
- Dashboard API calls remain unchanged (`/api/*`)
- Auth flow unchanged (JWT, AuthGuard in Layout)

## Migration Path

1. Install react-router-dom + framer-motion
2. Create `Landing/` components (Hero → Footer)
3. Create shared `GlassCard`, `GlowButton`, `AnimatedCounter`
4. Refactor `App.tsx` → router-based with `<Routes>`
5. Restyle all existing dashboard pages with new glass design system
6. Update `index.html` CSS variables to new palette
7. Build + deploy

## Out of Scope (for this iteration)
- i18n (Russian only for dashboard, English for landing)
- Actual payment integration (pricing is informational)
- User registration (single password auth stays)
- Mobile responsive (desktop-first, tablet ok)
