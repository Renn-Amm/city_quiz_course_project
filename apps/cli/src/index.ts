import { quiz } from "@platform/quiz/data"
import outline, { countKinds as kinds } from "@platform/quiz/outline"
import { recap, Session, show } from "@platform/quiz/play"
import { loadSavedGame, loadSettings } from "@platform/quiz/saved"

import { savedGame, savedSettings } from "./saved.ts"

const settings = loadSettings(savedSettings)

console.log(`Hello, ${settings.name}`)
console.log()

console.log("## Outline")
console.log()

for (const line of outline(quiz)) {
  console.log(line)
}

const counts = kinds(quiz)

console.log()
console.log(
  `Kinds: choice ${counts.choice}, scale ${counts.scale}, yesno ${counts.yesno}`,
)
console.log()

console.log("## Questions")
console.log()

const session = new Session(quiz.outcomes)
const { answers } = loadSavedGame(savedGame)

session.start()

for (const [index, question] of quiz.questions.entries()) {
  const answer = answers[index]

  const { outcome, points } = session.record(question, answer)

  console.log(show(question, settings))
  console.log(`Answer worth ${points} points for ${outcome}`)
  console.log()
}

session.finish()

console.log("## Recap")
console.log()

for (const [index, question] of quiz.questions.entries()) {
  console.log(recap(question, answers[index]))
}

console.log()
console.log("## Result")

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

console.log()

const brokenSaves = [
  () => loadSavedGame('{"answers":[{"kind":"scale","value":"five"}]}'),
  () => loadSettings('{"name":"Aung","hints":"sometimes"}'),
  () => loadSettings('{"name":"Aung"'),
]

for (const load of brokenSaves) {
  try {
    load()
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
    }
  }
}
