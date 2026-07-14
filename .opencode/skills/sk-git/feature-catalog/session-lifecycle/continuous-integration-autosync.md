---
title: "Continuous integration autosync"
description: "Always-current live branch model that keeps every concurrent AI session's committed work visible in the operator's IDE within seconds, without giving up per-session isolation."
trigger_phrases:
  - "continuous integration autosync"
  - "always-current live branch"
  - "git-sync.sh"
  - "autosync commits to live branch"
version: 1.0.0.0
---

# Continuous integration autosync (git-sync.sh / post-commit hook)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Launch-wrapper isolation keeps concurrent sessions safe, but it also hides each session's work from the operator's IDE, which stays open on the primary checkout. Continuous-integration autosync resolves that tension without reintroducing shared-tree corruption: sessions keep isolated worktrees for writes, and publish committed work to one shared **live branch** — whatever branch the primary checkout is on — that the IDE follows.

Visibility is deliberately at commit granularity only: the operator sees another session's work seconds after it commits, never its un-committed editor buffer. Real-time sub-commit sharing is out of scope by design, since it would require a shared filesystem and reintroduce the exact concurrent-writer corruption this model avoids.

---

## 2. HOW IT WORKS

### The Publish Primitive

`git-sync.sh` resolves the live branch and a remote, refuses to publish when the current branch already is the live branch, then: fetches the live branch; does nothing if HEAD is already contained in the live tip; fast-forward-publishes (`git push origin HEAD:<live>`) if the live tip is an ancestor of HEAD; otherwise rebases the session's own commits onto the moved live branch before publishing, and only when the tracked working tree is clean (untracked scratch files never block it). Any rebase conflict triggers `git rebase --abort`, restoring the exact pre-sync state, with a printed manual-resolution path — the commit stays local and unpublished rather than half-applying.

### Autosync Wiring

The `post-commit` git hook calls `git-sync.sh --auto` after every commit, gated behind a triple check so it fires only for a launch-wrapper session in a linked worktree, never for the primary checkout or a manual commit outside the wrapper: `SPECKIT_AUTOSYNC=1` and `SPECKIT_LIVE_BRANCH` must both be present (only the launch wrapper exports both), the commit must have happened inside a linked worktree, and the call itself is fully non-fatal so a blocked publish never fails the triggering commit.

### The IDE Follower and Dashboard

`git-live-follow.sh` polls the live branch from the primary checkout and fast-forwards it only when the local tip is an ancestor of the remote tip and the working tree is clean; a diverged branch or a dirty tree is reported, never overwritten, so an in-progress IDE edit is never clobbered by an incoming commit. `worktree-status.sh` is a read-only dashboard printing each worktree's branch, ahead/behind state versus the live branch, and uncommitted file count — "ahead + dirty" is exactly the work not yet visible in the IDE.

### Safety Contract

No session can clobber another's published work, because publication is non-force and a moved live branch is always rebased onto rather than overwritten. A conflicting commit never half-applies, because any rebase conflict aborts cleanly. Autosync itself never breaks a commit, because `--auto` returns 0 on every path and the hook is non-fatal. The primary checkout never autosyncs, because the triple gate is satisfied only by wrapper-launched sessions in a linked worktree. Un-committed work is never touched, because the publish path only ever moves committed refs and the follower is fast-forward-only.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/bin/git-sync.sh` | Script | Publish primitive: fetch, fast-forward-or-rebase, non-force push |
| `.opencode/bin/git-live-follow.sh` | Script | Fast-forward-only IDE follower for the live branch |
| `.opencode/bin/worktree-status.sh` | Script | Read-only ahead/behind/dirty dashboard across worktrees |
| `.opencode/scripts/git-hooks/post-commit` | Script | Fires `git-sync.sh --auto` behind the triple wrapper/worktree/env gate |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/scripts/git-hooks/tests/install-git-hooks-worktree-harness.sh` | Automated test | Verifies hook installation reaches a linked worktree's resolved hook path (installation only; does not exercise the autosync publish/rebase logic itself) |

---

## 4. SOURCE METADATA

- Group: Session Lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `session_lifecycle/continuous_integration_autosync.md`

Related references:
- [launch_wrapper_session_isolation.md](launch-wrapper-session-isolation.md) — Launch-wrapper session isolation
- [worktree_reaper.md](worktree-reaper.md) — Worktree reaper
