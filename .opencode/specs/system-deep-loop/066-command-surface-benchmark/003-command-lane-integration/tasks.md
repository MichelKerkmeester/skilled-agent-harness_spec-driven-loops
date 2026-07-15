---
title: "Tasks: command lane integration"
description: "Task breakdown for lane registration and full-corpus convergence."
status: planned
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/003-command-lane-integration"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the lane-integration child for the full-corpus deterministic run"
    next_safe_action: "Register the peer adapter lane and run scoping against the command scope"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs"
      - ".opencode/commands/scripts/validate-command-references.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: command lane integration

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task lists its verification evidence. This child is Planned; all tasks are open.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 — Author the lane-config entry selecting the command adapter over the command scope. Evidence: lane-config resolves without a scoping error.
- [ ] T002 — Confirm scoping resolves sk-doc over docs with the command adapter. Evidence: scoping JSON output shows the resolved adapter, exit 0.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 — Run all canonical commands through the deterministic lane. Evidence: run covers the full discovered corpus.
- [ ] T004 — Prove convergence over the full corpus. Evidence: run reaches converged true.
- [ ] T005 — Hard-gate raw-delta and reduced-report agreement. Evidence: raw-delta and reduced counts and codes agree exactly.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 — Confirm the generic lane runs separately from the peer lane. Evidence: no single run places both adapters over the same scope.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

Scoping resolves the peer lane, the full corpus converges, raw-delta and reducer agree exactly, and the peer lane stays isolated from generic validation.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark`. Predecessor: 002-command-contract-adapter. Successor: 004-command-behavior-evaluator.
<!-- /ANCHOR:cross-refs -->
