import { Locator, Page } from '@playwright/test';

/**
 * TopBarComponent
 * Encapsulates the top navigation bar present across all authenticated OrangeHRM screens.
 */
export class TopBarComponent {
  readonly root: Locator;
  readonly headerTitle: Locator;
  readonly userDropdown: Locator;
  readonly userDisplayName: Locator;
  readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('.oxd-topbar');
    this.headerTitle = page.locator('.oxd-topbar-header-title');
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.userDisplayName = page.locator('.oxd-userdropdown-name');
    this.logoutLink = page.locator('role=menuitem >> text=Logout');
  }

  /**
   * Retrieves the current topbar header title (e.g. 'Dashboard', 'PIM')
   */
  async getHeaderTitle(): Promise<string> {
    await this.headerTitle.waitFor({ state: 'visible' });
    return (await this.headerTitle.textContent())?.trim() ?? '';
  }

  /**
   * Retrieves the logged-in user's profile display name
   */
  async getUserDisplayName(): Promise<string> {
    await this.userDisplayName.waitFor({ state: 'visible' });
    return (await this.userDisplayName.textContent())?.trim() ?? '';
  }

  /**
   * Performs logout action via user dropdown menu
   */
  async logout(): Promise<void> {
    await this.userDropdown.click();
    await this.logoutLink.waitFor({ state: 'visible' });
    await this.logoutLink.click();
    await this.page.waitForURL(/.*\/auth\/login/);
  }
}
