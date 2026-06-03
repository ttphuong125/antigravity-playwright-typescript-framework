import { test, expect } from '../../fixtures/base.fixture';

/**
 * M1: Login Form UI Tests — Verify visual elements and form structure.
 * Covers: CRM_LOGIN_TC_001, CRM_LOGIN_TC_002, CRM_LOGIN_TC_003
 */
test.describe('Login Form UI', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();
  });

  test('CRM_LOGIN_TC_001 — Verify trang Login hiển thị đầy đủ các thành phần giao diện', async ({
    loginPage,
  }) => {
    await test.step('Step 1: Verify all visual components on the Login page are displayed correctly', async () => {
      // Assert — Email input field & Login button
      expect(await loginPage.isLoginPageDisplayed(), 'Login page should display email and login button').toBe(true);

      // Assert — Login heading (H1)
      expect(await loginPage.isLoginHeadingDisplayed(), 'Login heading (H1) should be displayed').toBe(true);

      // Assert — Password field
      expect(await loginPage.isPasswordFieldMasked(), 'Password field should exist and be type=password').toBe(true);

      // Assert — Remember Me checkbox
      expect(await loginPage.isRememberMeDisplayed(), 'Remember Me checkbox should be displayed').toBe(true);

      // Assert — Forgot Password link
      expect(await loginPage.isForgotPasswordLinkDisplayed(), 'Forgot Password link should be displayed').toBe(true);
    });
  });

  test('CRM_LOGIN_TC_002 — Verify trường Password hiển thị dạng masked', async ({
    loginPage,
  }) => {
    // Act — Type into password field
    await test.step('Step 1: Enter password text into the Password field', async () => {
      await loginPage.enterPassword('TestPassword123');
    });

    // Assert — Password field type should be "password" (masked)
    await test.step('Step 2: Verify that the password text is masked', async () => {
      expect(await loginPage.isPasswordFieldMasked(), 'Password field should display characters as masked dots (type=password)').toBe(true);
    });
  });

  test('CRM_LOGIN_TC_003 — Verify CSRF token hidden field tồn tại trong form', async ({
    loginPage,
  }) => {
    // Assert — CSRF hidden field exists with non-empty value
    await test.step('Step 1: Verify the presence of the CSRF token hidden field', async () => {
      expect(await loginPage.isCsrfTokenPresent(), 'CSRF token hidden field should exist with a non-empty value').toBe(true);
    });
  });
});
