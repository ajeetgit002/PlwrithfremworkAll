import { test, expect } from '@fixtures/base-test';
import { SidebarMenu } from '@constants/navigation';

test.describe('Dashboard: Core Functionality & Layout', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.navigate();
  });

  test('should display dashboard topbar and widgets', async ({ topbar, dashboardPage }) => {
    const title = await topbar.getHeaderTitle();
    expect(title).toContain('Dashboard');

    const widgetCount = await dashboardPage.getWidgetCount();
    expect(widgetCount).toBeGreaterThan(0);
  });

  test('should navigate to Admin module via sidebar', async ({ sidebar, topbar, page }) => {
    await sidebar.navigateTo(SidebarMenu.ADMIN);

    await expect(page).toHaveURL(/.*\/admin\//);
    const title = await topbar.getHeaderTitle();
    expect(title).toContain('Admin');
  });

  test('should filter sidebar menu items with search box', async ({ sidebar }) => {
    await sidebar.searchMenu('PIM');
    const visibleItems = await sidebar.getVisibleMenuItems();

    expect(visibleItems.some((item) => item.includes('PIM'))).toBeTruthy();
  });
});
