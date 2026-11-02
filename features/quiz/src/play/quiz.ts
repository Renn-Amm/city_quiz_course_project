import {
  type Answer,
  type Award,
  type Question,
  type Settings,
} from "./types.ts"

export function show(question: Question, settings: Settings): string {
  const hint =
    question.hint && settings.hints !== false ? `\nHint: ${question.hint}` : ""

  if (question.kind === "choice") {
    const choices = question.choices.map(
      (choice, index) => `  ${index + 1}. ${choice.label}`,
    )

    return `${question.text}\n${choices.join("\n")}${hint}`
  }

  if (question.kind === "scale") {
    return `${question.text} (1 = ${question.low}, 5 = ${question.high})${hint}`
  }

  if (question.kind === "yesno") {
    return `${question.text} (yes or no)${hint}`
  }

  throw new Error("Unknown kind")
}

export function recap(question: Question, answer: Answer): string {
  if (question.kind !== answer.kind) {
    throw new Error("The answer does not match the question")
  }

  if (question.kind === "choice" && answer.kind === "choice") {
    return `${question.text} You chose ${answer.picked.label}.`
  }

  if (question.kind === "scale" && answer.kind === "scale") {
    return `${question.text} You rated it ${answer.value} out of 5.`
  }

  if (question.kind === "yesno" && answer.kind === "yesno") {
    return `${question.text} You said ${answer.value ? "yes" : "no"}.`
  }

  throw new Error("Unknown kind")
}

export function award(question: Question, answer: Answer): Award {
  if (question.kind !== answer.kind) {
    throw new Error("The answer does not match the question")
  }

  if (question.kind === "choice" && answer.kind === "choice") {
    return { outcome: answer.picked.outcome, points: answer.picked.points }
  }

  if (question.kind === "scale" && answer.kind === "scale") {
    return { outcome: question.outcome, points: answer.value }
  }

  if (question.kind === "yesno" && answer.kind === "yesno") {
    return { outcome: question.outcome, points: answer.value ? 1 : 0 }
  }

  throw new Error("Unknown kind")
}
