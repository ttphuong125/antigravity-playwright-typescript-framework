import { type Page, type Locator, test } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * ForgotPasswordPage — Page Object for the Perfex CRM Password Recovery page.
 * URL: https://crm.anhtester.com/admin/authentication/forgot_password
 */
export class ForgotPasswordPage extends BasePage {
  // ─── Locators ───────────────────────────────
  readonly emailInput: Locator;
  readonly confirmButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly loginLink: Locator;
  readonly pageHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#email');
    this.confirmButton = page.locator("button[type='submit']");
    this.successMessage = page.locator('div.alert.alert-success');
    this.errorMessage = page.locator('div.alert.alert-danger');
    this.loginLink = page.locator("a[href*='authentication']");
    this.pageHeading = page.locator('h1');
  }

  // ─── Actions ───────────────────────────────

  async enterEmail(email: string): Promise<ForgotPasswordPage> {
    await test.step(`Enter email "${email}" into the Email field [Locator: "#email"]`, async () => {
      await this.fill(this.emailInput, email);
    });
    return this;
  }

  async clickConfirm(): Promise<void> {
    await test.step('Click Confirm button [Locator: "button[type=\'submit\']"]', async () => {
      await this.click(this.confirmButton);
      this.logger.info('Clicked Confirm button on Forgot Password page');
    });
  }

  async submitForgotPassword(email: string): Promise<void> {
    await test.step(`Submit forgot password for email "${email}"`, async () => {
      await this.enterEmail(email);
      await this.clickConfirm();
      this.logger.info(`Forgot password submitted for: ${email}`);
    });
  }

  // ─── Verifications ──────────────────────────

  async isPageDisplayed(): Promise<boolean> {
    return await test.step('Verify Forgot Password page is displayed [Locator: "#email"]', async () => {
      try {
        await this.emailInput.waitFor({ state: 'visible', timeout: 5000 });
        const url = await this.getCurrentUrl();
        return url.includes('forgot_password') && (await this.confirmButton.isVisible());
      } catch (e) {
        return false;
      }
    });
  }

  async isSuccessMessageDisplayed(): Promise<boolean> {
    return await test.step('Verify if success message is displayed [Locator: "div.alert.alert-success"]', async () => {
      return this.successMessage.isVisible();
    });
  }

  async getSuccessMessage(): Promise<string> {
    return await test.step('Get success message [Locator: "div.alert.alert-success"]', async () => {
      return (await this.getText(this.successMessage)).trim();
    });
  }

  async isErrorMessageDisplayed(): Promise<boolean> {
    return await test.step('Verify if error message is displayed [Locator: "div.alert.alert-danger"]', async () => {
      return this.errorMessage.isVisible();
    });
  }

  async getErrorMessage(): Promise<string> {
    return await test.step('Get error message [Locator: "div.alert.alert-danger"]', async () => {
      return (await this.getText(this.errorMessage)).trim();
    });
  }

  async getPageUrl(): Promise<string> {
    return await test.step('Get Forgot Password page URL', async () => {
      return this.getCurrentUrl();
    });
  }
}
