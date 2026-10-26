---
title: "Tasks: Add User Authentication"
description: "Level 3+ task list example with the three-tier task format, AI execution protocol and workstream tracking."
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "user authentication"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Add User Authentication

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + all addendums | v2.2 -->

<!-- EXAMPLE: This is a filled-in Level 3+ task list demonstrating full governance
features including 3-Tier Task Format, AI Execution Protocol, and Workstream
organization. Use this for enterprise-scale multi-agent coordination. -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**3-Tier Task Format**: `T### [W-X] [P?] Description (file path) {deps: T###}. Verify: <command> prints <expected output>`


<!-- /ANCHOR:notation -->
---

## Milestone Reference

| Milestone | Tasks | Target | Status |
|-----------|-------|--------|--------|
| M1 Foundation | T001-T006 | Day 1 EOD | Complete |
| M2 Services | T007-T012 | Day 2 EOD | Complete |
| M3 API | T013-T022 | Day 3 EOD | Complete |
| M4 UI | T023-T028 | Day 4 noon | Complete |
| M5 Security | T029-T030 | Day 4 EOD | Complete |
| M6 Release | T031-T050 | Day 5 EOD | Complete |


---

## AI Execution Protocol

### Pre-Task Checklist
Before starting any task, verify:
1. [ ] spec.md scope unchanged
2. [ ] Current phase identified in plan.md
3. [ ] Task dependencies satisfied
4. [ ] Relevant P0/P1 checklist items identified
5. [ ] No blocking issues in decision-record.md
6. [ ] Previous session context reviewed (if applicable)

### Execution Rules
| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order |
| TASK-SCOPE | Stay within task boundary |
| TASK-VERIFY | Verify against acceptance criteria |
| TASK-DOC | Update status immediately |
| TASK-SYNC | Wait at sync points |


---

## Workstream Organization

| Workstream | Owner | Scope | Files |
|------------|-------|-------|-------|
| W-A | Primary | Core Services | src/utils/*.js, src/middleware/*.js |
| W-B | API Agent | API & UI | src/auth/*.js, views/*.ejs |
| W-C | Test Agent | Testing | tests/*.js |


---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [Milestone M1] [W-A]

- [x] T001 [W-A] Create auth directory structure (`src/auth/`). Verify: `ls src/auth` exits 0.
- [x] T002 [W-A] Install bcrypt, jsonwebtoken, express-validator (`package.json`). Verify: `npm ls bcrypt jsonwebtoken` prints both versions.
- [x] T003 [W-A] [P] Configure environment variables (`env.example`, `.env`). Verify: `rg -c JWT_SECRET env.example` prints 1.
- [x] T004 [W-A] [P] Add User model to Prisma schema (`prisma/schema.prisma`). Verify: `npx prisma validate` prints that the schema is valid.


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Database [Milestone M1] [W-A]

- [x] T005 [W-A] Run Prisma migration (`prisma/migrations/`) {deps: T004}. Verify: `npx prisma migrate status` prints "Database schema is up to date".
- [x] T006 [W-A] Add unique index on email (`prisma/schema.prisma`) {deps: T005}. Verify: `rg -n '@unique' prisma/schema.prisma` prints the email line.


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Core Services [Milestone M2] [W-A]

### Hash Service
- [x] T007 [W-A] Implement hashPassword function (`src/utils/hash.js`) {deps: T002}. Verify: `node --check src/utils/hash.js` exits 0.
- [x] T008 [W-A] Implement verifyPassword function (`src/utils/hash.js`) {deps: T007}. Verify: `node --check src/utils/hash.js` exits 0.

### Token Service
- [x] T009 [W-A] [P] Implement generateToken function (`src/utils/token.js`) {deps: T002}. Verify: `node --check src/utils/token.js` exits 0.
- [x] T010 [W-A] [P] Implement verifyToken function (`src/utils/token.js`) {deps: T009}. Verify: `node --check src/utils/token.js` exits 0.

### Validators
- [x] T011 [W-A] [P] Create registration validator (`src/validators/auth.js`) {deps: T002}. Verify: `node --check src/validators/auth.js` exits 0.
- [x] T012 [W-A] [P] Create login validator (`src/validators/auth.js`) {deps: T011}. Verify: `node --check src/validators/auth.js` exits 0.

**>>> SYNC-001: W-A Services ready for API integration <<<**


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: API Endpoints [Milestone M3] [W-B]

### Registration
- [x] T013 [W-B] Create registration route handler (`src/auth/register.js`) {deps: T007, T011, SYNC-001}. Verify: `curl -si -X POST localhost:3000/auth/register` prints `HTTP/1.1 400`.
- [x] T014 [W-B] Add user creation with hashed password (`src/auth/register.js`) {deps: T013}. Verify: `node --check src/auth/register.js` exits 0.
- [x] T015 [W-B] Add duplicate email check (`src/auth/register.js`) {deps: T014}. Verify: `node --check src/auth/register.js` exits 0.

### Login
- [x] T016 [W-B] Create login route handler (`src/auth/login.js`) {deps: T008, T009, T012}. Verify: `curl -si -X POST localhost:3000/auth/login` prints `HTTP/1.1 400`.
- [x] T017 [W-B] Add password verification (`src/auth/login.js`) {deps: T016}. Verify: `node --check src/auth/login.js` exits 0.
- [x] T018 [W-B] Add token generation on success (`src/auth/login.js`) {deps: T017}. Verify: `node --check src/auth/login.js` exits 0.

### Logout
- [x] T019 [W-B] Create logout route handler (`src/auth/logout.js`) {deps: T010}. Verify: `node --check src/auth/logout.js` exits 0.

### Middleware
- [x] T020 [W-A] Create auth middleware (`src/middleware/auth.js`) {deps: T010}. Verify: `node --check src/middleware/auth.js` exits 0.
- [x] T021 [W-B] Add protected route example (`src/routes/dashboard.js`) {deps: T020}. Verify: `curl -si localhost:3000/dashboard` prints `HTTP/1.1 401`.

### Integration
- [x] T022 [W-B] Wire up all routes in app.js (`app.js`) {deps: T015, T018, T019, T020}. Verify: `curl -si localhost:3000/dashboard` prints `HTTP/1.1 401`.


<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:phase-5 -->
## Phase 5: UI [Milestone M4] [W-B]

- [x] T023 [W-B] Create registration form view (`views/auth/register.ejs`) {deps: T015}. Verify: `curl -s localhost:3000/register | rg -c '<form'` prints 1.
- [x] T024 [W-B] Create login form view (`views/auth/login.ejs`) {deps: T018}. Verify: `curl -s localhost:3000/login | rg -c '<form'` prints 1.
- [x] T025 [W-B] [P] Add client-side token storage (`public/js/auth.js`) {deps: T018}. Verify: `rg -n localStorage public/js/auth.js` prints the token line.
- [x] T026 [W-B] [P] Add error message styling (`public/css/auth.css`). Verify: `rg -c 'auth-error' public/css/auth.css` prints 1.
- [x] T027 [W-B] [P] Add success feedback styling (`public/css/auth.css`). Verify: `rg -c 'auth-success' public/css/auth.css` prints 1.
- [x] T028 [W-B] Add logout button to nav (`views/partials/nav.ejs`) {deps: T019}. Verify: `rg -n logout views/partials/nav.ejs` prints the button line.

**>>> SYNC-002: W-A, W-B complete - Full integration test suite <<<**


<!-- /ANCHOR:phase-5 -->
---

<!-- ANCHOR:phase-6 -->
## Phase 6: Security Review [Milestone M5]

- [x] T029 Security team review scheduled {deps: SYNC-002}. Verify: `rg -n 'Reviewer' tasks.md` prints the reviewer line.
- [x] T030 Security review completed and sign-off obtained {deps: T029}. Verify: `rg -n 'Approved with notes' tasks.md` prints the status line.
  - **Reviewer**: Alex (Security Lead)
  - **Date**: 2025-01-17
  - **Status**: Approved with notes (HttpOnly cookies recommended for Phase 2)


<!-- /ANCHOR:phase-6 -->
---

<!-- ANCHOR:phase-7 -->
## Phase 7: Verification [Milestone M6] [W-C]

### Unit Tests
- [x] T031 [W-C] Test hashPassword function (`tests/unit/hash.test.js`) {deps: T008}. Verify: `npx jest tests/unit/hash.test.js` exits 0.
- [x] T032 [W-C] Test verifyPassword function (`tests/unit/hash.test.js`) {deps: T031}. Verify: `npx jest tests/unit/hash.test.js` exits 0.
- [x] T033 [W-C] [P] Test generateToken function (`tests/unit/token.test.js`) {deps: T010}. Verify: `npx jest tests/unit/token.test.js` exits 0.
- [x] T034 [W-C] [P] Test verifyToken function (`tests/unit/token.test.js`) {deps: T033}. Verify: `npx jest tests/unit/token.test.js` exits 0.
- [x] T035 [W-C] [P] Test validation schemas (`tests/unit/auth-validator.test.js`) {deps: T012}. Verify: `npx jest tests/unit/auth-validator.test.js` exits 0.

### Integration Tests
- [x] T036 [W-C] Test registration - success case (`tests/integration/auth.test.js`) {deps: SYNC-002}. Verify: `npx jest tests/integration/auth.test.js -t 'registration success'` exits 0.
- [x] T037 [W-C] Test registration - duplicate email (`tests/integration/auth.test.js`) {deps: T036}. Verify: `npx jest tests/integration/auth.test.js -t 'duplicate email'` exits 0.
- [x] T038 [W-C] Test registration - invalid input (`tests/integration/auth.test.js`) {deps: T036}. Verify: `npx jest tests/integration/auth.test.js -t 'invalid input'` exits 0.
- [x] T039 [W-C] Test login - success case (`tests/integration/auth.test.js`) {deps: T036}. Verify: `npx jest tests/integration/auth.test.js -t 'login success'` exits 0.
- [x] T040 [W-C] Test login - invalid credentials (`tests/integration/auth.test.js`) {deps: T039}. Verify: `npx jest tests/integration/auth.test.js -t 'invalid credentials'` exits 0.
- [x] T041 [W-C] Test protected route - with token (`tests/integration/auth.test.js`) {deps: T039}. Verify: `npx jest tests/integration/auth.test.js -t 'with token'` exits 0.
- [x] T042 [W-C] Test protected route - without token (`tests/integration/auth.test.js`) {deps: T041}. Verify: `npx jest tests/integration/auth.test.js -t 'without token'` exits 0.

### Manual Verification
- [x] T043 Test full user journey in Chrome {deps: T028}. Verify: `npx playwright test --project=chromium` exits 0.
- [x] T044 Test full user journey in Firefox {deps: T043}. Verify: `npx playwright test --project=firefox` exits 0.
- [x] T045 Test edge cases (empty input, max length) {deps: T043}. Verify: `npx jest tests/integration/auth.test.js -t 'max length'` exits 0.
- [x] T046 Verify error messages display correctly {deps: T043}. Verify: `npx playwright test e2e/errors.spec.js` exits 0.

### Documentation
- [x] T047 Update spec.md with implementation notes. Verify: `validate.sh . --strict` prints `RESULT: PASSED`.
- [x] T048 Finalize decision-record.md. Verify: `validate.sh . --strict` prints `RESULT: PASSED`.
- [x] T049 Complete implementation-summary.md. Verify: `validate.sh . --strict` prints `RESULT: PASSED`.
- [x] T050 Mark all checklist items with evidence. Verify: `validate.sh . --strict` prints `RESULT: PASSED`.

**>>> SYNC-003: All workstreams complete - Final verification <<<**


<!-- /ANCHOR:phase-7 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All milestones achieved (M1-M6)
- [x] All sync points passed (SYNC-001, SYNC-002, SYNC-003)
- [x] All unit tests passing (100% for services)
- [x] All integration tests passing
- [x] Manual verification in 2+ browsers
- [x] Security review approved
- [x] Verification checklist in tasks.md fully verified
- [x] All ADRs have status: Accepted
- [x] All approvals obtained (spec.md section 12)


<!-- /ANCHOR:completion -->
---

## Status Updates Log

### 2025-01-15 14:00
- **Task**: T001-T004 - Setup phase
- **Workstream**: W-A
- **Status**: COMPLETED
- **Evidence**: Directory structure created, dependencies installed
- **Next**: T005-T006 (Database)

### 2025-01-16 11:00
- **Task**: T007-T012 - Core services
- **Workstream**: W-A
- **Status**: COMPLETED
- **Evidence**: Hash and Token services tested locally
- **Next**: SYNC-001 → API endpoints

### 2025-01-17 16:00
- **Task**: T013-T028 - API and UI
- **Workstream**: W-B
- **Status**: COMPLETED
- **Evidence**: All endpoints functional, forms rendering
- **Next**: SYNC-002 → Testing

### 2025-01-19 10:00
- **Task**: T031-T042 - Testing
- **Workstream**: W-C
- **Status**: COMPLETED
- **Evidence**: 100% unit coverage, 88% integration coverage
- **Next**: Manual verification

### 2025-01-20 15:00
- **Task**: T043-T050 - Final verification
- **Workstream**: All
- **Status**: COMPLETED
- **Evidence**: All browsers tested, docs complete, approvals obtained
- **Next**: Launch approval


---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See the verification sections in `tasks.md`
- **Decisions**: See `decision-record.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3+ TASKS (~220 lines)
- Core + L2 + L3 + L3+ addendums
- 3-Tier task format with workstream tags
- AI Execution Protocol
- Status updates log
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
