import {
  type Answer,
  type Choice,
  type Outcome,
  type Question,
  type Quiz,
  type Settings,
} from "./types.ts"

export function isQuiz(value: unknown): value is Quiz {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (
    !("outcomes" in value) ||
    !Array.isArray(value.outcomes) ||
    !value.outcomes.every((outcome) => isOutcome(outcome))
  ) {
    return false
  }

  if (
    !("questions" in value) ||
    !Array.isArray(value.questions) ||
    !value.questions.every((question) => isQuestion(question))
  ) {
    return false
  }

  return true
}

export function isOutcome(value: unknown): value is Outcome {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (!("id" in value) || typeof value.id !== "string") {
    return false
  }

  if (!("title" in value) || typeof value.title !== "string") {
    return false
  }

  if (!("description" in value) || typeof value.description !== "string") {
    return false
  }

  if ("country" in value && typeof value.country !== "string") {
    return false
  }

  if (
    !("vibe" in value) ||
    (value.vibe !== "beach" &&
      value.vibe !== "mountains" &&
      value.vibe !== "big city")
  ) {
    return false
  }

  return true
}

export function isQuestion(value: unknown): value is Question {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (!("kind" in value) || typeof value.kind !== "string") {
    return false
  }

  if (!("text" in value) || typeof value.text !== "string") {
    return false
  }

  if ("hint" in value && typeof value.hint !== "string") {
    return false
  }

  if (value.kind === "choice") {
    return (
      "choices" in value &&
      Array.isArray(value.choices) &&
      value.choices.every((choice) => isChoice(choice))
    )
  }

  if (value.kind === "scale") {
    return (
      "low" in value &&
      typeof value.low === "string" &&
      "high" in value &&
      typeof value.high === "string" &&
      "outcome" in value &&
      typeof value.outcome === "string"
    )
  }

  if (value.kind === "yesno") {
    return "outcome" in value && typeof value.outcome === "string"
  }

  return false
}

export function isAnswer(value: unknown): value is Answer {
  if (typeof value !== "object" || value === null || !("kind" in value)) {
    return false
  }

  if (value.kind === "choice") {
    return "picked" in value && isChoice(value.picked)
  }

  if (value.kind === "scale") {
    return (
      "value" in value &&
      typeof value.value === "number" &&
      value.value >= 1 &&
      value.value <= 5
    )
  }

  if (value.kind === "yesno") {
    return "value" in value && typeof value.value === "boolean"
  }

  return false
}

export function isChoice(value: unknown): value is Choice {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (!("label" in value) || typeof value.label !== "string") {
    return false
  }

  if (!("outcome" in value) || typeof value.outcome !== "string") {
    return false
  }

  if (!("points" in value) || typeof value.points !== "number") {
    return false
  }

  return true
}

export function isSettings(value: unknown): value is Settings {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (!("name" in value) || typeof value.name !== "string") {
    return false
  }

  if ("hints" in value && typeof value.hints !== "boolean") {
    return false
  }

  return true
}
