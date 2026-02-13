---
name: deviation-handling
description: Handle deviations from plan using the 4-rule system
category: core
triggers:
  - deviation
  - unexpected
  - bug
  - blocker
version: 0.1.0
requires:
  - goop-core
---

# Deviation Handling Skill

## The 4-Rule System

### Rule 1: Bug Fixes (Auto-Fix)

**Triggers:**
- Type errors, null pointer exceptions
- Logic errors (off-by-one, wrong comparison)
- Security vulnerabilities (injection, XSS)
- Runtime crashes
- Memory leaks

**Action:** Fix immediately without asking.

**Example:**
```typescript
// Bug found: missing null check
if (user.email) {  // Was: if (user) - crashes on undefined
  sendEmail(user.email);
}
```

### Rule 2: Missing Critical Functionality (Auto-Fix)

**Triggers:**
- Missing error handling
- Missing input validation
- Missing auth checks
- Missing rate limiting
- Missing sanitization

**Action:** Add immediately without asking.

**Example:**
```typescript
// Missing: input validation
export async function createUser(data: UserInput) {
  // Added: validation
  if (!isValidEmail(data.email)) {
    throw new ValidationError('Invalid email');
  }
  // ... rest of implementation
}
```

### Rule 3: Blocking Issues (Auto-Fix)

**Triggers:**
- Missing npm packages
- Broken imports
- Missing env variables
- Config errors
- Build failures

**Action:** Fix to unblock without asking.

**Example:**
```bash
# Missing package
npm install zod  # Added to fix import error
```

### Rule 4: Architectural Decisions (STOP)

**Triggers:**
- Database schema changes
- New tables or collections
- Framework switches
- Major dependency additions
- API contract changes
- Infrastructure changes

**Action:** STOP and ask user.

**Example:**
```
STOP: Architectural Decision Required

The current implementation requires a new database table
for session storage.

Options:
1. Add 'sessions' table (recommended)
2. Use in-memory session store
3. Use existing 'users' table with session fields

Please choose an option to continue.
```

## Detection Flow

```
Issue Found
    │
    ▼
Is it a bug/error? ──Yes──► Rule 1: Auto-fix
    │
    No
    │
    ▼
Is critical feature missing? ──Yes──► Rule 2: Auto-add
    │
    No
    │
    ▼
Is it blocking progress? ──Yes──► Rule 3: Auto-fix
    │
    No
    │
    ▼
Is it architectural? ──Yes──► Rule 4: STOP and ask
    │
    No
    │
    ▼
Continue without deviation
```

## Logging Deviations

Always log to ADL:

```markdown
### AD-015

**Type:** implementation
**Date:** 2024-01-15T10:30:00Z
**Status:** active

**Context:**
During implementation of login endpoint, discovered missing
input validation on email field.

**Decision:**
Applied Rule 2: Auto-added email validation using zod schema.

**Rationale:**
Input validation is a critical security requirement that any
professional implementation would include.

**Related Files:**
- `src/auth/login.ts`
```

## Confidence Handling

If unsure which rule applies:
- Default to Rule 4 (ask user)
- Log uncertainty in ADL
- Request clarification

## Commit Messages

```
fix(auth): add missing email validation (Rule 2 deviation)

- Added zod schema for email validation
- Returns 400 on invalid input
- Logged as AD-015 in ADL

During: Implement login endpoint
Issue: Missing input validation
Rule: 2 (auto-add missing critical functionality)
```

## Best Practices

1. **Document everything:** Every deviation goes in ADL
2. **Atomic fixes:** One deviation = one commit
3. **Stay in scope:** Deviations shouldn't expand spec scope
4. **Confidence threshold:** When in doubt, ask (Rule 4)
5. **Verify after fix:** Run tests to confirm fix works
