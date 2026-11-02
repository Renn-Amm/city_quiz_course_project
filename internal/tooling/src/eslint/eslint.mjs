import jseslint from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"

export default function config(tsconfigRootDir) {
  return defineConfig([
    globalIgnores(["dist"]),
    {
      files: ["**/*.ts"],
      extends: [
        jseslint.configs.recommended,
        tseslint.configs.recommendedTypeChecked,
      ],
      languageOptions: {
        globals: globals.node,
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
    },
  ])
}
