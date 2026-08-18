---
title: 'Revocation'
description: 'Session, device, and grant revocation with active connection teardown.'
trigger_phrases:
  - 'Revocation'
  - 'revoke session'
  - 'revoke device'
  - 'revocation listener'
  - 'revokePrincipal'
version: 1.0.0.0
---

# Revocation (revokeSession, revokeDevice)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Session, device, and grant revocation with active connection teardown.

Revoking a session or device marks every related record terminal, aborts in-flight approval authority, and closes matching WebSocket connections with a revocation code. The web client offers both actions from the device footer.

Current status: shipped.

---

## 2. HOW IT WORKS

### Session Revoke

`revokeSession` marks the session revoked, invalidates its tickets, increments the revocation metric, and emits a revocation event so the server closes sockets bound to that session token. The logout path also removes the device push subscription and expires the session cookie.

### Device Revoke

`revokeDevice` marks the device revoked, revokes every session and challenge for that device, invalidates all of its tickets, and emits a device-wide revocation event. The approval service revokes the principal at the same time, aborting pending leases, active grants, and in-flight execution.

---

## 3. SOURCE FILES

### Implementation

| File                                                    | Layer   | Role                                                            |
| ------------------------------------------------------- | ------- | --------------------------------------------------------------- |
| `apps/pi-remote-relay/src/auth/auth-service.ts`         | Handler | Implements session and device revocation with listener emission |
| `apps/pi-remote-relay/src/approval/approval-service.ts` | Handler | Revokes principal leases, grants, and in-flight authority       |
| `apps/pi-remote-relay/src/http/server.ts`               | Handler | Closes active sockets on revocation events                      |
| `apps/pi-remote-web/src/auth.ts`                        | Handler | Calls the revoke and logout endpoints from the client           |

### Validation And Tests

| File                                                            | Type        | Role                                                      |
| --------------------------------------------------------------- | ----------- | --------------------------------------------------------- |
| `apps/pi-remote-relay/tests/auth.test.ts`                       | Vitest      | Covers revocation of sessions, devices, and tickets       |
| `apps/pi-remote-relay/tests/security/negative-controls.test.ts` | Integration | Pins revoked authority rejection as a fail-closed control |

---

## 4. SOURCE METADATA

- Group: auth-and-boundary
- Canonical catalog source: `README.md`
- Feature file path: `auth-and-boundary/revocation.md`
- Current status: shipped

Related references:

- [application-sessions.md](application-sessions.md) - the session records that revocation terminates
- [kill-switch.md](../approval-and-mutation/kill-switch.md) - the policy disable that drains approval authority
