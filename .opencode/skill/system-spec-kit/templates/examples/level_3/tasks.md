---
title: "Tasks: Add User Authentication [template:examples/level_3/tasks.md]"
description: "including dependencies, milestone mapping, and detailed verification tasks. -->"
trigger_phrases:
  - "tasks"
  - "add"
  - "user"
  - "authentication"
  - "template"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Add User Authentication

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

<!-- EXAMPLE: This is a filled-in Level 3 task list with comprehensive tracking
including dependencies, milestone mapping, and detailed verification tasks. -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] {deps: T###}`


<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Target |
|-----------|-------|--------|
| M1 | T001-T006 | Day 1 EOD |
| M2 | T007-T012 | Day 2 EOD |
| M3 | T013-T022 | Day 3 EOD |
| M4 | T023-T028 | Day 4 noon |
| M5 | T029-T042 | Day 5 EOD |


<!-- /ANCHOR:milestones -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [Milestone M1]

- [x] T001 Create auth directory structure (`src/auth/`) [15m]
- [x] T002 Install bcrypt, jsonwebtoken, express-validator (`package.json`) [10m]
- [x] T003 [P] Configure environment variables (`env.example`, `.env`) [15m]
- [x] T004 [P] Add User model to Prisma schema (`prisma/schema.prisma`) [20m]


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Database [Milestone M1]

- [x] T005 Run Prisma migration (`prisma/migrations/`) [15m] {deps: T004}
- [x] T006 Add unique index on email (`prisma/schema.prisma`) [10m] {deps: T005}


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Core Services [Milestone M2]

### Hash Service
- [x] T007 Implement hashPassword function (`src/utils/hash.js`) [30m] {deps: T002}
- [x] T008 Implement verifyPassword function (`src/utils/hash.js`) [20m] {deps: T007}

### Token Service
- [x] T009 [P] Implement generateToken function (`src/utils/token.js`) [30m] {deps: T002}
- [x] T010 [P] Implement verifyToken function (`src/utils/token.js`) [30m] {deps: T009}

### Validators
- [x] T011 [P] Create registration validator (`src/validators/auth.js`) [30m] {deps: T002}
- [x] T012 [P] Create login validator (`src/validators/auth.js`) [20m] {deps: T011}


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: API Endpoints [Milestone M3]

### Registration
- [x] T013 Create registration route handler (`src/auth/register.js`) [45m] {deps: T007, T011}
- [x] T014 Add user creation with hashed password (`src/auth/register.js`) [30m] {deps: T013}
- [x] T015 Add duplicate email check (`src/auth/register.js`) [20m] {deps: T014}

### Login
- [x] T016 Create login route handler (`src/auth/login.js`) [30m] {deps: T008, T009, T012}
- [x] T017 Add password verification (`src/auth/login.js`) [20m] {deps: T016}
- [x] T018 Add token generation on success (`src/auth/login.js`) [20m] {deps: T017}

### Logout
- [x] T019 Create logout route handler (`src/auth/logout.js`) [20m] {deps: T010}

### Middleware
- [x] T020 Create auth middleware (`src/middleware/auth.js`) [45m] {deps: T010}
- [x] T021 Add protected route example (`src/routes/dashboard.js`) [15m] {deps: T020}

### Integration
- [x] T022 Wire up all routes in app.js (`app.js`) [20m] {deps: T015, T018, T019, T020}


<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:phase-5 -->
## Phase 5: UI [Milestone M4]

- [x] T023 Create registration form view (`views/auth/register.ejs`) [30m] {deps: T015}
- [x] T024 Create login form view (`views/auth/login.ejs`) [30m] {deps: T018}
- [x] T025 [P] Add client-side token storage (`public/js/auth.js`) [30m] {deps: T018}
- [x] T026 [P] Add error message styling (`public/css/auth.css`) [20m]
- [x] T027 [P] Add success feedback styling (`public/css/auth.css`) [15m]
- [x] T028 Add logout button to nav (`views/partials/nav.ejs`) [15m] {deps: T019}


<!-- /ANCHOR:phase-5 -->
---

<!-- ANCHOR:phase-6 -->
## Phase 6: Verification [Milestone M5]

### Unit Tests
- [x] T029 Test hashPassword function (`tests/unit/hash.test.js`) [20m] {deps: T008}
- [x] T030 Test verifyPassword function (`tests/unit/hash.test.js`) [15m] {deps: T029}
- [x] T031 [P] Test generateToken function (`tests/unit/token.test.js`) [15m] {deps: T010}
- [x] T032 [P] Test verifyToken function (`tests/unit/token.test.js`) [15m] {deps: T031}
- [x] T033 [P] Test validation schemas (`tests/unit/auth-validator.test.js`) [30m] {deps: T012}

### Integration Tests
- [x] T034 Test registration - success case (`tests/integration/auth.test.js`) [20m] {deps: T022}
- [x] T035 Test registration - duplicate email (`tests/integration/auth.test.js`) [15m] {deps: T034}
- [x] T036 Test registration - invalid input (`tests/integration/auth.test.js`) [15m] {deps: T034}
- [x] T037 Test login - success case (`tests/integration/auth.test.js`) [20m] {deps: T034}
- [x] T038 Test login - invalid credentials (`tests/integration/auth.test.js`) [15m] {deps: T037}
- [x] T039 Test protected route - with token (`tests/integration/auth.test.js`) [15m] {deps: T037}
- [x] T040 Test protected route - without token (`tests/integration/auth.test.js`) [10m] {deps: T039}

### Manual Verification
- [x] T041 Test full user journey in Chrome [30m] {deps: T028}
- [x] T042 Test full user journey in Firefox [20m] {deps: T041}
- [x] T043 Test edge cases (empty input, max length) [20m] {deps: T041}
- [x] T044 Verify error messages display correctly [15m] {deps: T041}

### Documentation
- [x] T045 Update spec.md with implementation notes [15m]
- [x] T046 Finalize decision-record.md [20m]
- [x] T047 Complete implementation-summary.md [20m]
- [x] T048 Mark all checklist items with evidence [20m]


<!-- /ANCHOR:phase-6 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All milestones achieved
- [x] All unit tests passing (100% for services)
- [x] All integration tests passing
- [x] Manual verification in 2+ browsers
- [x] Checklist.md fully verified
- [x] All ADRs have status: Accepted


<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3 TASKS (~160 lines)
- Core + L2 + L3 detail
- Task dependencies explicit
- Milestone mapping
-->
