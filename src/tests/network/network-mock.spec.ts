import { test, expect } from '@fixtures/base-test';

test.describe('Network Mocking & Fault Injection @network @regression', () => {
  test('should gracefully intercept API and inject custom mocked response @smoke', async ({ page, networkMocker, dashboardPage }) => {
    // Intercept dashboard shortcuts/metrics API
    await networkMocker.mockResponse(/.*\/api\/v2\/dashboard\/shortcuts.*/, 200, {
      data: [{ id: 1, name: 'Custom Mocked Quick Launch' }],
    });

    await dashboardPage.navigate();
    const title = await dashboardPage.topbar.getHeaderTitle();
    expect(title).toContain('Dashboard');

    await networkMocker.unmockAll();
  });

  test('should simulate 500 server error on API and verify page resilience', async ({ page, networkMocker, pimPage }) => {
    // Inject 500 error on employee count / search endpoint
    await networkMocker.mockServerError(/.*\/api\/v2\/pim\/employees.*/, 'Simulated Backend Outage');

    await pimPage.navigate();
    const title = await pimPage.topbar.getHeaderTitle();
    expect(title).toContain('PIM');

    await networkMocker.unmockAll();
  });
});
