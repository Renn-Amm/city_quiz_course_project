export interface Quiz {
  outcomes: Outcome[]
  questions: Question[]
}

export interface Outcome {
  id: string
  title: string
  description: string
  country?: string
  vibe: "beach" | "mountains" | "big city"
}

export interface Choice {
  label: string
  outcome: string
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
  outcome: string
}

interface YesNoQuestion extends BaseQuestion {
  kind: "yesno"
  outcome: string
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

export interface Award {
  outcome: string
  points: number
}

export interface Settings {
  name: string
  hints?: boolean
}

type ChoicePrompt = Omit<ChoiceQuestion, "choices"> & {
  choices: PromptChoice[]
}

type ScalePrompt = Omit<ScaleQuestion, "outcome">

type YesNoPrompt = Omit<YesNoQuestion, "outcome">

export type Prompt = ChoicePrompt | ScalePrompt | YesNoPrompt

type ChoiceSubmission = Omit<ChoiceAnswer, "picked"> & {
  picked: PromptChoice
}

type ScaleSubmission = ScaleAnswer

type YesNoSubmission = YesNoAnswer

export type Submission = ChoiceSubmission | ScaleSubmission | YesNoSubmission

export type PromptChoice = Pick<Choice, "label">

export interface QuizResponse {
  questions: Prompt[]
}

export interface StartedResponse {
  session_id: string
}

export interface ProgressResponse {
  answered: number
  total: number
}

export type ResultResponse = Pick<
  Outcome,
  "title" | "description" | "country" | "vibe"
> & {
  reasons: string[]
}
