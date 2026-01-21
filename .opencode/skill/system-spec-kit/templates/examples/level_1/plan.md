# Implementation Plan: Add User Authentication

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.0 -->

<!-- EXAMPLE: This is a filled-in Level 1 plan demonstrating the minimal technical
planning required for a simple authentication feature. Note the straightforward
3-phase structure without complex dependencies. -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ES6+) |
| **Framework** | Express.js with EJS templates |
| **Storage** | PostgreSQL with Prisma ORM |
| **Testing** | Jest for unit tests, manual browser testing |

### Overview
This implementation adds email/password authentication using bcrypt for password hashing and JWT tokens for session management. The approach prioritizes security best practices while maintaining simplicity for this initial authentication feature.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)

---

## 3. ARCHITECTURE

### Pattern
MVC - Following existing Express.js application structure

### Key Components
- **AuthController**: Handles registration and login requests
- **UserModel**: Prisma model for user data with hashed passwords
- **AuthMiddleware**: Validates JWT tokens on protected routes
- **HashService**: Encapsulates bcrypt hashing logic

### Data Flow
1. User submits credentials via form
2. Controller validates input and calls UserModel
3. For registration: hash password, create user record
4. For login: verify password hash, generate JWT token
5. Token stored client-side, sent with subsequent requests
6. Middleware validates token and attaches user to request

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Project structure created (auth/ directory)
- [x] Dependencies installed (bcrypt, jsonwebtoken)
- [x] Development environment ready (test database seeded)

### Phase 2: Core Implementation
- [x] User model with email and passwordHash fields
- [x] Registration endpoint with validation
- [x] Login endpoint with token generation
- [x] Auth middleware for protected routes

### Phase 3: Verification
- [x] Manual testing complete
- [x] Edge cases handled (duplicate email, invalid password)
- [x] Documentation updated

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Hash functions, token generation | Jest |
| Integration | Registration/login API endpoints | Supertest |
| Manual | Full user journey, error states | Browser (Chrome) |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| bcrypt | External | Green | Use crypto.scrypt fallback |
| jsonwebtoken | External | Green | Cannot generate tokens |
| Prisma | Internal | Green | Cannot persist users |
| PostgreSQL | Internal | Green | All auth features blocked |

---

## 7. ROLLBACK PLAN

- **Trigger**: Critical security vulnerability discovered, or login breaks existing functionality
- **Procedure**:
  1. Revert all commits in the `012-user-authentication` branch
  2. Drop the `users` table (no existing user data to preserve)
  3. Remove auth routes from app.js

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
