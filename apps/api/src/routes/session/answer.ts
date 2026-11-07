import {
  type Answer,
  type Question,
  type Submission,
} from "@platform/quiz/play"

export function toAnswer(
  question: Question,
  submission: Submission,
): Answer | undefined {
  if (question.kind === "choice" && submission.kind === "choice") {
    const picked = question.choices.find(
      ({ label }) => label === submission.picked.label,
    )

    return picked ? { kind: "choice", picked } : undefined
  }

  if (question.kind === "scale" && submission.kind === "scale") {
    return { kind: "scale", value: submission.value }
  }

  if (question.kind === "yesno" && submission.kind === "yesno") {
    return { kind: "yesno", value: submission.value }
  }

  return undefined
}
