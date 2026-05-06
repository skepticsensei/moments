import type { SVGProps } from 'react'

const baseProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M8 5.5v13L19 12 8 5.5z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function PauseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="6.5" y="5.5" width="4" height="13" rx="1" fill="currentColor" stroke="none" />
      <rect x="13.5" y="5.5" width="4" height="13" rx="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function HeartIcon({
  filled,
  ...props
}: SVGProps<SVGSVGElement> & { filled?: boolean }) {
  return (
    <svg {...baseProps} {...props}>
      <path
        d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"
        fill={filled ? 'currentColor' : 'none'}
      />
    </svg>
  )
}

export function ArrowLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  )
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  )
}

export function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export function LeafIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M5 19c0-7 6-13 14-13 0 8-6 14-13 14a8 8 0 0 1-1-1z" />
      <path d="M5 19c2.5-3 5-5 9-7" />
    </svg>
  )
}

export function HomeIcon({ filled, ...props }: SVGProps<SVGSVGElement> & { filled?: boolean }) {
  return (
    <svg {...baseProps} {...props}>
      <path
        d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"
        fill={filled ? 'currentColor' : 'none'}
        fillOpacity={filled ? 0.18 : 0}
      />
    </svg>
  )
}

export function GridIcon({ filled, ...props }: SVGProps<SVGSVGElement> & { filled?: boolean }) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" fill={filled ? 'currentColor' : 'none'} fillOpacity={filled ? 0.18 : 0} />
      <rect x="13" y="4" width="7" height="7" rx="1.5" fill={filled ? 'currentColor' : 'none'} fillOpacity={filled ? 0.18 : 0} />
      <rect x="4" y="13" width="7" height="7" rx="1.5" fill={filled ? 'currentColor' : 'none'} fillOpacity={filled ? 0.18 : 0} />
      <rect x="13" y="13" width="7" height="7" rx="1.5" fill={filled ? 'currentColor' : 'none'} fillOpacity={filled ? 0.18 : 0} />
    </svg>
  )
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

export function SpeakerIcon({
  muted,
  ...props
}: SVGProps<SVGSVGElement> & { muted?: boolean }) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M4 9h3l5-4v14l-5-4H4z" fill="currentColor" stroke="none" />
      {muted ? (
        <path d="M16 9l5 6m0-6l-5 6" />
      ) : (
        <>
          <path d="M16 8.5a4.5 4.5 0 0 1 0 7" />
          <path d="M19 6a8 8 0 0 1 0 12" />
        </>
      )}
    </svg>
  )
}

export function ShuffleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M3 7h3l4 5-4 5H3" />
      <path d="M14 7h4l3 0" />
      <path d="M14 17h4l3 0" />
      <path d="M18 4l3 3-3 3" />
      <path d="M18 14l3 3-3 3" />
      <path d="M14 7l3.5 4.5" />
    </svg>
  )
}
