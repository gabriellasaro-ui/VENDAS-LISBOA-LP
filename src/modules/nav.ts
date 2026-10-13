import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { $, $$, isTyping } from '../lib/dom'
import { store } from '../lib/store'
import type { PlanId } from '../data'
import { scrollToEl } from './smooth'

export function initNav() {
  const nav = $('.nav')
  const bar = $('.progress i')
  const sections = $$('main > section[data-section]')

  // Seção atual (para navegar com o teclado)
  let current = 0
  sections.forEach((s, i) => {
    ScrollTrigger.create({
      trigger: s,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => self.isActive && (current = i)
    })
  })

  // Barra de progresso + nav some ao descer e volta ao subir
  let lastY = 0
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      bar.style.setProperty('--p', self.progress.toFixed(4))
      const y = self.scroll()
      // Some durante a abertura e ao descer; volta ao subir
      const inOpening = y < window.innerHeight * 0.6
      if (inOpening || (y > lastY + 2)) nav.classList.add('is-hidden')
      else if (y < lastY - 2) nav.classList.remove('is-hidden')
      lastY = y
    }
  })

  // Teclado: ← → navegam por seção · 1 2 3 escolhem plano
  nav.classList.add('is-hidden')
  window.addEventListener('keydown', (e) => {
    if (isTyping(e) || e.metaKey || e.ctrlKey || e.altKey) return
    if ($('.open').dataset.state === 'start') return
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      scrollToEl(sections[Math.min(sections.length - 1, current + 1)])
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      scrollToEl(sections[Math.max(0, current - 1)])
    } else if (['1', '2', '3'].includes(e.key) && !e.shiftKey) {
      store.set({ plan: Number(e.key) as PlanId })
    }
  })
}
