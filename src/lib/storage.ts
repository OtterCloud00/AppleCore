
const PREFIX = "hub:";

function key(kind: string, id: string): string {
  return `${PREFIX}${kind}:${id}`;
}

export function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function lsSet(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    
  }
}

export function lsRemove(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    
  }
}

export type DoneMap = Record<string, boolean>;

export function loadAllDone(): DoneMap {
  const out: DoneMap = {};
  if (typeof window === "undefined") return out;
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(PREFIX + "done:")) {
        out[key.slice((PREFIX + "done:").length)] = true;
      }
    }
  } catch {
    
  }
  return out;
}

// --- Domain interface: routes call these instead of raw keys ---

export function getDone(lessonId: string): boolean {
  return lsGet<boolean>(key("done", lessonId), false);
}

export function setDone(lessonId: string, value: boolean): void {
  if (value) {
    lsSet(key("done", lessonId), true);
  } else {
    lsRemove(key("done", lessonId));
  }
}

export function removeDone(lessonId: string): void {
  lsRemove(key("done", lessonId));
}

export function getNote(lessonId: string): string {
  return lsGet<string>(key("note", lessonId), "");
}

export function setNote(lessonId: string, value: string): void {
  lsSet(key("note", lessonId), value);
}

export function getPos(lessonId: string): number {
  return lsGet<number>(key("pos", lessonId), 0);
}

export function setPos(lessonId: string, value: number): void {
  lsSet(key("pos", lessonId), value);
}
