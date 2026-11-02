import outline, { countKinds as kinds } from "@platform/quiz/outline"
import { type Answer, recap, Session } from "@platform/quiz/play"
import { loadQuiz } from "@platform/quiz/quizzes"
import { readSettings } from "@platform/quiz/saved"

import { locateSettings } from "../../lib/saved.ts"
import { ask } from "./ask.ts"

interface Options {
  name?: string
}

export default async function play(
  quizName: string,
  options: Options,
): Promise<void> {
  const quiz = await loadQuiz(quizName)
  const settings = await readSettings(locateSettings())

  console.log(`Hello, ${options.name ?? settings.name}`)
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
  const answers: Answer[] = []

  session.start()

  for (const question of quiz.questions) {
    const answer = await ask(settings, question)
    const { outcome, points } = session.record(question, answer)

    answers.push(answer)

    console.log(`Your answer worth ${points} points for ${outcome}`)
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
