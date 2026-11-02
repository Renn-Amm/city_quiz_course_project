# @platform/quiz

Everything the city quiz needs, split into modlets that other packages import by name.

| Import                   | What it gives                                                     |
| ------------------------ | ----------------------------------------------------------------- |
| `@platform/quiz/play`    | Types, guards, `show`, `recap`, `award` and the `Session` class   |
| `@platform/quiz/quizzes` | `loadQuiz(name)`, which reads, parses and checks a quiz JSON file |
| `@platform/quiz/saved`   | `readSavedGame`, `readSettings` and the functions they use        |
| `@platform/quiz/outline` | `outline(quiz)` as the default export and `countKinds(quiz)`      |

Files inside a folder cannot be imported from outside, only the folder's `index.ts`.

## Lint

```sh
pnpm --filter @platform/quiz lint
```
