import { FEATURED_QUICK_RESET_ID, getMeditation } from '../../data/meditations'
import { HeroSection } from '../HeroSection'
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
          className="btn-primary w-full mt-8"
        >
          What moment are you in?
        </button>
      </section>

      <div className="max-w-[34ch] mx-auto text-center">
        <p className="text-[13.5px] text-charcoal-700/65 leading-loose">
          You won't always have time for a full practice.
          <br />
          After one moment, before the next,
          <br />
          there is always room for a breath.
        </p>
        <p className="mt-4 font-serif italic text-[13.5px] text-forest-700/70 leading-relaxed">
          Brief meditations for the small spaces of the day.
        </p>
      </div>
    </div>
  )
}
