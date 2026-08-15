---
title: "Feature Specification: live-sync hardening and default-on for the always-current live branch"
description: "Harden the sk-git always-current live branch system, turn it on by default in the main checkout, add a unified master disable flag, and document the loop for repo users."
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
    recent_action: "All parts implemented and verified; packet closed"
    next_safe_action: "Hand off for operator review and merge"
---
# Feature Specification: live-sync hardening and default-on for the always-current live branch

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-15 |
| **Branch** | `sk-git/0155-live-sync-harden-default-on` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The continuous-integration model built by `007-continuous-integration-workflow` publishes every launch-wrapper session commit to a shared live branch and fast-forwards the IDE checkout to follow it. That model has three gaps. First, `git-live-follow.sh` treats any untracked file as a dirty tree, so in a real checkout with build artifacts it refuses every fast-forward and silently falls behind; the follower also runs with no single-instance guard and goes quiet when the tree diverges. Second, `git-sync.sh` does not assert that a failed rebase fully aborted, retries push races in lockstep with other sessions, and records no durable trace of its outcomes. Third, the whole loop is opt-in: it depends on a manual hook install and a manually backgrounded follower, so a fresh clone silently has no live-sync, and there is no one flag that turns the entire loop off.

### Purpose
Harden the three scripts so the follower never silently falls behind, a botched rebase abort is surfaced instead of reported as clean, push-race retries do not clobber each other, and every sync outcome is durably logged. Then turn the loop on by default, gated to the main checkout only and fully reversible with one master flag `MK_LIVE_SYNC_DISABLED`. Finally document the loop in the top-level user docs so repo users know it is active and how to disable it.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `git-live-follow.sh`: tracked-only dirty test, per-checkout single-follower lock, loud diverged warning naming the drift.
- `git-sync.sh`: rebase-abort assertion, jittered push-race backoff, append-only durable autosync log under the git common dir.
- `pre-push`: distinct mass-deletion message when an autosync live-branch push is blocked, without weakening the guard.
- Default-on wiring: self-heal hook auto-install and follower auto-start, both main-checkout-only, both non-fatal, both reversible.
- One master flag `MK_LIVE_SYNC_DISABLED` honoring the hook kill-switch convention, with per-leg switches kept underneath.
- Repo user documentation in ENV-REFERENCE.md, root README.md, root CLAUDE.md, and the sk-git continuous-integration reference.
- A one-line live-sync announcement at SessionStart in the main checkout.

### Out of Scope
- Any change to `worktree-session.sh`'s `SPECKIT_AUTOSYNC` default or to `post-commit`'s `:-0` primary wall.
- Any weakening of the mass-deletion guard.
- Any change to MCP DB isolation, socket-path handling, or child-detection logic.
- Force-push or history rewriting of the live branch.
- Any change to `.opencode/package.json` or `.opencode/package-lock.json`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/git-live-follow.sh` | Modify | Tracked-only dirty test, single-instance lock, loud diverged warning, `--start` auto-start mode |
| `.opencode/bin/git-sync.sh` | Modify | Rebase-abort assertion, jittered backoff, durable outcome log |
| `.opencode/scripts/git-hooks/pre-push` | Modify | Distinct mass-deletion message for an autosync live-branch push |
| `.opencode/scripts/git-hooks/post-commit` | Modify | Master-flag gate on the autosync publish block |
| `.opencode/bin/check-git-hooks.sh` | Modify | Self-heal auto-install in the main checkout, live-sync announcement |
| `.opencode/plugins/session-cleanup.js` | Modify | Follower auto-start entry wired like check-git-hooks.sh |
| `.claude/settings.json` | Modify | Follower auto-start SessionStart hook |
| `.codex/hooks.json` | Modify | Follower auto-start SessionStart hook |
| `mcp-server/hooks/pi/session-start-advisories.ts` | Modify | Follower auto-start advisory entry |
| `.opencode/hooks/hook-flags.env.example` | Modify | Document the two new flags |
| `.opencode/hooks/README.md` | Modify | Kill-switch index rows for live-sync and live-follow |
| `mcp-server/ENV-REFERENCE.md` | Modify | Hook-kill-switch rows for the new flags and autosync env |
| `README.md` | Modify | Short git worktree / continuous-integration section |
| `CLAUDE.md` | Modify | One Git Workspace Safety row for the live-sync model |
| `sk-git/references/continuous-integration.md` | Modify | Section 5 default-on and master-flag reinforcement |
| `specs/sk-git/020-live-sync-harden-default-on/` | Create | This packet |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `git-live-follow.sh` ignores untracked files when deciding the tree is dirty | A checkout with an untracked build artifact still fast-forwards; a checkout with a tracked modification refuses |
| REQ-002 | Only one follower runs per checkout | A second `--start` finds the live lock and exits cleanly without spawning |
| REQ-003 | A diverged local live branch produces a loud warning naming the ahead/behind drift | Diverged output includes the commit counts and a manual-reconcile pointer |
| REQ-004 | `git-sync.sh` asserts the rebase fully aborted before reporting pending | A failed abort surfaces a critical message instead of a clean pending report |
| REQ-005 | `git-sync.sh` retries push races with a jittered backoff | Retries sleep a short randomized delay instead of looping instantly |
| REQ-006 | `git-sync.sh` appends a timestamped outcome to a git-common-dir-local log | The log records published / pending / conflict / blocked with timestamps |
| REQ-007 | The autosync publish leg honors `MK_LIVE_SYNC_DISABLED` | `MK_LIVE_SYNC_DISABLED=1` stops `post-commit` from calling the publish path |
| REQ-008 | The self-heal auto-install runs only in the main checkout and only when live-sync is enabled | Invalid hook symlinks in the main checkout trigger the installer; a linked worktree only warns |
| REQ-009 | The follower auto-start runs only in the main checkout, at most once, and only when not disabled | `--start` in a linked worktree or with the master flag set is a no-op exit 0 |
| REQ-010 | The mass-deletion guard blocks an autosync live-branch push with a message naming the deletion ceiling | The distinct message appears only for an autosync push to the live branch |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | The master flag folds under `MK_HOOKS_DISABLED` and honors `hook-flags.env` | `MK_HOOKS_DISABLED=1` and a `MK_LIVE_SYNC_DISABLED=1` env line both disable all three legs |
| REQ-012 | Per-leg switches keep working | `SPECKIT_AUTOSYNC=0`, `SPECKIT_GIT_HOOKS_GUARD=off`, `MK_GIT_HOOKS_CHECK_DISABLED`, and `MK_LIVE_FOLLOW_DISABLED` each still gate their leg |
| REQ-013 | The new flags and the autosync env vars appear in the Hook-kill-switches table | ENV-REFERENCE.md carries `MK_LIVE_SYNC_DISABLED`, `MK_LIVE_FOLLOW_DISABLED`, `SPECKIT_AUTOSYNC`, `SPECKIT_LIVE_BRANCH` |
| REQ-014 | The root README, CLAUDE.md, and the sk-git reference document the default-on model and the opt-out | Each doc names `MK_LIVE_SYNC_DISABLED=1` as the whole-loop opt-out |
| REQ-015 | A one-line live-sync announcement prints at SessionStart in the main checkout when active | The line matches the approved text and is non-fatal |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The before/after follower-fix demonstration shows the old untracked-as-dirty behavior refusing a fast-forward and the new tracked-only test allowing it.
- **SC-002**: The main-checkout gate fires auto-install and follower-start only when `--git-dir` equals `--git-common-dir`.
- **SC-003**: `MK_LIVE_SYNC_DISABLED=1` disables the publish leg, the auto-install leg, and the follower-start leg.
- **SC-004**: `bash -n` passes on every modified shell script and shellcheck reports no new findings.
- **SC-005**: The packet passes `validate.sh --strict` with zero errors and zero warnings.

### Acceptance Scenarios

- **Scenario 1**: **Given** a main checkout with an untracked build artifact and pending live commits, **when** the follower runs, **then** it fast-forwards instead of refusing on the untracked file.
- **Scenario 2**: **Given** two SessionStart surfaces on the same checkout, **when** both attempt the follower auto-start, **then** exactly one follower runs.
- **Scenario 3**: **Given** a session whose commit conflicts with the live branch, **when** autosync runs and aborts the rebase, **then** the abort is asserted complete and a conflict outcome is logged.
- **Scenario 4**: **Given** an operator who wants no live-sync, **when** `MK_LIVE_SYNC_DISABLED=1` is set, **then** publishing, auto-install, and follower-start all stop.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The follower auto-starts in a linked worktree | Would fast-forward a session tree out from under it | `--start` refuses unless `--git-dir` equals `--git-common-dir` |
| Risk | The self-heal installs hooks in a linked worktree | Shared symlinks would dangle on worktree removal | The installer's own main-checkout check plus the caller's gate |
| Risk | The master flag is misread as off by default | An operator keeps live-sync running without realizing it | The flag is absent-by-default ON; docs and the SessionStart announcement state it plainly |
| Risk | The rebase-abort assertion false-positives | A clean abort reported as a failure | The assertion checks for rebase state dirs and tracked cleanliness only, mirroring the abort's own contract |
| Dependency | `install-git-hooks.sh` | Self-heal installs via the canonical installer | Present at `.opencode/scripts/install-git-hooks.sh` |
| Dependency | `hook-flags.sh` resolver | The master and per-leg flags resolve through it | Present at `.opencode/hooks/shared/hook-flags.sh`; fail-open when absent |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The follower auto-start adds one fast gate check plus one `git fetch` per poll; the announcement adds a single line per session start.

### Security
- **NFR-S01**: No credentials are handled; the autosync log records branch names and outcomes only, never secrets.

### Reliability
- **NFR-R01**: Every new leg is non-fatal exit 0; a failing self-heal or follower start never blocks a session.
- **NFR-R02**: The autosync log is append-only under the git common dir, so it never dirties a tree and survives worktree removal.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- The main checkout on a detached HEAD yields no live branch: the follower `--start` and the publish leg both skip quietly.
- A worktree without a live remote-tracking ref: the follower waits silently rather than refusing.

### Error Scenarios
- A stale lock file from a killed follower is treated as dead (PID liveness checked) and replaced.
- A rebase abort that leaves rebase state behind surfaces a critical manual-resolution message instead of a clean pending report.

### Concurrent Operations
- Multiple sessions publishing to the live branch keep the jittered backoff; the follower single-instance lock is per checkout, so distinct worktrees may each follow.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Five scripts, one plugin, two runtime configs, one TS advisory, five doc surfaces |
| Risk | 14/25 | Behavior-affecting git automation; gated tight and fully reversible via one flag |
| Research | 10/20 | Mapped the follower, sync primitive, hooks, all SessionStart surfaces, and the flag resolver before changing |
| **Total** | **39/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None blocking. The hardening scope, the default-on direction, and the master-flag naming are operator-selected.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:related-docs -->
