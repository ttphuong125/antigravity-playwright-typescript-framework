import { test, expect } from '../../fixtures/base.fixture';
import { ENV } from '../../utils/env.config';

/**
 * M5: Security Tests — SQL Injection, XSS, Brute-force, Error message leakage.
 * Covers: CRM_LOGIN_TC_025, CRM_LOGIN_TC_026, CRM_LOGIN_TC_027, CRM_LOGIN_TC_029, CRM_LOGIN_TC_030
 */
test.describe('Security', () => {
  const VALID_EMAIL = ENV.ADMIN_USERNAME;
  const VALID_PASSWORD = ENV.ADMIN_PASSWORD;

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();
  });

  test('CRM_LOGIN_TC_025 — SQL Injection vào trường Email', async ({
    loginPage,
  }) => {
    // Act — Enter SQL injection payload in email field
    await test.step('Step 1: Perform login with SQL Injection payload in Email field', async () => {
      await loginPage.login("' OR 1=1 --", 'anything');
    });

    // Assert — Should NOT login, no SQL error, no 500
    await test.step('Step 2: Verify that authentication is NOT bypassed and no DB details are leaked', async () => {
      const currentUrl = await loginPage.getPageUrl();
      const hasError = await loginPage.isErrorMessageDisplayed();
      expect(currentUrl.includes('/authentication') || hasError, 'SQL Injection should NOT bypass authentication').toBe(true);

      const pageTitle = await loginPage.getTitle();
      expect(pageTitle.includes('500') || pageTitle.toUpperCase().includes('SQL'), `Should NOT show SQL error or 500. Title: ${pageTitle}`).toBe(false);

      // Verify page source does not reveal database structure
      const pageSource = await loginPage.page.content();
      const hasDbKeywords =
        pageSource.includes('SQL syntax') ||
        pageSource.includes('mysql_') ||
        pageSource.includes('pg_') ||
        pageSource.includes('ORA-');
      expect(hasDbKeywords, 'Page should NOT reveal database error details').toBe(false);
    });
  });

  test('CRM_LOGIN_TC_026 — XSS Script Injection vào trường Email', async ({
    loginPage,
  }) => {
    // Act — Enter XSS payload in email field
    await test.step('Step 1: Perform login with XSS script payload in Email field', async () => {
      await loginPage.login("<script>alert('XSS')</script>", VALID_PASSWORD);
    });

    // Assert — Script should NOT execute, no crash
    await test.step('Step 2: Verify that the XSS payload is sanitized and does not execute', async () => {
      const pageTitle = await loginPage.getTitle();
      expect(pageTitle.includes('500') || pageTitle.toLowerCase().includes('error'), `Should NOT show server error. Title: ${pageTitle}`).toBe(false);

      // Verify the script tag is escaped/sanitized in page source
      const pageSource = await loginPage.page.content();
      const rawRendered = pageSource.includes("<script>alert('XSS')</script>") && !pageSource.includes('&lt;script&gt;');
      expect(rawRendered, 'XSS script should be escaped/sanitized, NOT rendered as raw HTML').toBe(false);

      const isStillOnLogin = await loginPage.isStillOnLoginPage();
      const hasError = await loginPage.isErrorMessageDisplayed();
      expect(isStillOnLogin || hasError, 'Should remain on login page or show error message').toBe(true);
    });
  });

  test('CRM_LOGIN_TC_027 — SQL Injection vào trường Password', async ({
    loginPage,
  }) => {
    // Act — Enter SQL injection payload in password field
    await test.step('Step 1: Perform login with SQL Injection payload in Password field', async () => {
      await loginPage.login(VALID_EMAIL, "' OR '1'='1");
    });

    // Assert — Should NOT login successfully
    await test.step('Step 2: Verify that authentication is NOT bypassed by SQL Injection in Password', async () => {
      const isStillOnLogin = await loginPage.isStillOnLoginPage();
      const hasError = await loginPage.isErrorMessageDisplayed();
      expect(isStillOnLogin || hasError, 'SQL Injection in password should NOT bypass authentication').toBe(true);

      if (hasError) {
        expect(await loginPage.errorMessageContains('Invalid email or password'), "Should show 'Invalid email or password', NOT SQL error").toBe(true);
      }

      const pageTitle = await loginPage.getTitle();
      expect(pageTitle.includes('500') || pageTitle.toUpperCase().includes('SQL'), `Should NOT show SQL error or 500. Title: ${pageTitle}`).toBe(false);
    });
  });

  test('CRM_LOGIN_TC_029 — Đăng nhập sai nhiều lần liên tiếp (Brute-force)', async ({
    loginPage,
  }) => {
    let systemCrashed = false;
    let failedAttempts = 0;

    // Act
    await test.step('Step 1: Attempt multiple logins with incorrect passwords (brute-force simulator)', async () => {
      for (let i = 1; i <= 10; i++) {
        const wrongPassword = `SaiPass_${i}`;
        await loginPage.login(VALID_EMAIL, wrongPassword);

        try {
          const pageTitle = await loginPage.getTitle();
          if (pageTitle.includes('500') || pageTitle.toLowerCase().includes('error')) {
            systemCrashed = true;
            break;
          }

          if (await loginPage.isErrorMessageDisplayed()) {
            failedAttempts++;
          }

          const pageSource = await loginPage.page.content();
          if (pageSource.includes('locked') || pageSource.includes('blocked') || pageSource.includes('too many')) {
            break;
          }

          if (i < 10) {
            await loginPage.navigateToLoginPage();
          }
        } catch (e) {
          // Ignored
        }
      }
    });

    // Assert — System should NOT crash
    await test.step('Step 2: Verify system stability after brute-force simulator', async () => {
      expect(systemCrashed, 'System should NOT crash or show 500 error after multiple failed attempts').toBe(false);
      expect(failedAttempts > 0, 'At least some attempts should show error messages').toBe(true);
    });
  });

  test('CRM_LOGIN_TC_030 — Thông báo lỗi không tiết lộ email tồn tại hay không', async ({
    loginPage,
  }) => {
    let errorWithExistingEmail = '';
    let errorWithNonExistingEmail = '';

    // Step 1 — Login with existing email + wrong password
    await test.step('Step 1: Login with an existing email and incorrect password', async () => {
      await loginPage.login(VALID_EMAIL, 'WrongP@ss1');
      expect(await loginPage.isErrorMessageDisplayed(), 'Error message should be displayed for existing email + wrong password').toBe(true);
      errorWithExistingEmail = await loginPage.getErrorMessage();
    });

    // Navigate back to login
    await test.step('Step 2: Navigate back to the login page', async () => {
      await loginPage.navigateToLoginPage();
    });

    // Step 3 — Login with non-existing email + same wrong password
    await test.step('Step 3: Login with a non-existing email and incorrect password', async () => {
      const nonExistentEmail = `khongtontai_${Date.now()}@example.com`;
      await loginPage.login(nonExistentEmail, 'WrongP@ss1');
      expect(await loginPage.isErrorMessageDisplayed(), 'Error message should be displayed for non-existing email').toBe(true);
      errorWithNonExistingEmail = await loginPage.getErrorMessage();
    });

    // Assert — Both error messages should be IDENTICAL
    await test.step('Step 4: Verify both error messages are identical to protect account existence privacy', async () => {
      expect(errorWithExistingEmail).toBe(errorWithNonExistingEmail);
    });
  });
});
