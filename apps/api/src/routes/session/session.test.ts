import assert from "node:assert/strict"
import { test } from "node:test"

import Fastify from "fastify"

import session from "./index.ts"

const app = Fastify()

await app.register(session)

async function start(): Promise<string> {
  const reply = await app.inject({
    method: "POST",
    url: "/session",
    payload: { quiz: "cities" },
  })

  assert.equal(reply.statusCode, 201)

  return reply.json<{ session_id: string }>().session_id
}

function answer(id: string, payload: object) {
  return app.inject({
    method: "POST",
    url: "/session/answer",
    headers: { "x-session-id": id },
    payload,
  })
}

await test("POST /session needs a quiz name and a real quiz", async () => {
  const missing = await app.inject({ method: "POST", url: "/session" })
  const unknown = await app.inject({
    method: "POST",
    url: "/session",
    payload: { quiz: "nope" },
  })

  assert.equal(missing.statusCode, 400)
  assert.equal(unknown.statusCode, 404)
})

await test("GET /session reports progress and refuses unknown sessions", async () => {
  const id = await start()

  const fresh = await app.inject({
    method: "GET",
    url: "/session",
    headers: { "x-session-id": id },
  })

  assert.equal(fresh.statusCode, 200)
  assert.deepEqual(fresh.json(), { answered: 0, total: 4 })

  await answer(id, {
    kind: "choice",
    picked: { label: "Reading on the beach" },
  })

  const after = await app.inject({
    method: "GET",
    url: "/session",
    headers: { "x-session-id": id },
  })

  assert.deepEqual(after.json(), { answered: 1, total: 4 })

  const noHeader = await app.inject({ method: "GET", url: "/session" })
  const wrongId = await app.inject({
    method: "GET",
    url: "/session",
    headers: { "x-session-id": "not-a-session" },
  })

  assert.equal(noHeader.statusCode, 401)
  assert.equal(wrongId.statusCode, 401)
})

await test("a full session gives the result and refuses extra answers", async () => {
  const id = await start()

  const early = await app.inject({
    method: "GET",
    url: "/session/result",
    headers: { "x-session-id": id },
  })

  assert.equal(early.statusCode, 409)

  const wrongKind = await answer(id, { kind: "scale", value: 4 })
  const wrongLabel = await answer(id, {
    kind: "choice",
    picked: { label: "Swimming to Mars" },
  })

  assert.equal(wrongKind.statusCode, 400)
  assert.equal(wrongLabel.statusCode, 400)

  const replies = [
    await answer(id, {
      kind: "choice",
      picked: { label: "Reading on the beach" },
    }),
    await answer(id, { kind: "scale", value: 3 }),
    await answer(id, { kind: "yesno", value: false }),
    await answer(id, { kind: "yesno", value: true }),
  ]

  assert.deepEqual(
    replies.map((reply) => reply.statusCode),
    [204, 204, 204, 204],
  )

  const extra = await answer(id, { kind: "yesno", value: true })

  assert.equal(extra.statusCode, 409)

  const result = await app.inject({
    method: "GET",
    url: "/session/result",
    headers: { "x-session-id": id },
  })

  assert.equal(result.statusCode, 200)
  assert.equal(result.json<{ title: string }>().title, "Barcelona")
})
