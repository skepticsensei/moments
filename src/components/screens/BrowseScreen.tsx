import { useMemo, useState } from 'react'
import {
  CATEGORIES,
  MEDITATIONS,
  getCategory,
  sortByDuration,
  type CategoryId,
} from '../../data/meditations'
import { MeditationList } from '../MeditationList'
import { SearchBar } from '../SearchBar'

interface BrowseScreenProps {
  isFavorite: (id: string) => boolean
  onToggleFavorite: (id: string) => void
  onSelect: (id: string) => void
}

type Filter = 'all' | CategoryId

export function BrowseScreen({ isFavorite, onToggleFavorite, onSelect }: BrowseScreenProps) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const meditations = useMemo(() => {
    const q = search.trim().toLowerCase()
    const filtered = MEDITATIONS.filter((m) => {
      if (filter !== 'all' && m.category !== filter) return false
      if (!q) return true
      const cat = getCategory(m.category).name.toLowerCase()
      return (
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.moment.toLowerCase().includes(q) ||
        cat.includes(q)
      )
    })
    return sortByDuration(filtered)
  }, [search, filter])

  return (
    <div className="screen-padding anim-fade">
      <h2 className="font-serif text-2xl text-forest-700">Browse</h2>
      <p className="mt-1 text-[13px] text-charcoal-700/65">
        Find the moment you need.
      </p>

      <div className="mt-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search moments..." />
      </div>

      <div className="mt-4 -mx-5 px-5 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 pb-1">
          <FilterChip
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All
          </FilterChip>
          {CATEGORIES.map((c) => (
            <FilterChip
              key={c.id}
              accent={c.accent}
              active={filter === c.id}
              onClick={() => setFilter(c.id)}
            >
              {c.name}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <MeditationList
          meditations={meditations}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          onSelect={onSelect}
          emptyMessage="No moments match. Try a different word."
        />
      </div>
    </div>
  )
}

function FilterChip({
  active,
  accent,
  onClick,
  children,
}: {
  active: boolean
  accent?: string
  onClick: () => void
  children: React.ReactNode
}) {
  const accentColor = accent ?? '#3F5C49'
  return (
    <button
      onClick={onClick}
      className="shrink-0 px-3.5 py-1.5 rounded-full text-[12.5px] font-medium
                 transition active:scale-95 border whitespace-nowrap"
      style={{
        backgroundColor: active ? accentColor : '#FBF7F0',
        color: active ? '#FBF7F0' : '#243528',
        borderColor: active ? accentColor : '#EDE4D2',
      }}
    >
      {children}
    </button>
  )
}
