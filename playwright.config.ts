import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { AppConfig } from './src/config/app.config';

const authStatePath = path.resolve(process.cwd(), 'playwright/.auth/user.json');

export default defineConfig({
  testDir: './src/tests',
  timeout: AppConfig.timeouts.test,
  expect: {
    timeout: AppConfig.timeouts.action,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 2,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  outputDir: 'test-results/',
  use: {
    baseURL: AppConfig.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
    ignoreHTTPSErrors: true,
  },
  projects: [
    // 1. Setup project executes first and saves session state
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    // 2. Main test suite depends on 'setup' and inherits the saved session
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: authStatePath,
      },
      dependencies: ['setup'],
    },
  ],
});
