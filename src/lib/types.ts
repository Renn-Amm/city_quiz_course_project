export interface Quiz {
  outcomes: Outcome[]
  questions: Question[]
}

export type OutcomeId = "barcelona" | "tokyo" | "reykjavik" | "newyork"

export interface Outcome {
  id: OutcomeId
  title: string
  description: string
  country?: string
  vibe: "beach" | "mountains" | "big city"
}

export interface Choice {
  label: string
  outcome: OutcomeId
  points: number
}

interface BaseQuestion {
  text: string
  hint?: string
}

interface ChoiceQuestion extends BaseQuestion {
  kind: "choice"
  choices: Choice[]
}

interface ScaleQuestion extends BaseQuestion {
  kind: "scale"
  low: string
  high: string
  outcome: OutcomeId
}

interface YesNoQuestion extends BaseQuestion {
  kind: "yesno"
  outcome: OutcomeId
}

export type Question = ChoiceQuestion | ScaleQuestion | YesNoQuestion

interface ChoiceAnswer {
  kind: "choice"
  picked: Choice
}

interface ScaleAnswer {
  kind: "scale"
  value: number
}

interface YesNoAnswer {
  kind: "yesno"
  value: boolean
}

export type Answer = ChoiceAnswer | ScaleAnswer | YesNoAnswer
