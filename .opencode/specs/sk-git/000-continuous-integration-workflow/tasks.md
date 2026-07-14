---
title: "Tasks: continuous-integration workflow for sk-git"
description: "Task list for the publish primitive, follower, dashboard, hook + wrapper autosync wiring, cross-runtime guard parity, and sk-git docs."
trigger_phrases:
  - "continuous integration workflow"
  - "always current live branch"
  - "sk-git autosync"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-git/001-continuous-integration-workflow"
    last_updated_at: "2026-07-13T15:45:00Z"
    last_updated_by: "claude"
    recent_action: "Core tasks complete and sandbox-verified; docs task in progress"
    next_safe_action: "Finish the sk-git docs and run validate.sh --strict"
---
# Tasks: continuous-integration workflow for sk-git

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the wrapper, the `post-commit` hook, and the three runtime SessionStart surfaces; confirm safety invariants [40m] [Evidence: read `worktree-session.sh`, `post-commit`, `.claude/settings.json`, `.codex/hooks.json`, and the `session-cleanup.js` plugin]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Core Scripts
- [x] T002 [P] Author the publish primitive (`.opencode/bin/git-sync.sh`) [30m]
- [x] T003 [P] Author the IDE follower (`.opencode/bin/git-live-follow.sh`) [15m]
- [x] T004 [P] Author the status dashboard (`.opencode/bin/worktree-status.sh`) [15m]

### Wiring
- [x] T005 Add the gated, non-fatal autosync block to `.opencode/scripts/git-hooks/post-commit` [15m]
- [x] T006 Resolve the live branch, base the worktree on it, export the autosync env in `.opencode/bin/worktree-session.sh` [15m]
- [x] T007 Add the two SessionStart guards to `.codex/hooks.json` [10m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Unit / Behavioral Tests
- [x] T008 Run the `git-sync.sh` sandbox battery [20m] [Evidence: fake-remote test reported `9 passed, 0 failed` across fast-forward / rebase / conflict-abort / `--auto` / untracked-tolerant]

### Integration Tests
- [x] T009 `bash -n` all scripts + validate `.codex/hooks.json` JSON [5m] [Evidence: all `bash -n` `OK`; JSON valid with `3` SessionStart hooks]

### Manual Verification
- [x] T010 Smoke-run the dashboard, follower, and wrapper dry-run [10m] [Evidence: `worktree-status.sh` rendered the table; `worktree-session.sh --dry-run` showed `base` + `SPECKIT_LIVE_BRANCH` and mutated nothing]

### Documentation
- [x] T011 Author `references/continuous_integration.md`, update SKILL.md + `finish_workflows.md` [30m] [Evidence: `continuous_integration.md` created; SKILL.md ALWAYS rule + lifecycle added; `finish_workflows.md` sync step added]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. [Evidence: `tasks.md` phase sections contain the completed task set]
- [x] No `[B]` blocked tasks remaining. [Evidence: `tasks.md` contains 0 blocked task markers]
- [x] Sandbox battery green and scripts syntax-clean. [Evidence: `9 passed, 0 failed`; `bash -n` `OK` for all]
- [x] Checklist.md fully verified. [Evidence: `checklist.md` Verification Summary records all P0/P1/P2 verified]

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
