---
title: "Tasks: Provenance-Balanced Reduction"
description: "Tasks for implementing and verifying deterministic provenance-balanced fan-in reduction over surviving heterogeneous leaf results."
trigger_phrases:
  - "provenance-balanced reduction tasks"
  - "source-balanced fan-in tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/006-provenance-balanced-reduction"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/006-provenance-balanced-reduction"
    last_updated_at: "2026-07-21T08:45:00Z"
    last_updated_by: "codex"
    recent_action: "Completed implementation and adversarial verification of provenance-balanced fan-in"
    next_safe_action: "Retain additive-dark authority posture until activation is approved"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/provenance-reduction/"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/provenance-reduction.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Provenance-Balanced Reduction

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

- [x] T001 Pin the approved BASE, reducer/normalizer/balance policy versions, canonical fixture corpus, and additive-dark authority boundary [Evidence: `runtime/lib/provenance-reduction/types.ts`]
- [x] T002 Confirm the typed ledger, result-envelope, logical-branch, fan-in readiness, partial-failure, and blinded-adjudication integration fields without adding a hard sibling planning dependency [Evidence: `runtime/lib/provenance-reduction/reducer.ts`]
- [x] T003 Record the run-2 fanout prototype, blinded-adjudication phase, and phase-tree manifest as immutable design inputs [Evidence: `spec.md`]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement provenance-complete item validation for envelope digest, executor/model/model-family, invocation fingerprint, logical lineage, leaf rank, evidence locators, and failure disposition [Evidence: `runtime/lib/provenance-reduction/reducer.ts`]
- [x] T005 Implement the versioned type-specific canonicalizer registry and canonical serializer with fail-closed empty-key and unsupported-type behavior [Evidence: `runtime/lib/provenance-reduction/identity.ts`]
- [x] T006 Implement exact-key dedup that retains every contributor and emits typed conflict sets for incompatible payloads [Evidence: `runtime/lib/provenance-reduction/reducer.ts`]
- [x] T007 Implement versioned source/model-family bucket assignment, cloned-source collapse, per-source support caps, and rational hierarchical weighted-fair scheduling [Evidence: `runtime/lib/provenance-reduction/reducer.ts`]
- [x] T008 Implement deterministic tie-breaks over normalized bucket ID, logical branch ID, leaf rank, and item digest without consulting arrival or worker order [Evidence: `runtime/lib/provenance-reduction/reducer.ts`]
- [x] T009 Implement the blinded contested-merge adapter and accept only stable verdicts bound to the pinned policy and replay fingerprint [Evidence: `runtime/lib/provenance-reduction/reducer.ts`]
- [x] T010 Emit typed validation, grouping, contributor, conflict, adjudication, scheduling, disposition, partial-survivor, and reduction-receipt events [Evidence: `runtime/lib/provenance-reduction/reducer.ts` and `replay.ts`]
- [x] T011 Integrate a reversible additive-dark shadow path that compares with legacy fan-in without changing authority [Evidence: `runtime/lib/provenance-reduction/reducer.ts`]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Verify provenance schema acceptance and fail-closed rejection for missing, malformed, mismatched, and unsupported inputs [Test: provenance-reduction.vitest.ts malformed and forged-input cases]
- [x] T013 Verify canonicalization vectors and exact dedup preserve all contributor payload digests, ranks, lineages, and evidence locators [Test: provenance-reduction.vitest.ts canonical identity and duplicate-flood cases]
- [x] T014 Verify conflicting duplicates and uncertain equivalence remain explicit unless a stable blinded merge verdict exists [Test: provenance-reduction.vitest.ts conflict and adjudication cases]
- [x] T015 Verify unequal-volume, duplicate-flood, retry, same-model multi-branch, and cloned-source fleets cannot steal another source bucket's share or inflate effective support [Test: provenance-reduction.vitest.ts weighted fairness and clone cases]
- [x] T016 Verify completion, enumeration, worker, resume, and salvage permutations produce byte-identical output and receipt digests [Test: provenance-reduction.vitest.ts permutation case]
- [x] T017 Verify every selected, merged, conflicted, deferred, invalid, and excluded input has exactly one provenance-linked disposition [Test: provenance-reduction.vitest.ts disposition cases]
- [x] T018 Verify partial-survivor receipts expose every expected/admitted/failed/timed-out/cancelled/invalid/excluded source and cannot imply full-fleet consensus [Test: provenance-reduction.vitest.ts degraded-survivor case]
- [x] T019 Verify identity canaries, self-source protection, missing probes, and unstable/inconclusive adjudication fail closed [Evidence: `provenance-reduction.vitest.ts` plus the consumed blinded-adjudication verdict contract]
- [x] T020 Verify ledger replay reconstructs the reduction without wall-clock order and the shadow path leaves legacy authority unchanged [Test: provenance-reduction.vitest.ts replay and parity cases]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All requirements in spec.md met with evidence
- [x] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
