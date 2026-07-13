---
title: "Tasks: Codex revival docs and closeout"
description: "Planned tasks only; implementation is outside Wave 1."
trigger_phrases: ["Codex closeout tasks"]
importance_tier: normal
contextType: planning
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/006-docs-and-closeout"
    last_updated_at: "2026-07-13T06:25:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase stub for docs and closeout"
    next_safe_action: "Execute after phases 003-005 complete"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Codex revival docs and closeout
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- ANCHOR:notation -->
## Task Notation
All tasks remain pending.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Confirm phases 003-005 completion evidence. Evidence: each child validates `Errors:0`; fail-closed proof 4/4.
- [x] T002 Inventory active Codex references. Evidence: `git grep` shows the README hub section is the sole active advertising anchor.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Reconcile active docs and release notes. Evidence: `README.md` cli-codex bullet + hub `changelog/v1.2.0.0.md`.
- [x] T004 Complete packet summaries and status metadata. Evidence: `implementation-summary.md` + parent rollup.
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T005 Run all component and parity gates. Evidence: `sync-agents.cjs --check` 13/13; fail-closed proof; JSON/TOML valid.
- [x] T006 Run recursive strict packet validation. Evidence: `validate.sh --recursive --strict` parent+6 children Errors:0.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All six phases have evidence and the packet validates recursively.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
## Cross-References
- `spec.md`
- `plan.md`
- `../spec.md`
<!-- /ANCHOR:cross-refs -->
