import gsap from 'gsap'
import { $$, finePointer, reducedMotion } from '../lib/dom'

export function initInteractions() {
  if (!finePointer() || reducedMotion()) return
  initMagnetic()
  initTilt()
  initGlow()
}

/** Luz que acompanha o mouse dentro dos painéis vermelhos. */
function initGlow() {
  document.addEventListener('pointermove', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-glow]')
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--gx', `${e.clientX - r.left}px`)
    el.style.setProperty('--gy', `${e.clientY - r.top}px`)
  }, { passive: true })
}

/** Botões que acompanham o mouse com elástico. */
function initMagnetic() {
  $$('[data-magnetic]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      x((e.clientX - (r.left + r.width / 2)) * 0.28)
      y((e.clientY - (r.top + r.height / 2)) * 0.38)
    })
    el.addEventListener('pointerleave', () => { x(0); y(0) })
  })
}

/** Cards que inclinam em 3D na direção do mouse — mais sutil quanto maior o card. */
function initTilt() {
  $$('[data-tilt]').forEach((el) => {
    gsap.set(el, { transformPerspective: 900 })
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.7, ease: 'power3.out' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.7, ease: 'power3.out' })
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      const max = Math.min(10, 2600 / r.width)
      ry(((e.clientX - r.left) / r.width - 0.5) * max * 2)
      rx(-((e.clientY - r.top) / r.height - 0.5) * max * 2)
    })
    el.addEventListener('pointerleave', () => { rx(0); ry(0) })
  })
}
