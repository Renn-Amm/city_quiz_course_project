import outline, { countKinds as kinds } from "@platform/quiz/outline"
import {
  isProgressResponse,
  isQuizResponse,
  isResultResponse,
  isStartedResponse,
  recap,
  type Submission,
} from "@platform/quiz/play"
import { readSettings } from "@platform/quiz/saved"

import { call, readBody } from "../../lib/api.ts"
import { printResult } from "../../lib/result.ts"
import { locateSettings } from "../../lib/saved.ts"
import { ask } from "./ask.ts"

interface Options {
  name?: string
}

export default async function play(
  quizName: string,
  options: Options,
): Promise<void> {
  const quizResponse = await call(`/quizzes/${quizName}`)
  const quiz = await readBody(quizResponse)
  if (!isQuizResponse(quiz)) {
    throw new Error("The server sent a quiz in the wrong shape")
  }

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

  const startResponse = await call("/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ quiz: quizName }),
  })
  const started = await readBody(startResponse)
  if (!isStartedResponse(started)) {
    throw new Error("The server did not send a session id")
  }

  const id = started.session_id
  const submissions: Submission[] = []

  console.log("## Questions")
  console.log()

  for (const prompt of quiz.questions) {
    const progressResponse = await call("/session", {
      headers: { "x-session-id": id },
    })
    const progress = await readBody(progressResponse)
    if (!isProgressResponse(progress)) {
      throw new Error("The server sent progress in the wrong shape")
    }

    console.log(`Question ${progress.answered + 1} of ${progress.total}`)

    const submission = await ask(settings, prompt)

    await call("/session/answer", {
      method: "POST",
      headers: { "content-type": "application/json", "x-session-id": id },
      body: JSON.stringify(submission),
    })

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

  const resultResponse = await call("/session/result", {
    headers: { "x-session-id": id },
  })
  const result = await readBody(resultResponse)
  if (!isResultResponse(result)) {
    throw new Error("The server sent a result in the wrong shape")
  }

  printResult(result)
}
