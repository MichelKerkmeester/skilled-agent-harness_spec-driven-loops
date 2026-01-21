# Tasks: Add User Authentication

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.0 -->

<!-- EXAMPLE: This is a filled-in Level 1 task list showing the minimal task tracking
needed for a simple authentication feature. Note the straightforward task numbering
and simple phase structure. -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

---

## Phase 1: Setup

- [x] T001 Create auth directory structure (`src/auth/`)
- [x] T002 Install bcrypt and jsonwebtoken (`package.json`)
- [x] T003 [P] Add User model to Prisma schema (`prisma/schema.prisma`)

---

## Phase 2: Implementation

- [x] T004 Implement password hashing utility (`src/utils/hash.js`)
- [x] T005 Create registration endpoint (`src/auth/register.js`)
- [x] T006 Create login endpoint (`src/auth/login.js`)
- [x] T007 Add auth middleware (`src/middleware/auth.js`)
- [x] T008 [P] Create registration form view (`views/auth/register.ejs`)
- [x] T009 [P] Create login form view (`views/auth/login.ejs`)
- [x] T010 Wire up routes in app.js (`app.js`)

---

## Phase 3: Verification

- [x] T011 Test registration with valid data
- [x] T012 Test registration with duplicate email (expect error)
- [x] T013 Test login with valid credentials
- [x] T014 Test login with invalid credentials (expect error)
- [x] T015 Verify session persistence after page refresh
- [x] T016 Update spec documentation with implementation notes

---

## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
