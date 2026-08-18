---
title: 'Exact-action leases'
description: 'One-decision approval leases bound to the exact canonical action digest.'
trigger_phrases:
  - 'Exact-action leases'
  - 'approval lease'
  - 'approval request'
  - 'ApprovalService'
  - 'approvalActionDigest'
version: 1.0.0.0
---

# Exact-action leases (ApprovalService.request)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

One-decision approval leases bound to the exact canonical action digest.

Each protected tool call requests a lease that pins the principal, session, epoch, tool, and canonical arguments digest with a bounded TTL. The approval card carries the redacted canonical arguments and digest so an operator can decide with the full action in view.

Current status: shipped.

---

## 2. HOW IT WORKS

### Lease Creation

`request` refuses revoked principals and disabled mutation families, then creates a pending lease with a generated id, a canonical digest over the action, a source of explicit or accept-edits, and a default one minute TTL. The display arguments are canonicalized and redacted before they are attached to the card.

### Card and Lifecycle

The card exposes the approval id, session, epoch, tool, redacted canonical arguments, digest, policy version, revision, requested and expiry times, source, and status. Leases move through requested, approved or denied, consumed, expired, revoked, and restart-invalidated states, and every transition writes an audit row.

---

## 3. SOURCE FILES

### Implementation

| File                                                    | Layer   | Role                                                                   |
| ------------------------------------------------------- | ------- | ---------------------------------------------------------------------- |
| `apps/pi-remote-relay/src/approval/approval-service.ts` | Handler | Implements lease creation, cards, audit rows, and terminal transitions |
| `packages/pi-rpc-protocol/src/approval.ts`              | Shared  | Computes the canonical digest over the exact action                    |

### Validation And Tests

| File                                                            | Type        | Role                                                          |
| --------------------------------------------------------------- | ----------- | ------------------------------------------------------------- |
| `apps/pi-remote-relay/tests/approval.test.ts`                   | Vitest      | Covers lease lifecycle, decisions, grants, and the final gate |
| `apps/pi-remote-relay/tests/security/negative-controls.test.ts` | Integration | Pins lease denial paths as fail-closed controls               |

---

## 4. SOURCE METADATA

- Group: approval-and-mutation
- Canonical catalog source: `README.md`
- Feature file path: `approval-and-mutation/exact-action-leases.md`
- Current status: shipped

Related references:

- [cas-decision-settle.md](cas-decision-settle.md) - settles one decision per lease
- [approval-card.md](../pwa/approval-card.md) - the operator surface for pending leases
