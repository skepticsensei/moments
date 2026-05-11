type EventType = 'visit' | 'play' | 'complete' | 'category'

interface EventPayload {
  type: EventType
  meditationId?: string
  categoryId?: string
}

const ENDPOINT = '/api/track'
const VISIT_FIRED_KEY = 'moments:visitFiredAt'

function send(payload: EventPayload): void {
  try {
    const body = JSON.stringify(payload)
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' })
      const ok = navigator.sendBeacon(ENDPOINT, blob)
      if (ok) return
    }
    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Analytics must never break the app.
  }
}

export function trackVisit(): void {
  // Dedupe StrictMode double-mount and rapid reloads within a small window
  // so a single tab open counts as one visit per ~30 minutes.
  try {
    const now = Date.now()
    const last = Number(localStorage.getItem(VISIT_FIRED_KEY) ?? '0')
    if (now - last < 30 * 60 * 1000) return
    localStorage.setItem(VISIT_FIRED_KEY, String(now))
  } catch {
    // localStorage unavailable — fall through and count anyway.
  }
  send({ type: 'visit' })
}

export function trackPlay(meditationId: string, categoryId?: string): void {
  send({ type: 'play', meditationId, categoryId })
}

export function trackComplete(meditationId: string, categoryId?: string): void {
  send({ type: 'complete', meditationId, categoryId })
}

export function trackCategory(categoryId: string): void {
  send({ type: 'category', categoryId })
}
