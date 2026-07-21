---
title: "Implementation Plan: Write-Set Conflict Graph"
description: "Implementation plan for the phase-012 write-set conflict graph leaf: derive, validate, and expose the phase-013 dependency and write-set conflict graph contract."
trigger_phrases:
  - "write-set conflict graph implementation plan"
  - "phase-013 dependency graph plan"
  - "deep-loop lane scheduling plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph"
    last_updated_at: "2026-07-21T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented the graph derivation, scheduler, source-drift guard, and adversarial unit fixtures"
    next_safe_action: "Run the independent verifier against the sealed graph inputs"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/graph.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/scheduler.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts"
    completion_pct: 90
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
| **Surface** | system-deep-loop phase-012 / phase-013 orchestration contract |
| **Change class** | Additive runtime graph library, adversarial unit suite, and leaf-local evidence |
| **Execution** | Deterministic scheduling from sealed inputs; fail closed to `serial-single-writer` on incomplete evidence |

### Overview
Phase 013 cannot safely use unconditional eight-way parallelism. This plan turns the phase-012 write-set decision into
a versioned graph contract whose nodes are the eight manifest-defined mode migrations and whose edges identify resource
conflicts, hard ordering, and review-loop fences. The graph is derived from canonical read/write declarations and source
digests, validated against the phase tree and child contracts, and consumed by the orchestrator as a deterministic lane
plan. The default remains `serial-single-writer` whenever the graph is incomplete, stale, or ambiguous. The implementation
does not move migration or approval authority; its `phase_gate_complete` field remains false for every schedule class.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The leaf contract, parent sequencing strategy, phase-tree manifest, and sibling ownership contracts are pinned sources
- [x] The graph node set exactly matches the eight entries in `mode_workstreams_phase_013`
- [x] Every node has canonical reads and writes derived from a real shipped-mode import/write census
- [x] Conflict derivation distinguishes write-write, write-read, shared-backend, fence, and hard-order relationships
- [x] Unknown, stale, aliased, and contradictory resource evidence is conservative and fail closed
- [x] The required common-before-variants, review/alignment fence, and research/council independence assertions are explicit

### Definition of Done
- [x] The versioned graph envelope and deterministic derivation procedure are executable
- [x] Graph preflight consumes graph evidence and refuses stale or incomplete widened parallelism
- [x] Unit fixtures prove node coverage, edge derivation, hard constraints, independence, determinism, and drift detection
- [ ] An independent verifier has accepted the digest-bound schedule as a phase-013 orchestration input
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
- Confirm the phase-012 parent source set and phase-tree manifest are available; record their content digests and the
  exact eight phase-013 workstream slugs.
- Census real imports and writes in the shipped mode packets and shared runtime roots; phase-013 child stubs are not
  treated as resource declarations.
- Confirm the child manifest's `depends_on: []` remains intact; treat the required predecessor slug only as navigation,
  not as an execution dependency.

### Phase 2: Implementation
- Add `runtime/lib/write-set-conflict-graph/` with the versioned envelope, node/resource schema, edge types, assertions,
  conservative policy, and schedule receipt fields.
- Normalize each node's read and write resources and derive deterministic write-write, write-read, shared-backend, fence,
  and hard-order edges with resource-level evidence.
- Encode the deep-improvement-common predecessor edges, the deep-review/deep-alignment review-loop fence, and the
  research/council independence assertion without inventing variant-to-variant ordering.
- Implement source-digest, coverage, alias, ownership, cycle, unknown-resource, and graph-drift checks; make unresolved
  evidence a conflict or a serial fallback rather than a parallel grant.
- Implement graph reuse preflight and scheduling, including ready-node selection, fence handling, stable tie breaking,
  refusal reasons, graph refresh behavior, and graph-digest-bound lane receipts.

### Phase 3: Verification
- Verify exact node coverage against `manifest/phase-tree.json` and canonical read/write declarations against the shipped
  mode census and sibling ownership contracts.
- Verify derived edge examples for write-write, write-read, shared backend, hard-order, and review-loop fence cases.
- Verify that deep-improvement-common precedes all three variants, deep-review and alignment cannot overlap on the shared
  review loop, and research/council remain parallel-safe only under disjoint resource evidence.
- Run repeated derivation and scheduling with identical inputs; compare graph digest, edge order, lane order, and refusal
  evidence for determinism.
- Simulate stale, missing, ambiguous, aliased, contradictory, Unicode-normalization-equivalent, namespace-root, and
  changed write-set inputs; confirm conflict, serial fallback, or blocking behavior without false widened parallelism.
- Run the leaf Vitest suite, repository-bundled TypeScript compiler, strict leaf validator, comment-hygiene scan, and
  path-scoped status check; record every lane, fence, predecessor, and refusal decision in executable fixtures.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Compare graph node IDs with `mode_workstreams_phase_013`; fail on missing, duplicate, renamed, or extra nodes |
| REQ-002 | Validate every node's canonical read/write/shared-state records against the shipped import/write census |
| REQ-003 | Run path, Unicode-form, namespace-root, symlink, generated-output, backend-alias, and state-store normalization fixtures; equivalent spellings conflict and unresolved aliases fail closed |
| REQ-004 | Derive conflict fixtures for write-write, write-read, shared-backend, and fence overlap and compare resource evidence |
| REQ-005 | Assert common-before-variants hard-order edges and review/alignment fence decisions in the schedule output |
| REQ-006 | Assert research/council disjointness and fail the independence assertion when a shared mutable resource is introduced |
| REQ-007 | Feed missing, stale, unknown, contradictory, cyclic, and incomplete graph inputs; confirm serial-single-writer or block |
| REQ-008 | Derive and schedule the same sealed input twice; compare graph digest, sorted edges, lane order, and decision evidence |
| REQ-009 | Inspect orchestrator receipts for node, predecessor, resource, source digest, class, and refusal reason fields |
| REQ-010 | Change a census source digest without refreshing the graph; confirm preflight rejects the old schedule |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The authoritative planning inputs are this leaf's frozen graph contract, the phase-012 sequencing strategy,
`manifest/phase-tree.json`, and the sibling shared-interface and closure-ownership contracts. Canonical resources come
from a direct census of shipped mode packets under `.opencode/skills/system-deep-loop/` plus `shared/` and `runtime/`;
the phase-013 child stubs are node-map inputs only. The manifest declares this child with `depends_on: []`; the adjacency
line naming `003-mixed-version-fixtures` is navigation only. Phase 013 may consume a fresh graph during preflight, but
the graph never delegates or exercises authority-cutover decisions.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The change is additive: remove the new graph library and unit test, then restore this leaf's local documentation to return
to the prior planning-only state. No shipped packet, persisted state, ledger authority, manifest, phase-013 stub, or mode
migration changes. Independently of file rollback, stale, missing, ambiguous, or contradictory evidence forces the
runtime result back to `serial-single-writer`; that fallback is a refusal receipt, not an approval gate.
<!-- /ANCHOR:rollback -->
