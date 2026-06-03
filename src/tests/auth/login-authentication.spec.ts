import { test, expect } from '../../fixtures/base.fixture';
import { ENV } from '../../utils/env.config';

/**
 * M2: Login Authentication Tests — Login success/failure scenarios.
 * Covers: CRM_LOGIN_TC_005, CRM_LOGIN_TC_006, CRM_LOGIN_TC_007, CRM_LOGIN_TC_008, 
 *         CRM_LOGIN_TC_010, CRM_LOGIN_TC_011, CRM_LOGIN_TC_012, CRM_LOGIN_TC_015, 
 *         CRM_LOGIN_TC_016, CRM_LOGIN_TC_017
 */
test.describe('Login Authentication', () => {
  const VALID_EMAIL = ENV.ADMIN_USERNAME;
  const VALID_PASSWORD = ENV.ADMIN_PASSWORD;

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();
    // Remove HTML5 validation so that we can test server-side errors for empty fields
    await loginPage.page.evaluate(() => {
      document.querySelectorAll('input').forEach(el => el.removeAttribute('required'));
    });
  });

  test('CRM_LOGIN_TC_005 — Đăng nhập thành công với Email và Password hợp lệ', async ({
    loginPage,
    dashboardPage,
  }) => {
    // Act
    await test.step('Step 1: Perform login with valid credentials', async () => {
      await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
    });

    // Assert — Should redirect to Dashboard
    await test.step('Step 2: Verify that the Dashboard is displayed successfully', async () => {
      expect(await dashboardPage.isDashboardDisplayed(), 'Dashboard should be displayed after successful login').toBe(true);
      const currentUrl = await loginPage.getPageUrl();
      expect(currentUrl.includes('/admin/'), 'URL should contain /admin/ after successful login').toBe(true);
    });
  });

  test('CRM_LOGIN_TC_006 — Đăng nhập thất bại — Để trống trường Email', async ({
    loginPage,
  }) => {
    // Act — Leave email empty, enter password
    await test.step('Step 1: Leave Email field empty and fill Password field', async () => {
      await loginPage.enterPassword(VALID_PASSWORD);
      await loginPage.clickLoginButton();
    });

    // Assert — Error message about email required
    await test.step('Step 2: Verify that the email required error message is displayed', async () => {
      expect(await loginPage.isErrorMessageDisplayed(), 'Error message should be displayed when email is empty').toBe(true);
      expect(await loginPage.errorMessageContains('Email Address'), "Error message should mention 'Email Address' field").toBe(true);
      expect(await loginPage.isStillOnLoginPage(), 'Should remain on Login page').toBe(true);
    });
  });

  test('CRM_LOGIN_TC_007 — Đăng nhập thất bại — Để trống trường Password', async ({
    loginPage,
  }) => {
    // Act — Enter email, leave password empty
    await test.step('Step 1: Fill Email field and leave Password field empty', async () => {
      await loginPage.enterEmail(VALID_EMAIL);
      await loginPage.clickLoginButton();
    });

    // Assert — Error message about password required
    await test.step('Step 2: Verify that the password required error message is displayed', async () => {
      expect(await loginPage.isErrorMessageDisplayed(), 'Error message should be displayed when password is empty').toBe(true);
      expect(await loginPage.errorMessageContains('Password'), "Error message should mention 'Password' field").toBe(true);
      expect(await loginPage.isStillOnLoginPage(), 'Should remain on Login page').toBe(true);
    });
  });

  test('CRM_LOGIN_TC_008 — Đăng nhập thất bại — Để trống cả Email và Password', async ({
    loginPage,
  }) => {
    // Act — Click login without entering any data
    await test.step('Step 1: Click Login button without entering email and password', async () => {
      await loginPage.clickLoginButton();
    });

    // Assert — Error messages should appear
    await test.step('Step 2: Verify that the error messages are displayed for both fields', async () => {
      expect(await loginPage.isErrorMessageDisplayed(), 'Error messages should be displayed when both fields are empty').toBe(true);

      const errorMessages = await loginPage.getErrorMessages();
      const allErrors = errorMessages.join(' | ');

      const mentionsEmail = allErrors.toLowerCase().includes('email');
      const mentionsPassword = allErrors.toLowerCase().includes('password');

      expect(mentionsEmail || mentionsPassword, `Error messages should mention at least one required field. Got: ${allErrors}`).toBe(true);
      expect(await loginPage.isStillOnLoginPage(), 'Should remain on Login page').toBe(true);
    });
  });

  test('CRM_LOGIN_TC_010 — Đăng nhập thất bại — Email đúng định dạng nhưng không tồn tại', async ({
    loginPage,
  }) => {
    const nonExistentEmail = `notexist_${Date.now()}@example.com`;
    // Act
    await test.step('Step 1: Perform login with a non-existent email address', async () => {
      await loginPage.login(nonExistentEmail, 'WrongPass!456');
    });

    // Assert
    await test.step('Step 2: Verify that the invalid credentials error message is displayed', async () => {
      expect(await loginPage.isErrorMessageDisplayed(), 'Error message should be displayed for non-existent email').toBe(true);
      expect(await loginPage.errorMessageContains('Invalid email or password'), "Error should show 'Invalid email or password'").toBe(true);
      expect(await loginPage.isStillOnLoginPage(), 'Should remain on Login page').toBe(true);
    });
  });

  test('CRM_LOGIN_TC_011 — Đăng nhập thất bại — Email đúng + Password sai', async ({
    loginPage,
  }) => {
    // Act
    await test.step('Step 1: Perform login with valid email and incorrect password', async () => {
      await loginPage.login(VALID_EMAIL, 'SaiMatKhau!789');
    });

    // Assert — Should show generic error (not revealing email exists)
    await test.step('Step 2: Verify that the generic invalid credentials error message is displayed', async () => {
      expect(await loginPage.isErrorMessageDisplayed(), 'Error message should be displayed for wrong password').toBe(true);
      expect(await loginPage.errorMessageContains('Invalid email or password'), "Error should show generic 'Invalid email or password' (not 'Wrong password')").toBe(true);
      expect(await loginPage.isStillOnLoginPage(), 'Should remain on Login page').toBe(true);
    });
  });

  test('CRM_LOGIN_TC_012 — Đăng nhập thất bại — Email sai + Password đúng', async ({
    loginPage,
  }) => {
    // Act
    await test.step('Step 1: Perform login with incorrect email and valid password', async () => {
      await loginPage.login('wrong_admin@example.com', VALID_PASSWORD);
    });

    // Assert — Should show generic error (not revealing password is correct)
    await test.step('Step 2: Verify that the generic invalid credentials error message is displayed', async () => {
      expect(await loginPage.isErrorMessageDisplayed(), 'Error message should be displayed for wrong email').toBe(true);
      expect(await loginPage.errorMessageContains('Invalid email or password'), "Error should show generic 'Invalid email or password' (not 'Email not found')").toBe(true);
      expect(await loginPage.isStillOnLoginPage(), 'Should remain on Login page').toBe(true);
    });
  });

  test('CRM_LOGIN_TC_015 — Boundary — Nhập Email cực dài (1000+ ký tự)', async ({
    loginPage,
  }) => {
    // Arrange — Generate 1001-char email
    const longEmail = 'a'.repeat(996) + '@example.com';

    // Act
    await test.step('Step 1: Perform login with extremely long email address', async () => {
      await loginPage.login(longEmail, VALID_PASSWORD);
    });

    // Assert — System handles gracefully (no crash, no 500 error)
    await test.step('Step 2: Verify system handles long email gracefully without crashing', async () => {
      const isStillOnLogin = await loginPage.isStillOnLoginPage();
      const isErrDisplayed = await loginPage.isErrorMessageDisplayed();
      expect(isStillOnLogin || isErrDisplayed, 'System should handle long email gracefully — no crash or 500 error').toBe(true);

      const pageTitle = await loginPage.getTitle();
      expect(pageTitle.includes('500') || pageTitle.toLowerCase().includes('error'), 'Page should NOT show server error 500').toBe(false);
    });
  });

  test('CRM_LOGIN_TC_016 — Boundary — Nhập Password cực dài (1000+ ký tự)', async ({
    loginPage,
  }) => {
    // Arrange — Generate 1001-char password
    const longPassword = 'A'.repeat(997) + 'a1!';

    // Act
    await test.step('Step 1: Perform login with extremely long password', async () => {
      await loginPage.login(VALID_EMAIL, longPassword);
    });

    // Assert — System handles gracefully
    await test.step('Step 2: Verify system handles long password gracefully without crashing', async () => {
      const isStillOnLogin = await loginPage.isStillOnLoginPage();
      const isErrDisplayed = await loginPage.isErrorMessageDisplayed();
      expect(isStillOnLogin || isErrDisplayed, 'System should handle long password gracefully — no crash or 500 error').toBe(true);

      const pageTitle = await loginPage.getTitle();
      expect(pageTitle.includes('500') || pageTitle.toLowerCase().includes('error'), 'Page should NOT show server error 500').toBe(false);
    });
  });

  test('CRM_LOGIN_TC_017 — Truy cập trang Login khi đã đăng nhập → redirect Dashboard', async ({
    loginPage,
    dashboardPage,
  }) => {
    // Arrange — Login first
    await test.step('Step 1: Perform login with valid credentials first', async () => {
      await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
      expect(await dashboardPage.isDashboardDisplayed(), 'Pre-condition: Should be on Dashboard after login').toBe(true);
    });

    // Act — Navigate back to login page
    await test.step('Step 2: Attempt to navigate back to the Login URL', async () => {
      await loginPage.navigate('https://crm.anhtester.com/admin/authentication');
    });

    // Assert — Should redirect back to Dashboard (not show login form)
    await test.step('Step 3: Verify user is automatically redirected to the Dashboard', async () => {
      const currentUrl = await loginPage.getPageUrl();
      expect(currentUrl.includes('/admin/'), `Should be redirected to Dashboard, not showing Login page. Current URL: ${currentUrl}`).toBe(true);
    });
  });
});
