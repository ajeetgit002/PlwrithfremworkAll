import { expect, Locator, Page } from "@playwright/test";

export class PlaywrightUtils {
  constructor(private readonly page: Page) {}

  /**
   * Wait for loader to disappear
   */
  async waitForLoaderToDisappear(loader: Locator): Promise<void> {
    await expect(loader).toBeHidden();
  }

  /**
   * Get trimmed text from element
   */
  async getTrimmedText(locator: Locator): Promise<string> {
    return ((await locator.textContent()) ?? "").trim();
  }

  /**
   * Scroll element into view
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Click element after ensuring it is visible
   */
  async safeClick(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await expect(locator).toBeVisible();
    await locator.click();
  }

  /**
   * Fill input after ensuring visibility
   */
  async safeFill(
    locator: Locator,
    value: string
  ): Promise<void> {
    await expect(locator).toBeVisible();
    await locator.fill(value);
  }

  /**
   * Get current page URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Wait for API response
   */
  async waitForApiResponse(urlPattern: string): Promise<void> {
    await this.page.waitForResponse(
      response =>
        response.url().includes(urlPattern) &&
        response.ok()
    );
  }

  /**
   * Wait for page navigation
   */
  async waitForPageUrl(urlPattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(urlPattern);
  }

  /**
   * Refresh page
   */
  async refreshPage(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: true
    });
  }

  /**
   * Clear input and fill new value
   */
  async clearAndFill(
    locator: Locator,
    value: string
  ): Promise<void> {
    await locator.clear();
    await locator.fill(value);
  }
}