import '@fontsource/ibm-plex-sans/300.css'
import '@fontsource/ibm-plex-sans/300-italic.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './styles/base.css'
import './styles/sections.css'
import './styles/print.css'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Draggable } from 'gsap/Draggable'

import { initSmooth } from './modules/smooth'
import { runLoader } from './modules/loader'
import { initInteractions } from './modules/interactions'
import { initOpening, openingIntro } from './modules/opening'
import { initSlides } from './modules/slides'
import { initReveals } from './modules/reveal'
import { initNav } from './modules/nav'
import { initAuth } from './modules/auth'
import { initPaths } from './modules/paths'
import { initEE } from './modules/ee'
import { initPlans } from './modules/plans'
import { initUpgrade } from './modules/upgrade'
import { initCombo } from './modules/combo'
import { initMatrix } from './modules/matrix'
import { initProposal } from './modules/proposal'
import { initSeller } from './modules/seller'

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable)

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)
document.body.classList.add('is-loading')

const fontsReady = Promise.all([
  document.fonts.load('700 1em Morganite'),
  document.fonts.load('300 1em "IBM Plex Sans"'),
  document.fonts.load('400 1em "IBM Plex Mono"')
]).catch(() => undefined)

const imagesReady = new Promise<void>((resolve) => {
  if (document.readyState === 'complete') resolve()
  else window.addEventListener('load', () => resolve(), { once: true })
})

async function boot() {
  initSmooth()
  initSeller()
  initInteractions()

  await fontsReady

  // Conteúdo dinâmico primeiro (medidas corretas), animações depois
  initAuth()
  initEE()
  initMatrix()
  initPlans()
  initCombo()
  initUpgrade()
  initPaths()
  initProposal()
  initSlides()
  const opening = initOpening()
  initNav()
  initReveals()

  ScrollTrigger.refresh()

  await runLoader(Promise.all([fontsReady, imagesReady]))
  document.body.classList.remove('is-loading')
  openingIntro(opening.resume)
  ScrollTrigger.refresh()
}

boot()
