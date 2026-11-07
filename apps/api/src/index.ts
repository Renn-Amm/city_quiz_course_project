import cors from "@fastify/cors"
import Fastify from "fastify"

import quizzes from "./routes/quizzes/index.ts"
import session from "./routes/session/index.ts"

const fastify = Fastify()

await fastify.register(cors)
await fastify.register(quizzes)
await fastify.register(session)

await fastify.listen({ port: 3000 })
