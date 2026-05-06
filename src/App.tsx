import { useEffect, useMemo, useState } from 'react'
import { BottomTabBar, type TabId } from './components/BottomTabBar'
import { CategoryView } from './components/CategoryView'
import { MeditationPlayer } from './components/MeditationPlayer'
import { TopBar } from './components/TopBar'
import { BrowseScreen } from './components/screens/BrowseScreen'
import { HomeScreen } from './components/screens/HomeScreen'
import { MomentSelectScreen } from './components/screens/MomentSelectScreen'
import { RecentScreen } from './components/screens/RecentScreen'
import { SavedScreen } from './components/screens/SavedScreen'
import {
  getCategory,
  getMeditation,
  meditationsByCategory,
  type CategoryId,
  type Meditation,
} from './data/meditations'
import { useFavorites } from './hooks/useFavorites'
import { useRecentlyPlayed } from './hooks/useRecentlyPlayed'

type PushedScreen =
  | { kind: 'category'; id: CategoryId }
  | { kind: 'moments' }

export default function App() {
  const [tab, setTab] = useState<TabId>('home')
  const [pushed, setPushed] = useState<PushedScreen[]>([])
  const [openMeditationId, setOpenMeditationId] = useState<string | null>(null)
  const [screenKey, setScreenKey] = useState(0)

  const { favorites, isFavorite, toggleFavorite } = useFavorites()
  const { recent, markPlayed } = useRecentlyPlayed()

  // Lock body scroll when modal player is open
  useEffect(() => {
    document.body.style.overflow = openMeditationId ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [openMeditationId])

  const top = pushed.length > 0 ? pushed[pushed.length - 1] : null

  const switchTab = (next: TabId) => {
    if (next === tab && pushed.length > 0) {
      // Tap active tab while in sub-screen → pop back to root
      setPushed([])
      return
    }
    setPushed([])
    setTab(next)
    setScreenKey((k) => k + 1)
  }

  const pushCategory = (id: CategoryId) =>
    setPushed((s) => [...s, { kind: 'category', id }])
  const pushMoments = () => setPushed((s) => [...s, { kind: 'moments' }])
  const popPushed = () => setPushed((s) => s.slice(0, -1))
  const openMeditation = (id: string) => setOpenMeditationId(id)
  const closeMeditation = () => setOpenMeditationId(null)

  const savedMeditations = useMemo(
    () => favorites.map(getMeditation).filter((m): m is Meditation => Boolean(m)),
    [favorites]
  )
  const recentMeditations = useMemo(
    () => recent.map(getMeditation).filter((m): m is Meditation => Boolean(m)),
    [recent]
  )

  const openMed = openMeditationId ? getMeditation(openMeditationId) : null
  const showBack = pushed.length > 0
  const headerTitle =
    top?.kind === 'category' ? getCategory(top.id).name : undefined

  const hasTopBar = showBack || Boolean(headerTitle)

  const pushedKey = pushed
    .map((p) => (p.kind === 'category' ? `c:${p.id}` : 'm'))
    .join('>')

  return (
    <div className="phone-frame">
      {hasTopBar ? (
        <TopBar
          onBack={showBack ? popPushed : undefined}
          title={headerTitle}
        />
      ) : (
        <div
          aria-hidden
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        />
      )}

      <div className="screen relative">
        {top ? (
          <div key={`pushed-${pushedKey}`} className="anim-push">
            {top.kind === 'category' && (
              <CategoryView
                category={getCategory(top.id)}
                meditations={meditationsByCategory(top.id)}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                onSelect={openMeditation}
              />
            )}
            {top.kind === 'moments' && (
              <MomentSelectScreen onSelectCategory={pushCategory} />
            )}
          </div>
        ) : (
          <div key={`tab-${tab}-${screenKey}`}>
            {tab === 'home' && (
              <HomeScreen
                onSelectMeditation={openMeditation}
                onOpenMoments={pushMoments}
              />
            )}
            {tab === 'browse' && (
              <BrowseScreen
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                onSelect={openMeditation}
              />
            )}
            {tab === 'saved' && (
              <SavedScreen
                meditations={savedMeditations}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                onSelect={openMeditation}
                onBrowse={() => switchTab('browse')}
              />
            )}
            {tab === 'recent' && (
              <RecentScreen
                meditations={recentMeditations}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                onSelect={openMeditation}
                onBrowse={() => switchTab('browse')}
              />
            )}
          </div>
        )}
      </div>

      <BottomTabBar active={tab} onChange={switchTab} />

      {openMed && (
        <MeditationPlayer
          meditation={openMed}
          isFavorite={isFavorite(openMed.id)}
          onToggleFavorite={() => toggleFavorite(openMed.id)}
          onClose={closeMeditation}
          onPlay={() => markPlayed(openMed.id)}
        />
      )}
    </div>
  )
}
