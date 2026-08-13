---
title: "Checklist: Model Benchmark — Reducers & Projections"
description: "Blocking verification checklist for the deterministic model-benchmark reducers, multi-model matrix projections, raw-trial artifact index, uncertainty-aware scoring, and shared deep-improvement service consumption."
trigger_phrases:
  - "model benchmark reducers checklist"
  - "model benchmark projection verification"
  - "scoring matrix replay verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/002-reducers-and-projections"
    last_updated_at: "2026-07-23T12:15:00Z"
    last_updated_by: "codex"
    recent_action: "Passed reducer replay and integrity verification"
    next_safe_action: "Consume the additive shadow projection downstream"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Model Benchmark — Reducers & Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the model-benchmark reducers and projections phase. Every item is a
check the paired verify agent runs before the candidate implementation lands; each report pins the candidate SHA,
predecessor schema fingerprint, shared-service contract fingerprint, reducer and score-policy versions, fixture digest,
commands, exit codes, event counts, matrix counts, projection hashes, and exact-scope diff. Any side effect,
order-dependent projection, lost raw evidence, silent cell inference, common-service fork, or unexpected tracked mutation
fails the gate.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The landed typed ledger supplies the closed event union and full matrix identity [Evidence: `implementation-summary.md`, targeted Vitest 26/26]
- [x] CHK-002 [P0] The common reducer surface and fold branch are imported unchanged [Evidence: `implementation-summary.md`, common-fold oracle test; targeted Vitest 26/26]
- [x] CHK-003 [P1] Composite ownership is split between exact `common` state and namespaced `modelBenchmark` fields [Evidence: `implementation-summary.md`, branch/shape test; targeted Vitest 26/26]
- [x] CHK-004 [P1] The typed fixture covers run, matrix, raw trial, score, validity, selection, checkpoint, and veto paths [Evidence: targeted Vitest 26/26]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] Reducers are pure and import no effectful model, evaluator, filesystem, network, clock, sealing, promotion, or rollback service [Evidence: `implementation-summary.md`, source import audit; targeted Vitest 26/26]
- [x] CHK-006 [P0] Raw observations and score/ranking records are separate append-only projection families [Evidence: raw-versus-ranking test; targeted Vitest 26/26]
- [x] CHK-007 [P0] Full matrix keys are canonically hashed, records are sorted, duplicates are idempotent, and checkpoints preserve byte identity [Evidence: determinism and checkpoint tests; targeted Vitest 26/26]
- [x] CHK-008 [P1] Scope contains only the reducer module, one unit test, and this leaf's docs [Evidence: exact-scope `git status --short`; targeted Vitest 26/26]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] Complete and checkpointed replay produce byte-identical composite projections [Evidence: checkpoint-equivalence test; targeted Vitest 26/26]
- [x] CHK-010 [P0] Canonical key ordering and equivalent batch boundaries produce identical bytes [Evidence: determinism test; targeted Vitest 26/26]
- [x] CHK-011 [P0] Per-stream gaps, out-of-order events, phantom sources, forged tails, and unknown extensions fail closed [Evidence: five negative tests; targeted Vitest 26/26]
- [x] CHK-012 [P0] Run state, cell progress, coverage, unresolved evidence, and per-stream resume frontiers derive from events alone [Evidence: fixture projection assertions; targeted Vitest 26/26]
- [x] CHK-013 [P0] Artifact records retain workload, raw result, usage, validity, selection, and score references [Evidence: artifact projection implementation and fixture; targeted Vitest 26/26]
- [x] CHK-014 [P0] Raw observations, typed scores, uncertainty, validity, sealed evidence, and rankings remain separate [Evidence: raw-versus-ranking test; targeted Vitest 26/26]
- [x] CHK-015 [P0] Hard-floor failures and shared veto codes keep rankings ineligible [Evidence: hard-floor veto test; shared status delegation; targeted Vitest 26/26]
- [x] CHK-016 [P0] Shared events produce byte-identical common state to the common fold oracle [Evidence: common-fold oracle test; targeted Vitest 26/26]
- [x] CHK-017 [P1] Version mismatches and checkpoint incompatibility return named rebuild reasons [Evidence: fold option and checkpoint validation; targeted Vitest 26/26]
- [x] CHK-018 [P1] The landed schema has no adaptive-selection event; the reducer infers no such facts and rejects unknown extensions [Evidence: unknown-extension test; targeted Vitest 26/26]
- [x] CHK-019 [P1] Failure injection leaves raw evidence separate and rejects corrupt replay before state advancement [Evidence: phantom-source and forged-tail tests; targeted Vitest 26/26]
- [x] CHK-027 [P0] Judge, oracle, contamination, exposure, disclosure, retirement, and replacement events each update their projection family [Evidence: seven focused stem-fold tests; targeted Vitest 26/26]
- [x] CHK-028 [P0] Confirmed contamination marks affected scores and pairwise results and invalidates existing rankings [Evidence: late-contamination test; targeted Vitest 26/26]
- [x] CHK-029 [P0] Unknown hard floors remain ineligible until an explicit pass or not-applicable disposition [Evidence: unknown hard-floor test; targeted Vitest 26/26]
- [x] CHK-030 [P0] Exposure, disclosure, retirement, and replacement cannot silently remain ranked evidence [Evidence: lifecycle eligibility assertions; targeted Vitest 26/26]
- [x] CHK-031 [P1] Pairwise comparison results and cost/latency slices are separate addressable records [Evidence: pairwise and operational-slice tests; targeted Vitest 26/26]
- [x] CHK-035 [P0] Cited abstained or otherwise inconclusive judge evidence keeps the aggregate ranking ineligible unless a later same-evaluator observation supersedes it [Evidence: abstention and positive-control tests; targeted Vitest 33/33]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-020 [P1] The model fold exhaustively dispatches the landed specific event union into run, iteration, artifact, scoring, and status projections [Evidence: explicit handled-stem inventory equals the real registry; targeted Vitest 26/26]
- [x] CHK-021 [P1] Model fields live under `modelBenchmark`; common fields remain exact under `common` [Evidence: fold-branch and no-widening test; targeted Vitest 26/26]
- [x] CHK-032 [P0] A registry-admitted stem without a matching case returns a typed rebuild requirement instead of becoming a no-op [Evidence: completeness guard and typed default; targeted Vitest 26/26]
- [x] CHK-033 [P0] Cell dispositions only move through legal forward transitions [Evidence: regression rejection and legal checkpoint tests; targeted Vitest 26/26]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-022 [P0] Reduction has no external write path and returns recursively frozen state [Evidence: verified reducer-surface test; targeted Vitest 26/26]
- [x] CHK-023 [P1] The exported legacy view is shadow-only and excludes raw benchmark and judge payloads [Evidence: legacy projection schema; targeted Vitest 26/26]
- [x] CHK-024 [P1] Typed hard floors, validity blockers, and common vetoes are executable eligibility blockers [Evidence: ranking derivation and hard-floor test; targeted Vitest 26/26]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-025 [P1] The implementation summary records matrix identity, projection families, replay invariants, scoring lineage, and common ownership [Evidence: `implementation-summary.md`; targeted Vitest 26/26]
- [x] CHK-034 [P1] The decision record captures the fail-closed, transition, and evidence-preservation choices [Evidence: `decision-record.md`; strict validation]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-026 [P1] The additive-dark write set is limited to the requested module, test, and leaf docs [Evidence: exact-scope `git status --short`; targeted Vitest 26/26]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the report pins the predecessor and shared-service
fingerprints, complete and checkpointed replay agree across matrix permutations, raw trial evidence and lineage remain
available, scoring uncertainty and invalid states are explicit, and Model Benchmark consumes one shared evaluator,
canary, promotion, veto, rollback, and status contract without semantic drift.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the P0 contract, the strict spec validator passes, and the exact-scope diff check
shows no unexpected tracked mutation outside the model-benchmark implementation surface assigned to this phase.
<!-- /ANCHOR:sign-off -->
