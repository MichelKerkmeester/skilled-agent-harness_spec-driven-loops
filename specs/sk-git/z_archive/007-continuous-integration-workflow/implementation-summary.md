---
title: "Implementation Summary: continuous-integration workflow for sk-git"
description: "Level 2 implementation summary — sk-git now has a trunk-following continuous-integration workflow: launch-wrapper sessions autosync each commit to a shared live branch through a safe fetch → FF-or-rebase-abort → non-force-push primitive, the IDE fast-forward-follows it, and the two SessionStart guards are wired for all three runtimes."
trigger_phrases:
  - "continuous integration workflow"
  - "always current live branch"
  - "sk-git autosync"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-git/007-continuous-integration-workflow"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "Continuous-integration workflow implemented, sandbox-verified, and documented"
    next_safe_action: "Run validate.sh --strict; commit per-piece; hand off for operator review/merge"
    completion_pct: 100
---
# Implementation Summary: continuous-integration workflow for sk-git

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-continuous-integration-workflow |
| **Completed** | 2026-07-13 |
| **Level** | 2 |
| **Actual Effort** | ~155 minutes (estimated: 155 minutes) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

A trunk-following continuous-integration workflow so the operator's IDE checkout always reflects every concurrent AI session's committed work. Sessions keep their isolated worktree + MCP databases (safe writes unchanged) but publish each commit to one shared **live** branch through a safe primitive; the IDE checkout fast-forward-follows that branch. The publish path fires identically for `claude`, `codex`, and `opencode`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/git-sync.sh` | Created | Publish primitive: `fetch → fast-forward-or-rebase-abort → non-force push`; non-fatal `--auto` mode |
| `.opencode/bin/git-live-follow.sh` | Created | IDE-side fast-forward-only, skip-when-dirty follower of the live branch |
| `.opencode/bin/worktree-status.sh` | Created | Per-worktree branch / ahead / behind / dirty dashboard against the live branch |
| `.opencode/scripts/git-hooks/post-commit` | Modified | Env-gated, linked-worktree-only, non-fatal autosync block calling `git-sync.sh --auto` |
| `.opencode/bin/worktree-session.sh` | Modified | Resolve the live branch, base the session worktree on it, export `SPECKIT_LIVE_BRANCH` + `SPECKIT_AUTOSYNC` |
| `.codex/hooks.json` | Modified | Added the two SessionStart guards Claude/OpenCode already run |
| `.opencode/skills/sk-git/SKILL.md` | Modified | Continuous-integration lifecycle note + an ALWAYS rule |
| `.opencode/skills/sk-git/references/continuous_integration.md` | Created | The model, scripts, safety contract, and opt-out |
| `.opencode/skills/sk-git/references/finish_workflows.md` | Modified | A publish-to-live sync step |

### Files Deliberately Unchanged

| File set | Reason |
|----------|--------|
| `.opencode/plugins/session-cleanup.js` (OpenCode) | It already runs `worktree-guard.sh` + `check-git-hooks.sh` on `session.created`; wiring it again would double-fire the guards |
| `worktree-session.sh` DB-isolation / socket / child-detection logic | Out of scope; autosync is additive and must not touch isolation |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A read-first pass mapped the launch wrapper, the `post-commit` hook, and all three runtime SessionStart surfaces, and confirmed the safety invariants (no force-push, abort-on-conflict, non-fatal, tracked-only dirty check). The three scripts were authored, then the autosync was wired into the hook and the wrapper behind a triple gate. Cross-runtime parity turned out to need only the Codex hooks — verifying rather than assuming revealed OpenCode already runs both guards via its `session-cleanup.js` plugin. The publish primitive was then proven against a fake local remote across every path before any completion claim.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep per-session worktree isolation; publish at commit granularity | Concurrent uncommitted writers on one tree corrupt each other; commit-granularity is the safe maximum visibility |
| Triple-gate autosync (env + linked worktree) | Guarantees only wrapper-launched sessions publish; the primary checkout and manual commits never autosync |
| Rebase-then-publish, abort on conflict, never force-push | Integrates concurrent work without ever clobbering another session's published commits or stranding local work |
| Tracked-only dirty check for the rebase | A session almost always has untracked scratch files; those must not block publishing |
| Fix Codex only for cross-runtime parity | Claude (settings.json) and OpenCode (session-cleanup.js) already run both guards; only Codex lacked them |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Behavioral (sandbox) | Pass | `git-sync.sh` publish paths | Fake-remote battery: `9 passed, 0 failed` |
| Syntax | Pass | All new + edited scripts | `bash -n` `OK` for all five |
| Config validity | Pass | `.codex/hooks.json` | Valid JSON; `3` SessionStart hooks |
| Smoke (read-only) | Pass | dashboard, follower, wrapper dry-run | Rendered/executed with no mutation |

### Test Coverage Summary

| File | Statements | Branches | Functions |
|------|------------|----------|-----------|
| `git-sync.sh` | Fast-forward / rebase / conflict-abort / `--auto` / untracked paths exercised | Divergence + dirty + conflict branches exercised | Publish loop covered by the sandbox battery |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | One fetch + at most one push per commit; rebase only on divergence | Matches the `git-sync.sh` loop | Pass |
| NFR-S01 | No credentials handled; no authority widened | Non-force push on the existing remote config | Pass |
| NFR-R01 | Every failure mode non-destructive | Conflict-abort restores exact state; commit stays local | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Visibility is at commit granularity — the operator sees another session's work seconds after it commits, never its un-committed editor buffer. Real-time sub-commit sharing was explicitly out of scope (it would reintroduce concurrent-writer corruption).
2. Autosync only fires when the git hooks are installed (`install-git-hooks.sh`); `check-git-hooks.sh` warns at SessionStart when they are missing, but does not install them.
3. `worktree-status.sh` renders external session worktrees (outside the repo root) with a truncated absolute path; in-repo worktrees show a clean repo-relative path.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Wire the guard into Codex AND OpenCode SessionStart | Wired Codex only | Verifying the surfaces showed OpenCode already runs both guards via `session-cleanup.js`; re-wiring would double-fire |
| Initial `git-sync.sh` used `git status --porcelain` for the dirty check | Switched to a tracked-only `git diff` check | The sandbox battery proved untracked scratch files would otherwise wrongly block the common rebase-publish path |

<!-- /ANCHOR:deviations -->
