---
title: "Checklist: Write-Set Conflict Graph"
description: "Checklist for phase 004 of the phase-009 shared mode contracts and fixtures parent: verify the phase-010 write-set conflict graph, hard ordering, safe parallelism, and orchestrator contract."
trigger_phrases:
  - "write-set conflict graph checklist"
  - "phase-010 graph verification"
  - "deep-loop lane conflict checklist"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined blocking graph, drift, fence, and orchestration verification checks"
    next_safe_action: "Run graph fixtures after the phase-010 resource manifests are reviewed"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Write-Set Conflict Graph

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 004. Every item is a check the paired verify agent runs
before the graph is accepted as the phase-010 orchestration input; each report pins the BASE identity, graph source
digests, graph schema version, graph digest, commands, exit codes, node/edge counts, lane decisions, and unexpected
tracked mutation. A serial-single-writer fallback is evidence of safety, not evidence that the graph is complete.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The parent `spec.md`, `execution-sequencing-strategy.md`, and `manifest/phase-tree.json` are pinned and their source digests are recorded
- [ ] CHK-002 [P0] The graph node set exactly matches the eight `mode_workstreams_phase_010` entries
- [ ] CHK-003 [P1] The phase-010 child resource manifests and the graph schema version are recorded in the candidate report
- [ ] CHK-004 [P2] This child retains `depends_on: []`; `003-mixed-version-fixtures` remains navigation-only predecessor text
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] Graph resources use canonical identities and distinguish read, write, shared mutable state, lock, fixture, generated output, and immutable input
- [ ] CHK-006 [P0] Every conflict edge names its type, overlapping resources, serialization effect, reason, and source evidence
- [ ] CHK-007 [P1] Unknown, stale, aliased, contradictory, and manually overridden evidence is fail closed and never treated as parallel-safe by omission
- [ ] CHK-008 [P2] The graph policy preserves `serial-single-writer` as the default and uses stable slug ordering only after safety checks pass
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] Exact node coverage is validated against `mode_workstreams_phase_010`; missing, duplicate, renamed, and extra nodes fail
- [ ] CHK-010 [P0] Read/write normalization catches path, symlink, shared-packet, backend, state-store, lock, and generated-output aliases
- [ ] CHK-011 [P0] Write-write and write-read fixtures derive conflict edges with resource-level evidence and prevent concurrent conflicting lanes
- [ ] CHK-012 [P0] `004-deep-improvement-common` is a hard predecessor of `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark`
- [ ] CHK-013 [P0] `002-deep-review` and `008-deep-alignment` are fenced whenever their canonical resource sets include the shared review loop
- [ ] CHK-014 [P0] `001-deep-research` and `003-deep-ai-council` pass the explicit independent-pair assertion only while their mutable resource sets are disjoint
- [ ] CHK-015 [P0] Missing manifests, stale source digests, unresolved aliases, contradictory ownership, unknown resources, and cycles return serial-single-writer or block
- [ ] CHK-016 [P0] Repeated derivation from identical sealed inputs produces the same graph digest, sorted edge list, lane order, and decision evidence
- [ ] CHK-017 [P0] A changed phase-010 resource declaration rejects the old graph before orchestration and requires graph refresh evidence
- [ ] CHK-018 [P0] Orchestrator fixtures wait for hard predecessors and fences and include node, predecessor, resource, graph digest, class, and refusal reason in each decision
- [ ] CHK-019 [P1] A graph with incomplete evidence never widens parallelism merely because two node names appear different
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-020 [P1] The graph contract cites the parent spec, sequencing strategy, phase-tree manifest, and every phase-010 resource source used for derivation
- [ ] CHK-021 [P1] The schedule output distinguishes derived conflicts, hard order, review fences, explicit independence, and conservative fallback
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-022 [P2] No credential, mutable live secret, or unsealed external input is included in graph evidence; resource identifiers remain least-detail and non-secret
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-023 [P2] The phase outcome and graph handoff are reflected in `spec.md`, `plan.md`, `tasks.md`, and the phase-009 parent documentation where applicable
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-024 [P1] Only the four authored documents in this phase folder changed; `description.json` and `graph-metadata.json` remain tooling-owned
- [ ] CHK-025 [P1] Any later graph artifact is emitted in a path-scoped, dependency-closed change and remains reversible to the serial-single-writer policy
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 graph, constraint, drift, determinism, and orchestrator check passes, the report pins
source and graph digests, the eight node declarations are complete, and no stale or incomplete evidence widens phase-010
parallelism. The graph may be operationally conservative, but it must not be accepted as complete without provenance and
edge evidence.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, the graph schedule is digest-bound, and
`git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
