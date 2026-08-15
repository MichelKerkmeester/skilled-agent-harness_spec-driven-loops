---
title: "Implementation Plan: live-sync hardening and default-on"
description: "Harden the follower and the publish primitive, wire the loop on by default in the main checkout, add a master disable flag, and document it for repo users."
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
    recent_action: "All phases implemented and verified"
    next_safe_action: "Packet closed; hand off for operator review"
---
# Implementation Plan: live-sync hardening and default-on

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | POSIX-ish Bash scripts + a git pre-push / post-commit hook + an OpenCode plugin + JSON + TS runtime config |
| **Framework** | sk-git skill; the versioned git hooks; the shared hook-flags kill-switch resolver |
| **Storage** | `.opencode/bin/`, `.opencode/scripts/git-hooks/`, `.opencode/plugins/`, runtime SessionStart configs |
| **Testing** | `bash -n`, shellcheck, a before/after follower-fix demonstration, main-checkout gate checks, master-flag checks, `validate.sh --strict` |

### Overview
Three script hardening changes make the existing loop trustworthy. Then the loop turns on by default, gated to the main checkout so it never runs inside a session worktree. One master flag `MK_LIVE_SYNC_DISABLED` disables the whole loop, and the finer per-leg switches keep working underneath. The SessionStart surfaces that already run `check-git-hooks.sh` also gain a follower auto-start step, and the docs describe the default-on model and the opt-out.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The follower, the publish primitive, the hooks, and all four SessionStart surfaces read directly before change.
- [x] The hook-flags resolver contract confirmed so the master flag derives the canonical concern flag.
- [x] The pre-push mass-deletion guard contract confirmed so the distinct message composes without weakening it.

### Definition of Done
- [x] Every modified shell script passes `bash -n`; shellcheck reports no new findings.
- [x] The before/after follower demonstration shows the tracked-only test allowing an untracked-file fast-forward.
- [x] The main-checkout gate and the master-flag checks are demonstrated from a real shell.
- [x] `validate.sh --strict` passes on this packet.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Harden-first, then default-on, then document. The three scripts keep their existing safety contracts and gain targeted robustness. The default-on wiring is a set of main-checkout-only, non-fatal SessionStart steps that reuse the existing installer and the existing follower, so no new automation engine is introduced. A single master flag sits in the shared kill-switch resolver and is consulted by all three legs.

### Key Components
- **`git-live-follow.sh`** — tracked-only dirty test replaces the porcelain check; a per-checkout PID lock under the git common dir guarantees one follower; a diverged tree prints a loud ahead/behind warning. A new `--start` mode gates on main checkout and live-sync enabled, backgrounds the poller once, and prints the announcement.
- **`git-sync.sh`** — after a rebase abort, assert no rebase state remains and the tree is clean; retry push races with a jittered backoff; append every outcome to a git-common-dir-local log.
- **`pre-push`** — when Gate 0 blocks an autosync push to the live branch, append a distinct message naming the deletion ceiling.
- **`post-commit`** — gate the autosync publish block on `hook_enabled live-sync`.
- **`check-git-hooks.sh`** — when invalid hook symlinks exist, auto-run the installer only in the main checkout and only when live-sync is enabled.
- **SessionStart surfaces** — `.opencode/plugins/session-cleanup.js`, `.claude/settings.json`, `.codex/hooks.json`, and the pi advisory chain each gain a follower `--start` step beside the existing check-git-hooks step.
- **Docs** — ENV-REFERENCE.md kill-switch rows, root README and CLAUDE.md sections, and the sk-git continuous-integration reference.

### Data Flow
SessionStart in the main checkout runs the hook guard (with self-heal) and the follower `--start` step, which prints the announcement and backgrounds the poller once. A session commit triggers `post-commit`, which checks the master flag and then calls the publish primitive; every outcome is logged under the git common dir. The poller fast-forwards the IDE checkout on clean, tracked-only trees only.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the follower, the publish primitive, the hooks, the installer, the flag resolver, and all four SessionStart surfaces.

### Phase 2: Core Implementation
- [x] Harden `git-live-follow.sh`: tracked-only dirty test, lock, loud diverged warning, `--start` mode.
- [x] Harden `git-sync.sh`: abort assertion, jittered backoff, durable outcome log.
- [x] Add the distinct pre-push mass-deletion message for autosync live-branch pushes.
- [x] Gate the `post-commit` publish block on the master flag.
- [x] Add the self-heal auto-install to `check-git-hooks.sh`.
- [x] Wire the follower `--start` into all four SessionStart surfaces.

### Phase 3: Verification
- [x] `bash -n` + shellcheck every script; demonstrate the before/after follower fix; verify the main-checkout gate and the master flag; run any playbook CI scenarios; `validate.sh --strict`.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | All modified shell scripts | `bash -n`, shellcheck |
| Behavioral (before/after) | Follower dirty test | A sandbox checkout with an untracked file and a tracked edit |
| Behavioral (gates) | Main-checkout gate and master flag | Direct invocation with crafted env |
| Config validity | `.codex/hooks.json`, `.claude/settings.json` | JSON parse |
| Spec validation | This packet | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `install-git-hooks.sh` | Internal | Green | The self-heal leg cannot install |
| `hook-flags.sh` resolver | Internal | Green | The master and per-leg flags cannot resolve |
| `install-git-hooks.sh` main-checkout check | Internal | Green | Double safety on the self-heal leg |
| The three existing runtime SessionStart surfaces | Internal | Green | The follower auto-start cannot be wired |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Live-sync misbehaves or the operator wants the old opt-in behavior back.
- **Procedure**: Set `MK_LIVE_SYNC_DISABLED=1` to stop all three legs with no code change. Per-leg rollback is `SPECKIT_AUTOSYNC=0`, `SPECKIT_GIT_HOOKS_GUARD=off`, or `MK_LIVE_FOLLOW_DISABLED=1`. The script and wiring edits are each a `git checkout` of the file.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Core Implementation | Medium | 90 minutes |
| Verification | Medium | 60 minutes |
| **Total** | | **170 minutes** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirmed the follower and the auto-install both gate on git-dir equal to git-common-dir.
- [x] Confirmed the master flag disables all three legs and folds under `MK_HOOKS_DISABLED`.

### Rollback Procedure
1. Set `MK_LIVE_SYNC_DISABLED=1` for the whole loop, or the per-leg switch for one leg.
2. To revert code, `git checkout` the modified scripts, configs, and docs.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — the autosync log is additive and harmless to remove; nothing rewrites history.

<!-- /ANCHOR:enhanced-rollback -->
