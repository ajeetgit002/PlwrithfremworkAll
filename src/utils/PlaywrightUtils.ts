import { Locator, Page, expect } from '@playwright/test';
import { Logger } from './logger';

/**
 * PlaywrightUtils
 * Comprehensive helper for safe UI actions, waiting, visual snapshots, and assertions.
 */
export class PlaywrightUtils {
  constructor(private readonly page: Page) {}

  /**
   * Safely clicks an element after ensuring scroll position and visibility
   */
  async safeClick(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await expect(locator).toBeVisible();
    await locator.click();
  }

  /**
   * Clears and populates an input field
   */
  async clearAndFill(locator: Locator, value: string): Promise<void> {
    await locator.clear();
    await locator.fill(value);
  }

  /**
   * Safely retrieves text content with trimming
   */
  async getTrimmedText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return (await locator.textContent())?.trim() ?? '';
  }

  /**
   * Waits for a specific API response URL pattern
   */
  async waitForApiResponse(urlPattern: string): Promise<void> {
    await this.page.waitForResponse((response) => response.url().includes(urlPattern) && response.ok());
  }

  /**
   * Perform visual comparison snapshot with custom maxDiffPixelRatio
   */
  async expectVisualSnapshot(snapshotName: string, maxDiffPixelRatio = 0.05): Promise<void> {
    Logger.step(`[VISUAL] Verifying visual snapshot: ${snapshotName}`);
    await expect(this.page).toHaveScreenshot(snapshotName, {
      maxDiffPixelRatio,
      animations: 'disabled',
    });
  }
}