import { useEffect, useMemo, useState } from 'react'
import {
  CATEGORIES,
  getCategory,
  getMeditation,
  type CategoryId,
} from '../../data/meditations'

interface StatsBlob {
  visits: Record<string, number>
  uniqueVisits: Record<string, number>
  totalPlays: number
  totalCompletes: number
  byMeditation: Record<string, { plays: number; completes: number }>
  byCategory: Record<string, number>
  device: Record<string, number>
  browser: Record<string, number>
  firstSeen: string | null
  lastUpdated: string | null
}

type FetchState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ok'; data: StatsBlob }

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function lastNDays(n: number): string[] {
  const out: string[] = []
  const d = new Date()
  for (let i = 0; i < n; i++) {
    out.push(d.toISOString().slice(0, 10))
    d.setUTCDate(d.getUTCDate() - 1)
  }
  return out
}

function sumByDays(counts: Record<string, number>, days: string[]): number {
  return days.reduce((acc, k) => acc + (counts[k] ?? 0), 0)
}

function sumAll(counts: Record<string, number>): number {
  return Object.values(counts).reduce((a, b) => a + b, 0)
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <div className="surface px-4 py-4">
      <div className="label-tiny">{label}</div>
      <div className="mt-1 font-serif text-3xl text-forest-700 leading-none">
        {value}
      </div>
      {sub && <div className="mt-1.5 text-[12px] text-charcoal-700/65">{sub}</div>}
    </div>
  )
}

function BarRow({
  label,
  value,
  max,
  accent,
}: {
  label: string
  value: number
  max: number
  accent?: string
}) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3">
          <span className="truncate text-[13px] text-charcoal-800">{label}</span>
          <span className="text-[12px] tabular-nums text-charcoal-700/70">
            {value}
          </span>
        </div>
        <div className="mt-1 h-1.5 rounded-full bg-cream-200 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: accent ?? '#3F5C49',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export function StatsScreen() {
  const [state, setState] = useState<FetchState>({ kind: 'loading' })

  useEffect(() => {
    let cancelled = false
    fetch('/api/stats', { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = (await res.json()) as StatsBlob
        if (!cancelled) setState({ kind: 'ok', data })
      })
      .catch((err) => {
        if (!cancelled) setState({ kind: 'error', message: String(err) })
      })
    return () => {
      cancelled = true
    }
  }, [])

  const today = todayKey()
  const last7 = useMemo(() => lastNDays(7), [])

  const goBack = () => {
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    window.location.reload()
  }

  return (
    <div className="phone-frame">
      <div className="top-bar">
        <button
          onClick={goBack}
          className="text-[13px] text-forest-700 hover:text-forest-600 active:scale-[0.97] transition"
        >
          ← Back to app
        </button>
        <h1 className="text-[15px] font-serif text-forest-700 m-0">Stats</h1>
        <span className="w-[60px]" aria-hidden />
      </div>

      <div className="screen">
        <div className="screen-padding anim-fade flex flex-col gap-5">
          {state.kind === 'loading' && (
            <p className="text-[13px] text-charcoal-700/65 text-center mt-10">
              Loading…
            </p>
          )}

          {state.kind === 'error' && (
            <p className="text-[13px] text-charcoal-700/65 text-center mt-10">
              Couldn't load stats.
              <br />
              <span className="text-[11px] opacity-60">{state.message}</span>
            </p>
          )}

          {state.kind === 'ok' && <StatsContent data={state.data} today={today} last7={last7} />}
        </div>
      </div>
    </div>
  )
}

function StatsContent({
  data,
  today,
  last7,
}: {
  data: StatsBlob
  today: string
  last7: string[]
}) {
  const visitsToday = data.visits[today] ?? 0
  const visitsWeek = sumByDays(data.visits, last7)
  const visitsAll = sumAll(data.visits)
  const uniqueToday = data.uniqueVisits[today] ?? 0
  const uniqueWeek = sumByDays(data.uniqueVisits, last7)
  const uniqueAll = sumAll(data.uniqueVisits)

  const completionRate =
    data.totalPlays > 0
      ? Math.round((data.totalCompletes / data.totalPlays) * 100)
      : 0

  const topMeditations = Object.entries(data.byMeditation)
    .map(([id, c]) => ({ id, ...c }))
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 10)
  const topMeditationMax = topMeditations[0]?.plays ?? 0

  const categoryEntries = (CATEGORIES as Array<{ id: CategoryId; accent: string; name: string }>)
    .map((c) => ({ id: c.id, name: c.name, accent: c.accent, value: data.byCategory[c.id] ?? 0 }))
    .sort((a, b) => b.value - a.value)
  const categoryMax = categoryEntries[0]?.value ?? 0

  const deviceMax = Math.max(data.device.mobile ?? 0, data.device.desktop ?? 0, 1)
  const browserEntries = Object.entries(data.browser)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
  const browserMax = browserEntries[0]?.[1] ?? 1

  return (
    <>
      <section>
        <h2 className="label-tiny mb-3">Visits</h2>
        <div className="grid grid-cols-3 gap-2.5">
          <StatCard label="Today" value={visitsToday} sub={`${uniqueToday} unique`} />
          <StatCard label="7 days" value={visitsWeek} sub={`${uniqueWeek} unique`} />
          <StatCard label="All-time" value={visitsAll} sub={`${uniqueAll} unique`} />
        </div>
      </section>

      <section>
        <h2 className="label-tiny mb-3">Meditations</h2>
        <div className="grid grid-cols-3 gap-2.5">
          <StatCard label="Plays" value={data.totalPlays} />
          <StatCard label="Completes" value={data.totalCompletes} />
          <StatCard
            label="Completion"
            value={`${completionRate}%`}
            sub={data.totalPlays === 0 ? 'no plays yet' : undefined}
          />
        </div>
      </section>

      <section className="surface px-4 py-4">
        <h2 className="label-tiny mb-3">Top meditations</h2>
        {topMeditations.length === 0 ? (
          <p className="text-[12.5px] text-charcoal-700/60">No plays recorded yet.</p>
        ) : (
          <div>
            {topMeditations.map((m) => {
              const med = getMeditation(m.id)
              const accent = med ? getCategory(med.category).accent : '#3F5C49'
              return (
                <BarRow
                  key={m.id}
                  label={med?.title ?? m.id}
                  value={m.plays}
                  max={topMeditationMax}
                  accent={accent}
                />
              )
            })}
          </div>
        )}
      </section>

      <section className="surface px-4 py-4">
        <h2 className="label-tiny mb-3">Categories</h2>
        {categoryMax === 0 ? (
          <p className="text-[12.5px] text-charcoal-700/60">No category visits yet.</p>
        ) : (
          <div>
            {categoryEntries.map((c) => (
              <BarRow
                key={c.id}
                label={c.name}
                value={c.value}
                max={categoryMax}
                accent={c.accent}
              />
            ))}
          </div>
        )}
      </section>

      <section className="surface px-4 py-4">
        <h2 className="label-tiny mb-3">Devices</h2>
        <BarRow label="Mobile" value={data.device.mobile ?? 0} max={deviceMax} />
        <BarRow label="Desktop" value={data.device.desktop ?? 0} max={deviceMax} />
      </section>

      <section className="surface px-4 py-4">
        <h2 className="label-tiny mb-3">Browsers</h2>
        {browserEntries.length === 0 ? (
          <p className="text-[12.5px] text-charcoal-700/60">No data yet.</p>
        ) : (
          <div>
            {browserEntries.map(([name, count]) => (
              <BarRow key={name} label={name} value={count} max={browserMax} />
            ))}
          </div>
        )}
      </section>

      {data.lastUpdated && (
        <p className="text-[11px] text-charcoal-700/45 text-center pt-2">
          Last updated {new Date(data.lastUpdated).toLocaleString()}
        </p>
      )}
    </>
  )
}
