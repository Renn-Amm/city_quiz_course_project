import { type ResultResponse } from "@platform/quiz/play"

export default function show(
  app: HTMLElement,
  result: ResultResponse,
  onAgain: () => void,
): void {
  const label = document.createElement("p")
  label.className = "progress"
  label.textContent = "Your city"

  const title = document.createElement("h2")
  title.textContent = result.country
    ? `${result.title}, ${result.country}`
    : result.title

  const vibe = document.createElement("p")
  vibe.className = "vibe"
  vibe.textContent = result.vibe

  const description = document.createElement("p")
  description.textContent = result.description

  const heading = document.createElement("h3")
  heading.textContent = "Why"

  const reasons = document.createElement("ul")

  for (const reason of result.reasons) {
    const item = document.createElement("li")
    item.textContent = reason
    reasons.append(item)
  }

  const again = document.createElement("button")
  again.type = "button"
  again.textContent = "Play again"
  again.addEventListener("click", onAgain, { once: true })

  app.replaceChildren(label, title, vibe, description, heading, reasons, again)
}
