import { type Question, type Quiz } from "../play/index.ts"

export default function outline(quiz: Readonly<Quiz>): string[] {
  return quiz.questions.map(
    (question, index) =>
      `${index + 1}. ${question.text} (${describe(question)})`,
  )
}

export function countKinds(
  quiz: Readonly<Quiz>,
): Record<Question["kind"], number> {
  const counts: Record<Question["kind"], number> = {
    choice: 0,
    scale: 0,
    yesno: 0,
  }

  for (const question of quiz.questions) {
    counts[question.kind] += 1
  }

  return counts
}

function describe(question: Question): string {
  if (question.kind === "choice") {
    return `choice, ${question.choices.length} options`
  }

  if (question.kind === "scale") {
    return "scale"
  }

  if (question.kind === "yesno") {
    return "yes or no"
  }

  throw new Error("Unknown kind")
}
