// Service worker do Recebidinho:
// 1) guarda o app em cache para abrir rápido;
// 2) recebe os avisos (push) e abre a tela certa ao tocar na notificação.
import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

// Versão nova do app assume logo (vale a partir da próxima abertura).
self.skipWaiting()
clientsClaim()

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

// Qualquer rota do app (/morador, /portaria...) abre o index.html do cache.
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')))

// Conteúdo esperado do push (enviado pelas Edge Functions), em JSON:
//   { "titulo": "...", "corpo": "...", "url": "/morador", "tag": "encomenda-<id>" }
// Se vier texto simples, ele vira o corpo da notificação.
// No iPhone, todo push PRECISA mostrar uma notificação, senão o iOS
// cancela a permissão; por isso sempre mostramos algo.
self.addEventListener('push', (event) => {
  const dados = lerDados(event)

  event.waitUntil(
    self.registration.showNotification(dados.titulo || 'Recebidinho', {
      body: dados.corpo || 'Há uma novidade sobre a sua encomenda.',
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-96.png',
      tag: dados.tag,
      data: { url: dados.url || '/morador' },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = new URL(event.notification.data?.url || '/morador', self.location.origin).href
  event.waitUntil(abrirTela(url))
})

function lerDados(event) {
  if (!event.data) return {}
  try {
    return event.data.json()
  } catch {
    return { corpo: event.data.text() }
  }
}

// Reaproveita a janela do app se já estiver aberta; senão abre uma nova.
async function abrirTela(url) {
  const janelas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
  const janela = janelas[0]
  if (janela) {
    // Foca logo (só é permitido logo após o toque); navegar não depende disso.
    const foco = janela.focus().catch(() => {})
    try {
      await janela.navigate(url)
      await foco
      return
    } catch {
      // Navegador não deixou navegar nesta janela: abre outra abaixo.
    }
  }
  await self.clients.openWindow(url)
}
