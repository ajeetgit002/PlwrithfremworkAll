import { test, expect } from '@fixtures/base-test';
import { AppConfig } from '@config/app.config';

test.describe('Admin: System User Management @admin @web @regression', () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.navigate();
  });

  test('should display Admin users list and Add user button @smoke', async ({ adminPage }) => {
    await expect(adminPage.addButton).toBeVisible();
    await expect(adminPage.usernameSearchInput).toBeVisible();

    const initialCount = await adminPage.getUserCount();
    expect(initialCount).toBeGreaterThan(0);
  });

  test('should search for default admin user in the system users directory', async ({ adminPage }) => {
    await adminPage.searchUser(AppConfig.credentials.admin.username);
    const count = await adminPage.getUserCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should reset user search filter and restore table list', async ({ adminPage }) => {
    await adminPage.searchUser('NonExistentUser123');
    await adminPage.resetSearch();
    const count = await adminPage.getUserCount();
    expect(count).toBeGreaterThan(0);
  });
});
