import { type Page, type Locator, expect } from '@playwright/test';
import { Logger } from '../utils/logger';

/**
 * BasePage — Abstract base class for all Page Objects.
 *
 * Provides common UI interaction methods with built-in:
 * - Smart waits (no hard sleeps)
 * - Structured logging for each action
 * - Screenshot on demand
 *
 * All page classes MUST extend this base class.
 */
export abstract class BasePage {
  public readonly page: Page;
  protected readonly logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.logger = Logger.create(this.constructor.name);
  }

  // ─────────────────────────────────────────────
  //  Navigation
  // ─────────────────────────────────────────────

  /**
   * Navigate to a URL path (relative to baseURL).
   * @param path - URL path (e.g., '/login', '/dashboard')
   */
  async navigate(path: string): Promise<void> {
    this.logger.info(`Navigating to: ${path}`);
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Get the current page URL.
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get the current page title.
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  // ─────────────────────────────────────────────
  //  Element Interactions
  // ─────────────────────────────────────────────

  /**
   * Click on an element with auto-waiting.
   * @param locator - Playwright Locator
   */
  async click(locator: Locator): Promise<void> {
    this.logger.info(`Clicking element: ${locator}`);
    await locator.click();
  }

  /**
   * Fill a text input field (clears existing value first).
   * @param locator - Playwright Locator
   * @param text - Text to fill
   */
  async fill(locator: Locator, text: string): Promise<void> {
    this.logger.info(`Filling element: ${locator} with text: "${text}"`);
    await locator.fill(text);
  }

  /**
   * Type text character by character (simulates real user typing).
   * @param locator - Playwright Locator
   * @param text - Text to type
   */
  async typeText(locator: Locator, text: string): Promise<void> {
    this.logger.info(`Typing into element: ${locator}`);
    await locator.pressSequentially(text, { delay: 50 });
  }

  /**
   * Clear an input field.
   * @param locator - Playwright Locator
   */
  async clearInput(locator: Locator): Promise<void> {
    this.logger.info(`Clearing input: ${locator}`);
    await locator.clear();
  }

  /**
   * Select an option from a dropdown by value.
   * @param locator - Playwright Locator for the select element
   * @param value - Option value to select
   */
  async selectByValue(locator: Locator, value: string): Promise<void> {
    this.logger.info(`Selecting value "${value}" from dropdown: ${locator}`);
    await locator.selectOption({ value });
  }

  /**
   * Select an option from a dropdown by visible text.
   * @param locator - Playwright Locator for the select element
   * @param text - Visible option text to select
   */
  async selectByText(locator: Locator, text: string): Promise<void> {
    this.logger.info(`Selecting text "${text}" from dropdown: ${locator}`);
    await locator.selectOption({ label: text });
  }

  /**
   * Check a checkbox or radio button.
   * @param locator - Playwright Locator
   */
  async check(locator: Locator): Promise<void> {
    this.logger.info(`Checking element: ${locator}`);
    await locator.check();
  }

  /**
   * Uncheck a checkbox.
   * @param locator - Playwright Locator
   */
  async uncheck(locator: Locator): Promise<void> {
    this.logger.info(`Unchecking element: ${locator}`);
    await locator.uncheck();
  }

  // ─────────────────────────────────────────────
  //  Element State Queries
  // ─────────────────────────────────────────────

  /**
   * Get text content of an element.
   * @param locator - Playwright Locator
   * @returns Text content or empty string
   */
  async getText(locator: Locator): Promise<string> {
    const text = await locator.textContent();
    return text?.trim() ?? '';
  }

  /**
   * Get input value.
   * @param locator - Playwright Locator
   * @returns Input value
   */
  async getInputValue(locator: Locator): Promise<string> {
    return locator.inputValue();
  }

  /**
   * Get an element's attribute value.
   * @param locator - Playwright Locator
   * @param attribute - Attribute name
   * @returns Attribute value or null
   */
  async getAttribute(locator: Locator, attribute: string): Promise<string | null> {
    return locator.getAttribute(attribute);
  }

  /**
   * Check if an element is visible on the page.
   * @param locator - Playwright Locator
   * @returns true if visible
   */
  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  /**
   * Check if an element is enabled.
   * @param locator - Playwright Locator
   * @returns true if enabled
   */
  async isEnabled(locator: Locator): Promise<boolean> {
    return locator.isEnabled();
  }

  /**
   * Check if a checkbox/radio is checked.
   * @param locator - Playwright Locator
   * @returns true if checked
   */
  async isChecked(locator: Locator): Promise<boolean> {
    return locator.isChecked();
  }

  // ─────────────────────────────────────────────
  //  Assertions (Smart Waits)
  // ─────────────────────────────────────────────

  /**
   * Assert that an element is visible (with auto-waiting).
   * @param locator - Playwright Locator
   * @param message - Custom assertion message
   */
  async expectVisible(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeVisible();
  }

  /**
   * Assert that an element is hidden (with auto-waiting).
   * @param locator - Playwright Locator
   * @param message - Custom assertion message
   */
  async expectHidden(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeHidden();
  }

  /**
   * Assert that an element contains specific text (with auto-waiting).
   * @param locator - Playwright Locator
   * @param text - Expected text content
   * @param message - Custom assertion message
   */
  async expectToContainText(locator: Locator, text: string, message?: string): Promise<void> {
    await expect(locator, message).toContainText(text);
  }

  /**
   * Assert that an element has exact text (with auto-waiting).
   * @param locator - Playwright Locator
   * @param text - Expected exact text
   * @param message - Custom assertion message
   */
  async expectToHaveText(locator: Locator, text: string, message?: string): Promise<void> {
    await expect(locator, message).toHaveText(text);
  }

  /**
   * Assert the current URL contains a path or pattern.
   * @param urlPattern - Expected URL substring or regex
   * @param message - Custom assertion message
   */
  async expectUrl(urlPattern: string | RegExp, message?: string): Promise<void> {
    await expect(this.page, message).toHaveURL(urlPattern);
  }

  // ─────────────────────────────────────────────
  //  Utilities
  // ─────────────────────────────────────────────

  /**
   * Take a screenshot of the current page.
   * @param name - Screenshot filename (without extension)
   * @returns Buffer containing the screenshot
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    this.logger.info(`Taking screenshot: ${name}`);
    return this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: true,
    });
  }

  /**
   * Hover over an element.
   * @param locator - Playwright Locator
   */
  async hover(locator: Locator): Promise<void> {
    this.logger.info(`Hovering over element: ${locator}`);
    await locator.hover();
  }

  /**
   * Press a keyboard key.
   * @param key - Key to press (e.g., 'Enter', 'Tab', 'Escape')
   */
  async pressKey(key: string): Promise<void> {
    this.logger.info(`Pressing key: ${key}`);
    await this.page.keyboard.press(key);
  }

  /**
   * Wait for page to reach a specific load state.
   * @param state - Load state to wait for
   */
  async waitForPageLoad(state: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded'): Promise<void> {
    this.logger.info(`Waiting for page load state: ${state}`);
    await this.page.waitForLoadState(state);
  }

  /**
   * Get the count of elements matching a locator.
   * @param locator - Playwright Locator
   * @returns Number of matching elements
   */
  async getElementCount(locator: Locator): Promise<number> {
    return locator.count();
  }
}
