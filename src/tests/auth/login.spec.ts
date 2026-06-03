import { test, expect } from '../../fixtures/base.fixture';

test.describe('Sample Login Spec', () => {
  test('TC_LOGIN_000 — Verification', async ({ loginPage }) => {
    await test.step('Step 1: Navigate to the login page', async () => {
      await loginPage.navigateToLoginPage();
    });
    
    await test.step('Step 2: Verify that the Login page is displayed correctly', async () => {
      expect(await loginPage.isLoginPageDisplayed()).toBe(true);
    });
  });
});
