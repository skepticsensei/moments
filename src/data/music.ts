export type MusicMood = 'ambient' | 'natural' | 'drone' | 'rhythmic'

export interface MusicTrack {
  id: string
  title: string
  src: string
  mood?: MusicMood
  attribution?: string
  /**
   * Per-track loudness multiplier to balance the library. Default 1.
   * Final playback volume = MUSIC_VOLUME × gain, clamped 0..1.
   * Gains target ~-32 LUFS so any random track sits at the same bed level.
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
// Gains normalize each track to ~-32 LUFS so no single random pick is
// noticeably louder than the others. Measured with ffmpeg loudnorm against
// the source files; recompute if you replace a track.
export const MUSIC_LIBRARY: MusicTrack[] = [
  {
    id: 'drift-one',
    title: 'Drift One',
    src: '/audio/music/drift-one.m4a',
    mood: 'ambient',
    gain: 0.28,
  },
  {
    id: 'drift-two',
    title: 'Drift Two',
    src: '/audio/music/drift-two.m4a',
    mood: 'ambient',
    gain: 0.42,
  },
  {
    id: 'drift-four',
    title: 'Drift Four',
    src: '/audio/music/drift-four.m4a',
    mood: 'ambient',
    gain: 0.12,
  },
  {
    id: 'drift-five',
    title: 'Drift Five',
    src: '/audio/music/drift-five.m4a',
    mood: 'ambient',
    gain: 0.09,
  },
  {
    id: 'drift-nine',
    title: 'Drift Nine',
    src: '/audio/music/drift-nine.m4a',
    mood: 'ambient',
    gain: 0.21,
  },
  {
    id: 'drift-ten',
    title: 'Drift Ten',
    src: '/audio/music/drift-ten.m4a',
    mood: 'ambient',
    gain: 0.15,
  },
  {
    id: 'babbling-brook',
    title: 'Babbling Brook',
    src: '/audio/music/babbling-brook.m4a',
    mood: 'natural',
    gain: 0.64,
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
    gain: 0.53,
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
