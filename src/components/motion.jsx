import { useEffect, useRef, useState } from 'react'

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/* True once the element has entered the viewport. */
// eslint-disable-next-line react-refresh/only-export-components
export function useInView(options = { rootMargin: '0px 0px -10% 0px' }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (inView) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect() } }, options)
    io.observe(el)
    return () => io.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return [ref, inView]
}

/* Fades and lifts its children in when scrolled into view. `delay` staggers siblings (ms). */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, inView] = useInView()
  return <Tag ref={ref} className={`reveal ${inView ? 'is-in' : ''} ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined} {...rest}>{children}</Tag>
}

// Indian digit grouping, e.g. 1,80,000
const fmt = (n) => n.toLocaleString('en-IN')

/* Counts up to a verified figure the first time it is seen. Non-numeric values render as-is. */
export function CountUp({ v, prefix = '', suffix = '', duration = 1400 }) {
  const [ref, inView] = useInView()
  const numeric = typeof v === 'number'
  const instant = !numeric || reduced()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView || instant) return
    let raf, start
    const tick = (t) => {
      start ??= t
      const p = Math.min(1, (t - start) / duration)
      setN(Math.round(v * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, v, instant, duration])
  return (
    <span ref={ref} className="tabular-nums">
      <span aria-hidden={numeric || undefined}>{prefix}{!numeric ? v : fmt(instant ? v : n)}{suffix}</span>
      {numeric && <span className="sr-only">{prefix}{fmt(v)}{suffix}</span>}
    </span>
  )
}

/* Subtle parallax: the child drifts up to ±`strength`% as the frame crosses the viewport.
   The child is scaled so the drift never reveals an edge. Transform-only; off for reduced motion. */
export function Parallax({ children, className = '', strength = 4 }) {
  const ref = useRef(null)
  const inner = useRef(null)
  useEffect(() => {
    if (reduced()) return
    let raf = 0
    const tick = () => {
      raf = 0
      const el = ref.current, c = inner.current
      if (!el || !c) return
      const r = el.getBoundingClientRect()
      const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - innerHeight / 2) / innerHeight))
      c.style.transform = `translate3d(0, ${(-p * strength).toFixed(2)}%, 0) scale(${1 + strength / 50})`
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick(); addEventListener('scroll', on, { passive: true }); addEventListener('resize', on)
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [strength])
  return <div ref={ref} className={className}><div ref={inner} className="will-change-transform">{children}</div></div>
}

/* Thin progress line at the very top of long pages. */
export function ReadingProgress() {
  const bar = useRef(null)
  useEffect(() => {
    let raf = 0
    const tick = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - innerHeight
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick(); addEventListener('scroll', on, { passive: true }); addEventListener('resize', on)
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [])
  return <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[3px]"><div ref={bar} className="h-full origin-left bg-gradient-to-r from-brand via-brand to-blue" style={{ transform: 'scaleX(0)' }} /></div>
}
