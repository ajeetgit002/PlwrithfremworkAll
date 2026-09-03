import { test, expect } from '@fixtures/base-test';

test.describe('Web Performance & Core Timings @perf @regression', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.navigate();
  });

  test('should verify Dashboard loads within performance budget @smoke', async ({ performance }) => {
    const metrics = await performance.getMetrics();

    // Verify TTFB (Time To First Byte) is captured
    expect(metrics.ttfbMs).toBeGreaterThan(0);

    // Verify DOM Content Loaded occurred
    expect(metrics.domContentLoadedMs).toBeGreaterThan(0);

    // Ensure total page load stays within 30s budget on public demo servers
    expect(metrics.totalPageLoadTimeMs).toBeLessThan(30000);
  });

  test('should measure navigation duration across modules', async ({ sidebar, performance }) => {
    const { durationMs } = await performance.measureDuration('Navigate to PIM', async () => {
      await sidebar.navigateTo('PIM');
    });

    expect(durationMs).toBeGreaterThan(0);
    expect(durationMs).toBeLessThan(20000);
  });
});
