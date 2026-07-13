---
title: Continuous Integration - Always-Current Live Branch
description: How every concurrent AI session's committed work stays visible in one live branch that the operator's IDE follows, without giving up per-session worktree isolation.
trigger_phrases:
  - "always see what is currently active"
  - "all ai sessions on the same branch"
  - "continuous integration workflow"
  - "always current live branch"
  - "autosync commits to live branch"
  - "ide always shows current work"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Continuous Integration - Always-Current Live Branch

Keep the operator's IDE checkout continuously reflecting every concurrent AI session's committed work — while every session keeps its own isolated worktree and MCP databases.

---

## 1. OVERVIEW

The launch wrapper `worktree-session.sh` isolates every top-level session into its own worktree on a `work/<runtime>/<slug>` branch with isolated MCP databases. That isolation is what makes concurrent, multi-runtime work safe — but it also makes each session's work **invisible** in the operator's IDE, which is open on the primary checkout. Sharing one working tree across sessions is not an option: concurrent uncommitted writers on a single tree corrupt each other.

The continuous-integration workflow resolves this by giving the operator one **live branch** — whatever branch the primary checkout is on — that always reflects every session's committed work within seconds:

- Sessions keep their isolated worktree (safe writes and DB isolation are unchanged).
- On each commit, the session **publishes** to the live branch through a safe primitive.
- The IDE checkout **fast-forward-follows** the live branch.

**Core principle**: isolate writes, integrate commits. Visibility is at commit granularity — the operator sees another session's work seconds after it commits, never its un-committed editor buffer. Real-time sub-commit sharing is deliberately out of scope: it would require a shared filesystem and reintroduce the concurrent-writer corruption this design avoids.

---

## 2. THE THREE SCRIPTS

| Script | Role | Runs where |
|--------|------|-----------|
| `.opencode/bin/git-sync.sh` | Publish a session's commits to the live branch | Each session (via the `post-commit` hook, or manually) |
| `.opencode/bin/git-live-follow.sh` | Fast-forward the IDE checkout as the live branch advances | The operator's primary checkout |
| `.opencode/bin/worktree-status.sh` | Glance dashboard of every worktree's ahead / behind / dirty state | Anywhere (read-only) |

### `git-sync.sh` — the publish primitive

```
git-sync.sh [--live <branch>] [--remote <name>] [--auto] [--quiet]
```

It resolves the live branch (`--live`, else `$SPECKIT_LIVE_BRANCH`) and the remote (default `origin`), refuses to publish when the current branch *is* the live branch, then loops:

1. `git fetch` the live branch.
2. If HEAD is already contained in the live tip → nothing to publish.
3. If the live tip is an ancestor of HEAD → **fast-forward publish** (`git push origin HEAD:<live>`).
4. Otherwise the live branch moved → **rebase** the session's commits onto it, then publish. The rebase runs only when tracked files are clean; untracked scratch files never block it.
5. Any rebase conflict → `git rebase --abort` (restoring the exact pre-sync state) and a printed manual-resolution path; the commit stays local and unpublished.

`--auto` (used by the hook) makes every exit code `0` so a blocked publish never fails the triggering commit. A push race retries the whole fetch→publish loop a bounded number of times.

### `git-live-follow.sh` — the IDE follower

```
git-live-follow.sh [--live <branch>] [--interval <sec>] [--once]
```

Polls the live branch and fast-forwards the checkout **only** when the local tip is an ancestor of the remote tip and the working tree is clean. A diverged branch or a dirty tree is reported, never overwritten — an in-progress edit in the IDE is never clobbered by an incoming commit. Run it once per IDE session (e.g. backgrounded), or `--once` for a manual "catch me up."

### `worktree-status.sh` — the dashboard

```
worktree-status.sh [--live <branch>] [--fetch]
```

Read-only. Prints each worktree's branch, ahead / behind vs the live branch, and uncommitted file count. **Ahead + dirty is exactly the work not yet visible** in the IDE (ahead = committed-but-unpublished; dirty = uncommitted).

---

## 3. AUTOSYNC (COMMIT → PUBLISH)

Publishing is automatic. The versioned `post-commit` git hook calls `git-sync.sh --auto` after every commit, behind a tight triple gate so it fires **only** for a launch-wrapper session and **never** for the primary checkout or a manual commit:

1. `SPECKIT_AUTOSYNC=1` **and** `SPECKIT_LIVE_BRANCH` are present — the launch wrapper is the sole place that exports both.
2. The commit happened inside a **linked worktree** (`git rev-parse --absolute-git-dir` differs from the resolved `--git-common-dir`).
3. The call is fully non-fatal (`|| true`), and `post-commit`'s exit status is ignored by git regardless.

The launch wrapper wires this up per session: it resolves the live branch from the primary checkout, bases the new session worktree on it, and exports `SPECKIT_LIVE_BRANCH` + `SPECKIT_AUTOSYNC`. Orchestrated children inherit those env vars and correctly publish their own commits from inside the same worktree.

The autosync block composes with — it does not replace — the hook's existing code-graph invalidation and memory-drift behavior.

---

## 4. SAFETY CONTRACT

| Guarantee | How |
|-----------|-----|
| No session can clobber another's published work | Publication is **non-force**; a moved live branch is rebased onto, never overwritten |
| A conflicting commit never half-applies | Any rebase conflict aborts cleanly, restoring the exact pre-sync branch and tree; the commit stays local |
| Autosync never breaks a commit | `--auto` returns `0` on every path; the hook is non-fatal |
| The primary checkout never autosyncs | The triple gate is satisfied only by wrapper-launched sessions in a linked worktree |
| Un-committed work is never touched | The publish path only ever moves committed refs; the rebase requires clean tracked files; the follower is fast-forward-only and skips a dirty tree |
| No `--autostash` orphan risk | The rebase runs only on a clean tracked tree, so nothing is autostashed (see [SKILL.md](../SKILL.md) ALWAYS #14) |

---

## 5. OPERATOR SETUP

1. **Install the git hooks** (once per clone) so autosync fires:
   ```bash
   bash .opencode/scripts/install-git-hooks.sh
   ```
   `check-git-hooks.sh` warns at SessionStart when the hooks are not installed.

2. **Follow the live branch in the IDE checkout** — from the primary tree, background the follower:
   ```bash
   bash .opencode/bin/git-live-follow.sh &
   ```

3. **Glance at what's outstanding** any time:
   ```bash
   bash .opencode/bin/worktree-status.sh --fetch
   ```

4. **Opt out** of autosync for a single launch with `SPECKIT_AUTOSYNC=0` in the environment; nothing else changes and the session still runs isolated.

---

## 6. CROSS-RUNTIME PARITY

Autosync is runtime-agnostic by construction: it is a git hook plus a wrapper that takes the runtime as an argument, so it fires identically for `claude`, `codex`, and `opencode` sessions.

The two SessionStart guards that make the model observable — `worktree-guard.sh` (warns when a top-level session runs on the shared checkout instead of isolated) and `check-git-hooks.sh` (warns when the hooks are not installed) — run in all three runtimes:

| Runtime | Guard wiring |
|---------|--------------|
| Claude | `.claude/settings.json` SessionStart |
| OpenCode | `.opencode/plugins/session-cleanup.js` (runs both guards on `session.created`) |
| Codex | `.codex/hooks.json` SessionStart |

---

## 7. LIMITS

- Visibility is at **commit granularity**, never another session's un-committed buffer.
- Autosync only fires when the git hooks are **installed**; the SessionStart guard warns but does not install them.
- A conflicting commit is **not** auto-resolved — it stays local with a printed manual-resolution path, by design.
- `worktree-status.sh` shows external session worktrees (outside the repo root) with a truncated absolute path; in-repo worktrees show a clean repo-relative path.

---

## 8. RELATED

- [SKILL.md](../SKILL.md) — §3 lifecycle and the ALWAYS rule for the live-branch model; §4 ALWAYS #14 (autostash) and #15 (reconcile the primary checkout).
- [finish_workflows.md](finish_workflows.md) — Step 5b, the manual primary-checkout reconciliation for a finish that ends in a worktree push.
- [worktree_workflows.md](worktree_workflows.md) — worktree setup and the launch-wrapper model.
