import { type KnipConfig } from "knip"

const config: KnipConfig = {
  entry: ["src/main.ts"],
  project: ["src/**/*.ts"],
  exclude: ["catalogReferences"],
}

export default config
