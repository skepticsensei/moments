import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'still-root-moments:recent'
const MAX_RECENT = 6

function readStorage(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

export function useRecentlyPlayed() {
  const [recent, setRecent] = useState<string[]>(() => readStorage())

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recent))
    } catch {
      // ignore
    }
  }, [recent])

  const markPlayed = useCallback((id: string) => {
    setRecent((prev) => {
      const without = prev.filter((x) => x !== id)
      return [id, ...without].slice(0, MAX_RECENT)
    })
  }, [])

  return { recent, markPlayed }
}
