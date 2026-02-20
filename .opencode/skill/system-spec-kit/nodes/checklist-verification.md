---
description: "How the checklist acts as an active verification tool for Level 2+ specs."
---
# Checklist Verification

### Checklist as Verification Tool (Level 2+)

The `checklist.md` is an **ACTIVE VERIFICATION TOOL**, not passive documentation:

| Priority | Meaning      | Deferral Rules                          |
| -------- | ------------ | --------------------------------------- |
| **P0**   | HARD BLOCKER | MUST complete, cannot defer             |
| **P1**   | Required     | MUST complete OR user-approved deferral |
| **P2**   | Optional     | Can defer without approval              |

**AI Workflow:**
1. Load checklist.md at completion phase
2. Verify items in order: P0 → P1 → P2
3. Mark `[x]` with evidence for each verified item
4. Cannot claim "done" until all P0/P1 items verified

**Evidence formats:**
- `[Test: npm test - all passing]`
- `[File: src/auth.ts:45-67]`
- `[Commit: abc1234]`
- `[Screenshot: evidence/login-works.png]`
- `(verified by manual testing)`
- `(confirmed in browser console)`

**Example checklist entry:**
```markdown
## P0 - Blockers
- [x] Auth flow working [Test: npm run test:auth - 12/12 passing]
- [x] No console errors [Screenshot: evidence/console-clean.png]

## P1 - Required  
- [x] Unit tests added [File: tests/auth.test.ts - 8 new tests]
- [ ] Documentation updated [DEFERRED: Will complete in follow-up PR]
```