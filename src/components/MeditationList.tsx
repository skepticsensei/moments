import type { Meditation } from '../data/meditations'
import { MeditationRow } from './MeditationRow'

interface MeditationListProps {
  meditations: Meditation[]
  isFavorite: (id: string) => boolean
  onToggleFavorite: (id: string) => void
  onSelect: (id: string) => void
  emptyMessage?: string
}

export function MeditationList({
  meditations,
  isFavorite,
  onToggleFavorite,
  onSelect,
  emptyMessage,
}: MeditationListProps) {
  if (meditations.length === 0) {
    return (
      <p className="text-sm text-charcoal-700/60 italic px-1">
        {emptyMessage ?? 'Nothing here yet.'}
      </p>
    )
  }

  return (
    <ul className="space-y-2.5">
      {meditations.map((m) => (
        <li key={m.id}>
          <MeditationRow
            meditation={m}
            isFavorite={isFavorite(m.id)}
            onToggleFavorite={() => onToggleFavorite(m.id)}
            onSelect={() => onSelect(m.id)}
          />
        </li>
      ))}
    </ul>
  )
}
