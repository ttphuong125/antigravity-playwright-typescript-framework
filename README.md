# 🎭 Playwright E2E Automation Framework

> End-to-End Web UI Automation Framework — Playwright Test + TypeScript (Strict Mode)

---

## 📋 Tech Stack

| Component | Technology |
|---|---|
| **Framework** | [Playwright](https://playwright.dev/) |
| **Language** | TypeScript (Strict Mode) |
| **Test Runner** | `@playwright/test` |
| **Report** | HTML Report |
| **CI/CD** | GitHub Actions |
| **Config** | dotenv + typed ENV object |

---

## 🚀 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

---

## ⚡ Quick Start

### 1. Install dependencies

```bash
cd playwright-framework
npm install
```

### 2. Install Playwright browsers

```bash
npx playwright install
```

### 3. Configure environment

```bash
# Copy the environment template
cp .env.example .env

# Edit .env with your actual values
# BASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD, etc.
```

### 4. Run tests

```bash
# Run all tests (headless)
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests with Playwright UI mode (interactive)
npm run test:ui

# Run tests in debug mode (step through)
npm run test:debug

# Run tests on a specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### 5. View reports

```bash
# Open the HTML report
npm run report
```

---

## 📁 Project Structure

```
playwright-framework/
├── playwright.config.ts        # Playwright configuration
├── package.json                # Dependencies + scripts
├── tsconfig.json               # TypeScript config (strict mode)
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
├── src/
│   ├── pages/                  # Page Object classes
│   │   ├── base.page.ts        # Base page — common methods
│   │   ├── login.page.ts       # Login page object
│   │   └── dashboard.page.ts   # Dashboard page object
│   ├── fixtures/               # Custom Playwright fixtures
│   │   ├── base.fixture.ts     # Page object fixtures (test + expect)
│   │   └── auth.fixture.ts     # Authentication fixture
│   ├── utils/                  # Utilities & helpers
│   │   ├── env.config.ts       # Environment config reader
│   │   ├── test-data.ts        # Unique test data generators
│   │   ├── helpers.ts          # Common helper functions
│   │   └── logger.ts           # Structured logger
│   └── tests/                  # Test specs
│       ├── auth/
│       │   └── login.spec.ts   # Login test suite
│       └── dashboard/
│           └── dashboard.spec.ts
├── test-data/                  # External test data (JSON)
│   └── users.json
└── .github/
    └── workflows/
        └── playwright.yml      # CI pipeline
```

---

## 🏗️ Architecture & Design Principles

### Page Object Model (POM)

- Every page/screen → 1 Page class extending `BasePage`
- Locators declared as class properties (not inline in tests)
- Methods describe **user behaviors** (e.g., `login()`, `logout()`), not DOM actions

### Custom Fixtures

- **`base.fixture.ts`** — Injects page objects (`loginPage`, `dashboardPage`) into tests
- **`auth.fixture.ts`** — Provides pre-authenticated `Page` for tests requiring login

### Smart Waits

- ❌ **NO** `waitForTimeout()`, `Thread.sleep`, or fixed delays
- ✅ Uses Playwright's built-in auto-waiting, `expect()` assertions, and `waitForURL()`

### Configuration Management

- All environment values in `.env` file (via `dotenv`)
- Typed `ENV` object in `env.config.ts` — no hardcoded values in tests
- Sensitive data (credentials) via environment variables in CI

### Structured Logging

- `Logger` class with levels: DEBUG, INFO, WARN, ERROR, STEP
- Timestamps and context in every log entry
- Replaces `console.log` for traceable output

### Test Data

- `test-data.ts` generators produce unique, traceable data
- Format: `test_<context>_<timestamp>@auto.test`
- External data in `test-data/users.json` for data-driven tests

---

## 📝 Conventions

### File Naming

| Type | Pattern | Example |
|---|---|---|
| Page Object | `<name>.page.ts` | `login.page.ts` |
| Test Spec | `<name>.spec.ts` | `login.spec.ts` |
| Fixture | `<name>.fixture.ts` | `base.fixture.ts` |
| Utility | `<name>.ts` | `test-data.ts` |

### Test Structure

```typescript
import { test, expect } from '../../fixtures/base.fixture';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC_ID — Description', async ({ loginPage, dashboardPage }) => {
    // Arrange
    const username = 'admin';

    // Act
    await loginPage.login(username, 'password');

    // Assert
    await dashboardPage.expectDashboardDisplayed();
  });
});
```

### Adding a New Page Object

1. Create `src/pages/<name>.page.ts` extending `BasePage`
2. Declare locators as class properties
3. Add action methods for user behaviors
4. Register in `src/fixtures/base.fixture.ts`

### Adding a New Test

1. Create `src/tests/<feature>/<name>.spec.ts`
2. Import from `../../fixtures/base.fixture`
3. Use `test.describe()` for grouping
4. Follow `Arrange → Act → Assert` pattern

---

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `BASE_URL` | `https://your-app-url.com` | Application URL |
| `APP_ENV` | `dev` | Environment name |
| `ADMIN_USERNAME` | `admin` | Admin username |
| `ADMIN_PASSWORD` | `changeme` | Admin password |
| `DEFAULT_TIMEOUT` | `30000` | Default test timeout (ms) |
| `NAVIGATION_TIMEOUT` | `60000` | Navigation timeout (ms) |
| `HEADLESS` | `true` | Run headless mode |
| `SLOW_MO` | `0` | Slow motion delay (ms) |

### Playwright Config

Key settings in `playwright.config.ts`:

- **Viewport:** 1920 × 1080 (desktop)
- **Retries:** 0 locally, 2 on CI
- **Screenshots:** On failure only
- **Trace:** On first retry
- **Video:** On first retry
- **Reporter:** HTML + list

---

## 🔄 CI/CD

GitHub Actions pipeline at `.github/workflows/playwright.yml`:

- Triggers on push to `main`/`develop` and pull requests
- Installs Chromium only (fastest)
- Uses GitHub Secrets for credentials
- Uploads HTML report as artifact (14-day retention)
- Uploads test results on failure (7-day retention)

### Required Secrets

Set these in **Settings → Secrets → Actions**:

- `BASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

---

## 📊 Reports

### HTML Report (default)

After test run:
```bash
npm run report
```

Report is generated at `playwright-report/index.html`.

---

## 📄 License

ISC
