import { test, expect } from '../../fixtures/base.fixture';
import { ENV } from '../../utils/env.config';

/**
 * Quick Smoke Login Test — Single happy path for quick CI validation.
 * Covers: Smoke test matching LoginTest.java.
 */
test.describe('Authentication Smoke', () => {
  const VALID_EMAIL = ENV.ADMIN_USERNAME;
  const VALID_PASSWORD = ENV.ADMIN_PASSWORD;

  test.beforeEach(async ({ loginPage }) => {
    await test.step('Pre-condition: Navigate to the login page', async () => {
      await loginPage.navigateToLoginPage();
    });
  });

  test('Quick smoke test — Verify login with valid credentials leads to Dashboard', async ({
    loginPage,
    dashboardPage,
  }) => {
    // Act
    await test.step('Step 1: Perform login with valid credentials', async () => {
      await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
    });

    // Assert
    await test.step('Step 2: Verify that the Dashboard is displayed successfully', async () => {
      expect(await dashboardPage.isDashboardDisplayed(), 'Dashboard should be displayed after successful login').toBe(true);
    });
  });
});
