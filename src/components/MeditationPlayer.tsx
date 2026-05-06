import { useEffect, useRef, useState } from 'react'
import type { Meditation } from '../data/meditations'
import { getCategory } from '../data/meditations'
import { pickRandomTrack, type MusicTrack } from '../data/music'
import {
  ChevronDownIcon,
  HeartIcon,
  PauseIcon,
  PlayIcon,
} from './icons'

const MUSIC_VOLUME = 0.35
const FADE_IN_S = 6
const FADE_OUT_S = 5
// exponentialRampToValueAtTime can't ramp to/from 0; use a near-silent floor.
const SILENCE = 0.0001

function targetMusicVolume(track: MusicTrack | null): number {
  const gain = track?.gain ?? 1
  return Math.max(0, Math.min(1, MUSIC_VOLUME * gain))
}

interface MeditationPlayerProps {
  meditation: Meditation
  isFavorite: boolean
  onToggleFavorite: () => void
  onClose: () => void
  onPlay: () => void
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function MeditationPlayer({
  meditation,
  isFavorite,
  onToggleFavorite,
  onClose,
  onPlay,
}: MeditationPlayerProps) {
  const category = getCategory(meditation.category)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const musicRef = useRef<HTMLAudioElement | null>(null)
  const fallbackTimerRef = useRef<number | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const musicSourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const musicGainRef = useRef<GainNode | null>(null)
  const musicGraphElRef = useRef<HTMLAudioElement | null>(null)
  const fadeEndTimerRef = useRef<number | null>(null)
  const hasStartedMusicRef = useRef(false)

  const [audioAvailable, setAudioAvailable] = useState<boolean | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(meditation.durationSeconds)
  const [transcriptOpen, setTranscriptOpen] = useState(false)
  const [reflectionVisible, setReflectionVisible] = useState(false)
  const [hasMarkedPlay, setHasMarkedPlay] = useState(false)
  const [musicTrack, setMusicTrack] = useState<MusicTrack | null>(() =>
    pickRandomTrack()
  )
  const [musicAvailable, setMusicAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(meditation.durationSeconds)
    setAudioAvailable(null)
    setTranscriptOpen(false)
    setReflectionVisible(false)
    setHasMarkedPlay(false)
    setMusicTrack(pickRandomTrack())
    setMusicAvailable(null)
    hasStartedMusicRef.current = false
    cancelFade()
    if (fallbackTimerRef.current) {
      window.clearInterval(fallbackTimerRef.current)
      fallbackTimerRef.current = null
    }
  }, [meditation.id, meditation.durationSeconds])


  useEffect(() => {
    return () => {
      if (fallbackTimerRef.current) {
        window.clearInterval(fallbackTimerRef.current)
      }
      cancelFade()
      const ctx = audioCtxRef.current
      if (ctx && ctx.state !== 'closed') ctx.close().catch(() => {})
      audioCtxRef.current = null
      musicSourceRef.current = null
      musicGainRef.current = null
      musicGraphElRef.current = null
    }
  }, [])

  function cancelFade() {
    if (fadeEndTimerRef.current !== null) {
      window.clearTimeout(fadeEndTimerRef.current)
      fadeEndTimerRef.current = null
    }
    const gain = musicGainRef.current
    const ctx = audioCtxRef.current
    if (gain && ctx) {
      const now = ctx.currentTime
      const current = gain.gain.value
      gain.gain.cancelScheduledValues(now)
      // Lock current value so a fresh ramp starts from where we are.
      gain.gain.setValueAtTime(Math.max(current, SILENCE), now)
    }
  }

  // Lazily build the Web Audio graph for the music element so we can do
  // sample-accurate, perceptually-smooth fades via GainNode automation.
  function ensureMusicGraph(): GainNode | null {
    const audio = musicRef.current
    if (!audio) return null

    // Audio element changed (new meditation / new track) — rebuild graph.
    if (musicGraphElRef.current && musicGraphElRef.current !== audio) {
      try {
        musicSourceRef.current?.disconnect()
        musicGainRef.current?.disconnect()
      } catch {}
      musicSourceRef.current = null
      musicGainRef.current = null
      musicGraphElRef.current = null
    }

    if (musicGainRef.current) return musicGainRef.current

    let ctx = audioCtxRef.current
    if (!ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext
      if (!Ctor) return null
      ctx = new Ctor()
      audioCtxRef.current = ctx
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {})

    try {
      const source = ctx.createMediaElementSource(audio)
      const gain = ctx.createGain()
      gain.gain.value = SILENCE
      source.connect(gain)
      gain.connect(ctx.destination)
      musicSourceRef.current = source
      musicGainRef.current = gain
      musicGraphElRef.current = audio
      return gain
    } catch {
      return null
    }
  }

  // Schedule a smooth ramp on the music GainNode. exponentialRampToValueAtTime
  // produces a curve that matches how the ear perceives loudness — a true
  // gradual fade rather than a linear amplitude sweep.
  function fadeMusicTo(target: number, onDone?: () => void) {
    const gain = musicGainRef.current
    const ctx = audioCtxRef.current
    if (!gain || !ctx) {
      onDone?.()
      return
    }
    cancelFade()
    const now = ctx.currentTime
    const current = Math.max(gain.gain.value, SILENCE)
    const isFadeIn = target > current
    const duration = isFadeIn ? FADE_IN_S : FADE_OUT_S
    gain.gain.setValueAtTime(current, now)
    if (target <= 0) {
      gain.gain.exponentialRampToValueAtTime(SILENCE, now + duration)
      gain.gain.setValueAtTime(0, now + duration)
    } else {
      gain.gain.exponentialRampToValueAtTime(
        Math.max(target, SILENCE),
        now + duration
      )
    }
    if (onDone) {
      fadeEndTimerRef.current = window.setTimeout(() => {
        fadeEndTimerRef.current = null
        onDone()
      }, duration * 1000)
    }
  }

  const stopFallbackTimer = () => {
    if (fallbackTimerRef.current) {
      window.clearInterval(fallbackTimerRef.current)
      fallbackTimerRef.current = null
    }
  }

  const playMusic = () => {
    const m = musicRef.current
    if (!m || musicAvailable === false) return
    const gain = ensureMusicGraph()
    if (!gain) {
      // Web Audio unavailable — fall back to element-level volume so we still
      // get *something* even if it's not as smooth.
      m.volume = hasStartedMusicRef.current ? m.volume : 0
      hasStartedMusicRef.current = true
      m.play().catch(() => setMusicAvailable(false))
      return
    }
    const ctx = audioCtxRef.current
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {})

    const target = targetMusicVolume(musicTrack)
    // First time the music starts in this session: snap gain to silence so the
    // fade-in is audible from the very beginning. On resume, leave the current
    // gain alone so pause/resume doesn't restart the fade.
    if (!hasStartedMusicRef.current) {
      cancelFade()
      const now = ctx?.currentTime ?? 0
      gain.gain.cancelScheduledValues(now)
      gain.gain.setValueAtTime(SILENCE, now)
      hasStartedMusicRef.current = true
    }
    // Make sure the underlying element is at full element-volume; the fade is
    // happening on the GainNode, not on m.volume.
    m.volume = 1
    m.play()
      .then(() => {
        if (gain.gain.value < target - 0.001) fadeMusicTo(target)
      })
      .catch(() => setMusicAvailable(false))
  }

  const finish = () => {
    setIsPlaying(false)
    setReflectionVisible(true)
    stopFallbackTimer()
    fadeMusicTo(0, () => {
      const m = musicRef.current
      if (m) {
        m.pause()
        m.currentTime = 0
      }
    })
  }

  const startFallbackTimer = () => {
    stopFallbackTimer()
    fallbackTimerRef.current = window.setInterval(() => {
      setCurrentTime((t) => {
        const next = t + 1
        if (next >= meditation.durationSeconds) {
          finish()
          return meditation.durationSeconds
        }
        return next
      })
    }, 1000)
  }

  const handlePlayPause = () => {
    if (!hasMarkedPlay) {
      onPlay()
      setHasMarkedPlay(true)
    }
    const audio = audioRef.current
    if (audio && audioAvailable !== false) {
      if (isPlaying) {
        audio.pause()
        cancelFade()
        musicRef.current?.pause()
      } else {
        audio
          .play()
          .then(() => playMusic())
          .catch(() => {
            setAudioAvailable(false)
            setIsPlaying(true)
            startFallbackTimer()
            playMusic()
          })
      }
    } else {
      if (isPlaying) {
        setIsPlaying(false)
        stopFallbackTimer()
        cancelFade()
        musicRef.current?.pause()
      } else {
        setIsPlaying(true)
        startFallbackTimer()
        playMusic()
      }
    }
  }


  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value)
    setCurrentTime(next)
    const audio = audioRef.current
    if (audio && audioAvailable) {
      audio.currentTime = next
    }
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col anim-modal"
      role="dialog"
      aria-modal="true"
      aria-label={meditation.title}
      style={{
        background: `
          radial-gradient(600px 400px at 80% -10%, ${category.accent}24, transparent 65%),
          radial-gradient(500px 300px at -10% 110%, ${category.accent}18, transparent 60%),
          #FBF7F0`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 h-14 shrink-0"
        style={{
          paddingTop: 'max(env(safe-area-inset-top), 0px)',
          height: 'calc(56px + max(env(safe-area-inset-top), 0px))',
        }}
      >
        <button
          onClick={onClose}
          className="h-10 w-10 rounded-full flex items-center justify-center
                     text-forest-700 hover:bg-cream-200/70 active:scale-95 transition"
          aria-label="Close player"
        >
          <ChevronDownIcon className="h-5 w-5" />
        </button>
        <span
          className="text-[11px] uppercase tracking-[0.18em] font-medium"
          style={{ color: category.accent }}
        >
          {category.name}
        </span>
        <button
          onClick={onToggleFavorite}
          className={`h-10 w-10 rounded-full flex items-center justify-center transition active:scale-95
                      ${isFavorite ? 'text-clay-600' : 'text-charcoal-700/40 hover:text-clay-600'}`}
          aria-label={isFavorite ? 'Remove from saved' : 'Save for later'}
          aria-pressed={isFavorite}
        >
          <HeartIcon className="h-5 w-5" filled={isFavorite} />
        </button>
      </div>

      {meditation.audioSrc && (
        <audio
          ref={audioRef}
          src={meditation.audioSrc}
          preload="metadata"
          onLoadedMetadata={() => setAudioAvailable(true)}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={(e) => {
            // Voice ended. If the meditation duration extends beyond the voice
            // track, keep the music playing and run a tail timer until the
            // full meditation duration is reached.
            const t = e.currentTarget.currentTime
            if (t >= meditation.durationSeconds - 0.5) {
              finish()
            } else {
              startFallbackTimer()
            }
          }}
          onError={() => setAudioAvailable(false)}
        />
      )}

      {musicTrack && (
        <audio
          ref={musicRef}
          src={musicTrack.src}
          loop
          preload="auto"
          onLoadedMetadata={(e) => {
            // Start at a random offset so each session feels different. Clamp
            // so there's at least the meditation duration left in the track —
            // looping is a safety net if a track is unexpectedly short.
            const m = e.currentTarget
            if (isFinite(m.duration) && m.duration > 0) {
              const maxOffset = Math.max(0, m.duration - meditation.durationSeconds)
              m.currentTime = Math.random() * maxOffset
            }
          }}
          onLoadedData={() => {
            setMusicAvailable(true)
            if (isPlaying) {
              playMusic()
            }
          }}
          onError={() => setMusicAvailable(false)}
        />
      )}

      {/* Body */}
      <div
        className="flex-1 overflow-y-auto px-6 pb-6"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 24px)' }}
      >
        <div className="text-center mt-4">
          <p className="text-[12px] text-charcoal-700/60">{meditation.duration}</p>
          <h1 className="font-serif text-[28px] sm:text-3xl text-forest-700 mt-2 leading-tight">
            {meditation.title}
          </h1>
          <p className="mt-3 text-[14px] text-charcoal-700/75 leading-relaxed max-w-[34ch] mx-auto">
            {meditation.description}
          </p>
          <p className="mt-2 text-[12.5px] italic text-sage-500">
            For: {meditation.moment}
          </p>
        </div>

        {/* Big play button */}
        <div className="mt-10 flex flex-col items-center">
          <div className="relative">
            <div
              className={`absolute inset-0 rounded-full ${isPlaying ? 'animate-breathe' : ''}`}
              style={{
                background: `radial-gradient(circle, ${category.accent}3D 0%, transparent 65%)`,
                transform: 'scale(1.7)',
              }}
              aria-hidden
            />
            <button
              onClick={handlePlayPause}
              className="relative h-24 w-24 rounded-full bg-forest-600 text-cream-50
                         hover:bg-forest-700 active:scale-[0.97] transition shadow-glow
                         flex items-center justify-center"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <PauseIcon className="h-9 w-9" />
              ) : (
                <PlayIcon className="h-9 w-9 ml-1" />
              )}
            </button>
          </div>

          <div className="w-full mt-7">
            <input
              type="range"
              min={0}
              max={duration}
              step={1}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Playback position"
              className="meditation-progress w-full"
              style={
                {
                  '--progress': `${progressPercent}%`,
                  '--accent': category.accent,
                } as React.CSSProperties
              }
            />
            <div className="mt-2 flex justify-between text-xs text-charcoal-700/60 tabular-nums">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

        </div>

        {/* Transcript */}
        {meditation.transcript && (
          <div className="mt-10 surface p-5">
            <button
              onClick={() => setTranscriptOpen((v) => !v)}
              className="w-full flex items-center justify-between gap-2 text-sm font-medium text-forest-700"
              aria-expanded={transcriptOpen}
            >
              <span>Guide text</span>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${transcriptOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {transcriptOpen && (
              <p className="mt-4 text-charcoal-700/85 leading-relaxed font-serif text-[16px] anim-fade">
                {meditation.transcript}
              </p>
            )}
          </div>
        )}

        {/* Reflection */}
        {reflectionVisible && meditation.reflection && (
          <div className="mt-6 surface p-5 anim-fade">
            <p className="label-tiny mb-2">Reflection</p>
            <p className="font-serif text-lg text-forest-700 leading-snug">
              {meditation.reflection}
            </p>
            <p className="mt-2 text-[12.5px] text-charcoal-700/70">
              No need to answer right away. Let the question stay with you.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
