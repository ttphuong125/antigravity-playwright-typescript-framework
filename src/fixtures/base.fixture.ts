import { test as base, type Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { ForgotPasswordPage } from '../pages/forgot-password.page';
import { CustomersPage } from '../pages/customers.page';

// Define custom fixture types
type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  forgotPasswordPage: ForgotPasswordPage;
  customersPage: CustomersPage;
};

type CustomFixtures = {
  passedScreenshot: void;
};

/**
 * Extended test object with page object fixtures.
 * Import this instead of @playwright/test in your test files.
 */
export const test = base.extend<PageFixtures & CustomFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  forgotPasswordPage: async ({ page }, use) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);
    await use(forgotPasswordPage);
  },

  customersPage: async ({ page }, use) => {
    const customersPage = new CustomersPage(page);
    await use(customersPage);
  },

  // Auto fixture to capture and attach screenshot at the end of passed tests
  passedScreenshot: [async ({ page }, use, testInfo) => {
    // Run the actual test case
    await use();
    
    // Code executes after the test finishes but still within the test body scope
    if (testInfo.status === 'passed') {
      await base.step('Attach final screenshot for passed test', async () => {
        const screenshot = await page.screenshot({ fullPage: true });
        await testInfo.attach('passed-screenshot', {
          body: screenshot,
          contentType: 'image/png',
        });
      });
    }
  }, { auto: true }],
});

// Re-export expect for convenience
export { expect } from '@playwright/test';
