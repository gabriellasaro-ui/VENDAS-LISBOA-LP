import type { PlanId } from '../data'

export type Path = 'A' | 'B'
export type Mode = 'combo' | 'direct' | 'ee'

export interface State {
  plan: PlanId
  path: Path
  mode: Mode
  /** 0 – 0.30 · só aplicável no modo vendedor */
  discount: number
  seller: boolean
  company: string
  sellerName: string
}

type Listener = (s: State, prev: State) => void

let state: State = {
  plan: 2,
  path: 'A',
  mode: 'combo',
  discount: 0,
  seller: false,
  company: '',
  sellerName: ''
}

const listeners = new Set<Listener>()

export const store = {
  get: () => state,
  set(patch: Partial<State>) {
    const prev = state
    state = { ...state, ...patch }
    listeners.forEach((fn) => fn(state, prev))
  },
  on(fn: Listener, immediate = true) {
    listeners.add(fn)
    if (immediate) fn(state, state)
    return () => listeners.delete(fn)
  }
}
