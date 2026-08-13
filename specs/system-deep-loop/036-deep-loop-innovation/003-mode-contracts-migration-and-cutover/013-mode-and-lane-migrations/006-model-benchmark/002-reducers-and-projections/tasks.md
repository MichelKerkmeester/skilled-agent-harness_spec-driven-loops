---
title: "Tasks: Model Benchmark — Reducers & Projections"
description: "Tasks for the model-benchmark reducers and projections phase, covering the pure typed-event fold, deterministic matrix-cell state, iteration/convergence projection, raw-trial artifact index, uncertainty-aware scoring matrix, shared service consumption, and replay verification."
trigger_phrases:
  - "model benchmark reducers tasks"
  - "model benchmark projection tasks"
  - "scoring matrix reducer tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/002-reducers-and-projections"
    last_updated_at: "2026-07-23T12:15:00Z"
    last_updated_by: "codex"
    recent_action: "Completed reducer implementation and replay verification"
    next_safe_action: "Use the shadow projection in the next model leaf"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Model Benchmark — Reducers & Projections

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

- [x] T001 Confirm `001-typed-ledger-schema` publishes the model-benchmark envelope, matrix identity, ordering, version, and upcaster contract [Evidence: `implementation-summary.md`; targeted Vitest 26/26]
- [x] T002 Confirm deep-improvement-common mode 004 publishes the shared reducer and status contract to consume unchanged [Evidence: common-fold oracle test; targeted Vitest 26/26]
- [x] T003 Build the projection field matrix, stable matrix-cell key, event-to-reducer map, ownership boundary, and downstream consumer contract [Evidence: `implementation-summary.md`; targeted Vitest 26/26]
- [x] T004 Pin a typed history for run, matrix, raw observation, score, validity, selection, checkpoint, and veto paths [Evidence: targeted Vitest 26/26]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P] Define the pure fold shell with canonical event dispatch, duplicate handling, version refusal, deterministic serialization, and projection fingerprints [Evidence: `implementation-summary.md`; targeted Vitest 26/26]
- [x] T006 [P] Define stable full-matrix identity and canonical cell ordering [Evidence: determinism test; targeted Vitest 26/26]
- [x] T007 [P] Define explicit matrix-cell dispositions without inferring missing trials [Evidence: `implementation-summary.md`; targeted Vitest 26/26]
- [x] T008 [P] Define run, cell progress, unresolved evidence, coverage, and per-stream resume frontiers [Evidence: per-stream ordering test; targeted Vitest 26/26]
- [x] T009 [P] Define the content-addressed raw-result, observation, usage, validity, and score artifact index [Evidence: `implementation-summary.md`; targeted Vitest 26/26]
- [x] T010 Define scoring projections that keep raw observations, score vectors, validity, sealed evidence, uncertainty, and rankings separate [Evidence: raw-versus-ranking test; targeted Vitest 26/26]
- [x] T011 Delegate common events through the unchanged common reducer surface and fold branch [Evidence: common-fold oracle test; targeted Vitest 26/26]
- [x] T012 Define checkpoint integrity, per-stream ordering, rebuild reasons, and version fingerprints [Evidence: checkpoint tests; targeted Vitest 26/26]
- [x] T013 Add a complete shadow-only legacy projection and keep all effects outside the fold [Evidence: `implementation-summary.md`; targeted Vitest 26/26]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Verify complete and checkpointed replay produce byte-identical projections [Evidence: checkpoint-equivalence test; targeted Vitest 26/26]
- [x] T015 Verify deterministic canonical-key ordering and equivalent batch boundaries [Evidence: determinism test; targeted Vitest 26/26]
- [x] T016 Verify gaps, out-of-order input, phantom sources, forged tails, and unknown extensions fail closed [Evidence: targeted Vitest 26/26]
- [x] T017 Verify raw observations and score lineage survive typed ranking reduction [Evidence: raw-versus-ranking test; targeted Vitest 26/26]
- [x] T018 Verify hard-floor and common blockers cannot become eligible rankings [Evidence: hard-floor veto test; targeted Vitest 26/26]
- [x] T019 Verify shared-event output matches the deep-improvement-common fold oracle [Evidence: common-fold oracle test; targeted Vitest 26/26]
- [x] T020 Verify absent adaptive-selection extensions are never inferred and unknown extensions fail closed [Evidence: unknown-extension test; targeted Vitest 26/26]
- [x] T021 Run targeted Vitest, whole-runtime TypeScript, strict validation, metadata refresh, and exact-scope status [Evidence: `implementation-summary.md`; targeted Vitest 26/26]
- [x] T022 Fold judge, oracle, contamination, exposure, disclosure, retirement, and replacement events into addressable records [Evidence: seven focused projection tests; targeted Vitest 26/26]
- [x] T023 Fail closed when the registry and handled-stem inventory diverge [Evidence: completeness inventory and unknown-extension tests; targeted Vitest 26/26]
- [x] T024 Reject backward cell transitions while accepting legal checkpoint continuation [Evidence: cell transition tests; targeted Vitest 26/26]
- [x] T025 Block rankings for unknown hard floors and late contamination or lifecycle evidence [Evidence: eligibility and late-evidence tests; targeted Vitest 26/26]
- [x] T026 Project pairwise comparison results and cost/latency slices as separate records [Evidence: pairwise and operational-slice tests; targeted Vitest 26/26]
- [x] T027 Record the fail-closed and evidence-preservation decisions [Evidence: `decision-record.md`; strict validation]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [Evidence: T001-T027; targeted Vitest 26/26]
- [x] All requirements in spec.md met with evidence [Evidence: `implementation-summary.md`; targeted Vitest 26/26]
- [x] Phase gate green (targeted replay, failure injection, TypeScript, and strict validation) [Evidence: `implementation-summary.md`; targeted Vitest 26/26]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
