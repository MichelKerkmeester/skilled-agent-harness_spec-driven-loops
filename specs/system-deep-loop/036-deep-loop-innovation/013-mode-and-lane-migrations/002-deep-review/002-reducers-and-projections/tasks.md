---
title: "Tasks: Deep Review - Reducers & Projections"
description: "Tasks for the Deep Review reducers and projections phase: map typed ledger events to deterministic iteration, artifact, status, and finding projections with shared review-loop parity."
trigger_phrases:
  - "Deep Review reducers and projections tasks"
  - "deep-review projection reducer tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/002-reducers-and-projections"
    last_updated_at: "2026-07-23T15:38:37Z"
    last_updated_by: "codex"
    recent_action: "Verified completed lifecycle freshness across verdicts"
    next_safe_action: "Consume the reducer surface from later siblings"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Review - Reducers & Projections

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

- [x] T001 Confirm the typed event schema, phase-012 shared review-loop contract, 013 write-set graph, Deep Alignment reuse boundary, and legacy Deep Review fixtures are available as read-only inputs. [Evidence: the reducer imports the landed `DEEP_REVIEW_EVENT_SCHEMA_REGISTRY` after the predecessor and golden surfaces were read.]
- [x] T002 Confirm the phase boundary excludes event-schema authoring, sealed-artifact creation, reviewer execution, authority cutover, and the six sibling concerns. [Evidence: `git status --short -- <scoped paths>` is limited to the reducer module, unit test, and this leaf's documentation.]
- [x] T003 [P] Record source-of-truth fields, derived fields, compatibility metadata, projection-health fields, and stable identity inputs. [Evidence: `DEEP_REVIEW_PROJECTION_FIELD_OWNERSHIP` covers the closed projection interfaces.]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Define the typed event-to-projection matrix with valid transitions, idempotent duplicate policy, late-event policy, sequence checks, and fail-closed errors. [Evidence: `DEEP_REVIEW_EVENT_ROUTING` and `foldDeepReviewEvents` implement the exhaustive routing and replay policy.]
- [x] T005 Define the pure immutable fold state, canonical serialization, projection-version contract, and deterministic projection fingerprint. [Evidence: `createDeepReviewProjectionState`, the canonical digest, immutable clone, and checkpoint digest are exported and tested.]
- [x] T006 Define the iteration/convergence reducer for scope, changed surfaces, review dimensions, coverage cells, pass outcomes, finding lifecycle, obligations, and terminal decisions. [Evidence: `DeepReviewIterationConvergenceProjection` is populated by the shared backbone and mode event fold.]
- [x] T007 Define the artifact-index reducer for raw findings, challenge attempts, proof receipts, reports, suppression records, verification outputs, digests, availability, and supersession lineage. [Evidence: `DeepReviewArtifactRecord` retains producer, input, digest, availability, and lineage fields.]
- [x] T008 Define the per-mode status reducer for lifecycle, contract versions, replay position, projection health, blocking reasons, shadow parity, and terminal status. [Evidence: `DeepReviewStatusProjection` is derived from typed transitions and projection health by the real reducer.]
- [x] T009 Define the derived P0/P1/P2 presentation projection while retaining impact, confidence, reachability, exploitability, evidence kind, evidence strength, evidence scope, and lifecycle independently. [Evidence: finding records retain each factor separately and derive only `presentationSeverity`.]
- [x] T010 [P] Define the shared review-loop adapter for Deep Review and Deep Alignment; keep mode-specific mapping at the boundary and do not fork the backbone. [Evidence: `reduceSharedReviewLoopBackbone` is mode-neutral and the Deep Review mapping stays in its adapter.]
- [x] T011 Define replay failure behavior for unknown versions, sequence gaps, invalid fingerprints, impossible transitions, duplicate terminals, missing artifacts, and projection drift. [Evidence: explicit reducer errors and rebuild reasons cover each invalid replay class.]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Verify repeated replay of one ordered typed event sequence produces identical semantic projections, canonical serialization, fingerprints, and terminal status. [Evidence: the determinism test calls `foldDeepReviewEvents` twice and compares projections plus integrity fingerprints.]
- [x] T013 Verify empty, partial, completed, duplicate, late-evidence, supersession, and mixed-artifact sequences preserve deterministic state and append-only evidence. [Evidence: `createDeepReviewProjectionState`, exact-duplicate idempotence, full replay, artifact lineage, and terminal invariants are exercised through the real fold.]
- [x] T014 Verify coverage-aware convergence blocks unresolved required dimensions, open hard vetoes, missing proof obligations, and contested evidence. [Evidence: convergence and completed lifecycle terminals share the same current-state derivation before `reduceSharedReviewLoopBackbone`; late accepted P1 findings and required obligations reject all four completed verdicts, the hard-veto `fail` control rejects, and incomplete/blocked lifecycle controls retain open state.]
- [x] T015 Verify artifact references retain stable logical identity, producer linkage, reviewed revision identity, content digest, availability, and lineage. [Evidence: `DeepReviewArtifactRecord` and the complete parity snapshot include every required field.]
- [x] T016 Verify per-mode status accepts only valid typed transitions and reports blocked/error states for invalid transitions and projection mismatch. [Evidence: impossible-transition and projection-version mismatch tests call `foldDeepReviewEvents` and reject.]
- [x] T017 Verify P0/P1/P2 is derived presentation state and cannot rescue deterministic hard failures or inflate evidence independence through repeated agreement. [Evidence: the adversarial weighted-signal fixture folded by `foldDeepReviewEvents` remains blocked by a hard security veto.]
- [x] T018 Verify the Deep Review backbone is structurally reusable by Deep Alignment with configuration differences only. [Evidence: `reduceSharedReviewLoopBackbone` and its configuration types contain no Deep Review event dependency; end-to-end cross-mode verification remains owned by the future Deep Alignment reducer.]
- [x] T019 Verify shadow parity against frozen legacy Deep Review fixtures and record field-level discrepancies without changing authority. [Evidence: `projectDeepReviewLegacyView` produces the complete frozen parity structure without changing the legacy path.]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete. [Evidence: T001-T019 are checked with implementation or test receipts.]
- [x] All requirements in spec.md met with evidence. [Evidence: checklist items CHK-001 through CHK-026 and the implementation summary map the completed behavior.]
- [x] Phase gate green for this leaf (validate/replay/shadow-parity as applicable). [Evidence: targeted Vitest passes 86 tests, whole-runtime `tsc -p runtime/tsconfig.json --noEmit` exits 0 with zero `runtime/lib/deep-review-reducers/` diagnostics, and the metadata-refreshed strict validator reports Errors: 0, Warnings: 0.]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
