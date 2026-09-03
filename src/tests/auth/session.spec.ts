import { test, expect } from '@fixtures/base-test';
import { TestUsers } from '@test-data/users.data';

test.describe('Authentication: Session Management', () => {
  test.describe('Persistent Session Verification', () => {
    // Verifies that the global setup storage state allows immediate dashboard access
    test('should maintain active session and allow direct dashboard access', async ({ dashboardPage, topbar }) => {
      await dashboardPage.navigate();

      const headerTitle = await topbar.getHeaderTitle();
      expect(headerTitle).toBe('Dashboard');

      const displayName = await topbar.getUserDisplayName();
      expect(displayName.length).toBeGreaterThan(0);
    });
  });

  test.describe('Logout & Session Teardown', () => {
    // Run logout in an isolated context to avoid invalidating the shared global session cookie on the server
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
