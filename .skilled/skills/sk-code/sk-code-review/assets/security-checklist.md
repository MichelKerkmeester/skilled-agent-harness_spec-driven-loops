---
title: Security and Reliability Checklist
description: Structured risk checklist for security vulnerabilities, runtime reliability issues, and concurrent-behavior defects.
trigger_phrases:
  - "security review minimums"
  - "input output safety checks"
  - "authn authz review checklist"
  - "secrets and privacy review"
  - "concurrency race condition review"
  - "dependency supply chain audit"
importance_tier: normal
contextType: implementation
version: 1.5.1.0
---

# Security and Reliability Checklist

Structured risk checklist for security vulnerabilities, runtime reliability issues, and concurrent-behavior defects.

---

## 1. OVERVIEW

### Purpose

Help reviewers prioritize exploitability and business impact, not just code style.

### Usage

Apply on security-relevant diffs; classify each finding by exploitability and business impact, and cite file:line evidence.

### Core Principle

When impact is unclear, prefer conservative classification and state uncertainty explicitly.

### Rule Ids

Each section names its rule ids under its heading. Sections 2 to 6 are **floor**: no repository or surface changes them. Sections 7 to 11 are the **default lens**, which a repository or surface may drop or replace with a `## Rule overrides` row. An item in a lens section that is also an auth or authorization gap, injection exposure, unsafe secrets handling or privilege misuse stays a `review.security-minimums` finding, which no row drops. [`review-core.md`](../references/review-core.md) section 8 lists every id and how an override reaches the review.

### Web Items

An item marked web-only applies only to code that serves HTTP or calls an HTTP service: a handler, a route, a page or a client. A CLI tool, a library with no network code or a build script is not in its reach, so a web-only item raises no finding there.

---

## 2. INPUT/OUTPUT SAFETY

Rule: floor, `review.security-minimums` and `floor.input-validation`.

Check for:
- Web-only: XSS via unsafe HTML rendering or template interpolation.
- SQL/NoSQL/command injection via string concatenation.
- Web-only: SSRF through unvalidated user-controlled URLs.
- Path traversal from unchecked path input (`../`).
- Prototype pollution from unsafe object merge operations.

Review prompts:
- "What untrusted input reaches this sink?"
- "Is validation context-aware for this output channel?"

---

## 3. AUTHENTICATION AND AUTHORIZATION

Rule: floor, `review.security-minimums`.

Check for:
- Missing auth guards on newly added entry points.
- Missing ownership/tenant checks for read/write actions.
- Trust in client-supplied role flags or user IDs.
- IDOR patterns where entity IDs are accepted without authorization.
- Weak token/session validation (`exp`, `iss`, `aud`, algorithm checks).

High-impact rule: any missing authz control on data mutation is at least P1 and often P0.

---

## 4. SECRETS AND PRIVACY

Rule: floor, `review.security-minimums` and `floor.hardcoded-secrets`.

Check for:
- Hardcoded credentials, API keys, tokens, private keys.
- Sensitive logs exposing PII or operational secrets.
- Internal stack traces or environment details in user-facing errors.
- Web-only: client-side exposure of server-only configuration values.

Quick command ideas, as an example search:

```bash
rg -n -i "api[_-]?key|secret|token|password|BEGIN .* PRIVATE KEY"
```

---

## 5. RUNTIME RELIABILITY

Rule: floor, `review.security-minimums`, which covers reliability risks with security impact, and `review.correctness-minimums`.

Check for:
- Missing timeouts/retries for network dependencies.
- Unbounded loops, recursion, or memory growth.
- Blocking I/O on hot request paths.
- Regex patterns vulnerable to catastrophic backtracking (ReDoS).
- Missing idempotency keys for retry-prone write operations.

Review prompt:
- "What fails under load or partial network failure?"

---

## 6. CONCURRENCY AND RACE CONDITIONS

Rule: floor, `review.correctness-minimums` and `floor.initialization-safety`.

Flag patterns:
- Check-then-act without atomicity.
- Read-modify-write on shared state without lock/transaction.
- File/system operations split into non-atomic checks and actions.
- Counter updates without atomic increment semantics.
- Distributed coordination without lock/lease guarantees.

Examples, in pseudocode:

```text
if not exists(key):
    create(key)

value = get(key)
value += 1
set(key, value)
```

Reviewer questions:
- "What happens if two requests hit this path at the same time?"
- "Is this update atomic across all failure modes?"

---

## 7. RATE LIMITING AND ABUSE PREVENTION

Rule: default lens, `review.rate-limiting`. Web-only.

Check for:
- Missing rate limits on authentication endpoints (login, signup, password reset).
- Unthrottled API endpoints accepting expensive operations.
- Missing abuse vectors: account enumeration, credential stuffing, brute force.
- Lack of per-user or per-IP request budgets on public-facing routes.

Review prompt:
- "What stops an attacker from calling this endpoint 10,000 times per second?"

---

## 8. CONTENT SECURITY POLICY AND HEADERS

Rule: default lens, `review.security-headers`. Web-only: CSP, the security headers, CORS and cookie attributes reach only code that serves or calls HTTP.

Check for:
- Missing or overly permissive CSP headers (`unsafe-inline`, `unsafe-eval`, wildcard sources).
- Missing security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`.
- CORS misconfiguration: wildcard origins, credentials with broad origins.
- Missing `SameSite` attribute on sensitive cookies.

Review prompt:
- "Could an attacker embed, frame, or inject scripts into this page?"

---

## 9. DEPENDENCY AND SUPPLY CHAIN SECURITY

Rule: default lens, `review.supply-chain`.

Check for:
- Known vulnerabilities in dependencies, found with the stack's audit tool, such as `npm audit`, `pip-audit` or `cargo audit`.
- Unpinned or loosely pinned dependency versions (major version ranges).
- Dependencies with no maintainer activity or known compromises.
- Post-install scripts in untrusted packages.
- Lock file integrity (committed and consistent with manifest).

Review prompt:
- "Are all dependencies pinned, audited, and from trusted sources?"

---

## 10. AUDIT LOGGING AND OBSERVABILITY

Rule: default lens, `review.audit-logging`. Logging a password, token or PII in plain text is unsafe secrets handling and stays floor.

Check for:
- Missing audit logs for security-sensitive operations (auth, permission changes, data deletion).
- Insufficient context in logs (who, what, when, from where).
- Logging sensitive data (passwords, tokens, PII) in plain text.
- Missing alerting for anomalous patterns (repeated auth failures, privilege escalation).

Review prompt:
- "If this action were abused, would we know about it from the logs?"

---

## 11. PRIVACY AND DATA HANDLING

Rule: default lens, `review.data-privacy`.

Check for:
- PII stored without encryption at rest or purpose limitation.
- Missing data retention policies or deletion mechanisms.
- Cross-border data transfer without adequate safeguards.
- Excessive data collection beyond stated purpose.
- Missing consent mechanisms for user data processing.

Review prompt:
- "Does this code collect, store, or transmit personal data - and is that justified and protected?"

---

## 12. RELATED RESOURCES

- [quick-reference.md](../references/quick-reference.md) - Findings-first review flow, severity model, and output contract.
- [code-quality-checklist.md](./code-quality-checklist.md) - Correctness, scaling, and maintainability checks.
- [solid-checklist.md](./solid-checklist.md) - Architecture cohesion and coupling checks.
- [removal-plan.md](./removal-plan.md) - Safe deletion and deferred removal planning.

Surface portability: use this baseline with surface-specific controls from `sk-code`.
