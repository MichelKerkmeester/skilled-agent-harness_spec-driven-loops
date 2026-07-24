---
title: "Tasks: docs, agents, governance and closeout"
description: "Task breakdown for the cli-cursor docs/agents/governance/closeout phase."
trigger_phrases: ["cli-cursor closeout tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/007-docs-agents-governance-and-closeout"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored tasks.md for phase 007"
    next_safe_action: "Author checklist.md"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: docs, agents, governance and closeout

<!-- ANCHOR:notation -->
## Task Notation
`T### [P?] Description (file path)` - `[P]` marks tasks that could run in parallel.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 `rg -l 'cli-codex|cli-claude-code|cli-opencode'` over rosters/governance/cross-skill trees to build the touch-list
- [ ] T002 Decide and record the root-`AGENTS.md`-as-Cursor-rules question (Cursor note vs. executor-agnostic)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T003 Add a symmetric `cli-cursor` mention to each agent roster surface (context/deep-research/deep-review/deep-improvement across the 3 runtimes)
- [ ] T004 Add `cli-cursor` to governance docs (`AGENTS.md`/`CLAUDE.md`/`README.md`) where the hub modes are enumerated (only on clean-tree files)
- [ ] T005 [P] Add `cli-cursor` peer mentions to cross-skill sibling docs identified by the grep
- [ ] T006 Reconcile packet completion metadata (001 Complete; 002-006 Planned; 007 status truthful)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T007 Run `validate.sh --recursive --strict` on `030-cli-cursor-creation`; confirm 0/0
- [ ] T008 Run `parent-skill-check.cjs` and `validate_skill_package.py` against the hub; confirm 0 fails
- [ ] T009 Coverage-sweep grep: confirm `cli-cursor` present wherever all 3 siblings appear
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] T010 `validate.sh 007-docs-agents-governance-and-closeout --strict` passes 0/0; SC-001..SC-004 met; write `implementation-summary.md`
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Final phase; depends on phases 002-006 for the surfaces it references.
- Sibling closeout precedent: `../../029-cli-devin-revival/007-docs-agents-governance-and-closeout/`.
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
