---
title: "Tasks: Provenance-Balanced Reduction"
description: "Tasks for implementing and verifying deterministic provenance-balanced fan-in reduction over surviving heterogeneous leaf results."
trigger_phrases:
  - "provenance-balanced reduction tasks"
  - "source-balanced fan-in tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/006-fanout-fanin-durable-orchestration/006-provenance-balanced-reduction"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/006-fanout-fanin-durable-orchestration/006-provenance-balanced-reduction"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined implementation and verification tasks for provenance-balanced fan-in"
    next_safe_action: "Implement typed provenance envelopes and the weighted fair reducer"
    blockers: []
    key_files: []
    completion_pct: 0
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

- [ ] T001 Pin the approved BASE, reducer/normalizer/balance policy versions, canonical fixture corpus, and additive-dark authority boundary
- [ ] T002 Confirm the typed ledger, result-envelope, logical-branch, fan-in readiness, partial-failure, and blinded-adjudication integration fields without adding a hard sibling planning dependency
- [ ] T003 Record the run-2 fanout prototype, blinded-adjudication phase, and phase-tree manifest as immutable design inputs
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement provenance-complete item validation for envelope digest, executor/model/model-family, invocation fingerprint, logical lineage, leaf rank, evidence locators, and failure disposition
- [ ] T005 Implement the versioned type-specific canonicalizer registry and canonical serializer with fail-closed empty-key and unsupported-type behavior
- [ ] T006 Implement exact-key dedup that retains every contributor and emits typed conflict sets for incompatible payloads
- [ ] T007 Implement versioned source/model-family bucket assignment, cloned-source collapse, per-source support caps, and rational hierarchical weighted-fair scheduling
- [ ] T008 Implement deterministic tie-breaks over normalized bucket ID, logical branch ID, leaf rank, and item digest without consulting arrival or worker order
- [ ] T009 Implement the blinded contested-merge adapter and accept only stable verdicts bound to the pinned policy and replay fingerprint
- [ ] T010 Emit typed validation, grouping, contributor, conflict, adjudication, scheduling, disposition, partial-survivor, and reduction-receipt events
- [ ] T011 Integrate a reversible additive-dark shadow path that compares with legacy fan-in without changing authority
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Verify provenance schema acceptance and fail-closed rejection for missing, malformed, mismatched, and unsupported inputs
- [ ] T013 Verify canonicalization vectors and exact dedup preserve all contributor payload digests, ranks, lineages, and evidence locators
- [ ] T014 Verify conflicting duplicates and uncertain equivalence remain explicit unless a stable blinded merge verdict exists
- [ ] T015 Verify unequal-volume, duplicate-flood, retry, same-model multi-branch, and cloned-source fleets cannot steal another source bucket's share or inflate effective support
- [ ] T016 Verify completion, enumeration, worker, resume, and salvage permutations produce byte-identical output and receipt digests
- [ ] T017 Verify every selected, merged, conflicted, deferred, invalid, and excluded input has exactly one provenance-linked disposition
- [ ] T018 Verify partial-survivor receipts expose every expected/admitted/failed/timed-out/cancelled/invalid/excluded source and cannot imply full-fleet consensus
- [ ] T019 Verify identity canaries, self-source candidates, missing probes, and unstable/inconclusive adjudication fail closed
- [ ] T020 Verify ledger replay reconstructs the reduction without wall-clock order and the shadow path leaves legacy authority unchanged
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
