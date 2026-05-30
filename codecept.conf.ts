import { setHeadlessWhen, setCommonPlugins } from "@codeceptjs/configure";
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
// setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

export const config: CodeceptJS.MainConfig = {
  tests: "./tests/*_test.ts",
  output: "./output",
  helpers: {
    Playwright: {
      browser: "chromium",
      channel: "chrome",
      url: "https://www.booking.com/",
      show: true,
      windowSize: "1920x900",
      restart: "context",
    },
  },
  include: {
    I: "./steps_file",
  },
  plugins: {
    htmlReporter: {
      enabled: false,
    },
  },
  name: "Booking_E2E",
};
