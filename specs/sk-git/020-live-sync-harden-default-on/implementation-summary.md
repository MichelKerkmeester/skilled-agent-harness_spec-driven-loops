---
title: "Implementation Summary: live-sync hardening and default-on"
description: "Hardened the follower and publish primitive, turned the live-sync loop on by default in the main checkout, added one master disable flag, and documented it for repo users."
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
    recent_action: "Live-sync hardened, default-on, master flag added, docs written, all gates green"
    next_safe_action: "Hand off the packet for operator review and merge"
    blockers: []
    key_files:
      - ".opencode/bin/git-live-follow.sh"
      - ".opencode/bin/git-sync.sh"
      - ".opencode/scripts/git-hooks/pre-push"
      - ".opencode/scripts/git-hooks/post-commit"
      - ".opencode/bin/check-git-hooks.sh"
    session_dedup:
      fingerprint: "sha256:d9a295616de400634ccd007027b34254fbb013e9c8c002ee9cfbd7fcd0e3ab75"
      session_id: "0155-sk-git-live-sync-harden-default-on"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-live-sync-harden-default-on |
| **Completed** | 2026-08-15 |
| **Level** | 2 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The always-current live branch system now works without any setup and cannot silently fall behind. Three script hardening fixes make the follower trustworthy, the publish path safe on every outcome, and the whole loop one flag away from off.

### The follower no longer confuses untracked files with dirty work

`git-live-follow.sh` used `git status --porcelain` to test cleanliness, so a checkout with a build artifact refused every fast-forward and drifted behind silently. The dirty test is now tracked-only (`git diff --quiet` plus `git diff --cached --quiet`), matching the publish primitive. A per-checkout PID lock under the git common dir guarantees one follower per tree, a second start exits cleanly, and a diverged branch prints a loud ahead/behind warning instead of a quiet no-op. A new `--start` mode backgrounds the follower from SessionStart in the main checkout only and prints the live-sync status line.

### The publish primitive asserts, backs off, and logs

`git-sync.sh` now asserts that a conflict abort fully restored the pre-rebase state before reporting pending, so a botched abort is a critical message, never a clean lie. Push-race retries sleep a short jittered backoff so concurrent sessions never retry in lockstep. Every outcome (published, pending, conflict, blocked) appends a timestamped line to a durable log under the git common dir.

### The loop turns on by default and off with one flag

`post-commit` honors the new master flag before publishing. `check-git-hooks.sh` self-heals missing hook symlinks from the main checkout only. All four SessionStart surfaces start the follower. `MK_LIVE_SYNC_DISABLED=1` (or `MK_HOOKS_DISABLED=1`) stops all three legs, while `SPECKIT_AUTOSYNC=0`, `SPECKIT_GIT_HOOKS_GUARD=off`, and `MK_LIVE_FOLLOW_DISABLED=1` keep their narrower scope. A blocked autosync live-branch push now names the mass-deletion ceiling as the cause.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/git-live-follow.sh` | Modified | Tracked-only dirty test, single-instance lock, loud diverged warning, `--start` auto-start mode |
| `.opencode/bin/git-sync.sh` | Modified | Rebase-abort assertion, jittered backoff, durable outcome log |
| `.opencode/scripts/git-hooks/pre-push` | Modified | Distinct mass-deletion message for autosync live-branch pushes |
| `.opencode/scripts/git-hooks/post-commit` | Modified | Master-flag gate on the autosync publish block |
| `.opencode/bin/check-git-hooks.sh` | Modified | Main-checkout-only self-heal auto-install |
| `.opencode/plugins/session-cleanup.js` | Modified | Follower auto-start entry wired beside the guards |
| `.opencode/plugins/tests/session-cleanup.test.cjs` | Modified | Guard-list assertion for the new entry, scoped repair of pre-existing parse errors |
| `.claude/settings.json` | Modified | SessionStart follower auto-start hook |
| `.codex/hooks.json` | Modified | SessionStart follower auto-start hook |
| `system-spec-kit/mcp-server/hooks/pi/session-start-advisories.ts` | Modified | Follower auto-start advisory entry |
| `.opencode/hooks/hook-flags.env.example` | Modified | Rows for the two new flags |
| `.opencode/hooks/README.md` | Modified | Kill-switch index rows |
| `.opencode/hooks/shared/README.md` | Modified | Concern count and advisory count |
| `system-spec-kit/mcp-server/ENV-REFERENCE.md` | Modified | Kill-switch and autosync env rows |
| `README.md` | Modified | Git worktree / continuous-integration section |
| `CLAUDE.md` | Modified | Git Workspace Safety live-sync row |
| `sk-git/references/continuous-integration.md` | Modified | Section 5 default-on and master flag |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every script was edited in place with the existing safety contracts preserved. The follower gained its lock and tracked-only test before the auto-start wiring, so the SessionStart legs run against a hardened poller. The master flag was wired through the shared `hook-flags.sh` resolver, so the three legs honor `MK_HOOKS_DISABLED` and `hook-flags.env` for free. Verification used isolated sandbox repos with the real scripts copied in, the operator's global git config disabled, and the global `core.hooksPath` bypassed, so no sandbox could touch the live hooks dir.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Tracked-only dirty test via `git diff` plus `git diff --cached` | Matches `git-sync.sh`, so untracked scratch never blocks the follower and the two scripts agree |
| Lock file under the git common dir keyed to the checkout git dir | Shared state that never dirties a tree, and distinct worktrees may each follow |
| `--start` computes the linked-worktree gate from absolute git dirs | A relative `--git-dir` string compares falsely against an absolute common dir, which would skip every main checkout |
| Self-heal runs the canonical installer, main checkout only | The installer already resolves the effective hooks path and the linked-worktree check prevents dangling shared symlinks |
| Master flag resolves through `hook_flags` concern `live-sync` | Derives `MK_LIVE_SYNC_DISABLED` and folds under `MK_HOOKS_DISABLED` with zero new resolver code |
| Durable log under the git common dir, append-only | Survives process exit and worktree removal and never dirties a tree |
| Announcement printed by the follower `--start` step | Runs on every SessionStart surface, gated to the main checkout, and goes quiet when the loop is disabled |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash -n` on all five modified shell scripts | PASS, exit 0 on each |
| shellcheck on all five modified shell scripts | PASS, no new findings; one pre-existing SC1083 in pre-push line 221 |
| Before/after follower-fix demonstration | PASS, old porcelain logic refused an untracked-file fast-forward, new tracked-only test allowed it, and the real script pulled the commit |
| Main-checkout gate demonstration | PASS, 21/21 checks: auto-install and follower-start fire only when git-dir equals git-common-dir |
| Master-flag demonstration | PASS, `MK_LIVE_SYNC_DISABLED=1` disables publish, self-heal, and follower-start |
| Publish-primitive functional checks | PASS, 10/10: durable log records published and conflict with timestamps, abort asserted clean, jitter in both retry paths |
| Pre-push mass-deletion distinct message | PASS, 7/7: autosync live-branch push names the ceiling, non-autosync push stays generic, guard unweakened |
| Existing pre-push and mass-deletion suites | PASS, 21/21 and 12/12 |
| Plugin test suite | PASS, 13/13 over three runs after a scoped repair of pre-existing parse errors |
| Runtime config JSON validity | PASS, `.claude/settings.json` and `.codex/hooks.json` parse |
| Packet validation `validate.sh --strict` | PASS on all doc rules, Errors 0; one warning remains, the `CONTINUITY_FRESHNESS` git-state check that requires the packet to be committed, which the no-git constraint forbids |
| Playbook CI scenarios | N/A, the playbook has no live-sync scenarios to run |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **SessionStart announcement is one line per session** - The live-sync status line prints on every main-checkout session start. Disable the loop with `MK_LIVE_SYNC_DISABLED=1` to silence it.
2. **Global `core.hooksPath` routes the self-heal target** - The installer and the guard resolve the effective hooks path through git, so a global override still wins, matching the pre-existing convention.
3. **Pre-existing em-dashes remain in the sk-git reference** - My added text is HVR-clean; the reference file keeps its pre-existing punctuation.
4. **The strict freshness check wants a committed packet** - `validate.sh --strict` reports Errors 0 and one warning, the `CONTINUITY_FRESHNESS` git-state check that requires the packet to be committed. The task forbade git commits, so the warning clears on the operator's commit, not here.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Touch only the named surfaces | Also repaired `.opencode/plugins/tests/session-cleanup.test.cjs` | The SessionStart wiring test could not parse (missing helper body and an orphan spawn arg); the guard-list assertion had to change for the new entry, and a runnable suite was required for verification |

<!-- /ANCHOR:deviations -->
