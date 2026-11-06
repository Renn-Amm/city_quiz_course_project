import { type FastifyPluginAsync } from "fastify"

import { findQuiz } from "#shared/quizzes"
import { toPrompt } from "./prompt.ts"

interface Params {
  name: string
}

const quizzes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Params: Params }>("/quizzes/:name", async (request, reply) => {
    const quiz = await findQuiz(request.params.name)
    if (!quiz) {
      return reply.code(404).send({ error: "There is no such quiz" })
    }

    return {
      questions: quiz.questions.map(toPrompt),
    }
  })
}

export default quizzes
