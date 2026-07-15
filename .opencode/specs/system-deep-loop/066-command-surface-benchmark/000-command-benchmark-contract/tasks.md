---
title: "Tasks: command-benchmark contract"
description: "Task breakdown for freezing the command-surface benchmark contract."
status: planned
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/000-command-benchmark-contract"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the contract child from the reconciled three-model benchmark design"
    next_safe_action: "Freeze the census and topology taxonomy against the live command tree"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: command-benchmark contract

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task lists its verification evidence. All phase-000 contract tasks are closed; packet status metadata is reconciled by the orchestrator.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 — Regenerate the canonical census and record exact source and mirror counts. Evidence: `census-snapshot.md`; `sync-prompts.cjs --check` exit `0`; source count `36`; mirror count `36`.
- [x] T002 — Assign every command to one of the four topologies. Evidence: `topology-taxonomy.md`; 36 classification rows; zero unclassified.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 — Author the topology taxonomy reference with a fail-closed rule for unclassified shapes. Evidence: `topology-taxonomy.md` Sections 2 and 3 define the four shapes, precedence, and instrument-invalid stop rule.
- [x] T004 — Document the two non-averaged verdict axes and the ownership boundary. Evidence: `verdict-and-ownership.md` separates P-level conformance, D1-D5 behavior, instrument validity, and generic document validation.
- [x] T005 — Define per-phase handoff gates with evidence and exit codes. Evidence: `handoff-gates.md` freezes G000 through G010; downstream children already identify this contract phase as predecessor or dependency.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 — Confirm the census reproduces and the taxonomy assigns every command exactly once. Evidence: prompt sync exit `0`; taxonomy verifier exit `0` with `workflow=27 subaction=2 direct=5 monolithic=2 total=36 unclassified=0`.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

All tasks checked with evidence, the contract references cross-linked from downstream phase specs, and the census snapshot reproduces at exit 0.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark`. Predecessor: parent packet root. Successor: 001-create-benchmark-conformance-family.
<!-- /ANCHOR:cross-refs -->
