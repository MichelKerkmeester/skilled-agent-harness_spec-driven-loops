---
title: "Tasks: Cursor manual-testing playbook"
description: "Task breakdown for the Cursor manual-testing playbook phase."
trigger_phrases: ["cursor manual testing playbook tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/006-cursor-manual-testing-playbook"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored tasks.md for phase 006"
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
# Tasks: Cursor manual-testing playbook

<!-- ANCHOR:notation -->
## Task Notation
`T### [P?] Description (file path)` - `[P]` marks tasks that could run in parallel.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Read cli-codex's root playbook + one scenario file as the structural template
- [ ] T002 Resolve the 3 open questions (hallucination-flag probe, worktree dry-run vs. real, cloud-worker SKIP vs. live)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T003 Author the root `manual-testing-playbook.md` (EXECUTION POLICY + SELF-INVOCATION GUARD banners; Global Preconditions gating EXECUTION on `cursor-agent login`)
- [ ] T004 Author `cli-invocation`, `execution-modes`, `approvals-and-sandbox` scenarios (CU-NNN)
- [ ] T005 [P] Author `worktree-isolation`, `cloud-worker`, `mcp-integration` scenarios (Cursor-unique surfaces)
- [ ] T006 [P] Author `hooks`, `session-continuity`, `prompt-templates` scenarios
- [ ] T007 Author the hallucination-fixture scenario (fake `--reasoning-effort` probe; FAIL on any fake-flag reference)
- [ ] T008 Add the playbook cross-reference into `cli-cursor/SKILL.md`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T009 Run `validate_document.py` on every playbook file; confirm 0 structural errors
- [ ] T010 Verify 9 categories, 15-20 scenarios, gap-free CU-NNN sequence, and the SKILL.md cross-reference
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] T011 `validate.sh 006-cursor-manual-testing-playbook --strict` passes 0/0; SC-001..SC-006 met; write `implementation-summary.md`
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Depends on phase 003 (SKILL.md), phase 004 (hook events), phase 005 (Composer note).
- Structural precedent: `.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/`.
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
