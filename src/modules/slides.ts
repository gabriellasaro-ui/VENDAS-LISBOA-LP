import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { $, $$, finePointer, reducedMotion } from '../lib/dom'
import { clamp } from '../lib/format'
import { weeks } from '../data'

export function initSlides() {
  initMission()
  initSteps()
  initFlow3d()
  initParallax()
}

/** VENDER: as quatro frases acendem em sequência (ou no hover). */
function initMission() {
  const items = $$('[data-mission] li')
  let i = 0
  let timer = 0
  const on = (k: number) => items.forEach((li, j) => li.classList.toggle('is-on', j === k))
  const tick = () => {
    on(i)
    i = (i + 1) % items.length
  }
  const play = () => {
    if (reducedMotion() || timer) return
    tick()
    timer = window.setInterval(tick, 1600)
  }
  const stop = () => {
    window.clearInterval(timer)
    timer = 0
  }
  items.forEach((li, k) =>
    li.addEventListener('pointerenter', () => {
      stop()
      on(k)
      i = (k + 1) % items.length
    })
  )
  $('[data-mission]').addEventListener('pointerleave', play)
  new IntersectionObserver(([en]) => (en.isIntersecting ? play() : stop()), { threshold: 0.4 }).observe($('#missao'))
  if (reducedMotion()) on(0)
}

/**
 * "Por que saber antes de executar?": dá pra arrastar as barras,
 * mas elas sempre voltam para a ordem certa — não dá pra pular etapa.
 */
function initSteps() {
  const list = $('[data-steps]')
  const steps = $$('.step', list)
  const msg = $('[data-steps-msg]')
  const original = msg.innerHTML
  let msgTimer = 0

  const alert = (moved: boolean) => {
    window.clearTimeout(msgTimer)
    if (!moved) return
    msg.innerHTML = 'Sem <b>saber</b>, não dá pra <b>ter</b>. Sem ter, não dá pra <b>executar</b>.'
    msg.classList.add('is-alert')
    msgTimer = window.setTimeout(() => {
      msg.innerHTML = original
      msg.classList.remove('is-alert')
    }, 3200)
  }

  steps.forEach((step) => {
    Draggable.create(step, {
      type: 'y',
      bounds: list,
      onPress() {
        step.classList.add('is-drag')
        gsap.to(step, { scale: 1.03, duration: 0.3 })
      },
      onDrag() {
        // Os vizinhos abrem espaço enquanto arrasta
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
        // Tudo volta: a ordem certa é a única possível
        gsap.to(steps, { y: 0, scale: 1, duration: 0.9, ease: 'elastic.out(1, 0.55)', overwrite: 'auto' })
        if (moved && !reducedMotion()) gsap.fromTo(list, { x: -8 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' })
        alert(moved)
      }
    })
  })
}

interface Card {
  img: string
  label: string
  week: string
}

/** Entregáveis em carrossel 3D: arraste, setas, clique ou deixe girar. */
function initFlow3d() {
  const root = $('[data-flow3d]')
  const stage = $('[data-flow3d-stage]')
  const title = $('[data-flow3d-title]')
  const sub = $('[data-flow3d-sub]')
  const cards: Card[] = weeks.flatMap((w) =>
    w.items.filter((it) => it.img).map((it) => ({ img: it.img!, label: it.label, week: `Semana ${w.n}` }))
  )
  stage.innerHTML = cards
    .map((c, i) => `<figure class="fcard" data-i="${i}"><img src="/img/deliv/${c.img}.webp" alt="${c.label}" loading="lazy" draggable="false" /></figure>`)
    .join('')
  const els = $$('.fcard', stage)
  gsap.set(els, { xPercent: -50, yPercent: -50 })

  const n = cards.length
  const pos = { v: 0 }
  const wrap = (v: number) => ((v % n) + n) % n

  const layout = () => {
    const w = els[0].offsetWidth
    els.forEach((el, i) => {
      let off = i - pos.v
      off = off - n * Math.round(off / n) // caminho mais curto (circular)
      const a = Math.abs(off)
      gsap.set(el, {
        x: off * w * 0.62,
        z: -a * 160,
        rotationY: clamp(-off * 32, -60, 60),
        scale: 1 - Math.min(a, 3) * 0.06,
        opacity: a > 3.2 ? 0 : 1 - a * 0.18,
        zIndex: 100 - Math.round(a * 10),
        filter: `brightness(${1 - Math.min(a, 3) * 0.18})`
      })
    })
    const c = cards[wrap(Math.round(pos.v))]
    if (title.textContent !== c.label) {
      title.textContent = c.label
      sub.textContent = c.week
    }
  }

  const goTo = (v: number) =>
    gsap.to(pos, { v, duration: reducedMotion() ? 0 : 0.9, ease: 'expo.out', overwrite: true, onUpdate: layout })

  // Arrastar
  let startX = 0
  let startV = 0
  let dragging = false
  let movedPx = 0
  root.addEventListener('pointerdown', (e) => {
    dragging = true
    movedPx = 0
    startX = e.clientX
    startV = pos.v
    root.setPointerCapture(e.pointerId)
    gsap.killTweensOf(pos)
    stopAuto()
  })
  root.addEventListener('pointermove', (e) => {
    if (!dragging) return
    movedPx = Math.abs(e.clientX - startX)
    pos.v = startV - (e.clientX - startX) / (els[0].offsetWidth * 0.62)
    layout()
  })
  const release = (e: PointerEvent) => {
    if (!dragging) return
    dragging = false
    if (movedPx < 6) {
      // Clique: centraliza o card tocado
      const hit = (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null)?.closest<HTMLElement>('.fcard')
      if (hit) {
        const i = Number(hit.dataset.i)
        let d = i - wrap(pos.v)
        d = d - n * Math.round(d / n)
        goTo(Math.round(pos.v + d))
        return
      }
    }
    goTo(Math.round(pos.v))
  }
  root.addEventListener('pointerup', release)
  root.addEventListener('pointercancel', release)

  $('[data-flow3d-prev]').addEventListener('click', () => { stopAuto(); goTo(Math.round(pos.v) - 1) })
  $('[data-flow3d-next]').addEventListener('click', () => { stopAuto(); goTo(Math.round(pos.v) + 1) })
  root.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    e.stopPropagation()
    stopAuto()
    goTo(Math.round(pos.v) + (e.key === 'ArrowRight' ? 1 : -1))
  })

  // Gira sozinho enquanto está na tela
  let auto = 0
  const startAuto = () => {
    if (reducedMotion() || auto) return
    auto = window.setInterval(() => goTo(Math.round(pos.v) + 1), 2800)
  }
  const stopAuto = () => {
    window.clearInterval(auto)
    auto = 0
  }
  root.addEventListener('pointerenter', stopAuto)
  root.addEventListener('pointerleave', () => !dragging && startAuto())
  new IntersectionObserver(([en]) => (en.isIntersecting ? startAuto() : stopAuto()), { threshold: 0.4 }).observe(root)

  window.addEventListener('resize', layout)
  layout()
}

/** Fotos das telas de ecossistema e produto: zoom suave na rolagem + mouse. */
function initParallax() {
  if (reducedMotion()) return
  ;['.eco__img img', '.product__img img'].forEach((sel) => {
    const img = $(sel)
    const sec = img.closest('section')!
    gsap.fromTo(img, { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } })
    if (!finePointer()) return
    const x = gsap.quickTo(img, 'x', { duration: 1.4, ease: 'power3.out' })
    const y = gsap.quickTo(img, 'y', { duration: 1.4, ease: 'power3.out' })
    sec.addEventListener('pointermove', (e) => {
      x((e.clientX / window.innerWidth - 0.5) * -24)
      y((e.clientY / window.innerHeight - 0.5) * -14)
    })
  })
}
