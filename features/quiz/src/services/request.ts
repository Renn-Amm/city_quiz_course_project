const BASE_URL = process.env.QUIZ_API_URL ?? "http://localhost:3000"

export async function request<Reply extends object = object>(
  path: string,
  isReply: (value: unknown) => value is Reply,
  init?: RequestInit,
): Promise<Reply> {
  const response = await call(path, init)

  let body: unknown

  try {
    body = await response.json()
  } catch {
    throw new Error("The server sent a reply that is not JSON")
  }

  if (!isReply(body)) {
    throw new Error(`The server sent an unexpected reply for ${path}`)
  }

  return body
}

export async function call(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  let response: Response

  try {
    response = await fetch(`${BASE_URL}${path}`, init)
  } catch {
    throw new Error(`Cannot reach the server at ${BASE_URL}`)
  }

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => undefined)

    throw new Error(errorOf(body) ?? `The server answered ${response.status}`)
  }

  return response
}

function errorOf(body: unknown): string | undefined {
  if (
    typeof body === "object" &&
    body !== null &&
    "error" in body &&
    typeof body.error === "string"
  ) {
    return body.error
  }

  return undefined
}
