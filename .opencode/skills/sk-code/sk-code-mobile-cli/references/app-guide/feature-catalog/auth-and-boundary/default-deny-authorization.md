---
title: 'Default-deny authorization'
description: 'An explicit action allowlist that denies every unknown action and tool mutation.'
trigger_phrases:
  - 'Default-deny authorization'
  - 'action allowlist'
  - 'authorizeAction'
  - 'rate limiter'
  - 'FixedWindowRateLimiter'
version: 1.0.0.0
---

# Default-deny authorization (authorizeAction)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

An explicit action allowlist that denies every unknown action and tool mutation.

Every relay request maps to a named action string, and the auth service rejects the session when the action is not in the allowlist. Unknown paths and tool mutations never reach a handler.

Current status: shipped.

---

## 2. HOW IT WORKS

### Action Policy

The policy module holds the full set of authorized actions covering health, sessions, transcript, sync, tickets, revocation, approvals, grants, attention, push, and prompt submit. `authenticate` counts a policy denial in the auth metrics and returns no session for any action outside the set, and the server maps each path to its action or rejects the request.

### Rate Limits

Fixed-window limiters bound general requests, enrollment, and prompt submission per principal and address, and never retain request payloads. A rejected bucket increments the rate-limited metric and returns a 429 response.

---

## 3. SOURCE FILES

### Implementation

| File                                          | Layer   | Role                                                     |
| --------------------------------------------- | ------- | -------------------------------------------------------- |
| `apps/pi-remote-relay/src/auth/policy.ts`     | Shared  | Declares the authorized action set and `authorizeAction` |
| `apps/pi-remote-relay/src/auth/rate-limit.ts` | Shared  | Implements `FixedWindowRateLimiter` for ingress bounds   |
| `apps/pi-remote-relay/src/http/server.ts`     | Handler | Maps paths to actions and applies the limiters           |

### Validation And Tests

| File                                                            | Type        | Role                                                                 |
| --------------------------------------------------------------- | ----------- | -------------------------------------------------------------------- |
| `apps/pi-remote-relay/tests/security/negative-controls.test.ts` | Integration | Pins unknown action and tool mutation denial as fail-closed controls |
| `apps/pi-remote-relay/tests/auth.test.ts`                       | Vitest      | Covers policy denial counters through the auth boundary              |

---

## 4. SOURCE METADATA

- Group: auth-and-boundary
- Canonical catalog source: `README.md`
- Feature file path: `auth-and-boundary/default-deny-authorization.md`
- Current status: shipped

Related references:

- [serve-identity-anchor.md](serve-identity-anchor.md) - the ingress that applies the policy per path
- [kill-switch.md](../approval-and-mutation/kill-switch.md) - the separate mutation family policy
