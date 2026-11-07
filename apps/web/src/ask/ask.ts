import { type Prompt, type Submission } from "@platform/quiz/play"

import { optionsFor } from "./options.ts"

export default function ask(
  app: HTMLElement,
  prompt: Prompt,
  progress: string,
): Promise<Submission> {
  const options = optionsFor(prompt)

  const line = document.createElement("p")
  line.className = "progress"
  line.textContent = progress

  const text = document.createElement("h2")
  text.textContent = prompt.text

  const parts: HTMLElement[] = [line, text]

  if (prompt.kind === "scale") {
    const range = document.createElement("p")
    range.className = "range"
    range.textContent = `1 = ${prompt.low}, 5 = ${prompt.high}`
    parts.push(range)
  }

  if (prompt.hint) {
    const hint = document.createElement("p")
    hint.className = "hint"
    hint.textContent = `Hint: ${prompt.hint}`
    parts.push(hint)
  }

  const list = document.createElement("div")
  list.className = `options ${prompt.kind}`

  for (const [index, option] of options.entries()) {
    const button = document.createElement("button")
    button.type = "button"
    button.dataset.index = String(index)
    button.textContent = option.label
    list.append(button)
  }

  parts.push(list)
  app.replaceChildren(...parts)

  return new Promise((resolve) => {
    function onClick(event: MouseEvent): void {
      if (!(event.target instanceof HTMLButtonElement)) {
        return
      }

      const option = options[Number(event.target.dataset.index)]

      if (!option) {
        return
      }

      list.removeEventListener("click", onClick)

      for (const button of list.querySelectorAll("button")) {
        button.disabled = true
      }

      resolve(option.submission)
    }

    list.addEventListener("click", onClick)
  })
}
