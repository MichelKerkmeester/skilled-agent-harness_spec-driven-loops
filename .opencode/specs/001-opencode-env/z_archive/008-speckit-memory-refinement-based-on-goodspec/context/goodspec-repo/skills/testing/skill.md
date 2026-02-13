---
name: testing
description: Write and run tests for implementations
category: review
triggers:
  - test
  - spec
  - assert
  - coverage
version: 0.1.0
requires:
  - goop-core
---

# Testing Skill

## Testing Pyramid

```
        /\
       /  \        E2E Tests (Few)
      /----\
     /      \      Integration Tests (Some)
    /--------\
   /          \    Unit Tests (Many)
  /------------\
```

## Test Types

### Unit Tests
Test individual functions in isolation.

```typescript
describe('validateEmail', () => {
  it('accepts valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(validateEmail('invalid')).toBe(false);
  });
});
```

### Integration Tests
Test module interactions.

```typescript
describe('user registration', () => {
  it('creates user and sends welcome email', async () => {
    const user = await registerUser({ email: 'test@example.com' });
    expect(user.id).toBeDefined();
    expect(emailService.send).toHaveBeenCalled();
  });
});
```

### E2E Tests
Test complete user flows.

```typescript
test('user can complete checkout', async ({ page }) => {
  await page.goto('/products');
  await page.click('[data-testid="add-to-cart"]');
  await page.click('[data-testid="checkout"]');
  await page.fill('#email', 'test@example.com');
  await page.click('[data-testid="pay"]');
  await expect(page).toHaveURL('/confirmation');
});
```

## Test Structure (AAA)

```typescript
it('should do something', () => {
  // Arrange
  const input = { name: 'test' };
  
  // Act
  const result = processInput(input);
  
  // Assert
  expect(result.processed).toBe(true);
});
```

## Mocking

### Function Mocks
```typescript
const mockFetch = jest.fn().mockResolvedValue({ data: [] });
```

### Module Mocks
```typescript
jest.mock('./database', () => ({
  query: jest.fn().mockResolvedValue([]),
}));
```

### Time Mocks
```typescript
jest.useFakeTimers();
jest.advanceTimersByTime(1000);
```

## Coverage Targets

| Type | Target | Critical Path |
|------|--------|---------------|
| Statements | 80% | 95% |
| Branches | 75% | 90% |
| Functions | 80% | 95% |
| Lines | 80% | 95% |

## Test Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test -- --testPathPattern=auth

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# E2E tests
npm run test:e2e
```

## Testing Best Practices

### Do
- One assertion per test (when possible)
- Descriptive test names
- Test behavior, not implementation
- Use factories for test data
- Clean up after tests

### Don't
- Test implementation details
- Make tests depend on each other
- Use magic numbers
- Test third-party code
- Ignore flaky tests

## Test File Organization

```
src/
├── auth/
│   ├── login.ts
│   └── __tests__/
│       ├── login.test.ts
│       └── login.integration.test.ts
└── __tests__/
    └── e2e/
        └── auth.e2e.test.ts
```

## Fixtures

```typescript
// fixtures/users.ts
export const validUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
};

export const invalidUser = {
  id: '',
  email: 'invalid',
};
```

## Snapshot Testing

```typescript
it('renders correctly', () => {
  const tree = render(<Button>Click me</Button>);
  expect(tree).toMatchSnapshot();
});
```

Update snapshots: `npm test -- -u`

## Performance Testing

```typescript
it('completes within 100ms', async () => {
  const start = performance.now();
  await heavyOperation();
  const duration = performance.now() - start;
  expect(duration).toBeLessThan(100);
});
```
