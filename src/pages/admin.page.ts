import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { TopBarComponent } from '@components/topbar.component';
import { SidebarComponent } from '@components/sidebar.component';
import { Routes } from '@constants/routes';

/**
 * AdminPage
 * Page Object encapsulating OrangeHRM Admin Module (System User Management).
 */
export class AdminPage extends BasePage {
  readonly topbar: TopBarComponent;
  readonly sidebar: SidebarComponent;
  readonly usernameSearchInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly addUserButton: Locator;
  readonly recordsTable: Locator;
  readonly tableRows: Locator;
  readonly tableBody: Locator;

  constructor(page: Page) {
    super(page);
    this.topbar = new TopBarComponent(page);
    this.sidebar = new SidebarComponent(page);
    this.usernameSearchInput = page.locator('.oxd-input-group:has-text("Username") input');
    this.searchButton = page.locator('button[type="submit"]:has-text("Search")');
    this.resetButton = page.locator('button[type="button"]:has-text("Reset")');
    this.addUserButton = page.locator('button:has-text("Add")');
    this.recordsTable = page.locator('.oxd-table');
    this.tableBody = page.locator('.oxd-table-body');
    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
  }

  /**
   * Navigate directly to the Admin System Users page
   */
  async navigate(): Promise<void> {
    await this.goto(Routes.ADMIN.VIEW_SYSTEM_USERS);
    await this.waitForPageLoad('domcontentloaded');
  }

  /**
   * Search for a system user by username
   */
  async searchUser(username: string): Promise<void> {
    await this.usernameSearchInput.waitFor({ state: 'visible' });
    await this.usernameSearchInput.fill(username);
    await this.searchButton.click();
    await this.waitForPageLoad('domcontentloaded');
  }

  /**
   * Reset the search form filter
   */
  async resetSearch(): Promise<void> {
    await this.resetButton.waitFor({ state: 'visible' });
    await this.resetButton.click();
    await this.waitForPageLoad('domcontentloaded');
  }

  /**
   * Returns count of user records displayed in the table (resilient against empty states)
   */
  async getUserCount(): Promise<number> {
    await this.tableBody.waitFor({ state: 'visible' });
    await this.tableRows.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    return await this.tableRows.count();
  }
}
