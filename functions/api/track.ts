interface Env {
  STATS_KV: KVNamespace
  UNIQUE_SALT?: string
}

interface KVNamespace {
  get(key: string): Promise<string | null>
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>
}

interface PagesContext {
  request: Request
  env: Env
}

interface EventBody {
  type: 'visit' | 'play' | 'complete' | 'category'
  meditationId?: string
  categoryId?: string
}

interface StatsBlob {
  visits: Record<string, number>
  uniqueVisits: Record<string, number>
  totalPlays: number
  totalCompletes: number
  byMeditation: Record<string, { plays: number; completes: number }>
  byCategory: Record<string, number>
  device: Record<string, number>
  browser: Record<string, number>
  firstSeen: string
  lastUpdated: string
}

function emptyStats(now: string): StatsBlob {
  return {
    visits: {},
    uniqueVisits: {},
    totalPlays: 0,
    totalCompletes: 0,
    byMeditation: {},
    byCategory: {},
    device: {},
    browser: {},
    firstSeen: now,
    lastUpdated: now,
  }
}

function todayKey(): string {
  // YYYY-MM-DD in UTC.
  return new Date().toISOString().slice(0, 10)
}

function deviceFromUA(ua: string): 'mobile' | 'desktop' {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(ua) ? 'mobile' : 'desktop'
}

function browserFromUA(ua: string): string {
  // Order matters: Edge contains "Chrome", Chrome contains "Safari", etc.
  if (/Edg\//.test(ua)) return 'Edge'
  if (/OPR\/|Opera/.test(ua)) return 'Opera'
  if (/Firefox\//.test(ua)) return 'Firefox'
  if (/Chrome\//.test(ua)) return 'Chrome'
  if (/Safari\//.test(ua)) return 'Safari'
  return 'Other'
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function onRequestPost(ctx: PagesContext): Promise<Response> {
  const { request, env } = ctx

  if (!env.STATS_KV) {
    return new Response(JSON.stringify({ error: 'kv_not_bound' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }

  let body: EventBody
  try {
    body = (await request.json()) as EventBody
  } catch {
    return new Response('bad json', { status: 400 })
  }

  if (!body || !body.type) {
    return new Response('missing type', { status: 400 })
  }

  const ua = request.headers.get('user-agent') ?? ''
  const ip = request.headers.get('cf-connecting-ip') ?? '0.0.0.0'
  const day = todayKey()
  const salt = env.UNIQUE_SALT ?? 'moments-default-salt'

  const raw = await env.STATS_KV.get('stats')
  const stats: StatsBlob = raw ? JSON.parse(raw) : emptyStats(new Date().toISOString())

  switch (body.type) {
    case 'visit': {
      stats.visits[day] = (stats.visits[day] ?? 0) + 1
      const visitorHash = await sha256Hex(`${ip}|${ua}|${day}|${salt}`)
      const uniqKey = `uniq:${day}:${visitorHash}`
      const seen = await env.STATS_KV.get(uniqKey)
      if (!seen) {
        await env.STATS_KV.put(uniqKey, '1', { expirationTtl: 60 * 60 * 48 })
        stats.uniqueVisits[day] = (stats.uniqueVisits[day] ?? 0) + 1
      }
      stats.device[deviceFromUA(ua)] = (stats.device[deviceFromUA(ua)] ?? 0) + 1
      stats.browser[browserFromUA(ua)] = (stats.browser[browserFromUA(ua)] ?? 0) + 1
      break
    }
    case 'play': {
      stats.totalPlays += 1
      if (body.meditationId) {
        const m = stats.byMeditation[body.meditationId] ?? { plays: 0, completes: 0 }
        m.plays += 1
        stats.byMeditation[body.meditationId] = m
      }
      if (body.categoryId) {
        // Don't double-count category here; trackCategory covers browsing.
      }
      break
    }
    case 'complete': {
      stats.totalCompletes += 1
      if (body.meditationId) {
        const m = stats.byMeditation[body.meditationId] ?? { plays: 0, completes: 0 }
        m.completes += 1
        stats.byMeditation[body.meditationId] = m
      }
      break
    }
    case 'category': {
      if (body.categoryId) {
        stats.byCategory[body.categoryId] = (stats.byCategory[body.categoryId] ?? 0) + 1
      }
      break
    }
    default:
      return new Response('unknown type', { status: 400 })
  }

  stats.lastUpdated = new Date().toISOString()
  await env.STATS_KV.put('stats', JSON.stringify(stats))

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'content-type': 'application/json' },
  })
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, { status: 204 })
}
