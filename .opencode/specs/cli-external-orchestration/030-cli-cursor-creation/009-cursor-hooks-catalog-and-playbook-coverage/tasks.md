---
title: "Tasks: cli-cursor hooks feature-catalog + playbook coverage"
description: "Task breakdown for the cli-cursor hooks feature-catalog and playbook coverage phase."
trigger_phrases: ["cli-cursor hooks catalog tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-catalog-and-playbook-coverage"
    last_updated_at: "2026-07-24T15:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored tasks.md for phase 009"
    next_safe_action: "Author checklist.md; wait for operator go-ahead before dispatching LUNA"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-catalog-planning", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: cli-cursor hooks feature-catalog + playbook coverage

<!-- ANCHOR:notation -->
## Task Notation
`T### [P?] Description (file path)` - `[P]` marks tasks that could run in parallel.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Re-read `spec-gate-prebind.mjs` fresh (confirm it still exists on disk, unmodified from this planning pass, since it belongs to a concurrent session)
- [ ] T002 Decide: extend `CU-013`/`CU-014` in place vs. add a new `CU-020` scenario for `spec-gate-prebind.mjs`
- [ ] T003 Confirm feature-catalog placement (hub-level `cli-external-orchestration/feature-catalog/`, new category) before creating any directory
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T004 Read `cli-codex/SKILL.md` in full before composing any dispatch prompt (mandatory per this repo's CLI-dispatch rule)
- [ ] T005 Dispatch `gpt-5.6-luna` (`cli-codex`, `xhigh` effort, `service_tier="fast"`) to author the feature-catalog category + per-feature file(s) per `create-feature-catalog/SKILL.md`, briefed on all 5 adapters' exact status
- [ ] T006 Dispatch `gpt-5.6-luna` (same tier) to extend the playbook's `hooks/` category per the Phase 1 decision, per `create-manual-testing-playbook/SKILL.md`
- [ ] T007 Independently re-verify both agents' output (read the actual files, do not trust a subagent's self-report)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T008 Run `validate_document.py` on every new/modified feature-catalog and playbook file
- [ ] T009 Grep sweep: confirm all 5 adapter filenames appear in both docs; confirm `spec-gate-prebind.mjs` is never described with confirmed-working language
- [ ] T010 Run `validate.sh 030-cli-cursor-creation --recursive --strict`; confirm 0/0
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] T011 `validate.sh 009-cursor-hooks-catalog-and-playbook-coverage --strict` passes 0/0; SC-001..SC-004 met; write `implementation-summary.md`
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Extends phase 004 (hook adapters) and phase 006 (manual-testing playbook).
- Authoring contracts: `sk-doc/create-feature-catalog/SKILL.md`, `sk-doc/create-manual-testing-playbook/SKILL.md`.
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
