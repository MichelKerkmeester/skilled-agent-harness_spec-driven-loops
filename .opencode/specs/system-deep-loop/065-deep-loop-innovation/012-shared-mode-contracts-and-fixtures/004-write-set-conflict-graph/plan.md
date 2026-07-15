---
title: "Implementation Plan: Write-Set Conflict Graph"
description: "Implementation Plan for phase 004 of the phase-009 shared mode contracts and fixtures parent: derive, validate, and publish the phase-010 dependency and write-set conflict graph contract."
trigger_phrases:
  - "write-set conflict graph implementation plan"
  - "phase-010 dependency graph plan"
  - "deep-loop lane scheduling plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped the graph contract to manifest nodes and orchestration gates"
    next_safe_action: "Review canonical resource identities and conflict derivation rules"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Write-Set Conflict Graph

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop phase-009 / phase-010 orchestration contract |
| **Change class** | Planning artifact and executable scheduling contract |
| **Execution** | Isolated worktree pinned to the program BASE; graph derivation remains serial-single-writer until verified |

### Overview
Phase 010 cannot safely use unconditional eight-way parallelism. This plan turns the phase-009 write-set decision into
a versioned graph contract whose nodes are the eight manifest-defined mode migrations and whose edges identify resource
conflicts, hard ordering, and review-loop fences. The graph is derived from canonical read/write declarations and source
digests, validated against the phase tree and child contracts, and consumed by the orchestrator as a deterministic lane
plan. The default remains `serial-single-writer` until the graph is complete and verified.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The parent `spec.md`, `execution-sequencing-strategy.md`, and `manifest/phase-tree.json` are the pinned source set
- [ ] The graph node set exactly matches the eight entries in `mode_workstreams_phase_010`
- [ ] Every node has reviewed canonical read, write, shared-state, lock, fixture, and generated-output declarations
- [ ] Conflict derivation distinguishes write-write, write-read, shared-backend, fence, and hard-order relationships
- [ ] Unknown, stale, aliased, and contradictory resource evidence is conservative and fail closed
- [ ] The required common-before-variants, review/alignment fence, and research/council independence assertions are explicit

### Definition of Done
- [ ] A graph schema and deterministic derivation procedure are documented for phase-010 implementation
- [ ] The orchestrator contract consumes graph evidence and refuses stale or incomplete widened parallelism
- [ ] Verification cases prove node coverage, edge derivation, hard constraints, independence, determinism, and drift detection
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Graph envelope**: `schema_version`, `base_identity`, `generated_from`, `policy`, `nodes`, `edges`,
  `independent_assertions`, and `schedule` are persisted as one graph contract with a content digest.
- **Mode nodes**: one immutable node identity per manifest slug. Each node carries `read_set`, `write_set`,
  `shared_state`, `migration_dependencies`, `contract_refs`, and `source_refs`.
- **Resource identity**: normalize paths, symlinks, package roots, generated outputs, persisted state stores, backend
  handles, and locks into stable `canonical_id` records with kind, scope, mutability, access, and evidence.
- **Derived edges**: compute symmetric conflicts for write-write and write-read overlap; add shared-backend edges for
  mutable service ownership; add fence edges for review-loop overlap; add hard-order edges for required predecessors.
- **Required constraints**: `004-deep-improvement-common` is a hard predecessor of `005-agent-improvement`,
  `006-model-benchmark`, and `007-skill-benchmark`; `002-deep-review` and `008-deep-alignment` are fenced on shared
  review-loop resources; `001-deep-research` and `003-deep-ai-council` are independently asserted and still checked
  against future resource declarations.
- **Scheduling policy**: reject cycles; select only dependency-ready nodes with no active conflict resource; use stable
  slug order as the tie-breaker; use `serial-single-writer` when evidence is incomplete or stale.
- **Honesty boundary**: source digests, resource-manifest digests, derivation tool version, and edge evidence bind each
  schedule. Manual overrides are empty by default and require bounded evidence, owner, and expiry.
- **Orchestrator adapter**: load and validate the graph before lane creation, emit graph digest and decision evidence for
  every lane, wait for hard predecessors and fences, and refuse to infer missing relationships.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the phase-009 parent source set and phase-tree manifest are available; record their content digests and the
  exact eight phase-010 workstream slugs.
- Collect the phase-010 child contract/resource declarations and identify shared packet roots, state stores, backends,
  locks, fixtures, generated outputs, and review-loop handles.
- Confirm the child manifest's `depends_on: []` remains intact; treat the required predecessor slug only as navigation,
  not as an execution dependency.

### Phase 2: Implementation
- Define the versioned graph envelope, node schema, canonical resource schema, edge types, independence assertions,
  conservative policy, and schedule receipt fields.
- Normalize each node's read and write resources and derive deterministic write-write, write-read, shared-backend, fence,
  and hard-order edges with resource-level evidence.
- Encode the deep-improvement-common predecessor edges, the deep-review/deep-alignment review-loop fence, and the
  research/council independence assertion without inventing variant-to-variant ordering.
- Implement source-digest, coverage, alias, ownership, cycle, unknown-resource, and graph-drift checks; make unresolved
  evidence a conflict or a serial fallback rather than a parallel grant.
- Define the orchestrator load and scheduling protocol, including ready-node selection, fence acquisition, stable tie
  breaking, refusal reasons, graph refresh behavior, and graph-digest-bound lane receipts.

### Phase 3: Verification
- Verify exact node coverage and canonical read/write declarations against `manifest/phase-tree.json` and every reviewed
  phase-010 resource manifest.
- Verify derived edge examples for write-write, write-read, shared backend, hard-order, and review-loop fence cases.
- Verify that deep-improvement-common precedes all three variants, deep-review and alignment cannot overlap on the shared
  review loop, and research/council remain parallel-safe only under disjoint resource evidence.
- Run repeated derivation and scheduling with identical inputs; compare graph digest, edge order, lane order, and refusal
  evidence for determinism.
- Simulate stale, missing, ambiguous, aliased, contradictory, and changed write-set inputs; confirm serial fallback or
  blocking behavior and no widened parallelism.
- Exercise the phase-010 orchestrator adapter against the graph fixture and record every lane, fence, predecessor, and
  refusal decision for the phase handoff.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Compare graph node IDs with `mode_workstreams_phase_010`; fail on missing, duplicate, renamed, or extra nodes |
| REQ-002 | Validate every node's canonical read/write/shared-state records against reviewed phase-010 resource manifests |
| REQ-003 | Run path, symlink, generated-output, backend-alias, and state-store normalization fixtures; unresolved aliases become conflicts |
| REQ-004 | Derive conflict fixtures for write-write, write-read, shared-backend, and fence overlap and compare resource evidence |
| REQ-005 | Assert common-before-variants hard-order edges and review/alignment fence decisions in the schedule output |
| REQ-006 | Assert research/council disjointness and fail the independence assertion when a shared mutable resource is introduced |
| REQ-007 | Feed missing, stale, unknown, contradictory, cyclic, and incomplete graph inputs; confirm serial-single-writer or block |
| REQ-008 | Derive and schedule the same sealed input twice; compare graph digest, sorted edges, lane order, and decision evidence |
| REQ-009 | Inspect orchestrator receipts for node, predecessor, resource, source digest, class, and refusal reason fields |
| REQ-010 | Change a child resource declaration without refreshing the graph; confirm preflight rejects the old schedule |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The authoritative planning inputs are the phase-009 parent `spec.md`, `execution-sequencing-strategy.md`, and
`manifest/phase-tree.json`. The graph also consumes the eight phase-010 child contracts and the shared mode, compatibility,
fan-in, novelty, and convergence contracts established by the preceding program phases. The manifest declares this child
with `depends_on: []`; the adjacency line naming `003-mixed-version-fixtures` is navigation only and must not be turned
into a hard runtime dependency. Phase 010 consumes the graph as a preflight scheduling input, and phase 011 consumes its
mode-gate evidence without delegating authority-cutover decisions to this phase.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The authored change is limited to this phase's four planning documents. A scoped `git revert` restores the prior contract,
or the disposable worktree can be discarded before any graph artifact is adopted. No production file, persisted state,
ledger authority, or mode migration is changed by this Planned phase. If a later graph implementation produces an unsafe
schedule, the orchestrator must retain the previous serial-single-writer policy and reject the new graph until its source
digests, resource declarations, and verification evidence are repaired.
<!-- /ANCHOR:rollback -->
