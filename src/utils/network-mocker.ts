import { Page, Route } from '@playwright/test';
import { Logger } from './logger';

/**
 * NetworkMocker
 * Intercepts HTTP requests to simulate server faults (500), rate limiting (429), or mock data.
 */
export class NetworkMocker {
  constructor(private readonly page: Page) {}

  /**
   * Mock API endpoint with custom status code and payload
   */
  async mockResponse(urlPattern: string | RegExp, status = 200, body: unknown = {}): Promise<void> {
    Logger.step(`[MOCK] Mocking response for ${urlPattern.toString()} with status ${status}`);
    await this.page.route(urlPattern, async (route: Route) => {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: typeof body === 'string' ? body : JSON.stringify(body),
      });
    });
  }

  /**
   * Simulate a 500 Internal Server Error for an endpoint
   */
  async mockServerError(urlPattern: string | RegExp, errorMessage = 'Internal Server Error'): Promise<void> {
    await this.mockResponse(urlPattern, 500, { error: errorMessage, code: 500 });
  }

  /**
   * Simulate network failure (abort request)
   */
  async mockNetworkFailure(urlPattern: string | RegExp, errorCode: 'failed' | 'timedout' | 'connectionreset' = 'failed'): Promise<void> {
    Logger.step(`[MOCK] Aborting network request to ${urlPattern.toString()} (${errorCode})`);
    await this.page.route(urlPattern, async (route: Route) => {
      await route.abort(errorCode);
    });
  }

  /**
   * Clear all active route mocks
   */
  async unmockAll(): Promise<void> {
    await this.page.unrouteAll();
  }
}
