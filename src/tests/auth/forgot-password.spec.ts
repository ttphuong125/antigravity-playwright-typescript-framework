import { test, expect } from '../../fixtures/base.fixture';

/**
 * M3: Forgot Password Tests — Password recovery flow.
 * Covers: CRM_LOGIN_TC_018, CRM_LOGIN_TC_019, CRM_LOGIN_TC_021
 */
test.describe('Forgot Password', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();
  });

  test("CRM_LOGIN_TC_018 — Click 'Forgot Password?' chuyển đến trang khôi phục", async ({
    loginPage,
    forgotPasswordPage,
  }) => {
    // Act — Click Forgot Password link
    await test.step('Step 1: Click the Forgot Password link', async () => {
      await loginPage.clickForgotPasswordLink();
    });

    // Assert — Should navigate to forgot password page
    await test.step('Step 2: Verify that the Forgot Password page is displayed successfully', async () => {
      expect(await forgotPasswordPage.isPageDisplayed(), 'Forgot Password page should be displayed').toBe(true);
      const currentUrl = await forgotPasswordPage.getPageUrl();
      expect(currentUrl.includes('forgot_password'), `URL should contain 'forgot_password'. Current URL: ${currentUrl}`).toBe(true);
    });
  });

  test('CRM_LOGIN_TC_019 — Gửi email khôi phục với email đã đăng ký', async ({
    loginPage,
    forgotPasswordPage,
  }) => {
    // Arrange — Navigate to forgot password page
    await test.step('Step 1: Navigate to the Forgot Password page', async () => {
      await loginPage.clickForgotPasswordLink();
      expect(await forgotPasswordPage.isPageDisplayed(), 'Pre-condition: Should be on Forgot Password page').toBe(true);
    });

    // Act — Submit registered email
    await test.step('Step 2: Submit a registered email address for recovery', async () => {
      await forgotPasswordPage.submitForgotPassword('admin@example.com');
    });

    // Assert — System should handle request without crashing
    await test.step('Step 3: Verify the system response and ensure no crash occurs', async () => {
      const pageTitle = await forgotPasswordPage.getTitle();
      expect(pageTitle.includes('500') || pageTitle.toLowerCase().includes('error'), `System should NOT crash or show 500 error. Title: ${pageTitle}`).toBe(false);

      // Verify we got some response (success OR error OR redirect to authentication)
      const hasSuccess = await forgotPasswordPage.isSuccessMessageDisplayed();
      const hasError = await forgotPasswordPage.isErrorMessageDisplayed();
      const currentUrl = await forgotPasswordPage.getPageUrl();
      const handled = hasSuccess || hasError || currentUrl.includes('/authentication');

      expect(handled, 'System should show a response after submit').toBe(true);
    });
  });

  test('CRM_LOGIN_TC_021 — Nhập email chưa đăng ký trên trang Forgot Password', async ({
    loginPage,
    forgotPasswordPage,
  }) => {
    // Arrange — Navigate to forgot password page
    await test.step('Step 1: Navigate to the Forgot Password page', async () => {
      await loginPage.clickForgotPasswordLink();
      expect(await forgotPasswordPage.isPageDisplayed(), 'Pre-condition: Should be on Forgot Password page').toBe(true);
    });

    // Act — Submit unregistered email
    const unregisteredEmail = `khongtontai_${Date.now()}@example.com`;
    await test.step('Step 2: Submit an unregistered email address for recovery', async () => {
      await forgotPasswordPage.submitForgotPassword(unregisteredEmail);
    });

    // Assert — System should NOT crash
    await test.step('Step 3: Verify system behaves gracefully and does not crash', async () => {
      const pageTitle = await forgotPasswordPage.getTitle();
      expect(pageTitle.includes('500'), 'System should NOT crash or show 500 error').toBe(false);

      // Optional warning if email existence is revealed
      const hasError = await forgotPasswordPage.isErrorMessageDisplayed();
      if (hasError) {
        const errorText = await forgotPasswordPage.getErrorMessage();
        const revealsExistence =
          errorText.toLowerCase().includes('not found') ||
          errorText.toLowerCase().includes('not exist') ||
          errorText.toLowerCase().includes('không tồn tại');

        if (revealsExistence) {
          console.warn(`⚠️ SECURITY RISK: Error message reveals email existence: '${errorText}'`);
        }
      }
    });
  });
});
