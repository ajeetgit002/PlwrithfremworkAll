import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '@pages/login.page';
import { TestUsers } from '@test-data/users.data';
import { Routes } from '@constants/routes';

const authFile = 'playwright/.auth/user.json';

/**
 * Authentication Setup Project
 * Official Playwright standard for pre-authenticating sessions.
 * Automatically runs before all test suites that declare dependency on 'setup'.
 */
setup('authenticate as admin', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.loginAs(TestUsers.ADMIN);
  await page.waitForURL(new RegExp(Routes.DASHBOARD.INDEX));

  // Verify successful authentication before saving state
  await expect(page).toHaveURL(/.*\/dashboard\/index/);

  // Save authenticated state for all dependent test suites
  await page.context().storageState({ path: authFile });
});
