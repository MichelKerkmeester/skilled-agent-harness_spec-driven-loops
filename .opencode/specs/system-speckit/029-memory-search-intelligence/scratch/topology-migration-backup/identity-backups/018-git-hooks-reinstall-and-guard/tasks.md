---
title: "Tasks: Git Hooks Reinstall and Presence Guard"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "git hooks reinstall tasks"
  - "check-git-hooks guard task"
  - "SessionStart wiring task"
  - "worktree hooks verification task"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/018-git-hooks-reinstall-and-guard"
    last_updated_at: "2026-07-09T20:22:52Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed all 14 tasks, verified via scratch-repo hook tests"
    next_safe_action: "None -- packet complete"
    blockers: []
    key_files:
      - ".opencode/scripts/install-git-hooks.sh"
      - ".opencode/bin/check-git-hooks.sh"
      - ".claude/settings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-018-git-hooks-reinstall-and-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Git Hooks Reinstall and Presence Guard

<!-- SPECKIT_LEVEL: 1 -->

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

_Re-verify the spec-time findings immediately before editing, per repo convention._

- [x] T001 Re-read `ls -la .git/hooks/` and confirm the two-hooks-missing state still holds (no other session already fixed it) (.git/hooks/)
- [x] T002 [P] Re-read `install-git-hooks.sh` end to end to confirm its symlink/skip-on-non-symlink behavior before relying on it (.opencode/scripts/install-git-hooks.sh)
- [x] T003 [P] Re-read `worktree-guard.sh` end to end as the structural template for T006 (.opencode/bin/worktree-guard.sh)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

_REQ-001 (T004-T005) is unconditional and can land immediately. REQ-002 (T006-T009) builds on
T003's template. REQ-003 (T010-T011) closes out the worktree-coverage claim._

- [x] T004 Run `bash .opencode/scripts/install-git-hooks.sh` from the repo root (.opencode/scripts/install-git-hooks.sh)
- [x] T005 Confirm `.git/hooks/post-merge` and `.git/hooks/post-rewrite` now exist as symlinks alongside the existing `pre-commit`/`post-commit` pair (.git/hooks/)
- [x] T006 Author `.opencode/bin/check-git-hooks.sh`: env-var early-exit, resolve expected hook set from `.opencode/scripts/git-hooks/` (excluding `lib/`, `README.md`), stat each `.git/hooks/<name>` for symlink-ness, one warning line per missing/broken entry, always `exit 0` (.opencode/bin/check-git-hooks.sh)
- [x] T007 Add the new script as a third `SessionStart` hook command in `.claude/settings.json`, matching the existing entries' timeout convention (.claude/settings.json)
- [x] T008 Test: delete one hook symlink, confirm exactly one warning line naming that hook (`[check-git-hooks] Missing git hook symlink(s): post-merge...`); restore it, confirm no warning (.opencode/bin/check-git-hooks.sh)
- [x] T009 Test: set `SPECKIT_GIT_HOOKS_GUARD=off` with a hook deliberately missing, start a new session, confirm no warning (.opencode/bin/check-git-hooks.sh)
- [x] T010 From inside a real `.worktrees/*` checkout, re-run `git -C .worktrees/<any>/ rev-parse --git-path hooks` and confirm it resolves to this checkout's shared `.git/hooks` (.worktrees/)
- [x] T011 [P] Optionally append a one-line worktree-sharing note to `install-git-hooks.sh`'s success-message output (.opencode/scripts/install-git-hooks.sh)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Smoke-test the drift-marker hooks actually fire post-install: `git commit --allow-empty -m "hook smoke"` runs silently; a scripted merge/rebase produces the same marker signal a commit already does (.opencode/scripts/git-hooks/lib/memory-drift-marker.sh)
- [x] T013 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/029-memory-search-intelligence/018-git-hooks-reinstall-and-guard --strict` and resolve any findings
- [x] T014 Update `implementation-summary.md` with REQ-001/002/003's results, the T010 worktree re-verification quote, and known limitations
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (symlinks, guard delete/restart test, silence flag, real merge/rebase marker write)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
