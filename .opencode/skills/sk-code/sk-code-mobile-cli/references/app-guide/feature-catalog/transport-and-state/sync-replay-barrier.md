---
title: 'Sync and replay barrier'
description: 'A sync hub that joins replay snapshots and live deltas without interleaving pre-snapshot messages.'
trigger_phrases:
  - 'Sync and replay barrier'
  - 'sync hub'
  - 'replay snapshot'
  - 'live delta'
  - 'SyncHub'
version: 1.0.0.0
---

# Sync and replay barrier (SyncHub)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

A sync hub that joins replay snapshots and live deltas without interleaving pre-snapshot messages.

The hub is the publish and subscribe spine of the relay. Every committed envelope is broadcast to matching subscriptions, and each subscription opens with a replay plan that is frozen before live delivery begins.

Current status: shipped.

---

## 2. HOW IT WORKS

### Publish Path

`publish` redacts and appends the envelope through the store, then broadcasts it to every matching subscription and notifies committed listeners. Only an inserted envelope is broadcast, so duplicates never reach subscribers twice.

### Subscribe Barrier

A subscription registers with an identity and an optional cursor, and the hub builds the plan through the store at that instant. Snapshot, delta, or gap messages are sent in plan order, and only after the barrier is set does the hub release live deltas. Deltas that arrive during initialization are queued and flushed in sequence order once the plan is out, so a client never sees a delta before its snapshot.

---

## 3. SOURCE FILES

### Implementation

| File                                      | Layer   | Role                                                               |
| ----------------------------------------- | ------- | ------------------------------------------------------------------ |
| `apps/pi-remote-relay/src/replay/sync.ts` | Handler | Implements the publish path, subscription barrier, and delta queue |

### Validation And Tests

| File                                                                   | Type        | Role                                                          |
| ---------------------------------------------------------------------- | ----------- | ------------------------------------------------------------- |
| `apps/pi-remote-relay/tests/sync.test.ts`                              | Vitest      | Covers the snapshot and live sync barrier                     |
| `apps/pi-remote-relay/tests/integration/recorded-fixture-flow.test.ts` | Integration | Runs the full replay and delta flow from the recorded fixture |
| `apps/pi-remote-relay/tests/security/negative-controls.test.ts`        | Integration | Pins the barrier behavior as a fail-closed control            |

---

## 4. SOURCE METADATA

- Group: transport-and-state
- Canonical catalog source: `README.md`
- Feature file path: `transport-and-state/sync-replay-barrier.md`
- Current status: shipped

Related references:

- [redacted-durable-ledger.md](redacted-durable-ledger.md) - the store that produces cursor plans
- [transcript-projection.md](transcript-projection.md) - the projector whose blocks flow through the hub
