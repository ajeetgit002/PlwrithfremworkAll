import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/login.page';
import { DashboardPage } from '@pages/dashboard.page';
import { PimPage } from '@pages/pim.page';
import { AdminPage } from '@pages/admin.page';
import { SidebarComponent } from '@components/sidebar.component';
import { TopBarComponent } from '@components/topbar.component';
import { ApiClient } from '@utils/api-client';
import { TestDataGenerator } from '@utils/data-generator';
import { AccessibilityAuditor } from '@utils/accessibility';
import { NetworkMocker } from '@utils/network-mocker';
import { PerformanceAuditor } from '@utils/performance';
import { PlaywrightUtils } from '@utils/PlaywrightUtils';
import { Logger } from '@utils/logger';

/**
 * Custom Fixture Type Definitions
 */
export interface CustomFixtures {
  // Page Objects
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  pimPage: PimPage;
  adminPage: AdminPage;

  // Shared Components
  sidebar: SidebarComponent;
  topbar: TopBarComponent;

  // Advanced Testing Utilities
  apiClient: ApiClient;
  dataGenerator: TestDataGenerator;
  a11y: AccessibilityAuditor;
  networkMocker: NetworkMocker;
  performance: PerformanceAuditor;
  utils: PlaywrightUtils;

  // Auto Fixture
  testContext: void;
}

/**
 * Custom test runner with dependency injection for Pages, Components, and Advanced Testing Engines
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

  dataGenerator: async ({}, use) => {
    await use(new TestDataGenerator());
  },

  a11y: async ({ page }, use) => {
    await use(new AccessibilityAuditor(page));
  },

  networkMocker: async ({ page }, use) => {
    await use(new NetworkMocker(page));
  },

  performance: async ({ page }, use) => {
    await use(new PerformanceAuditor(page));
  },

  utils: async ({ page }, use) => {
    await use(new PlaywrightUtils(page));
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
