import { type Prompt } from "../play/index.ts"

interface Questions {
  questions: Prompt[]
}

export default function outline(quiz: Readonly<Questions>): string[] {
  return quiz.questions.map(
    (question, index) =>
      `${index + 1}. ${question.text} (${describe(question)})`,
  )
}

export function countKinds(
  quiz: Readonly<Questions>,
): Record<Prompt["kind"], number> {
  const counts: Record<Prompt["kind"], number> = {
    choice: 0,
    scale: 0,
    yesno: 0,
  }

  for (const question of quiz.questions) {
    counts[question.kind] += 1
  }

  return counts
}

function describe(question: Prompt): string {
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
