---
title: "Tasks: Shadow-Parity Harness"
description: "Tasks for the sealed-input legacy-versus-dark parity harness, divergence triage, and pre-cutover certificate gate."
trigger_phrases:
  - "shadow parity harness tasks"
  - "legacy dark parity implementation tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/005-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/005-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Decomposed parity harness implementation and verification work"
    next_safe_action: "Build the closed case manifest and sealed-input preflight"
    blockers: []
    key_files: []
    completion_pct: 0
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

- [ ] T001 Close the phase-000 baseline into a mode-addressable parity-case manifest with no unclassified scenario, observable, state surface, reader, effect, or projection row
- [ ] T002 Define versioned schemas for case capsules, observable transcripts, divergence records, parity certificates, and certificate-verification responses
- [ ] T003 Register every code/build, BASE, seal, replay, upcaster, reducer, projection, adapter, comparator, and harness identity that must invalidate stale evidence
- [ ] T004 Establish isolated legacy/dark roots, authoritative-path guards, shadow effect sinks, cleanup receipts, and negative collision fixtures
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Implement sealed-input preflight that verifies one ordered phase-004 artifact set, BASE, initial-state digest, configuration, and timeout/termination contract before execution
- [ ] T006 Implement independent legacy and dark clones from the verified case capsule with no shared mutable outputs or live side effects
- [ ] T007 Implement complete terminal, transition, effect/receipt, budget, artifact, and reader-facing observation capture for both paths
- [ ] T008 Integrate the phase-003 verifier and retain complete run-specific attestations while comparing registered observable component digests
- [ ] T009 Implement sibling-002 comparison for legacy JSONL/JSON bytes, order, whitespace, newlines, suppression, integrity, timing, watermarks, and unchanged-reader results
- [ ] T010 Implement typed fail-closed classification for input, harness, replay, outcome, event, projection, byte, missing-observation, and nondeterminism divergences
- [ ] T011 Implement immutable bounded divergence evidence, deterministic ownership routing, reproduction, and complete-rerun closure
- [ ] T012 Implement idempotent mode-scoped certificate issuance over the complete zero-divergence case manifest
- [ ] T013 Implement certificate freshness verification for phase-010 mode gates and phase 011 without exposing an authority mutation
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Verify every required parity case starts from identical sealed inputs and remains isolated from live and tracked state
- [ ] T015 Verify positive cases match effective-event and canonical-projection fingerprint components plus every declared legacy-shaped byte and reader result
- [ ] T016 Inject every divergence class and verify precise evidence, stable ownership, no source mutation, and certificate refusal
- [ ] T017 Repeat sealed cases under supported processes/platforms and verify deterministic transcripts, digests, bytes, and classifications
- [ ] T018 Mutate each certificate-bound identity independently and verify phase 011 rejects the stale or wrong-mode certificate
- [ ] T019 Verify partial, skipped, failed, duplicate-conflict, or open-divergence case sets cannot emit a certificate
- [ ] T020 Verify the complete green mode set emits one immutable certificate and changes no legacy authority, writer, reader, file, or effect
- [ ] T021 Run strict spec validation and the implementation gate; record commands, exit codes, discovery counts, BASE, and candidate identity
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Every mode's closed parity set is green with zero open divergences
- [ ] Phase 011 rejects missing or stale parity certificates
- [ ] Phase gate green without tracked, live-state, or authority mutation
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Baseline**: See `../../000-baseline-taxonomy-and-state-census/spec.md`
- **Replay fingerprints**: See `../../003-transition-authorized-ledger-core/003-replay-fingerprints/spec.md`
- **Sealed inputs**: See `../../004-shared-evidence-and-control-services/002-sealed-reference-artifacts/spec.md`
- **Legacy projections**: See `../002-legacy-projections/spec.md`
- **Program ordering**: See `../../manifest/phase-tree.json`
<!-- /ANCHOR:cross-refs -->
