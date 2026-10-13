export const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector(sel) as T

export const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll(sel)) as T[]

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

export function toast(msg: string, gold = false) {
  const el = $('.toast')
  el.textContent = msg
  el.classList.toggle('is-gold', gold)
  el.classList.add('is-on')
  window.clearTimeout(Number(el.dataset.t))
  el.dataset.t = String(window.setTimeout(() => el.classList.remove('is-on'), 2600))
}

export const isTyping = (e: Event) => {
  const t = e.target as HTMLElement | null
  return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
}
