import { defineConfig, devices } from '@playwright/test';

/**
 * Central Playwright configuration.
 *
 * Design decisions worth calling out for a reviewer:
 *  - `baseURL` is read from the environment so the same suite can point at
 *    different deployments without code changes (.env drives local runs, CI env
 *    vars drive pipeline runs).
 *  - Retries and workers differ between CI and local so the suite is fast when
 *    iterating but resilient against flakiness in the pipeline.
 *  - Traces/screenshots/video are captured only on failure — enough to debug a
 *    red build, cheap enough not to slow the green path.
 *  - Three projects (Chromium, Firefox, WebKit) give real cross-browser
 *    coverage; CI shards across them in parallel.
 */

const BASE_URL = process.env.BASE_URL ?? 'https://www.saucedemo.com';

export default defineConfig({
  testDir: './tests',
  // Fail the build on CI if someone accidentally commits `test.only`.
  forbidOnly: !!process.env.CI,
  // Run tests within a file in parallel.
  fullyParallel: true,
  // Retry only on CI, where transient network/render hiccups are more likely.
  retries: process.env.CI ? 2 : 0,
  // Cap workers on CI for stable, reproducible timing; use all cores locally.
  workers: process.env.CI ? 2 : undefined,
  // Global assertion/navigation timeouts — generous but not infinite.
  timeout: 30_000,
  expect: { timeout: 7_000 },

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    // GitHub annotations so failures show up inline on the PR.
    ...(process.env.CI ? [['github'] as const] : []),
  ],

  use: {
    baseURL: BASE_URL,
    // SauceDemo ships stable `data-test` hooks; prefer them over brittle CSS.
    // Role-based locators are still used wherever the a11y tree exposes them.
    testIdAttribute: 'data-test',
    // Diagnostics captured only when something goes wrong.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Reasonable action/navigation timeouts; auto-waiting handles the rest.
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
