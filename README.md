# Enterprise Playwright Test Automation Framework

An enterprise-grade, scalable, and maintainable end-to-end test automation framework built with **Playwright**, **TypeScript**, and modern **Senior SDET** architectural design patterns.

---

## 🏗️ Architecture Overview

The framework employs a **Component-Driven Page Object Model (POM)** with clean dependency injection, strongly-typed configuration, Project Dependency authentication, and modular feature test suites:

```text
                               ┌───────────────────────────┐
                               │   Setup Project (setup)   │
                               │     auth.setup.ts         │
                               └─────────────┬─────────────┘
                                             │ (saves session state)
                                             ▼
                               ┌───────────────────────────┐
                               │ Main Test Suites (chromium)│
                               │ auth / admin / dash / pim │
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
          │ Login, Admin, Dash, PIM   │◄──────────────┤    TopBar, Sidebar        │
          └────────────┬──────────────┘ (reusable in) └───────────────────────────┘
                       │
                       ▼
          ┌───────────────────────────┐
          │    Core & Config Layer    │
          │ app.config / test-data    │
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

### 5. `AdminPage` (`src/pages/admin.page.ts`)
Page Object encapsulating the Admin System User Management module.
* **Dynamic Capabilities**:
  * `searchUser(username)`: Dynamically searches system users by username.
  * `resetSearch()`: Resets filter form and reloads table records.
  * `getUserCount()`: Resiliently returns count of system users matching filter.

### 6. `DashboardPage` (`src/pages/dashboard.page.ts`)
Page Object encapsulating dashboard widgets and overview metrics.
* **Dynamic Capabilities**:
  * Integrates `TopBarComponent` and `SidebarComponent` via composition (`this.topbar`, `this.sidebar`).
  * `getWidgetCount()`: Dynamically evaluates the number of widgets and cards rendered for the user.

### 7. `PimPage` (`src/pages/pim.page.ts`)
Page Object encapsulating Employee Management (PIM) directory and search operations.
* **Dynamic Capabilities**:
  * `searchByName(name)`: Dynamically searches for any employee record.
  * `getRowCount()`: Dynamically evaluates the number of rows returned in the employee data table.

### 8. `ApiClient` (`src/utils/api-client.ts`)
Reusable HTTP client wrapper around Playwright `APIRequestContext`.
* **Dynamic Capabilities**:
  * Provides `get()`, `post()`, `put()`, `delete()` with structured step logging and error handling.
  * Enables fast API-level data seeding, health checks, and response assertions.

### 9. `PlaywrightUtils` (`src/utils/PlaywrightUtils.ts`)
General-purpose dynamic web action and locator utility.
* **Dynamic Capabilities**:
  * `safeClick(locator)`: Automatically scrolls into view and checks visibility before clicking any dynamic locator.
  * `clearAndFill(locator, value)`: Clears and populates input fields dynamically.
  * `waitForApiResponse(pattern)`: Dynamically intercepts and validates network API responses.

### 10. `base-test` Custom Fixture Engine (`src/fixtures/base-test.ts`)
Dynamic dependency injection engine.
* **Dynamic Capabilities**:
  * Instantiates and injects all page objects, components, and `apiClient` on-demand per test worker.
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
│   ├── admin.page.ts
│   ├── dashboard.page.ts
│   └── pim.page.ts
├── test-data/           # Strongly-typed test datasets and user factories
│   └── users.data.ts
├── fixtures/            # Custom Playwright fixtures for zero-boilerplate tests
│   └── base-test.ts
├── utils/               # Structured Logger, Safe WebActions, and ApiClient
│   ├── logger.ts
│   ├── api-client.ts
│   └── PlaywrightUtils.ts
├── tests/               # Feature-organized test suites
│   ├── auth.setup.ts    # Official Playwright Project Dependency auth setup
│   ├── auth/            # Login and session verification specs
│   ├── admin/           # Admin system user management specs
│   ├── dashboard/       # Dashboard layout and navigation specs
│   └── pim/             # Employee management module specs
└── playwright.config.ts # Playwright project dependency config
```

---

## 🚀 Smart Test Runner Commands

Run tests by category, module, or mode using predefined NPM scripts:

```bash
# Run Full Test Suite
npm test

# Run Fast Smoke Test Suite (@smoke tagged tests)
npm run test:smoke

# Run Full Regression Suite (@regression tagged tests)
npm run test:regression

# Run Specific Feature Modules
npm run test:auth       # Run Authentication tests
npm run test:admin      # Run Admin module tests
npm run test:dashboard  # Run Dashboard tests
npm run test:pim        # Run PIM employee tests

# Interactive & Debug Modes
npm run test:ui         # Playwright Interactive UI Mode
npm run test:headed     # Headed browser execution
npm run test:debug      # Step-by-step debugger

# Code Quality & Reports
npm run lint            # TypeScript compilation check (0 errors)
npm run report          # Open HTML Test Report
```

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

  // 3. Change execution timeouts here (in ms):
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

---

## 🔄 Continuous Integration (CI/CD)

The framework includes a ready-to-run GitHub Actions workflow (`.github/workflows/playwright.yml`) that:
1. Automatically triggers on every `push` and `pull_request` to `main`.
2. Sets up Node.js 20 with npm caching.
3. Installs Playwright Chromium browser binaries and system dependencies.
4. Executes the full test suite in parallel.
5. Publishes HTML Test Reports and test failure artifacts (screenshots, traces, videos) automatically.
