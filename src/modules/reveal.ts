import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { $$, reducedMotion } from '../lib/dom'
import { int } from '../lib/format'

export function initReveals() {
  if (reducedMotion()) return

  // Títulos: linhas sobem por trás de uma máscara
  $$('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'line',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 115,
          rotate: 2,
          duration: 1.3,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 86%', once: true }
        })
    })
  })

  // Números contam a partir de zero
  $$('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count)
    const o = { v: 0 }
    gsap.to(o, {
      v: end,
      duration: 1.8,
      ease: 'power3.out',
      onUpdate: () => (el.textContent = int(o.v)),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    })
  })

  // Blocos genéricos
  const groups = [
    '.who__map',
    '.who__stats li',
    '.badges',
    '.marquee',
    '.mission__list li',
    '.pillar',
    '.steps',
    '.product__chips li',
    '.def',
    '.flow3d',
    '.deliv__ctrl',
    '.row-head > :last-child',
    '.ee__card',
    '.ee__foot',
    '.plan',
    '.always',
    '.up__chart',
    '.fee',
    '.routes .route',
    '.combo__stage > *',
    '.mx__scroll',
    '.prop__form fieldset',
    '.ticket'
  ]
  groups.forEach((sel) => {
    const els = $$(sel)
    if (!els.length) return
    revealGroup(els)
  })
}

function revealGroup(els: HTMLElement[]) {
  gsap.set(els, { y: 50, opacity: 0 })
  els.forEach((el, i) => {
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      delay: (i % 4) * 0.08,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true }
    })
  })
}
