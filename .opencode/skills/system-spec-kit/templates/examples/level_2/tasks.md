---
title: "Tasks: Add User Authentication [template:examples/level_2/tasks.md]"
description: "including effort estimates and explicit verification tasks for each feature. -->"
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

**Task Format**: `T### [P?] Description (file path) [effort]`


<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup (1 hour)

- [x] T001 Create auth directory structure (`src/auth/`) [15m]
- [x] T002 Install bcrypt, jsonwebtoken, express-validator (`package.json`) [10m]
- [x] T003 [P] Add User model to Prisma schema (`prisma/schema.prisma`) [20m]
- [x] T004 [P] Run Prisma migration (`prisma/migrations/`) [15m]


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation (4-6 hours)

### Core Utilities
- [x] T005 Implement password hashing utility (`src/utils/hash.js`) [30m]
- [x] T006 Create input validation schemas (`src/validators/auth.js`) [30m]

### API Endpoints
- [x] T007 Create registration endpoint (`src/auth/register.js`) [1h]
- [x] T008 Create login endpoint (`src/auth/login.js`) [1h]
- [x] T009 Add auth middleware (`src/middleware/auth.js`) [45m]

### UI Components
- [x] T010 [P] Create registration form view (`views/auth/register.ejs`) [30m]
- [x] T011 [P] Create login form view (`views/auth/login.ejs`) [30m]
- [x] T012 [P] Add error message styling (`public/css/auth.css`) [20m]

### Integration
- [x] T013 Wire up routes in app.js (`app.js`) [15m]


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification (2-3 hours)

### Unit Tests
- [x] T014 Test hash utility functions (`tests/unit/hash.test.js`) [30m]
- [x] T015 Test validation schemas (`tests/unit/auth-validator.test.js`) [30m]

### Integration Tests
- [x] T016 Test registration endpoint - success case (`tests/integration/auth.test.js`) [20m]
- [x] T017 Test registration endpoint - duplicate email (`tests/integration/auth.test.js`) [15m]
- [x] T018 Test login endpoint - success case (`tests/integration/auth.test.js`) [20m]
- [x] T019 Test login endpoint - invalid credentials (`tests/integration/auth.test.js`) [15m]

### Manual Verification
- [x] T020 Test full registration flow in browser [15m]
- [x] T021 Test full login flow in browser [15m]
- [x] T022 Test session persistence after refresh [10m]
- [x] T023 Verify error messages display correctly [10m]
- [x] T024 Test in Firefox (cross-browser) [15m]

### Documentation
- [x] T025 Update spec.md with implementation notes [15m]
- [x] T026 Complete implementation-summary.md [20m]
- [x] T027 Mark all checklist items with evidence [15m]


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All unit tests passing
- [x] All integration tests passing
- [x] Manual verification passed
- [x] Checklist.md fully verified


<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS (~100 lines)
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks
-->
