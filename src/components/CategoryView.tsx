import type { Category, Meditation } from '../data/meditations'
import { MeditationList } from './MeditationList'

interface CategoryViewProps {
  category: Category
  meditations: Meditation[]
  isFavorite: (id: string) => boolean
  onToggleFavorite: (id: string) => void
  onSelect: (id: string) => void
}

export function CategoryView({
  category,
  meditations,
  isFavorite,
  onToggleFavorite,
  onSelect,
}: CategoryViewProps) {
  return (
    <div className="screen-padding">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: category.accent }}
            aria-hidden
          />
          <span
            className="text-[11px] uppercase tracking-[0.18em] font-medium"
            style={{ color: category.accent }}
          >
            {category.name}
          </span>
        </div>
        <h1 className="font-serif text-3xl text-forest-700 mt-2 leading-tight">
          {category.name}
        </h1>
        <p className="mt-2 text-[13.5px] text-charcoal-700/75 leading-relaxed">
          {category.longDescription}
        </p>
      </div>

      <MeditationList
        meditations={meditations}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onSelect={onSelect}
      />
    </div>
  )
}
