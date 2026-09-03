import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/login.page';
import { DashboardPage } from '@pages/dashboard.page';
import { PimPage } from '@pages/pim.page';
import { AdminPage } from '@pages/admin.page';
import { SidebarComponent } from '@components/sidebar.component';
import { TopBarComponent } from '@components/topbar.component';
import { ApiClient } from '@utils/api-client';
import { Logger } from '@utils/logger';

/**
 * Custom Fixture Type Definitions
 */
export interface CustomFixtures {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  pimPage: PimPage;
  adminPage: AdminPage;
  sidebar: SidebarComponent;
  topbar: TopBarComponent;
  apiClient: ApiClient;
  testContext: void;
}

/**
 * Custom test runner with dependency injection for Page Objects, Components, and Utilities
 */
export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  pimPage: async ({ page }, use) => {
    await use(new PimPage(page));
  },

  adminPage: async ({ page }, use) => {
    await use(new AdminPage(page));
  },

  sidebar: async ({ page }, use) => {
    await use(new SidebarComponent(page));
  },

  topbar: async ({ page }, use) => {
    await use(new TopBarComponent(page));
  },

  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },

  // Auto fixture for scenario execution lifecycle logging
  testContext: [
    async ({}, use, testInfo) => {
      Logger.testStart(testInfo.title);
      await use();
      Logger.testEnd(testInfo.title, testInfo.status === 'passed');
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
