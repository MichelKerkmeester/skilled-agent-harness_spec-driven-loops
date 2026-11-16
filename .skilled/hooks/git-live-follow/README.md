---
title: "Git Live-Follow: IDE Checkout Auto-Fast-Forward"
description: "SessionStart primitive that keeps the operator's primary checkout current with the live branch, fast-forwarding new commits as they land, across Claude, Codex, Cursor, Devin, DSH, Pi and the OpenCode and Vibe session-start plugins."
trigger_phrases:
  - "live follow"
  - "git live follow"
  - "ide checkout follower"
  - "auto fast-forward checkout"
  - "claude live follow"
  - "sessionstart checkout follower"
  - "codex live follow"
  - "cursor live follow"
  - "devin live follow"
  - "dsh live follow"
  - "repo-guards session start"
  - "pi live follow"
  - "session start advisories"
importance_tier: "important"
contextType: "reference"
---

# Git Live-Follow: IDE Checkout Auto-Fast-Forward

---

## 1. OVERVIEW

`git-live-follow/` indexes the SessionStart primitive that keeps the operator's primary checkout current with the live branch. That checkout is the one open in the IDE. Sessions publish their commits to the shared live branch (`git-sync.sh`). This watcher is the operator side of that loop. It polls the remote and fast-forwards the checkout as new commits land. The editor then shows the combined state of every active session, seconds behind the latest commit.

It fast-forwards only. It never merges, rebases or resets. A diverged tree is warned about loudly and left untouched for the operator to reconcile. A dirty collision is reported rather than clobbered.

Untracked scratch files and build output never block a fast-forward. Exactly one follower runs per checkout. Every failure inside the poll loop is non-fatal (exit 0), so session start always continues. Only a missing `git`, a directory that is not a git checkout or a manual run on a detached HEAD without `--live` exits 1.

One real script backs the wired runtimes. The runtime folders here hold relative symlinks into `.skilled/bin/`. OpenCode and Vibe launch the same script from their session-start plugins (see [`session-cleanup/`](../session-cleanup/README.md)).

---

## 2. HOW IT WORKS

`--start` is the SessionStart entry. It exits 0 at once in a linked worktree, because a session tree is never fast-forwarded from under the session that owns it. It also exits 0 in a dispatched child session and in a checkout under a temp dir. It exits 0 when the live-sync kill switches are off. Otherwise it prints one status line and backgrounds a single follower for this checkout.

Two more paths leave `--start` without a follower. It exits 0 silently on a detached HEAD without `--live`. If a follower already holds the lock, it prints the line and starts nothing.

The long-running follower then runs the check below every `--interval` seconds (default 5):

1. **Fetch.** `git fetch <remote> <live>`. A failed fetch is recorded and retried on the next poll. It is never fatal.
2. **Compare tips.** Equal tips are a no-op. A missing remote tip is recorded as `remote-unavailable`.
3. **Behind.** If the local tip is an ancestor of the remote tip, `git merge --ff-only` advances it and records `fast-forward`. A modified tracked file blocks only a fast-forward that would overwrite it. Disjoint commits still follow. A blocked advance is recorded as `fast-forward-blocked` and nothing is clobbered.
4. **Diverged.** Commits exist on both sides. It records `diverged` with the ahead/behind counts and prints the loud warning. It never merges, rebases or resets.
5. **Dirty test.** The test is tracked-only. No `git diff` or `git diff --cached` probe runs, because `--ff-only` decides. Untracked scratch and build output never block a fast-forward.
6. **Logging.** The follower started by `--start` captures its output in `<git-common-dir>/live-follow/<checkout-key>.log`, rotated to `.1` past 256 KB. Each state change writes one line there, never one per poll. A manual `--once` prints its state lines to stderr instead.
7. **Lock.** The lock at `<git-common-dir>/live-follow/<checkout-key>.pid` allows exactly one follower per checkout. It is keyed to this checkout's own git dir, so distinct worktrees may each follow. A dead PID is reclaimed by the next start.

`--once` runs a single check and exits. It is a manual "catch me up" nudge. It stays lock-free, so it works even while a poller runs.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `SessionStart` [id `git-live-follow`, timeout 3] | `claude/git-live-follow.sh` | `.skilled/bin/git-live-follow.sh` | One `[live-sync]` status line on stderr. |
| Codex | `SessionStart` [id `git-live-follow`, timeout 3] | `codex/git-live-follow.sh` | `.skilled/bin/git-live-follow.sh` | The same status line on stderr. |
| Cursor | `sessionStart` [id `git-live-follow`, timeout 10] | `cursor/git-live-follow.sh` | `.skilled/bin/git-live-follow.sh` | The same status line on stderr. |
| Devin | `SessionStart` [id `git-live-follow`, timeout 3] | `devin/git-live-follow.sh` | `.skilled/bin/git-live-follow.sh` | The same status line on stderr. |
| DSH | `agent/created` | `dsh/git-live-follow.sh` | `.skilled/bin/git-live-follow.sh` | A user message, `live-sync-follow: <status line>`. |
| Pi | `session_start` | `pi/git-live-follow.sh` | `.skilled/bin/git-live-follow.sh` | A warning notification through `ctx.ui.notify()`. |
| OpenCode | `session.created` | None | `.opencode/plugins/session-cleanup.js` | The status line under `[session-cleanup] Startup safety warnings:`. |
| Vibe | `session_start` | None | `.vibe/plugins/repo-guards/session-cleanup.mjs` | The same warnings as `additional_context`. |

Session start continues on every runtime. A failed start never blocks a turn.

Claude, Codex, Cursor and Devin register the script in `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` under the id `git-live-follow`. Claude, Codex and Devin give it 3 seconds and Cursor gives it 10. Each one runs `bash .skilled/bin/git-live-follow.sh --start` in its session-start chain.

On a nonzero exit, Claude, Codex and Cursor print an `mk-hook-drift` line and add a could-not-resolve notice. Devin has no fallback (`.devin/hooks.v1.json`).

No registration names a path in this folder. The links exist for browsing. Nothing loads through them.

Pi runs the script at `session_start` through `ctx.exec()` with the reason `startup` or `new`, under the concern `live-sync`. DSH runs it when an agent is created at startup, under the concern `live-follow`. A fan-out leaf skips it. Both adapters also stop when the `session-lifecycle` concern is off. Both pass on whatever the script prints. Pi shows a notification. DSH injects the line into the conversation.

The OpenCode plugin's `event` handler starts the script only on `session.created`. Its `experimental.chat.system.transform` handler adds the output to the system context.

Vibe runs the script at `session_start` too. `.vibe/hooks.toml` calls `.skilled/hooks/session-lifecycle/vibe/session-start.mjs`, which runs `.vibe/plugins/repo-guards/session-cleanup.mjs`. That hook reuses `.opencode/plugins/session-cleanup.js`, fires its `session.created` event and returns the warnings as `additional_context`. It skips when the `session-cleanup` concern is off.

---

## 4. DIRECTORY TREE

```text
git-live-follow/
+-- README.md
+-- claude/    git-live-follow.sh -> ../../../bin/git-live-follow.sh
+-- codex/     git-live-follow.sh -> ../../../bin/git-live-follow.sh
+-- cursor/    git-live-follow.sh -> ../../../bin/git-live-follow.sh
+-- devin/     git-live-follow.sh -> ../../../bin/git-live-follow.sh
+-- dsh/       git-live-follow.sh -> ../../../bin/git-live-follow.sh
`-- pi/        git-live-follow.sh -> ../../../bin/git-live-follow.sh
```

Each runtime folder holds one relative link and nothing else.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.skilled/bin/git-live-follow.sh` | The follower. It parses arguments, gates `--start`, takes the per-checkout lock and polls the live branch. It advances by fast-forward only and logs each state change with rotation. |
| `.opencode/plugins/session-cleanup.js` | The OpenCode session-start plugin. It launches this script on `session.created`. Not in this folder. |
| `.vibe/plugins/repo-guards/session-cleanup.mjs` | The Vibe hook. It reuses the OpenCode plugin and returns its warnings as `additional_context`. Not in this folder. |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | The Pi adapter that runs the script with `--start` under the concern `live-sync`. Not in this folder. |
| `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs` | The DSH adapter that runs the script with `--start` under the concern `live-follow`. Not in this folder. |
| `.pi/extensions/session-start-advisories.ts` | The Pi extension entry that re-exports the adapter above. Not in this folder. |
| `.skilled/hooks/shared/hook-flags.sh` | The shared shell kill-switch resolver (`hook_enabled live-sync`, `hook_enabled live-follow`). `--start` sources it fail-open. |

---

## 6. CONFIGURATION

The concern is enabled by default. Truthy disable values are `1`, `true`, `yes` and `on` (case-insensitive) for the shared resolver.

| Variable | Effect |
|---|---|
| `SYSTEM_LIVE_FOLLOW_DISABLED=1` | Turns off the follower alone. The rest of the live-sync loop stays active. |
| `SYSTEM_LIVE_SYNC_DISABLED=1` | Disables the whole live-sync loop, which includes this one. Checked before the per-concern flag. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |
| `SPECKIT_LIVE_REMOTE=<name>` | Remote to poll (default `origin`). |
| `LIVE_FOLLOW_MANAGED_LOG=1` | Internal: the follower writes and rotates its common-dir log. Set by `--start` when it backgrounds the follower. |
| `LIVE_FOLLOW_LOG_MAX_BYTES=<bytes>` | Log size cap before rotation (default `262144`). |

Set a flag inline for one command or export it for a session. To keep it, write it in `.skilled/hooks/hook-flags.env`, a gitignored copy of `hook-flags.env.example`. The environment always wins over the file, so a persisted default can be overridden for a single session.

`--start` sources `hook-flags.sh` fail-open. A missing resolver leaves the concern enabled.

---

## 7. VALIDATION

Run from the repository root.

```bash
bash .skilled/bin/git-live-follow.sh --start; echo "exit: $?"
```

Expected result: `exit: 0`, with no state mutation from this probe. In a linked worktree it is silent. In the main checkout it prints the `[live-sync]` status line and backgrounds at most one follower.

```bash
SYSTEM_LIVE_FOLLOW_DISABLED=1 bash .skilled/bin/git-live-follow.sh --start; echo "exit: $?"
```

Expected result: `exit: 0`, no status line, no follower started, no network call.

```bash
bash .skilled/bin/git-live-follow.sh --once; echo "exit: $?"
```

Expected result: `exit: 0`, a `[live-follow] following <remote>/<branch> ...` line on stderr, plus a state line when the check changed state. A fetch failure, a fast-forward, a block or divergence all count. In a clean in-sync checkout nothing is modified and no log line is written.

---

## 8. RELATED

- [`../README.md`](../README.md): the hooks tree, with the switch index and the coverage matrix.
- [`../git-primary-reconcile/README.md`](../git-primary-reconcile/README.md): the converge leg of the same live-sync loop.
- [`../session-cleanup/README.md`](../session-cleanup/README.md): the session-start plugins that also launch this script on OpenCode and Vibe.
- [`../shared/README.md`](../shared/README.md): the switch resolver both concern keys go through.
- [`../../bin/git-live-follow.sh`](../../bin/git-live-follow.sh): the follower's real home.
