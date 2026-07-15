---
title: "Checklist: Stream-Fold Gauges"
description: "Blocking verification checklist for deterministic stream-fold gauges, standard gauge coverage, incremental/full replay parity, checkpoint safety, and dark runtime integration."
trigger_phrases:
  - "stream-fold gauges checklist"
  - "deterministic gauge replay checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/004-shared-evidence-and-control-services/005-stream-fold-gauges"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/004-shared-evidence-and-control-services/005-stream-fold-gauges"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined blocking replay, checkpoint, and dark-integration checks"
    next_safe_action: "Execute the full-versus-incremental replay matrix"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Stream-Fold Gauges

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the stream-fold gauge phase. Each completed item must cite a
candidate commit, ledger-fixture digest, gauge-definition/configuration digest, command and exit code, and the compared
cutoff sequence/hash. Zero gauges, zero events, a missing required family, or a comparison that omits canonical output
bytes is a failed verification rather than a vacuous pass.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase-003 fixtures expose a verified ordered stream with ledger ID, canonical event bytes, sequence/hash head, authorization linkage, and explicit schema/version data
- [ ] CHK-002 [P0] The standard manifest contains progress, novelty, cost, and health-input gauges with source events, typed units, missing-value semantics, versions, and downstream ownership
- [ ] CHK-003 [P1] Pinned fixtures capture shipped fan-out, convergence, coverage-signal/snapshot, and observability behavior before dark integration
- [ ] CHK-004 [P2] Candidate commit, fixture digests, gauge registry digest, supported platform matrix, and replay cutoffs are recorded in the verifier report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] Every reducer is pure and sequential: no current clock, RNG, locale, filesystem order, network read, process global, mutable singleton, or previous published gauge value affects output
- [ ] CHK-006 [P0] Gauge definitions are immutable and versioned; any semantic, event-contract, numeric, canonicalization, or configuration change produces a new version or digest
- [ ] CHK-007 [P1] Integer/fixed-point units, missing values, map/set ordering, event windows, and canonical bytes are explicit and shared across full and incremental paths
- [ ] CHK-008 [P1] Changes stay within this phase's gauge/projection boundary; no sibling budget, novelty, continuity, locking, convergence, or cutover policy is reimplemented
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] Repeated genesis-to-cutoff full replays produce byte-identical accumulator and final output bytes for every standard gauge across process restarts
- [ ] CHK-010 [P0] Arbitrary prefix/suffix splits and batch sizes prove checkpoint-plus-suffix output equals full replay byte for byte at the same ledger head
- [ ] CHK-011 [P0] Ledger ID, sequence, head hash, gauge version, reducer/configuration digest, accumulator hash, or checkpoint-schema mismatch invalidates the checkpoint and records a full rebuild
- [ ] CHK-012 [P0] Sequence gaps, forks, hash failures, malformed events, unknown versions/types, failed upcasts, invalid units, and non-canonical numeric values return typed errors before publication
- [ ] CHK-013 [P0] Progress gauges rebuild completion, open-work, evidence/obligation coverage, and terminal counts without worker memory, directory scans, or prior snapshots
- [ ] CHK-014 [P0] Novelty gauges preserve novel, duplicate/reused, contradicted, superseded, and unknown dispositions under declared sequence/event-time windows
- [ ] CHK-015 [P0] Cost gauges retain exact typed token, currency-minor-unit, duration-budget, iteration, and tool-use arithmetic; mixed scopes or units fail closed
- [ ] CHK-016 [P0] Health gauges reproduce lag, pending, failed, retried, orphaned, stalled, and integrity-refusal inputs while threshold or policy changes leave fold output unchanged
- [ ] CHK-017 [P0] Gauge snapshot/telemetry events cannot feed their originating reducer, and the declared gauge dependency graph rejects cycles
- [ ] CHK-018 [P0] Result envelopes independently identify ledger cutoff, gauge ID/version, configuration digest, accumulator/output hashes, computation mode, and checkpoint provenance
- [ ] CHK-019 [P0] Dark comparison fixtures cover shipped fan-out, convergence, coverage, snapshot, and observability surfaces while legacy output, schema, failure behavior, and authority remain unchanged
- [ ] CHK-020 [P1] Property tests cover empty streams, one-event streams, long streams, repeated idempotent events, ordering boundaries, large exact values, restarts, and checkpoint cadence changes
- [ ] CHK-021 [P1] Performance evidence compares full and incremental computation without weakening validation, regrouping non-associative arithmetic, or allowing a cache to become authority
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-022 [P1] The reviewed runtime inventory maps every existing gauge/metric producer and consumer either to a standard fold, a named mode extension, or an explicit out-of-scope owner
- [ ] CHK-023 [P1] Every run-2 finding mapped to `runtime/gauges-observability` has a traceable disposition in the phase-001 recommendation ledger and an owning gauge or later phase
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-024 [P1] Reducers consume only verified authorized ledger records; corrupt or untrusted bytes cannot reach a trusted gauge, checkpoint, or published result
- [ ] CHK-025 [P2] Gauge outputs expose no additional sealed payload or provenance detail beyond the declared result schema and existing authorization boundary
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-026 [P1] Gauge registry documentation names event contracts, units, versions, error semantics, replay provenance, checkpoint rules, and downstream consumers for every standard gauge
- [ ] CHK-027 [P2] Feature catalog and manual verification guidance describe full replay, checkpoint invalidation, dark comparison, and rollback without claiming authority cutover
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-028 [P1] Registry, reducer kernel, standard definitions, checkpoint cache, result envelope, and dark adapters have single ownership with no duplicate fold implementation in scripts
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, all four standard gauge families are present, full and incremental
replay are byte-identical at pinned ledger heads, stale or corrupt checkpoints rebuild, unsupported inputs fail closed,
and dark comparisons leave shipped runtime authority unchanged. The report must bind results to the candidate commit,
ledger fixtures, gauge definitions, configuration digests, platform matrix, and strict validation output.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the deterministic replay matrix, checkpoint invalidation matrix, standard-family
coverage, provenance envelopes, and additive-dark isolation with no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
