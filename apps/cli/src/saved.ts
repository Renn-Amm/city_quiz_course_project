import { type Answer } from "@platform/quiz/play"

const initialAnswers: Answer[] = [
  {
    kind: "choice",
    picked: {
      label: "Reading on the beach",
      outcome: "barcelona",
      points: 4,
    },
  },
  { kind: "scale", value: 3 },
  { kind: "yesno", value: false },
  { kind: "yesno", value: true },
]

export const savedGame = JSON.stringify({
  answers: initialAnswers,
  startedAt: new Date(),
})

export const savedSettings = JSON.stringify({ name: "Aung", hints: true })
