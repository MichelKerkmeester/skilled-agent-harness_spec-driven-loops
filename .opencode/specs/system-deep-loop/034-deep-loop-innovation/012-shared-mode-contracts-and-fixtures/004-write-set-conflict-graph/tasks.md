---
title: "Tasks: Write-Set Conflict Graph"
description: "Tasks for phase 007 of the phase-012 shared mode contracts and fixtures parent: author the executable dependency, write-set conflict, and phase-013 scheduling contract."
trigger_phrases:
  - "write-set conflict graph tasks"
  - "phase-013 scheduling tasks"
  - "deep-loop write ownership tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined graph authoring and verification tasks for the eight mode nodes"
    next_safe_action: "Freeze the node manifest and canonical resource inventory"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Write-Set Conflict Graph

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

- [ ] T001 Pin the parent spec, sequencing strategy, and phase-tree manifest as the graph source set and record their content digests
- [ ] T002 Confirm the exact phase-013 node list: `001-deep-research`, `002-deep-review`, `003-deep-ai-council`, `004-deep-improvement-common`, `005-agent-improvement`, `006-model-benchmark`, `007-skill-benchmark`, and `008-deep-alignment`
- [ ] T003 Collect the reviewed resource declarations for every mode's files, persisted state, shared packets, backends, locks, fixtures, and generated outputs
- [ ] T004 Confirm `depends_on: []` for this child and retain `003-mixed-version-fixtures` as navigation-only predecessor text
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Define the versioned graph envelope, node/resource records, edge types, independence assertions, policy, and schedule receipt fields
- [ ] T006 Normalize path, symlink, backend, state-store, lock, and generated-output aliases into canonical resource IDs with evidence
- [ ] T007 Derive deterministic write-write, write-read, shared-backend, fence, and hard-order edges from the canonical access sets
- [ ] T008 Encode `004-deep-improvement-common` as a hard predecessor of `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark`
- [ ] T009 Encode the shared review-loop fence for `002-deep-review` and `008-deep-alignment`, and the independently validated research/council assertion
- [ ] T010 Define fail-closed handling for unknown resources, stale digests, missing declarations, contradictory ownership, aliases, and dependency cycles
- [ ] T011 Define the orchestrator adapter contract for graph preflight, ready-node selection, fence handling, stable tie breaking, refusal evidence, and graph refresh
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Verify: The graph covers every phase-013 workstream exactly — Node IDs equal `mode_workstreams_phase_010` with no missing, duplicate, renamed, or extra entries
- [ ] T013 Verify: Every node has canonical reads and writes — Resource records include access, scope, mutability, owner, and source evidence
- [ ] T014 Verify: Conflict edges are derived from access sets — Write-write, write-read, shared-backend, and fence fixtures name the overlapping resources
- [ ] T015 Verify: Required ordering is executable — Common precedes all three variants and review/alignment never overlap on a shared review-loop resource
- [ ] T016 Verify: Independent work remains explicit — Research and council pass the disjoint-resource assertion and fail it when a shared mutable resource is introduced
- [ ] T017 Verify: Unknown or stale evidence fails closed — The scheduler returns serial-single-writer or block and never widens parallelism
- [ ] T018 Verify: The schedule is deterministic — Repeated derivation returns the same graph digest, edge ordering, lane order, and decision evidence
- [ ] T019 Verify: Drift is detected before orchestration — A changed child resource declaration rejects the old graph until its source digest is refreshed
- [ ] T020 Verify: The orchestrator consumes evidence — Every lane and refusal receipt includes node, predecessor, resource, source digest, class, and reason fields
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
