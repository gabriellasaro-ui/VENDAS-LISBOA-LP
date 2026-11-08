// Para onde vão os leads do formulário. Preencher antes de publicar.

export const config = {
  /**
   * URL do app da Web do Apps Script da planilha "Leads · LP Fronteira" (script em fronteira/planilha.gs).
   * Termina em /exec. Recebe um POST com o JSON no corpo (text/plain, para não exigir CORS).
   * Vazio = o lead NÃO é salvo (só aparece no console).
   */
  webhookUrl: 'https://script.google.com/macros/s/AKfycbxAItphtK6f-t517pKGmlXawyjoWc4LkaaaZiFT9oOX0S7m3D5ldsUZejGyoMjj_26a/exec',
  /** WhatsApp da Lisboa & Co só com dígitos, com DDI (ex.: 5531999999999). Vazio = sem botão. */
  whatsapp: ''
}
