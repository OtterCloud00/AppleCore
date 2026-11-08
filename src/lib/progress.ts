import { createStore } from '@tanstack/store'
import { useSelector } from '@tanstack/react-store'
import { throttle } from '@tanstack/pacer'

/**
 * Client-side progress state (positions, completed lessons, notes).
 *
 * Storage layout:
 * - `hub:progress` → versioned single key, { version, state }
 * - legacy `hub:pos:*` / `hub:done:*` / `hub:note:*` keys are still read
 *   during hydration for backwards compatibility (never written anymore).
 */
export interface ProgressState {
  pos: Record<string, number>
  done: Record<string, boolean>
  notes: Record<string, string>
}

const STORAGE_KEY = 'hub:progress'
const VERSION = 1
const LEGACY_PREFIXES = ['hub:pos:', 'hub:done:', 'hub:note:'] as const

export const progressStore = createStore<ProgressState>({
  pos: {},
  done: {},
  notes: {},
})

export function useProgress<T>(selector: (state: ProgressState) => T): T {
  return useSelector(progressStore, selector)
}

// --- hydration -------------------------------------------------------------

let hydrated = false

export function hydrateProgress(): void {
  if (typeof window === 'undefined' || hydrated) return
  hydrated = true

  progressStore.setState((prev) => readSnapshot(prev))

  // cross-tab sync: another tab wrote to our namespace → re-read storage
  window.addEventListener('storage', (e) => {
    if (!e.key || !e.key.startsWith('hub:')) return
    if (
      !LEGACY_PREFIXES.some((p) => e.key!.startsWith(p)) &&
      e.key !== STORAGE_KEY
    )
      return
    progressStore.setState((prev) => readSnapshot(prev))
  })

  // persist on every change (throttled trailing write)
  progressStore.subscribe(persistThrottled)
}

function readSnapshot(prev: ProgressState): ProgressState {
  const state: ProgressState = {
    pos: { ...prev.pos },
    done: { ...prev.done },
    notes: { ...prev.notes },
  }

  // legacy keys first, versioned key overrides afterwards
  try {
    for (const p of LEGACY_PREFIXES) {
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i)
        if (!key || !key.startsWith(p)) continue
        const id = key.slice(p.length)
        try {
          const raw = window.localStorage.getItem(key)
          if (raw === null) continue
          const value = JSON.parse(raw)
          if (p === 'hub:pos:') state.pos[id] = value
          else if (p === 'hub:done:') state.done[id] = Boolean(value)
          else state.notes[id] = String(value)
        } catch {}
      }
    }
  } catch {}

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as {
        version: number
        state: ProgressState
      }
      if (parsed?.version === VERSION && parsed.state) {
        state.pos = { ...state.pos, ...parsed.state.pos }
        state.done = { ...state.done, ...parsed.state.done }
        state.notes = { ...state.notes, ...parsed.state.notes }
      }
    }
  } catch {}

  return state
}

const persistThrottled = throttle(persist, { wait: 300, trailing: true })

function persist(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: VERSION, state: progressStore.state }),
    )
  } catch {}
}

// --- actions ---------------------------------------------------------------

export function setPos(lessonId: string, seconds: number): void {
  progressStore.setState((s) => ({
    ...s,
    pos: { ...s.pos, [lessonId]: seconds },
  }))
}

/** Reset resume position (i.e. after completing or restarting a video). */
export function clearPos(lessonId: string): void {
  progressStore.setState((s) => {
    const pos = { ...s.pos }
    delete pos[lessonId]
    return { ...s, pos }
  })
}

export function markDone(lessonId: string): void {
  progressStore.setState((s) => ({
    ...s,
    done: { ...s.done, [lessonId]: true },
  }))
}

export function unmarkDone(lessonId: string): void {
  progressStore.setState((s) => {
    const done = { ...s.done }
    delete done[lessonId]
    return { ...s, done }
  })
}

export function setNote(lessonId: string, note: string): void {
  progressStore.setState((s) => ({
    ...s,
    notes: { ...s.notes, [lessonId]: note },
  }))
}
