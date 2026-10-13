import gsap from 'gsap'
import { $, $$, reducedMotion, toast } from '../lib/dom'
import { store, type Mode, type Path } from '../lib/store'
import { matrix, plans, weeks, type PlanId } from '../data'
import { brl, int, money } from '../lib/format'
import { quote, type Quote } from '../lib/pricing'

const today = () => new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export function initProposal() {
  const modeBtns = $$<HTMLButtonElement>('[data-prop-mode] button')
  const planSet = $<HTMLFieldSetElement>('[data-prop-planset]')
  const planBtns = $$<HTMLButtonElement>('[data-prop-plan] button')
  const company = $<HTMLInputElement>('[data-prop-company]')
  const sellerName = $<HTMLInputElement>('[data-prop-seller]')
  const disc = $<HTMLInputElement>('[data-disc]')
  const discVal = $('[data-disc-val]')
  const discWarn = $('[data-disc-warn]')

  const tCo = $('[data-ticket-co]')
  const tLines = $('[data-ticket-lines]')
  const tTotalLabel = $('[data-ticket-total-label]')
  const tTotal = $('[data-ticket-total]')
  const tAfter = $('[data-ticket-after]')
  $('[data-ticket-date]').textContent = today()

  modeBtns.forEach((b) =>
    b.addEventListener('click', () => {
      const mode = b.dataset.mode as Mode
      const patch: { mode: Mode; path?: Path } = { mode }
      if (mode === 'combo') patch.path = 'A'
      if (mode === 'direct') patch.path = 'B'
      store.set(patch)
    })
  )
  planBtns.forEach((b) => b.addEventListener('click', () => store.set({ plan: Number(b.dataset.plan) as PlanId })))
  company.addEventListener('input', () => store.set({ company: company.value.trim() }))
  sellerName.addEventListener('input', () => store.set({ sellerName: sellerName.value.trim() }))
  disc.addEventListener('input', () => store.set({ discount: Number(disc.value) / 100 }))

  const totalObj = { v: 0 }
  let first = true

  store.on((s, prev) => {
    modeBtns.forEach((b) => b.classList.toggle('is-active', b.dataset.mode === s.mode))
    planBtns.forEach((b) => b.classList.toggle('is-active', Number(b.dataset.plan) === s.plan))
    planSet.disabled = s.mode === 'ee'

    const pctNow = Math.round(s.discount * 100)
    if (Number(disc.value) !== pctNow) disc.value = String(pctNow)
    disc.style.setProperty('--d', String(pctNow / 30))
    discVal.textContent = pctNow ? `−${pctNow}%` : '0%'
    discWarn.classList.toggle('is-on', pctNow >= 30)

    const q = quote(s)
    if (s.company !== prev.company || first) tCo.textContent = s.company || 'Sua empresa'
    if (document.activeElement !== company && company.value.trim() !== s.company) company.value = s.company

    tLines.innerHTML = q.lines
      .map(
        (l) => `<li><span>${l.label}<small>${l.sub}</small></span><b>${q.discount > 0 ? `<del>${brl(l.original)}</del>` : ''}${brl(l.value)}${l.suffix ?? ''}</b></li>`
      )
      .join('')
    tTotalLabel.textContent = q.totalLabel
    tAfter.textContent = q.after

    const changed = first || q.total !== totalObj.v
    if (changed && !first && !reducedMotion()) {
      gsap.to(totalObj, {
        v: q.total,
        duration: 0.8,
        ease: 'expo.out',
        overwrite: true,
        onUpdate: () => (tTotal.textContent = `R$ ${int(totalObj.v)}`),
        onComplete: () => (tTotal.textContent = brl(q.total))
      })
      gsap.fromTo('[data-ticket]', { scale: 0.985 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
    } else {
      totalObj.v = q.total
      tTotal.textContent = brl(q.total)
    }
    first = false
  })

  $('[data-prop-print]').addEventListener('click', () => printProposal(quote(store.get())))
  $('[data-prop-copy]').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(summary(quote(store.get())))
      toast('Resumo copiado ✓')
    } catch {
      toast('Não foi possível copiar')
    }
  })
}

function summary(q: Quote) {
  const s = store.get()
  const lines = [
    `Proposta — ${s.company || 'Sua empresa'}`,
    'Lisboa & Co × V4 Company',
    '',
    q.kind,
    ...q.lines.map((l) => `• ${l.label} (${l.sub}): ${brl(l.value)}${l.suffix ?? ''}`),
    '',
    `${q.totalLabel}: ${brl(q.total)}`,
    q.after
  ]
  if (s.sellerName) lines.push('', `Consultor: ${s.sellerName}`)
  return lines.join('\n')
}

async function printProposal(q: Quote) {
  const s = store.get()
  const p = plans[s.plan]
  const root = $('#print-root')

  const eeScope = `<div><h2>Estruturação Estratégica · 30 dias</h2>${weeks
    .map((w) => `<div class="pp__week"><b><i>S${w.n}</i>${esc(w.title)}</b><p>${w.items.map((i) => esc(i.label)).join(' · ')}</p></div>`)
    .join('')}</div>`

  const planScope = `<div><h2>Assessoria · ${p.name} · ${p.cadence.toLowerCase()}</h2><ul class="pp__list">${matrix
    .map((r) => {
      const c = r.cells[p.id - 1]
      if (c === null) return ''
      return `<li><span>${esc(r.label)}</span><b>${c === true ? 'Incluso' : esc(c)}</b></li>`
    })
    .join('')}</ul></div>`

  const scope = s.mode === 'combo' ? eeScope + planScope : s.mode === 'ee' ? eeScope : planScope

  root.innerHTML = `
    <article class="pp">
      <div class="pp__band">
        <div class="pp__top">
          <span class="pp__brand">Lisboa &amp; Co <span style="opacity:.6">×</span> <img src="/logos/v4.svg" alt="" /></span>
          <span>Proposta comercial · ${today()}</span>
        </div>
        <h1 class="pp__co">${esc(s.company || 'Sua empresa')}</h1>
        <p class="pp__kind">${esc(q.kind)}</p>
      </div>

      <section class="pp__inv">
        <div>
          <h2>Investimento</h2>
          <table class="pp__lines"><tbody>
            ${q.lines
              .map(
                (l) => `<tr><td>${esc(l.label)}<small>${esc(l.sub)}</small></td><td>${q.discount > 0 ? `<del>R$ ${money(l.original)}</del>` : ''}R$ ${money(l.value)}${l.suffix ?? ''}</td></tr>`
              )
              .join('')}
          </tbody></table>
        </div>
        <div class="pp__total">
          <span>${q.totalLabel}</span>
          <b>R$ ${money(q.total)}</b>
          <p>${esc(q.after)}</p>
        </div>
      </section>

      <section class="pp__scope ${s.mode === 'combo' ? '' : 'is-single'}">${scope}</section>

      <p class="pp__quote">Diagnóstico primeiro. <span>Execução recorrente depois.</span></p>

      <footer class="pp__foot">
        <span>Lisboa &amp; Co — franquia V4 Company · MG2${s.sellerName ? ` · Consultor: ${esc(s.sellerName)}` : ''}</span>
        <span>Valores em reais, por cliente</span>
      </footer>
    </article>`

  const img = root.querySelector('img')
  await Promise.all([
    document.fonts.load("700 20px 'Morganite Print'").catch(() => undefined),
    img && !img.complete ? new Promise((r) => img.addEventListener('load', r, { once: true })) : null
  ])
  window.print()
}
