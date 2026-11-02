import path from "node:path"

import outline, { countKinds as kinds } from "@platform/quiz/outline"
import {
  type Quiz,
  recap,
  Session,
  type Settings,
  show,
} from "@platform/quiz/play"
import { loadQuiz } from "@platform/quiz/quizzes"
import {
  readSavedGame,
  readSettings,
  type SavedGame,
} from "@platform/quiz/saved"

const saved = path.join(import.meta.dirname, "..", "saved")

let quiz: Quiz
let settings: Settings
let game: SavedGame

try {
  quiz = await loadQuiz("cities")
  settings = await readSettings(path.join(saved, "settings.json"))
  game = await readSavedGame(path.join(saved, "game.json"))
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}

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
const { answers } = game

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
