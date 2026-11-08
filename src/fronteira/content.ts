// Copy master da LP de fronteira (Brasil ⇄ Paraguai).
// Porta A: o cliente está no Brasil. Porta B: o cliente está no Paraguai.
// Campos { a, b } mudam com a porta; o resto é igual nas duas.
// Todo número vem da tabela de dados do briefing, com a fonte visível na página.
// Espanhol: rascunho em "usted", aguardando revisão nativa e as taglines oficiais da V4.

export type Lang = 'pt' | 'es'
export type Door = 'a' | 'b'
export type AB<T> = { a: T; b: T }

export interface Stat {
  n: string
  unit?: string
  t: string
}
export interface Pain {
  k: string
  t: string
}
export interface Bar {
  label: string
  value: number
  shown: string
  base?: boolean
}
export interface Week {
  k: string
  title: string
  items: string[]
  optional?: boolean
}
export interface CaseNum {
  label: string
  before?: string
  after: string
  note?: string
}
export interface Case {
  name: string
  type: string
  logo: string
  challenge: string
  nums: CaseNum[]
  quote: string
}

export interface Copy {
  meta: { title: string; description: string }
  bar: { brand: string; tag1: string; tag2: string; cta: string; langLabel: string }
  hero: {
    eyebrow: string
    q: string
    doorA: string
    doorB: string
    pre: string
    dest: AB<string>
    sub: AB<string>
    cta: string
    from: string
    to: string
    route: AB<[string, string]>
    proof: { n: string; t: string }[]
  }
  meet: { eyebrow: string; text: string; name: string; role: string }
  market: {
    eyebrow: string
    title: AB<string>
    stats: AB<Stat[]>
    text: AB<string>
    chartTitle: AB<string>
    chart: AB<Bar[]>
    sources: AB<string>
  }
  pains: { eyebrow: string; title: AB<string>; list: AB<Pain[]>; sources: AB<string> }
  know: {
    eyebrow: string
    title: string
    text: string
    hint: string
    steps: [string, string, string, string]
    out: string
    alert: string
    close: string
  }
  offer: { seal: string; title: AB<string>; sub: string; chips: { n: string; t: string }[]; logos: string }
  deliv: { eyebrow: string; title: AB<string>; cards: AB<{ k: string; t: string; img: string }[]>; swipe: string }
  plan: { eyebrow: string; title: string; daysLabel: string; weeks: Week[]; optionalTag: string }
  define: { eyebrow: string; title: string; yesK: string; yes: string[]; noK: string; no: string[] }
  forwho: { eyebrow: string; title: string; list: AB<string[]>; close: AB<string> }
  who: {
    eyebrow: string
    title: [string, string]
    stats: { pre: string; n: number; suf: string; t: string }[]
    badges: string
    logos: string
    affil: string
    unit: string
  }
  cases: { eyebrow: string; title: AB<string>; list: Case[]; before: string; after: string }
  guarantee: { eyebrow: string; seal: string; text: string }
  faq: { eyebrow: string; title: string; list: { q: string; a: string }[] }
  form: {
    eyebrow: string
    title: AB<string>
    sub: string
    fields: {
      name: string
      company: string
      role: string
      phone: string
      email: string
      operates: string
      operatesOpts: [string, string, string]
      target: string
      targetOpts: [string, string]
      segment: string
      segmentPh: string
      sells: string
      sellsOpts: [string, string, string]
    }
    consent: string
    submit: string
    sending: string
    success: string
    successWa: string
    errors: { required: string; email: string; phone: string; consent: string; send: string }
    trust: string[]
  }
  foot: { tags: string[]; rights: string }
  dock: string
}

const pt: Copy = {
  meta: {
    title: 'Lisboa & Co × V4 Company · Seu próximo cliente do outro lado da fronteira',
    description:
      'Estruturação Estratégica em 30 dias para empresas que querem vender do Paraguai para o Brasil ou do Brasil para o Paraguai: pesquisa, plano e ativos prontos.'
  },
  bar: {
    brand: 'V4 Company · Lisboa & Co',
    tag1: 'Somos <b>Cientistas</b>',
    tag2: 'Inimigos da <em>Inércia</em>',
    cta: 'Conversar',
    langLabel: 'Idioma'
  },
  hero: {
    eyebrow: 'Estruturação Estratégica · Brasil ⇄ Paraguai',
    q: 'Onde está o próximo cliente da sua empresa?',
    doorA: 'No Brasil',
    doorB: 'No Paraguai',
    pre: 'Seu próximo cliente está no',
    dest: { a: 'Brasil.', b: 'Paraguai.' },
    sub: {
      a: 'Estruturamos o marketing, o comercial e o posicionamento da sua empresa no Brasil para trazer mais clientes, com <b>pesquisa, plano e ativos prontos em 30 dias.</b>',
      b: 'Estruturamos o marketing, o comercial e o posicionamento da sua empresa no Paraguai para trazer mais clientes, com <b>pesquisa, plano e ativos prontos em 30 dias.</b>'
    },
    cta: 'Quero conversar sobre o meu caso',
    from: 'Você',
    to: 'Seu cliente',
    route: { a: ['Paraguai', 'Brasil'], b: ['Brasil', 'Paraguai'] },
    proof: [
      { n: '+13', t: 'anos de mercado' },
      { n: '+260', t: 'franquias' },
      { n: '+R$ 16 bi', t: 'em receita gerada para clientes' },
      { n: '+30 mil', t: 'projetos' }
    ]
  },
  meet: {
    eyebrow: 'De onde a gente se conhece',
    text: 'A gente se conheceu no Paraguai. <b>Esta página continua a conversa que começamos lá.</b> Se fizer sentido para a sua empresa, me chama pelo formulário e seguimos de onde paramos.',
    name: 'Gabriel Soares',
    role: 'Diretor e sócio da Lisboa & Co, unidade V4 Company'
  },
  market: {
    eyebrow: 'O mercado do outro lado',
    title: {
      a: 'O Brasil já é o maior comprador do Paraguai. <em>E não é um mercado só.</em>',
      b: 'A chegada de brasileiros ao Paraguai quase dobrou em um ano. <em>Os clientes não vêm na mudança.</em>'
    },
    stats: {
      a: [
        { n: '213,4', unit: 'milhões', t: 'de pessoas, cerca de 33 vezes a população do Paraguai.' },
        { n: '31%', t: 'das exportações paraguaias foram para o Brasil em 2025, o principal destino.' },
        { n: '67%', t: 'do que as maquiladoras do Paraguai exportam vai para o Brasil.' },
        { n: 'R$ 235,5', unit: 'bilhões', t: 'movimentados pelo e-commerce brasileiro em 2025.' }
      ],
      b: [
        { n: '22.628', t: 'brasileiros receberam residência no Paraguai no 1º semestre de 2026. No mesmo período de 2025, foram 11.723.' },
        { n: '6,46', unit: 'milhões', t: 'de habitantes. Um mercado em que cada contato conta.' },
        { n: '6,07', unit: 'milhões', t: 'de pessoas usam internet no Paraguai.' },
        { n: '1,50', unit: 'milhão', t: 'de membros no LinkedIn, para quem vende B2B.' }
      ]
    },
    text: {
      a: 'Só o Paraná tem 11,9 milhões de habitantes, quase o dobro do Paraguai. São Paulo tem 46,1 milhões. <b>Quem tenta falar com o Brasil inteiro de uma vez espalha a verba e não aprende nada.</b> A Rediex recomenda às empresas paraguaias o caminho contrário: entrada gradual, por micromercados como o Paraná.',
      b: 'O comprador paraguaio está no digital. <b>Em um mercado de 6,46 milhões de pessoas, errar a mensagem custa caro:</b> a base é pequena demais para testar no escuro.'
    },
    chartTitle: {
      a: 'População, em milhões de habitantes',
      b: 'Brasileiros que receberam residência no Paraguai'
    },
    chart: {
      a: [
        { label: 'Paraguai', value: 6.46, shown: '6,46 mi', base: true },
        { label: 'Paraná', value: 11.9, shown: '11,9 mi' },
        { label: 'São Paulo', value: 46.1, shown: '46,1 mi' }
      ],
      b: [
        { label: '1º sem. 2025', value: 11723, shown: '11.723', base: true },
        { label: '1º sem. 2026', value: 22628, shown: '22.628' }
      ]
    },
    sources: {
      a: 'Fontes: IBGE (2025), INE Paraguai (2026), BCP (2025), CEMAP (2025), ABComm (2025), Rediex.',
      b: 'Fontes: governo paraguaio via Tribuna PR (2026), INE Paraguai (2026), DataReportal (out/2026).'
    }
  },
  pains: {
    eyebrow: 'Os erros caros',
    title: {
      a: 'Por que tanta empresa atravessa a fronteira <em>e não vende no Brasil</em>',
      b: 'Por que tanta empresa brasileira chega ao Paraguai <em>e não vende</em>'
    },
    list: {
      a: [
        { k: 'Traduzir o site e esperar resultado.', t: 'Tradução não é posicionamento. O comprador brasileiro vai comparar você com fornecedores brasileiros que ele já conhece.' },
        { k: 'Anunciar para o Brasil inteiro.', t: 'Verba espalhada por 213 milhões de pessoas não gera venda nem aprendizado.' },
        { k: 'Depender só de representante ou distribuidor.', t: 'Sem funil e sem métrica próprios, você não sabe o que funciona nem o que o cliente final pensa de você.' },
        { k: 'Vender volume em vez de valor.', t: 'Em 2025, cada quilo exportado do Paraguai ao Brasil valeu, em média, US$ 0,71. Cada quilo importado do Brasil, US$ 1,45. É no posicionamento que se decide se você vende por preço ou por valor.' }
      ],
      b: [
        { k: 'Abrir a empresa e esperar o cliente aparecer.', t: 'A estrutura jurídica resolve onde você está, não quem compra de você. Quem recebe empresários brasileiros em Assunção avisa: é um recomeço, com cultura, idioma e rede de contatos novos.' },
        { k: 'Copiar o playbook do Brasil.', t: 'Canal, linguagem e argumento que funcionam aqui precisam ser testados lá antes de receber verba.' },
        { k: 'Comunicar em português ou em espanhol traduzido.', t: 'O Paraguai é bilíngue: o guarani convive com o espanhol até no ambiente corporativo.' },
        { k: 'Vender só para brasileiros.', t: 'Cerca de 263 mil brasileiros viviam no Paraguai em 2023, segundo o Itamaraty. O resto do mercado tem mais de 6 milhões de pessoas.' }
      ]
    },
    sources: {
      a: 'Fonte do valor por quilo: Câmara de Comércio Paraguai–Brasil (2025). População: IBGE (2025).',
      b: 'Fontes: especialistas ouvidos pela Tribuna PR (2026), Itamaraty (2023), INE Paraguai (2026).'
    }
  },
  know: {
    eyebrow: 'Saber antes de executar',
    title: 'Em mercado novo, executar antes de saber é <em>o jeito mais caro de aprender.</em>',
    text: 'O Método V4 segue uma ordem que não pula etapa: Saber, Ter, Executar, Potencializar. Do outro lado da fronteira, a primeira etapa pesa mais. <b>Antes de investir em mídia e equipe, você precisa saber quem é o seu cliente lá, quanto esse mercado comporta, contra quem vai competir e por que alguém escolheria você.</b>',
    hint: 'Tente reorganizar as barras: você vai ver que não dá para pular etapa.',
    steps: ['Saber', 'Ter', 'Executar', 'Potencializar'],
    out: 'Cada etapa depende da anterior. <b>Não dá para pular.</b>',
    alert: 'Sem <b>saber</b>, não dá para <b>ter</b>. Sem ter, não dá para <b>executar</b>.',
    close: 'Foi seguindo esse raciocínio que criamos a <b>Estruturação Estratégica.</b>'
  },
  offer: {
    seal: 'Estruturação Estratégica',
    title: {
      a: 'O setup estratégico completo da sua entrada <em>no Brasil</em> em 30 dias.',
      b: 'O setup estratégico completo da sua entrada <em>no Paraguai</em> em 30 dias.'
    },
    sub: 'Em 4 semanas, você sai com pesquisa do mercado-destino, posicionamento, operação comercial desenhada e plano de mídia para os próximos 6 meses. <b>No dia 31, está pronto para operar.</b>',
    chips: [
      { n: '30', t: 'dias' },
      { n: '4', t: 'semanas' },
      { n: '4', t: 'reuniões de apresentação' }
    ],
    logos: 'Marcas que já confiaram na V4'
  },
  deliv: {
    eyebrow: 'O que você recebe',
    title: {
      a: 'Em 30 dias, seu ambiente digital fica pronto <em>para converter no Brasil.</em>',
      b: 'Em 30 dias, seu ambiente digital fica pronto <em>para converter no Paraguai.</em>'
    },
    cards: {
      a: [
        { k: 'TAM / SAM / SOM', t: 'O tamanho real da sua oportunidade no Brasil e o micromercado por onde começar.', img: 'tam' },
        { k: 'SWOT + concorrência', t: 'Contra quem você vai competir no mercado-destino, e não no seu mercado de origem.', img: 'swot' },
        { k: 'Posicionamento', t: 'PUV e taglines escritas para o comprador do outro lado, no idioma dele.', img: 'posicionamento' }
      ],
      b: [
        { k: 'TAM / SAM / SOM', t: 'O tamanho real da sua oportunidade no Paraguai, e por qual departamento, cidade ou segmento começar.', img: 'tam' },
        { k: 'SWOT + concorrência', t: 'Contra quem você vai competir no mercado-destino, e não no seu mercado de origem.', img: 'swot' },
        { k: 'Posicionamento', t: 'PUV e taglines escritas para o comprador do outro lado, no idioma dele.', img: 'posicionamento' }
      ]
    },
    swipe: 'Arraste para o lado'
  },
  plan: {
    eyebrow: 'Cronograma',
    title: 'Cronograma da <em>Estruturação Estratégica</em>',
    daysLabel: 'dias · 4 semanas',
    optionalTag: 'Opcional · contratado à parte',
    weeks: [
      {
        k: 'Antes da semana 1',
        title: 'Onboarding técnico',
        items: ['Grupo de boas-vindas com o seu time', 'Preenchimento do V4mos', 'Reunião de alinhamento de expectativas e cronograma', 'Acesso a canais e ferramentas']
      },
      {
        k: 'Semana 1 · dias 1 a 7',
        title: 'Descoberta do negócio e pesquisa do mercado-destino',
        items: ['Análise de concorrentes no mercado-destino e SWOT', 'Auditoria da sua comunicação no digital', 'Persona e ICP do comprador do outro lado', 'Arquitetura de presença digital', 'Pesquisa de mercado (TAM/SAM/SOM + marketshare)', 'Reunião de apresentação']
      },
      {
        k: 'Semana 2 · dias 8 a 14',
        title: 'Diagnóstico digital e posicionamento',
        items: ['Diagnóstico de mídia paga, orgânico, criativos e maturidade digital', 'Posicionamento estratégico + PUV + taglines para o mercado-destino', 'Reunião de apresentação']
      },
      {
        k: 'Semana 3 · dias 15 a 21',
        title: 'Estrutura da operação comercial (Inside Sales)',
        items: ['Diagnóstico de CRO (site/LP)', 'Cliente oculto: como sua empresa atende um comprador do mercado-destino', 'Diagnóstico comercial e etapas do funil', 'Métricas e critérios do funil', 'Pipeline comercial + réguas + script consultivo', 'Diagnóstico ou implementação de landing page', 'Reunião de apresentação']
      },
      {
        k: 'Semana 4 · dias 22 a 30',
        title: 'Identidade de comunicação e plano de mídia',
        items: ['Manual de marca unificado (brandbook + MIV)', 'Banco de copy para anúncios', 'Briefing de criativos', 'Forecast e planejamento de mídia para 6 meses', 'Reunião de apresentação']
      },
      {
        k: 'Dia 31 em diante',
        title: 'Executar',
        optional: true,
        items: ['Gestão de mídia paga', 'Produção de criativos e copy', 'Gestão de projeto com especialista', 'Otimização contínua de campanhas', 'Reuniões periódicas de performance']
      }
    ]
  },
  define: {
    eyebrow: 'Antes de tudo',
    title: 'O que <em>é</em> e o que <em>não é</em> a Estruturação Estratégica',
    yesK: 'O que é',
    yes: [
      'Um mapa completo da sua operação de marketing e vendas para o mercado-destino',
      'Feito uma vez, em 30 dias, com início e fim',
      'Ativos prontos para operar no dia 31',
      'Plano de mídia e metas para os próximos 6 meses'
    ],
    noK: 'O que não é',
    no: [
      'Um plano que fica na gaveta',
      'Consultoria mensal genérica e sem prazo',
      'Achismo: seguimos um método validado',
      'Abertura de empresa nem assessoria jurídica, contábil, tributária ou aduaneira: isso continua com escritórios especializados'
    ]
  },
  forwho: {
    eyebrow: 'Para quem é',
    title: 'Para que tipo de empresa este serviço <em>foi desenhado</em>',
    list: {
      a: [
        'Empresa paraguaia que já vende bem no Paraguai e quer clientes recorrentes no Brasil',
        'Indústria ou maquiladora instalada no Paraguai que vende para o Brasil sem estrutura comercial própria',
        'Marca que exporta por distribuidor e quer controlar posicionamento e demanda',
        'Empresa que já tentou o Brasil, investiu e não sabe o que deu errado'
      ],
      b: [
        'Empresa brasileira que abriu ou vai abrir operação no Paraguai e precisa de clientes paraguaios',
        'Empresário brasileiro radicado no Paraguai que quer vender além da comunidade brasileira',
        'Marca brasileira que quer validar o Paraguai antes de investir em estrutura local',
        'Empresa já instalada que vende por indicação e quer previsibilidade'
      ]
    },
    close: {
      a: 'Se você se identificou com uma dessas situações, este serviço foi desenhado para você. Você já tem um negócio que funciona. <b>Agora quer crescer com previsibilidade no Brasil.</b>',
      b: 'Se você se identificou com uma dessas situações, este serviço foi desenhado para você. Você já tem um negócio que funciona. <b>Agora quer crescer com previsibilidade no Paraguai.</b>'
    }
  },
  who: {
    eyebrow: 'Quem somos',
    title: ['Maior assessoria', 'de marketing da América Latina'],
    stats: [
      { pre: '+', n: 13, suf: '', t: 'anos de mercado' },
      { pre: '+', n: 260, suf: '', t: 'franquias pelo Brasil' },
      { pre: '+R$', n: 16, suf: 'bi', t: 'em receita gerada para clientes' },
      { pre: '+', n: 30, suf: 'mil', t: 'projetos atendidos' }
    ],
    badges: 'Reconhecida pelas maiores plataformas',
    logos: 'Quem <em>acredita</em> na V4',
    affil: 'Somos uma empresa do <b>Grupo Dreamers</b> e parceiros do <b>InfoMoney</b>.',
    unit: 'Quem conduz o seu projeto: <b>Lisboa & Co</b>, unidade V4 Company em Minas Gerais.'
  },
  cases: {
    eyebrow: 'Cases',
    title: {
      a: '+30 mil projetos no Brasil. <em>Conhecemos o comprador brasileiro.</em>',
      b: 'O mesmo método, <em>aplicado a venda consultiva e B2B.</em>'
    },
    before: 'antes',
    after: 'depois',
    list: [
      {
        name: 'CVC Corp',
        type: 'Turismo / Educação',
        logo: 'cvc',
        challenge: 'Venda consultiva de ciclo longo, com leads desqualificados, volume baixo e CAC alto. Plugamos a mídia no e-mail/CRM, analisamos cohort respeitando o ciclo de decisão e fizemos os criativos atuarem como filtro.',
        nums: [
          { label: 'Receita gerada', after: 'R$ 91,6 mi' },
          { label: 'CAC', before: 'R$ 1.250', after: 'R$ 544' },
          { label: 'ROAS', before: '12x', after: '21x' }
        ],
        quote: 'Em venda consultiva, criativo bom não gera mais lead; gera o lead certo.'
      },
      {
        name: 'Medfutura',
        type: 'Distribuidora B2B / Medicamentos',
        logo: 'medfutura',
        challenge: 'Alto custo de mídia sem conversão proporcional. Reestruturamos o Google Ads por intenção de compra e produto rentável, com mensuração e rotina de otimização orientada ao comercial.',
        nums: [
          { label: 'ROAS', after: '82,52x', note: 'com R$ 8,9 mil de investimento' },
          { label: 'CPL', after: 'R$ 11,51' },
          { label: 'Conversão da LP', after: '25,26%' },
          { label: 'Receita gerada', after: 'R$ 734 mil' }
        ],
        quote: 'B2B escala com precisão cirúrgica, não com volume bruto.'
      }
    ]
  },
  guarantee: {
    eyebrow: 'Garantia',
    seal: 'Garantia · 30 dias · Garantia · 30 dias · ',
    text: 'Se em 30 dias você não receber tudo o que foi combinado da Estruturação Estratégica, <b>a gente devolve seu dinheiro.</b>'
  },
  faq: {
    eyebrow: 'Perguntas frequentes',
    title: 'O que todo mundo pergunta <em>antes de atravessar.</em>',
    list: [
      { q: 'O projeto é presencial?', a: 'Não. A Estruturação é conduzida de forma remota pelo time da Lisboa & Co, com uma reunião de apresentação ao fim de cada semana.' },
      { q: 'Em que idioma recebo os materiais?', a: 'Os documentos de estratégia saem em português ou espanhol, conforme o seu time. A copy de anúncios sai no idioma do comprador do mercado-destino.' },
      { q: 'E o fuso horário?', a: 'Paraguai e Brasília estão no mesmo horário (UTC-3) o ano inteiro desde outubro de 2024.' },
      { q: 'Preciso já vender no país-destino?', a: 'Não. A pesquisa de mercado da semana 1 mostra o tamanho da oportunidade e por onde começar, antes de você investir em estrutura local.' },
      { q: 'Vocês cuidam de abertura de empresa, impostos ou importação?', a: 'Não. A Estruturação cuida de marketing, comercial e posicionamento. A parte jurídica, contábil e aduaneira continua com escritórios especializados.' },
      { q: 'Quanto custa?', a: 'O investimento depende do escopo e é apresentado na conversa, com tudo o que está incluído por escrito.' },
      { q: 'E depois dos 30 dias?', a: 'Você pode executar o plano com o seu time ou contratar a V4 para a execução: mídia paga, criativos, copy e otimização contínua.' }
    ]
  },
  form: {
    eyebrow: 'Vamos conversar',
    title: {
      a: 'Vamos desenhar a entrada da sua empresa <em>no Brasil?</em>',
      b: 'Vamos desenhar a entrada da sua empresa <em>no Paraguai?</em>'
    },
    sub: 'Deixe seus dados. Um estrategista da Lisboa & Co fala com você pelo WhatsApp para entender o seu momento e dizer, com franqueza, se a Estruturação faz sentido para o seu caso.',
    fields: {
      name: 'Nome',
      company: 'Empresa',
      role: 'Cargo',
      phone: 'WhatsApp',
      email: 'E-mail',
      operates: 'Onde sua empresa opera hoje?',
      operatesOpts: ['Paraguai', 'Brasil', 'Nos dois'],
      target: 'Onde está o cliente que você quer conquistar?',
      targetOpts: ['Brasil', 'Paraguai'],
      segment: 'Segmento',
      segmentPh: 'Ex.: indústria de alimentos, software B2B',
      sells: 'Você já vende no país-destino?',
      sellsOpts: ['Ainda não', 'Vendo pouco', 'Vendo e quero escalar']
    },
    consent: 'Autorizo o contato pelo WhatsApp e por e-mail.',
    submit: 'Quero conversar sobre o meu caso',
    sending: 'Enviando…',
    success: 'Recebemos seus dados. Em breve um estrategista da Lisboa & Co fala com você pelo WhatsApp.',
    successWa: 'Prefere adiantar? Abrir o WhatsApp',
    errors: {
      required: 'Preencha este campo.',
      email: 'Confira o e-mail.',
      phone: 'Confira o número com DDD.',
      consent: 'Precisamos da sua autorização para entrar em contato.',
      send: 'Não conseguimos enviar agora. Tente de novo em instantes.'
    },
    trust: ['Conversa pelo WhatsApp', 'Investimento apresentado na conversa, por escrito', 'Mesmo fuso horário (UTC-3)']
  },
  foot: {
    tags: ['Inimigos da Inércia', 'V4 Company', 'Lisboa & Co', 'Nosso negócio é vender o seu'],
    rights: 'Lisboa & Co, unidade V4 Company'
  },
  dock: 'Quero conversar'
}

const es: Copy = {
  meta: {
    title: 'Lisboa & Co × V4 Company · Su próximo cliente al otro lado de la frontera',
    description:
      'Estructuración Estratégica en 30 días para empresas que quieren vender de Paraguay a Brasil o de Brasil a Paraguay: investigación, plan y activos listos.'
  },
  bar: {
    brand: 'V4 Company · Lisboa & Co',
    tag1: 'Somos <b>Científicos</b>',
    tag2: 'Enemigos de la <em>Inercia</em>',
    cta: 'Conversar',
    langLabel: 'Idioma'
  },
  hero: {
    eyebrow: 'Estructuración Estratégica · Brasil ⇄ Paraguay',
    q: '¿Dónde está el próximo cliente de su empresa?',
    doorA: 'En Brasil',
    doorB: 'En Paraguay',
    pre: 'Su próximo cliente está en',
    dest: { a: 'Brasil.', b: 'Paraguay.' },
    sub: {
      a: 'Estructuramos el marketing, el área comercial y el posicionamiento de su empresa en Brasil para atraer más clientes, con <b>investigación, plan y activos listos en 30 días.</b>',
      b: 'Estructuramos el marketing, el área comercial y el posicionamiento de su empresa en Paraguay para atraer más clientes, con <b>investigación, plan y activos listos en 30 días.</b>'
    },
    cta: 'Quiero conversar sobre mi caso',
    from: 'Usted',
    to: 'Su cliente',
    route: { a: ['Paraguay', 'Brasil'], b: ['Brasil', 'Paraguay'] },
    proof: [
      { n: '+13', t: 'años en el mercado' },
      { n: '+260', t: 'franquicias' },
      { n: '+R$ 16 mil mill.', t: 'en ingresos generados para clientes' },
      { n: '+30 mil', t: 'proyectos' }
    ]
  },
  meet: {
    eyebrow: 'De dónde nos conocemos',
    text: 'Nos conocimos en Paraguay. <b>Esta página continúa la conversación que empezamos allí.</b> Si tiene sentido para su empresa, escríbame por el formulario y seguimos donde lo dejamos.',
    name: 'Gabriel Soares',
    role: 'Director y socio de Lisboa & Co, unidad V4 Company'
  },
  market: {
    eyebrow: 'El mercado del otro lado',
    title: {
      a: 'Brasil ya es el mayor comprador de Paraguay. <em>Y no es un solo mercado.</em>',
      b: 'La llegada de brasileños a Paraguay casi se duplicó en un año. <em>Los clientes no vienen con la mudanza.</em>'
    },
    stats: {
      a: [
        { n: '213,4', unit: 'millones', t: 'de personas, cerca de 33 veces la población de Paraguay.' },
        { n: '31%', t: 'de las exportaciones paraguayas fue a Brasil en 2025, el principal destino.' },
        { n: '67%', t: 'de lo que exportan las maquiladoras de Paraguay va a Brasil.' },
        { n: 'R$ 235.500', unit: 'millones', t: 'movidos por el comercio electrónico brasileño en 2025.' }
      ],
      b: [
        { n: '22.628', t: 'brasileños recibieron residencia en Paraguay en el 1.er semestre de 2026. En el mismo período de 2025 fueron 11.723.' },
        { n: '6,46', unit: 'millones', t: 'de habitantes. Un mercado en el que cada contacto cuenta.' },
        { n: '6,07', unit: 'millones', t: 'de personas usan internet en Paraguay.' },
        { n: '1,50', unit: 'millones', t: 'de miembros en LinkedIn, para quien vende B2B.' }
      ]
    },
    text: {
      a: 'Solo Paraná tiene 11,9 millones de habitantes, casi el doble que Paraguay. São Paulo tiene 46,1 millones. <b>Quien intenta hablarle a todo Brasil de una vez dispersa el presupuesto y no aprende nada.</b> Rediex recomienda a las empresas paraguayas el camino contrario: una entrada gradual, por micromercados como Paraná.',
      b: 'El comprador paraguayo está en lo digital. <b>En un mercado de 6,46 millones de personas, equivocar el mensaje cuesta caro:</b> la base es demasiado pequeña para probar a ciegas.'
    },
    chartTitle: {
      a: 'Población, en millones de habitantes',
      b: 'Brasileños que recibieron residencia en Paraguay'
    },
    chart: {
      a: [
        { label: 'Paraguay', value: 6.46, shown: '6,46 mill.', base: true },
        { label: 'Paraná', value: 11.9, shown: '11,9 mill.' },
        { label: 'São Paulo', value: 46.1, shown: '46,1 mill.' }
      ],
      b: [
        { label: '1.er sem. 2025', value: 11723, shown: '11.723', base: true },
        { label: '1.er sem. 2026', value: 22628, shown: '22.628' }
      ]
    },
    sources: {
      a: 'Fuentes: IBGE (2025), INE Paraguay (2026), BCP (2025), CEMAP (2025), ABComm (2025), Rediex.',
      b: 'Fuentes: gobierno paraguayo vía Tribuna PR (2026), INE Paraguay (2026), DataReportal (oct/2026).'
    }
  },
  pains: {
    eyebrow: 'Los errores caros',
    title: {
      a: 'Por qué tantas empresas cruzan la frontera <em>y no venden en Brasil</em>',
      b: 'Por qué tantas empresas brasileñas llegan a Paraguay <em>y no venden</em>'
    },
    list: {
      a: [
        { k: 'Traducir el sitio web y esperar resultados.', t: 'Traducción no es posicionamiento. El comprador brasileño lo va a comparar con proveedores brasileños que ya conoce.' },
        { k: 'Hacer publicidad para todo Brasil.', t: 'Un presupuesto repartido entre 213 millones de personas no genera ventas ni aprendizaje.' },
        { k: 'Depender solo de un representante o distribuidor.', t: 'Sin embudo ni métricas propias, usted no sabe qué funciona ni qué piensa de usted el cliente final.' },
        { k: 'Vender volumen en lugar de valor.', t: 'En 2025, cada kilo exportado de Paraguay a Brasil valió, en promedio, US$ 0,71. Cada kilo importado de Brasil, US$ 1,45. En el posicionamiento se decide si usted vende por precio o por valor.' }
      ],
      b: [
        { k: 'Abrir la empresa y esperar a que aparezca el cliente.', t: 'La estructura jurídica resuelve dónde está usted, no quién le compra. Quienes reciben a empresarios brasileños en Asunción lo advierten: es volver a empezar, con cultura, idioma y red de contactos nuevos.' },
        { k: 'Copiar el manual de Brasil.', t: 'Canal, lenguaje y argumento que funcionan en Brasil deben probarse en Paraguay antes de recibir presupuesto.' },
        { k: 'Comunicar en portugués o en español traducido.', t: 'Paraguay es bilingüe: el guaraní convive con el español incluso en el ambiente corporativo.' },
        { k: 'Venderles solo a brasileños.', t: 'Cerca de 263 mil brasileños vivían en Paraguay en 2023, según Itamaraty. El resto del mercado tiene más de 6 millones de personas.' }
      ]
    },
    sources: {
      a: 'Fuente del valor por kilo: Cámara de Comercio Paraguay–Brasil (2025). Población: IBGE (2025).',
      b: 'Fuentes: especialistas consultados por Tribuna PR (2026), Itamaraty (2023), INE Paraguay (2026).'
    }
  },
  know: {
    eyebrow: 'Saber antes de ejecutar',
    title: 'En un mercado nuevo, ejecutar antes de saber es <em>la forma más cara de aprender.</em>',
    text: 'El Método V4 sigue un orden que no se salta etapas: Saber, Tener, Ejecutar, Potenciar. Al otro lado de la frontera, la primera etapa pesa más. <b>Antes de invertir en medios y equipo, usted necesita saber quién es su cliente allí, cuánto puede absorber ese mercado, contra quién va a competir y por qué alguien lo elegiría.</b>',
    hint: 'Intente reordenar las barras: verá que no se puede saltar ninguna etapa.',
    steps: ['Saber', 'Tener', 'Ejecutar', 'Potenciar'],
    out: 'Cada etapa depende de la anterior. <b>No se puede saltar.</b>',
    alert: 'Sin <b>saber</b>, no se puede <b>tener</b>. Sin tener, no se puede <b>ejecutar</b>.',
    close: 'Siguiendo ese razonamiento creamos la <b>Estructuración Estratégica.</b>'
  },
  offer: {
    seal: 'Estructuración Estratégica',
    title: {
      a: 'El setup estratégico completo de su entrada <em>en Brasil</em> en 30 días.',
      b: 'El setup estratégico completo de su entrada <em>en Paraguay</em> en 30 días.'
    },
    sub: 'En 4 semanas, usted sale con investigación del mercado de destino, posicionamiento, operación comercial diseñada y plan de medios para los próximos 6 meses. <b>El día 31 está listo para operar.</b>',
    chips: [
      { n: '30', t: 'días' },
      { n: '4', t: 'semanas' },
      { n: '4', t: 'reuniones de presentación' }
    ],
    logos: 'Marcas que ya confiaron en V4'
  },
  deliv: {
    eyebrow: 'Lo que usted recibe',
    title: {
      a: 'En 30 días, su entorno digital queda listo <em>para convertir en Brasil.</em>',
      b: 'En 30 días, su entorno digital queda listo <em>para convertir en Paraguay.</em>'
    },
    cards: {
      a: [
        { k: 'TAM / SAM / SOM', t: 'El tamaño real de su oportunidad en Brasil y el micromercado por donde empezar.', img: 'tam' },
        { k: 'FODA + competencia', t: 'Contra quién va a competir en el mercado de destino, y no en su mercado de origen.', img: 'swot' },
        { k: 'Posicionamiento', t: 'Propuesta única de valor y taglines escritas para el comprador del otro lado, en su idioma.', img: 'posicionamento' }
      ],
      b: [
        { k: 'TAM / SAM / SOM', t: 'El tamaño real de su oportunidad en Paraguay, y por qué departamento, ciudad o segmento empezar.', img: 'tam' },
        { k: 'FODA + competencia', t: 'Contra quién va a competir en el mercado de destino, y no en su mercado de origen.', img: 'swot' },
        { k: 'Posicionamiento', t: 'Propuesta única de valor y taglines escritas para el comprador del otro lado, en su idioma.', img: 'posicionamento' }
      ]
    },
    swipe: 'Deslice hacia el costado'
  },
  plan: {
    eyebrow: 'Cronograma',
    title: 'Cronograma de la <em>Estructuración Estratégica</em>',
    daysLabel: 'días · 4 semanas',
    optionalTag: 'Opcional · se contrata aparte',
    weeks: [
      {
        k: 'Antes de la semana 1',
        title: 'Onboarding técnico',
        items: ['Grupo de bienvenida con su equipo', 'Completar el V4mos', 'Reunión de alineación de expectativas y cronograma', 'Acceso a canales y herramientas']
      },
      {
        k: 'Semana 1 · días 1 a 7',
        title: 'Descubrimiento del negocio e investigación del mercado de destino',
        items: ['Análisis de competidores en el mercado de destino y FODA', 'Auditoría de su comunicación digital', 'Persona e ICP del comprador del otro lado', 'Arquitectura de presencia digital', 'Investigación de mercado (TAM/SAM/SOM + participación de mercado)', 'Reunión de presentación']
      },
      {
        k: 'Semana 2 · días 8 a 14',
        title: 'Diagnóstico digital y posicionamiento',
        items: ['Diagnóstico de medios pagos, orgánico, creatividades y madurez digital', 'Posicionamiento estratégico + propuesta de valor + taglines para el mercado de destino', 'Reunión de presentación']
      },
      {
        k: 'Semana 3 · días 15 a 21',
        title: 'Estructura de la operación comercial (Inside Sales)',
        items: ['Diagnóstico de CRO (sitio/landing page)', 'Cliente oculto: cómo atiende su empresa a un comprador del mercado de destino', 'Diagnóstico comercial y etapas del embudo', 'Métricas y criterios del embudo', 'Pipeline comercial + cadencias + guion consultivo', 'Diagnóstico o implementación de landing page', 'Reunión de presentación']
      },
      {
        k: 'Semana 4 · días 22 a 30',
        title: 'Identidad de comunicación y plan de medios',
        items: ['Manual de marca unificado (brandbook + MIV)', 'Banco de textos para anuncios', 'Briefing de creatividades', 'Proyección y planificación de medios para 6 meses', 'Reunión de presentación']
      },
      {
        k: 'Del día 31 en adelante',
        title: 'Ejecutar',
        optional: true,
        items: ['Gestión de medios pagos', 'Producción de creatividades y textos', 'Gestión de proyecto con especialista', 'Optimización continua de campañas', 'Reuniones periódicas de resultados']
      }
    ]
  },
  define: {
    eyebrow: 'Antes que nada',
    title: 'Qué <em>es</em> y qué <em>no es</em> la Estructuración Estratégica',
    yesK: 'Qué es',
    yes: [
      'Un mapa completo de su operación de marketing y ventas para el mercado de destino',
      'Hecho una sola vez, en 30 días, con inicio y fin',
      'Activos listos para operar el día 31',
      'Plan de medios y metas para los próximos 6 meses'
    ],
    noK: 'Qué no es',
    no: [
      'Un plan que queda en el cajón',
      'Consultoría mensual genérica y sin plazo',
      'Intuición: seguimos un método validado',
      'Apertura de empresa ni asesoría jurídica, contable, tributaria o aduanera: eso sigue a cargo de estudios especializados'
    ]
  },
  forwho: {
    eyebrow: 'Para quién es',
    title: 'Para qué tipo de empresa <em>fue diseñado</em> este servicio',
    list: {
      a: [
        'Empresa paraguaya que ya vende bien en Paraguay y quiere clientes recurrentes en Brasil',
        'Industria o maquiladora instalada en Paraguay que le vende a Brasil sin estructura comercial propia',
        'Marca que exporta por medio de un distribuidor y quiere controlar su posicionamiento y su demanda',
        'Empresa que ya intentó entrar a Brasil, invirtió y no sabe qué salió mal'
      ],
      b: [
        'Empresa brasileña que abrió o va a abrir operación en Paraguay y necesita clientes paraguayos',
        'Empresario brasileño radicado en Paraguay que quiere vender más allá de la comunidad brasileña',
        'Marca brasileña que quiere validar Paraguay antes de invertir en estructura local',
        'Empresa ya instalada que vende por recomendación y quiere previsibilidad'
      ]
    },
    close: {
      a: 'Si se identificó con alguna de estas situaciones, este servicio fue diseñado para usted. Ya tiene un negocio que funciona. <b>Ahora quiere crecer con previsibilidad en Brasil.</b>',
      b: 'Si se identificó con alguna de estas situaciones, este servicio fue diseñado para usted. Ya tiene un negocio que funciona. <b>Ahora quiere crecer con previsibilidad en Paraguay.</b>'
    }
  },
  who: {
    eyebrow: 'Quiénes somos',
    title: ['La mayor asesoría', 'de marketing de América Latina'],
    stats: [
      { pre: '+', n: 13, suf: '', t: 'años en el mercado' },
      { pre: '+', n: 260, suf: '', t: 'franquicias en Brasil' },
      { pre: '+R$', n: 16, suf: 'mil mill.', t: 'en ingresos generados para clientes' },
      { pre: '+', n: 30, suf: 'mil', t: 'proyectos atendidos' }
    ],
    badges: 'Reconocida por las mayores plataformas',
    logos: 'Quienes <em>confían</em> en V4',
    affil: 'Somos una empresa del <b>Grupo Dreamers</b> y socios de <b>InfoMoney</b>.',
    unit: 'Quién conduce su proyecto: <b>Lisboa & Co</b>, unidad V4 Company en Minas Gerais (Brasil).'
  },
  cases: {
    eyebrow: 'Casos',
    title: {
      a: '+30 mil proyectos en Brasil. <em>Conocemos al comprador brasileño.</em>',
      b: 'El mismo método, <em>aplicado a la venta consultiva y B2B.</em>'
    },
    before: 'antes',
    after: 'después',
    list: [
      {
        name: 'CVC Corp',
        type: 'Turismo / Educación',
        logo: 'cvc',
        challenge: 'Venta consultiva de ciclo largo, con leads no calificados, poco volumen y CAC alto. Conectamos los medios al e-mail y al CRM, analizamos cohortes respetando el ciclo de decisión e hicimos que las creatividades funcionaran como filtro.',
        nums: [
          { label: 'Ingresos generados', after: 'R$ 91,6 mill.' },
          { label: 'CAC', before: 'R$ 1.250', after: 'R$ 544' },
          { label: 'ROAS', before: '12x', after: '21x' }
        ],
        quote: 'En la venta consultiva, una buena creatividad no genera más leads; genera el lead correcto.'
      },
      {
        name: 'Medfutura',
        type: 'Distribuidora B2B / Medicamentos',
        logo: 'medfutura',
        challenge: 'Alto costo en medios sin una conversión proporcional. Reestructuramos Google Ads por intención de compra y producto rentable, con medición y una rutina de optimización orientada al área comercial.',
        nums: [
          { label: 'ROAS', after: '82,52x', note: 'con R$ 8,9 mil de inversión' },
          { label: 'CPL', after: 'R$ 11,51' },
          { label: 'Conversión de la landing', after: '25,26%' },
          { label: 'Ingresos generados', after: 'R$ 734 mil' }
        ],
        quote: 'El B2B escala con precisión quirúrgica, no con volumen bruto.'
      }
    ]
  },
  guarantee: {
    eyebrow: 'Garantía',
    seal: 'Garantía · 30 días · Garantía · 30 días · ',
    text: 'Si en 30 días usted no recibe todo lo acordado de la Estructuración Estratégica, <b>le devolvemos su dinero.</b>'
  },
  faq: {
    eyebrow: 'Preguntas frecuentes',
    title: 'Lo que todos preguntan <em>antes de cruzar.</em>',
    list: [
      { q: '¿El proyecto es presencial?', a: 'No. La Estructuración la conduce de forma remota el equipo de Lisboa & Co, con una reunión de presentación al final de cada semana.' },
      { q: '¿En qué idioma recibo los materiales?', a: 'Los documentos de estrategia se entregan en portugués o en español, según su equipo. Los textos de los anuncios se escriben en el idioma del comprador del mercado de destino.' },
      { q: '¿Y la diferencia horaria?', a: 'Paraguay y Brasilia tienen la misma hora (UTC-3) todo el año desde octubre de 2024.' },
      { q: '¿Necesito vender ya en el país de destino?', a: 'No. La investigación de mercado de la semana 1 muestra el tamaño de la oportunidad y por dónde empezar, antes de que usted invierta en estructura local.' },
      { q: '¿Ustedes se encargan de la apertura de empresa, impuestos o importación?', a: 'No. La Estructuración se ocupa del marketing, el área comercial y el posicionamiento. La parte jurídica, contable y aduanera sigue a cargo de estudios especializados.' },
      { q: '¿Cuánto cuesta?', a: 'La inversión depende del alcance y se presenta en la conversación, con todo lo incluido por escrito.' },
      { q: '¿Y después de los 30 días?', a: 'Usted puede ejecutar el plan con su equipo o contratar a V4 para la ejecución: medios pagos, creatividades, textos y optimización continua.' }
    ]
  },
  form: {
    eyebrow: 'Conversemos',
    title: {
      a: '¿Diseñamos la entrada de su empresa <em>en Brasil?</em>',
      b: '¿Diseñamos la entrada de su empresa <em>en Paraguay?</em>'
    },
    sub: 'Déjenos sus datos. Un estratega de Lisboa & Co le escribe por WhatsApp para entender su momento y decirle, con franqueza, si la Estructuración tiene sentido para su caso.',
    fields: {
      name: 'Nombre',
      company: 'Empresa',
      role: 'Cargo',
      phone: 'WhatsApp',
      email: 'Correo electrónico',
      operates: '¿Dónde opera hoy su empresa?',
      operatesOpts: ['Paraguay', 'Brasil', 'En los dos'],
      target: '¿Dónde está el cliente que quiere conquistar?',
      targetOpts: ['Brasil', 'Paraguay'],
      segment: 'Rubro',
      segmentPh: 'Ej.: industria alimenticia, software B2B',
      sells: '¿Ya vende en el país de destino?',
      sellsOpts: ['Todavía no', 'Vendo poco', 'Vendo y quiero escalar']
    },
    consent: 'Autorizo el contacto por WhatsApp y por correo electrónico.',
    submit: 'Quiero conversar sobre mi caso',
    sending: 'Enviando…',
    success: 'Recibimos sus datos. En breve un estratega de Lisboa & Co le escribe por WhatsApp.',
    successWa: '¿Prefiere adelantarse? Abrir WhatsApp',
    errors: {
      required: 'Complete este campo.',
      email: 'Revise el correo electrónico.',
      phone: 'Revise el número con el código de área.',
      consent: 'Necesitamos su autorización para contactarlo.',
      send: 'No pudimos enviar ahora. Intente de nuevo en unos instantes.'
    },
    trust: ['Conversación por WhatsApp', 'Inversión presentada en la conversación, por escrito', 'Misma hora (UTC-3)']
  },
  foot: {
    tags: ['Enemigos de la Inercia', 'V4 Company', 'Lisboa & Co', 'Nuestro negocio es vender el suyo'],
    rights: 'Lisboa & Co, unidad V4 Company'
  },
  dock: 'Quiero conversar'
}

export const copy: Record<Lang, Copy> = { pt, es }
