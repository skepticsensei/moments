import { useMemo } from 'react'
import { CATEGORIES, MEDITATIONS, type CategoryId } from '../../data/meditations'
import { CategoryCard } from '../CategoryCard'

interface MomentSelectScreenProps {
  onSelectCategory: (id: CategoryId) => void
}

export function MomentSelectScreen({ onSelectCategory }: MomentSelectScreenProps) {
  const counts = useMemo(() => {
    const map: Record<CategoryId, number> = {
      begin: 0, reset: 0, return: 0, transition: 0, practice: 0, rest: 0,
    }
    for (const m of MEDITATIONS) map[m.category]++
    return map
  }, [])

  return (
    <div className="screen-padding anim-fade">
      <header className="mb-5">
        <h2 className="font-serif text-3xl text-forest-700 leading-tight">
          What moment are you in?
        </h2>
        <p className="mt-2 text-[13px] text-charcoal-700/70 leading-relaxed">
          The in-between moments are not empty. They are where we return to ourselves.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((c) => (
          <CategoryCard
            key={c.id}
            category={c}
            count={counts[c.id]}
            onSelect={() => onSelectCategory(c.id)}
          />
        ))}
      </div>
    </div>
  )
}
