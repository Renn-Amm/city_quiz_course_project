const baseUrl = process.env.QUIZ_API_URL ?? "http://localhost:3000"

export async function call(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  let response: Response

  try {
    response = await fetch(`${baseUrl}${path}`, init)
  } catch {
    throw new Error(`Cannot reach the server at ${baseUrl}`)
  }

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => undefined)

    throw new Error(errorOf(body) ?? `The server answered ${response.status}`)
  }

  return response
}

export async function readBody(response: Response): Promise<unknown> {
  try {
    const body: unknown = await response.json()

    return body
  } catch {
    throw new Error("The server sent a reply that is not JSON")
  }
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
