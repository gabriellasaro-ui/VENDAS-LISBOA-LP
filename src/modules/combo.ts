import gsap from 'gsap'
import { $, $$, reducedMotion } from '../lib/dom'
import { store } from '../lib/store'
import { ee, plans, type PlanId } from '../data'
import { brlSmart, int, pct } from '../lib/format'

export function initCombo() {
  const pickWrap = $('[data-combo-pick]')
  const pick = $$<HTMLButtonElement>('button', pickWrap)
  const segEE = $('[data-stack-ee]')
  const segM1 = $('[data-stack-m1]')
  const eeVal = $('[data-combo-ee]')
  const m1Val = $('[data-combo-m1]')
  const off = $('[data-combo-off]')
  const without = $('[data-combo-without]')
  const save = $('[data-combo-save]')

  pick.forEach((b) => b.addEventListener('click', () => store.set({ plan: Number(b.dataset.plan) as PlanId })))

  const nums = { ee: 0, m1: 0, without: 0, save: 0, off: 0 }
  let first = true

  store.on((s, prev) => {
    if (!first && s.plan === prev.plan) return
    const p = plans[s.plan]
    pick.forEach((b) => {
      const on = Number(b.dataset.plan) === s.plan
      b.classList.toggle('is-active', on)
      b.setAttribute('aria-checked', String(on))
    })

    pickWrap.style.setProperty('--i', String(s.plan - 1))
    segEE.style.flexGrow = String(p.comboEETable)
    segM1.style.flexGrow = String(p.table)

    const target = { ee: p.comboEETable, m1: p.table, without: ee.table + p.table, save: p.table, off: p.comboDiscount }
    const paint = () => {
      eeVal.textContent = `R$ ${int(nums.ee)}`
      m1Val.textContent = `R$ ${int(nums.m1)}`
      without.textContent = `R$ ${int(nums.without)}`
      save.textContent = `R$ ${int(nums.save)}`
      off.textContent = pct(nums.off, 2)
    }
    const exact = () => {
      eeVal.textContent = brlSmart(p.comboEETable)
      m1Val.textContent = brlSmart(p.table)
      without.textContent = brlSmart(target.without)
      save.textContent = brlSmart(p.table)
      off.textContent = pct(p.comboDiscount, 2)
    }

    if (first || reducedMotion()) {
      Object.assign(nums, target)
      exact()
    } else {
      gsap.to(nums, { ...target, duration: 1.1, ease: 'expo.out', overwrite: true, onUpdate: paint, onComplete: exact })
    }
    first = false
  })
}
