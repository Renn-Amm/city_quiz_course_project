# City Quiz

A terminal quiz that tells you which city you should live in: Barcelona, Tokyo, Reykjavik or New York. Every answer gives points to a city, and the city with the most points wins. At the end you see why you got it.

Course project for M3 Advanced JavaScript and TypeScript.

## Packages

| Package             | Folder             | What it holds                                                   |
| ------------------- | ------------------ | --------------------------------------------------------------- |
| `@platform/cli`     | `apps/cli`         | The `quiz` command with `play` and `replay`                     |
| `@platform/quiz`    | `features/quiz`    | Quiz types, guards, scoring, the outline and the quiz JSON file |
| `@platform/tooling` | `internal/tooling` | Shared TypeScript, Prettier and ESLint settings                 |

## Requirements

- Node.js 24
- pnpm 12 (downloaded for you through `devEngines` if missing)

## Run

```sh
pnpm install
pnpm --filter @platform/cli start play
pnpm --filter @platform/cli start play --name Bo
pnpm --filter @platform/cli start replay
pnpm --filter @platform/cli start --help
```

`play` asks every question in the terminal. `replay` plays the quiz again with the answers in `apps/cli/saved/game.json`.

## Lint

```sh
pnpm lint
```

Runs the type check, ESLint, Prettier and Knip in every package through Nx, with `@platform/tooling` first.

```sh
pnpm nx graph
```

Shows how the packages depend on each other.
