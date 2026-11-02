import path from "node:path"

export function locateSettings(): string {
  return path.join(import.meta.dirname, "..", "..", "saved", "settings.json")
}

export function locateSavedGame(): string {
  return path.join(import.meta.dirname, "..", "..", "saved", "game.json")
}
