import { outcome, questions } from "./data.ts"
import { award, recap, show } from "./quiz.ts"
import { type Answer } from "./types.ts"

const answers: Answer[] = [
  { kind: "choice", picked: { label: "Reading on the beach", points: 4 } },
  { kind: "scale", value: 3 },
  { kind: "yesno", value: false },
]

let total = 0

for (const index in questions) {
  const question = questions[index]
  const answer = answers[index]

  const points = award(answer)
  total += points

  console.log(show(question))
  console.log(`Answer worth ${points} points`)
  console.log()
}

console.log(`Total ${total}`)
console.log()

for (const index in questions) {
  console.log(recap(questions[index], answers[index]))
}

const place = outcome.country
  ? `${outcome.title}, ${outcome.country}`
  : outcome.title

const card = `=== ${place} (${outcome.vibe}) ===
${outcome.description}`

console.log()
console.log(card)
