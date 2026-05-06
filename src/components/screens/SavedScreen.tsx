import type { Meditation } from '../../data/meditations'
import { HeartIcon } from '../icons'
import { MeditationList } from '../MeditationList'

interface SavedScreenProps {
  meditations: Meditation[]
  isFavorite: (id: string) => boolean
  onToggleFavorite: (id: string) => void
  onSelect: (id: string) => void
  onBrowse: () => void
}

export function SavedScreen({
  meditations,
  isFavorite,
  onToggleFavorite,
  onSelect,
  onBrowse,
}: SavedScreenProps) {
  return (
    <div className="screen-padding anim-fade">
      <h2 className="font-serif text-2xl text-forest-700">Saved Moments</h2>
      <p className="mt-1 text-[13px] text-charcoal-700/65">
        Your collection — return to them when you need to.
      </p>

      {meditations.length === 0 ? (
        <EmptyState onBrowse={onBrowse} />
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

function EmptyState({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="mt-12 surface p-8 text-center">
      <div className="mx-auto h-12 w-12 rounded-full bg-cream-200 flex items-center justify-center text-clay-600">
        <HeartIcon className="h-5 w-5" />
      </div>
      <p className="mt-4 font-serif text-lg text-forest-700">Nothing saved yet</p>
      <p className="mt-1 text-[13px] text-charcoal-700/65 max-w-[28ch] mx-auto">
        Tap the heart on any moment to keep it close.
      </p>
      <button onClick={onBrowse} className="btn-outline text-sm mt-5">
        Browse moments
      </button>
    </div>
  )
}
