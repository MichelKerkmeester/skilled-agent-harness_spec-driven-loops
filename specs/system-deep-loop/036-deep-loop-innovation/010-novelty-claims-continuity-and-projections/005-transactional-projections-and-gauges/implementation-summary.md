---
title: "Implementation Summary: Transactional Projections & Gauges"
description: "Delivered an additive-dark projection runtime that commits ledger-derived views, frozen gauges, receipts, and watermarks in one fenced atomic unit, with verified resume and isolated generation publication."
trigger_phrases:
  - "transactional projections implementation"
  - "atomic projection verifier evidence"
  - "projection generation rebuild summary"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/005-transactional-projections-and-gauges"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/005-transactional-projections-and-gauges"
    last_updated_at: "2026-07-21T09:42:29Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the additive-dark transactional projection runtime"
    next_safe_action: "Monitor additive-dark evidence while legacy surfaces remain authoritative"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/transactional-projections/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/transactional-projections.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Transactional Projections & Gauges

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-transactional-projections-and-gauges |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Authority** | Additive-dark; legacy observability and views remain authoritative |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The runtime can now project one verified ledger event across dashboards, registries, claim tables, indexes, all four
standard gauges, the apply receipt, and the inclusive watermark as one fenced canonical replacement. A failed
reducer, validation, fence, compare-and-swap, serialization, or storage step leaves the complete prior document
visible. Snapshot validation rejects any view or gauge whose generation, bundle contract, sequence, record hash, or
canonical content hash differs from the shared cutoff.

The same engine rebuilds a complete verified prefix into an invisible fresh generation. It validates the generation,
then changes reader visibility through one active-pointer replacement. The prior verified generation remains retained
for one fenced rollback. External sinks receive immutable committed manifests only, while legacy UUID and wall-clock
fields remain comparison metadata and never enter ordering, receipt identity, watermarks, or canonical projection
hashes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/transactional-projections/projection-bundle-registry.ts` | Created | Registers exact bundle, view, gauge, dependency, schema, reducer, and configuration contracts |
| `runtime/lib/transactional-projections/transactional-projection-store.ts` | Created | Binds the complete projection root to one single-host fenced atomic replacement |
| `runtime/lib/transactional-projections/transactional-projection-engine.ts` | Created | Applies events, validates receipts and snapshots, resumes, rebuilds, publishes, and rolls back generations |
| `runtime/lib/transactional-projections/committed-snapshot-publisher.ts` | Created | Delivers immutable post-commit manifests without canonical mutation access |
| `runtime/lib/transactional-projections/legacy-dark-comparison.ts` | Created | Records bounded parity evidence while returning the exact authoritative legacy result |
| `runtime/lib/transactional-projections/transactional-projection-types.ts` | Created | Defines durable registry, generation, receipt, watermark, snapshot, and publication schemas |
| `runtime/lib/transactional-projections/transactional-projection-errors.ts` | Created | Provides typed fail-closed projection refusals |
| `runtime/lib/transactional-projections/index.ts` | Created | Exposes the additive transactional projection API |
| `runtime/tests/unit/transactional-projections.vitest.ts` | Created | Exercises atomicity, idempotency, fencing, corruption, replay parity, snapshots, and publication |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation composes the frozen verified-ledger reader, replay identity, fenced state replacement, and exact
phase-007 gauge registry. It does not modify or copy their reducers. The test suite injects faults after view, gauge,
receipt, watermark, before-commit, and after-commit boundaries; races concurrent commits; corrupts rows, receipts, and
store bytes; compares all four gauge accumulators and outputs against `replayGauge`; holds snapshots across live and
generation advances; varies restart boundaries and JSON insertion order; and rebuilds a 250-event prefix.

Operator sequence:

1. Pause by stopping lease acquisition; never edit a row or watermark manually.
2. Resume with `planResume(verifiedEvents, verifiedReplayIdentity)`. Continue only on `mode: "resume"`; rebuild on every other result.
3. Rebuild with `stageRebuild` into a fresh generation from the complete verified prefix.
4. Verify the staged generation through its canonical hash and snapshot checks, then call `publishGeneration` with the expected active generation.
5. Roll back only with `rollbackGeneration`, the retained predecessor, the current fence, and the expected active pointer.
6. Publish externally through `CommittedSnapshotPublisher`; retry delivery without touching canonical progress.
7. Compare legacy outputs with `compareLegacyProjection`; treat every mismatch as evidence, never as a control decision.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Store every view, gauge, receipt, watermark, generation, and pointer in one canonical fenced document | A single durable replacement removes the independently committed table failure mode named in the specification |
| Check an exact duplicate before comparing the caller's expected watermark | A retry after commit but before receipt delivery must return the original receipt even when the caller still holds the old watermark |
| Keep rebuild generations invisible until a separate pointer commit | Readers can only resolve the complete old generation or complete verified new generation |
| Derive gauge state only through `GaugeRegistry.reduce` and `GaugeRegistry.finalize` | The transaction layer changes publication boundaries without changing gauge IDs, arithmetic, filters, or canonical output |
| Exclude generation IDs, receipt IDs, and legacy metadata from the canonical projection-content hash | Equivalent verified ledger prefixes must hash identically across fresh generation identities and legacy metadata drift |
| Preserve the exact legacy result reference in dark comparison | Evidence cannot intercept or replace existing runtime authority |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Transactional projection Vitest leaf | PASS, 18/18 tests |
| Runtime TypeScript no-emit check | PASS, exit 0 |
| Strict leaf spec validation | PASS, exit 0 with 0 errors |
| Comment-hygiene scan | PASS, no ephemeral requirement, packet, task, finding, phase, or ADR labels in runtime code comments |
| Frozen substrate status | PASS, no tracked modifications under authorized-ledger, replay-fingerprint, stream-fold-gauges, locks-and-fencing, legacy-projections, or observability-events.cjs |

### Automated Requirement Evidence

| Requirements | Named Vitest evidence |
|--------------|-----------------------|
| REQ-001 | `freezes dependency order and reducer/configuration digests`; `rejects duplicate identities and cyclic dependencies` |
| REQ-002, REQ-003, REQ-006 | `publishes every view, gauge, receipt, and watermark at one inclusive cutoff`; `aborts the complete unit when any view or precommit boundary fails` |
| REQ-004 | `returns the original receipt after crash-after-commit and rejects changed effective bytes/version` |
| REQ-005, REQ-011 | `resumes only when ledger, generation, bundle digests, cutoff, and replay provenance verify`; receipt-corruption fixture |
| REQ-007 | `rejects a stale lease and a concurrent state-version race without partial effects` |
| REQ-008, REQ-009 | deterministic fresh-generation, restart-boundary, insertion-order, snapshot-swap, and rollback fixtures |
| REQ-010 | `matches every frozen standard gauge fold exactly` against `replayGauge` for progress, novelty, cost, and health |
| REQ-012 | sequence-gap, schema-version, mixed-cutoff, receipt-corruption, ledger-corruption, and store-corruption fixtures |
| REQ-013 | `cannot advance canonical state when delivery fails or retries` |
| REQ-014 | `returns the exact legacy object and excludes UUID/time metadata from replay authority` |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Dark authority only.** The new runtime does not cut over dashboards, legacy views, or observability decisions. That boundary remains deliberately unchanged.
2. **Single-host atomicity.** The canonical transaction uses the existing single-host filesystem fence and atomic replacement. Remote sinks are post-commit consumers, not transaction participants.
3. **Complete-prefix rebuild.** Rebuild accepts the complete verified prefix in memory. It preserves deterministic semantics but is not a streaming or distributed rebuild service.
<!-- /ANCHOR:limitations -->
