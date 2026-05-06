import type { Category } from '../data/meditations'

interface CategoryCardProps {
  category: Category
  count: number
  onSelect: () => void
}

export function CategoryCard({ category, count, onSelect }: CategoryCardProps) {
  return (
    <button
      onClick={onSelect}
      className="group surface text-left p-4 transition duration-200 ease-out
                 active:scale-[0.985] active:bg-cream-100"
      aria-label={`${category.name} — ${count} meditations`}
      style={{
        background: `linear-gradient(135deg, ${category.accent}10 0%, transparent 100%), #FBF7F0E6`,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${category.accent}1F` }}
          aria-hidden
        >
          <span
            className="block h-2 w-2 rounded-full"
            style={{ backgroundColor: category.accent }}
          />
        </div>
        <span className="text-[10.5px] uppercase tracking-[0.16em] text-charcoal-700/45 pt-1.5">
          {count}
        </span>
      </div>

      <h3 className="font-serif text-xl mt-3 text-forest-700 leading-tight">
        {category.name}
      </h3>
      <p className="mt-1 text-[12.5px] text-charcoal-700/70 leading-snug line-clamp-2">
        {category.description}
      </p>
    </button>
  )
}
