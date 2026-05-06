import type { Meditation } from '../data/meditations'
import { PlayIcon } from './icons'

interface QuickResetCardProps {
  meditation: Meditation
  onStart: () => void
}

export function QuickResetCard({ meditation, onStart }: QuickResetCardProps) {
  return (
    <button
      onClick={onStart}
      className="surface-raised w-full text-left p-4 transition duration-200
                 active:scale-[0.985] active:bg-cream-100
                 bg-gradient-to-br from-cream-50 to-cream-100"
    >
      <div className="flex items-center gap-4">
        <div
          className="relative h-12 w-12 rounded-full bg-forest-600 text-cream-50
                     flex items-center justify-center shrink-0 shadow-soft"
          aria-hidden
        >
          <span
            className="absolute inset-0 rounded-full animate-breathe"
            style={{
              background: 'radial-gradient(circle, rgba(63,92,73,0.30) 0%, transparent 70%)',
              transform: 'scale(1.5)',
            }}
          />
          <PlayIcon className="h-5 w-5 ml-0.5 relative" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="label-tiny mb-0.5">{meditation.duration}</p>
          <h3 className="font-serif text-lg text-forest-700 leading-snug truncate">
            {meditation.title}
          </h3>
          <p className="mt-0.5 text-[12.5px] text-charcoal-700/70 line-clamp-1">
            {meditation.description}
          </p>
        </div>
      </div>
    </button>
  )
}
