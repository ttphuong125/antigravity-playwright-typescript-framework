import { test, expect } from '../fixtures/base.fixture';
import { ENV } from '../utils/env.config';
import * as path from 'path';

test.describe('Customers List Verification', () => {
  // Cấu hình retry tối đa 3 lần cụ thể cho test suite này
  test.describe.configure({ retries: 3 });

  const USERNAME = ENV.ADMIN_USERNAME || 'admin@example.com';
  const PASSWORD = ENV.ADMIN_PASSWORD || '123456';

  test('Verify customer list has at least one record and save screenshot to workspace root', async ({
    loginPage,
    dashboardPage,
    customersPage,
    page
  }) => {
    console.log(`[TEST LOG] Bắt đầu test case: Đăng nhập và xác minh danh sách khách hàng.`);
    
    // 1. Mở trang đăng nhập
    await test.step('Step 1: Navigate to the CRM login page', async () => {
      console.log(`[TEST LOG] 1. Điều hướng đến trang đăng nhập: ${ENV.BASE_URL}/admin/authentication`);
      await loginPage.navigateToLoginPage();
      await expect(page).toHaveURL(/.*authentication/);
    });

    // 2. Đăng nhập với username và password
    await test.step('Step 2: Log in with admin credentials', async () => {
      console.log(`[TEST LOG] 2. Thực hiện đăng nhập với tài khoản: ${USERNAME}`);
      await loginPage.login(USERNAME, PASSWORD);
      await dashboardPage.expectDashboardDisplayed();
      console.log(`[TEST LOG] Đăng nhập thành công, đã hiển thị Dashboard.`);
    });

    // 3. Navigate đến Customers
    await test.step('Step 3: Navigate to the Customers menu item', async () => {
      console.log(`[TEST LOG] 3. Điều hướng đến danh mục Customers`);
      await customersPage.navigateToCustomersMenu();
      await expect(page).toHaveURL(/.*clients/);
      console.log(`[TEST LOG] Đã chuyển sang trang Customers.`);
    });

    // 4. Verify bảng danh sách hiển thị ít nhất 1 dòng dữ liệu
    await test.step('Step 4: Verify that the Customers list displays at least one record', async () => {
      console.log(`[TEST LOG] 4. Kiểm tra dữ liệu trong bảng danh sách Khách hàng`);
      const hasData = await customersPage.hasAtLeastOneCustomer();
      expect(hasData, 'Bảng danh sách Customers phải có ít nhất 1 dòng dữ liệu').toBe(true);
      console.log(`[TEST LOG] Xác minh thành công: bảng có dữ liệu hiển thị.`);
    });

    // 5. Chụp screenshot làm bằng chứng, lưu tại thư mục hiện tại đang mở (root của project)
    await test.step('Step 5: Capture a screenshot and save it to the workspace root', async () => {
      const screenshotPath = path.resolve(__dirname, '../../customers_list.png');
      console.log(`[TEST LOG] 5. Chụp screenshot lưu tại: ${screenshotPath}`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`[TEST LOG] Đã chụp và lưu screenshot thành công.`);
    });
  });
});
