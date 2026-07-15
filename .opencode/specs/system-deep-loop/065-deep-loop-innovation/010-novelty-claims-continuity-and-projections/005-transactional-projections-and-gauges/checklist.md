---
title: "Checklist: Transactional Projections & Gauges"
description: "Blocking verification checklist for atomic projection apply, cross-view consistency, idempotent resume, and deterministic generation rebuilds."
trigger_phrases:
  - "transactional projections checklist"
  - "atomic gauges verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/010-novelty-claims-continuity-and-projections/005-transactional-projections-and-gauges"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/010-novelty-claims-continuity-and-projections/005-transactional-projections-and-gauges"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined the blocking atomicity, replay, and generation-swap verifier contract"
    next_safe_action: "Run the transaction fault matrix after implementation lands"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Transactional Projections & Gauges

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 005. Every item remains pending while the phase status
is Planned. The implementation verifier binds its report to the candidate SHA, ledger fixture digest, projection
manifest digest, bundle/reducer versions, canonical-store schema version, and legacy baseline. It records commands,
exit codes, fixture counts, transaction fault points, ledger cutoffs, generation IDs, and canonical hashes; zero-event,
zero-fault, or zero-projection discovery is a failure rather than a pass.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The phase-003 verified reader contract, phase-004 gauge definitions, phase-007 event schemas, and legacy authority boundary are pinned to exact versions.
- [ ] CHK-002 [P0] The projection manifest names every dashboard, registry, claim table, index, and gauge in each atomic consistency bundle.
- [ ] CHK-003 [P0] The selected store demonstrates atomic multi-table commit, snapshot reads, uniqueness constraints, expected-watermark comparison, and fenced writer ownership.
- [ ] CHK-004 [P1] Ledger fixtures cover empty, single-event, multi-event, mixed-event, duplicate, conflicting, corrupt, and schema-evolution streams.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] Reducers are deterministic and do not read wall time, randomness, locale, filesystem order, network state, process globals, or mutable published views.
- [ ] CHK-006 [P0] One coordinator path owns receipt, view, gauge, watermark, and generation mutations; no consumer bypasses the transaction boundary.
- [ ] CHK-007 [P1] Typed errors distinguish duplicate conflicts, stale fences, watermark mismatch, invalid schema, corrupt ledger input, projection constraint failure, and publication lag.
- [ ] CHK-008 [P1] Projection and gauge comments explain durable invariants without packet, phase, task, requirement, or finding labels.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] Inject failure before and after every receipt, view, gauge, watermark, and commit step; each case exposes the full prior or full next state and no intermediate state.
- [ ] CHK-010 [P0] Exact duplicate delivery returns the original receipt with no new mutation; changed bytes or version under the same identity fail before any write.
- [ ] CHK-011 [P0] Crash-before-commit, crash-after-commit, and restart fixtures converge on one receipt, one watermark advance, and byte-identical canonical state.
- [ ] CHK-012 [P0] Concurrent coordinators and stale fences cannot both commit; expected-watermark conflicts leave all related projections unchanged.
- [ ] CHK-013 [P0] Snapshot readers under live apply observe one generation, bundle version, and inclusive ledger sequence/hash across every requested view and gauge.
- [ ] CHK-014 [P0] Genesis replay and every tested checkpoint-plus-suffix resume produce byte-identical canonical row, accumulator, and output hashes at the same ledger head.
- [ ] CHK-015 [P0] Rebuild remains invisible until all rows, provenance, constraints, and canonical hashes validate; publication changes visibility with one atomic pointer swap.
- [ ] CHK-016 [P0] Readers held across the generation swap see a complete old or complete new generation, never mixed rows or partial rebuild progress.
- [ ] CHK-017 [P0] Corrupt watermarks, receipts, rows, event versions, sequence/hash links, dependency graphs, and canonical values fail closed without trusted progress.
- [ ] CHK-018 [P0] Phase-004 progress, novelty, cost, and health-input gauge golden fixtures remain byte-identical inside the projection transaction.
- [ ] CHK-019 [P0] External dashboard/sink outage and retry do not change canonical projection rows, receipt count, active generation, or watermark.
- [ ] CHK-020 [P0] Additive-dark mismatches against `runtime/lib/deep-loop/observability-events.cjs` and legacy views are recorded as evidence and never alter legacy control flow.
- [ ] CHK-021 [P1] Property tests vary event grouping, restart boundary, key insertion order, and supported platform while preserving canonical projection hashes.
- [ ] CHK-022 [P1] Performance tests show bounded transaction and rebuild behavior without weakening sequential event semantics, validation, or atomic visibility.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-023 [P0] Every projection-manifest row has an implementation owner, atomic bundle, source-event fixture, replay fixture, failure fixture, and canonical hash assertion.
- [ ] CHK-024 [P0] Every REQ-001 through REQ-014 maps to named automated evidence; no requirement relies only on prose review.
- [ ] CHK-025 [P1] Invalid watermark or generation state always routes to typed refusal or ledger rebuild; no manual row-copy repair path exists.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-026 [P0] Projection apply accepts only transition-authorized, integrity-verified ledger records and never trusts dashboard, export, checkpoint, or observability payloads as source events.
- [ ] CHK-027 [P1] Fencing and transaction credentials follow least privilege; external publishers cannot mutate canonical views, receipts, watermarks, or generation pointers.
- [ ] CHK-028 [P1] Typed projection failures and provenance exclude secrets and sensitive producer payload fields while retaining auditability.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-029 [P1] The projection manifest, transaction boundary, watermark schema, receipt identity, generation lifecycle, and publication boundary are documented against the implemented contracts.
- [ ] CHK-030 [P1] Operator guidance covers pause, resume, rebuild, verify, publish, rollback, and legacy dark-comparison procedures without implying authority cutover.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-031 [P1] Projection registry, coordinator, storage adapter, readers, publishers, and fixtures have explicit ownership and no duplicate reducer or transaction implementation.
- [ ] CHK-032 [P1] Generated projection state, receipts, snapshots, and rebuild artifacts stay outside authored source/spec paths and are excluded from tracked mutation checks.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when every P0 check passes, every P1 check passes or has explicit operator-approved
deferral, the transaction fault matrix covers every mutation boundary, replay/resume hashes are identical, generation
publication is atomic under concurrent reads, and additive-dark comparison proves legacy authority remains unchanged.
The verifier must also run the phase's build, test, typecheck, and strict spec validation gates against the same
candidate SHA with non-zero fixture discovery.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier binds the green evidence bundle to the candidate SHA, ledger and projection-manifest
digests, bundle/reducer versions, storage schema, tested generation IDs, and canonical replay hashes, with no
unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
