import { createFileRoute } from '@tanstack/react-router'
import { auth } from '#/lib/auth'

const BLOCKED = ['/sign-up'] 
const MOUNT = '/api/auth'

async function handle(request: Request): Promise<Response> {
  const path = new URL(request.url).pathname.slice(MOUNT.length)
  if (BLOCKED.some((p) => path.startsWith(p))) {
    return new Response('Not found', { status: 404 })
  }
  return auth.handler(request)
}

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
    },
  },
})
