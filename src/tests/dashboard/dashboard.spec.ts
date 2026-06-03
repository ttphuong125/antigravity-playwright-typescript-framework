import { test, expect } from '../../fixtures/base.fixture';
import { ENV } from '../../utils/env.config';

test.describe('Dashboard Feature', () => {
  test('TC_DASHBOARD_001 — Dashboard page should load after successful login', async ({
    loginPage,
    dashboardPage,
  }) => {
    await test.step('Step 1: Perform login with valid admin credentials', async () => {
      await loginPage.navigateToLoginPage();
      await loginPage.login(ENV.ADMIN_USERNAME, ENV.ADMIN_PASSWORD);
    });
    
    // Assert
    await test.step('Step 2: Verify that the Dashboard page elements are loaded successfully', async () => {
      expect(await dashboardPage.isDashboardDisplayed()).toBe(true);
    });
  });
});
