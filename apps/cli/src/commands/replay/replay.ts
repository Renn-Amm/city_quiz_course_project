import outline, { countKinds as kinds } from "@platform/quiz/outline"
import { recap, show } from "@platform/quiz/play"
import { readSavedGame, readSettings } from "@platform/quiz/saved"
import {
  getQuiz,
  getResult,
  sendAnswer,
  startSession,
} from "@platform/quiz/services"

import { printResult } from "../../lib/result.ts"
import { locateSavedGame, locateSettings } from "../../lib/saved.ts"

export default async function replay(quizName: string): Promise<void> {
  const quiz = await getQuiz(quizName)
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

  const id = await startSession(quizName)

  console.log("## Questions")
  console.log()

  for (const [index, prompt] of quiz.questions.entries()) {
    await sendAnswer(id, answers[index])

    console.log(show(prompt, settings))
    console.log()
  }

  console.log("## Recap")
  console.log()

  for (const [index, prompt] of quiz.questions.entries()) {
    console.log(recap(prompt, answers[index]))
  }

  console.log()
  console.log("## Result")
  console.log()

  printResult(await getResult(id))
}
