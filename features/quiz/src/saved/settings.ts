import { readFile } from "node:fs/promises"

import { type Settings, isSettings } from "../play/index.ts"

export async function readSettings(file: string): Promise<Settings> {
  const text = await readFile(file, "utf8")

  return loadSettings(text)
}

export function loadSettings(saved: string): Settings {
  let value: unknown

  try {
    value = JSON.parse(saved)
  } catch {
    throw new Error("The saved settings are not valid text")
  }

  if (!isSettings(value)) {
    throw new Error(
      "The saved settings need a name and, if present, a true or false hints",
    )
  }

  return value
}
