import { test, expect } from '@fixtures/base-test';
import { TestUsers } from '@test-data/users.data';
import { AppConfig } from '@config/app.config';

test.describe('Authentication: Login Feature @auth @web @regression', () => {
  // Login tests must use an unauthenticated fresh context
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('should display login form elements correctly @smoke', async ({ loginPage }) => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should display error message when logging in with invalid credentials', async ({ loginPage }) => {
    await loginPage.loginAs(TestUsers.INVALID_USER);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid credentials');
  });

  test('should authenticate successfully with valid admin credentials @smoke', async ({ loginPage, page }) => {
    await loginPage.loginAs(TestUsers.ADMIN);
    await page.waitForURL(/.*\/dashboard\/index/);
    await expect(page).toHaveURL(/.*\/dashboard\/index/);
  });
});
