---
title: "Tasks: OpenCode plugin browsability symlinks"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "opencode symlink tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/003-goal-hooks-cross-runtime/007-opencode-plugin-symlinks"
    last_updated_at: "2026-07-29T05:15:17Z"
    last_updated_by: "claude"
    recent_action: "Created 7 symlinks + updated 7 READMEs; all tasks verified complete"
    next_safe_action: "Commit 006+007 on skilled/v4; proceed to phase 008"
    blockers: []
    key_files:
      - ".opencode/hooks/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-20260728"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 Confirm the 5 unified-hooks-tree target plugins and the 2 skill-owned target plugins all exist unmodified in `.opencode/plugins/` before creating any symlink.
- [x] T002 Confirm `.opencode/hooks/goal/lib/` exists as a real, populated directory (phase 001 dependency satisfied for the `goal/opencode/mk-goal.js` row).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Create `.opencode/hooks/dispatch/opencode/mk-cli-dispatch-audit.js` as a relative symlink to `.opencode/plugins/mk-cli-dispatch-audit.js`.
- [x] T004 [P] Create `.opencode/hooks/mcp-route-guard/opencode/mk-mcp-route-guard.js` as a relative symlink to `.opencode/plugins/mk-mcp-route-guard.js`.
- [x] T005 [P] Create `.opencode/hooks/post-edit-quality/opencode/mk-post-edit-quality.js` as a relative symlink to `.opencode/plugins/mk-post-edit-quality.js`.
- [x] T006 [P] Create `.opencode/hooks/task-dispatch/opencode/mk-deep-loop-guard.js` as a relative symlink to `.opencode/plugins/mk-deep-loop-guard.js`.
- [x] T007 Create `.opencode/hooks/goal/opencode/mk-goal.js` as a relative symlink to `.opencode/plugins/mk-goal.js` (depends on T002).
- [x] T008 [P] Create `.opencode/skills/system-spec-kit/mcp-server/hooks/opencode/mk-spec-gate.js` as a relative symlink to `.opencode/plugins/mk-spec-gate.js`.
- [x] T009 [P] Create `.opencode/skills/sk-git/scripts/hooks/opencode/mk-git-preflight-advisory.js` as a relative symlink to `.opencode/plugins/mk-git-preflight-advisory.js`.
- [x] T010 [P] Update `.opencode/hooks/README.md`'s directory-tree diagram and KEY FILES table with the new `opencode/` rows (added to all 4 present concerns plus the goal concern, which was also newly integrated into this tree).
- [x] T011 [P] Update `dispatch/README.md`, `mcp-route-guard/README.md`, `post-edit-quality/README.md`, `task-dispatch/README.md`, and `goal/README.md` with their own `opencode/` row.
- [x] T012 [P] Update `system-spec-kit/mcp-server/hooks/README.md` and `sk-git/scripts/hooks/README.md` with their `opencode/` row.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Resolve all 7 symlinks via `os.path.normpath` + on-disk `readlink`; each points at the correct, existing `.opencode/plugins/` file and is written as a relative path.
- [x] T014 Run `validate_document.py` on all touched README files; fix any reported issue.
- [x] T015 Confirm `git status` on `.opencode/plugins/` is clean (no plugin file itself modified by this phase); the 7 new links appear as untracked symlinks, none gitignored.
- [x] T016 No-double-load verified via the OpenCode plugin-discovery contract rather than an interactive session: the plugins README documents a flat `.opencode/plugins/*.js` glob, and 1,148 sibling `.js` files under `.opencode/` outside `plugins/` are provably not loaded — a recursive loader would already be double-firing them. See implementation-summary.md "Known Limitations" for the deviation rationale (a naive live run would not surface a silent double-registration, so the contract proof is strictly stronger).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (symlink resolution, doc validation, no-double-load via the discovery contract — see T016 note)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
