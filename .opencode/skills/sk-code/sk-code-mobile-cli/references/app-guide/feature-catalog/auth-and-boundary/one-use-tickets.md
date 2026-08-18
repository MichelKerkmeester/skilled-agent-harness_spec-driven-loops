---
title: 'One-use tickets'
description: 'One-use WebSocket tickets that bind a session to a single sync or prompt upgrade.'
trigger_phrases:
  - 'One-use tickets'
  - 'websocket ticket'
  - 'sync ticket'
  - 'prompt ticket'
  - 'consumeTicket'
version: 1.0.0.0
---

# One-use tickets (issueTicket, consumeTicket)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

One-use WebSocket tickets that bind a session to a single sync or prompt upgrade.

A session mints a short-lived ticket before opening the sync socket or submitting a prompt, and the ticket is consumed exactly once at that boundary. The upgrade never reuses a bearer token outside the socket handshake.

Current status: shipped.

---

## 2. HOW IT WORKS

### Mint and Consume

`issueTicket` creates an opaque ticket bound to the session token, device, principal, and origin with a 20 second TTL. `consumeTicket` accepts the ticket only when it is unexpired, unrevoked, and bound to the same origin and principal, revalidates the backing session for the requested action, and deletes the ticket after one use.

### Boundaries

The WebSocket upgrade path consumes a ticket before the sync subscription is accepted, and the prompt submit path consumes a ticket with the `prompt:submit` action. Revocation, device revoke, and expiry all invalidate outstanding tickets.

---

## 3. SOURCE FILES

### Implementation

| File                                            | Layer   | Role                                                              |
| ----------------------------------------------- | ------- | ----------------------------------------------------------------- |
| `apps/pi-remote-relay/src/auth/auth-service.ts` | Handler | Implements ticket minting, consumption, and invalidation          |
| `apps/pi-remote-relay/src/http/server.ts`       | Handler | Consumes tickets at the sync upgrade and prompt submit boundaries |

### Validation And Tests

| File                                                            | Type        | Role                                                    |
| --------------------------------------------------------------- | ----------- | ------------------------------------------------------- |
| `apps/pi-remote-relay/tests/auth.test.ts`                       | Vitest      | Covers ticket issuance, one-use consumption, and expiry |
| `apps/pi-remote-relay/tests/security/negative-controls.test.ts` | Integration | Pins replay and reuse rejection as fail-closed controls |

---

## 4. SOURCE METADATA

- Group: auth-and-boundary
- Canonical catalog source: `README.md`
- Feature file path: `auth-and-boundary/one-use-tickets.md`
- Current status: shipped

Related references:

- [application-sessions.md](application-sessions.md) - the session layer that backs each ticket
- [sync-replay-barrier.md](../transport-and-state/sync-replay-barrier.md) - the subscription guarded by the sync ticket
