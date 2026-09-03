import { Page, Response } from '@playwright/test';
import { AppConfig } from '@config/app.config';

/**
 * BasePage
 * Abstract class providing core browser interaction capabilities for all Page Objects.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /**
   * Navigate to a path relative to the configured baseURL
   */
  async goto(path = '/'): Promise<Response | null> {
    return await this.page.goto(path);
  }

  /**
   * Wait for a specific page load lifecycle state
   */
  async waitForPageLoad(state: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded'): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  /**
   * Wait for current URL to match pattern
   */
  async waitForURL(pattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(pattern);
  }

  /**
   * Get the current page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get the current browser URL
   */
  getCurrentURL(): string {
    return this.page.url();
  }

  /**
   * Get the configured Application Name identifier (e.g. TestUM)
   */
  getApplicationName(): string {
    return AppConfig.appName;
  }

  /**
   * Capture a full-page screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: true,
    });
  }
}
