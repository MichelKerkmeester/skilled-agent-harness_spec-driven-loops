---
name: verification
description: Verify implementations against specifications
category: review
triggers:
  - verify
  - check
  - validate
  - audit
version: 0.1.0
requires:
  - goop-core
---

# Verification Skill

## Verification Philosophy

Task completion ≠ Goal achievement

Verify that the implementation:
1. Does what the spec says
2. Handles edge cases
3. Meets quality standards
4. Is maintainable

## Verification Levels

### Level 1: Syntax
- Code compiles/transpiles
- No linting errors
- Types check

### Level 2: Unit
- Individual functions work
- Edge cases handled
- Errors thrown appropriately

### Level 3: Integration
- Components work together
- Data flows correctly
- State managed properly

### Level 4: E2E
- User flows complete
- UI renders correctly
- Performance acceptable

### Level 5: Security
- No vulnerabilities
- Auth works correctly
- Data protected

## Verification Checklist

### Code Quality
- [ ] Follows project conventions
- [ ] No unused code
- [ ] No hardcoded values
- [ ] Proper error handling
- [ ] Logging in place

### Functionality
- [ ] All spec requirements met
- [ ] Edge cases handled
- [ ] Error states work
- [ ] Happy path works

### Tests
- [ ] Tests exist for new code
- [ ] Tests pass
- [ ] Coverage acceptable
- [ ] Tests are meaningful

### Documentation
- [ ] Code is self-documenting
- [ ] Complex logic commented
- [ ] API documented
- [ ] README updated if needed

## Must-Have Verification

From SPEC.md must-haves:

### Truths (Observable Behaviors)
```markdown
- [ ] User can log in with email/password
- [ ] Invalid credentials show error
- [ ] Session persists across refresh
```

### Artifacts (Required Files)
```markdown
| Path | Exists | Exports | Min Lines |
|------|--------|---------|-----------|
| src/auth/login.ts | ✓ | login() | 50 |
```

### Key Links (Connections)
```markdown
| From | To | Via | Verified |
|------|-----|-----|----------|
| login.ts | session.ts | createSession() | ✓ |
```

## Verification Commands

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Build
npm run build
```

## VERIFY.md Template

```markdown
# Verification: Phase {N}

**Date:** {YYYY-MM-DD}
**Verifier:** GoopSpec Verifier Agent

## Summary
{Pass/Fail with brief explanation}

## Must-Haves

### Truths
| Behavior | Status | Notes |
|----------|--------|-------|
| User can log in | ✓ | Tested manually |

### Artifacts
| File | Status | Notes |
|------|--------|-------|
| src/auth/login.ts | ✓ | 75 lines |

### Key Links
| Connection | Status | Notes |
|------------|--------|-------|
| login → session | ✓ | createSession called |

## Quality Checks

| Check | Status |
|-------|--------|
| TypeScript | ✓ Pass |
| ESLint | ✓ Pass |
| Tests | ✓ 45/45 |
| Build | ✓ Success |

## Issues Found
{List any issues or none}

## Recommendations
{Suggestions for improvement}
```

## Best Practices

1. **Verify against spec** - Not against assumptions
2. **Test boundaries** - Edge cases, limits, errors
3. **Check behavior** - Not just code existence
4. **Document findings** - Even if all passes
5. **Be ruthless** - Better to catch issues now
