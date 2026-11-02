interface Choice {
  label: string
  points: number
}
 
interface Question {
  text: string
  choices: Choice[]
}
 
interface Outcome {
  title: string
  description: string
  country?: string
  vibe: "beach" | "mountains" | "big city"
}
 
const question: Question = {
  text: "It's Saturday morning. What are you doing?",
  choices: [
    { label: "Getting a croissant at a cafe", points: 1 },
    { label: "Hiking outside the city", points: 2 },
    { label: "Walking around a night market", points: 3 },
    { label: "Reading on the beach", points: 4 },
  ],
}
 
const outcome: Outcome = {
  title: "Barcelona",
  country: "Spain",
  vibe: "beach",
  description:
    "Beach, sun and late dinners. You like a relaxed city by the sea.",
}
 
const answer = 3
 
const picked = question.choices[answer]
 
console.log(question.text)
console.log(`You chose ${picked.label} (${picked.points} points)`)
 
const place = outcome.country
  ? `${outcome.title}, ${outcome.country}`
  : outcome.title
 
const card = `=== ${place} (${outcome.vibe}) ===
${outcome.description}`
 
console.log(card)