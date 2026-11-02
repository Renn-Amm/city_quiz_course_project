import { program } from "commander"

import play from "./commands/play/index.ts"
import replay from "./commands/replay/index.ts"

program.name("quiz").description("Take a quiz in the terminal")

program
  .command("play")
  .description("Answer a quiz at the terminal")
  .argument("[quiz]", "the quiz to play", "cities")
  .option("-n, --name <name>", "your name")
  .action(play)

program
  .command("replay")
  .description("Play a quiz again with the saved answers")
  .argument("[quiz]", "the quiz to replay", "cities")
  .action(replay)

try {
  await program.parseAsync()
} catch (error) {
  if (error instanceof Error && error.name === "ExitPromptError") {
    process.exitCode = 130
  } else {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
