import config from "@platform/tooling/eslint"

export default [
  ...config(import.meta.dirname),
  {
    rules: {
      "@typescript-eslint/require-await": "off",
    },
  },
]
