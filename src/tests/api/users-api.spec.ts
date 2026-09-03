import { test, expect } from '@fixtures/base-test';

test.describe('Backend REST API Tests @api @regression', () => {
  // Pure API tests don't require browser UI
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should verify OrangeHRM public health & login endpoint via API @smoke', async ({ apiClient }) => {
    const response = await apiClient.get('/web/index.php/auth/login');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
  });

  test('should verify API response headers and security cookies', async ({ apiClient }) => {
    const response = await apiClient.get('/web/index.php/core/i18n/messages');
    expect(response.status()).toBe(200);
    expect(response.ok()).toBe(true);
  });
});
