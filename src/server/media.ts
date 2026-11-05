

const RAW_BASE = 'https://raw.githubusercontent.com/OtterCloud00/orchard/main/'
const MAX_PARTS = 64 


type FsModule = typeof import('node:fs')

let fsApi: FsModule | null | undefined

async function getFs(): Promise<FsModule | null> {
  if (fsApi !== undefined) return fsApi
  try {
    const mod = await import('node:fs')
    fsApi =
      ('default' in mod && mod.default
        ? (mod.default as FsModule)
        : (mod as FsModule)) ?? null
  } catch {
    fsApi = null
  }
  return fsApi
}

function env(name: string): string | null {
  return process.env[name] ?? null
}




export function decodeMediaPath(raw: string): string {
  return raw
    .split('/')
    .map((seg) => {
      try {
        return decodeURIComponent(seg)
      } catch {
        return seg
      }
    })
    .join('/')
}

function encodeGithub(rel: string): string {
  return rel
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/')
}


function splitLayout(
  relPath: string,
): { partsDir: string; partBase: string } | null {
  const segs = relPath.split('/')
  if (segs.length < 3) return null 
  const course = segs[0]
  const file = segs[segs.length - 1]
  const folder = segs.slice(1, -1).join('/')
  const dot = file.lastIndexOf('.')
  if (dot === -1) return null
  const stem = file.slice(0, dot)
  return {
    partsDir: `${course}/_split/${folder}/${stem}_parts`,
    partBase: `${file}.part`,
  }
}


function ghHeaders(range?: string): HeadersInit {
  const h: Record<string, string> = {}
  const token = env('GH_TOKEN')
  if (token) h.Authorization = `Bearer ${token}`
  if (range) h.Range = range
  return h
}


async function ghSize(rel: string): Promise<number | null> {
  const res = await fetch(RAW_BASE + encodeGithub(rel), {
    method: 'HEAD',
    headers: ghHeaders(),
  })
  if (!res.ok) return null
  const len = res.headers.get('content-length')
  return len && Number.isFinite(Number(len)) ? Number(len) : null
}

async function ghGet(rel: string, range?: string): Promise<Response> {
  return fetch(RAW_BASE + encodeGithub(rel), { headers: ghHeaders(range) })
}


export const mediaUnconfigured = () => !env('GH_TOKEN') && import.meta.env.PROD



export interface FileSource {
  kind: 'file'
  size: number
  totalSize: number

  ref: string
}

export interface PartsSource {
  kind: 'parts'
  parts: Array<{ ref: string; size: number }>
  totalSize: number
}

export type MediaSource = FileSource | PartsSource

async function sourceFromFs(relPath: string): Promise<MediaSource | null> {
  const fs = await getFs()
  if (!fs) return null
  const { join, resolve } = await import('node:path')
 
  const root = resolve(process.cwd(), env('APPLECORE_MEDIA_DIR') ?? 'media')
  const abs = join(root, relPath)
  try {
    const st = fs.statSync(abs)
    if (st.isFile())
      return { kind: 'file', size: st.size, totalSize: st.size, ref: abs }
  } catch {
  
  }

  const layout = splitLayout(relPath)
  if (!layout) return null
  const absDir = join(root, layout.partsDir)
  let entries: string[]
  try {
    entries = fs.readdirSync(absDir).sort()
  } catch {
    return null
  }
  const parts: Array<{ ref: string; size: number }> = []
  for (const name of entries) {
    if (!name.startsWith(layout.partBase)) continue
    const st = fs.statSync(join(absDir, name))
    if (st.isFile()) parts.push({ ref: join(absDir, name), size: st.size })
  }
  if (parts.length === 0) return null
  return {
    kind: 'parts',
    parts,
    totalSize: parts.reduce((s, p) => s + p.size, 0),
  }
}

async function sourceFromGithub(relPath: string): Promise<MediaSource | null> {
  const size = await ghSize(relPath)
  if (size !== null)
    return { kind: 'file', size, totalSize: size, ref: relPath }

  const layout = splitLayout(relPath)
  if (!layout) return null
  const parts: Array<{ ref: string; size: number }> = []
  for (let i = 0; i < MAX_PARTS; i++) {
    const rel = `${layout.partsDir}/${layout.partBase}${String(i).padStart(3, '0')}`
    const pSize = await ghSize(rel)
    if (pSize === null) break
    parts.push({ ref: rel, size: pSize })
  }
  if (parts.length === 0) return null
  return {
    kind: 'parts',
    parts,
    totalSize: parts.reduce((s, p) => s + p.size, 0),
  }
}


export async function getMediaSource(
  relPath: string,
): Promise<MediaSource | null> {
  if (await getFs()) return sourceFromFs(relPath)
  return sourceFromGithub(relPath)
}

const CONTENT_TYPES: Record<string, string> = {
  '.mp4': 'video/mp4',
  '.m4v': 'video/mp4',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.swift': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
}

export function contentTypeFor(relPath: string): string {
  const dot = relPath.lastIndexOf('.')
  const ext = dot === -1 ? '' : relPath.slice(dot).toLowerCase()
  return CONTENT_TYPES[ext] ?? 'application/octet-stream'
}



export type ParsedRange =
  | { kind: 'none' }
  | { kind: 'ok'; start: number; end: number } // end compreso
  | { kind: 'invalid' }


export function parseRange(header: string | null, total: number): ParsedRange {
  if (!header) return { kind: 'none' }
  const m = /^bytes=(\d*)-(\d*)$/.exec(header.trim())
  if (!m || (m[1] === '' && m[2] === '')) return { kind: 'invalid' }
  let start: number
  let end: number
  if (m[1] === '') {
    const suffix = Number(m[2])
    if (suffix === 0) return { kind: 'invalid' }
    start = Math.max(0, total - suffix)
    end = total - 1
  } else {
    start = Number(m[1])
    end = m[2] === '' ? total - 1 : Math.min(total - 1, Number(m[2]))
  }
  if (start > end || start >= total) return { kind: 'invalid' }
  return { kind: 'ok', start, end }
}


interface Slice {
  ref: string
  start: number
  end: number
}

function slicesFor(src: MediaSource, start: number, end: number): Slice[] {
  if (src.kind === 'file') return [{ ref: src.ref, start, end }]
  const out: Slice[] = []
  let filePos = 0
  for (const part of src.parts) {
    const pStart = filePos
    const pEnd = pStart + part.size // esclusivo
    const s = Math.max(start, pStart)
    const e = Math.min(end + 1, pEnd) // esclusivo
    if (e > s)
      out.push({ ref: part.ref, start: s - pStart, end: e - pStart - 1 })
    filePos = pEnd
    if (filePos > end) break
  }
  return out
}



function streamFromAsyncGen(
  gen: AsyncGenerator<Uint8Array>,
): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { value, done } = await gen.next()
        if (done) controller.close()
        else controller.enqueue(value)
      } catch (err) {
        controller.error(err)
      }
    },
    async cancel() {
      await gen.return(undefined as never).catch(() => undefined)
    },
  })
}

async function* streamSlices(slices: Slice[]): AsyncGenerator<Uint8Array> {
  const fs = await getFs()
  if (fs) {
    for (const s of slices) {
      const stream = fs.createReadStream(s.ref, { start: s.start, end: s.end })
      for await (const chunk of stream) {
        yield chunk instanceof Uint8Array
          ? chunk
          : new Uint8Array(chunk as ArrayBufferLike)
      }
    }
  } else {
    for (const s of slices) {
      const res = await ghGet(s.ref, `bytes=${s.start}-${s.end}`)
      if (!res.ok || !res.body)
        throw new Error(`GitHub ${res.status} per ${s.ref}`)
      const reader = res.body.getReader()
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        if (value) yield value
      }
    }
  }
}



export interface MediaRequestInput {
  relPath: string
  rangeHeader: string | null
  method: string
}

export async function serveMedia({
  relPath,
  rangeHeader,
  method,
}: MediaRequestInput): Promise<Response> {
  if (mediaUnconfigured()) {
    return new Response(
      'Credenziali non configurate: imposta il secret GH_TOKEN sul Worker (wrangler secret put GH_TOKEN).',
      { status: 500 },
    )
  }

  const src = await getMediaSource(relPath)
  if (!src) {
    return new Response('Media non trovato.', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    })
  }

  const range = parseRange(rangeHeader, src.totalSize)
  if (range.kind === 'invalid') {
    return new Response('Intervallo richiesto non valido.', {
      status: 416,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'content-range': `bytes */${src.totalSize}`,
      },
    })
  }

  const status = range.kind === 'ok' ? 206 : 200
  const slice: Slice | null =
    range.kind === 'ok'
      ? { ref: '', start: range.start, end: range.end }
      : { ref: '', start: 0, end: src.totalSize - 1 }
  const length = src.totalSize === 0 ? 0 : slice.end - slice.start + 1

  const headers: Record<string, string> = {
    'content-type': contentTypeFor(relPath),
    'accept-ranges': 'bytes',
    'cache-control': 'public, max-age=3600, immutable',
    'content-length': String(length),
  }
  if (status === 206) {
    headers['content-range'] =
      `bytes ${slice.start}-${slice.end}/${src.totalSize}`
  }

  if (method === 'HEAD') {
    return new Response(null, { status, headers })
  }
  if (src.totalSize === 0) {
    return new Response(null, { status, headers })
  }

  const body = streamFromAsyncGen(
    streamSlices(slicesFor(src, slice.start, slice.end)),
  )
  return new Response(body, { status, headers })
}
