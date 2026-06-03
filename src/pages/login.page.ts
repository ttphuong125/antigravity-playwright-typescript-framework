import { type Page, type Locator, test } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * LoginPage — Page Object for the Perfex CRM Login page.
 * URL: https://crm.anhtester.com/admin/authentication
 */
export class LoginPage extends BasePage {
  // ─── Locators ───────────────────────────────
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly rememberMeLabel: Locator;
  readonly forgotPasswordLink: Locator;
  readonly loginHeading: Locator;
  readonly csrfTokenField: Locator;
  readonly logoImage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator("button[type='submit']");
    this.errorMessage = page.locator('div.alert.alert-danger');
    this.rememberMeCheckbox = page.locator("input[name='remember'], #remember");
    this.rememberMeLabel = page.locator("label[for='remember'], .checkbox label");
    this.forgotPasswordLink = page.locator("a[href*='forgot_password']");
    this.loginHeading = page.locator('h1');
    this.csrfTokenField = page.locator("input[name='csrf_token_name']");
    this.logoImage = page.locator('.login-heading img, .company-logo img, a.login-heading img');
  }

  // ─── Actions ───────────────────────────────

  async navigateToLoginPage(): Promise<LoginPage> {
    await test.step('Navigate to Login Page [URL: "https://crm.anhtester.com/admin/authentication"]', async () => {
      await this.navigate('https://crm.anhtester.com/admin/authentication');
      await this.waitForPageLoad();
    });
    return this;
  }

  async enterEmail(email: string): Promise<LoginPage> {
    await test.step(`Enter email "${email}" into the Email field [Locator: "#email"]`, async () => {
      await this.fill(this.emailInput, email);
    });
    return this;
  }

  async enterPassword(password: string): Promise<LoginPage> {
    const maskedPassword = password ? '*'.repeat(password.length) : '';
    await test.step(`Enter password "${maskedPassword}" into the Password field [Locator: "#password"]`, async () => {
      await this.fill(this.passwordInput, password);
    });
    return this;
  }

  async clickLoginButton(): Promise<void> {
    await test.step('Click the Login button [Locator: "button[type=\'submit\']"]', async () => {
      await this.click(this.loginButton);
    });
  }

  async checkRememberMe(): Promise<LoginPage> {
    await test.step('Check the Remember Me checkbox [Locator: "input[name=\'remember\'], #remember"]', async () => {
      try {
        const isVisibleCheckbox = await this.rememberMeCheckbox.isVisible();
        if (isVisibleCheckbox) {
          await this.rememberMeCheckbox.check({ force: true });
        } else {
          await this.rememberMeLabel.click();
        }
      } catch (e) {
        await this.rememberMeLabel.click();
      }
      this.logger.info('Remember Me checkbox checked');
    });
    return this;
  }

  async clickForgotPasswordLink(): Promise<void> {
    await test.step('Click the Forgot Password link [Locator: "a[href*=\'forgot_password\']"]', async () => {
      await this.click(this.forgotPasswordLink);
      this.logger.info('Clicked Forgot Password link');
    });
  }

  async login(email: string, password: string): Promise<void> {
    const maskedPassword = password ? '*'.repeat(password.length) : '';
    await test.step(`Perform login with email "${email}" and password "${maskedPassword}"`, async () => {
      await this.enterEmail(email);
      await this.enterPassword(password);
      await this.clickLoginButton();
      this.logger.info(`Login performed for user: ${email}`);
    });
  }

  // ─── Verifications ──────────────────────────

  async isLoginPageDisplayed(): Promise<boolean> {
    return await test.step('Verify Login page is displayed [Locators: "#email", "button[type=\'submit\']"]', async () => {
      return (await this.emailInput.isVisible()) && (await this.loginButton.isVisible());
    });
  }

  async getErrorMessage(): Promise<string> {
    return await test.step('Get error message [Locator: "div.alert.alert-danger"]', async () => {
      if (await this.isErrorMessageDisplayed()) {
        return (await this.errorMessage.first().textContent() ?? '').trim();
      }
      return '';
    });
  }

  async getErrorMessages(): Promise<string[]> {
    return await test.step('Get all error messages [Locator: "div.alert.alert-danger"]', async () => {
      const counts = await this.errorMessage.count();
      const messages: string[] = [];
      for (let i = 0; i < counts; i++) {
        const text = await this.errorMessage.nth(i).textContent();
        if (text) {
          messages.push(text.trim());
        }
      }
      this.logger.info(`Found ${messages.length} error messages`);
      return messages;
    });
  }

  async isErrorMessageDisplayed(): Promise<boolean> {
    return await test.step('Verify if error message is displayed [Locator: "div.alert.alert-danger"]', async () => {
      return (await this.errorMessage.count()) > 0;
    });
  }

  async errorMessageContains(expectedText: string): Promise<boolean> {
    return await test.step(`Verify if error message contains expected text: "${expectedText}"`, async () => {
      try {
        const actualMessage = await this.getErrorMessage();
        const contains = actualMessage.includes(expectedText);
        this.logger.info(`Error message contains '${expectedText}': ${contains}`);
        return contains;
      } catch (e) {
        return false;
      }
    });
  }

  async isPasswordFieldMasked(): Promise<boolean> {
    return await test.step('Verify if Password field is masked [Locator: "#password"]', async () => {
      const inputType = await this.passwordInput.getAttribute('type');
      this.logger.info(`Password field type: ${inputType}`);
      return inputType === 'password';
    });
  }

  async isCsrfTokenPresent(): Promise<boolean> {
    return await test.step('Verify if CSRF Token is present [Locator: "input[name=csrf_token_name]"]', async () => {
      try {
        const value = await this.page.evaluate(() => {
          const el = document.querySelector('input[name=csrf_token_name]') as HTMLInputElement | null;
          return el ? el.value : null;
        });
        const present = value !== null && value !== '';
        this.logger.info(`CSRF token present: ${present}, value length: ${value ? value.length : 0}`);
        return present;
      } catch (e) {
        return false;
      }
    });
  }

  async isLoginHeadingDisplayed(): Promise<boolean> {
    return await test.step('Verify Login heading is displayed [Locator: "h1"]', async () => {
      return this.loginHeading.isVisible();
    });
  }

  async getLoginHeadingText(): Promise<string> {
    return await test.step('Get Login heading text [Locator: "h1"]', async () => {
      return (await this.getText(this.loginHeading)).trim();
    });
  }

  async isLogoDisplayed(): Promise<boolean> {
    return await test.step('Verify Logo is displayed [Locator: ".login-heading img, .company-logo img"]', async () => {
      return this.logoImage.isVisible();
    });
  }

  async isForgotPasswordLinkDisplayed(): Promise<boolean> {
    return await test.step('Verify Forgot Password link is displayed [Locator: "a[href*=\'forgot_password\']"]', async () => {
      return this.forgotPasswordLink.isVisible();
    });
  }

  async isRememberMeDisplayed(): Promise<boolean> {
    return await test.step('Verify Remember Me option is displayed [Locator: "#remember"]', async () => {
      return (await this.rememberMeCheckbox.isVisible()) || (await this.rememberMeLabel.isVisible());
    });
  }

  async getPageUrl(): Promise<string> {
    return await test.step('Get current page URL', async () => {
      return this.getCurrentUrl();
    });
  }

  async isStillOnLoginPage(): Promise<boolean> {
    return await test.step('Verify if still on Login page [URL contains "/authentication"]', async () => {
      const url = await this.getCurrentUrl();
      return url.includes('/authentication');
    });
  }
}
