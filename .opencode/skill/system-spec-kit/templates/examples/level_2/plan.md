# Implementation Plan: Add User Authentication

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.0 -->

<!-- EXAMPLE: This is a filled-in Level 2 plan demonstrating verification-focused
planning. Note the addition of Phase Dependencies, Effort Estimation, and Enhanced
Rollback sections compared to Level 1. -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ES6+) |
| **Framework** | Express.js with EJS templates |
| **Storage** | PostgreSQL with Prisma ORM |
| **Testing** | Jest for unit tests, Supertest for integration |

### Overview
This implementation adds email/password authentication using bcrypt for password hashing and JWT tokens for session management. The approach prioritizes security best practices while maintaining simplicity for this initial authentication feature.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] NFRs defined with targets

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (unit and integration)
- [x] Docs updated (spec/plan/tasks)
- [x] Checklist items verified

---

## 3. ARCHITECTURE

### Pattern
MVC - Following existing Express.js application structure

### Key Components
- **AuthController**: Handles registration and login requests
- **UserModel**: Prisma model for user data with hashed passwords
- **AuthMiddleware**: Validates JWT tokens on protected routes
- **HashService**: Encapsulates bcrypt hashing logic
- **AuthValidator**: Input validation schemas

### Data Flow
1. User submits credentials via form
2. Validator checks input format
3. Controller validates input and calls UserModel
4. For registration: hash password, create user record
5. For login: verify password hash, generate JWT token
6. Token stored client-side, sent with subsequent requests
7. Middleware validates token and attaches user to request

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Project structure created (auth/ directory)
- [x] Dependencies installed (bcrypt, jsonwebtoken, express-validator)
- [x] Development environment ready (test database seeded)

### Phase 2: Core Implementation
- [x] User model with email and passwordHash fields
- [x] Input validation schemas
- [x] Registration endpoint with validation
- [x] Login endpoint with token generation
- [x] Auth middleware for protected routes

### Phase 3: Verification
- [x] Unit tests for hash functions
- [x] Integration tests for API endpoints
- [x] Manual testing complete
- [x] Edge cases handled (duplicate email, invalid password)
- [x] Documentation updated

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Hash functions, validators, token generation | Jest |
| Integration | Registration/login API endpoints | Supertest |
| Manual | Full user journey, error states, edge cases | Browser (Chrome, Firefox) |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| bcrypt | External | Green | Use crypto.scrypt fallback |
| jsonwebtoken | External | Green | Cannot generate tokens |
| express-validator | External | Green | Manual validation fallback |
| Prisma | Internal | Green | Cannot persist users |
| PostgreSQL | Internal | Green | All auth features blocked |

---

## 7. ROLLBACK PLAN

- **Trigger**: Critical security vulnerability discovered, or login breaks existing functionality
- **Procedure**: Revert commits, drop users table, remove auth routes

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──> Phase 2 (Core) ──> Phase 3 (Verify)
Phase 1.5 (Schema) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Schema |
| Schema | Setup | Core |
| Core | Setup, Schema | Verify |
| Verify | Core | None |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Schema (Prisma model) | Low | 30 minutes |
| Core Implementation | Medium | 4-6 hours |
| Testing & Verification | Medium | 2-3 hours |
| **Total** | | **7.5-10.5 hours** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (database snapshot)
- [ ] Feature flag configured (N/A - core auth feature)
- [x] Monitoring alerts set (error rate spike)

### Rollback Procedure
1. **Immediate**: Disable auth routes in app.js (comment out)
2. **Revert code**: `git revert HEAD~N` for auth commits
3. **Database**: `DROP TABLE users;` (no existing data to preserve)
4. **Verify**: Confirm app loads without auth routes
5. **Notify**: Post in #engineering channel if user-facing impact

### Data Reversal
- **Has data migrations?** Yes (users table)
- **Reversal procedure**: DROP TABLE users; (no data to preserve for new feature)

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
-->
