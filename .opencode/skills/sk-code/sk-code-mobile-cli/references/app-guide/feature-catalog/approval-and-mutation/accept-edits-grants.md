---
title: 'Accept-edits grants'
description: 'Bounded grants that auto-approve a fixed number of edits within named enabled tools.'
trigger_phrases:
  - 'Accept-edits grants'
  - 'accept edits'
  - 'auto approval grant'
  - 'createAcceptEditsGrant'
  - 'requestFromGrant'
version: 1.0.0.0
---

# Accept-edits grants (createAcceptEditsGrant, requestFromGrant)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Bounded grants that auto-approve a fixed number of edits within named enabled tools.

An operator can grant a session a counted allowance for edit and write tools with a hard TTL ceiling. Each action consumes one allowance, must match the grant principal, session, and epoch, and must not repeat an exact action that was previously denied.

Current status: shipped.

---

## 2. HOW IT WORKS

### Grant Creation

`createAcceptEditsGrant` accepts only a non-empty tool list without wildcards, tools that are all enabled by the mutation policy, a positive safe remaining action count capped at ten, and a TTL capped at ten minutes. The grant stores the sorted allowed tools, the remaining count, and the expiry, and starts active.

### Consumption

`requestFromGrant` validates the grant state, principal, session, epoch, tool membership, and a fresh denial check for the exact digest, then decrements the remaining count conditionally. Each consumed action creates a one-action lease and settles it immediately as approved, so the grant never bypasses the lease and audit path.

---

## 3. SOURCE FILES

### Implementation

| File                                                    | Layer   | Role                                                        |
| ------------------------------------------------------- | ------- | ----------------------------------------------------------- |
| `apps/pi-remote-relay/src/approval/approval-service.ts` | Handler | Implements grant creation, consumption, and terminal states |
| `apps/pi-remote-relay/src/http/server.ts`               | Handler | Exposes the grant creation endpoint                         |
| `apps/pi-remote-web/src/relay.ts`                       | Handler | Calls the grant endpoint from the client                    |

### Validation And Tests

| File                                          | Type   | Role                                                             |
| --------------------------------------------- | ------ | ---------------------------------------------------------------- |
| `apps/pi-remote-relay/tests/approval.test.ts` | Vitest | Covers grant bounds, consumption, and denial of repeated actions |

---

## 4. SOURCE METADATA

- Group: approval-and-mutation
- Canonical catalog source: `README.md`
- Feature file path: `approval-and-mutation/accept-edits-grants.md`
- Current status: shipped

Related references:

- [exact-action-leases.md](exact-action-leases.md) - the one-action leases grants produce
- [approval-card.md](../pwa/approval-card.md) - the accept-next-edits action in the review view
