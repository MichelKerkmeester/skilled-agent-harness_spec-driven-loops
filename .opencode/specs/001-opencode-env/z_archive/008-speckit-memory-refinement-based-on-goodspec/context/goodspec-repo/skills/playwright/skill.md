---
name: playwright
description: Write effective end-to-end tests using Playwright for web applications.
category: review
triggers:
  - playwright
  - e2e
  - browser
  - testing
version: 0.1.0
---

# Playwright Skill

## Purpose
Write effective end-to-end tests using Playwright for web applications.

## Core Concepts

### Page Object Model
Encapsulate page interactions in reusable classes.

```typescript
class LoginPage {
  constructor(private page: Page) {}
  
  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('[data-testid="submit"]');
  }
}
```

### Locator Strategies (Priority Order)
1. `data-testid` attributes (most stable)
2. Accessible roles and names
3. Text content
4. CSS selectors (least preferred)

### Waiting Strategies
- Auto-wait for elements (built-in)
- `waitForSelector` for dynamic content
- `waitForResponse` for API calls
- `waitForLoadState` for navigation

## Best Practices

1. **Use Test IDs** - Add `data-testid` for test stability
2. **Isolate Tests** - Each test should be independent
3. **Mock Strategically** - Mock external services, not internal logic
4. **Screenshot on Failure** - Capture state for debugging
5. **Parallel Execution** - Use workers for speed

## Common Patterns

```typescript
// Wait for API response
await page.waitForResponse(resp => 
  resp.url().includes('/api/users') && resp.status() === 200
);

// Screenshot on failure
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({ path: `failure-${testInfo.title}.png` });
  }
});
```
