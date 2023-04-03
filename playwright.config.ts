import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  timeout: 30000,
  globalTimeout: 600000,
  name: 'KAKA',
  reporter: [['list'], ['./reporters/slack-reporter.ts']],
  retries: 3,
  testDir: './tests',
  use: {
    video: 'on',
    screenshot: 'on',
    trace: 'on',
    locale: 'no-NB',
    storageState: './state.json', // File for storing cookies and localStorage (per origin). Speeds up test execution, as the test browser no longer needs to log in for every test.
  },
  // https://playwright.dev/docs/test-advanced#global-setup-and-teardown
  globalSetup: require.resolve('./setup/global-setup'),
};

export default config;
