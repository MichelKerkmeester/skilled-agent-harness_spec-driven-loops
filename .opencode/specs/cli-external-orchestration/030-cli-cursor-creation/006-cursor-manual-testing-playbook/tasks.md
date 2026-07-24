---
title: "Tasks: Cursor manual-testing playbook"
description: "Task breakdown for the Cursor manual-testing playbook phase."
trigger_phrases: ["cursor manual testing playbook tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/006-cursor-manual-testing-playbook"
    last_updated_at: "2026-07-24T11:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 11 tasks complete; 19 scenarios authored, validate_document.py clean"
    next_safe_action: "Run validate.sh --strict, commit"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Hallucination probe: fabricated --reasoning-effort / bracket-effort model id.", "Worktree-isolation: dry-run default, opt-in destructive variant.", "Cloud-worker: document-and-SKIP default."]
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
- [x] T001 Read `cli-codex/manual-testing-playbook/manual-testing-playbook.md` (root) + `cli-invocation/default-invocation.md` (per-scenario) as the structural template
- [x] T002 Resolved the 3 open questions: hallucination probe uses the fabricated `--reasoning-effort` flag / bracket-effort model id (both live-confirmed rejected by the CLI); worktree-isolation defaults to dry-run/inspection with a clearly-marked opt-in destructive real-creation variant; cloud-worker defaults to document-and-SKIP (`--help` inspection only, no live registration)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Authored the root `manual-testing-playbook.md` (EXECUTION POLICY + SELF-INVOCATION GUARD banners; Global Preconditions gating EXECUTION on `cursor-agent login` plus the auth-fail-exits-0 gotcha as a standing precondition check)
- [x] T004 Authored `cli-invocation` (CU-001..CU-003), `execution-modes` (CU-004..CU-006), `approvals-and-sandbox` (CU-007..CU-008) scenarios
- [x] T005 [P] Authored `worktree-isolation` (CU-009..CU-010), `cloud-worker` (CU-017), `mcp-integration` (CU-011..CU-012) scenarios (Cursor-unique surfaces)
- [x] T006 [P] Authored `hooks` (CU-013..CU-014), `session-continuity` (CU-015..CU-016), `prompt-templates` (CU-018..CU-019) scenarios
- [x] T007 Authored the hallucination-fixture scenario `cli-invocation/hallucination-fixture-fake-flag.md` (CU-003; fabricated `--reasoning-effort` / bracket-effort probe; FAIL on any fake-flag reference)
- [x] T008 Added the playbook cross-reference into `cli-cursor/SKILL.md` — one line linking to `manual-testing-playbook/manual-testing-playbook.md`, labeled "Operator-facing PASS/FAIL/SKIP validation scenarios (CU-001..CU-019)"
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T009 Ran `validate_document.py` on the root file, all 19 scenario files, and `SKILL.md` — 0 structural errors across all 21 files
- [x] T010 Verified via `grep -rhoE "CU-[0-9]{3}"`: 9 category directories present, 19 total scenario files (within 15-20 target), CU-001..CU-019 sequential and gap-free; `SKILL.md` cross-reference confirmed via `git diff`
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] T011 `validate.sh 006-cursor-manual-testing-playbook --strict` passes 0/0; SC-001..SC-006 met; `implementation-summary.md` written
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Depends on phase 003 (SKILL.md), phase 004 (hook events), phase 005 (Composer note).
- Structural precedent: `.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/`.
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
