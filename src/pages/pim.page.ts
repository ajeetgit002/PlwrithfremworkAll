import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { TopBarComponent } from '@components/topbar.component';
import { SidebarComponent } from '@components/sidebar.component';
import { Routes } from '@constants/routes';

/**
 * PimPage
 * Page Object encapsulating Employee Management (PIM) directory and search operations.
 */
export class PimPage extends BasePage {
  readonly topbar: TopBarComponent;
  readonly sidebar: SidebarComponent;
  readonly employeeNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly tableContainer: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    super(page);
    this.topbar = new TopBarComponent(page);
    this.sidebar = new SidebarComponent(page);
    this.employeeNameInput = page.locator('.oxd-input-group:has-text("Employee Name") input');
    this.employeeIdInput = page.locator('.oxd-input-group:has-text("Employee Id") input');
    this.searchButton = page.locator('button[type="submit"]:has-text("Search")');
    this.resetButton = page.locator('button[type="button"]:has-text("Reset")');
    this.tableContainer = page.locator('.oxd-table');
    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
  }

  /**
   * Navigate directly to the PIM Employee List page
   */
  async navigate(): Promise<void> {
    await this.goto(Routes.PIM.VIEW_EMPLOYEE_LIST);
    await this.waitForPageLoad('domcontentloaded');
  }

  /**
   * Search for employee records by ID
   */
  async searchById(id: string): Promise<void> {
    await this.employeeIdInput.waitFor({ state: 'visible' });
    await this.employeeIdInput.fill(id);
    await this.searchButton.click();
    await this.waitForPageLoad('domcontentloaded');
  }

  /**
   * Search for employee records by name
   */
  async searchByName(name: string): Promise<void> {
    await this.employeeNameInput.waitFor({ state: 'visible' });
    await this.employeeNameInput.fill(name);
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
   * Returns count of employee records displayed in the table (resilient against empty states)
   */
  async getRowCount(): Promise<number> {
    await this.tableContainer.waitFor({ state: 'visible' });
    await this.tableRows.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    return await this.tableRows.count();
  }
}
