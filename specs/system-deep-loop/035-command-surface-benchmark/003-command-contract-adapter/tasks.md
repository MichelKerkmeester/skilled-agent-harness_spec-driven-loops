---
title: "Tasks: command contract adapter"
description: "Task breakdown for the deterministic sk-doc-command peer adapter."
status: complete
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/003-command-contract-adapter"
    last_updated_at: "2026-07-15T07:22:15Z"
    last_updated_by: "codex"
    recent_action: "Completed all adapter implementation and verification tasks"
    next_safe_action: "Refresh generated metadata, then register the peer adapter in the successor phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/tests/sk-doc-command-adapter.test.cjs"
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: command contract adapter

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task lists its verification evidence. This child is complete.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 — Implement discover to equal the canonical source inventory. [evidence: `sync-prompts.cjs --check` and the adapter test each reported 36 canonical commands]
- [x] T002 — Implement check for dimensions S1 to S5 with P0 to P2 severities. [evidence: the adapter test matched the exact code, severity, dimension and location sets for 13/13 fixtures]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 — Extend the reusable reference checks to all four command topologies. [evidence: the pre-edit baseline and additive post-edit `--self-test` each exited 0, with one hermetic source per topology after the edit]
- [x] T004 — Prove exact fixture outcomes against the oracle expectations. [evidence: the adapter-only test matched 13/13 fixtures, including all public defects, held-out defects and the clean control]
- [x] T005 — Assert no generic document-validation finding types are emitted. [evidence: the runtime scan classified 14/14 findings as command-surface findings and reported generic=0]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 — Run the adapter node syntax check and test suite. [evidence: both `node --check` commands and the adapter test exited 0, and the independent verifier passed all 13 fixtures]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

The adapter passes its syntax check and test suite, discovery equals the canonical inventory, every fixture outcome matches, and generic validation stays a separate owner.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/035-command-surface-benchmark`. Predecessor: 002-deterministic-fixtures-oracle. Successor: 004-command-lane-integration.
<!-- /ANCHOR:cross-refs -->
