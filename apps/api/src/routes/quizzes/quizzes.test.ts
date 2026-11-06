import assert from "node:assert/strict"
import { test } from "node:test"

import Fastify from "fastify"

import quizzes from "./index.ts"

const app = Fastify()

await app.register(quizzes)

await test("GET /quizzes/cities sends the questions without any points", async () => {
  const reply = await app.inject({ method: "GET", url: "/quizzes/cities" })

  assert.equal(reply.statusCode, 200)
  assert.equal(reply.body.includes("points"), false)
  assert.equal(reply.body.includes("outcome"), false)
  assert.equal(reply.json<{ questions: unknown[] }>().questions.length, 4)
})

await test("GET /quizzes/nope answers 404", async () => {
  const reply = await app.inject({ method: "GET", url: "/quizzes/nope" })

  assert.equal(reply.statusCode, 404)
  assert.deepEqual(reply.json(), { error: "There is no such quiz" })
})

await test("GET /quizzes/../secrets is treated as no quiz", async () => {
  const reply = await app.inject({
    method: "GET",
    url: "/quizzes/..%2Fsecrets",
  })

  assert.equal(reply.statusCode, 404)
})
