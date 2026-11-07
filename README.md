# City Quiz

Find the city you should live in. Answer a few questions about how you spend your time, and City Quiz matches you with Barcelona, Tokyo, Reykjavik or New York, then tells you exactly which answers got you there.

City Quiz is a small TypeScript monorepo: a Fastify API that owns the questions and the scoring, and two clients, one in the terminal and one in the browser, that only ever see the questions and send back what you picked.

## Features

- Play in the browser or in the terminal, against the same API
- Three kinds of question: multiple choice, a 1 to 5 scale, and yes or no
- Scoring stays on the server, so the client never sees a point or an outcome
- A result card with the reasons behind it
- Progress as you go ("Question 2 of 4")
- Replay a saved game without answering again
- Quizzes are plain JSON files, checked against their expected shape when they load
- Clear messages for every failure: server down, unknown quiz, broken file, wrong answer

## Tech stack

- TypeScript running directly on Node.js 24
- Fastify for the API
- Vite and plain DOM code for the browser client
- Commander and Inquirer for the terminal client
- pnpm workspaces with a shared version catalog
- Nx for running tasks in dependency order with caching
- ESLint (type-aware), Prettier and Knip
- Node's built-in test runner
- GitHub Actions, one workflow per package

## Getting started

```sh
pnpm install
```

pnpm 12 is pinned in `package.json` and downloaded for you if you have a different version.

Start the API in one terminal:

```sh
pnpm api
```

Play in the browser from another terminal, then open the address Vite prints:

```sh
pnpm web
```

Or play in the terminal:

```sh
pnpm --filter @platform/cli start play
```

You need Node.js 24 or newer. Nothing else has to be installed by hand.

## Usage

```sh
pnpm --filter @platform/cli start play                 # answer the questions
pnpm --filter @platform/cli start play --name Bo       # with your own name
pnpm --filter @platform/cli start play cities          # pick a quiz by name
pnpm --filter @platform/cli start replay               # replay the saved answers
pnpm --filter @platform/cli start --help
```

The terminal client talks to `http://localhost:3000` by default. Point it somewhere else with `QUIZ_API_URL`:

```sh
QUIZ_API_URL=http://quiz.example.com pnpm --filter @platform/cli start play
```

In the browser, pick a quiz with `?quiz=`, for example `http://localhost:5173/?quiz=cities`.

Your name and hint setting live in `apps/cli/saved/settings.json`, and the answers used by `replay` live in `apps/cli/saved/game.json`.

## API

| Method | Path              | Description                                                       |
| ------ | ----------------- | ----------------------------------------------------------------- |
| GET    | `/quizzes/:name`  | The questions of a quiz, without points or outcomes               |
| POST   | `/session`        | Start a session with `{ "quiz": "cities" }`, returns `session_id` |
| GET    | `/session`        | Progress: how many questions are answered, out of how many        |
| POST   | `/session/answer` | Answer the next question                                          |
| GET    | `/session/result` | The city, its description, and the answers that led to it         |

Every route under `/session` except the first needs an `x-session-id` header.

| Status | When                                                        |
| ------ | ----------------------------------------------------------- |
| 400    | The body is missing or does not fit the question            |
| 401    | The session id is missing or unknown                        |
| 404    | There is no quiz with that name                             |
| 409    | Every question already has an answer, or not all of them do |

## Project structure

```
apps/
  api/                 Fastify server
    src/routes/        quizzes and session routes
  cli/                 terminal client
    src/commands/      play and replay
    saved/             settings and the saved game
  web/                 browser client
    src/ask/           one question with its buttons
    src/show/          the result card
features/
  quiz/                shared quiz logic
    src/play/          types, guards, scoring, the Session class
    src/quizzes/       quiz JSON files and the loader
    src/services/      typed client for the API, used by both clients
    src/saved/         reading the saved files
    src/outline/       the quiz outline
internal/
  tooling/             shared TypeScript, ESLint and Prettier config
```

| Package             | What it holds                                                        |
| ------------------- | -------------------------------------------------------------------- |
| `@platform/api`     | The routes and the sessions, the only place that knows points        |
| `@platform/cli`     | The `play` and `replay` commands                                     |
| `@platform/web`     | The page that asks the questions and shows the result card           |
| `@platform/quiz`    | Types, guards, scoring, quiz files and the services both clients use |
| `@platform/tooling` | Shared TypeScript, ESLint and Prettier config                        |

Each folder under `src` has a single `index.ts` that is its only public entry point. Other packages import `@platform/quiz/play`, `@platform/quiz/services` and so on, never a file inside a folder.

## Adding a quiz

Add a JSON file to `features/quiz/src/quizzes`, named after the quiz:

```json
{
  "outcomes": [
    {
      "id": "barcelona",
      "title": "Barcelona",
      "country": "Spain",
      "vibe": "beach",
      "description": "Beach, sun and late dinners."
    }
  ],
  "questions": [
    {
      "kind": "yesno",
      "text": "Is dinner at 10pm normal for you?",
      "outcome": "barcelona"
    }
  ]
}
```

- `vibe` is `beach`, `mountains` or `big city`; `country` is optional
- A `choice` question has `choices`, each with a `label`, an `outcome` and `points`
- A `scale` question has `low`, `high` and an `outcome`
- Any question can have a `hint`

The API finds the quiz by its file name, so `music.json` is played with `play music` in the terminal and `?quiz=music` in the browser.

## Development

```sh
pnpm lint          # type check, ESLint, Prettier and Knip in every package
pnpm test          # API tests
pnpm --filter @platform/web build   # build the page into apps/web/dist
pnpm nx graph      # how the packages depend on each other
```

Each package has its own GitHub workflow that runs only when that package, or something it depends on, changes.

## Status

What works:

- The full game in both clients: questions one at a time, progress, the result card with its reasons
- Every route checks its input and answers with a clear error and status code
- Failures show up as a message, in the terminal or in the page, never as a crash
- Lint, type checks and API tests pass, and every package has its own workflow

What doesn't yet:

- Sessions live in memory, so restarting the API forgets every game in progress
- The page only knows the API at `http://localhost:3000`
- `replay` is only in the terminal, the page has no saved game
- There is a single quiz

What's next:

- Keep sessions in a small database so they survive a restart
- Let the page pick its server from the address bar or a build setting
- A list of quizzes, so the page and `play` can show what is there to pick from
- More quizzes, starting with one about music
