---
title: "Tasks: OpenCode plugin browsability symlinks"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "opencode symlink tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/007-opencode-plugin-symlinks"
    last_updated_at: "2026-07-28T20:35:00Z"
    last_updated_by: "claude"
    recent_action: "Authored task list for OpenCode plugin symlink mirror"
    next_safe_action: "Author implementation-summary.md, then run the metadata + validation loop"
    blockers: []
    key_files:
      - ".opencode/hooks/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: OpenCode plugin browsability symlinks

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the 5 unified-hooks-tree target plugins and the 2 skill-owned target plugins all exist unmodified in `.opencode/plugins/` before creating any symlink.
- [ ] T002 Confirm `.opencode/hooks/goal/lib/` exists as a real, populated directory (phase 001 dependency satisfied for the `goal/opencode/mk-goal.js` row).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P] Create `.opencode/hooks/dispatch/opencode/mk-cli-dispatch-audit.js` as a relative symlink to `.opencode/plugins/mk-cli-dispatch-audit.js`.
- [ ] T004 [P] Create `.opencode/hooks/mcp-route-guard/opencode/mk-mcp-route-guard.js` as a relative symlink to `.opencode/plugins/mk-mcp-route-guard.js`.
- [ ] T005 [P] Create `.opencode/hooks/post-edit-quality/opencode/mk-post-edit-quality.js` as a relative symlink to `.opencode/plugins/mk-post-edit-quality.js`.
- [ ] T006 [P] Create `.opencode/hooks/task-dispatch/opencode/mk-deep-loop-guard.js` as a relative symlink to `.opencode/plugins/mk-deep-loop-guard.js`.
- [ ] T007 Create `.opencode/hooks/goal/opencode/mk-goal.js` as a relative symlink to `.opencode/plugins/mk-goal.js` (depends on T002).
- [ ] T008 [P] Create `.opencode/skills/system-spec-kit/mcp-server/hooks/opencode/mk-spec-gate.js` as a relative symlink to `.opencode/plugins/mk-spec-gate.js`.
- [ ] T009 [P] Create `.opencode/skills/sk-git/scripts/hooks/opencode/mk-git-preflight-advisory.js` as a relative symlink to `.opencode/plugins/mk-git-preflight-advisory.js`.
- [ ] T010 [P] Update `.opencode/hooks/README.md`'s directory-tree diagram and KEY FILES table with the 5 new `opencode/` rows.
- [ ] T011 [P] Update `dispatch/README.md`, `mcp-route-guard/README.md`, `post-edit-quality/README.md`, `task-dispatch/README.md` with their own `opencode/` row.
- [ ] T012 [P] Update `system-spec-kit/mcp-server/hooks/README.md` and `sk-git/scripts/hooks/README.md` with their `opencode/` row.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Resolve all 7 symlinks via `readlink -f` (or realpath); confirm each points at the correct, existing `.opencode/plugins/` file and is written as a relative path.
- [ ] T014 Run `validate_document.py` on all touched README files; fix any reported issue.
- [ ] T015 Confirm `git status` on `.opencode/plugins/` is clean (no plugin file itself modified by this phase).
- [ ] T016 Run a live OpenCode session from repo root and confirm each of the 5 plugins reachable through these symlinks loads exactly once, with no double-registration error or duplicate log entry.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (symlink resolution, doc validation, live OpenCode double-load check)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
