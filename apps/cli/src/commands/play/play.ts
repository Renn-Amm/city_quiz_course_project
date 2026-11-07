import outline, { countKinds as kinds } from "@platform/quiz/outline"
import { recap, type Submission } from "@platform/quiz/play"
import { readSettings } from "@platform/quiz/saved"
import {
  getProgress,
  getQuiz,
  getResult,
  sendAnswer,
  startSession,
} from "@platform/quiz/services"

import { printResult } from "#lib/result"
import { locateSettings } from "#lib/saved"
import { ask } from "./ask.ts"

interface Options {
  name?: string
}

export default async function play(
  quizName: string,
  options: Options,
): Promise<void> {
  const quiz = await getQuiz(quizName)
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

  const id = await startSession(quizName)
  const submissions: Submission[] = []

  console.log("## Questions")
  console.log()

  for (const prompt of quiz.questions) {
    const { answered, total } = await getProgress(id)

    console.log(`Question ${answered + 1} of ${total}`)

    const submission = await ask(settings, prompt)

    await sendAnswer(id, submission)

    submissions.push(submission)

    console.log()
  }

  console.log("## Recap")
  console.log()

  for (const [index, prompt] of quiz.questions.entries()) {
    console.log(recap(prompt, submissions[index]))
  }

  console.log()
  console.log("## Result")
  console.log()

  printResult(await getResult(id))
}
