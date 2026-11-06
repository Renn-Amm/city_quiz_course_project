# City Quiz

A quiz that tells you which city you should live in: Barcelona, Tokyo, Reykjavik or New York. Every answer gives points to a city, and the city with the most points wins. At the end you see why you got it.

The quiz runs on a small server that keeps the scoring to itself. The terminal app only ever sees the questions and sends back what you picked.

Course project for M3 Advanced JavaScript and TypeScript.

## Packages

| Package             | Folder             | What it holds                                                             |
| ------------------- | ------------------ | ------------------------------------------------------------------------- |
| `@platform/api`     | `apps/api`         | The Fastify server that serves the quiz and scores each session           |
| `@platform/cli`     | `apps/cli`         | The `quiz` command with `play` and `replay`                               |
| `@platform/quiz`    | `features/quiz`    | Types, guards, scoring, the outline, the services and the quiz JSON files |
| `@platform/tooling` | `internal/tooling` | Shared TypeScript, Prettier and ESLint settings                           |

Inside `@platform/quiz`, every folder in `src` is a modlet that other packages import by name: `play`, `quizzes`, `saved`, `outline` and `services`.

## Requirements

- Node.js 24
- pnpm 12 (downloaded for you through `devEngines` if missing)

## Run

Start the server in one terminal:

```sh
pnpm install
pnpm api
```

Then play in another:

```sh
pnpm --filter @platform/cli start play
pnpm --filter @platform/cli start play --name Bo
pnpm --filter @platform/cli start replay
pnpm --filter @platform/cli start --help
```

`play` asks every question and shows how far you are. `replay` plays the quiz again with the answers in `apps/cli/saved/game.json`. Set `QUIZ_API_URL` to point the CLI at a server somewhere other than `http://localhost:3000`.

## API

| Method | Path              | What it does                                                         |
| ------ | ----------------- | -------------------------------------------------------------------- |
| GET    | `/quizzes/:name`  | The questions of a quiz, without any points or outcomes              |
| POST   | `/session`        | Starts a session for `{ "quiz": "cities" }` and returns `session_id` |
| GET    | `/session`        | How many questions have an answer, and how many there are            |
| POST   | `/session/answer` | Sends the answer to the next question                                |
| GET    | `/session/result` | The city, why you got it, and the reasons                            |

Every `/session` route except the first needs the `x-session-id` header.

## Data files

A quiz is a JSON file in `features/quiz/src/quizzes`, named after the quiz, such as `cities.json`. It has a list of `outcomes`, each with an `id`, `title`, `description`, `vibe` and an optional `country`, and a list of `questions` of three kinds: `choice`, `scale` and `yesno`. To add a quiz, add a file there; the server and the CLI find it by its name. A file in the wrong shape is refused with a message.

## Check

```sh
pnpm lint
pnpm test
pnpm nx graph
```

`pnpm lint` runs the type check, ESLint, Prettier and Knip in every package, with `@platform/tooling` first. `pnpm test` runs the API tests, which call every route, including the ways they fail.

## What is next

- A browser client for the same server
- Sessions that survive a server restart
