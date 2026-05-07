# Playwright Automation Framework

End-to-End test automation framework for [automationexercise.com](https://automationexercise.com/) built with **Playwright + TypeScript**, following the **Page Object Model** pattern with a centralized **PoManager**, fixtures, data-driven JSON inputs, and **Allure** reporting.

## Structure

```
.
├── Fixtures/          # Shared setup / custom test fixtures
├── pages/             # Page objects + PoManager
├── specs/             # E2E test specs
├── testData/          # JSON test data
└── playwright.config.ts
```

## Getting Started

```bash
npm install
npx playwright install
```

## Run Tests

```bash
# All tests
npm test

# Headed mode
npm run test:headed

# Single spec
npx playwright test specs/signupPage.spec.ts
```

## Allure Report

```bash
npm run report
```

## Test Coverage

- Home, Login/Signup, Signup form, Products, Product Details, Cart, Checkout, Payment
- End-to-end purchase flow (`e2eOrderFlow.spec.ts`)
- Positive + Negative scenarios per page
- Jira-linked test cases (e.g. AUT-11 → AUT-80..AUT-89) in `signupPage.spec.ts`
