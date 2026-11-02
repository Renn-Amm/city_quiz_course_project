import { award, recap } from "./quiz.ts"
import {
  type Answer,
  type Award,
  type Outcome,
  type OutcomeId,
  type Question,
} from "./types.ts"

export type Status = "waiting" | "asking" | "done"

export class Session {
  private tally: Record<OutcomeId, number> = {
    barcelona: 0,
    tokyo: 0,
    reykjavik: 0,
    newyork: 0,
  }

  private reasons: Record<OutcomeId, string[]> = {
    barcelona: [],
    tokyo: [],
    reykjavik: [],
    newyork: [],
  }

  private outcomes: Outcome[]
  private status: Status = "waiting"

  constructor(outcomes: Outcome[]) {
    this.outcomes = outcomes
  }

  public start(): void {
    if (this.status !== "waiting") {
      throw new Error("The quiz has already started")
    }

    this.status = "asking"
  }

  public record(question: Question, answer: Answer): Award {
    if (this.status !== "asking") {
      throw new Error("The quiz is not asking questions")
    }

    const { outcome, points } = award(question, answer)

    this.tally[outcome] += points

    if (points > 0) {
      this.reasons[outcome].push(recap(question, answer))
    }

    return { outcome, points }
  }

  public finish(): void {
    if (this.status !== "asking") {
      throw new Error("The quiz is not asking questions")
    }

    if (!this.outcomes.some((outcome) => this.tally[outcome.id] > 0)) {
      throw new Error("No points have been scored")
    }

    this.status = "done"
  }

  public result(): Outcome {
    if (this.status !== "done") {
      throw new Error("The quiz has not finished")
    }

    let best = this.outcomes[0]

    for (const outcome of this.outcomes) {
      if (this.tally[outcome.id] > this.tally[best.id]) {
        best = outcome
      }
    }

    return best
  }

  public explain(): string[] {
    const best = this.result()

    return [...this.reasons[best.id]]
  }
}
