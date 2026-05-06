import { FEATURED_QUICK_RESET_ID, getMeditation } from '../../data/meditations'
import { HeroSection } from '../HeroSection'
import { ChevronRightIcon, HeartIcon } from '../icons'
import { QuickResetCard } from '../QuickResetCard'

interface HomeScreenProps {
  onSelectMeditation: (id: string) => void
  onOpenMoments: () => void
}

export function HomeScreen({ onSelectMeditation, onOpenMoments }: HomeScreenProps) {
  const featured = getMeditation(FEATURED_QUICK_RESET_ID)

  return (
    <div className="screen-padding anim-fade flex flex-col min-h-full justify-between gap-10">
      <HeroSection />

      <section>
        {featured && (
          <>
            <p className="label-tiny mb-3">Quick Reset</p>
            <QuickResetCard
              meditation={featured}
              onStart={() => onSelectMeditation(featured.id)}
            />
          </>
        )}
        <button
          onClick={onOpenMoments}
          className="btn-primary w-full mt-8 relative"
        >
          <span>What moment are you in?</span>
          <ChevronRightIcon
            className="h-4 w-4 absolute right-5 top-1/2 -translate-y-1/2 opacity-80"
            aria-hidden
          />
        </button>
      </section>

      <p className="max-w-[44ch] mx-auto text-center text-[12.5px] text-charcoal-700/65 leading-loose">
        You won't always have time for a full practice.
        <br />
        After one moment, before the next,
        <br />
        there is always room for a breath.
      </p>

      <a
        href="https://buymeacoffee.com/momentsmeditation"
        target="_blank"
        rel="noopener noreferrer"
        className="self-center inline-flex items-center gap-1.5 text-[12px] text-sage-500
                   hover:text-forest-700 transition active:scale-[0.97]"
      >
        <HeartIcon className="h-3.5 w-3.5" />
        <span>Support Moments</span>
      </a>
    </div>
  )
}
