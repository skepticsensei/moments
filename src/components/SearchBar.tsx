import { SearchIcon } from './icons'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <label className="relative block w-full">
      <span className="sr-only">Search meditations</span>
      <SearchIcon
        className="h-4.5 w-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-700/40"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Search by title, category, or moment...'}
        className="w-full pl-11 pr-4 py-3 rounded-full bg-cream-50 border border-cream-200
                   text-[15px] text-charcoal-800 placeholder:text-charcoal-700/40
                   shadow-soft focus:border-forest-500/40 transition"
      />
    </label>
  )
}
