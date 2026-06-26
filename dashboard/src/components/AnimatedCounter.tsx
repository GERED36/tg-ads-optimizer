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
