import gsap from 'gsap'
import { $, $$, reducedMotion } from '../lib/dom'
import { config } from './config'
import type { Copy, Door, Lang } from './content'

type State = { lang: Lang; door: Door }

// Valores enviados não dependem do idioma
const OPTS = {
  operates: ['paraguai', 'brasil', 'ambos'],
  target: ['brasil', 'paraguai'],
  sells: ['ainda-nao', 'vende-pouco', 'quer-escalar']
} as const

// Como cada resposta aparece na planilha (sempre em português, só texto simples)
const SHEET_LABEL: Record<string, string> = {
  paraguai: 'Paraguai',
  brasil: 'Brasil',
  ambos: 'Nos dois',
  'ainda-nao': 'Ainda não',
  'vende-pouco': 'Vende pouco',
  'quer-escalar': 'Vende e quer escalar'
}

let targetTouched = false
let ddiTouched = false

/** Opções em pílula (rádio) com os rótulos do idioma atual, preservando o que já foi marcado. */
export function syncForm(state: State, k: Copy) {
  const f = k.form.fields
  const labels: Record<keyof typeof OPTS, readonly string[]> = { operates: f.operatesOpts, target: f.targetOpts, sells: f.sellsOpts }

  ;(Object.keys(OPTS) as (keyof typeof OPTS)[]).forEach((name) => {
    const row = $(`[data-opts="${name}"]`)
    const prev = $<HTMLInputElement>('input:checked', row)?.value
    row.innerHTML = OPTS[name]
      .map((v, i) => `<label class="pill"><input type="radio" name="${name}" value="${v}"${prev === v ? ' checked' : ''} /><span>${labels[name][i]}</span></label>`)
      .join('')
  })

  // O destino vem preenchido pela porta, até o lead mexer nele
  if (!targetTouched) {
    const v = state.door === 'a' ? 'brasil' : 'paraguai'
    $$<HTMLInputElement>('[data-opts="target"] input').forEach((r) => (r.checked = r.value === v))
  }
  // DDI sugerido pelo idioma, até o lead escolher
  if (!ddiTouched) $<HTMLSelectElement>('[data-ddi]').value = state.lang === 'es' ? '+595' : '+55'

  clearErrors()
}

function clearErrors() {
  $$('.is-err').forEach((el) => el.classList.remove('is-err'))
  $$('.err').forEach((el) => el.remove())
  const top = $('[data-form-err]')
  if (top) top.textContent = ''
}

function flag(el: HTMLElement, msg: string) {
  el.classList.add('is-err')
  const small = document.createElement('small')
  small.className = 'err mono'
  small.textContent = msg
  el.append(small)
}

export function initForm(getState: () => State, getCopy: () => Copy) {
  const form = $<HTMLFormElement>('[data-form]')
  const done = $('[data-done]')
  const label = $('[data-submit-label]')
  const button = $<HTMLButtonElement>('.form__go', form)

  form.addEventListener('change', (e) => {
    const t = e.target as HTMLElement
    if (t.matches('[name="target"]')) targetTouched = true
    if (t.matches('[data-ddi]')) ddiTouched = true
    t.closest('.is-err')?.classList.remove('is-err')
    t.closest('.fld, .opt, .check')?.querySelector('.err')?.remove()
  })
  form.addEventListener('input', (e) => {
    const box = (e.target as HTMLElement).closest('.is-err')
    if (!box) return
    box.classList.remove('is-err')
    box.querySelector('.err')?.remove()
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const k = getCopy()
    const er = k.form.errors
    clearErrors()

    const data = new FormData(form)
    const val = (n: string) => String(data.get(n) ?? '').trim()
    const box = (n: string) => form.querySelector<HTMLElement>(`[name="${n}"]`)!.closest<HTMLElement>('.fld, .opt, .check')!

    const bad: HTMLElement[] = []
    const fail = (n: string, msg: string) => {
      const b = box(n)
      flag(b, msg)
      bad.push(b)
    }
    const digits = val('whatsapp').replace(/\D/g, '')
    for (const n of ['nome', 'empresa', 'cargo']) if (!val(n)) fail(n, er.required)
    if (!val('email')) fail('email', er.required)
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val('email'))) fail('email', er.email)
    if (digits.length < 8 || digits.length > 13) fail('whatsapp', digits ? er.phone : er.required)
    for (const n of ['operates', 'target', 'segmento', 'sells']) if (!val(n)) fail(n, er.required)
    if (!data.get('consentimento')) fail('consentimento', er.consent)
    // Ordem visual do formulário
    bad.sort((x, y) => (x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))

    if (bad.length) {
      bad[0].scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' })
      bad[0].querySelector<HTMLElement>('input, select')?.focus({ preventScroll: true })
      return
    }

    const st = getState()
    const q = new URLSearchParams(location.search)
    const lead = {
      nome: val('nome'),
      empresa: val('empresa'),
      cargo: val('cargo'),
      whatsapp: `${val('ddi')} ${digits}`,
      email: val('email'),
      opera_hoje: SHEET_LABEL[val('operates')],
      cliente_alvo: SHEET_LABEL[val('target')],
      segmento: val('segmento'),
      ja_vende_no_destino: SHEET_LABEL[val('sells')],
      consentimento: 'Sim',
      idioma: st.lang === 'es' ? 'Espanhol' : 'Português',
      porta: st.door === 'a' ? 'A: cliente no Brasil' : 'B: cliente no Paraguai',
      utm_source: q.get('utm_source') ?? '',
      utm_medium: q.get('utm_medium') ?? '',
      utm_campaign: q.get('utm_campaign') ?? '',
      utm_content: q.get('utm_content') ?? '',
      pagina: location.href,
      enviado_em: new Date().toISOString()
    }

    button.disabled = true
    label.textContent = k.form.sending
    try {
      if (config.webhookUrl) {
        const res = await fetch(config.webhookUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(lead) })
        if (!res.ok) throw new Error(String(res.status))
      } else {
        console.warn('[fronteira] webhookUrl vazio em src/fronteira/config.ts: o lead não foi enviado.', lead)
      }
    } catch {
      button.disabled = false
      label.textContent = k.form.submit
      $('[data-form-err]').textContent = er.send
      return
    }

    ;(window as unknown as { dataLayer?: object[] }).dataLayer?.push({ event: 'lead_fronteira', idioma: lead.idioma, porta: lead.porta })

    const wa = $<HTMLAnchorElement>('[data-wa]')
    if (config.whatsapp) {
      const dest = val('target') === 'brasil' ? 'Brasil' : st.lang === 'es' ? 'Paraguay' : 'Paraguai'
      const msg =
        st.lang === 'es'
          ? `Hola, soy ${lead.nome}, de ${lead.empresa}. Vengo de la página Brasil ⇄ Paraguay y quiero conversar sobre la entrada en ${dest}.`
          : `Olá, sou ${lead.nome}, da ${lead.empresa}. Vim pela página Brasil ⇄ Paraguai e quero conversar sobre a entrada no ${dest}.`
      wa.href = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(msg)}`
      wa.hidden = false
    }

    button.disabled = false
    label.textContent = k.form.submit
    form.hidden = true
    done.hidden = false
    $('.done__text', done).focus()
    if (!reducedMotion()) gsap.from(done.children, { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out' })
  })
}
