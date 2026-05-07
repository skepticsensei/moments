export type CategoryId =
  | 'begin'
  | 'reset'
  | 'return'
  | 'transition'
  | 'practice'
  | 'rest'

export interface Category {
  id: CategoryId
  name: string
  description: string
  longDescription: string
  accent: string
}

export interface Meditation {
  id: string
  title: string
  category: CategoryId
  duration: string
  durationSeconds: number
  description: string
  moment: string
  audioSrc?: string
  transcript?: string
  reflection?: string
}

export const CATEGORIES: Category[] = [
  {
    id: 'begin',
    name: 'Begin',
    description: 'For the space between waking and the day.',
    longDescription:
      'Meditations for the first quiet edges of the morning, before the day takes you with it.',
    accent: '#7A8B6F',
  },
  {
    id: 'reset',
    name: 'Reset',
    description: 'For the space between stress and response.',
    longDescription:
      'Short pauses to soften the body and create space before you react.',
    accent: '#A6826A',
  },
  {
    id: 'return',
    name: 'Return',
    description: 'For coming back to your body, breath, and center.',
    longDescription:
      'Brief returns to the breath, the feet, the ground beneath you.',
    accent: '#3F5C49',
  },
  {
    id: 'transition',
    name: 'Transition',
    description: 'For moving from one role or place into another.',
    longDescription:
      'For the thresholds between work and home, conversation and silence.',
    accent: '#8B6A53',
  },
  {
    id: 'practice',
    name: 'Practice',
    description: 'For meditation rooted in movement and the body.',
    longDescription:
      'Standing stillness, breath before training, awareness through the body.',
    accent: '#2F4738',
  },
  {
    id: 'rest',
    name: 'Rest',
    description: 'For the space between the day and sleep.',
    longDescription:
      'Soft endings, for letting the day go and entering rest gently.',
    accent: '#A68B5B',
  },
]

export const MEDITATIONS: Meditation[] = [
  // ---------- Begin ----------
  {
    id: 'before-the-day-begins',
    title: 'Before the Day Begins',
    category: 'begin',
    duration: '5 min',
    durationSeconds: 300,
    description:
      'A short grounding meditation for the space between waking and beginning.',
    moment: 'Before stepping into the day',
    transcript:
      'Before you reach for anything, return to yourself. Feel the weight of your body. Take one slow breath, then another. The day has not begun yet. You have. Set a small intention. Carry it gently into what comes next.',
    reflection: 'What are you carrying forward into today?',
  },
  {
    id: 'before-checking-your-phone',
    title: 'Before Checking Your Phone',
    category: 'begin',
    duration: '2 min',
    durationSeconds: 120,
    description:
      'A small pause before the day rushes in through a screen.',
    moment: 'Before reaching for the phone',
    transcript:
      'Before the noise begins, take one full breath here. Your attention is yours first. Let this minute belong to you. When you pick up the phone, do it on purpose.',
  },
  {
    id: 'before-work',
    title: 'Before Work',
    category: 'begin',
    duration: '4 min',
    durationSeconds: 240,
    description:
      'Settle into focus before the first task pulls you in.',
    moment: 'Before opening the laptop',
    transcript:
      'Sit with both feet on the floor. Soften the jaw. Lower the shoulders. Let your breath find its own slow rhythm. What is the one thing that matters most today?',
  },
  {
    id: 'before-training',
    title: 'Before Training',
    category: 'begin',
    duration: '3 min',
    durationSeconds: 180,
    description:
      'A short arrival before practice, training, or movement.',
    moment: 'Before the session begins',
  },

  // ---------- Reset ----------
  {
    id: 'between-meetings',
    title: 'Between Meetings',
    category: 'reset',
    duration: '2 min',
    durationSeconds: 120,
    description:
      'A quick reset between calls, conversations, or shifts in focus.',
    moment: 'In the gap between two meetings',
    transcript:
      'Close the last conversation gently. Stand if you can. One breath in, one long breath out. Soften the face. The next meeting has not started yet. You are here.',
  },
  {
    id: 'after-a-difficult-moment',
    title: 'After a Difficult Moment',
    category: 'reset',
    duration: '4 min',
    durationSeconds: 240,
    description:
      'When something hard has just happened and you need to settle.',
    moment: 'Right after something difficult',
    reflection: 'What part of you needs care right now?',
  },
  {
    id: 'before-responding',
    title: 'Before Responding',
    category: 'reset',
    duration: '3 min',
    durationSeconds: 180,
    description:
      'Three breaths to find ground before you reply.',
    moment: 'Before sending the message or speaking',
    transcript:
      'Pause before you answer. Feel your feet. Let the first breath soften the body. Let the second breath create space. Let the third breath remind you that you can respond without being pulled away from yourself.',
  },
  {
    id: 'when-you-feel-overwhelmed',
    title: 'When You Feel Overwhelmed',
    category: 'reset',
    duration: '5 min',
    durationSeconds: 300,
    description:
      'A gentle return when everything feels like too much.',
    moment: 'When the day has become too full',
  },

  // ---------- Return ----------
  {
    id: 'feel-your-feet',
    title: 'Feel Your Feet',
    category: 'return',
    duration: '2 min',
    durationSeconds: 120,
    description:
      'A short grounding through the soles of the feet.',
    moment: 'Whenever you feel scattered',
    transcript:
      'Bring your attention to the soles of your feet. Feel the floor meeting you. Notice weight, contact, warmth. You do not need to go anywhere. You are already here.',
  },
  {
    id: 'three-breaths-to-center',
    title: 'Three Breaths to Center',
    category: 'return',
    duration: '1 min',
    durationSeconds: 60,
    description:
      'The shortest possible return. Just three breaths.',
    moment: 'Anywhere, anytime',
    transcript:
      'One breath to arrive. One breath to soften. One breath to begin again.',
    audioSrc: '/audio/three-breaths-to-center.mp3',
  },
  {
    id: 'grounding-through-posture',
    title: 'Grounding Through Posture',
    category: 'return',
    duration: '4 min',
    durationSeconds: 240,
    description:
      'Find your seat, your spine, and your breath.',
    moment: 'When you need to come back to yourself',
  },
  {
    id: 'waiting-without-worrying',
    title: 'Waiting Without Worrying',
    category: 'return',
    duration: '3 min',
    durationSeconds: 180,
    description:
      'For the in-between moments of waiting: a line, a queue, a pause.',
    moment: 'While waiting',
  },

  // ---------- Transition ----------
  {
    id: 'after-work-before-home',
    title: 'After Work, Before Home',
    category: 'transition',
    duration: '5 min',
    durationSeconds: 300,
    description:
      'Leave work where it belongs before you walk through the door.',
    moment: 'On the way home',
    transcript:
      'You are between roles now. Let work remain where it belongs. Feel your hands, your shoulders, your breath. Before you enter the next space, return to yourself.',
    reflection: 'What can you leave behind before you walk in?',
  },
  {
    id: 'before-a-conversation',
    title: 'Before a Conversation',
    category: 'transition',
    duration: '3 min',
    durationSeconds: 180,
    description:
      'Arrive present before someone arrives in front of you.',
    moment: 'Before a conversation that matters',
  },
  {
    id: 'leaving-one-thing-behind',
    title: 'Leaving One Thing Behind',
    category: 'transition',
    duration: '4 min',
    durationSeconds: 240,
    description:
      'Set down something you have been carrying so the next moment can be clear.',
    moment: 'Between one task and the next',
    reflection: 'What are you ready to set down?',
  },
  {
    id: 'crossing-the-threshold',
    title: 'Crossing the Threshold',
    category: 'transition',
    duration: '3 min',
    durationSeconds: 180,
    description:
      'A small ritual for moving from one space into another.',
    moment: 'At a doorway, real or symbolic',
  },

  // ---------- Practice ----------
  {
    id: 'before-stepping-onto-the-mat',
    title: 'Before Stepping Onto the Mat',
    category: 'practice',
    duration: '3 min',
    durationSeconds: 180,
    description:
      'A grounded arrival before training, yoga, or practice.',
    moment: 'Before practice begins',
    transcript:
      'Stand tall without becoming rigid. Let your breath settle into your center. Step onto the mat with respect, attention, and a willingness to learn.',
  },
  {
    id: 'after-training',
    title: 'After Training',
    category: 'practice',
    duration: '5 min',
    durationSeconds: 300,
    description:
      'Slow down the body and let the breath catch up.',
    moment: 'After a workout or training session',
    reflection: 'What did the body teach you today?',
  },
  {
    id: 'standing-stillness',
    title: 'Standing Stillness',
    category: 'practice',
    duration: '6 min',
    durationSeconds: 360,
    description:
      'Quiet standing meditation. Rooted, soft, awake.',
    moment: 'When you have a few minutes to stand',
  },
  {
    id: 'yi-jin-jing-inspired-reset',
    title: 'Yi Jin Jing-Inspired Reset',
    category: 'practice',
    duration: '7 min',
    durationSeconds: 420,
    description:
      'A short reset inspired by classical tendon-changing principles: breath, posture, intention.',
    moment: 'Mid-day, when the body feels stiff',
  },

  // ---------- Rest ----------
  {
    id: 'letting-the-day-go',
    title: 'Letting the Day Go',
    category: 'rest',
    duration: '6 min',
    durationSeconds: 360,
    description:
      'A soft release of everything the day asked of you.',
    moment: 'In the evening',
    reflection: 'What was today, in one quiet sentence?',
  },
  {
    id: 'before-sleep',
    title: 'Before Sleep',
    category: 'rest',
    duration: '8 min',
    durationSeconds: 480,
    description:
      'Slow breath and body softening to ease into sleep.',
    moment: 'In bed, before closing your eyes',
  },
  {
    id: 'releasing-the-shoulders',
    title: 'Releasing the Shoulders',
    category: 'rest',
    duration: '4 min',
    durationSeconds: 240,
    description:
      'Let go of the day held in the upper back, neck, and jaw.',
    moment: 'After a long day',
  },
  {
    id: 'gratitude-before-rest',
    title: 'Gratitude Before Rest',
    category: 'rest',
    duration: '3 min',
    durationSeconds: 180,
    description:
      'A short, honest gratitude practice, without performance.',
    moment: 'Before sleep',
    reflection: 'Name one small thing that held you today.',
  },
]

export const FEATURED_QUICK_RESET_ID = 'three-breaths-to-center'

export function getCategory(id: CategoryId): Category {
  return CATEGORIES.find((c) => c.id === id)!
}

export function getMeditation(id: string): Meditation | undefined {
  return MEDITATIONS.find((m) => m.id === id)
}

export function sortByDuration(list: Meditation[]): Meditation[] {
  return [...list].sort((a, b) => a.durationSeconds - b.durationSeconds)
}

export function meditationsByCategory(id: CategoryId): Meditation[] {
  return sortByDuration(MEDITATIONS.filter((m) => m.category === id))
}
