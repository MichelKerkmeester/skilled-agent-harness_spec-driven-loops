---
title: 'CAS decision settle'
description: 'Compare-and-swap settling of one approval decision under idempotency and revision guards.'
trigger_phrases:
  - 'CAS decision settle'
  - 'approval decide'
  - 'idempotency key'
  - 'decision race'
  - 'ApprovalDecisionCommand'
version: 1.0.0.0
---

# CAS decision settle (ApprovalService.decide)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Compare-and-swap settling of one approval decision under idempotency and revision guards.

A decision applies only when the lease is still pending at the submitted revision, the digest and epoch match, and the idempotency key has not been used. Replayed, raced, stale, and expired decisions are rejected with a reason.

Current status: shipped.

---

## 2. HOW IT WORKS

### Guarded Update

`decide` runs inside one transaction and loads the lease by approval id. It rejects an unknown lease, a replayed idempotency key, a principal mismatch, a non-pending status, an expired lease, an epoch mismatch, a revision mismatch, and a digest mismatch before attempting the update. The update itself is a conditional statement that changes exactly one row, so a concurrent decision loses the race and returns a raced result.

### Result and Audit

An accepted decision marks the lease approved or denied, records the deciding device and reason, and writes the audit row. The result publishes through the sync hub so the web client and the extension see the settled state.

---

## 3. SOURCE FILES

### Implementation

| File                                                    | Layer   | Role                                                           |
| ------------------------------------------------------- | ------- | -------------------------------------------------------------- |
| `apps/pi-remote-relay/src/approval/approval-service.ts` | Handler | Implements the guarded decision transaction and result publish |

### Validation And Tests

| File                                                            | Type        | Role                                                      |
| --------------------------------------------------------------- | ----------- | --------------------------------------------------------- |
| `apps/pi-remote-relay/tests/approval.test.ts`                   | Vitest      | Covers decision settle, races, and idempotency replay     |
| `apps/pi-remote-relay/tests/security/negative-controls.test.ts` | Integration | Pins raced and replayed decisions as fail-closed controls |

---

## 4. SOURCE METADATA

- Group: approval-and-mutation
- Canonical catalog source: `README.md`
- Feature file path: `approval-and-mutation/cas-decision-settle.md`
- Current status: shipped

Related references:

- [exact-action-leases.md](exact-action-leases.md) - the leases that decisions settle
- [final-gate-digest.md](final-gate-digest.md) - the recheck that runs after a decision
