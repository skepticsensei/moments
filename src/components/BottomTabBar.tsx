import { ClockIcon, GridIcon, HeartIcon, HomeIcon } from './icons'

export type TabId = 'home' | 'browse' | 'saved' | 'recent'

interface BottomTabBarProps {
  active: TabId
  onChange: (tab: TabId) => void
}

const TABS: Array<{
  id: TabId
  label: string
  Icon: (props: { filled?: boolean; className?: string }) => React.ReactElement
}> = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'browse', label: 'Browse', Icon: GridIcon },
  { id: 'saved', label: 'Saved', Icon: HeartIcon },
  { id: 'recent', label: 'Recent', Icon: ClockIcon },
]

export function BottomTabBar({ active, onChange }: BottomTabBarProps) {
  return (
    <nav className="tab-bar" role="tablist" aria-label="Primary navigation">
      {TABS.map(({ id, label, Icon }) => {
        const selected = active === id
        return (
          <button
            key={id}
            role="tab"
            aria-selected={selected}
            aria-label={label}
            onClick={() => onChange(id)}
            className="tab-button"
          >
            <Icon
              className={`h-5.5 w-5.5 ${selected ? '' : ''}`}
              filled={selected}
            />
            <span className={`text-[11px] font-medium tracking-wide ${selected ? 'text-forest-700' : 'text-charcoal-700/55'}`}>
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
