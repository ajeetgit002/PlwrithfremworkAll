# Enterprise Playwright + AI-Driven Test Automation Framework

An enterprise-grade, scalable, and self-healing end-to-end test automation framework built with **Playwright**, **TypeScript**, **Agentic AI testing engines**, and modern **Senior SDET** architectural design patterns.

---

## 🤖 Next-Gen AI & Agentic Capabilities

This framework features built-in AI testing engines to deliver zero-maintenance, self-healing test automation:

### 1. 🧠 AI Self-Healing Locators (`src/utils/ai-healer.ts`)
* **Dynamic Recovery**: When a primary DOM selector changes (e.g., ID rename or class refactor in a UI deployment), the **AI Healer** intercepts the failure and scans the live DOM using semantic heuristics (visual text, ARIA roles, input placeholders, group labels).
* **Confidence Scoring**: Computes similarity confidence scores and repairs the interaction at runtime without breaking test runs or failing CI/CD builds.
* **Auto-Reporting**: Logs the healed selector and confidence score for engineers to review.

### 2. 🔍 AI Root-Cause Failure Diagnostic Agent (`src/utils/ai-diagnostics.ts`)
* **Auto-Triage**: When an assertion or network error occurs, the AI Diagnostic engine inspects the stack trace, error message, URL state, and console logs.
* **Instant Diagnostic Cards**: Classifies failures into clear categories (`LOCATOR_BREAKAGE`, `API_5XX_SERVER_ERROR`, `AUTHENTICATION_EXPIRED`, `UI_ASSERTION_MISMATCH`), explains the root cause in plain English, and provides concrete fix recommendations.

### 3. 🛡️ AI Security, Unicode & Edge-Case Fuzzing (`src/utils/ai-fuzzer.ts`)
* **Security Payloads**: Injects dynamic Cross-Site Scripting (XSS) and SQL Injection (SQLi) vectors into input forms to test sanitization resilience.
* **Multi-Language & Unicode**: Tests form resilience against Arabic RTL, Japanese Kanji, Hindi Devnagari, European accents, and zero-width spaces.
* **Boundary Lengths**: Fuzzes input fields with single character, max 255-char, and extreme 4096-char payloads.

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
                               │  auth / admin / ai / pim  │
                               └─────────────┬─────────────┘
                                             │ (injects)
                               ▼─────────────┴─────────────▼
                               ┌───────────────────────────┐
                               │    Fixtures (base-test)   │
                               │  Auto Context & Injection │
                               └─────────────┬─────────────┘
                                             │
      ┌──────────────────────────────────────┼──────────────────────────────────────┐
      ▼                                      ▼                                      ▼
┌───────────┐                          ┌───────────┐                          ┌───────────┐
│   Pages   │                          │Components │                          │AI Engines │
│Admin, Dash│◄─────────────────────────┤  TopBar,  │                          │AiHealer,  │
│Login, PIM │     (composed within)    │  Sidebar  │                          │AiFuzzer   │
└─────┬─────┘                          └───────────┘                          └─────┬─────┘
      │                                                                             │
      └──────────────────────────────────────┬──────────────────────────────────────┘
                                             ▼
                               ┌───────────────────────────┐
                               │    Core & Config Layer    │
                               │ app.config / test-data    │
                               └───────────────────────────┘
```

---

## 🧩 Core Classes & Modules

| Class / Utility | Location | Responsibility |
| :--- | :--- | :--- |
| **`BasePage`** | `src/pages/base.page.ts` | Abstract foundation for all Page Objects (navigation, load waits, screenshots). |
| **`AiHealer`** | `src/utils/ai-healer.ts` | AI semantic DOM matching and self-healing locator recovery engine. |
| **`AiDiagnostics`** | `src/utils/ai-diagnostics.ts` | Root-cause failure analyzer and CI/CD diagnostic card generator. |
| **`AiFuzzer`** | `src/utils/ai-fuzzer.ts` | Dynamic XSS, SQLi, Unicode, and boundary length fuzzing payload generator. |
| **`AccessibilityAuditor`** | `src/utils/accessibility.ts` | Automated WCAG 2.1 AA accessibility auditing powered by `@axe-core/playwright`. |
| **`PerformanceAuditor`** | `src/utils/performance.ts` | Live browser Navigation Timings (TTFB, DOM Load, Page Load) and performance budgets. |
| **`NetworkMocker`** | `src/utils/network-mocker.ts` | HTTP route interception, fault injection (500 errors), and mock API payloads. |
| **`TestDataGenerator`** | `src/utils/data-generator.ts` | Synthetic, collision-free test datasets powered by `@faker-js/faker`. |
| **`ApiClient`** | `src/utils/api-client.ts` | Strongly-typed HTTP REST client for backend data seeding and API assertions. |
| **`PlaywrightUtils`** | `src/utils/PlaywrightUtils.ts` | Safe element actions, visual regression snapshots, and wait utilities. |

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

# Run AI & Agentic Test Suites
npm run test:ai         # Self-healing locators & AI fuzzing tests

# Run Quality & Compliance Audits
npm run test:a11y       # WCAG 2.1 AA Accessibility audits
npm run test:perf       # Web Performance & Core Web Vitals
npm run test:network    # Network Mocking & Fault Injection

# Run Specific Feature Modules
npm run test:auth       # Authentication tests
npm run test:admin      # Admin module tests
npm run test:dashboard  # Dashboard tests
npm run test:pim        # PIM employee tests

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

---

## 🔄 Continuous Integration (CI/CD)

The framework includes an automated GitHub Actions workflow (`.github/workflows/playwright.yml`) that:
1. Automatically triggers on every `push` and `pull_request` to `main`.
2. Sets up Node.js 20 with npm caching.
3. Installs Playwright Chromium browser binaries and system dependencies.
4. Executes the full test suite in parallel.
5. Publishes HTML Test Reports and test failure artifacts (screenshots, traces, videos).
6. Sends automated status cards to **Slack / MS Teams** channels.
