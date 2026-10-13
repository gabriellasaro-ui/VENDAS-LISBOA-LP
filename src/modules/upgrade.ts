import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { $, $$, reducedMotion } from '../lib/dom'
import { store } from '../lib/store'
import { planList, scale, type PlanId } from '../data'
import { clamp, factor, lerp, pct } from '../lib/format'

const MAX_F = 6
const ARC = 2 * Math.PI * 86

/** Interpola uma série de 3 valores (P1, P2, P3) com t ∈ [0, 1]. */
const at = (v: readonly number[], t: number) => {
  const x = t * 2
  const i = Math.min(1, Math.floor(x))
  return lerp(v[i], v[i + 1], x - i)
}

export function initUpgrade() {
  const slider = $('[data-up-slider]')
  const knob = $('.slider__knob', slider)
  const knobLabel = $('[data-up-knob]')
  const stops = $$<HTMLButtonElement>('.slider__stop', slider)
  const barsEl = $('[data-up-bars]')
  const feeVal = $('[data-fee-val]')
  const feeArc = $<SVGCircleElement>('[data-fee-arc]')
  const feeSteps = $('[data-fee-steps]')

  barsEl.innerHTML = scale
    .map(
      (s) => `<li class="${s.key === 'price' ? 'is-price' : ''}">
        <span class="bars__label mono">${s.label}</span>
        <span class="bars__track"><i></i><em></em></span>
        <b class="bars__f">1,00×</b>
      </li>`
    )
    .join('')
  const rows = $$('li', barsEl)

  feeSteps.innerHTML = planList
    .map((p) => `<li><span>${p.name}</span><span><b>${pct(p.feeOnCapTable)}</b><small>piso ${pct(p.feeOnCapFloor)}</small></span></li>`)
    .join('')
  const feeRows = $$('li', feeSteps)

  const state = { t: 0 }

  const render = () => {
    const t = state.t
    slider.style.setProperty('--t', t.toFixed(4))
    const near = Math.round(t * 2)
    knobLabel.textContent = `P${near + 1}`
    slider.setAttribute('aria-valuenow', String(near + 1))
    stops.forEach((s, i) => s.classList.toggle('is-on', i === near))

    const pm = at(scale[0].f, t) / MAX_F
    barsEl.style.setProperty('--pm', pm.toFixed(4))
    rows.forEach((li, i) => {
      const f = at(scale[i].f, t)
      $('.bars__track i', li).style.setProperty('--w', (f / MAX_F).toFixed(4))
      $('.bars__track em', li).style.setProperty('--pm', pm.toFixed(4))
      $('.bars__f', li).textContent = factor(f)
    })

    const seller = store.get().seller
    const fee = at(planList.map((p) => (seller ? p.feeOnCapFloor : p.feeOnCapTable)), t)
    feeVal.textContent = fee.toFixed(1).replace('.', ',')
    feeArc.style.strokeDashoffset = String(ARC * (1 - fee / 50))
    feeRows.forEach((r, i) => r.classList.toggle('is-on', i === near))
  }

  const tweenTo = (t: number, duration = 0.9) =>
    gsap.to(state, { t, duration: reducedMotion() ? 0 : duration, ease: 'expo.out', overwrite: true, onUpdate: render })

  const snap = () => {
    const near = Math.round(state.t * 2)
    tweenTo(near / 2, 0.6)
    if (store.get().plan !== near + 1) store.set({ plan: (near + 1) as PlanId })
  }

  // Arrastar
  const tFromX = (clientX: number) => {
    const r = slider.getBoundingClientRect()
    return clamp((clientX - r.left - 34) / (r.width - 68), 0, 1)
  }
  let dragging = false
  slider.addEventListener('pointerdown', (e) => {
    if ((e.target as HTMLElement).closest('.slider__stop')) return
    dragging = true
    slider.setPointerCapture(e.pointerId)
    gsap.killTweensOf(state)
    state.t = tFromX(e.clientX)
    render()
  })
  slider.addEventListener('pointermove', (e) => {
    if (!dragging) return
    state.t = tFromX(e.clientX)
    render()
  })
  const end = () => {
    if (!dragging) return
    dragging = false
    snap()
  }
  slider.addEventListener('pointerup', end)
  slider.addEventListener('pointercancel', end)
  knob.addEventListener('dragstart', (e) => e.preventDefault())

  stops.forEach((s, i) => s.addEventListener('click', () => store.set({ plan: (i + 1) as PlanId })))

  slider.addEventListener('keydown', (e) => {
    const p = store.get().plan
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault(); e.stopPropagation()
      store.set({ plan: Math.min(3, p + 1) as PlanId })
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault(); e.stopPropagation()
      store.set({ plan: Math.max(1, p - 1) as PlanId })
    }
  })

  // Sincronia com o plano global — mas a primeira vez anima de P1 até o plano atual
  let entered = false
  render()
  ScrollTrigger.create({
    trigger: '#upgrade',
    start: 'top 60%',
    once: true,
    onEnter: () => {
      entered = true
      tweenTo((store.get().plan - 1) / 2, 2.2)
    }
  })
  store.on((s, prev) => {
    if (s.seller !== prev.seller) render()
    if (s.plan !== prev.plan && entered && !dragging) tweenTo((s.plan - 1) / 2)
  }, false)
}
