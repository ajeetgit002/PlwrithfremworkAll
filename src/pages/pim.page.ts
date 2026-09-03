import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { TopBarComponent } from '@components/topbar.component';
import { SidebarComponent } from '@components/sidebar.component';
import { Routes } from '@constants/routes';

/**
 * PimPage
 * Page Object encapsulating Employee Management (PIM) directory and employee list actions.
 */
export class PimPage extends BasePage {
  readonly topbar: TopBarComponent;
  readonly sidebar: SidebarComponent;
  readonly employeeNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly addEmployeeButton: Locator;
  readonly tableRows: Locator;
  readonly recordsFoundLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.topbar = new TopBarComponent(page);
    this.sidebar = new SidebarComponent(page);
    this.employeeNameInput = page.locator('.oxd-input-group:has-text("Employee Name") input');
    this.employeeIdInput = page.locator('.oxd-input-group:has-text("Employee Id") input');
    this.searchButton = page.locator('button[type="submit"]:has-text("Search")');
    this.resetButton = page.locator('button[type="button"]:has-text("Reset")');
    this.addEmployeeButton = page.locator('button:has-text("Add")');
    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
    this.recordsFoundLabel = page.locator('.orangehrm-horizontal-padding span');
  }

  /**
   * Navigate directly to PIM employee list
   */
  async navigate(): Promise<void> {
    await this.goto(Routes.PIM.VIEW_EMPLOYEE_LIST);
    await this.waitForPageLoad();
  }

  /**
   * Search for an employee by name
   */
  async searchByName(name: string): Promise<void> {
    await this.employeeNameInput.fill(name);
    await this.searchButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Returns count of matching rows displayed in the employee table
   */
  async getRowCount(): Promise<number> {
    await this.tableRows.first().waitFor({ state: 'visible' });
    return await this.tableRows.count();
  }

  /**
   * Verify if PIM page header is visible
   */
  async isLoaded(): Promise<boolean> {
    const title = await this.topbar.getHeaderTitle();
    return title.includes('PIM');
  }
}
