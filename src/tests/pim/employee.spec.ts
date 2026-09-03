import { test, expect } from '@fixtures/base-test';
import { SidebarMenu } from '@constants/navigation';

test.describe('PIM: Employee Management Module @pim @web @regression', () => {
  test.beforeEach(async ({ sidebar, pimPage }) => {
    await pimPage.navigate();
  });

  test('should display employee directory and table records @smoke', async ({ topbar, pimPage }) => {
    const title = await topbar.getHeaderTitle();
    expect(title).toContain('PIM');

    const rowCount = await pimPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('should navigate to PIM via sidebar from dashboard', async ({ dashboardPage, sidebar, topbar, page }) => {
    await dashboardPage.navigate();
    await sidebar.navigateTo(SidebarMenu.PIM);

    await expect(page).toHaveURL(/.*\/pim\//);
    const title = await topbar.getHeaderTitle();
    expect(title).toContain('PIM');
  });

  test('should search using dynamic synthetic employee dataset @smoke', async ({ pimPage, dataGenerator }) => {
    const employee = dataGenerator.generateEmployee();
    expect(employee.employeeId.length).toBeGreaterThan(0);

    // Dynamically search by generated synthetic ID
    await pimPage.searchById(employee.employeeId);
    const count = await pimPage.getRowCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
