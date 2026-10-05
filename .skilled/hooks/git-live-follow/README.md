---
title: "Git Live-Follow: IDE Checkout Auto-Fast-Forward"
description: "SessionStart primitive that keeps the operator's primary checkout current with the live branch, fast-forwarding new commits as they land, across Claude, Codex, Cursor, Devin, Pi, and the OpenCode session-start plugin."
trigger_phrases:
  - "live follow"
  - "git live follow"
  - "ide checkout follower"
  - "auto fast-forward checkout"
importance_tier: "important"
contextType: "reference"
---

# Git Live-Follow: IDE Checkout Auto-Fast-Forward

---

## 1. OVERVIEW

`git-live-follow/` is the index for the SessionStart primitive that keeps the operator's primary checkout — the one open in the IDE — current with the live branch. Sessions publish their commits to the shared live branch (`git-sync.sh`); this watcher is the operator side of that loop. It polls the remote and fast-forwards the checkout as new commits land, so the editor shows the current combined state of every active session, seconds behind the latest commit.

It fast-forwards only. It never merges, rebases, or resets: a diverged tree is warned about loudly and left untouched for the operator to reconcile, and a dirty collision is reported rather than clobbered. Untracked scratch files and build output never block a fast-forward, exactly one follower runs per checkout, and every internal failure is non-fatal (exit 0) so session start always continues.

One real script backs the wired runtimes. Claude, Codex, Cursor, Devin, and Pi carry relative symlinks into `.skilled/bin/`; OpenCode launches the same script from its session-start plugin (see [`session-cleanup/`](../session-cleanup/README.md)).

---

## 2. WHAT IT DOES

`--start` is the SessionStart entry. It exits immediately when this is a linked worktree (a session tree is never fast-forwarded from under the session that owns it) or when the live-sync kill switches are off, prints one status line, and backgrounds a single follower for this checkout. The long-running follower then runs the check below every `--interval` seconds (default 5):

1. **Fetch.** `git fetch <remote> <live>`. A failed fetch is recorded and retried on the next poll; it is never fatal.
2. **Compare tips.** Equal tips are a no-op. A missing remote tip is recorded as `remote-unavailable`.
3. **Behind.** If the local tip is an ancestor of the remote tip, `git merge --ff-only` advances it and records `fast-forward`. Git's own `--ff-only` refuses to overwrite a modified tracked file, so a collision is recorded as `fast-forward-blocked` and nothing is clobbered.
4. **Diverged.** Commits exist on both sides: it records `diverged` with the ahead/behind counts and prints the loud warning. It never merges, rebases, or resets.
5. **Dirty test.** Tracked-only (`git diff` + `git diff --cached`): untracked scratch and build output never block a fast-forward, and a changed tracked file blocks only the fast-forward that would collide with it.
6. **Logging and lock.** The follower started by `--start` runs with its output captured in `<git-common-dir>/live-follow/<checkout-key>.log`, rotated to `.1` past 256 KB; each state change writes one line there, never one per poll. A manual `--once` prints its state lines to stderr instead. The lock at `<git-common-dir>/live-follow/<checkout-key>.pid` allows exactly one follower per checkout; it is keyed to this checkout's own git dir, so distinct worktrees may each follow, and a dead PID is reclaimed by the next start.

`--once` runs a single check and exits (a manual "catch me up" nudge). It stays lock-free, so it works even while a poller runs.

---

## 3. PER-RUNTIME DELIVERY

| Runtime | Adapter | Event / wiring | Delivery |
|---|---|---|---|
| **Claude** | `claude/git-live-follow.sh` (symlink → `../../../bin/git-live-follow.sh`) | SessionStart hook chain, `--start` | One `[live-sync]` status line on stderr; the follower is detached and logs to the common dir; always exits 0 |
| **Codex** | `codex/git-live-follow.sh` (symlink) | SessionStart hook chain, `--start` | Same |
| **Cursor** | `cursor/git-live-follow.sh` (symlink) | SessionStart hook chain, `--start` | Same |
| **Devin** | `devin/git-live-follow.sh` (symlink) | SessionStart hook chain, `--start` | Same |
| **Pi** | bundled into `.pi/extensions/session-start-advisories.ts` (`ctx.exec()`) | `session_start`, concern `live-sync` | Same script, `--start`; any status text surfaces through `ctx.ui.notify()` instead of the raw stderr line |
| **OpenCode** | launched by `.skilled/plugins/session-cleanup.js` | Plugin `event` on `session.created` | Same script, backgrounded by the session-start plugin; no per-runtime symlink adapter |

Hermes runs the same script as one of its session-start guards in the `repo-guards` plugin.

---

## 4. DIRECTORY TREE

```text
git-live-follow/
+-- README.md
+-- claude/   git-live-follow.sh (symlink -> ../../../bin/git-live-follow.sh)
+-- codex/    git-live-follow.sh (symlink)
+-- cursor/   git-live-follow.sh (symlink)
+-- devin/    git-live-follow.sh (symlink)
`-- pi/       git-live-follow.sh (symlink)
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.skilled/bin/git-live-follow.sh` | The follower. `--start` gate and backgrounding, per-checkout lock, bounded poll of the live branch, fast-forward-only advance, tracked-only dirty test, state logging with rotation. Always exits 0. |
| `.skilled/plugins/session-cleanup.js` | The OpenCode session-start plugin that launches this script on `session.created` (see [`session-cleanup/`](../session-cleanup/README.md)). Not in this folder. |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | The Pi extension that runs the same script with `--start`. Not in this folder. |
| `.skilled/hooks/shared/hook-flags.sh` | The shared shell kill-switch resolver (`hook_enabled live-sync`, `hook_enabled live-follow`). Sourced fail-open by `--start`. |

---

## 6. CONFIGURATION

The concern is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive) for the shared resolver.

| Variable | Effect |
|---|---|
| `SYSTEM_LIVE_FOLLOW_DISABLED=1` | Turns off the follower alone; the rest of the live-sync loop stays active. |
| `SYSTEM_LIVE_SYNC_DISABLED=1` | Disables the whole live-sync loop, which includes this one. Checked before the per-concern flag. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |
| `SPECKIT_LIVE_REMOTE=<name>` | Remote to poll (default `origin`). |
| `LIVE_FOLLOW_MANAGED_LOG=1` | Internal: the follower writes and rotates its common-dir log. Set by `--start` when it backgrounds the follower. |
| `LIVE_FOLLOW_LOG_MAX_BYTES=<bytes>` | Log size cap before rotation (default `262144`). |

Set a flag inline for one command, export it for a session, or persist it in `.skilled/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| SessionStart-only auto-start | `--start` refuses to run inside a linked worktree and exits 0 without starting anything. Only the main checkout auto-follows. |
| Fast-forward only | It never merges, rebases, or resets. Divergence is warned about, not repaired; a ff collision is blocked and reported. |
| Never touches uncommitted work | Tracked-only dirty test. A dirty tree is reported, never overwritten; untracked build output never blocks an advance. |
| Single instance | A per-checkout PID lock under the git common dir makes a second long-running follower exit cleanly. `--once` stays lock-free. |
| Non-fatal | Missing git, a non-repo checkout, a fetch failure, a missing tip, or any internal error exits 0 so session start continues. |
| Imports | Bash only; sources the shared `hook-flags.sh` fail-open. Nothing outside the repo. |
| Real code | Stays in `.skilled/bin/`; the hub entries are relative symlinks. |

---

## 8. VALIDATION

```bash
bash .skilled/bin/git-live-follow.sh --start; echo "exit: $?"
```

Expected result: `exit: 0`, with no state mutation from this probe. In a linked worktree it is silent; in the main checkout it prints the `[live-sync]` status line and backgrounds at most one follower.

```bash
SYSTEM_LIVE_FOLLOW_DISABLED=1 bash .skilled/bin/git-live-follow.sh --start; echo "exit: $?"
```

Expected result: `exit: 0`, no status line, no follower started, no network call.

```bash
bash .skilled/bin/git-live-follow.sh --once; echo "exit: $?"
```

Expected result: `exit: 0`, a `[live-follow] following <remote>/<branch> ...` line on stderr, plus a state line when the check changed state (a fetch failure, a fast-forward, a block, or divergence). In a clean in-sync checkout nothing is modified and no log line is written.

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`../git-primary-reconcile/README.md`](../git-primary-reconcile/README.md): the converge leg of the same live-sync loop.
- [`../session-cleanup/README.md`](../session-cleanup/README.md): the OpenCode session-start plugin that also launches this script.
- [`../../bin/git-live-follow.sh`](../../bin/git-live-follow.sh): the follower's real home.
