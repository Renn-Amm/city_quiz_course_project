import { outcomes, questions } from "./data.ts"
import { recap, show } from "./quiz.ts"
import { Session } from "./session.ts"
import { type Answer } from "./types.ts"

const answers: Answer[] = [
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

const session = new Session(outcomes)

session.start()

for (const index in questions) {
  const question = questions[index]
  const answer = answers[index]

  const { outcome, points } = session.record(question, answer)

  console.log(show(question))
  console.log(`Answer worth ${points} points for ${outcome}`)
  console.log()
}

session.finish()

for (const index in questions) {
  console.log(recap(questions[index], answers[index]))
}

const result = session.result()

const place = result.country
  ? `${result.title}, ${result.country}`
  : result.title

console.log()
console.log(`You are: ${place} (${result.vibe})`)
console.log(result.description)
console.log()
console.log("You got this because:")

for (const reason of session.explain()) {
  console.log(`- ${reason}`)
}
