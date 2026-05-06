import type { Meditation } from '../data/meditations'
import { getCategory } from '../data/meditations'
import { HeartIcon } from './icons'

interface MeditationRowProps {
  meditation: Meditation
  isFavorite: boolean
  onToggleFavorite: () => void
  onSelect: () => void
}

export function MeditationRow({
  meditation,
  isFavorite,
  onToggleFavorite,
  onSelect,
}: MeditationRowProps) {
  const category = getCategory(meditation.category)

  return (
    <div className="meditation-row group">
      <button
        onClick={onSelect}
        className="flex-1 flex items-center gap-3 min-w-0 text-left"
        aria-label={`Open ${meditation.title}, ${meditation.duration}`}
      >
        <div
          className="h-12 w-12 rounded-full shrink-0 flex flex-col items-center justify-center
                     border"
          style={{
            backgroundColor: `${category.accent}14`,
            borderColor: `${category.accent}33`,
            color: category.accent,
          }}
          aria-hidden
        >
          <span className="font-serif text-[15px] leading-none font-medium tabular-nums">
            {meditation.duration.replace(' min', '')}
          </span>
          <span className="text-[8.5px] uppercase tracking-[0.14em] mt-0.5 opacity-75">
            min
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span
              className="text-[10.5px] font-medium uppercase tracking-[0.14em]"
              style={{ color: category.accent }}
            >
              {category.name}
            </span>
          </div>
          <h3 className="font-serif text-[17px] text-forest-700 leading-tight truncate">
            {meditation.title}
          </h3>
          <p className="text-[12.5px] text-charcoal-700/65 leading-snug line-clamp-1 mt-0.5">
            {meditation.moment}
          </p>
        </div>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite()
        }}
        className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0
                    transition active:scale-95
                    ${isFavorite ? 'text-clay-600' : 'text-charcoal-700/35 hover:text-clay-600'}`}
        aria-label={isFavorite ? 'Remove from saved' : 'Save for later'}
        aria-pressed={isFavorite}
      >
        <HeartIcon className="h-4.5 w-4.5" filled={isFavorite} />
      </button>
    </div>
  )
}
