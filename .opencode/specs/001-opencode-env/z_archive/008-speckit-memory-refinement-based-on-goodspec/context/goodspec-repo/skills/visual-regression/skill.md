---
name: visual-regression
description: Detect unintended visual changes in UI through automated screenshot comparison.
category: review
triggers:
  - visual regression
  - screenshots
  - ui testing
  - diff
version: 0.1.0
---

# Visual Regression Testing Skill

## Purpose
Detect unintended visual changes in UI through automated screenshot comparison.

## How It Works

1. Capture baseline screenshots of components/pages
2. Run tests to capture new screenshots
3. Compare against baselines pixel-by-pixel
4. Flag differences for review
5. Update baselines when changes are intentional

## Tools

### Playwright Visual Comparisons
```typescript
import { test, expect } from '@playwright/test';

test('homepage visual regression', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png', {
    maxDiffPixels: 100,
    threshold: 0.2,
  });
});
```

### Percy/Chromatic Integration
- Cloud-based visual testing
- Cross-browser comparisons
- Approval workflows

## Best Practices

### 1. Stable Tests
- Wait for animations to complete
- Use consistent viewport sizes
- Mock dynamic content (dates, avatars)
- Disable animations during tests

### 2. Meaningful Baselines
- Capture at key breakpoints
- Include interactive states
- Test light and dark themes

### 3. Efficient Reviews
- Set appropriate diff thresholds
- Use component-level screenshots
- Group related screenshots

## Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 50,
      threshold: 0.1,
      animations: 'disabled',
    },
  },
  use: {
    viewport: { width: 1280, height: 720 },
  },
});
```

## When to Update Baselines

- Intentional design changes
- After reviewing and approving diffs
- Never auto-update without review
