import { randomUUID } from "node:crypto"

import { type Quiz, Session } from "@platform/quiz/play"

interface Entry {
  quiz: Quiz
  session: Session
  answered: number
  finished: boolean
}

const entries = new Map<string, Entry>()

export function create(quiz: Quiz): string {
  const session = new Session(quiz.outcomes)

  session.start()

  const id = randomUUID()

  entries.set(id, { quiz, session, answered: 0, finished: false })

  return id
}

export function find(id: string | undefined): Entry | undefined {
  return id === undefined ? undefined : entries.get(id)
}
