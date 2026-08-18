---
title: 'Rollback drill'
description: 'An executable drill that exercises authority drain, backup restore, and down-migration on disposable state.'
trigger_phrases:
  - 'Rollback drill'
  - 'rollback drill'
  - 'authority drain'
  - 'down migration'
  - 'runRollbackDrill'
version: 1.0.0.0
---

# Rollback drill (runRollbackDrill)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

An executable drill that exercises authority drain, backup restore, and down-migration on disposable state.

The drill builds a disposable database, approves and consumes a lease, flips the kill switch to drain authority, damages and restores the backup, and migrates down to version 4 while preserving session and indeterminate rows. The native session history outside the relay is left untouched.

Current status: shipped.

---

## 2. HOW IT WORKS

### Drill Sequence

The drill creates a temp workspace, seeds a session card, enables the filesystem family, requests a pending lease and a consumed lease, then disables the policy and asserts that in-flight authority aborts and outstanding leases revoke with the kill-switch reason. The database checkpoints, is copied to a backup, and is damaged by deleting rows.

### Restore Checks

The damaged database is replaced from the backup, migrated down to version 4, and checked for the preserved session card and the indeterminate consumed lease. A sentinel file in the native session history is hashed before and after, and the drill fails if the restore, migration, or sentinel boundary changes. The report returns the drain count, migration version, and preserved counts.

---

## 3. SOURCE FILES

### Implementation

| File                                                 | Layer  | Role                                                     |
| ---------------------------------------------------- | ------ | -------------------------------------------------------- |
| `apps/pi-remote-relay/src/release/rollback-drill.ts` | Script | Implements the full drill against disposable state       |
| `scripts/rollback-drill.mjs`                         | Script | Runs the drill from the relay dist and prints the report |
| `apps/pi-remote-relay/src/store/migrations.ts`       | Shared | Provides the down-migration used by the restore step     |

### Validation And Tests

| File                           | Type   | Role                                                        |
| ------------------------------ | ------ | ----------------------------------------------------------- |
| `tests/rollback-drill.test.ts` | Vitest | Runs the executable drill and asserts the PASS report shape |

---

## 4. SOURCE METADATA

- Group: release
- Canonical catalog source: `README.md`
- Feature file path: `release/rollback-drill.md`
- Current status: shipped

Related references:

- [kill-switch.md](../approval-and-mutation/kill-switch.md) - the drain path the drill exercises
- [whole-gate-runner.md](whole-gate-runner.md) - runs the drill as one of its gates
