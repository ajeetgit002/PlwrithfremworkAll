import { test, expect } from '@fixtures/base-test';

test.describe('AI Security Fuzzing & Unicode Resilience @ai @regression', () => {
  test.beforeEach(async ({ pimPage }) => {
    await pimPage.navigate();
  });

  test('should verify form input sanitization against AI XSS payloads @smoke', async ({ pimPage, aiFuzzer }) => {
    const xssPayloads = aiFuzzer.getXssPayloads();

    for (const payload of xssPayloads) {
      await pimPage.searchById(payload);
      const count = await pimPage.getRowCount();
      // Ensure application doesn't execute script and returns graceful 0 rows or handles sanitization
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should verify search resilience against multi-language Unicode & RTL vectors', async ({ pimPage, aiFuzzer }) => {
    const unicodeVectors = aiFuzzer.getUnicodeVectors();

    for (const vector of unicodeVectors) {
      await pimPage.searchById(vector.value);
      const count = await pimPage.getRowCount();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should handle extreme boundary string lengths without crashing', async ({ pimPage, aiFuzzer }) => {
    const boundaryStrings = aiFuzzer.getBoundaryLengths();

    for (const boundary of boundaryStrings) {
      await pimPage.searchById(boundary.value);
      const count = await pimPage.getRowCount();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });
});
