---
title: "Verification Checklist: live-sync hardening and default-on"
description: "Level 2 checklist with script-hardening, default-on, master-flag, and no-regression evidence."
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
    recent_action: "All checklist items verified with evidence"
    next_safe_action: "Packet closed; hand off for operator review"
---
# Verification Checklist: live-sync hardening and default-on

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md]
  - **Evidence**: `spec.md` REQ-001 through REQ-015 define the hardening, default-on, and master-flag requirements.
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md]
  - **Evidence**: `plan.md` architecture describes the tracked-only dirty test, the lock, the abort assertion, the durable log, and the main-checkout-gated default-on wiring.
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: plan.md dependencies]
  - **Evidence**: `install-git-hooks.sh` and the `hook-flags.sh` resolver are listed as green internal dependencies.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The follower dirty test is tracked-only [EVIDENCE: git-live-follow.sh]
  - **Evidence**: the follower gates on `git diff --quiet` and `git diff --cached --quiet`, matching the publish primitive.
- [x] CHK-011 [P0] One follower per checkout [EVIDENCE: `git-live-follow.sh` PID lock]
  - **Evidence**: a PID lock under the git common dir is keyed to the checkout and a live lock makes a second start exit cleanly.
- [x] CHK-012 [P0] A diverged tree warns loudly with the drift [EVIDENCE: `git-live-follow.sh` diverged warning]
  - **Evidence**: the diverged branch prints ahead/behind counts and a manual-reconcile pointer.
- [x] CHK-013 [P0] The rebase abort is asserted complete before reporting pending [EVIDENCE: `git-sync.sh` abort assert]
  - **Evidence**: the sync primitive checks for residual rebase state and a clean tree after abort, and surfaces a failed abort.
- [x] CHK-014 [P0] Push-race retries back off with jitter [EVIDENCE: `git-sync.sh` jittered backoff]
  - **Evidence**: the retry path sleeps a short randomized delay before continuing.
- [x] CHK-015 [P0] Every sync outcome is durably logged [EVIDENCE: `git-sync.sh` durable log]
  - **Evidence**: an append-only log under the git common dir records published / pending / conflict / blocked with timestamps.
- [x] CHK-016 [P1] Comment hygiene preserved, no artifact ids in code comments [EVIDENCE: durable-why comments, `bash -n` clean]
  - **Evidence**: all new comments state the durable reason and reference no spec path or task id.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:default-on -->
## Default-On and Master Flag

- [x] CHK-020 [P0] The master flag disables the publish leg [EVIDENCE: post-commit]
  - **Evidence**: `MK_LIVE_SYNC_DISABLED=1` stops the post-commit block from calling the publish path.
- [x] CHK-021 [P0] The master flag disables the self-heal leg [EVIDENCE: `check-git-hooks.sh` live-sync gate]
  - **Evidence**: the auto-install runs only when live-sync is enabled; the flag skips it while the guard still warns.
- [x] CHK-022 [P0] The master flag disables the follower auto-start [EVIDENCE: git-live-follow.sh --start]
  - **Evidence**: `--start` is a no-op exit 0 when the master flag or `MK_LIVE_FOLLOW_DISABLED` is set.
- [x] CHK-023 [P0] The self-heal and follower-start fire only in the main checkout [EVIDENCE: git-dir equals git-common-dir gate]
  - **Evidence**: both legs refuse when `git rev-parse --git-dir` differs from `--git-common-dir`.
- [x] CHK-024 [P0] The master flag folds under `MK_HOOKS_DISABLED` and honors `hook-flags.env` [EVIDENCE: hook-flags.sh]
  - **Evidence**: the master check resolves through the shared resolver, which honors the master switch and the env file.
- [x] CHK-025 [P1] Per-leg switches keep working underneath [EVIDENCE: script gates]
  - **Evidence**: `SPECKIT_AUTOSYNC=0`, `SPECKIT_GIT_HOOKS_GUARD=off`, `MK_GIT_HOOKS_CHECK_DISABLED`, and `MK_LIVE_FOLLOW_DISABLED` each still gate their own leg.
- [x] CHK-026 [P1] The wrapper autosync default and the post-commit primary wall are unchanged [EVIDENCE: worktree-session.sh, post-commit]
  - **Evidence**: `SPECKIT_AUTOSYNC:-1` in the wrapper and the `:-0` primary wall in post-commit are untouched.

<!-- /ANCHOR:default-on -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-030 [P0] All modified scripts are syntax-clean [EVIDENCE: bash -n]
  - **Evidence**: `bash -n` exits 0 for every modified shell script.
- [x] CHK-031 [P0] shellcheck reports no new findings [EVIDENCE: shellcheck]
  - **Evidence**: shellcheck output contains no new error or warning for the modified scripts.
- [x] CHK-032 [P0] The before/after follower-fix demonstration is captured [EVIDENCE: `git status --porcelain` vs tracked-only demo]
  - **Evidence**: the old porcelain logic treats an untracked file as dirty and refuses the fast-forward; the new tracked-only test allows it.
- [x] CHK-033 [P0] The main-checkout gate is demonstrated [EVIDENCE: `git rev-parse --git-dir` equals `--git-common-dir` gate]
  - **Evidence**: auto-install and follower-start fire only when git-dir equals git-common-dir.
- [x] CHK-034 [P0] The master-flag disable is demonstrated for all three legs [EVIDENCE: flag output]
  - **Evidence**: `MK_LIVE_SYNC_DISABLED=1` disables publish, auto-install, and follower-start.
- [x] CHK-035 [P1] The edited runtime configs stay valid JSON [EVIDENCE: json parse]
  - **Evidence**: `.claude/settings.json` and `.codex/hooks.json` parse after the edits.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-036 [P0] The hardening and default-on change is complete across all three legs [EVIDENCE: `post-commit`, `check-git-hooks.sh`, `git-live-follow.sh --start`]
  - **Evidence**: publish, self-heal, and follower-start all ship in this change and all honor the master flag.
- [x] CHK-037 [P1] The pre-existing broken wiring test file is repaired so the suite runs [EVIDENCE: `session-cleanup.test.cjs`, `node --test` 13/13]
  - **Evidence**: the guard-list assertion now covers the new entry and the suite passes over repeated runs.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No secrets in changed files [EVIDENCE: diff review]
  - **Evidence**: the durable log records branch names and outcomes only; no credentials are handled.
- [x] CHK-041 [P1] The mass-deletion guard is not weakened [EVIDENCE: `pre-push` Gate 0 unweakened]
  - **Evidence**: the distinct autosync message only explains the existing block; the guard verdict logic is unchanged.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] The new flags appear in the Hook-kill-switches table [EVIDENCE: ENV-REFERENCE.md]
  - **Evidence**: rows for `MK_LIVE_SYNC_DISABLED` and `MK_LIVE_FOLLOW_DISABLED` exist, plus `SPECKIT_AUTOSYNC` and `SPECKIT_LIVE_BRANCH`.
- [x] CHK-051 [P1] The root README and CLAUDE.md document the default-on model [EVIDENCE: README.md, CLAUDE.md]
  - **Evidence**: both name `MK_LIVE_SYNC_DISABLED=1` as the whole-loop opt-out.
- [x] CHK-052 [P1] The sk-git reference reinforces default-on and the master flag [EVIDENCE: `continuous-integration.md` section 5]
  - **Evidence**: section 5 states the auto-install and auto-follow defaults and the master flag.
- [x] CHK-053 [P1] The SessionStart announcement is wired and non-fatal [EVIDENCE: `git-live-follow.sh --start`]
  - **Evidence**: the announcement prints in the main checkout when live-sync is active and never fails a session.
- [x] CHK-054 [P2] Edited docs avoid em-dashes and semicolons in new text [EVIDENCE: review]
  - **Evidence**: new prose uses plain punctuation.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] No temp files committed [EVIDENCE: `git status --porcelain` sandbox outside repo]
  - **Evidence**: the sandbox demonstration lives in a temp dir outside the packet and the repo.
- [x] CHK-061 [P1] Scripts stay in their canonical locations [EVIDENCE: paths]
  - **Evidence**: all edits target existing canonical files under `.opencode/bin/`, `.opencode/scripts/`, and the named docs.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 20 | 20/20 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-15
**Verified By**: OpenCode (syntax + shellcheck + behavioral demonstrations + gate checks)

<!-- /ANCHOR:summary -->
