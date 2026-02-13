---
name: playwright-testing
description: Design and execute comprehensive Playwright test suites for web applications.
category: review
triggers:
  - playwright
  - testing
  - e2e
  - suites
version: 0.1.0
---

# Playwright Testing Skill

## Purpose
Design and execute comprehensive Playwright test suites for web applications.

## Test Organization

```
tests/
  e2e/
    auth/
      login.spec.ts
      signup.spec.ts
    dashboard/
      overview.spec.ts
  fixtures/
    auth.fixture.ts
  pages/
    login.page.ts
    dashboard.page.ts
```

## Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature: User Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.fill('[data-testid="email"]', 'wrong@example.com');
    await page.fill('[data-testid="password"]', 'wrong');
    await page.click('[data-testid="submit"]');
    await expect(page.locator('[data-testid="error"]')).toBeVisible();
  });
});
```

## Fixtures

```typescript
// fixtures/auth.fixture.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="submit"]');
    await page.waitForURL('/dashboard');
    await use(page);
  },
});
```

## Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  retries: 2,
  workers: 4,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
```
