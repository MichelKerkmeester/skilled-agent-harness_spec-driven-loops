---
title: "Tasks: Add User Authentication"
description: "Level 2 task list for the user authentication example, with effort estimates and explicit verification tasks."
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "user authentication"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Add User Authentication

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

<!-- EXAMPLE: This is a filled-in Level 2 task list with more detailed tracking
including effort estimates and explicit verification tasks for each feature. -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]. Verify: <command> prints <expected output>`


<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup (1 hour)

- [x] T001 Create auth directory structure (`src/auth/`) [15m]. Verify: `ls src/auth` exits 0.
- [x] T002 Install bcrypt, jsonwebtoken, express-validator (`package.json`) [10m]. Verify: `npm ls bcrypt jsonwebtoken` prints both versions.
- [x] T003 [P] Add User model to Prisma schema (`prisma/schema.prisma`) [20m]. Verify: `npx prisma validate` prints that the schema is valid.
- [x] T004 [P] Run Prisma migration (`prisma/migrations/`) [15m]. Verify: `npx prisma migrate status` prints "Database schema is up to date".


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation (4-6 hours)

### Core Utilities
- [x] T005 Implement password hashing utility (`src/utils/hash.js`) [30m]. Verify: `node --check src/utils/hash.js` exits 0.
- [x] T006 Create input validation schemas (`src/validators/auth.js`) [30m]. Verify: `node --check src/validators/auth.js` exits 0.

### API Endpoints
- [x] T007 Create registration endpoint (`src/auth/register.js`) [1h]. Verify: `curl -si -X POST localhost:3000/auth/register` prints `HTTP/1.1 400`.
- [x] T008 Create login endpoint (`src/auth/login.js`) [1h]. Verify: `curl -si -X POST localhost:3000/auth/login` prints `HTTP/1.1 400`.
- [x] T009 Add auth middleware (`src/middleware/auth.js`) [45m]. Verify: `node --check src/middleware/auth.js` exits 0.

### UI Components
- [x] T010 [P] Create registration form view (`views/auth/register.ejs`) [30m]. Verify: `curl -s localhost:3000/register | rg -c '<form'` prints 1.
- [x] T011 [P] Create login form view (`views/auth/login.ejs`) [30m]. Verify: `curl -s localhost:3000/login | rg -c '<form'` prints 1.
- [x] T012 [P] Add error message styling (`public/css/auth.css`) [20m]. Verify: `rg -c 'auth-error' public/css/auth.css` prints 1.

### Integration
- [x] T013 Wire up routes in app.js (`app.js`) [15m]. Verify: `curl -si -X POST localhost:3000/auth/login` prints `HTTP/1.1 400`.


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification (2-3 hours)

### Unit Tests
- [x] T014 Test hash utility functions (`tests/unit/hash.test.js`) [30m]. Verify: `npx jest tests/unit/hash.test.js` exits 0.
- [x] T015 Test validation schemas (`tests/unit/auth-validator.test.js`) [30m]. Verify: `npx jest tests/unit/auth-validator.test.js` exits 0.

### Integration Tests
- [x] T016 Test registration endpoint - success case (`tests/integration/auth.test.js`) [20m]. Verify: `npx jest tests/integration/auth.test.js -t 'registration success'` exits 0.
- [x] T017 Test registration endpoint - duplicate email (`tests/integration/auth.test.js`) [15m]. Verify: `npx jest tests/integration/auth.test.js -t 'duplicate email'` exits 0.
- [x] T018 Test login endpoint - success case (`tests/integration/auth.test.js`) [20m]. Verify: `npx jest tests/integration/auth.test.js -t 'login success'` exits 0.
- [x] T019 Test login endpoint - invalid credentials (`tests/integration/auth.test.js`) [15m]. Verify: `npx jest tests/integration/auth.test.js -t 'invalid credentials'` exits 0.

### Manual Verification
- [x] T020 Test full registration flow in browser [15m]. Verify: `npx playwright test e2e/register.spec.js` exits 0.
- [x] T021 Test full login flow in browser [15m]. Verify: `npx playwright test e2e/login.spec.js` exits 0.
- [x] T022 Test session persistence after refresh [10m]. Verify: `npx playwright test e2e/session.spec.js` exits 0.
- [x] T023 Verify error messages display correctly [10m]. Verify: `npx playwright test e2e/errors.spec.js` exits 0.
- [x] T024 Test in Firefox (cross-browser) [15m]. Verify: `npx playwright test --project=firefox` exits 0.

### Documentation
- [x] T025 Update spec.md with implementation notes [15m]. Verify: `validate.sh . --strict` prints `RESULT: PASSED`.
- [x] T026 Complete implementation-summary.md [20m]. Verify: `validate.sh . --strict` prints `RESULT: PASSED`.
- [x] T027 Mark all checklist items with evidence [15m]. Verify: `validate.sh . --strict` prints `RESULT: PASSED`.


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All unit tests passing
- [x] All integration tests passing
- [x] Manual verification passed
- [x] Verification checklist in tasks.md fully verified


<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See the verification sections in `tasks.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS (~100 lines)
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks
-->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed.
- [ ] CHK-FIX-004 [P0] Security fixes include adversarial cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed.
- [ ] CHK-FIX-006 [P1] Hostile env variant executed when needed.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or diff range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated when applicable
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-24
<!-- /ANCHOR:summary -->
