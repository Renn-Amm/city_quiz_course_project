import {
  isProgressResponse,
  isResultResponse,
  isStartedResponse,
  type ProgressResponse,
  type ResultResponse,
  type Submission,
} from "../play/index.ts"
import { call, request } from "./request.ts"

export async function startSession(quiz: string): Promise<string> {
  const started = await request("/session", isStartedResponse, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ quiz }),
  })

  return started.session_id
}

export async function getProgress(id: string): Promise<ProgressResponse> {
  return request("/session", isProgressResponse, {
    headers: { "x-session-id": id },
  })
}

export async function sendAnswer(
  id: string,
  submission: Submission,
): Promise<void> {
  await call("/session/answer", {
    method: "POST",
    headers: { "content-type": "application/json", "x-session-id": id },
    body: JSON.stringify(submission),
  })
}

export async function getResult(id: string): Promise<ResultResponse> {
  return request("/session/result", isResultResponse, {
    headers: { "x-session-id": id },
  })
}
