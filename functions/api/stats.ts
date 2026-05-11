interface Env {
  STATS_KV: KVNamespace
}

interface KVNamespace {
  get(key: string): Promise<string | null>
}

interface PagesContext {
  request: Request
  env: Env
}

export async function onRequestGet(ctx: PagesContext): Promise<Response> {
  const { env } = ctx

  if (!env.STATS_KV) {
    return new Response(JSON.stringify({ error: 'kv_not_bound' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }

  const raw = await env.STATS_KV.get('stats')
  const body =
    raw ??
    JSON.stringify({
      visits: {},
      uniqueVisits: {},
      totalPlays: 0,
      totalCompletes: 0,
      byMeditation: {},
      byCategory: {},
      device: {},
      browser: {},
      firstSeen: null,
      lastUpdated: null,
    })

  return new Response(body, {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  })
}
