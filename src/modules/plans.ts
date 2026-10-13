import gsap from 'gsap'
import { $, $$, reducedMotion } from '../lib/dom'
import { store } from '../lib/store'
import { plans, type Plan, type PlanId } from '../data'
import { brlSmart, int, moneySmart } from '../lib/format'

interface Metric {
  label: string
  value: (p: Plan) => string
  /** 0–1 para barra contínua */
  bar?: (p: Plan) => number
  /** [ligados, total] para barra segmentada */
  steps?: (p: Plan) => [number, number]
  off?: (p: Plan) => boolean
}

const METRICS: Metric[] = [
  { label: 'Estrategista', value: (p) => p.cadenceShort, bar: (p) => p.meetingsPerMonth / plans[3].meetingsPerMonth },
  { label: 'Mídia gerida', value: (p) => `Até R$ ${p.mediaCap / 1000} mil`, bar: (p) => p.mediaCap / plans[3].mediaCap },
  { label: 'Canais de mídia', value: (p) => p.channels, steps: (p) => [p.id === 3 ? 3 : 2, 3] },
  { label: 'Criativos / mês', value: (p) => String(p.creatives), bar: (p) => p.creatives / plans[3].creatives },
  { label: 'Roteiros + vídeo / mês', value: (p) => `Até ${p.scripts}`, bar: (p) => p.scripts / plans[3].scripts },
  { label: 'Landing pages', value: (p) => p.lpLabel, bar: (p) => p.lpPerMonth / plans[3].lpPerMonth },
  { label: 'Redes sociais', value: (p) => p.social ?? 'A partir do P2', steps: (p) => [p.id - 1, 2], off: (p) => !p.social },
  { label: 'Capacitação', value: (p) => p.training ?? 'A partir do P2', steps: (p) => [p.id - 1, 2], off: (p) => !p.training },
  { label: 'Inteligência', value: (p) => p.intel, steps: (p) => [p.id === 3 ? 2 : 1, 2] }
]

export function initPlans() {
  const tabsWrap = $('[data-plan-tabs]')
  const tabs = $$<HTMLButtonElement>('.tab', tabsWrap)
  const num = $('[data-plan-num]')
  const price = $('[data-plan-price]')
  const cad = $('[data-plan-cad]')
  const floor = $('[data-plan-floor]')
  const tagline = $('[data-plan-tagline]')
  const list = $('[data-plan-metrics]')

  list.innerHTML = METRICS.map(
    (m) => `<li>
      <span class="m__label mono">${m.label}</span>
      <span class="m__val"></span>
      ${m.bar ? '<span class="m__bar"><i></i></span>' : ''}
      ${m.steps ? `<span class="m__chip">${'<span></span>'.repeat(m.steps(plans[3])[1])}</span>` : ''}
    </li>`
  ).join('')
  const rows = $$('li', list)

  tabs.forEach((t) => t.addEventListener('click', () => store.set({ plan: Number(t.dataset.plan) as PlanId })))

  const priceObj = { v: plans[store.get().plan].table }
  let first = true

  const render = (id: PlanId, prevId: PlanId) => {
    const p = plans[id]
    const animate = !first && !reducedMotion()

    tabs.forEach((t) => {
      const on = Number(t.dataset.plan) === id
      t.classList.toggle('is-active', on)
      t.setAttribute('aria-selected', String(on))
    })
    tabsWrap.style.setProperty('--i', String(id - 1))
    cad.textContent = `${p.cadence} com o estrategista`
    floor.textContent = brlSmart(p.floor)
    tagline.textContent = p.tagline

    // Número gigante troca deslizando
    if (animate && id !== prevId) {
      const dir = id > prevId ? 1 : -1
      gsap.timeline()
        .to(num, { yPercent: -100 * dir, opacity: 0, duration: 0.35, ease: 'power3.in' })
        .add(() => { num.textContent = String(id) })
        .fromTo(num, { yPercent: 100 * dir, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: 'expo.out' })
    } else {
      num.textContent = String(id)
    }

    // Preço conta até o novo valor
    if (animate) {
      gsap.to(priceObj, {
        v: p.table,
        duration: 0.9,
        ease: 'power3.out',
        overwrite: true,
        onUpdate: () => (price.textContent = int(priceObj.v)),
        onComplete: () => (price.textContent = moneySmart(p.table))
      })
    } else {
      priceObj.v = p.table
      price.textContent = moneySmart(p.table)
    }

    rows.forEach((li, i) => {
      const m = METRICS[i]
      const val = $('.m__val', li)
      const text = m.value(p)
      li.classList.toggle('is-off', !!m.off?.(p))
      if (animate && val.textContent !== text) {
        gsap.fromTo(val, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, delay: i * 0.03, ease: 'expo.out' })
      }
      val.textContent = text
      if (m.bar) $('.m__bar i', li).style.setProperty('--v', String(m.bar(p)))
      if (m.steps) {
        const [on] = m.steps(p)
        $$('.m__chip span', li).forEach((s, j) => s.classList.toggle('on', j < on))
      }
    })
    first = false
  }

  store.on((s, prev) => {
    if (s.plan !== prev.plan || first) render(s.plan, prev.plan)
  })
}
