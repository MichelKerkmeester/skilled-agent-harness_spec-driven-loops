---
title: "Tasks: live-sync hardening and default-on"
description: "Task list for the follower and sync-primitive hardening, the default-on wiring, the master flag, the docs, and the verification."
trigger_phrases:
  - "live sync harden"
  - "live branch default on"
  - "MK_LIVE_SYNC_DISABLED"
  - "autosync self heal"
  - "follower auto start"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-git/020-live-sync-harden-default-on"
    last_updated_at: "2026-08-15T13:07:22Z"
    last_updated_by: "opencode"
    recent_action: "All implementation and verification tasks complete"
    next_safe_action: "Packet closed; hand off for operator review"
---
# Tasks: live-sync hardening and default-on

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

- [x] T001 Read the follower, the publish primitive, the hooks, the installer, the flag resolver, and all four SessionStart surfaces [20m] [Evidence: read `git-live-follow.sh`, `git-sync.sh`, `worktree-status.sh`, `check-git-hooks.sh`, `post-commit`, `pre-push`, `install-git-hooks.sh`, `hook-flags.{sh,cjs,mjs,ts}`, `session-cleanup.js`, `.claude/settings.json`, `.codex/hooks.json`, `session-start-advisories.ts`]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Follower Hardening
- [x] T002 Tracked-only dirty test in the follower (`.opencode/bin/git-live-follow.sh`) [15m]
- [x] T003 Per-checkout single-instance PID lock (`.opencode/bin/git-live-follow.sh`) [15m]
- [x] T004 Loud diverged warning naming ahead/behind (`.opencode/bin/git-live-follow.sh`) [10m]
- [x] T005 `--start` auto-start mode with main-checkout gate and announcement (`.opencode/bin/git-live-follow.sh`) [20m]

### Publish Primitive Hardening
- [x] T006 Rebase-abort assertion before pending report (`.opencode/bin/git-sync.sh`) [15m]
- [x] T007 Jittered push-race backoff (`.opencode/bin/git-sync.sh`) [10m]
- [x] T008 Append-only durable outcome log under the git common dir (`.opencode/bin/git-sync.sh`) [20m]

### Hook Changes
- [x] T009 Distinct mass-deletion message for autosync live-branch pushes (`.opencode/scripts/git-hooks/pre-push`) [10m]
- [x] T010 Master-flag gate on the publish block (`.opencode/scripts/git-hooks/post-commit`) [10m]
- [x] T011 Self-heal auto-install gated to the main checkout (`.opencode/bin/check-git-hooks.sh`) [15m]

### SessionStart Wiring
- [x] T012 Follower auto-start in the OpenCode plugin (`.opencode/plugins/session-cleanup.js`) [15m]
- [x] T013 Follower auto-start SessionStart hook (`.claude/settings.json`) [10m]
- [x] T014 Follower auto-start SessionStart hook (`.codex/hooks.json`) [10m]
- [x] T015 Follower auto-start advisory entry (`session-start-advisories.ts`) [10m]

### Flag Surface
- [x] T016 Document the two new flags in the env example (`.opencode/hooks/hook-flags.env.example`) [10m]
- [x] T017 Kill-switch index rows (`.opencode/hooks/README.md`) [10m]

### Documentation
- [x] T018 Hook-kill-switch rows and autosync env (`.opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md`) [20m]
- [x] T019 Git worktree / continuous-integration section (`README.md`) [20m]
- [x] T020 Git Workspace Safety row (`CLAUDE.md`) [10m]
- [x] T021 Section 5 default-on and master-flag reinforcement (`sk-git/references/continuous-integration.md`) [20m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Unit / Behavioral Tests
- [x] T022 `bash -n` every modified script [10m] [Evidence: all exit 0]
- [x] T023 shellcheck on every modified script [15m] [Evidence: no new findings]
- [x] T024 Before/after follower-fix demonstration [20m] [Evidence: old `git status --porcelain` test refuses, new tracked-only `git diff --quiet` test allows]
- [x] T025 Main-checkout gate demonstration [15m] [Evidence: auto-install and follower-start fire only when `git rev-parse --git-dir` equals `--git-common-dir`]
- [x] T026 Master-flag demonstration [15m] [Evidence: `MK_LIVE_SYNC_DISABLED=1` disables all three legs]
- [x] T027 JSON validity of the edited runtime configs [5m] [Evidence: `json.load` parse succeeds]

### Spec Validation
- [x] T028 `validate.sh --strict` on the packet [10m] [Evidence: Errors 0; one git-state freshness warning that clears on commit, forbidden by the no-git constraint]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. [Evidence: `tasks.md` phase sections contain the completed task set]
- [x] No `[B]` blocked tasks remaining. [Evidence: `tasks.md` contains 0 blocked task markers]
- [x] Syntax and shellcheck clean on every modified script. [Evidence: T022, T023]
- [x] Checklist.md fully verified. [Evidence: `checklist.md` Verification Summary records all P0/P1/P2 verified]

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
