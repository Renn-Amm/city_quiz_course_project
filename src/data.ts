import { type Outcome, type Question } from "./types.ts"

export const outcome: Outcome = {
  title: "Barcelona",
  country: "Spain",
  vibe: "beach",
  description:
    "Beach, sun and late dinners. You like a relaxed city by the sea.",
}

export const questions: Question[] = [
  {
    kind: "choice",
    text: "It's Saturday morning. What are you doing?",
    choices: [
      { label: "Getting a croissant at a cafe", points: 1 },
      { label: "Hiking outside the city", points: 2 },
      { label: "Walking around a night market", points: 3 },
      { label: "Reading on the beach", points: 4 },
    ],
  },
  {
    kind: "scale",
    text: "How much do you like crowds and noise?",
    low: "keep me away",
    high: "the more the better",
  },
  {
    kind: "yesno",
    text: "Would you trade sunshine for the northern lights?",
  },
]
