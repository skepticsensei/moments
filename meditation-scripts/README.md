# Moments — Meditation Scripts

Source scripts for every guided meditation in the app, ready to record.

## How to use these scripts

1. **One script per meditation.** File names match the meditation IDs in `src/data/meditations.ts`. When you record audio, save the file to `public/audio/{filename}.mp3` so the player picks it up automatically.
2. **Read pauses literally.** Anything in brackets like `[pause 8s]` means stay silent for that many seconds. These are part of the meditation — they're not stage directions to speak.
3. **Pad the front and back of every recording with ~5 seconds of silence.** The music starts a moment before your voice and lingers a moment after — silence padding makes that feel natural.
4. **Speak slowly and softly.** The brand voice is calm, grounded, warm, and human. Not breathy, not theatrical, not wellness-influencer-bright. Imagine speaking to one person sitting next to you with their eyes closed.
5. **Don't rush the in-and-out breath cues.** When the script says "In…" then "…and out", let your own breath be the timing reference — listeners will follow.

## Pacing reference

| Meditation length | Target voice length | Approx. spoken words |
|-------------------|---------------------|----------------------|
| 1 min             | ~50 sec             | ~50–60               |
| 2 min             | ~105 sec            | ~90–110              |
| 3 min             | ~160 sec            | ~150–180             |
| 4 min             | ~215 sec            | ~190–230             |
| 5 min             | ~270 sec            | ~250–300             |
| 6 min             | ~325 sec            | ~290–360             |
| 7 min             | ~380 sec            | ~340–410             |
| 8 min             | ~430 sec            | ~390–460             |

The goal is for the voice to fill most of the meditation duration with realistic pauses, leaving the last ~10–15% for music alone before the gentle fade-out.

## Tone reminders

- Warm, grounded, clear.
- Body-aware over spiritual-sounding.
- Practical nervous-system language ("soften the jaw", "feel your feet", "long breath out") over abstract imagery.
- Avoid: "namaste", "vibrations", "chakras", over-effusive language, anything that feels performative.
- Use silence as part of the practice, not as filler.

## File index

**Begin** — `before-the-day-begins`, `before-checking-your-phone`, `before-work`, `before-training`  
**Reset** — `between-meetings`, `after-a-difficult-moment`, `before-responding`, `when-you-feel-overwhelmed`  
**Return** — `feel-your-feet`, `three-breaths-to-center`, `grounding-through-posture`, `waiting-without-worrying`  
**Transition** — `after-work-before-home`, `before-a-conversation`, `leaving-one-thing-behind`, `crossing-the-threshold`  
**Practice** — `before-stepping-onto-the-mat`, `after-training`, `standing-stillness`, `yi-jin-jing-inspired-reset`  
**Rest** — `letting-the-day-go`, `before-sleep`, `releasing-the-shoulders`, `gratitude-before-rest`
