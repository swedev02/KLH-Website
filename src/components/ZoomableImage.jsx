import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Maximize2, Minus, Plus, RotateCcw, X } from 'lucide-react'
import { klh } from '../assets'
import { Img } from './ui'

/* A large chart kept as one image (e.g. the KLEF organogram), viewable up close:
   - the whole chart shows at first, at the size it always had on the page
   - pinch or Ctrl+scroll to zoom, drag to pan, double-tap/double-click to zoom in and back out
   - buttons: zoom out, zoom in, reset, full screen (a full-window viewer where the Fullscreen API isn't available, e.g. iPhone)
   - the full-resolution file downloads only once someone zooms in: `sizes` grows with the zoom, so the browser picks a larger AVIF
   No animation during gestures; button zooms ease over 0.18s (none with reduced motion). */

const MAX_ZOOM = 6

function Stage({ p, alt, full, onFullscreen, onClose }) {
  const i = klh(p, alt)
  const box = useRef(null), layer = useRef(null)
  const view = useRef({ s: 1, x: 0, y: 0 })
  const base = useRef({ w: 0, h: 0, cw: 0, ch: 0 })
  const [scale, setScale] = useState(1)          // for the % label and touch-action
  const [peak, setPeak] = useState(1)            // largest zoom so far, so `sizes` asks for a sharper file
  const [baseW, setBaseW] = useState(0)

  // the image's fitted size inside the frame ("contain"), and keeping the view inside it
  const clamp = (s, x, y) => {
    const { w, h, cw, ch } = base.current
    const fx = (v, content, frame) => content <= frame ? (frame - content) / 2 : Math.min(0, Math.max(frame - content, v))
    return { s, x: fx(x, w * s, cw), y: fx(y, h * s, ch) }
  }
  const apply = (v, animate) => {
    view.current = v
    const el = layer.current; if (!el) return
    el.style.transition = animate && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'transform .18s ease-out' : 'none'
    el.style.transform = `translate3d(${v.x}px, ${v.y}px, 0) scale(${v.s})`
  }
  const settle = () => { setScale(view.current.s); setPeak(p => Math.max(p, view.current.s)) }

  const measure = useCallback(() => {
    const el = box.current; if (!el) return
    const cw = el.clientWidth, ch = el.clientHeight, fit = Math.min(cw / i.w, ch / i.h)
    base.current = { w: i.w * fit, h: i.h * fit, cw, ch }
    setBaseW(Math.round(i.w * fit))
    apply(clamp(view.current.s, view.current.x, view.current.y))
  }, [i.w, i.h])
  useLayoutEffect(() => {
    measure()
    const ro = new ResizeObserver(measure); ro.observe(box.current)
    return () => ro.disconnect()
  }, [measure])

  // zoom to scale s keeping the point (px, py) of the frame still
  const zoomAt = (s, px, py, animate) => {
    const v = view.current, ns = Math.min(MAX_ZOOM, Math.max(1, s))
    apply(clamp(ns, px - (px - v.x) * (ns / v.s), py - (py - v.y) * (ns / v.s)), animate)
    settle()
  }
  const centre = () => [base.current.cw / 2, base.current.ch / 2]
  const zoomBy = (f) => zoomAt(view.current.s * f, ...centre(), true)
  const reset = () => { apply(clamp(1, 0, 0), true); settle() }

  // Ctrl+wheel (and trackpad pinch) zooms on the page; in full screen any wheel zooms
  useEffect(() => {
    const el = box.current
    const onWheel = (e) => {
      if (!full && !e.ctrlKey) return
      e.preventDefault()
      const r = el.getBoundingClientRect()
      zoomAt(view.current.s * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)), e.clientX - r.left, e.clientY - r.top)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [full])

  // pointers: one drags (when zoomed), two pinch; a quick second tap toggles zoom
  const pts = useRef(new Map()), g = useRef(null), tap = useRef({ t: 0, x: 0, y: 0 }), down = useRef(null)
  const pos = (e) => { const r = box.current.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
  const startGesture = () => {
    const v = view.current, list = [...pts.current.values()]
    if (list.length >= 2) {
      const [a, b] = list, mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
      g.current = { type: 'pinch', d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, s0: v.s, cx: (mx - v.x) / v.s, cy: (my - v.y) / v.s }
    } else if (list.length === 1 && v.s > 1) g.current = { type: 'pan', sx: list[0].x, sy: list[0].y, x0: v.x, y0: v.y }
    else g.current = null
  }
  const onDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    if (e.target.closest('button')) return
    try { box.current.setPointerCapture(e.pointerId) } catch { /* keep following the gesture without capture */ }
    const q = pos(e); pts.current.set(e.pointerId, q)
    if (pts.current.size === 1) down.current = { ...q, t: e.timeStamp, moved: false }
    startGesture()
  }
  const onMove = (e) => {
    if (!pts.current.has(e.pointerId)) return
    const q = pos(e); pts.current.set(e.pointerId, q)
    if (down.current && Math.hypot(q.x - down.current.x, q.y - down.current.y) > 6) down.current.moved = true
    const gs = g.current; if (!gs) return
    if (gs.type === 'pan') apply(clamp(view.current.s, gs.x0 + q.x - gs.sx, gs.y0 + q.y - gs.sy))
    else {
      const [a, b] = [...pts.current.values()], mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
      const s = Math.min(MAX_ZOOM, Math.max(1, gs.s0 * Math.hypot(a.x - b.x, a.y - b.y) / gs.d0))
      apply(clamp(s, mx - gs.cx * s, my - gs.cy * s))
    }
  }
  const onUp = (e) => {
    if (!pts.current.has(e.pointerId)) return
    pts.current.delete(e.pointerId)
    const d = down.current
    if (pts.current.size === 0 && d && !d.moved && e.timeStamp - d.t < 300 && e.type === 'pointerup') {
      const t = tap.current
      if (e.timeStamp - t.t < 320 && Math.hypot(d.x - t.x, d.y - t.y) < 30) { zoomAt(view.current.s > 1.05 ? 1 : 2.5, d.x, d.y, true); tap.current = { t: 0 } }
      else tap.current = { t: e.timeStamp, x: d.x, y: d.y }
    }
    startGesture()
    if (!pts.current.size) settle()
  }

  const onKey = (e) => {
    if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomBy(1.5) }
    else if (e.key === '-') { e.preventDefault(); zoomBy(1 / 1.5) }
    else if (e.key === '0') { e.preventDefault(); reset() }
  }

  const btn = 'grid h-10 w-10 place-items-center rounded-full text-ink-2 transition-colors hover:bg-surface hover:text-navy disabled:opacity-35 disabled:hover:bg-transparent'
  return (
    <div ref={box} tabIndex={0} onKeyDown={onKey} aria-label={`${alt}. Use the zoom buttons, plus and minus keys, or pinch to zoom; drag to move.`}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onDragStart={e => e.preventDefault()}
      className={`relative select-none overflow-hidden bg-white outline-none focus-visible:ring-2 focus-visible:ring-blue/50 ${full ? 'h-full w-full' : 'rounded-[12px] border border-line'} ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
      style={{ touchAction: scale > 1 || full ? 'none' : 'pan-y', ...(full ? {} : { aspectRatio: `${i.w} / ${i.h}` }) }}>
      <div ref={layer} className="absolute left-0 top-0 origin-top-left will-change-transform" style={{ width: baseW || '100%' }}>
        <Img p={p} alt={alt} fit="natural" loader="content" eager={full} sizes={`${Math.ceil((baseW || 800) * peak)}px`} />
      </div>
      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-0.5 rounded-full border border-line bg-white/95 p-1 shadow-[0_8px_24px_-12px_rgba(10,26,51,.35)] backdrop-blur-sm">
        <button type="button" onClick={() => zoomBy(1 / 1.5)} disabled={scale <= 1.001} aria-label="Zoom out" className={btn}><Minus size={17} /></button>
        <span className="w-12 text-center font-mono text-[12px] tabular-nums text-muted" aria-live="polite">{Math.round(scale * 100)}%</span>
        <button type="button" onClick={() => zoomBy(1.5)} disabled={scale >= MAX_ZOOM - 0.001} aria-label="Zoom in" className={btn}><Plus size={17} /></button>
        <button type="button" onClick={reset} disabled={scale <= 1.001} aria-label="Reset zoom" className={btn}><RotateCcw size={16} /></button>
        {full
          ? <button type="button" onClick={onClose} aria-label="Exit full screen" className={btn}><X size={18} /></button>
          : <button type="button" onClick={onFullscreen} aria-label="View full screen" className={btn}><Maximize2 size={16} /></button>}
      </div>
    </div>
  )
}

export default function ZoomableImage({ p, alt = '', caption }) {
  const [full, setFull] = useState(false)
  const shell = useRef(null)
  const open = () => setFull(true)
  const close = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {})
    setFull(false)
  }, [])
  useEffect(() => {
    if (!full) return
    const el = shell.current
    el?.requestFullscreen?.().catch(() => {})                    // true full screen where allowed; the overlay covers the window either way
    const onChange = () => { if (!document.fullscreenElement) setFull(false) }
    const onEsc = (e) => { if (e.key === 'Escape') close() }
    document.addEventListener('fullscreenchange', onChange)
    window.addEventListener('keydown', onEsc)
    const o = document.body.style.overflow; document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('fullscreenchange', onChange); window.removeEventListener('keydown', onEsc); document.body.style.overflow = o }
  }, [full, close])
  return (
    <figure className="my-8">
      <Stage p={p} alt={alt} onFullscreen={open} />
      <figcaption className="mt-3 text-[13.5px] text-muted">{caption || 'Pinch or use the + button to zoom in, then drag to move around. Full screen shows the chart at its largest.'}</figcaption>
      {full && (
        <div ref={shell} role="dialog" aria-modal="true" aria-label={alt} className="fixed inset-0 z-[90] flex flex-col bg-white">
          <div className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-line px-4">
            <p className="min-w-0 truncate font-display text-[15px] font-semibold text-navy">{alt}</p>
            <button type="button" onClick={close} aria-label="Close" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-ink-2 hover:text-navy"><X size={18} /></button>
          </div>
          <div className="min-h-0 flex-1 pb-[env(safe-area-inset-bottom)]"><Stage p={p} alt={alt} full onClose={close} /></div>
        </div>
      )}
    </figure>
  )
}
