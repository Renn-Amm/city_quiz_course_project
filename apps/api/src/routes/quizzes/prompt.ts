import { type Prompt, type Question } from "@platform/quiz/play"

export function toPrompt(question: Question): Prompt {
  if (question.kind === "choice") {
    return {
      kind: "choice",
      text: question.text,
      hint: question.hint,
      choices: question.choices.map(({ label }) => ({ label })),
    }
  }

  if (question.kind === "scale") {
    return {
      kind: "scale",
      text: question.text,
      hint: question.hint,
      low: question.low,
      high: question.high,
    }
  }

  if (question.kind === "yesno") {
    return {
      kind: "yesno",
      text: question.text,
      hint: question.hint,
    }
  }

  throw new Error("Unknown kind")
}
