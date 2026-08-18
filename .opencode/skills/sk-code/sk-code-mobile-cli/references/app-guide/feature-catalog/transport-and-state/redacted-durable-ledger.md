---
title: 'Redacted durable ledger'
description: 'SQLite ledger that persists redacted envelopes with epoch ordering, deduplication, and retention floors.'
trigger_phrases:
  - 'Redacted durable ledger'
  - 'relay store'
  - 'envelope ledger'
  - 'RelayStore'
version: 1.0.0.0
---

# Redacted durable ledger (RelayStore)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

SQLite ledger that persists redacted envelopes with epoch ordering, deduplication, and retention floors.

The store is the only persistence layer in the relay. It owns the envelope table, the epoch and stream state, the session catalog projection, the transcript pages, and the migration runner that brings the schema up on open.

Current status: shipped.

---

## 2. HOW IT WORKS

### Append Path

Every append validates the envelope shape, applies the canonical redaction, and commits inside one transaction. A duplicate event id or a reused sequence returns the stored envelope instead of inserting, and a sequence that does not follow the high-water mark is refused. A new epoch must start at sequence one and ends the prior epoch row.

### Sync and Retention

`createSyncPlan` reads a cursor-aware snapshot, delta, or gap plan frozen at one committed barrier. Old envelope rows are deleted down to a retention floor on each append, and the floor and high sequence are updated in the same transaction. Transcript pages read only already-redacted blocks with a bounded page size.

### Shared Handle

The store exposes the migrated database handle to the approval and push services so lease, grant, subscription, and attention rows live in the same schema and transaction scope.

---

## 3. SOURCE FILES

### Implementation

| File                                                             | Layer   | Role                                                                            |
| ---------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------- |
| `apps/pi-remote-relay/src/store/relay-store.ts`                  | Handler | Implements the envelope ledger, sync plans, transcript pages, and session cards |
| `apps/pi-remote-relay/src/store/migrations.ts`                   | Shared  | Runs up and down migrations on open and during the rollback drill               |
| `apps/pi-remote-relay/migrations/001-initial.up.sql`             | Schema  | Creates the envelope, epoch, and stream state tables                            |
| `apps/pi-remote-relay/migrations/002-approvals.up.sql`           | Schema  | Adds approval lease and audit tables                                            |
| `apps/pi-remote-relay/migrations/003-push-attention.up.sql`      | Schema  | Adds push subscription and attention item tables                                |
| `apps/pi-remote-relay/migrations/004-grant-restart-state.up.sql` | Schema  | Adds accept-edits grant restart state                                           |

### Validation And Tests

| File                                                      | Type        | Role                                                     |
| --------------------------------------------------------- | ----------- | -------------------------------------------------------- |
| `apps/pi-remote-relay/tests/store.test.ts`                | Vitest      | Covers ledger ordering, deduplication, and retention     |
| `apps/pi-remote-relay/tests/kill-points/recovery.test.ts` | Integration | Verifies ledger behavior at each persistence crash point |
| `tests/rollback-drill.test.ts`                            | Vitest      | Restores the ledger from backup and migrates down        |

---

## 4. SOURCE METADATA

- Group: transport-and-state
- Canonical catalog source: `README.md`
- Feature file path: `transport-and-state/redacted-durable-ledger.md`
- Current status: shipped

Related references:

- [canonical-redaction.md](canonical-redaction.md) - the policy applied before every append
- [sync-replay-barrier.md](sync-replay-barrier.md) - the sync hub that reads ledger plans
