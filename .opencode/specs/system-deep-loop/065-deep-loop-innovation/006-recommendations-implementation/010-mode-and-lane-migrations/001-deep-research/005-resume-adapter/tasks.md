---
title: "Tasks: Deep Research - Resume Adapter"
description: "Tasks for the Deep Research resume-adapter phase: reconstruct state from the sealed ledger, map continuity, and make re-entry idempotent."
trigger_phrases:
  - "deep research resume adapter tasks"
  - "deep-research idempotent resume tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/010-mode-and-lane-migrations/001-deep-research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/010-mode-and-lane-migrations/001-deep-research/005-resume-adapter"
    last_updated_at: "2026-07-15T19:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Translated resume requirements into reconstruction and re-entry tasks"
    next_safe_action: "Specify crash-window and duplicate-delivery fixtures for the resume planner"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Research - Resume Adapter

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

- [ ] T001 Confirm phase-009 shared resume/replay contracts and the Deep Research sibling boundaries against the phase adjacency
- [ ] T002 Inventory current Deep Research resume entry points, continuity files, JSONL readers, reducer checkpoints, and mutable inputs demoted from authority
- [ ] T003 Define the canonical resume request identity, sealed ledger-tail input, reducer checkpoint, projection fingerprint, manifest revision, and root lease contract
- [ ] T004 [P] Build the continuity-ladder matrix for `init`, plan/frontier, gather, analyze, convergence, synthesis, memory-save, incomplete, and failed states
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Specify ledger-only state reconstruction and validation of sealed tail, hash chain, cursor, seen-event set, finalized frontier, and projection fingerprint
- [ ] T006 Define immutable compatibility decisions for exact, compatible, migrate, pin-old-runtime, fork, reject, blocked, and rebuild-required outcomes
- [ ] T007 Define the per-logical-branch resume algebra for `reuse`, `reexecute`, `compensate`, and `reject`, keyed by manifest revision plus logical branch ID
- [ ] T008 Define effect recovery folding for prepared, dispatched, result, unknown, reconciled, and compensated receipts with capability-driven retry policy
- [ ] T009 Define root `RunLease`, lineage, generation, and replay-fingerprint propagation across recovery, salvage, synthesis, and memory-save re-entry
- [ ] T010 Define source and claim dependency invalidation for changed digests, retractions, contradictions, and superseding evidence without rewriting history
- [ ] T011 Define idempotent resume-decision append ordering, duplicate-request suppression, stable handoff identity, and memory-save reconciliation behavior
- [ ] T012 Define dark-path failure handling and the explicit boundary that leaves legacy state, writers, and authority unchanged
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Verify: Ledger-only replay reconstructs the same run, frontier, branch, evidence, claim, convergence, synthesis, and handoff state from identical sealed history
- [ ] T014 Verify: The continuity-ladder matrix maps every lifecycle boundary to one reducer-owned state and deterministic re-entry action
- [ ] T015 Verify: Compatibility fixtures persist the selected outcome and block unknown or incompatible fingerprints without stale reuse
- [ ] T016 Verify: Completed, pending, invalidated, and changed-manifest branches receive the correct decision and only `reexecute` branches enter the pool
- [ ] T017 Verify: Unknown and irreversible effects never auto-retry; declared reconciliation or compensation retains stable effect identity and changing attempt history
- [ ] T018 Verify: Duplicate resume requests and crash-window retries produce no duplicate semantic transition, branch dispatch, claim revision, synthesis commit, or memory-save completion
- [ ] T019 Verify: Lease, lineage, generation, and logical identities survive restart while attempt IDs remain distinct and no fresh root lease is allocated
- [ ] T020 Verify: Source mutation reopens only dependent claims and synthesis inputs while preserving unaffected evidence and prior revisions
- [ ] T021 Verify: Original-manifest replay and changed-manifest execution take distinct compatibility paths with no label-only retry credit inheritance
- [ ] T022 Verify: Blocked or quarantined dark resume leaves legacy state and authority unchanged and emits an auditable typed failure
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
