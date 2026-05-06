import type { Meditation } from '../../data/meditations'
import { ClockIcon } from '../icons'
import { MeditationList } from '../MeditationList'

interface RecentScreenProps {
  meditations: Meditation[]
  isFavorite: (id: string) => boolean
  onToggleFavorite: (id: string) => void
  onSelect: (id: string) => void
  onBrowse: () => void
}

export function RecentScreen({
  meditations,
  isFavorite,
  onToggleFavorite,
  onSelect,
  onBrowse,
}: RecentScreenProps) {
  return (
    <div className="screen-padding anim-fade">
      <h2 className="font-serif text-2xl text-forest-700">Recently Played</h2>
      <p className="mt-1 text-[13px] text-charcoal-700/65">
        The moments you've returned to most recently.
      </p>

      {meditations.length === 0 ? (
        <div className="mt-12 surface p-8 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-cream-200 flex items-center justify-center text-sage-500">
            <ClockIcon className="h-5 w-5" />
          </div>
          <p className="mt-4 font-serif text-lg text-forest-700">No moments yet</p>
          <p className="mt-1 text-[13px] text-charcoal-700/65 max-w-[28ch] mx-auto">
            Once you begin a meditation it will appear here.
          </p>
          <button onClick={onBrowse} className="btn-outline text-sm mt-5">
            Find a moment
          </button>
        </div>
      ) : (
        <div className="mt-5">
          <MeditationList
            meditations={meditations}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
            onSelect={onSelect}
          />
        </div>
      )}
    </div>
  )
}
