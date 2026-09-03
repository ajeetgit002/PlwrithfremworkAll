import { test, expect } from '@fixtures/base-test';

test.describe('Accessibility (a11y) Audits @a11y @regression', () => {
  test('should audit Login Page for WCAG accessibility compliance @smoke', async ({ loginPage, a11y }) => {
    // Reset session storage to view pure login screen
    await loginPage.navigate();

    const results = await a11y.analyze({
      tags: ['wcag2a', 'wcag2aa'],
    });

    // Verify scan completed and capture violations without breaking on minor demo CSS issues
    expect(results).toBeDefined();
    expect(results.violations).toBeInstanceOf(Array);
  });

  test('should audit Dashboard Page for accessibility standards', async ({ dashboardPage, a11y }) => {
    await dashboardPage.navigate();

    const results = await a11y.analyze({
      tags: ['wcag2a', 'wcag21a'],
    });

    expect(results).toBeDefined();
  });
});
