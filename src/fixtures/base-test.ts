import { test as base, expect } from '@playwright/test';
import { LoginPage } from '@pages/login.page';
import { DashboardPage } from '@pages/dashboard.page';
import { PimPage } from '@pages/pim.page';
import { SidebarComponent } from '@components/sidebar.component';
import { TopBarComponent } from '@components/topbar.component';
import { Logger } from '@utils/logger';

export type TestContext = {
  testTitle: string;
};

/**
 * Custom Playwright Fixtures providing zero-boilerplate access to all Page Objects and Components
 */
export const test = base.extend<{
  testContext: TestContext;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  pimPage: PimPage;
  sidebar: SidebarComponent;
  topbar: TopBarComponent;
}>({
  testContext: [
    async ({}, use, testInfo) => {
      const testTitle = testInfo.title;
      Logger.step(`[TEST START] ${testTitle}`);
      await use({ testTitle });
      Logger.step(`[TEST END] ${testTitle} (${testInfo.status?.toUpperCase() ?? 'COMPLETED'})`);
    },
    { auto: true },
  ],

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  pimPage: async ({ page }, use) => {
    await use(new PimPage(page));
  },

  sidebar: async ({ page }, use) => {
    await use(new SidebarComponent(page));
  },

  topbar: async ({ page }, use) => {
    await use(new TopBarComponent(page));
  },
});

export { expect };
