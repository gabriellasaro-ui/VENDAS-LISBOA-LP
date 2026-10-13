import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { $, $$, finePointer, reducedMotion } from '../lib/dom'
import { store } from '../lib/store'
import { getLenis, startScroll } from './smooth'

const KEY = 'lisboa:client'

/**
 * Abertura em dois tempos, como uma apresentação:
 * 1) "Para começar, quem estamos recebendo hoje?" (vermelho, tela travada)
 * 2) cortina abre para "Bem-vindo à Lisboa & Co" com a foto do cubo V4.
 * O nome digitado personaliza a abertura e já preenche a proposta.
 */
export function initOpening() {
  const sec = $('.open')
  const form = $<HTMLFormElement>('[data-open-form]')
  const input = $<HTMLInputElement>('[data-open-input]')
  const skip = $('[data-open-skip]')
  const chip = $('[data-open-client]')
  const nameEl = $('[data-client-name]')

  const paintClient = (name: string) => {
    chip.hidden = !name
    nameEl.textContent = name
  }
  store.on((s, prev) => {
    if (s.company !== prev.company && sec.dataset.state === 'welcome') paintClient(s.company)
  }, false)

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    enter(input.value.trim(), true)
  })
  skip.addEventListener('click', () => enter('', true))

  // Foto acompanha o mouse
  if (finePointer() && !reducedMotion()) {
    const img = $('.open__photo img')
    const x = gsap.quickTo(img, 'x', { duration: 1.2, ease: 'power3.out' })
    const y = gsap.quickTo(img, 'y', { duration: 1.2, ease: 'power3.out' })
    sec.addEventListener('pointermove', (e) => {
      x((e.clientX / window.innerWidth - 0.5) * -26)
      y((e.clientY / window.innerHeight - 0.5) * -18)
    })
  }

  function enter(name: string, animate: boolean) {
    try {
      sessionStorage.setItem(KEY, name)
    } catch {
      /* storage indisponível */
    }
    if (name) store.set({ company: name })
    paintClient(name)
    sec.dataset.state = 'welcome'
    document.documentElement.classList.remove('is-locked')
    startScroll()

    const start = $('.open__start')
    const panelBits = $$('.open__note, .open__lead, .open__by, .open__client')
    const titleBits = $$('.open__title > span')
    const photo = $('.open__photo img')

    if (!animate || reducedMotion()) {
      gsap.set(start, { autoAlpha: 0 })
      ScrollTrigger.refresh()
      return
    }
    const wide = window.matchMedia('(min-width: 901px)').matches
    gsap.timeline({ defaults: { ease: 'expo.inOut' }, onComplete: () => { gsap.set(start, { autoAlpha: 0 }); ScrollTrigger.refresh() } })
      .to(start.children, { y: -30, opacity: 0, duration: 0.5, stagger: 0.04, ease: 'power3.in' })
      // A cortina vermelha recua até virar o lado da foto
      .to(start, { clipPath: wide ? 'inset(0% 0% 0% 51.2%)' : 'inset(0% 0% 58% 0%)', duration: 1.2 }, '-=0.1')
      .fromTo(photo, { scale: 1.25, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: 'expo.out' }, '-=0.45')
      .to(start, { opacity: 0, duration: 0.4 }, '<0.2')
      .from(panelBits, { y: 24, opacity: 0, duration: 1, stagger: 0.06, ease: 'expo.out' }, '-=1.1')
      .from(titleBits, { yPercent: 110, duration: 1.2, stagger: 0.08, ease: 'expo.out' }, '<0.1')
  }

  // Volta à apresentação já iniciada nesta sessão
  let saved: string | null = null
  try {
    saved = sessionStorage.getItem(KEY)
  } catch {
    /* storage indisponível */
  }
  return { resume: saved !== null ? () => enter(saved!, false) : null }
}

/** Entrada da tela "Para começar" depois do loader. */
export function openingIntro(resume: (() => void) | null) {
  if (resume) {
    resume()
    return
  }
  document.documentElement.classList.add('is-locked')
  getLenis()?.stop()
  if (reducedMotion()) return
  gsap.from('.open__start > *', { y: 30, opacity: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out' })
  window.setTimeout(() => $<HTMLInputElement>('[data-open-input]').focus({ preventScroll: true }), 900)
}
