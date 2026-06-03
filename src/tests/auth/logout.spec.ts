import { test, expect } from '../../fixtures/base.fixture';
import { ENV } from '../../utils/env.config';

/**
 * M4: Logout Tests — Logout flow and session management.
 * Covers: CRM_LOGIN_TC_023
 */
test.describe('Logout', () => {
  const VALID_EMAIL = ENV.ADMIN_USERNAME;
  const VALID_PASSWORD = ENV.ADMIN_PASSWORD;

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();
  });

  test('CRM_LOGIN_TC_023 — Đăng xuất từ Dashboard → quay về trang Login', async ({
    loginPage,
    dashboardPage,
  }) => {
    // Arrange — Login first
    await test.step('Step 1: Perform login with valid credentials', async () => {
      await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
      expect(await dashboardPage.isDashboardDisplayed(), 'Pre-condition: Should be on Dashboard after login').toBe(true);
    });

    // Act — Perform logout
    await test.step('Step 2: Perform logout from the system', async () => {
      await dashboardPage.logout();
    });

    // Assert — Should redirect to Login page
    await test.step('Step 3: Verify user is redirected back to the Login page', async () => {
      expect(await loginPage.isLoginPageDisplayed(), 'Login page should be displayed after logout').toBe(true);
      const currentUrl = await loginPage.getPageUrl();
      expect(currentUrl.includes('/authentication'), `URL should contain '/authentication' after logout. Current URL: ${currentUrl}`).toBe(true);
    });
  });
});
