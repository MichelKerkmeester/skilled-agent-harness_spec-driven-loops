---
title: 'Final-gate digest'
description: 'Recomputation of the exact action digest at the final boundary before execution.'
trigger_phrases:
  - 'Final-gate digest'
  - 'final approval gate'
  - 'verifyFinalGate'
  - 'digest mismatch'
version: 1.0.0.0
---

# Final-gate digest (verifyFinalGate)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Recomputation of the exact action digest at the final boundary before execution.

Before authority is granted, the relay recomputes the canonical digest from the live action, rechecks epoch, policy version, expiry, lease status, and policy enablement, and only then marks the lease consumed. The extension boundary runs the same digest check against the relay authority routes.

Current status: shipped.

---

## 2. HOW IT WORKS

### Gate Checks

`verifyFinalGate` is a pure function that returns allowed only when the policy allows the tool, the lease is approved, unexpired, and not revoked or consumed, the action and lease epochs match the current epoch, the principal and session match, the policy versions match, and the recomputed digest equals the lease digest. Every denial carries a named reason.

### Consume Path

The approval service calls the gate inside the consume transaction, and a passing gate flips the lease to consumed in the same conditional update. The extension then receives the allowed signal with an abort controller that fires when the lease TTL expires.

---

## 3. SOURCE FILES

### Implementation

| File                                                    | Layer   | Role                                             |
| ------------------------------------------------------- | ------- | ------------------------------------------------ |
| `apps/pi-remote-relay/src/approval/final-gate.ts`       | Shared  | Implements the pure final gate checks            |
| `apps/pi-remote-relay/src/approval/approval-service.ts` | Handler | Runs the gate inside the consume transaction     |
| `packages/pi-rpc-protocol/src/approval.ts`              | Shared  | Provides `approvalActionDigest` used by the gate |

### Validation And Tests

| File                                                            | Type        | Role                                                     |
| --------------------------------------------------------------- | ----------- | -------------------------------------------------------- |
| `apps/pi-remote-relay/tests/approval.test.ts`                   | Vitest      | Covers the final gate through the approval service       |
| `apps/pi-remote-relay/tests/security/negative-controls.test.ts` | Integration | Pins digest and epoch mismatches as fail-closed controls |

---

## 4. SOURCE METADATA

- Group: approval-and-mutation
- Canonical catalog source: `README.md`
- Feature file path: `approval-and-mutation/final-gate-digest.md`
- Current status: shipped

Related references:

- [cas-decision-settle.md](cas-decision-settle.md) - produces the approved lease the gate rechecks
- [mutation-containment.md](mutation-containment.md) - runs the gate check at the tool call boundary
