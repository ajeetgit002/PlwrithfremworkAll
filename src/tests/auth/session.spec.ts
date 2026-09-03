import { test, expect } from '@fixtures/base-test';
import { TestUsers } from '@test-data/users.data';

test.describe('Authentication: Session Management @auth @regression', () => {
  test.describe('Persistent Session Verification', () => {
    test('should maintain active session and allow direct dashboard access @smoke', async ({ dashboardPage, topbar }) => {
      await dashboardPage.navigate();

      const headerTitle = await topbar.getHeaderTitle();
      expect(headerTitle).toBe('Dashboard');

      const displayName = await topbar.getUserDisplayName();
      expect(displayName.length).toBeGreaterThan(0);
    });
  });

  test.describe('Logout & Session Teardown', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should successfully log in and log out with clean redirection', async ({ loginPage, dashboardPage, topbar, page }) => {
      await loginPage.navigate();
      await loginPage.loginAs(TestUsers.ADMIN);
      await page.waitForURL(/.*\/dashboard\/index/);

      await topbar.logout();
      await expect(page).toHaveURL(/.*\/auth\/login/);
    });
  });
});
