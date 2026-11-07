import {
  getProgress,
  getQuiz,
  getResult,
  sendAnswer,
  startSession,
} from "@platform/quiz/services"

import ask from "./ask/index.ts"
import show from "./show/index.ts"

async function play(app: HTMLElement, quizName: string): Promise<void> {
  try {
    const quiz = await getQuiz(quizName)
    const id = await startSession(quizName)

    for (const prompt of quiz.questions) {
      const { answered, total } = await getProgress(id)
      const submission = await ask(
        app,
        prompt,
        `Question ${answered + 1} of ${total}`,
      )

      await sendAnswer(id, submission)
    }

    show(app, await getResult(id), () => void play(app, quizName))
  } catch (error) {
    const message = document.createElement("p")
    message.className = "error"
    message.textContent = error instanceof Error ? error.message : String(error)

    const retry = document.createElement("button")
    retry.type = "button"
    retry.textContent = "Try again"
    retry.addEventListener("click", () => void play(app, quizName), {
      once: true,
    })

    app.replaceChildren(message, retry)
  }
}

const app = document.querySelector<HTMLElement>("#app")

if (!app) {
  throw new Error("The page has no #app element")
}

const quizName = new URLSearchParams(location.search).get("quiz") ?? "cities"

await play(app, quizName)
