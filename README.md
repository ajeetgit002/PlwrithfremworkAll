# Enterprise Playwright Test Automation Framework

An enterprise-grade, scalable, and maintainable end-to-end test automation framework built with **Playwright**, **TypeScript**, and modern **Senior SDET** architectural design patterns.

---

## 🏗️ Architecture Overview

The framework employs a **Component-Driven Page Object Model (POM)** with clean dependency injection, strongly-typed configuration, and modular test suites:

```text
                               ┌───────────────────────────┐
                               │   Test Suites (tests/*)   │
                               │ auth / dashboard / pim    │
                               └─────────────┬─────────────┘
                                             │ (injects)
                               ▼─────────────┴─────────────▼
                               ┌───────────────────────────┐
                               │    Fixtures (base-test)   │
                               │  Auto Context & Injection │
                               └─────────────┬─────────────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
          ┌───────────────────────────┐               ┌───────────────────────────┐
          │     Pages (pages/*)       │               │ Components (components/*) │
          │  Login, Dashboard, PIM    │◄──────────────┤    TopBar, Sidebar        │
          └────────────┬──────────────┘ (reusable in) └───────────────────────────┘
                       │
                       ▼
          ┌───────────────────────────┐
          │    Core & Config Layer    │
          │ config / constants / data │
          └───────────────────────────┘
```

---

## 🧩 Reusable & Dynamic Core Classes (Deep-Dive)

Every class in this framework is designed to be **dynamic and non-static**, receiving live browser instances and parameters at runtime rather than relying on static or hardcoded logic.

### 1. `BasePage` (`src/pages/base.page.ts`)
The abstract foundation for all Page Objects.
* **Dynamic Capabilities**:
  * Manages the Playwright `Page` instance dynamically passed from test fixtures.
  * Navigates to any dynamic relative endpoint using `goto(path)`.
  * Handles dynamic load-state waiting (`load`, `domcontentloaded`, `networkidle`).
  * Provides dynamic full-page screenshot capturing with custom names.

### 2. `TopBarComponent` (`src/components/topbar.component.ts`)
Reusable UI component encapsulating the global header bar across all authenticated pages.
* **Dynamic Capabilities**:
  * Dynamically reads the current active screen title via `getHeaderTitle()`.
  * Extracts the currently logged-in user profile name at runtime via `getUserDisplayName()`.
  * Manages dynamic user dropdown expansion and logout operations via `logout()`.

### 3. `SidebarComponent` (`src/components/sidebar.component.ts`)
Reusable UI component encapsulating the collapsible left navigation menu panel.
* **Dynamic Capabilities**:
  * `navigateTo(menuName)`: Accepts any module name (`Admin`, `PIM`, `Leave`, `Time`, etc.) dynamically and navigates without needing separate methods per link.
  * `searchMenu(term)`: Performs dynamic real-time filtering in the sidebar search input.
  * `getVisibleMenuItems()`: Dynamically extracts all visible navigation labels currently rendered.

### 4. `LoginPage` (`src/pages/login.page.ts`)
Page Object encapsulating the authentication screen.
* **Dynamic Capabilities**:
  * `login(username, password)`: Accepts arbitrary credentials dynamically.
  * `loginAs(user)`: Accepts strongly-typed user credential objects.
  * `getErrorMessage()`: Dynamically waits for and extracts error alert banner text.
  * Exposes locators as public `readonly` properties for clean assertions in tests.

### 5. `DashboardPage` (`src/pages/dashboard.page.ts`)
Page Object encapsulating dashboard widgets and overview metrics.
* **Dynamic Capabilities**:
  * Integrates `TopBarComponent` and `SidebarComponent` via composition (`this.topbar`, `this.sidebar`).
  * `getWidgetCount()`: Dynamically evaluates the number of widgets and cards rendered for the user.

### 6. `PimPage` (`src/pages/pim.page.ts`)
Page Object encapsulating Employee Management (PIM) directory and search operations.
* **Dynamic Capabilities**:
  * `searchByName(name)`: Dynamically searches for any employee record.
  * `getRowCount()`: Dynamically evaluates the number of rows returned in the employee data table.

### 7. `PlaywrightUtils` (`src/utils/PlaywrightUtils.ts`)
General-purpose dynamic web action and locator utility.
* **Dynamic Capabilities**:
  * `safeClick(locator)`: Automatically scrolls into view and checks visibility before clicking any dynamic locator.
  * `clearAndFill(locator, value)`: Clears and populates input fields dynamically.
  * `waitForApiResponse(pattern)`: Dynamically intercepts and validates network API responses.

### 8. `base-test` Custom Fixture Engine (`src/fixtures/base-test.ts`)
Dynamic dependency injection engine.
* **Dynamic Capabilities**:
  * Instantiates and injects all page objects and shared components on-demand per test worker.
  * Eliminates manual `new PageObject(page)` boilerplate across test files.
  * Automatically logs scenario startup and completion timestamps.

---

## 📁 Directory Structure

```text
src/
├── config/              # Centralized configuration (URLs, Credentials, Timeouts)
│   ├── app.config.ts    # Single unified file to change URL & credentials
│   └── environment.ts
├── constants/           # URL Routes and Navigation string enums
│   ├── routes.ts
│   └── navigation.ts
├── components/          # Reusable shared UI widgets (Sidebar, TopBar, Modals, Tables)
│   ├── sidebar.component.ts
│   └── topbar.component.ts
├── pages/               # Feature Page Objects inheriting from BasePage
│   ├── base.page.ts
│   ├── login.page.ts
│   ├── dashboard.page.ts
│   └── pim.page.ts
├── test-data/           # Strongly-typed test datasets and user factories
│   └── users.data.ts
├── fixtures/            # Custom Playwright fixtures for zero-boilerplate tests
│   └── base-test.ts
├── utils/               # Structured Logger, Safe WebActions, and Helpers
│   ├── logger.ts
│   └── PlaywrightUtils.ts
├── tests/               # Feature-organized test suites
│   ├── auth.setup.ts    # Official Playwright Project Dependency auth setup
│   ├── auth/            # Login and session verification specs
│   ├── dashboard/       # Dashboard layout and navigation specs
│   └── pim/             # Employee management module specs
└── playwright.config.ts # Playwright project dependency config
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run All Tests
```bash
npm test
```

### 3. Run Specific Feature Suite
```bash
# Run Authentication tests
npx playwright test src/tests/auth

# Run Dashboard tests
npx playwright test src/tests/dashboard

# Run PIM Employee tests
npx playwright test src/tests/pim
```

### 4. Interactive Debugging & UI Modes
```bash
# Run tests with interactive Playwright UI
npm run test:ui

# Run tests in headed browser mode
npm run test:headed

# Run tests in Playwright step-by-step debugger
npm run test:debug
```

### 5. View Test Report
```bash
npm run report
```

---

## 🧑‍💻 How to Extend the Framework

### 1. How to Add a New Page Object
Create a new file in `src/pages/` inheriting from `BasePage`:

```typescript
// src/pages/admin.page.ts
import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { TopBarComponent } from '@components/topbar.component';
import { SidebarComponent } from '@components/sidebar.component';
import { Routes } from '@constants/routes';

export class AdminPage extends BasePage {
  readonly topbar: TopBarComponent;
  readonly sidebar: SidebarComponent;
  readonly addUserButton: Locator;

  constructor(page: Page) {
    super(page);
    this.topbar = new TopBarComponent(page);
    this.sidebar = new SidebarComponent(page);
    this.addUserButton = page.locator('button:has-text("Add")');
  }

  async navigate(): Promise<void> {
    await this.goto(Routes.ADMIN.VIEW_SYSTEM_USERS);
  }
}
```

### 2. How to Expose the Page in Fixtures
Add the new page to `src/fixtures/base-test.ts`:

```typescript
export const test = base.extend<{
  adminPage: AdminPage;
  // other pages...
}>({
  adminPage: async ({ page }, use) => {
    await use(new AdminPage(page));
  },
});
```

### 3. How to Write a Test
Create a spec file in `src/tests/<module>/` importing from `@fixtures/base-test`:

```typescript
// src/tests/admin/users.spec.ts
import { test, expect } from '@fixtures/base-test';
import { SidebarMenu } from '@constants/navigation';

test.describe('Admin: System User Management', () => {
  test('should navigate to Admin users list and display Add button', async ({ adminPage, sidebar, topbar }) => {
    await adminPage.navigate();
    await expect(topbar.headerTitle).toHaveText('Admin');
    await expect(adminPage.addUserButton).toBeVisible();
  });
});
```

---

## 🎯 Best Practices for the Team

1. **No Hardcoded Locators in Tests**: All locators belong in `pages/` or `components/`.
2. **No Magic Strings**: All routes belong in `@constants/routes.ts`, and test users belong in `@test-data/users.data.ts`.
3. **Use Shared Components**: Never re-implement Sidebar or TopBar locators inside individual pages; reuse `@components/`.
4. **Session-Aware Testing**:
   - Tests requiring logged-in state automatically use the persistent session.
   - Tests verifying the login page itself (negative login, field validation) reset state via:
     ```typescript
     test.use({ storageState: { cookies: [], origins: [] } });
     ```
5. **Path Aliases**: Use configured TypeScript aliases (`@pages/*`, `@components/*`, `@config/*`, `@fixtures/*`, `@test-data/*`) instead of long relative paths like `../../../`.

---

## ⚙️ Managing URLs & Credentials in a Single File

All application URLs, login credentials, and global execution timeouts are centralized in one single file: [`src/config/app.config.ts`](file:///c:/Users/ajeet.yadav/OneDrive%20-%20In2IT%20Technologies%20Pvt%20Ltd/Desktop/AUto_Suit/src/config/app.config.ts).

To change your target application URL or update login credentials, edit [`src/config/app.config.ts`](file:///c:/Users/ajeet.yadav/OneDrive%20-%20In2IT%20Technologies%20Pvt%20Ltd/Desktop/AUto_Suit/src/config/app.config.ts):

```typescript
export const AppConfig = {
  // 1. Change your application URL here:
  baseURL: process.env.BASE_URL ?? 'https://opensource-demo.orangehrmlive.com',

  // 2. Change your login credentials here:
  credentials: {
    admin: {
      username: process.env.ADMIN_USER ?? 'Admin',
      password: process.env.ADMIN_PASSWORD ?? 'admin123',
    },
    invalidUser: {
      username: 'InvalidUser',
      password: 'wrongPassword123',
    },
  },

  // 3. Change execution timeouts here:
  timeouts: {
    test: 45000,
    action: 15000,
    pageLoad: 30000,
  },
};
```

You can also override these on the fly using environment variables in terminal or CI/CD pipelines:
```bash
# Windows PowerShell
$env:BASE_URL="https://your-staging-url.com"; $env:ADMIN_USER="MyUser"; $env:ADMIN_PASSWORD="MyPassword"; npm test
```

