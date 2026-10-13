const brl2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const brl0 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 })

/** 29857.14 → "29.857,14" */
export const money = (n: number) => brl2.format(round2(n))

/** 4500 → "4.500" · 7071.43 → "7.071,43" (sem centavos quando inteiro) */
export const moneySmart = (n: number) => (Number.isInteger(round2(n)) ? brl0.format(n) : money(n))

export const brl = (n: number) => `R$ ${money(n)}`
export const brlSmart = (n: number) => `R$ ${moneySmart(n)}`

/** 45 → "45,0%" */
export const pct = (n: number, d = 1) => `${n.toFixed(d).replace('.', ',')}%`

/** 2.17 → "2,17×" */
export const factor = (n: number) => `${n.toFixed(2).replace('.', ',')}×`

export const int = (n: number) => brl0.format(Math.round(n))

export const round2 = (n: number) => Math.round(n * 100) / 100

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
