import { test, expect } from '@fixtures/base-test';
import { SidebarMenu } from '@constants/navigation';

test.describe('Admin: System User Management @admin @regression', () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.navigate();
  });

  test('should display Admin users list and Add user button @smoke', async ({ topbar, adminPage }) => {
    const title = await topbar.getHeaderTitle();
    expect(title).toContain('Admin');

    await expect(adminPage.addUserButton).toBeVisible();
    const userCount = await adminPage.getUserCount();
    expect(userCount).toBeGreaterThan(0);
  });

  test('should search for default admin user in the system users directory', async ({ adminPage }) => {
    await adminPage.searchUser('Admin');
    const userCount = await adminPage.getUserCount();
    expect(userCount).toBeGreaterThanOrEqual(1);
  });

  test('should reset user search filter and restore table list', async ({ adminPage }) => {
    await adminPage.searchUser('NonExistingUser_XYZ');
    await adminPage.resetSearch();

    const userCount = await adminPage.getUserCount();
    expect(userCount).toBeGreaterThan(0);
  });
});
