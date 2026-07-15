---
title: "Tasks: Deep Review resume adapter (013 phase 002/005)"
description: "Tasks for planning and later implementing the Deep Review resume adapter over the sealed event ledger, shared reducers, continuity ladder, and idempotent re-entry contract."
trigger_phrases:
  - "deep review resume adapter tasks"
  - "sealed ledger recovery tasks"
  - "deep-review replay idempotency tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/005-resume-adapter"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Turned resume invariants into a sealed-frontier task sequence"
    next_safe_action: "Confirm shared event and reducer contracts before adapter implementation"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Review Resume Adapter

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

- [ ] T001 Confirm the phase-009 shared review-loop contract is frozen and record its sealed-frontier, reducer, replay-fingerprint, and terminal-state interfaces
- [ ] T002 Confirm phase 012 mode contracts and the executable write-set conflict graph are available for the Deep Review lineage
- [ ] T003 Inventory interruption boundaries and classify each boundary as committed, uncommitted, unknown-effect, or projection-pending
- [ ] T004 Define the continuity-ladder state table and the invariants for scope, dimension cells, candidates, proofs, convergence, and report materialization
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 [P] Bind recovery to the sealed ledger frontier and reject invalid sequence, hash, schema, reducer, or replay-fingerprint inputs
- [ ] T006 Implement the shared reducer fold and Deep Review continuity projection without adding a mode-local loop backbone
- [ ] T007 Implement reducer-owned finding matching with versioned partial fingerprints and introduced/fixed/preexisting lineage
- [ ] T008 Implement logical pass, finding, proof, and report identities with separate attempt IDs
- [ ] T009 Implement reuse, reexecute, compensate, reconcile, and reject planning for incomplete work and external effects
- [ ] T010 Persist an idempotent resume decision keyed by lineage, frontier, manifest revision, and replay fingerprint
- [ ] T011 Preserve branch-local successes and late events while preventing duplicate application or silent event loss
- [ ] T012 Materialize or reuse the report projection only from the folded sealed state and expose the next safe action to the shared runner
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Verify deterministic fold parity from an empty reducer and from every interruption frontier
- [ ] T014 Verify crash recovery after append, candidate admission, proof receipt, convergence evaluation, and report projection
- [ ] T015 Verify duplicate and concurrent resume requests produce one logical decision and one report projection per input frontier
- [ ] T016 Verify missing, reordered, duplicated, conflicting, and unsealed events fail closed before new work is scheduled
- [ ] T017 Verify compatible, migrated, pinned, incompatible, and changed-manifest fingerprints select the correct re-entry decision
- [ ] T018 Verify unknown external effects require reconciliation or compensation and are never automatically replayed as safe
- [ ] T019 Verify raw finding and proof events remain immutable and derived P0/P1/P2 presentation survives replay
- [ ] T020 Verify the adapter consumes phase-009 transitions and respects phase-012 write ownership for same-lineage and independent-lineage resumes
- [ ] T021 Verify readiness for the later shadow-parity and mode-gate checks without authority cutover or legacy-writer changes
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
- **Shared loop authority**: Phase 009 `009-fanout-fanin-durable-orchestration`
- **Mode contract authority**: Phase 012 `012-shared-mode-contracts-and-fixtures`
- **Sibling navigation**: predecessor `004-certificates-and-receipts`; successor `006-shadow-parity`
<!-- /ANCHOR:cross-refs -->
