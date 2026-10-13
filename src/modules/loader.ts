import gsap from 'gsap'
import { $, reducedMotion } from '../lib/dom'

/** Contador 00 → 100 que acompanha fontes + imagens críticas e abre a cortina. */
export function runLoader(ready: Promise<unknown>): Promise<void> {
  const root = $('.loader')
  const num = $('[data-loader-num]')
  const bar = $('.loader__bar i')

  if (reducedMotion()) {
    root.remove()
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const prog = { v: 0 }
    let done = false
    ready.then(() => (done = true))

    const render = () => {
      num.textContent = String(Math.round(prog.v)).padStart(2, '0')
      bar.style.setProperty('--p', String(prog.v / 100))
    }

    // Avança até 86 sozinho; o resto espera os assets.
    const t1 = gsap.to(prog, { v: 86, duration: 1.5, ease: 'power2.out', onUpdate: render })

    const finish = () => {
      t1.kill()
      gsap
        .timeline({ onComplete: () => { root.remove(); resolve() } })
        .to(prog, { v: 100, duration: 0.45, ease: 'power2.inOut', onUpdate: render })
        .to(num, { yPercent: -110, duration: 0.7, ease: 'expo.in' }, '+=0.1')
        .to('.loader__brand, .loader__bar', { opacity: 0, duration: 0.3 }, '<')
        .to(root, { clipPath: 'inset(0% 0% 100% 0% round 0px 0px 80px 80px)', duration: 1.1, ease: 'expo.inOut' }, '-=0.15')
    }

    const wait = () => (done && t1.progress() > 0.6 ? finish() : requestAnimationFrame(wait))
    wait()
    // Nunca segura a página por mais de 4s
    window.setTimeout(() => { done = true }, 4000)
  })
}
