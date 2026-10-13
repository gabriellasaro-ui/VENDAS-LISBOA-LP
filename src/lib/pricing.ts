import { ee, MAX_DISCOUNT, plans } from '../data'
import type { State } from './store'
import { brl, clamp, round2 } from './format'

export interface QuoteLine {
  label: string
  sub: string
  value: number
  original: number
  suffix?: string
}

export interface Quote {
  kind: string
  lines: QuoteLine[]
  totalLabel: string
  total: number
  totalOriginal: number
  after: string
  discount: number
}

/**
 * Preço = tabela × (1 − desconto), com desconto ≤ 30% e nunca abaixo do piso.
 * Fora do modo vendedor o desconto é sempre zero.
 */
export function quote(s: State): Quote {
  const d = s.seller ? clamp(s.discount, 0, MAX_DISCOUNT) : 0
  const apply = (table: number, floor: number) => Math.max(floor, round2(table * (1 - d)))
  const p = plans[s.plan]

  if (s.mode === 'ee') {
    const v = apply(ee.table, ee.floor)
    return {
      kind: 'Estruturação Estratégica · avulsa',
      lines: [{ label: 'Estruturação Estratégica', sub: '30 dias · 23 entregas · 4 reuniões', value: v, original: ee.table }],
      totalLabel: 'Investimento',
      total: v,
      totalOriginal: ee.table,
      after: 'Projeto de 30 dias, com início e fim',
      discount: d
    }
  }

  if (s.mode === 'direct') {
    const v = apply(p.table, p.floor)
    return {
      kind: `Assessoria · ${p.name}`,
      lines: [{ label: `Assessoria · ${p.name}`, sub: `${p.cadence} · mídia até R$ ${p.mediaCap / 1000} mil`, value: v, original: p.table, suffix: '/mês' }],
      totalLabel: 'Mensal',
      total: v,
      totalOriginal: p.table,
      after: 'Recorrente · entrada direta',
      discount: d
    }
  }

  const eeV = apply(p.comboEETable, p.comboEEFloor)
  const m1 = apply(p.table, p.floor)
  return {
    kind: `Combo · Estruturação + ${p.name}`,
    lines: [
      { label: 'Estruturação Estratégica', sub: `Condição combo · −${p.comboDiscount.toFixed(2).replace('.', ',')}%`, value: eeV, original: p.comboEETable },
      { label: `Assessoria · ${p.name}`, sub: `1º mês · ${p.cadence.toLowerCase()}`, value: m1, original: p.table }
    ],
    totalLabel: 'Entrada',
    total: round2(eeV + m1),
    totalOriginal: round2(p.comboEETable + p.table),
    after: `Do 2º mês em diante: ${brl(m1)}/mês`,
    discount: d
  }
}
