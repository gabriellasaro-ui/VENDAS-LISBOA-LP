import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reducedMotion } from '../lib/dom'

let lenis: Lenis | null = null

export function initSmooth() {
  if (!reducedMotion()) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, touchMultiplier: 1.4 })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((t) => lenis?.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)
    lenis.stop()
  }

  // Âncoras internas passam pelo Lenis
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
    if (!a) return
    const id = a.getAttribute('href')!
    if (id.length < 2) return
    const el = document.querySelector(id)
    if (!el) return
    e.preventDefault()
    scrollToEl(el as HTMLElement)
  })
}

export function scrollToEl(el: HTMLElement) {
  if (lenis) lenis.scrollTo(el, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) })
  else el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' })
}

export const startScroll = () => lenis?.start()
export const getLenis = () => lenis
