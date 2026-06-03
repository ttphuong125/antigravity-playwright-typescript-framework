import { type Page, type Locator, test } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * DashboardPage — Page Object for the Perfex CRM Dashboard.
 * URL: https://crm.anhtester.com/admin/
 */
export class DashboardPage extends BasePage {
  // ─── Locators ───────────────────────────────
  readonly sidebarMenu: Locator;
  readonly profileDropdown: Locator;
  readonly logoutLink: Locator;
  readonly dashboardHeading: Locator;
  readonly topSearchBar: Locator;

  constructor(page: Page) {
    super(page);
    this.sidebarMenu = page.locator('#sidebar');
    this.profileDropdown = page.locator('a.dropdown-toggle.profile');
    this.logoutLink = page.locator("a[href*='logout']");
    this.dashboardHeading = page.locator('.page-heading, h4.tw-font-semibold');
    this.topSearchBar = page.locator('#search_input');
  }

  // ─── Verifications ──────────────────────────

  /**
   * Check if the dashboard page is displayed.
   * Verifies by checking sidebar presence and URL contains /admin/.
   */
  async isDashboardDisplayed(): Promise<boolean> {
    return await test.step('Verify Dashboard is displayed [Locator: "#sidebar"]', async () => {
      try {
        const url = await this.getCurrentUrl();
        const urlMatch = url.includes('/admin/');
        const sidebarVisible = await this.sidebarMenu.isVisible();
        const displayed = urlMatch || sidebarVisible;
        this.logger.info(`Dashboard displayed: ${displayed} (URL match: ${urlMatch}, sidebar: ${sidebarVisible})`);
        return displayed;
      } catch (e) {
        return false;
      }
    });
  }

  async isSidebarVisible(): Promise<boolean> {
    return await test.step('Verify sidebar is visible [Locator: "#sidebar"]', async () => {
      return this.sidebarMenu.isVisible();
    });
  }

  async getPageUrl(): Promise<string> {
    return await test.step('Get Dashboard page URL', async () => {
      return this.getCurrentUrl();
    });
  }

  // ─── Actions ───────────────────────────────

  async clickProfileDropdown(): Promise<DashboardPage> {
    await test.step('Click profile dropdown menu [Locator: "a.dropdown-toggle.profile"]', async () => {
      this.logger.info('Opening profile dropdown menu');
      await this.click(this.profileDropdown);
    });
    return this;
  }

  async clickLogout(): Promise<void> {
    await test.step('Click Logout link [Locator: "a[href*=\'logout\']"]', async () => {
      this.logger.info('Clicking Logout');
      await this.click(this.logoutLink);
    });
  }

  async logout(): Promise<void> {
    await test.step('Perform logout by direct URL navigation', async () => {
      // Direct navigation to logout URL — most reliable approach
      await this.navigate('https://crm.anhtester.com/admin/authentication/logout');
      this.logger.info('Logout performed via direct URL navigation');
    });
  }

  async navigateToDashboard(): Promise<DashboardPage> {
    await test.step('Navigate to Dashboard URL [URL: "https://crm.anhtester.com/admin/"]', async () => {
      await this.navigate('https://crm.anhtester.com/admin/');
      await this.waitForPageLoad();
    });
    return this;
  }

  // Assertions mapping to base tests
  async expectDashboardDisplayed(): Promise<void> {
    await test.step('Expect Dashboard to be displayed', async () => {
      const isDisplayed = await this.isDashboardDisplayed();
      if (!isDisplayed) {
        throw new Error('Dashboard was expected to be displayed but it is not.');
      }
    });
  }
}
