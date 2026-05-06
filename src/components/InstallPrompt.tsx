import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const STORAGE_KEY = 'moments:install-dismissed'

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isIosSafari(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const isIos =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  if (!isIos) return false
  // Reject in-app webviews where Add to Home Screen isn't possible.
  const isInAppBrowser = /CriOS|FxiOS|EdgiOS|GSA|FBAN|FBAV|Instagram|Twitter|Line/.test(ua)
  return !isInAppBrowser
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
         strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 3v13" />
      <path d="M8 7l4-4 4 4" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
    </svg>
  )
}

function PlusSquareIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
         strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  )
}

export function InstallPrompt() {
  const [mode, setMode] = useState<'hidden' | 'banner' | 'ios-howto'>('hidden')
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (isStandalone()) return
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') return
    } catch {}

    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      setMode('banner')
    }
    const onInstalled = () => {
      try { localStorage.setItem(STORAGE_KEY, '1') } catch {}
      setMode('hidden')
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)

    if (isIosSafari()) {
      setMode('banner')
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const dismiss = () => {
    setMode('hidden')
    try { localStorage.setItem(STORAGE_KEY, '1') } catch {}
  }

  const triggerInstall = async () => {
    if (deferred) {
      await deferred.prompt()
      const choice = await deferred.userChoice
      if (choice.outcome === 'accepted') {
        try { localStorage.setItem(STORAGE_KEY, '1') } catch {}
      }
      setDeferred(null)
      setMode('hidden')
    } else {
      setMode('ios-howto')
    }
  }

  if (mode === 'hidden') return null

  if (mode === 'ios-howto') {
    return (
      <div
        className="absolute inset-0 z-50 flex items-end justify-center bg-charcoal-800/30 backdrop-blur-[1px]"
        onClick={(e) => { if (e.target === e.currentTarget) setMode('banner') }}
      >
        <div
          role="dialog"
          aria-modal="true"
          className="surface-raised w-[calc(100%-24px)] max-w-[380px] p-5 mb-24 anim-modal"
          style={{ marginBottom: 'calc(env(safe-area-inset-bottom) + 88px)' }}
        >
          <p className="font-serif text-lg text-forest-700 leading-snug">
            Add Moments to your home screen
          </p>
          <p className="mt-1 text-[12.5px] text-charcoal-700/70">
            Three steps in Safari.
          </p>

          <ol className="mt-4 space-y-3 text-[13.5px] text-charcoal-700/85">
            <li className="flex items-start gap-3">
              <span className="shrink-0 mt-0.5 inline-flex h-6 w-6 items-center justify-center
                                rounded-full bg-cream-200 text-forest-700">
                <ShareIcon className="h-4 w-4" />
              </span>
              <span>Tap the <strong>Share</strong> button at the bottom of Safari.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="shrink-0 mt-0.5 inline-flex h-6 w-6 items-center justify-center
                                rounded-full bg-cream-200 text-forest-700">
                <PlusSquareIcon className="h-4 w-4" />
              </span>
              <span>Scroll down, then tap <strong>Add to Home Screen</strong>.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="shrink-0 mt-0.5 inline-flex h-6 w-6 items-center justify-center
                                rounded-full bg-forest-600 text-cream-50 text-[11px] font-medium">
                Add
              </span>
              <span>Tap <strong>Add</strong> in the top corner.</span>
            </li>
          </ol>

          <button
            onClick={dismiss}
            className="btn-outline text-sm mt-5 w-full"
          >
            Got it
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="absolute inset-x-3 z-30 anim-modal"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 72px)' }}
    >
      <div className="surface-raised flex items-center gap-3 p-3">
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-medium text-forest-700 leading-tight">
            Add Moments to your home screen
          </p>
          <p className="mt-0.5 text-[12px] text-charcoal-700/65 leading-snug">
            Open it like an app — full screen, no browser.
          </p>
        </div>
        <button
          onClick={triggerInstall}
          className="btn-primary text-[13px] px-4 py-2 shrink-0"
        >
          Install
        </button>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="text-charcoal-700/45 hover:text-charcoal-700 active:scale-95
                     h-7 w-7 -mr-1 flex items-center justify-center text-lg shrink-0"
        >
          ×
        </button>
      </div>
    </div>
  )
}
