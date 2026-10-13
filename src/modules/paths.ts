import gsap from 'gsap'
import { $, $$, reducedMotion } from '../lib/dom'
import { store, type Path } from '../lib/store'

export function initPaths() {
  const tabsWrap = $('[data-path-tabs]')
  const tabs = $$<HTMLButtonElement>('.tab', tabsWrap)
  const routes = $$('[data-route]')

  const choose = (path: Path) => store.set({ path, mode: path === 'A' ? 'combo' : 'direct' })
  tabs.forEach((t) => t.addEventListener('click', () => choose(t.dataset.path as Path)))
  routes.forEach((r) => {
    r.addEventListener('click', () => choose(r.dataset.route as Path))
    r.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        choose(r.dataset.route as Path)
      }
    })
  })

  let first = true
  store.on((s, prev) => {
    if (!first && s.path === prev.path) return
    tabsWrap.style.setProperty('--i', s.path === 'A' ? '0' : '1')
    tabs.forEach((t) => {
      const on = t.dataset.path === s.path
      t.classList.toggle('is-active', on)
      t.setAttribute('aria-selected', String(on))
    })
    routes.forEach((r) => {
      const on = r.dataset.route === s.path
      r.classList.toggle('is-active', on)
      r.setAttribute('aria-pressed', String(on))
      if (on && !first && !reducedMotion()) {
        gsap.fromTo(
          r.querySelectorAll('.route__title, .route__for, .flow__step, .route__facts li'),
          { y: 14, opacity: 0.4 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: 'expo.out', overwrite: true }
        )
      }
    })
    first = false
  })
}
