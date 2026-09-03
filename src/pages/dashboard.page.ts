import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { TopBarComponent } from '@components/topbar.component';
import { SidebarComponent } from '@components/sidebar.component';
import { Routes } from '@constants/routes';

/**
 * DashboardPage
 * Page Object encapsulating OrangeHRM Dashboard widgets, layout, and embedded navigation components.
 */
export class DashboardPage extends BasePage {
  readonly topbar: TopBarComponent;
  readonly sidebar: SidebarComponent;
  readonly widgets: Locator;
  readonly dashboardContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.topbar = new TopBarComponent(page);
    this.sidebar = new SidebarComponent(page);
    this.widgets = page.locator('.oxd-grid-item, .orangehrm-dashboard-widget');
    this.dashboardContainer = page.locator('.oxd-layout-context');
  }

  /**
   * Navigate directly to Dashboard
   */
  async navigate(): Promise<void> {
    await this.goto(Routes.DASHBOARD.INDEX);
    await this.waitForPageLoad('domcontentloaded');
  }

  /**
   * Check if the dashboard is loaded by verifying the topbar title
   */
  async isLoaded(): Promise<boolean> {
    const title = await this.topbar.getHeaderTitle();
    return title.includes('Dashboard');
  }

  /**
   * Returns count of visible dashboard widgets/cards
   */
  async getWidgetCount(): Promise<number> {
    await this.dashboardContainer.waitFor({ state: 'visible' });
    await this.widgets.first().waitFor({ state: 'visible' });
    return await this.widgets.count();
  }
}
