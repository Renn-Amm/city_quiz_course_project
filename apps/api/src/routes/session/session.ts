import { isSubmission } from "@platform/quiz/play"
import { type FastifyPluginAsync } from "fastify"

import { findQuiz } from "#shared/quizzes"
import { toAnswer } from "./answer.ts"
import { create, find } from "./storage.ts"

interface SessionHeader {
  "x-session-id"?: string
}

interface StartBody {
  quiz?: string
}

const session: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: StartBody | undefined }>(
    "/session",
    async (request, reply) => {
      const name = request.body?.quiz
      if (typeof name !== "string") {
        return reply.code(400).send({ error: 'The body needs a "quiz" name' })
      }

      const quiz = await findQuiz(name)
      if (!quiz) {
        return reply.code(404).send({ error: "There is no such quiz" })
      }

      return reply.code(201).send({
        session_id: create(quiz),
      })
    },
  )

  fastify.get<{ Headers: SessionHeader }>(
    "/session",
    async (request, reply) => {
      const entry = find(request.headers["x-session-id"])
      if (!entry) {
        return reply.code(401).send({ error: "Unknown session" })
      }

      return {
        answered: entry.answered,
        total: entry.quiz.questions.length,
      }
    },
  )

  fastify.post<{ Body: unknown; Headers: SessionHeader }>(
    "/session/answer",
    async (request, reply) => {
      const entry = find(request.headers["x-session-id"])
      if (!entry) {
        return reply.code(401).send({ error: "Unknown session" })
      }

      const question = entry.quiz.questions[entry.answered]
      if (!question) {
        return reply.code(409).send({ error: "Every question has an answer" })
      }

      const submission = request.body
      if (!isSubmission(submission) || submission.kind !== question.kind) {
        return reply.code(400).send({ error: "That does not fit the question" })
      }

      const answer = toAnswer(question, submission)
      if (!answer) {
        return reply.code(400).send({ error: "That does not fit the question" })
      }

      entry.session.record(question, answer)
      entry.answered += 1

      return reply.code(204).send()
    },
  )

  fastify.get<{ Headers: SessionHeader }>(
    "/session/result",
    async (request, reply) => {
      const entry = find(request.headers["x-session-id"])
      if (!entry) {
        return reply.code(401).send({ error: "Unknown session" })
      }

      if (entry.answered < entry.quiz.questions.length) {
        return reply.code(409).send({ error: "Some questions have no answer" })
      }

      if (!entry.finished) {
        try {
          entry.session.finish()
        } catch {
          return reply.code(409).send({ error: "No points have been scored" })
        }

        entry.finished = true
      }

      const { title, description, country, vibe } = entry.session.result()

      return {
        title,
        description,
        country,
        vibe,
        reasons: entry.session.explain(),
      }
    },
  )
}

export default session
