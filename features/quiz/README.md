# @platform/quiz

The shared quiz logic used by the API, the terminal client and the page. Each entry point below is a folder with a single `index.ts`; nothing inside a folder can be imported directly.

| Import                    | What it gives                                                                       |
| ------------------------- | ----------------------------------------------------------------------------------- |
| `@platform/quiz/play`     | Types, guards, `show`, `recap`, `award` and the `Session` class                     |
| `@platform/quiz/quizzes`  | `loadQuiz(name)`, which reads, parses and checks a quiz JSON file                   |
| `@platform/quiz/services` | `getQuiz`, `startSession`, `getProgress`, `sendAnswer`, `getResult` and `useServer` |
| `@platform/quiz/saved`    | `readSavedGame` and `readSettings`                                                  |
| `@platform/quiz/outline`  | `outline(quiz)` as the default export, and `countKinds(quiz)`                       |

Every reply from the API is checked with a guard before it is used, so a server that sends the wrong shape fails with a clear message instead of a crash further down.

## Check

```sh
pnpm --filter @platform/quiz lint
```
