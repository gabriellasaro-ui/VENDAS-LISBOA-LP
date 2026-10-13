import gsap from 'gsap'
import { $, $$, reducedMotion } from '../lib/dom'
import { weeks } from '../data'

const AUTOPLAY = 7 // segundos por semana
const DAYS = 30

const num = (n: number) => String(n).padStart(2, '0')
const firstImg = (i: number) => weeks[i].items.find((it) => it.img)!

/**
 * Estruturação: abas S01–S04 que avançam sozinhas (com barra de progresso),
 * painel vermelho da semana e as entregas em blocos. Passar o mouse numa
 * entrega com imagem troca a prévia do painel.
 */
export function initEE() {
  const tabsWrap = $('[data-week-tabs]')
  const card = $('.ee__card')
  const mark = $('[data-ee-mark]')
  const k = $('[data-ee-k]')
  const title = $('[data-ee-title]')
  const count = $('[data-ee-count]')
  const note = $('[data-ee-note]')
  const img = $<HTMLImageElement>('[data-ee-img]')
  const cap = $('[data-ee-cap]')
  const tiles = $('[data-ee-tiles]')
  const daysEl = $('[data-days]')

  // Abas
  tabsWrap.innerHTML =
    weeks
      .map(
        (w, i) =>
          `<button role="tab" class="tab" data-week="${i}" aria-label="Semana ${w.n}"><b>S${w.n}</b><small>Dias ${w.days[0]}–${w.days[1]}</small><i class="tab__prog" aria-hidden="true"></i></button>`
      )
      .join('') + '<i class="tabs__ink" aria-hidden="true"></i>'
  const tabs = $$<HTMLButtonElement>('.tab', tabsWrap)

  // Linha dos 30 dias
  const starts = new Set(weeks.slice(1).map((w) => w.days[0]))
  daysEl.innerHTML =
    '<span class="mono">30 dias</span>' +
    Array.from({ length: DAYS }, (_, d) => `<i data-day="${d + 1}"${starts.has(d + 1) ? ' class="gap"' : ''}></i>`).join('')
  const dayEls = $$('i', daysEl)

  // Numeração contínua das 23 entregas
  const offsets = weeks.map((_, i) => weeks.slice(0, i).reduce((n, w) => n + w.items.length, 0))
  const total = weeks.reduce((n, w) => n + w.items.length, 0)

  let current = -1
  const preview = (key: string, label: string, animate = true) => {
    const src = `/img/deliv/${key}.webp`
    cap.textContent = label
    if (img.getAttribute('src') === src) return
    if (!animate || reducedMotion()) {
      img.src = src
      return
    }
    gsap.timeline()
      .to(img, { opacity: 0, scale: 1.08, duration: 0.18, ease: 'power2.in' })
      .add(() => { img.src = src })
      .to(img, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' })
    gsap.fromTo('.ee__fig', { rotate: gsap.utils.random(-2, 10) }, { rotate: 4, duration: 0.9, ease: 'elastic.out(1, 0.5)' })
  }

  const show = (i: number) => {
    if (i === current) return
    const w = weeks[i]
    const animate = current !== -1 && !reducedMotion()
    current = i

    tabsWrap.style.setProperty('--i', String(i))
    tabs.forEach((t, j) => {
      t.classList.toggle('is-active', j === i)
      t.setAttribute('aria-selected', String(j === i))
    })
    dayEls.forEach((d) => {
      const day = Number(d.dataset.day)
      d.classList.toggle('on', day >= w.days[0] && day <= w.days[1])
      d.classList.toggle('past', day < w.days[0])
    })

    const first = firstImg(i)
    const from = offsets[i] + 1
    tiles.innerHTML =
      w.items
        .map(
          (it, j) => `<li class="tile${it === first ? ' is-on' : ''}"${it.img ? ` data-img="${it.img}" tabindex="0"` : ''} data-label="${it.label}">
            <span class="tile__num"><span class="mono">${num(from + j)} / ${total}</span>${it.img ? `<img class="tile__thumb" src="/img/deliv/${it.img}.webp" alt="" loading="lazy" />` : ''}</span>
            <span class="tile__label">${it.label}</span>
          </li>`
        )
        .join('') +
      // A reunião ocupa o que sobra da última linha (3 colunas no desktop, 2 no menor)
      `<li class="tile tile--meet" style="--s3: ${3 - (w.items.length % 3)}; --s2: ${2 - (w.items.length % 2)}"><span class="tile__num"><span class="mono">Fim da semana</span></span><span class="tile__label">Reunião de apresentação</span></li>`

    const paint = () => {
      mark.textContent = w.n
      k.textContent = `Semana ${w.n} · Dias ${w.days[0]}–${w.days[1]}`
      title.textContent = w.title
      count.textContent = String(w.items.length)
      note.hidden = !w.note
      note.textContent = w.note ?? ''
    }

    if (!animate) {
      paint()
      preview(first.img!, first.label, false)
      return
    }
    gsap.timeline()
      .to('.ee__id > :not(.ee__fig)', { y: -12, opacity: 0, duration: 0.2, stagger: 0.02, ease: 'power2.in' })
      .add(paint)
      .fromTo('.ee__id > :not(.ee__fig)', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: 'expo.out' })
    gsap.from(tiles.children, { y: 26, opacity: 0, scale: 0.96, duration: 0.7, stagger: 0.04, ease: 'expo.out' })
    preview(first.img!, first.label)
  }

  // Entregas com imagem: hover / foco / toque atualiza a prévia
  const pick = (t: EventTarget | null) => {
    const li = (t as HTMLElement | null)?.closest?.<HTMLElement>('li[data-img]')
    if (!li) return
    tiles.querySelectorAll('.is-on').forEach((x) => x.classList.remove('is-on'))
    li.classList.add('is-on')
    preview(li.dataset.img!, li.dataset.label ?? '')
  }
  tiles.addEventListener('pointerover', (e) => pick(e.target))
  tiles.addEventListener('focusin', (e) => pick(e.target))
  tiles.addEventListener('click', (e) => pick(e.target))

  // Avanço automático com barra de progresso na aba ativa
  const timer = { p: 0 }
  let auto: gsap.core.Tween | null = null
  let visible = false
  let hovering = false
  const setProg = () => tabs[current]?.style.setProperty('--p', timer.p.toFixed(3))
  const restart = () => {
    auto?.kill()
    tabs.forEach((t) => t.style.setProperty('--p', '0'))
    if (reducedMotion()) return
    timer.p = 0
    auto = gsap.to(timer, {
      p: 1,
      duration: AUTOPLAY,
      ease: 'none',
      paused: !visible || hovering,
      onUpdate: setProg,
      onComplete: () => {
        show((current + 1) % weeks.length)
        restart()
      }
    })
  }
  const sync = () => (visible && !hovering ? auto?.play() : auto?.pause())

  const go = (i: number) => {
    show(i)
    restart()
  }
  tabs.forEach((t, i) => t.addEventListener('click', () => go(i)))
  tabsWrap.addEventListener('keydown', (e) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    e.stopPropagation()
    const i = (current + step + weeks.length) % weeks.length
    go(i)
    tabs[i].focus()
  })
  daysEl.addEventListener('click', (e) => {
    const d = Number((e.target as HTMLElement).dataset.day)
    if (d) go(weeks.findIndex((w) => d >= w.days[0] && d <= w.days[1]))
  })

  ;[card, tabsWrap].forEach((el) => {
    el.addEventListener('pointerenter', () => { hovering = true; sync() })
    el.addEventListener('pointerleave', () => { hovering = false; sync() })
  })
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; sync() }, { threshold: 0.35 }).observe(card)

  show(0)
  restart()
}
