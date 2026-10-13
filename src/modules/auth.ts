import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { $, reducedMotion } from '../lib/dom'
import { authority, clientLogos } from '../data'

export function initAuth() {
  const list = $('[data-auth-stats]')
  list.innerHTML = authority
    .map(
      (a) => `<li><b class="display"><small>${a.prefix.trim()}</small><span data-v="${a.value}">${a.value}</span>${a.suffix ? `<small>${a.suffix.trim()}</small>` : ''}</b><span>${a.label}</span></li>`
    )
    .join('')

  if (!reducedMotion()) {
    list.querySelectorAll<HTMLElement>('[data-v]').forEach((el, i) => {
      const o = { v: 0 }
      gsap.to(o, {
        v: Number(el.dataset.v),
        duration: 2,
        delay: i * 0.12,
        ease: 'power3.out',
        onUpdate: () => (el.textContent = String(Math.round(o.v))),
        scrollTrigger: { trigger: list, start: 'top 90%', once: true }
      })
    })
  }

  // Dois trilhos de logos em sentidos opostos, que aceleram com a rolagem
  const logos = (names: string[]) => names.map((n) => `<img src="/logos/${n}.svg" alt="${n}" loading="lazy" height="30" />`).join('')
  const half = Math.ceil(clientLogos.length / 2)
  const rowA = clientLogos
  const rowB = [...clientLogos.slice(half), ...clientLogos.slice(0, half)].reverse()
  const trackA = $('[data-marquee]')
  const trackB = $('[data-marquee-rev]')
  trackA.innerHTML = logos(rowA) + logos(rowA)
  trackB.innerHTML = logos(rowB) + logos(rowB)
  if (reducedMotion()) return

  const loopA = gsap.to(trackA, { xPercent: -50, duration: 50, ease: 'none', repeat: -1 })
  const loopB = gsap.fromTo(trackB, { xPercent: -50 }, { xPercent: 0, duration: 56, ease: 'none', repeat: -1 })
  ScrollTrigger.create({
    trigger: trackA,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      const boost = gsap.utils.clamp(1, 6, Math.abs(self.getVelocity()) / 280)
      ;[loopA, loopB].forEach((loop) => {
        gsap.to(loop, { timeScale: boost, duration: 0.25, overwrite: true })
        gsap.to(loop, { timeScale: 1, duration: 1.4, delay: 0.25, ease: 'power2.out' })
      })
    }
  })
}
