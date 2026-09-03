import { Locator, Page } from '@playwright/test';
import { SidebarMenuType } from '@constants/navigation';

/**
 * SidebarComponent
 * Encapsulates the left navigation menu present across all authenticated OrangeHRM screens.
 */
export class SidebarComponent {
  readonly root: Locator;
  readonly searchInput: Locator;
  readonly menuItems: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('.oxd-sidepanel');
    this.searchInput = this.root.locator('input[placeholder="Search"]');
    this.menuItems = this.root.locator('.oxd-main-menu-item');
  }

  /**
   * Navigates to a specific module via the sidebar menu
   * @param menuName Name of the menu item (e.g. 'Admin', 'PIM', 'Dashboard')
   */
  async navigateTo(menuName: SidebarMenuType | string): Promise<void> {
    await this.root.waitFor({ state: 'visible' });
    const menuItem = this.root.locator('.oxd-main-menu-item', { hasText: menuName }).first();
    await menuItem.waitFor({ state: 'visible' });
    await menuItem.click();
  }

  /**
   * Filters the sidebar menu using the search bar
   * @param searchTerm Term to search in menu items
   */
  async searchMenu(searchTerm: string): Promise<void> {
    await this.searchInput.waitFor({ state: 'visible' });
    await this.searchInput.fill(searchTerm);
  }

  /**
   * Returns all visible menu item labels
   */
  async getVisibleMenuItems(): Promise<string[]> {
    await this.menuItems.first().waitFor({ state: 'visible' });
    return await this.menuItems.allTextContents();
  }
}
