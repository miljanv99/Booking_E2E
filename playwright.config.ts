import { defineConfig } from "@playwright/test";

export default defineConfig({
  timeout: 120000, // test timeout

  expect: {
    timeout: 10000,
  },

  use: {
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },
});
