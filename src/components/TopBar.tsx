import { ArrowLeftIcon } from './icons'

interface TopBarProps {
  title?: string
  onBack?: () => void
  rightSlot?: React.ReactNode
}

export function TopBar({ title, onBack, rightSlot }: TopBarProps) {
  return (
    <header className="top-bar">
      <div className="flex items-center gap-2 min-w-0">
        {onBack && (
          <button
            onClick={onBack}
            className="-ml-2 h-10 w-10 rounded-full flex items-center justify-center
                       text-forest-700 hover:bg-cream-200/70 active:scale-95 transition"
            aria-label="Back"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {title && (
        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-base text-forest-700 truncate max-w-[55%] text-center"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          {title}
        </h1>
      )}

      <div className="flex items-center gap-1">{rightSlot}</div>
    </header>
  )
}
