type CacheEntry<T> = {
  promise: Promise<T>
  expiresAt: number
}

const DEFAULT_TTL_MS = 30_000

export const createPromiseCache = <T>(ttlMs: number = DEFAULT_TTL_MS) => {
  const store = new Map<string, CacheEntry<T>>()

  const get = (key: string, factory: () => Promise<T>): Promise<T> => {
    const now = Date.now()
    const existing = store.get(key)
    if (existing && existing.expiresAt > now) return existing.promise
    const promise = factory()
    store.set(key, { promise, expiresAt: now + ttlMs })
    return promise
  }

  const invalidate = (key?: string) => {
    if (key === undefined) store.clear()
    else store.delete(key)
  }

  return { get, invalidate }
}

export const stableKey = (input: Record<string, unknown>): string => {
  const sortedEntries = Object.entries(input)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b))
  return JSON.stringify(sortedEntries)
}
