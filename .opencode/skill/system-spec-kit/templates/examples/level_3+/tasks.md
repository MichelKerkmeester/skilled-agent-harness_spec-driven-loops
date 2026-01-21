# Tasks: Add User Authentication

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + all addendums | v2.0 -->

<!-- EXAMPLE: This is a filled-in Level 3+ task list demonstrating full governance
features including 3-Tier Task Format, AI Execution Protocol, and Workstream
organization. Use this for enterprise-scale multi-agent coordination. -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**3-Tier Task Format**: `T### [W-X] [P?] Description (file path) [effort] {deps: T###}`

---

## Milestone Reference

| Milestone | Tasks | Target | Status |
|-----------|-------|--------|--------|
| M1 Foundation | T001-T006 | Day 1 EOD | Complete |
| M2 Services | T007-T012 | Day 2 EOD | Complete |
| M3 API | T013-T022 | Day 3 EOD | Complete |
| M4 UI | T023-T028 | Day 4 noon | Complete |
| M5 Security | T029-T030 | Day 4 EOD | Complete |
| M6 Release | T031-T048 | Day 5 EOD | Complete |

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

## Phase 1: Setup [Milestone M1] [W-A]

- [x] T001 [W-A] Create auth directory structure (`src/auth/`) [15m]
- [x] T002 [W-A] Install bcrypt, jsonwebtoken, express-validator (`package.json`) [10m]
- [x] T003 [W-A] [P] Configure environment variables (`env.example`, `.env`) [15m]
- [x] T004 [W-A] [P] Add User model to Prisma schema (`prisma/schema.prisma`) [20m]

---

## Phase 2: Database [Milestone M1] [W-A]

- [x] T005 [W-A] Run Prisma migration (`prisma/migrations/`) [15m] {deps: T004}
- [x] T006 [W-A] Add unique index on email (`prisma/schema.prisma`) [10m] {deps: T005}

---

## Phase 3: Core Services [Milestone M2] [W-A]

### Hash Service
- [x] T007 [W-A] Implement hashPassword function (`src/utils/hash.js`) [30m] {deps: T002}
- [x] T008 [W-A] Implement verifyPassword function (`src/utils/hash.js`) [20m] {deps: T007}

### Token Service
- [x] T009 [W-A] [P] Implement generateToken function (`src/utils/token.js`) [30m] {deps: T002}
- [x] T010 [W-A] [P] Implement verifyToken function (`src/utils/token.js`) [30m] {deps: T009}

### Validators
- [x] T011 [W-A] [P] Create registration validator (`src/validators/auth.js`) [30m] {deps: T002}
- [x] T012 [W-A] [P] Create login validator (`src/validators/auth.js`) [20m] {deps: T011}

**>>> SYNC-001: W-A Services ready for API integration <<<**

---

## Phase 4: API Endpoints [Milestone M3] [W-B]

### Registration
- [x] T013 [W-B] Create registration route handler (`src/auth/register.js`) [45m] {deps: T007, T011, SYNC-001}
- [x] T014 [W-B] Add user creation with hashed password (`src/auth/register.js`) [30m] {deps: T013}
- [x] T015 [W-B] Add duplicate email check (`src/auth/register.js`) [20m] {deps: T014}

### Login
- [x] T016 [W-B] Create login route handler (`src/auth/login.js`) [30m] {deps: T008, T009, T012}
- [x] T017 [W-B] Add password verification (`src/auth/login.js`) [20m] {deps: T016}
- [x] T018 [W-B] Add token generation on success (`src/auth/login.js`) [20m] {deps: T017}

### Logout
- [x] T019 [W-B] Create logout route handler (`src/auth/logout.js`) [20m] {deps: T010}

### Middleware
- [x] T020 [W-A] Create auth middleware (`src/middleware/auth.js`) [45m] {deps: T010}
- [x] T021 [W-B] Add protected route example (`src/routes/dashboard.js`) [15m] {deps: T020}

### Integration
- [x] T022 [W-B] Wire up all routes in app.js (`app.js`) [20m] {deps: T015, T018, T019, T020}

---

## Phase 5: UI [Milestone M4] [W-B]

- [x] T023 [W-B] Create registration form view (`views/auth/register.ejs`) [30m] {deps: T015}
- [x] T024 [W-B] Create login form view (`views/auth/login.ejs`) [30m] {deps: T018}
- [x] T025 [W-B] [P] Add client-side token storage (`public/js/auth.js`) [30m] {deps: T018}
- [x] T026 [W-B] [P] Add error message styling (`public/css/auth.css`) [20m]
- [x] T027 [W-B] [P] Add success feedback styling (`public/css/auth.css`) [15m]
- [x] T028 [W-B] Add logout button to nav (`views/partials/nav.ejs`) [15m] {deps: T019}

**>>> SYNC-002: W-A, W-B complete - Full integration test suite <<<**

---

## Phase 6: Security Review [Milestone M5]

- [x] T029 Security team review scheduled [0m] {deps: SYNC-002}
- [x] T030 Security review completed and sign-off obtained [4h] {deps: T029}
  - **Reviewer**: Alex (Security Lead)
  - **Date**: 2025-01-17
  - **Status**: Approved with notes (HttpOnly cookies recommended for Phase 2)

---

## Phase 7: Verification [Milestone M6] [W-C]

### Unit Tests
- [x] T031 [W-C] Test hashPassword function (`tests/unit/hash.test.js`) [20m] {deps: T008}
- [x] T032 [W-C] Test verifyPassword function (`tests/unit/hash.test.js`) [15m] {deps: T031}
- [x] T033 [W-C] [P] Test generateToken function (`tests/unit/token.test.js`) [15m] {deps: T010}
- [x] T034 [W-C] [P] Test verifyToken function (`tests/unit/token.test.js`) [15m] {deps: T033}
- [x] T035 [W-C] [P] Test validation schemas (`tests/unit/auth-validator.test.js`) [30m] {deps: T012}

### Integration Tests
- [x] T036 [W-C] Test registration - success case (`tests/integration/auth.test.js`) [20m] {deps: SYNC-002}
- [x] T037 [W-C] Test registration - duplicate email (`tests/integration/auth.test.js`) [15m] {deps: T036}
- [x] T038 [W-C] Test registration - invalid input (`tests/integration/auth.test.js`) [15m] {deps: T036}
- [x] T039 [W-C] Test login - success case (`tests/integration/auth.test.js`) [20m] {deps: T036}
- [x] T040 [W-C] Test login - invalid credentials (`tests/integration/auth.test.js`) [15m] {deps: T039}
- [x] T041 [W-C] Test protected route - with token (`tests/integration/auth.test.js`) [15m] {deps: T039}
- [x] T042 [W-C] Test protected route - without token (`tests/integration/auth.test.js`) [10m] {deps: T041}

### Manual Verification
- [x] T043 Test full user journey in Chrome [30m] {deps: T028}
- [x] T044 Test full user journey in Firefox [20m] {deps: T043}
- [x] T045 Test edge cases (empty input, max length) [20m] {deps: T043}
- [x] T046 Verify error messages display correctly [15m] {deps: T043}

### Documentation
- [x] T047 Update spec.md with implementation notes [15m]
- [x] T048 Finalize decision-record.md [20m]
- [x] T049 Complete implementation-summary.md [20m]
- [x] T050 Mark all checklist items with evidence [20m]

**>>> SYNC-003: All workstreams complete - Final verification <<<**

---

## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All milestones achieved (M1-M6)
- [x] All sync points passed (SYNC-001, SYNC-002, SYNC-003)
- [x] All unit tests passing (100% for services)
- [x] All integration tests passing
- [x] Manual verification in 2+ browsers
- [x] Security review approved
- [x] Checklist.md fully verified
- [x] All ADRs have status: Accepted
- [x] All approvals obtained (spec.md section 12)

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

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`

---

<!--
LEVEL 3+ TASKS (~220 lines)
- Core + L2 + L3 + L3+ addendums
- 3-Tier task format with workstream tags
- AI Execution Protocol
- Status updates log
-->
