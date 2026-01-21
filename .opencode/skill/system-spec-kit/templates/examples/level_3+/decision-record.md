# Decision Record: Add User Authentication

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.0 -->

<!-- EXAMPLE: This is a filled-in Level 3+ decision record with the same ADRs as
Level 3, demonstrating that governance-level features are primarily in spec.md,
plan.md, tasks.md, and checklist.md. Decision records remain focused on technical
architecture decisions. -->

---

## ADR-001: Session Management Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-01-15 |
| **Deciders** | Tech Lead (Jordan), Security Lead (Alex), Senior Developer (Chris) |
| **Complexity Score Impact** | +15 (Risk dimension) |

---

### Context

The application needs session management to maintain user authentication state across requests. This is a foundational decision that affects security, scalability, and the architecture of all future authentication-related features. Given the enterprise context (Level 3+), this decision requires formal sign-off from multiple stakeholders.

### Constraints
- Must work with existing Express.js architecture
- Should support future API clients (mobile app planned Q2 2025)
- Infrastructure currently single-server, but horizontal scaling planned Q3 2025
- Development team experienced with both approaches
- Security team requires review of any session management approach

---

### Decision

**Summary**: Use JWT (JSON Web Tokens) for stateless session management instead of server-side sessions.

**Details**: Authentication tokens will be generated on login, contain user ID and expiration, and be signed with a secret key. Tokens will be validated on each request by the auth middleware. Initial storage will be localStorage with a planned migration to HttpOnly cookies in Phase 2.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **JWT Tokens** | Stateless, scales horizontally, works with APIs, no session store needed | Token revocation complex, larger than session ID, XSS risk with localStorage | 8/10 |
| Server-side Sessions | Easy revocation, smaller payload, HttpOnly by default | Requires session store (Redis), harder to scale, not ideal for APIs | 6/10 |
| Session + JWT hybrid | Best of both, immediate revocation | Complex implementation, two systems to maintain | 5/10 |

**Why Chosen**: JWT provides the best balance of simplicity and future-proofing. The stateless nature simplifies horizontal scaling (planned Q3 2025) and API integration (mobile app Q2 2025). Token revocation limitations are acceptable for MVP since 24-hour expiry provides reasonable security.

**Security Team Input**: Alex (Security Lead) approved with recommendation to migrate to HttpOnly cookies in Phase 2 to mitigate XSS risk.

---

### Consequences

**Positive**:
- No external session store dependency (no Redis)
- Horizontal scaling will be straightforward
- Same auth mechanism works for web and future API clients
- Simpler server architecture

**Negative**:
- Cannot immediately revoke tokens (user must wait for expiry) - Mitigation: Short expiry (24h), refresh tokens in Phase 2
- Tokens larger than session IDs - Mitigation: Acceptable overhead for our use case
- localStorage XSS vulnerability - Mitigation: HttpOnly cookies in Phase 2

**Risks**:
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Token stolen via XSS | High | Medium | Phase 2 HttpOnly cookies, CSP headers |
| Secret key compromised | High | Low | Environment variable, rotation procedure documented |
| Token replay attack | Medium | Low | Short expiry, future: token binding |

---

### Implementation

**Affected Systems**:
- Auth middleware (new)
- Login endpoint (new)
- All protected routes (modified to use middleware)
- Future: API authentication, mobile app

**Rollback**: Revert to cookieless state; no external dependencies to remove.

**Workstream**: W-A (Core Services)

---

---

## ADR-002: Password Hashing Algorithm

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-01-15 |
| **Deciders** | Tech Lead (Jordan), Security Lead (Alex) |
| **Complexity Score Impact** | +10 (Research dimension) |

---

### Context

User passwords must be securely hashed before storage to protect user data in case of database breach. The hashing algorithm choice affects security strength and server performance (hash computation time). This decision is security-critical and requires Security team approval.

### Constraints
- Must be resistant to rainbow table and brute force attacks
- Hash computation should complete in < 1 second for acceptable UX
- Must be well-supported in Node.js ecosystem
- Should be an industry-standard algorithm
- Security team approval required

---

### Decision

**Summary**: Use bcrypt with a cost factor of 10 for password hashing.

**Details**: The `bcrypt` npm package (v5.1.1) will be used with 10 salt rounds. This provides approximately 100ms hash time on current hardware while maintaining strong security. The cost factor can be increased over time as hardware improves.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **bcrypt (10 rounds)** | Industry standard, well-tested, good library support, built-in salt | Memory-efficient (attackers can use GPU), slightly slower than scrypt | 9/10 |
| Argon2id | Memory-hard (GPU-resistant), PHC winner, configurable | Newer library, less ecosystem support, more complex config | 8/10 |
| PBKDF2 | NIST approved, widely available | Not memory-hard, requires careful parameter tuning | 6/10 |
| scrypt | Memory-hard, proven | Less Node.js library support, complex parameters | 7/10 |

**Why Chosen**: bcrypt is the most widely adopted solution with excellent Node.js support. While Argon2 is technically superior, bcrypt's maturity, simplicity, and ecosystem support make it the pragmatic choice. The cost factor of 10 rounds (~100ms) provides good security while maintaining acceptable login performance.

**Security Team Input**: Alex (Security Lead) approved bcrypt with 10 rounds as meeting security requirements. Recommended monitoring hash time as hardware improves and increasing cost factor annually.

---

### Consequences

**Positive**:
- Industry-standard security level
- Well-understood by security auditors
- Simple API (hash/verify)
- Automatic salt generation and storage

**Negative**:
- Not memory-hard (GPU attacks possible) - Mitigation: Acceptable risk; cost factor provides protection
- Fixed memory usage - Mitigation: bcrypt security is still sufficient for most threat models

**Risks**:
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| bcrypt vulnerability discovered | High | Low | Monitor CVEs, upgrade promptly, cost factor increase possible |
| Cost factor too low for future hardware | Medium | Medium | Plan to increase cost factor annually; currently sufficient |

---

### Implementation

**Affected Systems**:
- Registration endpoint (hash on create)
- Login endpoint (verify on login)
- Password change feature (future)

**Workstream**: W-A (Core Services)

**Rollback**: N/A - this is a forward-only decision. Existing hashes remain valid; new algorithm would require migration.

---

---

## ADR-003: Client-Side Token Storage

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-01-15 |
| **Deciders** | Tech Lead (Jordan), Security Lead (Alex), Frontend Lead |
| **Complexity Score Impact** | +5 (Risk dimension - security trade-off) |

---

### Context

JWT tokens need to be stored client-side for authenticated requests. The storage mechanism choice affects security (XSS, CSRF risks) and implementation complexity. This decision has known security trade-offs that require explicit approval.

### Constraints
- Must persist across page refreshes
- Must be accessible for API requests (Authorization header)
- Should work with existing frontend architecture (EJS + vanilla JS)
- Phase 1 is MVP; security improvements can follow
- Security team must approve trade-off

---

### Decision

**Summary**: Store JWT tokens in localStorage for Phase 1, with planned migration to HttpOnly cookies in Phase 2.

**Details**: Tokens will be stored in localStorage after successful login and sent via Authorization header on each request. This is a known security trade-off (XSS vulnerability) that is acceptable for MVP with the documented plan to migrate to HttpOnly cookies.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **localStorage** | Simple, works with API clients, survives refresh | XSS vulnerable, accessible to JS | 7/10 |
| HttpOnly Cookies | XSS-safe, automatic sending | CSRF vulnerability, more server config, complex for APIs | 8/10 |
| sessionStorage | XSS vulnerable but tab-isolated | Lost on tab close, poor UX for auth | 4/10 |
| In-memory (JS variable) | Most secure against persistence attacks | Lost on refresh, terrible UX | 2/10 |

**Why Chosen**: localStorage provides the simplest implementation path for MVP. The XSS vulnerability is a known and documented risk with a clear mitigation path (Phase 2 HttpOnly cookies + CSP). For initial launch with limited traffic and lower attack surface, this is an acceptable trade-off.

**Security Team Input**: Alex (Security Lead) approved with explicit condition that Phase 2 must include migration to HttpOnly cookies. CSP headers should be implemented in parallel to reduce XSS attack surface.

---

### Consequences

**Positive**:
- Simplest implementation
- Works seamlessly with future API clients
- Token accessible for debugging during development

**Negative**:
- XSS attacks can steal tokens - Mitigation: CSP headers, input sanitization, Phase 2 HttpOnly migration
- Must manually include token in requests - Mitigation: Auth wrapper function handles this

**Risks**:
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| XSS token theft | High | Medium | CSP headers, sanitization, Phase 2 HttpOnly cookies |
| Token visible in dev tools | Low | High | Acceptable for development; production has shorter expiry |

---

### Implementation

**Affected Systems**:
- Frontend auth.js (token storage/retrieval)
- API request wrapper (add Authorization header)
- Login/logout UI components

**Workstream**: W-B (API & UI)

**Rollback**: Change token storage location; no breaking changes to backend.

---

## ADR Index

| ADR | Title | Status | Date | Deciders |
|-----|-------|--------|------|----------|
| ADR-001 | Session Management Strategy | Accepted | 2025-01-15 | Jordan, Alex, Chris |
| ADR-002 | Password Hashing Algorithm | Accepted | 2025-01-15 | Jordan, Alex |
| ADR-003 | Client-Side Token Storage | Accepted | 2025-01-15 | Jordan, Alex, Frontend Lead |

---

<!--
Level 3+ Decision Record
Same structure as Level 3 with stakeholder attribution
Enterprise context in metadata
All ADRs should have Accepted/Rejected status before completion
-->
