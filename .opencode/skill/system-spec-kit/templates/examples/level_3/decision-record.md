---
title: "Decision Record: Add User Authentication [template:examples/level_3/decision-record.md]"
description: "architecture decisions with proper context, alternatives, and consequences."
trigger_phrases:
  - "decision"
  - "record"
  - "add"
  - "user"
  - "authentication"
  - "template"
  - "decision record"
importance_tier: "normal"
contextType: "general"
---
# Decision Record: Add User Authentication

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- EXAMPLE: This is a filled-in Level 3 decision record showing how to document
architecture decisions with proper context, alternatives, and consequences.
Multiple ADRs can be included in a single file for related decisions. -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Session Management Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-01-15 |
| **Deciders** | Tech Lead, Senior Developer |

---

### Context

The application needs session management to maintain user authentication state across requests. This is a foundational decision that affects security, scalability, and the architecture of all future authentication-related features.

### Constraints
- Must work with existing Express.js architecture
- Should support future API clients (mobile app planned)
- Infrastructure currently single-server, but may scale horizontally
- Development team experienced with both approaches

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

**Why Chosen**: JWT provides the best balance of simplicity and future-proofing. The stateless nature simplifies horizontal scaling (planned) and API integration (mobile app roadmap). Token revocation limitations are acceptable for MVP since 24-hour expiry provides reasonable security.

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
| Risk | Impact | Mitigation |
|------|--------|------------|
| Token stolen via XSS | H | Phase 2 HttpOnly cookies, CSP headers |
| Secret key compromised | H | Environment variable, rotation procedure documented |
| Token replay attack | M | Short expiry, future: token binding |

---

### Implementation

**Affected Systems**:
- Auth middleware (new)
- Login endpoint (new)
- All protected routes (modified to use middleware)
- Future: API authentication

**Rollback**: Revert to cookieless state; no external dependencies to remove.

---


<!-- /ANCHOR:adr-001 -->
---

<!-- ANCHOR:adr-002 -->
## ADR-002: Password Hashing Algorithm

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-01-15 |
| **Deciders** | Tech Lead, Security Review |

---

### Context

User passwords must be securely hashed before storage to protect user data in case of database breach. The hashing algorithm choice affects security strength and server performance (hash computation time).

### Constraints
- Must be resistant to rainbow table and brute force attacks
- Hash computation should complete in < 1 second for acceptable UX
- Must be well-supported in Node.js ecosystem
- Should be an industry-standard algorithm

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
| Risk | Impact | Mitigation |
|------|--------|------------|
| bcrypt vulnerability discovered | H | Monitor CVEs, upgrade promptly, cost factor increase possible |
| Cost factor too low for future hardware | M | Plan to increase cost factor annually; currently sufficient |

---

### Implementation

**Affected Systems**:
- Registration endpoint (hash on create)
- Login endpoint (verify on login)
- Password change feature (future)

**Rollback**: N/A - this is a forward-only decision. Existing hashes remain valid; new algorithm would require migration.

---


<!-- /ANCHOR:adr-002 -->
---

<!-- ANCHOR:adr-003 -->
## ADR-003: Client-Side Token Storage

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-01-15 |
| **Deciders** | Tech Lead, Frontend Lead |

---

### Context

JWT tokens need to be stored client-side for authenticated requests. The storage mechanism choice affects security (XSS, CSRF risks) and implementation complexity.

### Constraints
- Must persist across page refreshes
- Must be accessible for API requests (Authorization header)
- Should work with existing frontend architecture (EJS + vanilla JS)
- Phase 1 is MVP; security improvements can follow

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
| Risk | Impact | Mitigation |
|------|--------|------------|
| XSS token theft | H | CSP headers, sanitization, Phase 2 HttpOnly cookies |
| Token visible in dev tools | L | Acceptable for development; production has shorter expiry |

---

### Implementation

**Affected Systems**:
- Frontend auth.js (token storage/retrieval)
- API request wrapper (add Authorization header)
- Login/logout UI components

**Rollback**: Change token storage location; no breaking changes to backend.

<!-- /ANCHOR:adr-003 -->

---

---

<!--
Level 3 Decision Record
Document significant technical decisions
One ADR per major decision
All ADRs should have Accepted/Rejected status before completion
-->
