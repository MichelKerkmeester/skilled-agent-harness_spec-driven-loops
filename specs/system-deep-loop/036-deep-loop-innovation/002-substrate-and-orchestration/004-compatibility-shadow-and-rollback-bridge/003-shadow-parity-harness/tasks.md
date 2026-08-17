---
title: "Tasks: Shadow-Parity Harness"
description: "Tasks for the sealed-input legacy-versus-dark parity harness, divergence triage, and pre-cutover certificate gate."
trigger_phrases:
  - "shadow parity harness tasks"
  - "legacy dark parity implementation tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-substrate-and-orchestration/004-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-substrate-and-orchestration/004-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Completed all protocol and verification tasks with recorded receipts"
    next_safe_action: "Use the freshness verifier at downstream shadow-mode gates"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Shadow-Parity Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Close the phase-003 baseline into a mode-addressable parity-case manifest with no unclassified scenario, observable, state surface, reader, effect, or projection row [evidence: `implementation-summary.md` delivered-protocol and verification receipts.]
- [x] T002 Define versioned schemas for case capsules, observable transcripts, divergence records, parity certificates, and certificate-verification responses [evidence: `implementation-summary.md` delivered-protocol and verification receipts.]
- [x] T003 Register every code/build, BASE, seal, replay, upcaster, reducer, projection, adapter, comparator, and harness identity that must invalidate stale evidence [evidence: `implementation-summary.md` delivered-protocol and verification receipts.]
- [x] T004 Establish isolated legacy/dark roots, authoritative-path guards, shadow effect sinks, cleanup receipts, and negative collision fixtures [evidence: `implementation-summary.md` delivered-protocol and verification receipts.]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Implement sealed-input preflight that verifies one ordered phase-007 artifact set, BASE, initial-state digest, configuration, and timeout/termination contract before execution [evidence: `implementation-summary.md` delivered-protocol and verification receipts.]
- [x] T006 Implement independent legacy and dark clones from the verified case capsule with no shared mutable outputs or live side effects [evidence: `implementation-summary.md` delivered-protocol and verification receipts.]
- [x] T007 Implement complete terminal, transition, effect/receipt, budget, artifact, and reader-facing observation capture for both paths [evidence: `implementation-summary.md` delivered-protocol and verification receipts.]
- [x] T008 Integrate the phase-006 verifier and retain complete run-specific attestations while comparing registered observable component digests [evidence: `implementation-summary.md` delivered-protocol and verification receipts.]
- [x] T009 Implement sibling-002 comparison for legacy JSONL/JSON bytes, order, whitespace, newlines, suppression, integrity, timing, watermarks, and unchanged-reader results [evidence: `implementation-summary.md` delivered-protocol and verification receipts.]
- [x] T010 Implement typed fail-closed classification for input, harness, replay, outcome, event, projection, byte, missing-observation, and nondeterminism divergences [evidence: `implementation-summary.md` delivered-protocol and verification receipts.]
- [x] T011 Implement immutable bounded divergence evidence, deterministic ownership routing, reproduction, and complete-rerun closure [evidence: `implementation-summary.md` delivered-protocol and verification receipts.]
- [x] T012 Implement idempotent mode-scoped certificate issuance over the complete zero-divergence case manifest [evidence: `implementation-summary.md` delivered-protocol and verification receipts.]
- [x] T013 Implement certificate freshness verification for phase-013 mode gates and phase 014 without exposing an authority mutation [evidence: `implementation-summary.md` delivered-protocol and verification receipts.]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Verify every required parity case starts from identical sealed inputs and remains isolated from live and tracked state [evidence: `implementation-summary.md` delivered-protocol and verification receipts.]
- [x] T015 Verify positive cases match effective-event and canonical-projection fingerprint components plus every declared legacy-shaped byte and reader result [evidence: `implementation-summary.md` delivered-protocol and verification receipts.]
- [x] T016 Inject every divergence class and verify precise evidence, stable ownership, no source mutation, and certificate refusal [evidence: `implementation-summary.md` delivered-protocol and verification receipts.]
- [x] T017 Repeat sealed cases under supported processes/platforms and verify deterministic transcripts, digests, bytes, and classifications [evidence: `implementation-summary.md` delivered-protocol and verification receipts.]
- [x] T018 Mutate each certificate-bound identity independently and verify phase 014 rejects the stale or wrong-mode certificate [evidence: `implementation-summary.md` delivered-protocol and verification receipts.]
- [x] T019 Verify partial, skipped, failed, duplicate-conflict, or open-divergence case sets cannot emit a certificate [evidence: `implementation-summary.md` delivered-protocol and verification receipts.]
- [x] T020 Verify the complete green mode set emits one immutable certificate and changes no legacy authority, writer, reader, file, or effect [evidence: `implementation-summary.md` delivered-protocol and verification receipts.]
- [x] T021 Run strict spec validation and the implementation gate; record commands, exit codes, discovery counts, BASE, and candidate identity [evidence: `implementation-summary.md` records 54/54 Vitest, compiler, schema, strict-validator, BASE, and candidate receipts.]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [evidence: T001-T021 are checked with implementation or verification receipts.]
- [x] All requirements in spec.md met with evidence [evidence: `implementation-summary.md` maps the delivered protocol and gates.]
- [x] Every mode's closed parity set is green with zero open divergences [evidence: complete-set issuance and open-divergence refusal fixtures pass.]
- [x] Phase 014 rejects missing or stale parity certificates [evidence: wrong-mode, tamper, BASE, 11 binding, and replay-evidence drift fixtures pass.]
- [x] Phase gate green without tracked, live-state, or authority mutation [evidence: 54/54 focused tests and protected-authority byte sentinels pass.]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Baseline**: See `../../003-baseline-taxonomy-and-state-census/spec.md`
- **Replay fingerprints**: See `../../002-transition-authorized-ledger-core/003-replay-fingerprints/spec.md`
- **Sealed inputs**: See `../../003-shared-evidence-and-control-services/002-sealed-reference-artifacts/spec.md`
- **Legacy projections**: See `../002-legacy-projections/spec.md`
- **Program ordering**: See `../../manifest/phase-tree.json`
<!-- /ANCHOR:cross-refs -->
