import { test as base, type Page, type BrowserContext } from '@playwright/test';
import { ENV } from '../utils/env.config';
import { Logger } from '../utils/logger';

/**
 * Authentication fixture — provides pre-authenticated browser context.
 *
 * This fixture logs in once and reuses the authenticated state across tests
 * that require authentication, significantly reducing test execution time.
 *
 * Usage:
 * ```typescript
 * import { test } from '../fixtures/auth.fixture';
 *
 * test('admin dashboard', async ({ authenticatedPage }) => {
 *   // This page is already logged in
 *   await authenticatedPage.goto('/dashboard');
 * });
 * ```
 */

type AuthFixtures = {
  /** Pre-authenticated Page — already logged in as admin */
  authenticatedPage: Page;
};

const logger = Logger.create('AuthFixture');

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ browser }, use) => {
    logger.info('Creating authenticated browser context');

    // Create a new context
    const context: BrowserContext = await browser.newContext();
    const page: Page = await context.newPage();

    // Perform login
    // REPLACE: Update the login flow to match your application
    await page.goto('/login');
    await page.getByLabel('Username').fill(ENV.ADMIN_USERNAME);
    await page.getByLabel('Password').fill(ENV.ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for successful login (e.g., redirect to dashboard)
    await page.waitForURL(/dashboard/, { timeout: ENV.DEFAULT_TIMEOUT });

    logger.info('Authentication successful — providing authenticated page');
    await use(page);

    // Cleanup
    await context.close();
  },
});

export { expect } from '@playwright/test';
