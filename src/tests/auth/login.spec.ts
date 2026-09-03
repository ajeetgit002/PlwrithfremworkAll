import { test, expect } from '@fixtures/base-test';
import { TestUsers } from '@test-data/users.data';

test.describe('Authentication: Login Feature', () => {
  // Use a clean browser context (no pre-saved session) for login page tests
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('should display login form elements correctly', async ({ loginPage }) => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
  });

  test('should display error message when logging in with invalid credentials', async ({ loginPage }) => {
    await loginPage.loginAs(TestUsers.INVALID_USER);

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe('Invalid credentials');
  });

  test('should authenticate successfully with valid admin credentials', async ({ loginPage, page }) => {
    await loginPage.loginAs(TestUsers.ADMIN);
    await expect(page).toHaveURL(/.*\/dashboard\/index/);
  });
});
