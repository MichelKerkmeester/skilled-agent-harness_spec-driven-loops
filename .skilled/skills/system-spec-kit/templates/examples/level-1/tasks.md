---
title: "Tasks: Add User Authentication"
description: "Level 1 task list for the user authentication example, with straightforward sequential task numbering."
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "user authentication"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Add User Authentication

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- EXAMPLE: This is a filled-in Level 1 task list showing the minimal task tracking
needed for a simple authentication feature. Note the straightforward task numbering
and simple phase structure. -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`


<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create auth directory structure (`src/auth/`). Verify: `ls src/auth` exits 0.
- [x] T002 Install bcrypt and jsonwebtoken (`package.json`). Verify: `npm ls bcrypt jsonwebtoken` prints both versions.
- [x] T003 [P] Add User model to Prisma schema (`prisma/schema.prisma`). Verify: `npx prisma validate` prints that the schema is valid.


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement password hashing utility (`src/utils/hash.js`). Verify: `node --check src/utils/hash.js` exits 0.
- [x] T005 Create registration endpoint (`src/auth/register.js`). Verify: `curl -si -X POST localhost:3000/auth/register` prints `HTTP/1.1 400`.
- [x] T006 Create login endpoint (`src/auth/login.js`). Verify: `curl -si -X POST localhost:3000/auth/login` prints `HTTP/1.1 400`.
- [x] T007 Add auth middleware (`src/middleware/auth.js`). Verify: `node --check src/middleware/auth.js` exits 0.
- [x] T008 [P] Create registration form view (`views/auth/register.ejs`). Verify: `curl -s localhost:3000/register | rg -c '<form'` prints 1.
- [x] T009 [P] Create login form view (`views/auth/login.ejs`). Verify: `curl -s localhost:3000/login | rg -c '<form'` prints 1.
- [x] T010 Wire up routes in app.js (`app.js`). Verify: `curl -si -X POST localhost:3000/auth/login` prints `HTTP/1.1 400`.


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Test registration with valid data. Verify: `npx jest tests/integration/auth.test.js -t 'registration success'` exits 0.
- [x] T012 Test registration with duplicate email (expect error). Verify: `npx jest tests/integration/auth.test.js -t 'duplicate email'` exits 0.
- [x] T013 Test login with valid credentials. Verify: `npx jest tests/integration/auth.test.js -t 'login success'` exits 0.
- [x] T014 Test login with invalid credentials (expect error). Verify: `npx jest tests/integration/auth.test.js -t 'invalid credentials'` exits 0.
- [x] T015 Verify session persistence after page refresh. Verify: `npx playwright test e2e/session.spec.js` exits 0.
- [x] T016 Update spec documentation with implementation notes. Verify: `validate.sh . --strict` prints `RESULT: PASSED`.


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed


<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
