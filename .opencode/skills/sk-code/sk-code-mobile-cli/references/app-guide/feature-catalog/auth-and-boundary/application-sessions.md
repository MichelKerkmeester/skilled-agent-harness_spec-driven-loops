---
title: 'Application sessions'
description: 'Short-lived application sessions established by a device proof challenge exchange.'
trigger_phrases:
  - 'Application sessions'
  - 'session challenge'
  - 'session proof'
  - 'sessionProof'
  - 'AuthService'
version: 1.0.0.0
---

# Application sessions (AuthService)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Short-lived application sessions established by a device proof challenge exchange.

An enrolled device exchanges a signed session challenge for an opaque session token with a bounded TTL. Every request that carries the token is revalidated against origin, principal, device liveness, and expiry before it is accepted.

Current status: shipped.

---

## 2. HOW IT WORKS

### Challenge Exchange

`createSessionChallenge` mints a per-device challenge only for an active enrolled device at the matching origin and principal. `createSession` accepts the challenge id and a signature over the canonical session statement, and on success consumes the challenge and issues an opaque token with the session TTL.

### Authentication

`authenticate` first runs the action through the authorization policy, then accepts the session only when the token is known, unrevoked, unexpired, and bound to the same origin, principal, and active device. Expired and revoked sessions are pruned from memory on each operation.

---

## 3. SOURCE FILES

### Implementation

| File                                            | Layer   | Role                                                            |
| ----------------------------------------------- | ------- | --------------------------------------------------------------- |
| `apps/pi-remote-relay/src/auth/auth-service.ts` | Handler | Implements session challenges, token issuance, and revalidation |
| `packages/pi-rpc-protocol/src/auth.ts`          | Shared  | Builds the byte-stable `sessionProof` statement                 |
| `apps/pi-remote-relay/src/http/server.ts`       | Handler | Sets the session cookie and reads it back per request           |

### Validation And Tests

| File                                                            | Type        | Role                                             |
| --------------------------------------------------------------- | ----------- | ------------------------------------------------ |
| `apps/pi-remote-relay/tests/auth.test.ts`                       | Vitest      | Covers session proof, issuance, and revalidation |
| `apps/pi-remote-relay/tests/security/negative-controls.test.ts` | Integration | Pins session rejection as a fail-closed control  |

---

## 4. SOURCE METADATA

- Group: auth-and-boundary
- Canonical catalog source: `README.md`
- Feature file path: `auth-and-boundary/application-sessions.md`
- Current status: shipped

Related references:

- [device-enrollment.md](device-enrollment.md) - the registry that backs session proof
- [one-use-tickets.md](one-use-tickets.md) - the single-use token layer on top of sessions
