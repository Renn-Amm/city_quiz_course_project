import { outcomes } from "../data.ts"

import { type Answer, type Choice, type Settings } from "./types.ts"

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

  if (
    !("outcome" in value) ||
    !outcomes.some((outcome) => outcome.id === value.outcome)
  ) {
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
