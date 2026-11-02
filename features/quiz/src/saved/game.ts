import { readFile } from "node:fs/promises"

import { type Answer, isAnswer } from "../play/index.ts"

export interface SavedGame {
  answers: Answer[]
  startedAt?: string
}

export async function readSavedGame(file: string): Promise<SavedGame> {
  const text = await readFile(file, "utf8")

  return loadSavedGame(text)
}

export function loadSavedGame(saved: string): SavedGame {
  let value: unknown

  try {
    value = JSON.parse(saved)
  } catch {
    throw new Error("The saved game is not valid text")
  }

  if (!isSavedGame(value)) {
    throw new Error(
      "The saved game is missing a piece or has the wrong kind of piece",
    )
  }

  return value
}

function isSavedGame(value: unknown): value is SavedGame {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (
    !("answers" in value) ||
    !Array.isArray(value.answers) ||
    !value.answers.every(isAnswer)
  ) {
    return false
  }

  if ("startedAt" in value && typeof value.startedAt !== "string") {
    return false
  }

  return true
}
