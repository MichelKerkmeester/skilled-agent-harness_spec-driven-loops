---
title: "Tasks: Deep Review - Reducers & Projections"
description: "Tasks for the Deep Review reducers and projections phase: map typed ledger events to deterministic iteration, artifact, status, and finding projections with shared review-loop parity."
trigger_phrases:
  - "Deep Review reducers and projections tasks"
  - "deep-review projection reducer tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/002-reducers-and-projections"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Separated reducer design tasks from event-schema and sealed-artifact work"
    next_safe_action: "Complete the typed event-to-projection matrix"
    blockers: []
    key_files: []
    completion_pct: 0
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

- [ ] T001 Confirm the typed event schema, phase-012 shared review-loop contract, 013 write-set graph, Deep Alignment reuse boundary, and legacy Deep Review fixtures are available as read-only inputs
- [ ] T002 Confirm the phase boundary excludes event-schema authoring, sealed-artifact creation, reviewer execution, authority cutover, and the six sibling concerns
- [ ] T003 [P] Record source-of-truth fields, derived fields, compatibility metadata, projection-health fields, and stable identity inputs
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Define the typed event-to-projection matrix with valid transitions, idempotent duplicate policy, late-event policy, sequence checks, and fail-closed errors
- [ ] T005 Define the pure immutable fold state, canonical serialization, projection-version contract, and deterministic projection fingerprint
- [ ] T006 Define the iteration/convergence reducer for scope, changed surfaces, review dimensions, coverage cells, pass outcomes, finding lifecycle, obligations, and terminal decisions
- [ ] T007 Define the artifact-index reducer for raw findings, challenge attempts, proof receipts, reports, suppression records, verification outputs, digests, availability, and supersession lineage
- [ ] T008 Define the per-mode status reducer for lifecycle, contract versions, replay position, projection health, blocking reasons, shadow parity, and terminal status
- [ ] T009 Define the derived P0/P1/P2 presentation projection while retaining impact, confidence, reachability, exploitability, evidence kind, evidence strength, evidence scope, and lifecycle independently
- [ ] T010 [P] Define the shared review-loop adapter for Deep Review and Deep Alignment; keep mode-specific mapping at the boundary and do not fork the backbone
- [ ] T011 Define replay failure behavior for unknown versions, sequence gaps, invalid fingerprints, impossible transitions, duplicate terminals, missing artifacts, and projection drift
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Verify repeated replay of one ordered typed event sequence produces identical semantic projections, canonical serialization, fingerprints, and terminal status
- [ ] T013 Verify empty, partial, completed, duplicate, late-evidence, supersession, and mixed-artifact sequences preserve deterministic state and append-only evidence
- [ ] T014 Verify coverage-aware convergence blocks unresolved required dimensions, hard vetoes, missing proof obligations, and contested evidence
- [ ] T015 Verify artifact references retain stable logical identity, producer linkage, reviewed revision identity, content digest, availability, and lineage
- [ ] T016 Verify per-mode status accepts only valid typed transitions and reports blocked/error states for invalid transitions and projection mismatch
- [ ] T017 Verify P0/P1/P2 is derived presentation state and cannot rescue deterministic hard failures or inflate evidence independence through repeated agreement
- [ ] T018 Verify Deep Review and Deep Alignment satisfy the shared review-loop fixtures with configuration differences only
- [ ] T019 Verify shadow parity against frozen legacy Deep Review fixtures and record field-level discrepancies without changing authority
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/replay/shadow-parity as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
