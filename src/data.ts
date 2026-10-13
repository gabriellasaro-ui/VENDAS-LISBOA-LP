// Todos os números vêm do Guia Comercial Lisboa & Co × V4 (1 out 2026).
// Regra de preço: tabela = piso ÷ 0,70 · desconto máximo 30% = piso.

export type PlanId = 1 | 2 | 3

export const MAX_DISCOUNT = 0.3

export interface Plan {
  id: PlanId
  name: string
  cadence: string
  cadenceShort: string
  tagline: string
  table: number
  floor: number
  meetingsPerMonth: number
  mediaCap: number
  creatives: number
  scripts: number
  lpPerMonth: number
  lpLabel: string
  channels: string
  social: string | null
  training: string | null
  intel: string
  feeOnCapTable: number
  feeOnCapFloor: number
  comboEETable: number
  comboEEFloor: number
  comboDiscount: number
}

export const plans: Record<PlanId, Plan> = {
  1: {
    id: 1,
    name: 'Plano 1',
    cadence: 'Reunião mensal',
    cadenceShort: 'Mensal',
    tagline: 'Mídia paga e criativos contínuos.',
    table: 4500,
    floor: 3150,
    meetingsPerMonth: 1,
    mediaCap: 10000,
    creatives: 12,
    scripts: 6,
    lpPerMonth: 1 / 3,
    lpLabel: '1 por trimestre',
    channels: 'Google + Meta',
    social: null,
    training: null,
    intel: 'Relatório mensal',
    feeOnCapTable: 45.0,
    feeOnCapFloor: 31.5,
    comboEETable: 25357.14,
    comboEEFloor: 17750,
    comboDiscount: 15.07
  },
  2: {
    id: 2,
    name: 'Plano 2',
    cadence: 'Reunião quinzenal',
    cadenceShort: 'Quinzenal',
    tagline: 'Mais verba, direção editorial e time de vendas treinado.',
    table: 7071.43,
    floor: 4950,
    meetingsPerMonth: 2,
    mediaCap: 30000,
    creatives: 24,
    scripts: 15,
    lpPerMonth: 1,
    lpLabel: '1 por mês',
    channels: 'Google + Meta',
    social: 'Linha editorial',
    training: 'Treinamento comercial',
    intel: 'Relatório mensal',
    feeOnCapTable: 23.6,
    feeOnCapFloor: 16.5,
    comboEETable: 22785.71,
    comboEEFloor: 15950,
    comboDiscount: 23.68
  },
  3: {
    id: 3,
    name: 'Plano 3',
    cadence: 'Reunião semanal',
    cadenceShort: 'Semanal',
    tagline: 'Operação completa, redes gerenciadas e empresa treinada em IA.',
    table: 9785.71,
    floor: 6850,
    meetingsPerMonth: 52 / 12,
    mediaCap: 50000,
    creatives: 48,
    scripts: 30,
    lpPerMonth: 2,
    lpLabel: 'Até 2 por mês',
    channels: 'Até 3 canais',
    social: '3 posts/semana',
    training: 'Comercial + IA',
    intel: 'Relatório + dashboard',
    feeOnCapTable: 19.6,
    feeOnCapFloor: 13.7,
    comboEETable: 20071.43,
    comboEEFloor: 14050,
    comboDiscount: 32.78
  }
}

export const planList: Plan[] = [plans[1], plans[2], plans[3]]

export const ee = {
  table: 29857.14,
  floor: 20900,
  days: 30,
  deliverables: 23,
  meetings: 4
}

/** Entrada do combo (EE no combo + 1º mês) — igual em qualquer plano. */
export const comboEntry = { table: 29857.14, floor: 20900 }

export interface Deliverable {
  label: string
  img?: string
}

export interface Week {
  n: string
  title: string
  short: string
  days: [number, number]
  note?: string
  items: Deliverable[]
}

export const weeks: Week[] = [
  {
    n: '01',
    title: 'Descoberta do negócio e pesquisa de mercado',
    short: 'Descoberta e mercado',
    days: [1, 7],
    items: [
      { label: 'Grupo com o cliente e boas-vindas' },
      { label: 'Alinhamento de expectativas e cronograma' },
      { label: 'Acesso a todos os canais e ferramentas' },
      { label: 'Concorrentes e SWOT', img: 'swot' },
      { label: 'Auditoria de comunicação no digital' },
      { label: 'Persona e ICP', img: 'persona' },
      { label: 'Arquitetura de presença digital' },
      { label: 'TAM / SAM / SOM + marketshare', img: 'tam' }
    ]
  },
  {
    n: '02',
    title: 'Diagnóstico digital e posicionamento',
    short: 'Diagnóstico e posicionamento',
    days: [8, 15],
    items: [
      { label: 'Diagnóstico de mídia paga', img: 'midia' },
      { label: 'Diagnóstico orgânico (redes sociais)' },
      { label: 'Diagnóstico de criativos', img: 'criativos' },
      { label: 'Diagnóstico de maturidade digital' },
      { label: 'Posicionamento + PUV + taglines', img: 'posicionamento' }
    ]
  },
  {
    n: '03',
    title: 'Estrutura da operação — inside sales',
    short: 'Operação comercial',
    days: [16, 22],
    note: 'Base do treinamento comercial e das LPs',
    items: [
      { label: 'Diagnóstico de CRO (site/LP)', img: 'cro' },
      { label: 'Cliente oculto' },
      { label: 'Diagnóstico comercial e etapas do funil', img: 'comercial' },
      { label: 'Métricas e critérios do funil' },
      { label: 'Pipeline + réguas + script consultivo', img: 'reguas' },
      { label: 'Diagnóstico ou implementação de LP' }
    ]
  },
  {
    n: '04',
    title: 'Identidade de comunicação e plano de mídia',
    short: 'Marca e plano de mídia',
    days: [23, 30],
    note: 'No combo, vira o mês 1 da assessoria',
    items: [
      { label: 'Manual de marca (brandbook + MIV)', img: 'brand' },
      { label: 'Banco de copy para anúncios' },
      { label: 'Briefing de criativos' },
      { label: 'Forecast e plano de mídia · 6 meses', img: 'forecast' }
    ]
  }
]

/** Fatores de escala sobre o Plano 1 (P1 = 1,0×). */
export const scale = [
  { key: 'price', label: 'Preço', f: [1, 1.57, 2.17] },
  { key: 'meet', label: 'Reuniões / mês', f: [1, 2, 4.33] },
  { key: 'media', label: 'Teto de mídia', f: [1, 3, 5] },
  { key: 'creative', label: 'Criativos', f: [1, 2, 4] },
  { key: 'video', label: 'Roteiros e vídeo', f: [1, 2.5, 5] },
  { key: 'lp', label: 'Landing pages', f: [1, 3, 6] }
] as const

export type Cell = string | true | null

export const matrix: { label: string; cells: [Cell, Cell, Cell] }[] = [
  { label: 'Reunião com o estrategista', cells: ['Mensal', 'Quinzenal', 'Semanal'] },
  { label: 'Gestão de tráfego pago', cells: ['Até R$ 10 mil', 'Até R$ 30 mil', 'Até R$ 50 mil'] },
  { label: 'Canais de mídia', cells: ['Google e Meta', 'Google e Meta', 'Até 3 canais (TikTok, LinkedIn, ChatGPT…)'] },
  { label: 'Redes sociais', cells: [null, 'Linha editorial e orientação', '3 posts/semana gerenciados'] },
  { label: 'Criativos para anúncios', cells: ['12 / mês', '24 / mês', '48 / mês'] },
  { label: 'Produção de copy', cells: [true, true, true] },
  { label: 'Roteiros e produção de vídeo', cells: ['Até 6 / mês', 'Até 15 / mês', 'Até 30 / mês'] },
  { label: 'Landing pages', cells: ['1 / trimestre', '1 / mês', 'Até 2 / mês'] },
  { label: 'Relatório de performance mensal', cells: [true, true, true] },
  { label: 'Dashboard em tempo real', cells: [null, null, true] },
  { label: 'Treinamento comercial', cells: [null, '3 sessões · todo o time', '3 sessões · todo o time'] },
  { label: 'Treinamento de IA', cells: [null, null, 'Empresa inteira (IA first)'] }
]

export const authority = [
  { value: 13, prefix: '+', suffix: '', label: 'anos de mercado' },
  { value: 260, prefix: '+', suffix: '', label: 'franquias no Brasil' },
  { value: 16, prefix: '+R$ ', suffix: 'bi', label: 'gerados para clientes' },
  { value: 30, prefix: '+', suffix: ' mil', label: 'projetos atendidos' }
]

export const clientLogos = [
  'xp', 'ifood', 'spotify', 'rockinrio', 'calvinklein', 'sicoob', 'spoleto', 'todeschini',
  'applebees', 'lugano', 'maxtitanium', 'marvee', 'grupok1', 'oficialfarma', 'army'
]
