import { test, expect } from '@fixtures/base-test';
import { TestUsers } from '@test-data/users.data';
import { Routes } from '@constants/routes';

test.describe('Authentication: Session Management @auth @web @regression', () => {
  test.describe('Persistent Session Verification', () => {
    test('should maintain active session and allow direct dashboard access @smoke', async ({ dashboardPage, page }) => {
      await dashboardPage.navigate();
      await expect(page).toHaveURL(new RegExp(Routes.DASHBOARD.INDEX));
      const title = await dashboardPage.topbar.getHeaderTitle();
      expect(title).toContain('Dashboard');
    });
  });

  test.describe('Logout & Session Teardown', () => {
    // Isolated session state so logout does not clear shared session
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should successfully log in and log out with clean redirection', async ({ loginPage, topbar, page }) => {
      await loginPage.navigate();
      await loginPage.loginAs(TestUsers.ADMIN);
      await page.waitForURL(/.*\/dashboard\/index/);

      await topbar.logout();
      await page.waitForURL(new RegExp(Routes.AUTH.LOGIN));
      await expect(loginPage.usernameInput).toBeVisible();
    });
  });
});
