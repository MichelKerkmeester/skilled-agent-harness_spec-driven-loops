---
title: 'Kill switch'
description: 'A mutation policy that disables the enabled command family and revokes outstanding authority.'
trigger_phrases:
  - 'Kill switch'
  - 'mutation policy'
  - 'mutation family'
  - 'MutationPolicy'
  - 'kill-switch'
version: 1.0.0.0
---

# Kill switch (MutationPolicy)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

A mutation policy that disables the enabled command family and revokes outstanding authority.

One command family can be enabled at a time, and turning the policy off emits a disable reason that the approval service uses to revoke pending and approved leases and abort in-flight execution. The relay composes the switch from the mutation environment flags.

Current status: shipped.

---

## 2. HOW IT WORKS

### Family Policy

The policy maps three families to their tools: filesystem for edit and write, process for bash, and network for fetch. Enabling a family clears the previous one, and a tool is allowed only when the policy is enabled and the tool belongs to the enabled family.

### Disable Propagation

`setEnabled(false)` emits a kill-switch reason, and every listener reacts. The approval service revokes all pending and approved leases, revokes active grants, and aborts in-flight execution. The same emit path runs when the family changes or a family is disabled, so authority never outlives the policy state.

---

## 3. SOURCE FILES

### Implementation

| File                                                    | Layer   | Role                                                             |
| ------------------------------------------------------- | ------- | ---------------------------------------------------------------- |
| `apps/pi-remote-relay/src/policy/mutation-policy.ts`    | Handler | Implements family enablement, tool checks, and disable listeners |
| `apps/pi-remote-relay/src/approval/approval-service.ts` | Handler | Subscribes to disable events and drains authority                |
| `apps/pi-remote-relay/src/index.ts`                     | Handler | Composes the switch from the mutation environment flags          |

### Validation And Tests

| File                                                            | Type        | Role                                                   |
| --------------------------------------------------------------- | ----------- | ------------------------------------------------------ |
| `apps/pi-remote-relay/tests/approval.test.ts`                   | Vitest      | Covers policy disable propagation to leases and grants |
| `tests/rollback-drill.test.ts`                                  | Vitest      | Asserts the kill switch drains outstanding authority   |
| `apps/pi-remote-relay/tests/security/negative-controls.test.ts` | Integration | Pins disabled-family denial as a fail-closed control   |

---

## 4. SOURCE METADATA

- Group: approval-and-mutation
- Canonical catalog source: `README.md`
- Feature file path: `approval-and-mutation/kill-switch.md`
- Current status: shipped

Related references:

- [mutation-containment.md](mutation-containment.md) - the boundary that enforces family policy per tool
- [rollback-drill.md](../release/rollback-drill.md) - exercises the kill switch drain end to end
