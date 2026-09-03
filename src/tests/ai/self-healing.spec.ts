import { test, expect } from '@fixtures/base-test';
import { TestUsers } from '@test-data/users.data';

test.describe('AI Self-Healing Locators Engine @ai @regression', () => {
  // Use fresh context for login test
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should automatically heal broken username input selector using AI semantic hints @smoke', async ({ page, aiHealer }) => {
    await page.goto('/web/index.php/auth/login');

    // Intentionally pass a broken/obsolete selector: 'input#broken_legacy_username_field'
    const result = await aiHealer.safeFill(
      'input#broken_legacy_username_field',
      TestUsers.ADMIN.username,
      { placeholder: 'Username', name: 'username', label: 'Username' }
    );

    expect(result.healed).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.8);
  });

  test('should automatically heal broken submit button selector using AI visual text matching @smoke', async ({ page, aiHealer }) => {
    await page.goto('/web/index.php/auth/login');

    // Fill username and password with valid selectors
    await page.locator('input[name="username"]').fill(TestUsers.ADMIN.username);
    await page.locator('input[name="password"]').fill(TestUsers.ADMIN.password);

    // Intentionally pass a broken button selector: 'button.outdated-submit-btn-123'
    const result = await aiHealer.safeClick(
      'button.outdated-submit-btn-123',
      { role: 'button', text: 'Login', name: 'Login' }
    );

    expect(result.healed).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.9);

    // Verify successful login after AI self-healing recovery
    await page.waitForURL(/.*\/dashboard\/index/);
    await expect(page).toHaveURL(/.*\/dashboard\/index/);
  });
});
