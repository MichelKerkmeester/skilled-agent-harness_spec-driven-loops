---
title: "Tasks: Deep Review resume adapter"
description: "Tasks for planning and later implementing the Deep Review resume adapter over the sealed event ledger, shared reducers, continuity ladder, and idempotent re-entry contract."
trigger_phrases:
  - "deep review resume adapter tasks"
  - "sealed ledger recovery tasks"
  - "deep-review replay idempotency tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/005-resume-adapter"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Completed the certificate-bound resume adapter"
    next_safe_action: "Shadow parity can consume the closed resume evidence"
    blockers: []
    key_files: []
    completion_pct: 100
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

- [x] T001 Confirm the phase-012 shared review-loop contract is frozen and record its sealed-frontier, reducer, replay-fingerprint, and terminal-state interfaces [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
- [x] T002 Confirm phase 015 mode contracts and the executable write-set conflict graph are available for the Deep Review lineage [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
- [x] T003 Inventory interruption boundaries and classify each boundary as committed, uncommitted, unknown-effect, or projection-pending [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
- [x] T004 Define the continuity-ladder state table and the invariants for scope, dimension cells, candidates, proofs, convergence, and report materialization [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P] Bind recovery to the sealed ledger frontier and reject invalid sequence, hash, schema, reducer, or replay-fingerprint inputs [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
- [x] T006 Implement the shared reducer fold and Deep Review continuity projection without adding a mode-local loop backbone [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
- [x] T007 Implement reducer-owned finding matching with versioned partial fingerprints and introduced/fixed/preexisting lineage [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
- [x] T008 Implement logical pass, finding, proof, and report identities with separate attempt IDs [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
- [x] T009 Implement reuse, reexecute, compensate, reconcile, and reject planning for incomplete work and external effects [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
- [x] T010 Persist an idempotent resume decision keyed by lineage, frontier, manifest revision, and replay fingerprint [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
- [x] T011 Preserve branch-local successes and late events while preventing duplicate application or silent event loss [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
- [x] T012 Materialize or reuse the report projection only from the folded sealed state and expose the next safe action to the shared runner [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Verify deterministic fold parity from an empty reducer and from every interruption frontier [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
- [x] T014 Verify crash recovery after append, candidate admission, proof receipt, convergence evaluation, and report projection [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
- [x] T015 Verify duplicate and concurrent resume requests produce one logical decision and one report projection per input frontier [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
- [x] T016 Verify missing, reordered, duplicated, conflicting, and unsealed events fail closed before new work is scheduled [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
- [x] T017 Verify compatible, migrated, pinned, incompatible, and changed-manifest fingerprints select the correct re-entry decision [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
- [x] T018 Verify unknown external effects require reconciliation or compensation and are never automatically replayed as safe [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
- [x] T019 Verify raw finding and proof events remain immutable and derived P0/P1/P2 presentation survives replay [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
- [x] T020 Verify the adapter consumes phase-012 transitions and respects phase-015 write ownership for same-lineage and independent-lineage resumes [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
- [x] T021 Verify readiness for the later shadow-parity and mode-gate checks without authority cutover or legacy-writer changes [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
- [x] All requirements in spec.md met with evidence [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
- [x] Phase gate green (validate/build/test as applicable) [evidence: implementation-summary.md verification records focused Vitest 6/6 and whole-runtime TypeScript exit 0]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Shared loop authority**: Phase 012 `009-fanout-fanin-durable-orchestration`
- **Mode contract authority**: Phase 015 `012-shared-mode-contracts-and-fixtures`
- **Sibling navigation**: predecessor `004-certificates-and-receipts`; successor `006-shadow-parity`
<!-- /ANCHOR:cross-refs -->
