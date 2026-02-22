---
title: Security and Reliability Checklist
description: Structured risk checklist for security vulnerabilities, runtime reliability issues, and concurrent-behavior defects.
---

# Security and Reliability Checklist

Structured risk checklist for security vulnerabilities, runtime reliability issues, and concurrent-behavior defects.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Help reviewers prioritize exploitability and business impact, not just code style.

### Severity Bias

When impact is unclear, prefer conservative classification and state uncertainty explicitly.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:input-output -->
## 2. INPUT/OUTPUT SAFETY

Check for:
- XSS via unsafe HTML rendering or template interpolation.
- SQL/NoSQL/command injection via string concatenation.
- SSRF through unvalidated user-controlled URLs.
- Path traversal from unchecked path input (`../`).
- Prototype pollution from unsafe object merge operations.

Review prompts:
- "What untrusted input reaches this sink?"
- "Is validation context-aware for this output channel?"
<!-- /ANCHOR:input-output -->

---

<!-- ANCHOR:auth -->
## 3. AUTHENTICATION AND AUTHORIZATION

Check for:
- Missing auth guards on newly added entry points.
- Missing ownership/tenant checks for read/write actions.
- Trust in client-supplied role flags or user IDs.
- IDOR patterns where entity IDs are accepted without authorization.
- Weak token/session validation (`exp`, `iss`, `aud`, algorithm checks).

High-impact rule: any missing authz control on data mutation is at least P1 and often P0.
<!-- /ANCHOR:auth -->

---

<!-- ANCHOR:secrets-privacy -->
## 4. SECRETS AND PRIVACY

Check for:
- Hardcoded credentials, API keys, tokens, private keys.
- Sensitive logs exposing PII or operational secrets.
- Internal stack traces or environment details in user-facing errors.
- Client-side exposure of server-only configuration values.

Quick command ideas:

```bash
rg -n -i "api[_-]?key|secret|token|password|BEGIN .* PRIVATE KEY"
```
<!-- /ANCHOR:secrets-privacy -->

---

<!-- ANCHOR:runtime-reliability -->
## 5. RUNTIME RELIABILITY

Check for:
- Missing timeouts/retries for network dependencies.
- Unbounded loops, recursion, or memory growth.
- Blocking I/O on hot request paths.
- Regex patterns vulnerable to catastrophic backtracking (ReDoS).
- Missing idempotency keys for retry-prone write operations.

Review prompt:
- "What fails under load or partial network failure?"
<!-- /ANCHOR:runtime-reliability -->

---

<!-- ANCHOR:concurrency -->
## 6. CONCURRENCY AND RACE CONDITIONS

Flag patterns:
- Check-then-act without atomicity.
- Read-modify-write on shared state without lock/transaction.
- File/system operations split into non-atomic checks and actions.
- Counter updates without atomic increment semantics.
- Distributed coordination without lock/lease guarantees.

Examples:

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
<!-- /ANCHOR:concurrency -->
