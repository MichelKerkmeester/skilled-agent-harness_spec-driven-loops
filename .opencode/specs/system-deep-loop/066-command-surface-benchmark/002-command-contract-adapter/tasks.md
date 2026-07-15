---
title: "Tasks: command contract adapter"
description: "Task breakdown for the deterministic sk-doc-command peer adapter."
status: planned
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/002-command-contract-adapter"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the adapter child that implements the deterministic command axis"
    next_safe_action: "Implement the peer adapter discover and check methods against the fixtures"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs"
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: command contract adapter

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task lists its verification evidence. This child is Planned; all tasks are open.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 — Implement discover to equal the canonical source inventory. Evidence: discovery set equals the sync inventory count.
- [ ] T002 — Implement check for dimensions S1 to S5 with P0 to P2 severities. Evidence: adapter emits severity-tagged findings for each dimension.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 — Extend the reusable reference checks to all four command topologies. Evidence: reference-checks self-test exit 0 across topologies.
- [ ] T004 — Prove exact fixture outcomes against the oracle expectations. Evidence: adapter matches every public and held-out fixture expectation.
- [ ] T005 — Assert no generic document-validation finding types are emitted. Evidence: finding-type scan shows zero generic types.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 — Run the adapter node syntax check and test suite. Evidence: node check exit 0 and adapter test suite exit 0.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

The adapter passes its syntax check and test suite, discovery equals the canonical inventory, every fixture outcome matches, and generic validation stays a separate owner.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark`. Predecessor: 001-deterministic-fixtures-oracle. Successor: 003-command-lane-integration.
<!-- /ANCHOR:cross-refs -->
