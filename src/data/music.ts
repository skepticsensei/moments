export type MusicMood = 'ambient' | 'natural' | 'drone' | 'rhythmic'

export interface MusicTrack {
  id: string
  title: string
  src: string
  mood?: MusicMood
  attribution?: string
  /**
   * Per-track loudness multiplier to balance the library. Default 1.
   * Final playback volume = base music volume (~0.0625) × gain, clamped 0..1.
   * Lower a loud track with e.g. `gain: 0.6`. Raise a quiet one with `gain: 1.4`.
   */
  gain?: number
}

/**
 * Music library — every available music bed.
 *
 * Files live in `public/audio/music/`. The player picks one at random when
 * a meditation opens, starts at a random offset within the track, and
 * fades in/out so the music matches the meditation's length.
 */
export const MUSIC_LIBRARY: MusicTrack[] = [
  {
    id: 'drift-one',
    title: 'Drift One',
    src: '/audio/music/drift-one.m4a',
    mood: 'ambient',
  },
  {
    id: 'drift-two',
    title: 'Drift Two',
    src: '/audio/music/drift-two.m4a',
    mood: 'ambient',
  },
  {
    id: 'drift-four',
    title: 'Drift Four',
    src: '/audio/music/drift-four.m4a',
    mood: 'ambient',
  },
  {
    id: 'drift-five',
    title: 'Drift Five',
    src: '/audio/music/drift-five.m4a',
    mood: 'ambient',
  },
  {
    id: 'drift-nine',
    title: 'Drift Nine',
    src: '/audio/music/drift-nine.m4a',
    mood: 'ambient',
  },
  {
    id: 'drift-ten',
    title: 'Drift Ten',
    src: '/audio/music/drift-ten.m4a',
    mood: 'ambient',
  },
  {
    id: 'babbling-brook',
    title: 'Babbling Brook',
    src: '/audio/music/babbling-brook.m4a',
    mood: 'natural',
  },
  {
    id: 'birds-and-brook',
    title: 'Birds and Babbling Brook',
    src: '/audio/music/birds-and-brook.m4a',
    mood: 'natural',
  },
  {
    id: 'birds-chirping',
    title: 'Birds Chirping',
    src: '/audio/music/birds-chirping.m4a',
    mood: 'natural',
  },
  {
    id: 'waves',
    title: 'Waves',
    src: '/audio/music/waves.m4a',
    mood: 'natural',
  },
]

interface PickOptions {
  excludeId?: string
  moods?: MusicMood[]
}

export function pickRandomTrack(opts: PickOptions = {}): MusicTrack | null {
  const { excludeId, moods } = opts
  let pool = MUSIC_LIBRARY
  if (moods && moods.length > 0) {
    const filtered = pool.filter((t) => t.mood && moods.includes(t.mood))
    if (filtered.length > 0) pool = filtered
  }
  if (excludeId && pool.length > 1) {
    pool = pool.filter((t) => t.id !== excludeId)
  }
  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}
