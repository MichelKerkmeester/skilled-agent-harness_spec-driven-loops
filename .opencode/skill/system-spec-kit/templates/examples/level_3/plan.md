---
title: "Implementation Plan: Add User Authentication [template:examples/level_3/plan.md]"
description: "planning. Note the addition of Dependency Graph, Critical Path, Milestones, and"
trigger_phrases:
  - "implementation"
  - "plan"
  - "add"
  - "user"
  - "authentication"
  - "template"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Add User Authentication

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

<!-- EXAMPLE: This is a filled-in Level 3 plan demonstrating architecture-focused
planning. Note the addition of Dependency Graph, Critical Path, Milestones, and
embedded ADRs compared to Level 2. Use this for complex features (500+ LOC). -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ES6+), Node.js 18+ |
| **Framework** | Express.js 4.x with EJS templates |
| **Storage** | PostgreSQL 14+ with Prisma ORM 5.x |
| **Testing** | Jest 29.x, Supertest for integration |

### Overview
This implementation adds a complete email/password authentication system using bcrypt for password hashing and JWT tokens for stateless session management. The architecture follows established patterns in the codebase (MVC) while introducing reusable utilities for hashing and token management that will support future auth features.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] NFRs defined with targets
- [x] Architecture decisions documented (ADRs)

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (unit and integration)
- [x] Coverage > 80%
- [x] Docs updated (spec/plan/tasks)
- [x] Checklist items verified
- [x] Security review passed


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
MVC - Following existing Express.js application structure

### Key Components
- **AuthController** (`src/auth/`): Handles registration, login, logout requests
- **UserModel** (`prisma/`): Prisma model for user data with hashed passwords
- **AuthMiddleware** (`src/middleware/auth.js`): Validates JWT tokens on protected routes
- **HashService** (`src/utils/hash.js`): Encapsulates bcrypt hashing logic
- **TokenService** (`src/utils/token.js`): JWT generation and validation
- **AuthValidator** (`src/validators/auth.js`): Input validation schemas

### Data Flow
```
User Request → Validator → Controller → Service → Model → Database
                                ↓
                         TokenService (JWT)
                                ↓
                         HashService (bcrypt)
```

### Component Diagram
```
┌──────────────────────────────────────────────────────────────┐
│                        Express App                            │
├──────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  Register   │  │    Login    │  │   Logout    │          │
│  │  Controller │  │  Controller │  │  Controller │          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
│         │                │                │                  │
│         └────────────────┼────────────────┘                  │
│                          ▼                                   │
│         ┌────────────────────────────────┐                   │
│         │         Auth Middleware         │                   │
│         └────────────────┬───────────────┘                   │
│                          ▼                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ HashService │  │TokenService │  │  Validator  │          │
│  │   (bcrypt)  │  │    (JWT)    │  │ (express-v) │          │
│  └──────┬──────┘  └──────┬──────┘  └─────────────┘          │
│         │                │                                   │
│         └────────────────┼───────────────────────────────────┤
│                          ▼                                   │
│         ┌────────────────────────────────┐                   │
│         │      Prisma ORM (User Model)    │                   │
│         └────────────────┬───────────────┘                   │
└──────────────────────────┼───────────────────────────────────┘
                           ▼
                    ┌─────────────┐
                    │ PostgreSQL  │
                    └─────────────┘
```


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (Day 1 AM)
- [x] Project structure created (auth/ directory)
- [x] Dependencies installed (bcrypt, jsonwebtoken, express-validator)
- [x] Environment variables configured
- [x] Development environment ready (test database seeded)

### Phase 2: Database Layer (Day 1 PM)
- [x] User model with email and passwordHash fields
- [x] Prisma migration created and applied
- [x] Database indexes on email field

### Phase 3: Core Services (Day 2)
- [x] HashService with bcrypt wrapper
- [x] TokenService with JWT generation/validation
- [x] Input validation schemas

### Phase 4: API Endpoints (Day 3)
- [x] Registration endpoint with validation
- [x] Login endpoint with token generation
- [x] Logout endpoint
- [x] Auth middleware for protected routes

### Phase 5: UI (Day 4 AM)
- [x] Registration form view
- [x] Login form view
- [x] Error message styling
- [x] Success feedback

### Phase 6: Verification (Day 4 PM - Day 5)
- [x] Unit tests for services
- [x] Integration tests for endpoints
- [x] Manual testing complete
- [x] Edge cases handled
- [x] Documentation updated


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Coverage Target |
|-----------|-------|-------|-----------------|
| Unit | Hash, Token, Validators | Jest | 100% |
| Integration | API endpoints | Supertest | 85% |
| Manual | User journeys, edge cases | Browser | Critical paths |
| Security | OWASP basics | Manual review | Auth-specific items |


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| bcrypt@5.1.1 | External | Green | Use crypto.scrypt fallback |
| jsonwebtoken@9.0.0 | External | Green | Cannot generate tokens |
| express-validator@7.0.1 | External | Green | Manual validation fallback |
| Prisma@5.x | Internal | Green | Cannot persist users |
| PostgreSQL@14+ | Internal | Green | All auth features blocked |


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Critical security vulnerability, or breaks existing functionality
- **Procedure**: Revert commits, drop users table, remove auth routes


<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┬──────────────────────────────────────────┐
                      │                                          │
Phase 2 (Database) ───┴──> Phase 3 (Services) ──> Phase 4 (API) ─┴──> Phase 5 (UI) ──> Phase 6 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Database, Services |
| Database | Setup | Services, API |
| Services | Setup, Database | API |
| API | Services | UI |
| UI | API | Verify |
| Verify | All | None |


<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 2 hours |
| Database | Low | 2 hours |
| Services | Medium | 4 hours |
| API Endpoints | Medium | 6 hours |
| UI | Low | 3 hours |
| Verification | Medium | 5 hours |
| **Total** | | **22 hours (~3 days)** |


<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Database backup created
- [x] Git tag created (pre-auth)
- [x] Monitoring alerts configured

### Rollback Procedure
1. **Immediate**: Disable auth routes in app.js
2. **Revert code**: `git revert HEAD~N` for auth commits
3. **Database**: Run down migration to drop users table
4. **Verify**: Confirm app loads without auth routes
5. **Notify**: Post in #engineering channel

### Data Reversal
- **Has data migrations?** Yes (users table)
- **Reversal procedure**: `npx prisma migrate rollback` or manual DROP TABLE


<!-- /ANCHOR:l2-rollback -->
---

<!-- ANCHOR:l3-dep-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐
│   Setup     │
│  (Phase 1)  │
└──────┬──────┘
       │
       ├────────────────────┐
       │                    │
       ▼                    ▼
┌─────────────┐      ┌─────────────┐
│  Database   │      │  Services   │
│  (Phase 2)  │◄─────│  (Phase 3)  │
└──────┬──────┘      └──────┬──────┘
       │                    │
       └────────┬───────────┘
                │
                ▼
         ┌─────────────┐
         │     API     │
         │  (Phase 4)  │
         └──────┬──────┘
                │
                ▼
         ┌─────────────┐
         │     UI      │
         │  (Phase 5)  │
         └──────┬──────┘
                │
                ▼
         ┌─────────────┐
         │   Verify    │
         │  (Phase 6)  │
         └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Setup | None | Config, packages | All |
| Database | Setup | User model | Services, API |
| HashService | Setup | hash(), verify() | API |
| TokenService | Setup | sign(), verify() | API, Middleware |
| Validator | Setup | schemas | API |
| AuthMiddleware | TokenService | auth() | Protected routes |
| API Endpoints | Services | /register, /login, /logout | UI |
| UI | API | Forms, feedback | Verify |


<!-- /ANCHOR:l3-dep-graph -->
---

<!-- ANCHOR:l3-critical-path -->
## L3: CRITICAL PATH

1. **Setup** - 2 hours - CRITICAL
2. **Database (User Model)** - 2 hours - CRITICAL
3. **Services (Hash, Token)** - 4 hours - CRITICAL
4. **API Endpoints** - 6 hours - CRITICAL
5. **Verification** - 5 hours - CRITICAL

**Total Critical Path**: 19 hours

**Parallel Opportunities**:
- HashService and TokenService can be developed simultaneously
- UI can start after API stubs are defined
- Unit tests can be written alongside service implementation


<!-- /ANCHOR:l3-critical-path -->
---

<!-- ANCHOR:l3-milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Foundation | Setup complete, Prisma model ready | Day 1 EOD |
| M2 | Core Services | Hash and Token services working | Day 2 EOD |
| M3 | API Complete | All endpoints functional | Day 3 EOD |
| M4 | UI Complete | Forms rendering, submitting | Day 4 noon |
| M5 | Release Ready | All tests pass, docs complete | Day 5 EOD |


<!-- /ANCHOR:l3-milestones -->
---

<!-- ANCHOR:l3-adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

See `decision-record.md` for full ADRs:

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | JWT over sessions | Stateless, scales better, API-friendly |
| ADR-002 | bcrypt with 10 rounds | Industry standard, good security/perf balance |
| ADR-003 | localStorage for tokens | Simple MVP, HttpOnly cookies in Phase 2 |

<!-- /ANCHOR:l3-adr-summary -->

---

<!--
LEVEL 3 PLAN (~260 lines)
- Core + L2 + L3 addendums
- Full dependency graph and critical path
- Milestones and ADR summary
-->
