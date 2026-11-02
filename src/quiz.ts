import { type Answer, type Question } from "./types.ts"

export function show(question: Question): string {
  if (question.kind === "choice") {
    const choices = question.choices.map(
      (choice, index) => `  ${index + 1}. ${choice.label}`,
    )

    return `${question.text}\n${choices.join("\n")}`
  }

  if (question.kind === "scale") {
    return `${question.text} (1 = ${question.low}, 5 = ${question.high})`
  }

  if (question.kind === "yesno") {
    return `${question.text} (yes or no)`
  }

  throw new Error("Unknown kind")
}

export function award(answer: Answer): number {
  if (answer.kind === "choice") {
    return answer.picked.points
  }

  if (answer.kind === "scale") {
    return answer.value
  }

  if (answer.kind === "yesno") {
    return answer.value ? 1 : 0
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
