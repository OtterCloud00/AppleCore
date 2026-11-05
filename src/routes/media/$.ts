import { createFileRoute } from '@tanstack/react-router'
import { checkAuth } from '#/server/auth'
import { decodeMediaPath, serveMedia } from '#/server/media'


async function handler({
  request,
  params,
}: {
  request: Request
  params: { _splat: string }
}) {
  const check = await checkAuth(request.headers)
  if (!check.authed) {
    if (check.reason === 'unconfigured') {
      return new Response(
        'Credenziali non configurate: imposta i secrets sul Worker (wrangler secret put).',
        { status: 500 },
      )
    }
    return new Response("Accesso riservato all'utente autorizzato.", {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="applecore", charset="utf-8"',
      },
    })
  }
  
  return serveMedia({
    relPath: decodeMediaPath(params._splat),
    rangeHeader: request.headers.get('range'),
    method: request.method,
  })
}

export const Route = createFileRoute('/media/$')({
  server: {
    handlers: {
      GET: handler,
      HEAD: handler,
    },
  },
})
