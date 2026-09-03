import { test, expect } from '@fixtures/base-test';

test.describe('Google Gemini GenAI Integration @ai @gemini @regression', () => {
  test('should verify Gemini client configuration & fallback handling @smoke', async ({ gemini }) => {
    // If user has set GEMINI_API_KEY in .env, test live prompt generation
    if (gemini.isConfigured()) {
      const response = await gemini.generateText('Explain the difference between smoke testing and regression testing in 1 short sentence.');
      expect(response.length).toBeGreaterThan(10);
    } else {
      // Graceful fallback when API key is not yet set
      const response = await gemini.generateText('Ping Gemini');
      expect(response).toContain('GEMINI');
    }
  });

  test('should simulate Gemini root-cause failure diagnosis', async ({ gemini }) => {
    const analysis = await gemini.diagnoseTestFailure({
      testName: 'Admin Search User Test',
      pageUrl: 'https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers',
      errorMessage: 'Error: page.waitForResponse: Timeout 15000ms exceeded while waiting for /api/v2/admin/users',
    });

    expect(analysis).toBeDefined();
    expect(analysis.length).toBeGreaterThan(0);
  });
});
