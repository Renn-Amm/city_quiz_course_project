import outline, { countKinds as kinds } from "@platform/quiz/outline"
import { recap, Session, show } from "@platform/quiz/play"
import { loadQuiz } from "@platform/quiz/quizzes"
import { readSavedGame, readSettings } from "@platform/quiz/saved"

import { locateSavedGame, locateSettings } from "../../lib/saved.ts"

export default async function replay(quizName: string): Promise<void> {
  const quiz = await loadQuiz(quizName)
  const settings = await readSettings(locateSettings())
  const { answers } = await readSavedGame(locateSavedGame())

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
}
