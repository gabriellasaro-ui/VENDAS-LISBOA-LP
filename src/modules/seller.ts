import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { isTyping, toast } from '../lib/dom'
import { store } from '../lib/store'

const KEY = 'lisboa:seller'

/**
 * Modo vendedor (Shift + V, ou ?vendedor na URL): revela piso, fee no piso
 * e o controle de desconto da proposta — limitado a 30%.
 */
export function initSeller() {
  let saved = false
  try {
    saved = sessionStorage.getItem(KEY) === '1'
  } catch {
    /* storage indisponível */
  }
  const fromUrl = new URLSearchParams(location.search).has('vendedor') || location.hash === '#vendedor'
  if (fromUrl || saved) store.set({ seller: true })

  window.addEventListener('keydown', (e) => {
    if (isTyping(e) || !e.shiftKey || e.key.toLowerCase() !== 'v') return
    const on = !store.get().seller
    store.set({ seller: on, discount: on ? store.get().discount : 0 })
  })

  store.on((s, prev) => {
    document.body.classList.toggle('is-seller', s.seller)
    if (s.seller === prev.seller) return
    toast(s.seller ? 'Modo vendedor · piso e negociação visíveis' : 'Modo apresentação', s.seller)
    try {
      sessionStorage.setItem(KEY, s.seller ? '1' : '0')
    } catch {
      /* storage indisponível */
    }
    ScrollTrigger.refresh()
  })
}
