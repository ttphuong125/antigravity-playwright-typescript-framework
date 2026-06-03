import { type Page, type Locator, test } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * CustomersPage — Page Object for the Customers module.
 * URL: https://crm.anhtester.com/admin/clients
 */
export class CustomersPage extends BasePage {
  // ─── Locators ───────────────────────────────
  readonly customersMenuLink: Locator;
  readonly customersTable: Locator;
  readonly tableRows: Locator;
  readonly emptyTableMessage: Locator;

  constructor(page: Page) {
    super(page);
    // Menu Customers ở sidebar
    this.customersMenuLink = page.locator('a:has-text("Customers")');
    // Table selector trong DOM
    this.customersTable = page.locator('table#clients');
    // Các dòng dữ liệu trong table
    this.tableRows = page.locator('table#clients tbody tr');
    // Dòng thông báo rỗng khi không có dữ liệu
    this.emptyTableMessage = page.locator('table#clients tbody tr td.dataTables_empty');
  }

  // ─── Actions ───────────────────────────────

  async navigateToCustomersMenu(): Promise<void> {
    await test.step('Click the Customers menu item [Locator: "a:has-text(\'Customers\')"]', async () => {
      this.logger.info('Clicking Customers menu link');
      await this.click(this.customersMenuLink);
      await this.waitForPageLoad();
    });
  }

  // ─── Verifications ──────────────────────────

  /**
   * Verify bảng hiển thị ít nhất 1 dòng dữ liệu hợp lệ.
   * Trả về true nếu có dữ liệu, false nếu bảng trống hoặc không có dòng nào.
   */
  async hasAtLeastOneCustomer(): Promise<boolean> {
    return await test.step('Verify if Customers table has at least one record [Locator: "table#clients tbody tr"]', async () => {
      this.logger.info('Verifying if customers table has data');
      
      // Đợi table xuất hiện
      await this.page.waitForSelector('table#clients', { state: 'visible', timeout: 10000 });
      
      // Đợi kết thúc loading của datatable (nếu có spinner)
      await this.page.waitForSelector('table#clients_processing', { state: 'hidden', timeout: 10000 }).catch(() => {});

      // Kiểm tra dòng trống
      const isEmptyVisible = await this.emptyTableMessage.isVisible();
      if (isEmptyVisible) {
        this.logger.info('Customers table is empty (dataTables_empty is displayed)');
        return false;
      }

      const rowCount = await this.tableRows.count();
      this.logger.info(`Number of rows found in table: ${rowCount}`);
      return rowCount > 0;
    });
  }
}
