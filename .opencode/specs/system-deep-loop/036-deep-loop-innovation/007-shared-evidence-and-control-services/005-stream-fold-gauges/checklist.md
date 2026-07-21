---
title: "Checklist: Stream-Fold Gauges"
description: "Blocking verification checklist for deterministic stream-fold gauges, standard gauge coverage, incremental/full replay parity, checkpoint safety, and dark runtime integration."
trigger_phrases:
  - "stream-fold gauges checklist"
  - "deterministic gauge replay checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/005-stream-fold-gauges"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/005-stream-fold-gauges"
    last_updated_at: "2026-07-21T00:38:15Z"
    last_updated_by: "codex"
    recent_action: "Completed the replay, checkpoint, additive-dark, and strict gates"
    next_safe_action: "Keep the service dark until an owning cutover phase integrates it"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/stream-fold-gauges/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/stream-fold-gauges.vitest.ts"
      - "implementation-summary.md"
    completion_pct: 100
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

- [x] CHK-001 [P0] Phase-006 fixtures expose a verified ordered stream with ledger ID, canonical event bytes, sequence/hash head, authorization linkage, and explicit schema/version data [Evidence: `implementation-summary.md` verified-stream proof]
- [x] CHK-002 [P0] The standard manifest contains progress, novelty, cost, and health-input gauges with source events, typed units, missing-value semantics, versions, and downstream ownership [Evidence: `stream-fold-gauges.vitest.ts` manifest test]
- [x] CHK-003 [P1] Pinned fixtures capture shipped fan-out, convergence, coverage-signal/snapshot, and observability behavior before dark integration [Evidence: `stream-fold-gauges.vitest.ts` five-surface fixture matrix]
- [x] CHK-004 [P2] Candidate commit, fixture digests, gauge registry digest, supported platform matrix, and replay cutoffs are recorded in the verifier report [Evidence: `implementation-summary.md` metadata and verification]

Evidence: `implementation-summary.md` metadata, contract proofs, runtime inventory, and verification tables.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] Every reducer is pure and sequential: no current clock, RNG, locale, filesystem order, network read, process global, mutable singleton, or previous published gauge value affects output [Evidence: `stream-fold-gauges.vitest.ts` ambient and hostile-locale tests]
- [x] CHK-006 [P0] Gauge definitions are immutable and versioned; any semantic, event-contract, numeric, canonicalization, or configuration change produces a new version or digest [Evidence: `gauge-registry.ts` and focused digest tests]
- [x] CHK-007 [P1] Integer/fixed-point units, missing values, map/set ordering, event windows, and canonical bytes are explicit and shared across full and incremental paths [Evidence: `standard-gauges.ts` and focused parity tests]
- [x] CHK-008 [P1] Changes stay within this phase's gauge/projection boundary; no sibling budget, novelty, continuity, locking, convergence, or cutover policy is reimplemented [Evidence: `implementation-summary.md` scoped status and runtime inventory]

Evidence: `gauge-registry.ts`, `standard-gauges.ts`, `gauge-replay.ts`, and `sk-code` quality gates.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] Repeated genesis-to-cutoff full replays produce byte-identical accumulator and final output bytes for every standard gauge across process restarts [Evidence: focused Vitest 37/37 including child process]
- [x] CHK-010 [P0] Arbitrary prefix/suffix splits and batch sizes prove checkpoint-plus-suffix output equals full replay byte for byte at the same ledger head [Evidence: all four gauges at splits `0..12`]
- [x] CHK-011 [P0] Ledger ID, sequence, head hash, gauge version, reducer/configuration digest, accumulator hash, or checkpoint-schema mismatch invalidates the checkpoint and records a full rebuild [Evidence: checkpoint drift and corruption matrix]
- [x] CHK-012 [P0] Sequence gaps, forks, hash failures, malformed events, unknown versions/types, failed upcasts, invalid units, and non-canonical numeric values return typed errors before publication [Evidence: `stream-fold-gauges.vitest.ts` fail-closed tests]
- [x] CHK-013 [P0] Progress gauges rebuild completion, open-work, evidence/obligation coverage, and terminal counts without worker memory, directory scans, or prior snapshots [Evidence: progress fold test]
- [x] CHK-014 [P0] Novelty gauges preserve novel, duplicate/reused, contradicted, superseded, and unknown dispositions under declared sequence/event-time windows [Evidence: `stream-fold-gauges.vitest.ts` novelty window tests]
- [x] CHK-015 [P0] Cost gauges retain exact typed token, currency-minor-unit, duration-budget, iteration, and tool-use arithmetic; mixed scopes or units fail closed [Evidence: `stream-fold-gauges.vitest.ts` exact-value tests]
- [x] CHK-016 [P0] Health gauges reproduce lag, pending, failed, retried, orphaned, stalled, and integrity-refusal inputs while threshold or policy changes leave fold output unchanged [Evidence: `standard-gauges.ts` health contract test]
- [x] CHK-017 [P0] Gauge snapshot/telemetry events cannot feed their originating reducer, and the declared gauge dependency graph rejects cycles [Evidence: `stream-fold-gauges.vitest.ts` self-input and cycle tests]
- [x] CHK-018 [P0] Result envelopes independently identify ledger cutoff, gauge ID/version, configuration digest, accumulator/output hashes, computation mode, and checkpoint provenance [Evidence: `gauge-replay.ts` result assertions]
- [x] CHK-019 [P0] Dark comparison fixtures cover shipped fan-out, convergence, coverage, snapshot, and observability surfaces while legacy output, schema, failure behavior, and authority remain unchanged [Evidence: `stream-fold-gauges.vitest.ts` dark matrix]
- [x] CHK-020 [P1] Property tests cover empty streams, one-event streams, long streams, repeated idempotent events, ordering boundaries, large exact values, restarts, and checkpoint cadence changes [Evidence: focused Vitest 37/37 boundary matrix]
- [x] CHK-021 [P1] Performance evidence compares full and incremental computation without weakening validation, regrouping non-associative arithmetic, or allowing a cache to become authority [Evidence: `eventsProcessed` equals each suffix length while bytes remain equal]

Evidence: focused Vitest `stream-fold-gauges.vitest.ts`, 37/37 pass; every gauge and every prefix `0..12` checks suffix work and byte parity.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-022 [P1] The reviewed runtime inventory maps every existing gauge/metric producer and consumer either to a standard fold, a named mode extension, or an explicit out-of-scope owner [Evidence: `implementation-summary.md` runtime inventory]
- [x] CHK-023 [P1] Every run-2 finding mapped to `runtime/gauges-observability` has a traceable disposition in the phase-004 recommendation ledger and an owning gauge or later phase [Evidence: `implementation-summary.md` run-2 disposition table]

Evidence: `implementation-summary.md` runtime inventory and eleven-row run-b disposition map.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-024 [P1] Reducers consume only verified authorized ledger records; corrupt or untrusted bytes cannot reach a trusted gauge, checkpoint, or published result [Evidence: `gauge-replay.ts` integrity tests and real ledger replay]
- [x] CHK-025 [P2] Gauge outputs expose no additional sealed payload or provenance detail beyond the declared result schema and existing authorization boundary [Evidence: bounded evidence payload tests]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-026 [P1] Gauge registry documentation names event contracts, units, versions, error semantics, replay provenance, checkpoint rules, and downstream consumers for every standard gauge [Evidence: public TSDoc and `implementation-summary.md`]
- [x] CHK-027 [P2] Feature catalog and manual verification guidance describe full replay, checkpoint invalidation, dark comparison, and rollback without claiming authority cutover [Evidence: `implementation-summary.md` feature catalog]

Evidence: public TSDoc plus `implementation-summary.md` contract proofs and feature catalog/manual verification table.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-028 [P1] Registry, reducer kernel, standard definitions, checkpoint cache, result envelope, and dark adapters have single ownership with no duplicate fold implementation in scripts [Evidence: `implementation-summary.md` module table and diff]

Evidence: new `runtime/lib/stream-fold-gauges/` ownership; scoped diff confirms existing scripts are untouched.
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
