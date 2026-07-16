---
title: "Feature Specification: Write-Set Conflict Graph"
description: "Plan the executable dependency and write-set conflict graph for the eight phase-013 mode migrations, including canonical read/write resources, derived conflict edges, hard ordering fences, freshness checks, and orchestrator consumption."
trigger_phrases:
  - "write-set conflict graph"
  - "phase-013 migration scheduling"
  - "deep-loop mode write ownership"
  - "parallel-safe mode migrations"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/012-shared-mode-contracts-and-fixtures"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined graph nodes, conflict edges, and phase-013 orchestration fences"
    next_safe_action: "Freeze the write-set schema and derive the phase-013 lane schedule"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Write-Set Conflict Graph

> Phase adjacency under `012-shared-mode-contracts-and-fixtures` (navigation order, not a hard runtime dependency): predecessor `003-mixed-version-fixtures`; successor: none (last sibling).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/034-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Fourth child of the phase-012 shared mode contracts and fixtures parent |
| **Depends on** | None (`[]`) in `manifest/phase-tree.json`; sibling adjacency is navigation only |
| **Parent outcome** | Emit an executable dependency and write-set conflict graph before phase-013 fan-out |
| **Authority posture** | Planning and orchestration-contract work only; no mode authority cutover |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Phase 013 is a fan-out of eight migrations, but its workstreams do not have eight independent write surfaces. The
phase-013 manifest names `001-deep-research`, `002-deep-review`, `003-deep-ai-council`, `004-deep-improvement-common`,
`005-agent-improvement`, `006-model-benchmark`, `007-skill-benchmark`, and `008-deep-alignment`. The program parent
spec identifies hidden cross-mode coupling: the three benchmark variants share the deep-improvement packet and scoring
backend, while alignment shares the review loop with deep-review. A naive parent-by-eight execution can therefore race
on files, persisted state, locks, or shared service ownership even when the mode names are distinct.

The `execution-sequencing-strategy.md` deliberately defers the phase-013 parallelism decision to this phase and sets
`serial-single-writer` as the safe default. It also requires `004-deep-improvement-common` to precede the three
benchmark variants, fences `002-deep-review` with `008-deep-alignment` where their review loop overlaps, and treats
research and council as independent. Those statements are currently prose. The orchestrator needs a versioned,
machine-consumable declaration of every mode migration's canonical read set, write set, shared mutable state, derived
conflict edges, hard dependencies, and unknown-resource policy.

This phase plans that declaration. The graph must be derived from reviewed migration manifests and canonical resource
identities, not from directory names or an author's assumption that two modes are independent. It must remain honest as
the phase-013 child contracts evolve, fail closed when a resource cannot be classified, and emit a deterministic lane
schedule that the orchestrator can consume without silently widening parallelism. The graph is a planning artifact and
execution contract; it does not move authority from the legacy path.

The source boundary is explicit: the phase-012 parent spec defines the shared-contract outcome and phase handoff, the
`manifest/phase-tree.json` file defines the exact workstream set and hard notes, and
`execution-sequencing-strategy.md` defines the deferred scheduling decision and default policy. The graph must cite all
three inputs in its provenance record.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A versioned graph envelope with schema version, source digests, policy, node records, conflict edges, hard-order
  edges, explicit independence assertions, and a deterministic schedule result.
- One node for each exact entry in `mode_workstreams_phase_010`: `001-deep-research`, `002-deep-review`,
  `003-deep-ai-council`, `004-deep-improvement-common`, `005-agent-improvement`, `006-model-benchmark`,
  `007-skill-benchmark`, and `008-deep-alignment`.
- Canonical resource records for files, persisted state, shared packets, scoring backends, review-loop services,
  locks, fixtures, generated artifacts, and other mutable state touched by a migration. Each resource records its
  canonical identity, kind, scope, mutability, and read or write access.
- Conflict derivation from normalized read and write sets, including write-write overlap, write-read overlap, shared
  mutable backend ownership, lock/fence overlap, and unresolved aliases. Unknown or ambiguous resources are conflicts,
  never evidence of safety.
- Hard constraints from the sequencing sources: deep-improvement-common precedes its three variants; deep-review and
  deep-alignment share a review-loop fence; research and council have an explicit independent-pair assertion subject
  to normal graph validation.
- A schedule policy that computes parallel-safe antichains only after hard dependencies and conflict edges are applied,
  preserves deterministic ordering, and defaults to `serial-single-writer` when graph evidence is incomplete.
- Derivation, freshness, provenance, and drift checks that compare the graph against the phase-tree workstream list and
  each phase-013 migration's reviewed resource manifest.
- The phase-013 orchestrator input contract: graph loading, source validation, lane selection, fence handling,
  fail-closed behavior, and evidence returned for every scheduled or serialized node.
- Fixtures and verification cases for the required relationships and for missing, stale, aliased, or contradictory
  write-set declarations.

### Out of Scope
- Implementing any phase-013 mode migration, shared mode interface, reducer, sealed artifact, certificate, or runtime
  writer.
- Changing the phase-012 parent outcome, the phase tree, the execution-sequencing strategy, or the eight workstream
  names to make the graph easier to derive.
- Moving ledger or mode authority, migrating in-flight state, removing legacy writers, or deciding the phase-014
  rollback window and cutover evidence.
- Treating the phase-013 graph as permission to run migrations against a shared checkout without the worktree and
  path-scoped commit discipline defined by the program.
- Hand-writing `description.json` or `graph-metadata.json` for this folder.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The graph covers the manifest-defined phase-013 workstreams exactly | The node set equals the eight strings in `mode_workstreams_phase_010`; missing, duplicate, renamed, or extra nodes fail validation |
| REQ-002 | Every node declares canonical reads and writes | Each node has reviewed resource records for files/state/backends/locks/fixtures, with access, scope, mutability, owner, and source evidence; directory names alone are not a write set |
| REQ-003 | Resource identities are stable and collision-aware | Equivalent relative paths, symlinks, generated outputs, shared packet roots, and backend aliases normalize to one identity or produce an explicit unresolved-alias conflict |
| REQ-004 | Conflict edges are derived from access sets | The derivation emits deterministic edges for write-write, write-read, shared mutable backend, and fence overlap, naming the resources and evidence that caused each edge |
| REQ-005 | Required ordering and fencing are executable | `004-deep-improvement-common` precedes `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark`; `002-deep-review` and `008-deep-alignment` share a serialized review-loop fence where their sets overlap |
| REQ-006 | Independent work is asserted rather than assumed | Research and council have no derived conflict edge for their declared migration surfaces, and a validator proves that their resource sets remain disjoint or reports the new conflict |
| REQ-007 | Unknown or stale evidence fails closed | Missing manifests, stale source digests, unresolved resource aliases, contradictory ownership, cycles, and incomplete node coverage force serial-single-writer or block scheduling; they never grant parallel execution |
| REQ-008 | The schedule is deterministic and reproducible | Equal graph input, policy, and base identity yield the same lane order, fence decisions, serialization reasons, and graph digest across runs |
| REQ-009 | The orchestrator consumes evidence, not just booleans | Each lane decision includes node IDs, predecessor completion, conflict/fence resources, source digest, schedule class, and refusal reason when a lane is serialized or blocked |
| REQ-010 | Graph drift is detectable before phase-013 execution | A graph validator compares the graph to the manifest and migration resource declarations and fails when a phase changes a read/write surface without a graph refresh and review record |

### Graph contract

The graph envelope records `schema_version`, `base_identity`, `generated_from`, `policy`, `nodes`, `edges`,
`independent_assertions`, and `schedule`. `generated_from` includes the source paths and content digests for the parent
`spec.md`, `execution-sequencing-strategy.md`, `manifest/phase-tree.json`, and every phase-013 resource manifest used
to derive a node. The policy is explicit: `unknown_as_conflict: true`, `default_schedule: serial-single-writer`,
and `manual_edge_overrides: []` unless an override carries an owner, reason, resource evidence, and expiry.

Each node contains `id`, `mode_slug`, `read_set`, `write_set`, `shared_state`, `migration_dependencies`,
`contract_refs`, and `source_refs`. A resource contains `canonical_id`, `kind`, `scope`, `mutability`, `access`, and
`evidence`. A conflict edge contains `from`, `to`, `edge_type`, `resources`, `serialization`, `reason`, and
`evidence`; `edge_type` is one of `write-write`, `write-read`, `shared-backend`, `fence`, or `hard-order`.
`hard-order` is used for the common-before-variants constraint, while a review-loop `fence` prevents concurrent writes
where the two review surfaces overlap. Independent pairs are recorded separately as assertions so absence of an edge
is not mistaken for proof.

The derivation first canonicalizes resources, then computes symmetric access conflicts, then applies hard-order and
fence constraints, then validates the resulting directed dependency graph for cycles. The scheduler selects only nodes
whose predecessors are complete and whose conflict resources are not active in another lane. It may widen a serial
schedule only when all required source digests, resource declarations, and invariants are green. The phase-013
orchestrator consumes this output and reports the same evidence; it must not infer missing edges or continue with a stale
graph.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The graph has exactly the eight phase-013 nodes from `manifest/phase-tree.json`, each with a complete,
  canonical read/write declaration and provenance to its reviewed migration contract.
- **SC-002**: The graph derives conflict edges for shared mutable resources and records the resource-level reason for
  every serialization decision; unknown resources are conservative conflicts.
- **SC-003**: The graph encodes deep-improvement-common before agent-improvement, model-benchmark, and skill-benchmark,
  fences deep-review with deep-alignment where their review loop overlaps, and preserves research/council independence.
- **SC-004**: A deterministic scheduler produces a graph-digest-bound lane plan and defaults to serial-single-writer for
  missing, stale, contradictory, or ambiguous evidence.
- **SC-005**: A phase-013 orchestrator fixture consumes the graph, waits for hard predecessors, honors fences, and emits
  auditable lane decisions without inventing a parallel-safe relationship.
- **SC-006**: A drift check detects a changed phase-013 write set or manifest source before migrations run and requires a
  graph refresh rather than silently reusing the previous schedule.

**Given** the manifest-defined eight nodes and complete resource manifests, **When** the graph is derived, **Then** the
output contains stable node IDs, canonical resource IDs, deterministic conflict edges, hard-order constraints, and an
explicit research/council independence assertion.

**Given** a shared review-loop resource in both deep-review and deep-alignment, **When** the scheduler evaluates those
nodes, **Then** it emits a fence or serialization decision naming that resource and never schedules both writers together.

**Given** a changed write-set declaration or stale source digest, **When** the orchestrator loads the graph, **Then** it
refuses widened parallelism and returns a graph-refresh or serial-single-writer decision with evidence.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **False parallelism from incomplete manifests** - A mode can acquire a shared backend through an indirect helper that
  its local file list omits. Mitigation: derive resource records from imports, shared packet ownership, backend handles,
  locks, generated outputs, and reviewed phase contracts; treat unresolved access as a conflict.
- **Over-serialization hides useful concurrency** - A broad directory-level resource can serialize independent files.
  Mitigation: canonicalize at the narrowest stable mutable resource, retain evidence for each edge, and allow widening
  only after a reviewed manifest proves disjointness.
- **Common-service ordering is confused with variant mutual exclusion** - The three variants must follow
  deep-improvement-common, but their later relationship must come from their actual write sets. Mitigation: encode the
  hard predecessor edges separately from derived variant conflicts.
- **Review-loop aliases evade the alignment fence** - Deep-review and deep-alignment may reach the loop through different
  paths. Mitigation: normalize the shared review-loop identity and require a fence assertion whenever either path is
  unresolved.
- **Graph drift after contract edits** - A schedule can be valid for an older child contract but unsafe for the current
  one. Mitigation: bind the graph to source digests and validate before every phase-013 lane selection.
- **Scheduler fallback is mistaken for approval** - Serial-single-writer protects correctness but does not prove the
  graph is complete. Mitigation: report fallback as a non-green graph state with its missing evidence and do not mark
  the phase gate complete.
- **Dependencies**: the phase-012 parent `spec.md`, `execution-sequencing-strategy.md`, and
  `manifest/phase-tree.json`; the eight phase-013 child contracts; the phase-008 compatibility/shadow boundary and the
  phase-009 through phase-011 shared runtime contracts consumed by the parent program. The child itself remains
  `depends_on: []` in the manifest.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which phase-013 child artifact is the authoritative resource manifest: the child `spec.md`, a generated migration
  manifest, or a reviewed combination with runtime import census evidence?
- What canonical identity rules collapse symlink paths, package roots, generated files, SQLite/state stores, and shared
  service handles without over-collapsing independent resources?
- Which review-loop state is mutable during a mode migration and therefore requires a fence, versus immutable fixture data
  that can be read concurrently?
- Should the scheduler return a serial-single-writer plan with a warning for incomplete evidence, or block all execution
  until the graph is complete? The default must remain conservative either way.
- What graph digest and schedule receipt fields must phase-013 include in each mode gate so phase-014 can distinguish a
  graph-approved shadow run from a later authority decision?

These decisions are resolved while freezing the graph schema and orchestrator contract. They do not authorize a mode
migration, a write-set exception, or an authority cutover in this Planned phase.
<!-- /ANCHOR:questions -->
