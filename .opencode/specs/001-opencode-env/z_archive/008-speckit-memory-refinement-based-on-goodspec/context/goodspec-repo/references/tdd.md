# Test-Driven Development (TDD) Reference

GoopSpec supports TDD-style planning and execution. This reference covers how to use TDD effectively within the GoopSpec workflow.

## TDD Cycle

```
   ┌─────────────────┐
   │   RED           │
   │   Write a       │
   │   failing test  │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │   GREEN         │
   │   Minimum code  │
   │   to pass       │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │   REFACTOR      │
   │   Clean up      │
   │   Keep green    │
   └────────┬────────┘
            │
            └──────────► Repeat
```

## TDD in GoopSpec

### Plan Configuration

Enable TDD mode in plan frontmatter:

```yaml
---
phase: 1
plan: auth-feature
type: tdd
wave: 1
autonomous: true
---
```

### Task Structure

```markdown
<task type="auto" tdd="true">
### Task 1: User Login

**Test First:**
```typescript
// src/auth/__tests__/login.test.ts
import { login } from '../login';

describe('login', () => {
  it('should return user on valid credentials', async () => {
    const result = await login('test@example.com', 'password123');
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
  });

  it('should throw on invalid credentials', async () => {
    await expect(login('test@example.com', 'wrong'))
      .rejects.toThrow('Invalid credentials');
  });
});
```

**Implementation:**
```typescript
// src/auth/login.ts
export async function login(email: string, password: string) {
  const user = await db.users.findByEmail(email);
  if (!user || !await verifyPassword(password, user.passwordHash)) {
    throw new Error('Invalid credentials');
  }
  return { user };
}
```

**Refactor:**
- Extract password verification to separate module
- Add input validation
- Add logging

**Done:**
- Tests pass: `npm test src/auth/__tests__/login.test.ts`
- Coverage > 80%
</task>
```

## TDD Execution Flow

### Step 1: RED Phase

1. Write the test file first
2. Run tests to confirm they fail
3. Commit the failing test

```bash
# Write test
edit src/auth/__tests__/login.test.ts

# Verify it fails
npm test -- --testPathPattern=login

# Commit
git commit -m "test(auth): add login tests (red)"
```

### Step 2: GREEN Phase

1. Write minimum code to pass
2. Run tests to confirm they pass
3. Commit the implementation

```bash
# Write implementation
edit src/auth/login.ts

# Verify it passes
npm test -- --testPathPattern=login

# Commit
git commit -m "feat(auth): implement login (green)"
```

### Step 3: REFACTOR Phase

1. Improve code quality
2. Keep tests passing
3. Commit refactoring

```bash
# Refactor
edit src/auth/login.ts

# Verify still passes
npm test -- --testPathPattern=login

# Commit
git commit -m "refactor(auth): extract password verification"
```

## Context Budget for TDD

TDD requires more context due to test code. Allocate accordingly:

| Phase | Context Budget |
|-------|---------------|
| RED (tests) | 20% |
| GREEN (impl) | 40% |
| REFACTOR | 20% |
| Buffer | 20% |

**Total per TDD cycle:** ~40% context

**Recommendation:** 2-3 TDD tasks per plan maximum.

## Test Categories

### Unit Tests

Test individual functions/modules in isolation.

```typescript
describe('validateEmail', () => {
  it('should accept valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });
});
```

### Integration Tests

Test module interactions.

```typescript
describe('auth flow', () => {
  it('should login and create session', async () => {
    const result = await login('user@example.com', 'pass');
    const session = await getSession(result.sessionId);
    expect(session.userId).toBe(result.user.id);
  });
});
```

### E2E Tests

Test complete user flows (use sparingly, high cost).

```typescript
describe('login page', () => {
  it('should redirect to dashboard on success', async () => {
    await page.goto('/login');
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });
});
```

## Best Practices

1. **One assertion per test:** Clear failure messages
2. **Descriptive names:** `should_do_X_when_Y`
3. **Arrange-Act-Assert:** Clear test structure
4. **No test interdependence:** Each test isolated
5. **Fast tests:** Mock external dependencies
6. **Coverage targets:** Aim for 80%+ on critical paths

## When NOT to Use TDD

- Exploratory/prototyping work
- UI/visual components (use snapshot tests instead)
- Configuration/setup code
- Third-party integrations (use integration tests)
- Performance-critical inner loops (profile first)

## TDD Tools

| Language | Framework | Runner |
|----------|-----------|--------|
| TypeScript/JS | Jest, Vitest | npm test |
| Python | pytest | pytest |
| Go | testing | go test |
| Rust | built-in | cargo test |
