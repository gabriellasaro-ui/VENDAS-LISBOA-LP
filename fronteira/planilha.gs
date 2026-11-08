// Recebe os leads da LP de fronteira e grava uma linha por lead na planilha.
// Onde colar: na planilha "Leads · LP Fronteira", menu Extensões → Apps Script.
// O cabeçalho é escrito e formatado pelo próprio script: não precisa digitar nada na planilha.

const COLUNAS = [
  ['Data', 'enviado_em', 140],
  ['Nome', 'nome', 180],
  ['Empresa', 'empresa', 180],
  ['Cargo', 'cargo', 140],
  ['WhatsApp', 'whatsapp', 150],
  ['E-mail', 'email', 220],
  ['Opera hoje em', 'opera_hoje', 120],
  ['Quer clientes em', 'cliente_alvo', 130],
  ['Segmento', 'segmento', 180],
  ['Já vende no destino?', 'ja_vende_no_destino', 170],
  ['Idioma', 'idioma', 100],
  ['Porta', 'porta', 190],
  ['Origem', 'utm_source', 110],
  ['Mídia', 'utm_medium', 110],
  ['Campanha', 'utm_campaign', 140],
  ['Conteúdo', 'utm_content', 120],
  ['Página', 'pagina', 260],
  ['Autorizou contato', 'consentimento', 130]
]

function doPost(e) {
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
    formatar_(sheet)
    const lead = JSON.parse(e.postData.contents)
    const row = COLUNAS.map(([, key]) => {
      if (key === 'enviado_em') return lead[key] ? new Date(lead[key]) : new Date()
      const v = lead[key] === undefined || lead[key] === null ? '' : String(lead[key])
      // Texto que começa com = + - @ vira fórmula no Sheets; o apóstrofo guarda como texto (inclusive o +55 do WhatsApp)
      return /^[=+\-@]/.test(v) ? "'" + v : v
    })
    sheet.appendRow(row)
    sheet.getRange(sheet.getLastRow(), 1).setNumberFormat('dd/mm/yyyy hh:mm')
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON)
  } finally {
    lock.releaseLock()
  }
}

/** Cabeçalho em português, fixo no topo, com a cor da marca. Só reescreve quando está diferente. */
function formatar_(sheet) {
  // Datas no horário de Brasília/Assunção (o padrão do Google é o da Califórnia)
  const ss = sheet.getParent()
  if (ss.getSpreadsheetTimeZone() !== 'America/Sao_Paulo') ss.setSpreadsheetTimeZone('America/Sao_Paulo')

  const titulos = COLUNAS.map(([t]) => t)
  const atual = sheet.getRange(1, 1, 1, titulos.length).getValues()[0]
  if (atual.join('|') === titulos.join('|')) return

  const head = sheet.getRange(1, 1, 1, titulos.length)
  head.setValues([titulos])
  head.setFontWeight('bold').setFontColor('#ffffff').setBackground('#d9190c').setVerticalAlignment('middle')
  sheet.setRowHeight(1, 34)
  sheet.setFrozenRows(1)
  COLUNAS.forEach(([, , w], i) => sheet.setColumnWidth(i + 1, w))
  // Colunas que sobraram do cabeçalho antigo
  const extra = sheet.getMaxColumns() - titulos.length
  if (extra > 0) sheet.getRange(1, titulos.length + 1, 1, extra).clearContent().setBackground(null)
}

/** Rode uma vez pelo editor (botão Executar) para formatar a planilha sem esperar o primeiro lead. */
function formatarAgora() {
  formatar_(SpreadsheetApp.getActiveSpreadsheet().getSheets()[0])
}
