import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

const BASE_URL = process.env.BASE_URL || 'https://your-app-url.com';
const DEFAULT_TIMEOUT = Number(process.env.DEFAULT_TIMEOUT) || 30_000;
const NAVIGATION_TIMEOUT = Number(process.env.NAVIGATION_TIMEOUT) || 60_000;
const IS_CI = !!process.env.CI;

export default defineConfig({
  /* Root directory for test files */
  testDir: './src/tests',

  /* Run tests in parallel within a file */
  fullyParallel: true,

  /* Fail the build on CI if test.only is left in the source code */
  forbidOnly: IS_CI,

  /* Retry failed tests — 2 retries on CI, 0 locally */
  retries: IS_CI ? 2 : 0,

  /* Limit parallel workers on CI to avoid resource contention */
  workers: IS_CI ? 1 : undefined,

  /* Reporter configuration — HTML Report */
  reporter: [
    ['html', { open: IS_CI ? 'never' : 'on-failure' }],
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results', detail: false }],
  ],

  /* Global timeout for each test */
  timeout: DEFAULT_TIMEOUT,

  /* Shared settings for all projects */
  use: {
    /* Base URL for navigations — used in page.goto('/path') */
    baseURL: BASE_URL,

    /* Navigation timeout */
    navigationTimeout: NAVIGATION_TIMEOUT,

    /* Action timeout — timeout for each action (click, fill, etc.) */
    actionTimeout: 15_000,

    /* Capture trace on first retry */
    trace: 'on-first-retry',

    /* Capture screenshot on failure */
    screenshot: 'only-on-failure',

    /* Record video on failure */
    video: 'retain-on-failure',

    /* Viewport size — desktop resolution */
    viewport: { width: 1920, height: 1080 },

    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,

    /* Extra HTTP headers */
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Output directory for test artifacts (screenshots, videos, traces) */
  outputDir: './test-results',
});
