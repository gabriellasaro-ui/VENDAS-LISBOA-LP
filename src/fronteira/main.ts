import '@fontsource/ibm-plex-sans/300.css'
import '@fontsource/ibm-plex-sans/300-italic.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '../styles/base.css'
import './fronteira.css'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'

import { $, $$, finePointer, reducedMotion } from '../lib/dom'
import { clamp } from '../lib/format'
import { clientLogos } from '../data'
import { initSmooth, startScroll } from '../modules/smooth'
import { initInteractions } from '../modules/interactions'
import { copy, type Copy, type Door, type Lang } from './content'
import { initForm, syncForm } from './form'

gsap.registerPlugin(ScrollTrigger, Draggable)

/* ---------- Estado: idioma e porta vêm da URL do QR code ---------- */
// ?lang=es abre a Porta A (cliente no Brasil); ?lang=pt abre a Porta B (cliente no Paraguai).
// ?porta=a|b sobrepõe a porta. Sem parâmetros, o idioma segue o navegador.

const params = new URLSearchParams(location.search)
const qLang = params.get('lang')
const qDoor = (params.get('porta') || params.get('door') || '').toLowerCase()

const state: { lang: Lang; door: Door } = {
  lang: qLang === 'es' || qLang === 'pt' ? qLang : navigator.language.toLowerCase().startsWith('es') ? 'es' : 'pt',
  door: 'b'
}
state.door = qDoor === 'a' || qDoor === 'b' ? qDoor : state.lang === 'es' ? 'a' : 'b'

const c = (): Copy => copy[state.lang]

/** Lê "secao.chave.0" do copy; campos { a, b } resolvem pela porta atual. */
function resolve(path: string): unknown {
  let v: unknown = c()
  for (const k of path.split('.')) v = (v as Record<string, unknown> | undefined)?.[k]
  if (v && typeof v === 'object' && !Array.isArray(v) && 'a' in v && 'b' in v) v = (v as Record<Door, unknown>)[state.door]
  return v
}
const ab = <T>(v: { a: T; b: T }) => v[state.door]

/* ---------- Renderização ---------- */

function renderText() {
  $$<HTMLElement | SVGElement>('[data-t]').forEach((el) => {
    const v = resolve(el.dataset.t!)
    if (typeof v === 'string') el.innerHTML = v
  })
  $$('[data-t-aria]').forEach((el) => el.setAttribute('aria-label', String(resolve(el.dataset.tAria!))))
  $$<HTMLInputElement>('[data-t-ph]').forEach((el) => (el.placeholder = String(resolve(el.dataset.tPh!))))
}

const list = (name: string, html: string) => {
  const el = $(`[data-list="${name}"]`)
  if (el) el.innerHTML = html
}

function renderLists() {
  const k = c()

  list('proof', k.hero.proof.map((p) => `<li><b class="display">${p.n}</b><span>${p.t}</span></li>`).join(''))

  list(
    'marketStats',
    ab(k.market.stats)
      .map((s) => `<li class="stat"><b class="display">${s.n}${s.unit ? ` <small>${s.unit}</small>` : ''}</b><p>${s.t}</p></li>`)
      .join('')
  )

  const bars = ab(k.market.chart)
  const max = Math.max(...bars.map((b) => b.value))
  list(
    'chart',
    bars
      .map(
        (b) =>
          `<li class="${b.base ? 'is-base' : ''}" style="--v:${(b.value / max).toFixed(4)}" title="${b.label}: ${b.shown}"><span class="chart__label">${b.label}</span><span class="chart__track"><i></i></span><b>${b.shown}</b></li>`
      )
      .join('')
  )

  list(
    'pains',
    ab(k.pains.list)
      .map((p, i) => `<li><span class="pains__n display">0${i + 1}</span><div><h3>${p.k}</h3><p>${p.t}</p></div></li>`)
      .join('')
  )

  list('chips', k.offer.chips.map((ch) => `<li><b class="display">${ch.n}</b><span class="mono">${ch.t}</span></li>`).join(''))

  list(
    'deliv',
    ab(k.deliv.cards)
      .map(
        (d) =>
          `<li class="dcard"><figure><img src="/img/deliv/${d.img}.webp" alt="${d.k}" loading="lazy" /></figure><div class="dcard__body"><b>${d.k}</b><p>${d.t}</p></div></li>`
      )
      .join('')
  )

  list(
    'weeks',
    k.plan.weeks
      .map(
        (w) => `<li class="tl__item${w.optional ? ' is-opt' : ''}">
          <span class="tl__node" aria-hidden="true"></span>
          <div class="tl__card">
            <p class="tl__k mono">${w.k}</p>
            <h3>${w.title}</h3>
            <ul>${w.items.map((it) => `<li>${it}</li>`).join('')}</ul>
            ${w.optional ? `<span class="tl__tag mono">${k.plan.optionalTag}</span>` : ''}
          </div>
        </li>`
      )
      .join('')
  )

  list('defYes', k.define.yes.map((t) => `<li>${t}</li>`).join(''))
  list('defNo', k.define.no.map((t) => `<li>${t}</li>`).join(''))

  list('forwho', ab(k.forwho.list).map((t) => `<li><i aria-hidden="true">✓</i><p>${t}</p></li>`).join(''))

  list(
    'whoStats',
    k.who.stats
      .map(
        (s) =>
          `<li><b class="display"><small>${s.pre}</small><span data-count="${s.n}">${s.n}</span>${s.suf ? `<small>${s.suf}</small>` : ''}</b><span>${s.t}</span></li>`
      )
      .join('')
  )

  list(
    'cases',
    k.cases.list
      .map(
        (cs) => `<article class="case">
          <header class="case__brand">
            <img src="/logos/${cs.logo}.png" alt="" width="56" height="56" loading="lazy" />
            <div><b>${cs.name}</b><span class="mono">${cs.type}</span></div>
          </header>
          <p class="case__ch">${cs.challenge}</p>
          <ul class="case__nums">
            ${cs.nums
              .map(
                (n, i) => `<li class="${i === 0 ? 'is-hero' : ''}">
                  <span class="mono">${n.label}</span>
                  <b>${n.before ? `<s aria-label="${k.cases.before}">${n.before}</s><i aria-hidden="true">→</i>` : ''}<span${n.before ? ` aria-label="${k.cases.after}: ${n.after}"` : ''}>${n.after}</span></b>
                  ${n.note ? `<small>${n.note}</small>` : ''}
                </li>`
              )
              .join('')}
          </ul>
          <blockquote class="case__q">“${cs.quote}”</blockquote>
        </article>`
      )
      .join('')
  )

  // Mantém abertas as perguntas que o lead já abriu
  const open = $$<HTMLDetailsElement>('[data-list="faq"] details').map((d) => d.open)
  list(
    'faq',
    k.faq.list
      .map(
        (f, i) =>
          `<details${open[i] ? ' open' : ''}><summary><span>${f.q}</span><i aria-hidden="true"></i></summary><div class="faq__a"><p>${f.a}</p></div></details>`
      )
      .join('')
  )

  list('trust', k.form.trust.map((t) => `<li><i aria-hidden="true">✓</i>${t}</li>`).join(''))
  // A primeira tagline já é o título grande do rodapé
  list('footTags', k.foot.tags.slice(1).map((t) => `<li>${t}</li>`).join(''))
}

function renderControls() {
  const route = ab(c().hero.route)
  $$('[data-route]').forEach((el) => (el.textContent = route[Number(el.dataset.route)]))

  $$<HTMLButtonElement>('button[data-door]').forEach((b, i) => {
    const on = b.dataset.door === state.door
    b.classList.toggle('is-active', on)
    b.setAttribute('aria-checked', String(on))
    if (on) b.parentElement!.style.setProperty('--i', String(i))
  })
  $$<HTMLButtonElement>('[data-lang]').forEach((b, i) => {
    const on = b.dataset.lang === state.lang
    b.classList.toggle('is-active', on)
    b.setAttribute('aria-checked', String(on))
    if (on) b.parentElement!.style.setProperty('--i', String(i))
  })

  document.documentElement.lang = state.lang === 'es' ? 'es' : 'pt-BR'
  document.documentElement.dataset.porta = state.door
  document.title = c().meta.title
  $('meta[name="description"]')?.setAttribute('content', c().meta.description)
}

function render() {
  renderText()
  renderLists()
  renderControls()
  syncForm(state, c())
  const u = new URL(location.href)
  u.searchParams.set('lang', state.lang)
  u.searchParams.set('porta', state.door)
  history.replaceState(null, '', u)
}

/* ---------- Trocas de porta e idioma ---------- */

const inView = (el: Element) => {
  const r = el.getBoundingClientRect()
  return r.bottom > 0 && r.top < window.innerHeight
}

function setDoor(door: Door) {
  if (door === state.door) return
  state.door = door
  if (reducedMotion()) return render()

  const word = $('.hero__destword')
  const visible = $$('.swap').filter(inView)
  const tl = gsap.timeline()
  tl.to(word, { yPercent: -110, duration: 0.3, ease: 'power3.in' }, 0)
  tl.to(visible, { opacity: 0, y: 10, duration: 0.2, ease: 'power2.in' }, 0)
  tl.add(() => {
    render()
    ScrollTrigger.refresh()
  })
  tl.fromTo(word, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: 'expo.out' })
  tl.to(visible, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', clearProps: 'transform' }, '<0.05')
}

function setLang(lang: Lang) {
  if (lang === state.lang) return
  state.lang = lang
  if (reducedMotion()) return render()
  const parts = ['main', '.foot2', '.bar__tags', '.bar__brand span', '.bar__cta', '.dock']
  gsap.to(parts, {
    opacity: 0,
    duration: 0.18,
    onComplete: () => {
      render()
      ScrollTrigger.refresh()
      gsap.to(parts, { opacity: 1, duration: 0.4, clearProps: 'opacity' })
    }
  })
}

/* ---------- Interações ---------- */

/** S-T-E-P: as barras podem ser arrastadas, mas sempre voltam para a ordem certa. */
function initSteps() {
  const listEl = $('[data-steps]')
  const steps = $$('.step', listEl)
  const msg = $('[data-steps-msg]')
  let timer = 0
  const alert = () => {
    window.clearTimeout(timer)
    msg.innerHTML = c().know.alert
    msg.classList.add('is-alert')
    timer = window.setTimeout(() => {
      msg.innerHTML = c().know.out
      msg.classList.remove('is-alert')
    }, 3200)
  }

  // Toque: arrastar na vertical travaria a rolagem da página, então a barra só tenta sair e volta
  if (!finePointer()) {
    steps.forEach((step) =>
      step.addEventListener('click', () => {
        if (!reducedMotion())
          gsap.fromTo(step, { y: -18, scale: 1.03 }, { y: 0, scale: 1, duration: 0.9, ease: 'elastic.out(1, 0.4)', overwrite: true })
        alert()
      })
    )
    return
  }

  steps.forEach((step) => {
    Draggable.create(step, {
      type: 'y',
      bounds: listEl,
      onPress() {
        step.classList.add('is-drag')
        gsap.to(step, { scale: 1.03, duration: 0.3 })
      },
      onDrag() {
        const h = step.offsetHeight + 10
        const from = steps.indexOf(step)
        const to = clamp(Math.round(from + this.y / h), 0, steps.length - 1)
        steps.forEach((s, k) => {
          if (s === step) return
          let shift = 0
          if (from < to && k > from && k <= to) shift = -h
          if (from > to && k < from && k >= to) shift = h
          gsap.to(s, { y: shift, duration: 0.3, ease: 'power3.out', overwrite: 'auto' })
        })
      },
      onRelease() {
        step.classList.remove('is-drag')
        const moved = Math.abs(this.y) > step.offsetHeight * 0.5
        gsap.to(steps, { y: 0, scale: 1, duration: 0.9, ease: 'elastic.out(1, 0.55)', overwrite: 'auto' })
        if (!moved) return
        if (!reducedMotion()) gsap.fromTo(listEl, { x: -8 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' })
        alert()
      }
    })
  })
}

function initMarquees() {
  const logos = clientLogos.map((n) => `<img src="/logos/${n}.svg" alt="" loading="lazy" height="30" />`).join('')
  $$('[data-marquee]').forEach((track, i) => {
    track.innerHTML = logos + logos
    if (reducedMotion()) return
    gsap.fromTo(track, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 48, ease: 'none', repeat: -1 })
  })
}

function initReveals() {
  if (reducedMotion()) return
  $$('[data-reveal]').forEach((el) =>
    gsap.from(el, { y: 44, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
  )

  // Números de "Quem somos" contam a partir de zero
  const stats = $('[data-list="whoStats"]')
  ScrollTrigger.create({
    trigger: stats,
    start: 'top 88%',
    once: true,
    onEnter: () =>
      $$('[data-count]', stats).forEach((el, i) => {
        const o = { v: 0 }
        gsap.to(o, {
          v: Number(el.dataset.count),
          duration: 1.8,
          delay: i * 0.1,
          ease: 'power3.out',
          onUpdate: () => (el.textContent = String(Math.round(o.v)))
        })
      })
  })
}

/** Barras do gráfico de mercado crescem quando entram na tela. */
function initChart() {
  const chart = $('[data-chart]')
  if (reducedMotion()) return chart.classList.add('is-in')
  new IntersectionObserver(
    ([en], obs) => {
      if (!en.isIntersecting) return
      chart.classList.add('is-in')
      obs.disconnect()
    },
    { threshold: 0.4 }
  ).observe(chart)
}

/** Linha do cronograma se preenche com a rolagem; cada semana acende ao passar. */
function initTimeline() {
  const tl = $('.tl')
  const light = () => $$('.tl__item', tl).forEach((li) => li.classList.toggle('is-on', li.getBoundingClientRect().top < window.innerHeight * 0.62))
  ScrollTrigger.create({
    trigger: tl,
    start: 'top 62%',
    end: 'bottom 62%',
    onUpdate: (self) => {
      tl.style.setProperty('--p', self.progress.toFixed(3))
      light()
    },
    onRefresh: light
  })
}

/** Carrossel de entregas no celular: bolinhas acompanham a rolagem lateral. */
function initDots() {
  const track = $('[data-list="deliv"]')
  const dots = $$('[data-dots] i')
  const update = () => {
    const card = track.firstElementChild as HTMLElement | null
    if (!card) return
    const i = clamp(Math.round(track.scrollLeft / (card.offsetWidth + 12)), 0, dots.length - 1)
    dots.forEach((d, k) => d.classList.toggle('is-on', k === i))
  }
  track.addEventListener('scroll', update, { passive: true })
  update()
}

/** Botão fixo no celular: aparece depois do hero e some quando o formulário está na tela. */
function initDock() {
  const dock = $('[data-dock]')
  const hero = $('#topo')
  const form = $('#conversa')
  const sync = () => {
    const h = window.innerHeight
    const pastHero = hero.getBoundingClientRect().bottom < h * 0.3
    const formOn = form.getBoundingClientRect().top < h * 0.85
    dock.classList.toggle('is-on', pastHero && !formOn)
  }
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: sync, onRefresh: sync })
}

function initProgress() {
  const bar = $('.progress i')
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => bar.style.setProperty('--p', self.progress.toFixed(4))
  })
}

/** Sem foto do Gabriel em /img/gabriel.webp, mostra as iniciais. */
function initPhoto() {
  const fig = $('[data-photo]')
  const img = $<HTMLImageElement>('img', fig)
  const fail = () => fig.classList.add('is-empty')
  img.addEventListener('error', fail)
  if (img.complete && img.naturalWidth === 0) fail()
}

function intro() {
  document.body.classList.remove('is-loading')
  if (reducedMotion()) return
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  tl.from('.bar', { yPercent: -120, duration: 1.1 }, 0)
  tl.from('.hero__text > *', { y: 36, opacity: 0, duration: 1.1, stagger: 0.07 }, 0.05)
  tl.from('.hero__destword', { yPercent: 110, duration: 1.2 }, 0.3)
  tl.from('.hero__photo', { clipPath: 'inset(100% 0% 0% 0% round 36px)', duration: 1.4, ease: 'expo.inOut' }, 0)
  tl.from('.hero__photo img', { scale: 1.25, duration: 1.8 }, 0)
  tl.from('.route', { y: 30, opacity: 0, duration: 1 }, 0.8)
}

/* ---------- Boot ---------- */

async function boot() {
  initSmooth()
  render()
  initPhoto()

  $$<HTMLButtonElement>('button[data-door]').forEach((b) => b.addEventListener('click', () => setDoor(b.dataset.door as Door)))
  $$<HTMLButtonElement>('[data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang as Lang)))
  $('[data-year]').textContent = String(new Date().getFullYear())

  initForm(() => state, c)
  initSteps()
  initMarquees()
  initDots()

  await Promise.race([
    Promise.all([document.fonts.load('700 1em Morganite'), document.fonts.load('300 1em "IBM Plex Sans"')]).catch(() => undefined),
    new Promise((r) => setTimeout(r, 1800))
  ])

  initInteractions()
  initReveals()
  initChart()
  initTimeline()
  initDock()
  initProgress()
  startScroll()
  intro()
  ScrollTrigger.refresh()
}

boot()
