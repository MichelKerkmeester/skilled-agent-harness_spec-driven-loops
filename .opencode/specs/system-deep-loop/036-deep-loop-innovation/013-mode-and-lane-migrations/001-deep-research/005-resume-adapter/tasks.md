---
title: "Tasks: Deep Research - Resume Adapter"
description: "Tasks for the Deep Research resume-adapter phase: reconstruct state from the sealed ledger, map continuity, and make re-entry idempotent."
trigger_phrases:
  - "deep research resume adapter tasks"
  - "deep-research idempotent resume tasks"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/005-resume-adapter"
    last_updated_at: "2026-07-22T09:15:00Z"
    last_updated_by: "codex"
    recent_action: "Completed implementation and adversarial verification tasks"
    next_safe_action: "Use the exported contract for resume-decision shadow parity"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-resume-adapter/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-resume-adapter.vitest.ts"
    completion_pct: 100
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

- [x] T001 Confirm phase-012 shared resume/replay contracts and the Deep Research sibling boundaries against the phase adjacency -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] T002 Inventory current Deep Research resume entry points, continuity files, JSONL readers, reducer checkpoints, and mutable inputs demoted from authority -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] T003 Define the canonical resume request identity, sealed ledger-tail input, reducer checkpoint, projection fingerprint, manifest revision, and root lease contract -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] T004 [P] Build the continuity-ladder matrix for `init`, plan/frontier, gather, analyze, convergence, synthesis, memory-save, incomplete, and failed states -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Specify ledger-only state reconstruction and validation of sealed tail, hash chain, cursor, seen-event set, finalized frontier, and projection fingerprint -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] T006 Define immutable compatibility decisions for exact, compatible, migrate, pin-old-runtime, fork, reject, blocked, and rebuild-required outcomes -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] T007 Define the per-logical-branch resume algebra for `reuse`, `reexecute`, `compensate`, and `reject`, keyed by manifest revision plus logical branch ID -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] T008 Define effect recovery folding for prepared, dispatched, result, unknown, reconciled, and compensated receipts with capability-driven retry policy -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] T009 Define root `RunLease`, lineage, generation, and replay-fingerprint propagation across recovery, salvage, synthesis, and memory-save re-entry -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] T010 Define source and claim dependency invalidation for changed digests, retractions, contradictions, and superseding evidence without rewriting history -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] T011 Define idempotent resume-decision append ordering, duplicate-request suppression, stable handoff identity, and memory-save reconciliation behavior -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] T012 Define dark-path failure handling and the explicit boundary that leaves legacy state, writers, and authority unchanged -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Verify: Ledger-only replay reconstructs the same run, frontier, branch, evidence, claim, convergence, synthesis, and handoff state from identical sealed history -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] T014 Verify: The continuity-ladder matrix maps every lifecycle boundary to one reducer-owned state and deterministic re-entry action -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] T015 Verify: Compatibility fixtures persist the selected outcome and block unknown or incompatible fingerprints without stale reuse -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] T016 Verify: Completed, pending, invalidated, and changed-manifest branches receive the correct decision and only `reexecute` branches enter the pool -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] T017 Verify: Unknown and irreversible effects never auto-retry; declared reconciliation or compensation retains stable effect identity and changing attempt history -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] T018 Verify: Duplicate resume requests and crash-window retries produce no duplicate semantic transition, branch dispatch, claim revision, synthesis commit, or memory-save completion -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] T019 Verify: Lease, lineage, generation, and logical identities survive restart while attempt IDs remain distinct and no fresh root lease is allocated -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] T020 Verify: Source mutation reopens only dependent claims and synthesis inputs while preserving unaffected evidence and prior revisions -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] T021 Verify: Original-manifest replay and changed-manifest execution take distinct compatibility paths with no label-only retry credit inheritance -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] T022 Verify: Blocked or quarantined dark resume leaves legacy state and authority unchanged and emits an auditable typed failure -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
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
