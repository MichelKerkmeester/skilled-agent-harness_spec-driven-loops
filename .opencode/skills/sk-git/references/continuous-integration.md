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

## 2. THE FOUR SCRIPTS

| Script | Role | Runs where |
|--------|------|-----------|
| `.opencode/bin/git-sync.sh` | Publish a session's commits to the live branch | Each session (via the `post-commit` hook, or manually) |
| `.opencode/bin/git-live-follow.sh` | Fast-forward the IDE checkout as the live branch advances | The operator's primary checkout |
| `.opencode/bin/git-primary-reconcile.sh` | Reconcile clean primary-checkout drift at SessionStart | The operator's primary checkout, backgrounded by each runtime |
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

Polls the live branch and fast-forwards the checkout when the local tip is an ancestor of the remote tip, through git's own `--ff-only`. That primitive refuses to overwrite a modified tracked file, so a checkout carrying unrelated work-in-progress still follows for disjoint commits, while a commit that would touch a locally-edited file is reported and left for the operator — an in-progress edit in the IDE is never clobbered. A diverged branch is likewise reported, never overwritten. Run it once per IDE session (e.g. backgrounded), or `--once` for a manual "catch me up."

### `git-primary-reconcile.sh` - the SessionStart convergence step

Every runtime backgrounds the same script at SessionStart, so primary-checkout correctness does not depend on a long-running follower surviving between sessions. The script acts only when `git-dir` and `git-common-dir` resolve to the same path and the checkout is on the resolved live branch. Linked worktrees, detached HEADs, and intentional feature branches are zero-exit no-ops.

A behind-only checkout fast-forwards through git's own `--ff-only`, which refuses to overwrite a modified tracked file — so a checkout carrying unrelated work-in-progress still follows for disjoint commits and is never clobbered on a collision. Untracked build output is intentionally ignored. Rebasing is the hard clean-tree boundary: because it rewrites commits across the working tree, unpublished local commits are rebased onto `origin/<live>` and published only when the tracked tree is clean; otherwise they are left preserved and unpublished. A conflict aborts and asserts the original HEAD and clean tracked state; a rejected push classifies the stable `[gate:<name>]` marker and leaves the local commit preserved but unpublished.

The common-dir single-flight lock prevents concurrent SessionStarts from racing and treats a short-TTL stale lock as free. Fetch and push are time-bounded. Skips, advances, publications, and blocks append to `git-primary-reconcile.log`; every internal outcome exits zero so SessionStart cannot be blocked.

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

### Gate map

Wrapper sessions inherit `SPECKIT_AUTOSYNC=1` while committing, so commit-time gates run before autosync starts. Push-time gates then run inside `git push origin HEAD:<live>`. A gate rejection is not a push race: `git-sync.sh` captures the hook stderr, identifies the stable `[gate:<name>]` marker, replays the original diagnostics, prints `AUTOSYNC BLOCKED`, and appends a `blocked gate=<name> fix=<guidance>` record to the common-dir `git-sync.log`.

| Lifecycle | Gate | Runs for wrapper autosync work | Exact live-branch behavior | Blocking and visibility |
|-----------|------|-------------------------------|----------------------------|-------------------------|
| Pre-commit | Shared hook flags | Yes, before the commit | May disable the commit-hook family; a broken resolver warns and leaves gates enabled | Never blocks by itself |
| Pre-commit | Mass-deletion ceiling | Yes, before the commit | No exemption | Real violations block loudly and append `mass-deletion-guard.log` |
| Pre-commit | Doc model references | Yes, when its validator exists | Advisory only | Warns, then later gates still run |
| Pre-commit | Comment hygiene | Yes | No exemption | Blocks with `[gate:comment-hygiene]` and repair guidance |
| Pre-commit | Agent mirror sync | When agent mirrors are staged | No exemption | Blocks with `[gate:agent-mirror-sync]` and repair guidance |
| Pre-commit | Prompt card sync | When prompt-knowledge files are staged | No exemption | Blocks with `[gate:prompt-card-sync]` and repair guidance |
| Pre-commit | MCP mutation class | When matching doctor/install files are staged | No exemption | Blocks with `[gate:mcp-mutation-class]` and repair guidance |
| Pre-commit | Tool ownership map | Yes | No exemption | Blocks with `[gate:tool-ownership]` and repair guidance |
| Post-commit | Memory drift marker | Yes, before publish | Best-effort; a broken helper warns and autosync continues | Never blocks the commit or publish |
| Post-commit | Live-sync flags and linked-worktree check | Yes | Publishes only when live-sync is enabled and the commit is in a linked worktree | A broken flag resolver warns and keeps the default-on publish behavior |
| Pre-push | Mass-deletion ceiling | Yes, for updates to every branch | No exemption | Blocks real violations with `[gate:mass-deletion]`; hook and sync logs both persist the reason |
| Pre-push | New-branch naming | Yes | Exact `$SPECKIT_LIVE_BRANCH` autosync is exempt, including first publication; another destination is not | Other invalid new branches block with `[gate:naming]` |
| Pre-push | Remote permission | Yes | Exact `$SPECKIT_LIVE_BRANCH` autosync is exempt; another destination is not | Other non-allowlisted pushes block with `[gate:remote-permission]` |
| Pre-push | Skill-root metadata | When the pushed per-ref range changes `.opencode/skills` | No safety exemption and no hook-side regeneration | Blocks with `[gate:skill-root-metadata]`, the exact `--fix` command, and a durable sync-log record |
| Pre-push | Discovered tests | Yes when the runner exists | Report-only by default; no autosync exemption when enforcement is enabled | Enforced failures block with `[gate:test-suites]` and a durable sync-log record |

The skill-root gate deliberately does not run `--fix` from `pre-push`. The commit already exists at that point. Regenerating only the working tree would make a re-check green while the stale committed bytes still reach the remote. The safe path is a loud block, run the exact repair command, then include the generated projection in a new commit so normal autosync can publish it.

The naming and remote-permission helpers are one shared dependency. If that helper is absent or malformed, those two gates warn and fail open, but mass-deletion, skill metadata, and tests continue independently. A broken optional helper can no longer suppress unrelated push gates.

---

## 4. SAFETY CONTRACT

| Guarantee | How |
|-----------|-----|
| No session can clobber another's published work | Publication is **non-force**; a moved live branch is rebased onto, never overwritten |
| A conflicting commit never half-applies | Any rebase conflict aborts cleanly, restoring the exact pre-sync branch and tree; the commit stays local |
| Autosync never breaks a commit | `--auto` returns `0` on every path; the hook is non-fatal |
| The primary checkout never autosyncs | The triple gate is satisfied only by wrapper-launched sessions in a linked worktree |
| Un-committed work is never touched | Fast-forward follow uses git's own `--ff-only`, which refuses to overwrite a modified tracked file; the rebase/publish paths still require a clean tracked tree; untracked build output is ignored |
| No `--autostash` orphan risk | The rebase runs only on a clean tracked tree, so nothing is autostashed (see [SKILL.md](../SKILL.md) ALWAYS #14) |
| Autosync keeps publishing even when the live branch isn't on the remote allowlist | The pre-push permission gate ([remote-branch-policy.md](remote-branch-policy.md)) exempts exactly `$SPECKIT_LIVE_BRANCH` when `SPECKIT_AUTOSYNC=1` — scoped to that one branch, never a blanket bypass |
| A pre-push rejection cannot look like a push race | Stable gate markers are captured, replayed, classified, and appended to `git-sync.log` before autosync stops retrying |

---

## 5. OPERATOR SETUP

Live-sync is **on by default** in the main checkout. No setup step is required: SessionStart self-heals the git hook install, backgrounds a bounded reconcile, and backgrounds the optional follower. All three legs are primary-checkout gated and never reconcile a linked session worktree.

1. **Nothing to install** - when the hook symlinks are missing, `check-git-hooks.sh` runs the installer itself from the main checkout (self-heal). `MK_LIVE_SYNC_DISABLED=1` stops this leg.

2. **Nothing to start** - the SessionStart chain backgrounds `git-primary-reconcile.sh` for reliable convergence and runs `git-live-follow.sh --start` for near-real-time following. `MK_PRIMARY_RECONCILE_DISABLED=1` stops only the reconcile leg; `MK_LIVE_FOLLOW_DISABLED=1` stops only the follower.

3. **Glance at what's outstanding** any time:
   ```bash
   bash .opencode/bin/worktree-status.sh --fetch
   ```

4. **Opt out** - the one master flag `MK_LIVE_SYNC_DISABLED=1` (truthy `1`/`true`/`on`) disables the whole loop: autosync publish, SessionStart reconcile, follower auto-start, and self-heal install. It honors the shared hook kill-switch convention, so `MK_HOOKS_DISABLED=1` or a line in `.opencode/hooks/hook-flags.env` also stops it. Finer per-leg switches stay available: `SPECKIT_AUTOSYNC=0` for a single publish, `MK_PRIMARY_RECONCILE_DISABLED=1` for SessionStart reconciliation, and `MK_LIVE_FOLLOW_DISABLED=1` for the follower alone.

---

## 6. CROSS-RUNTIME PARITY

Autosync is runtime-agnostic by construction: it is a git hook plus a wrapper that takes the runtime as an argument, so it fires identically for `claude`, `codex`, and `opencode` sessions.

The two SessionStart guards that make the model observable are `worktree-guard.sh` (warns when a top-level session runs on the shared checkout instead of isolated) and `check-git-hooks.sh` (warns when the hooks are not installed, and self-heals them in the main checkout). Every runtime also backgrounds `git-primary-reconcile.sh`; the follower auto-start remains beside it as an optional low-latency leg:

| Runtime | Guard wiring |
|---------|--------------|
| Claude | `.claude/settings.json` SessionStart |
| OpenCode | `.opencode/plugins/session-cleanup.js` (runs guards and detached reconcile on `session.created`) |
| Codex | `.codex/hooks.json` SessionStart |
| Pi | `session-start-advisories.ts` advisory chain |

---

## 7. LIMITS

- Visibility is at **commit granularity**, never another session's un-committed buffer.
- Autosync only fires when the git hooks are **installed**; with live-sync enabled, the SessionStart guard auto-installs them from the main checkout.
- A conflicting commit is **not** auto-resolved — it stays local with a printed manual-resolution path, by design.
- `worktree-status.sh` shows external session worktrees (outside the repo root) with a truncated absolute path; in-repo worktrees show a clean repo-relative path.

---

## 8. RELATED

- [SKILL.md](../SKILL.md) — §3 lifecycle and the ALWAYS rule for the live-branch model; §4 ALWAYS #14 (autostash) and #15 (reconcile the primary checkout).
- [finish-workflows.md](finish-workflows.md) — Step 5b, the manual primary-checkout reconciliation for a finish that ends in a worktree push.
- [worktree-workflows.md](worktree-workflows.md) — worktree setup and the launch-wrapper model.
- [remote-branch-policy.md](remote-branch-policy.md) — the remote-push-permission gate autosync is scoped-exempt from, and why.
