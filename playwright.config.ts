import { defineConfig, devices } from "playwright/test"



export default defineConfig({
  testDir: "./src/jobs",
  outputDir: "./node_modules/repo-tmp/playwright",
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: "null",
  use: { ...devices["Desktop Chrome"] },
  projects: [
    {
      name: "check-blazer",
      testMatch: /check-blazer.ts/
    },
    {
      name: "check-washing-machine",
      testMatch: /check-washing-machine.ts/
    }
  ]
})
