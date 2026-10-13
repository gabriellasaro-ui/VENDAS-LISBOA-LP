import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { $, reducedMotion } from '../lib/dom'
import { store } from '../lib/store'
import { matrix, planList, type Cell, type PlanId } from '../data'
import { moneySmart } from '../lib/format'

const cell = (c: Cell) =>
  c === true ? '<span class="mx__yes" aria-label="Incluso">✓</span>' : c === null ? '<span class="mx__no" aria-label="Não incluso">—</span>' : c

export function initMatrix() {
  const table = $<HTMLTableElement>('[data-mx]')
  const diff = $<HTMLInputElement>('[data-mx-diff]')

  table.innerHTML = `
    <thead><tr>
      <th class="mono" scope="col">Entrega</th>
      ${planList
        .map(
          (p) => `<th scope="col" data-c="${p.id}">
            <button class="mx__h" data-plan="${p.id}">
              <b>${p.name}</b><span class="mono">R$ ${moneySmart(p.table)}/mês</span>
            </button></th>`
        )
        .join('')}
    </tr></thead>
    <tbody>
      ${matrix
        .map((r) => {
          const same = r.cells.every((c) => c === r.cells[0])
          return `<tr class="${same ? 'is-same' : ''}"><td>${r.label}</td>${r.cells.map((c, i) => `<td data-c="${i + 1}">${cell(c)}</td>`).join('')}</tr>`
        })
        .join('')}
    </tbody>`

  table.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-plan]')
    if (b) store.set({ plan: Number(b.dataset.plan) as PlanId })
  })
  table.addEventListener('pointerover', (e) => {
    const c = (e.target as HTMLElement).closest<HTMLElement>('[data-c]')
    table.dataset.hc = c?.dataset.c ?? ''
  })
  table.addEventListener('pointerleave', () => (table.dataset.hc = ''))

  diff.addEventListener('change', () => {
    table.classList.toggle('is-diff', diff.checked)
    ScrollTrigger.refresh()
    if (!reducedMotion()) gsap.from(table.querySelectorAll('tbody tr:not(.is-same)'), { opacity: 0, x: -20, duration: 0.5, stagger: 0.03, ease: 'expo.out' })
  })

  store.on((s) => (table.dataset.sel = String(s.plan)))
}
