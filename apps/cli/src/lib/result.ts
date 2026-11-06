import { type ResultResponse } from "@platform/quiz/play"

export function printResult(result: ResultResponse): void {
  const place = result.country
    ? `${result.title}, ${result.country}`
    : result.title

  console.log(`You are: ${place} (${result.vibe})`)
  console.log(result.description)
  console.log()
  console.log("You got this because:")

  for (const reason of result.reasons) {
    console.log(`- ${reason}`)
  }
}
