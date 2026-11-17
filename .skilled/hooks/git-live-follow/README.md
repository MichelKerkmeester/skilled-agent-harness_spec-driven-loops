---
title: "Git Live-Follow: IDE Checkout Auto-Fast-Forward"
description: "A SessionStart watcher that starts a fast-forward poller for the main checkout across Claude, Codex, Cursor, Devin, DSH, Pi, OpenCode and Vibe."
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

`git-live-follow/` documents the `live-follow` concern. In session mode it starts a poller for the main checkout. The poller fetches the selected remote branch and advances the checkout with `git merge --ff-only`. It leaves a diverged branch for you to reconcile.

The six links in this folder point to [the follower script](../../bin/git-live-follow.sh). Runtime registrations call that script directly or through a startup adapter.

Set `SYSTEM_LIVE_FOLLOW_DISABLED=1` to keep a new session from starting this poller. A follower that is already running does not recheck the switches, so stop its process to end it. `SYSTEM_LIVE_SYNC_DISABLED=1` turns off the wider live-sync flow. `SYSTEM_HOOKS_DISABLED=1` disables this concern along with other hooks that honor the master switch. The concern key is `live-follow`, which differs from this folder's name.

---

## 2. HOW IT WORKS

`--start` is the session-start entry. It skips linked worktrees. It also skips a child session with `AI_SESSION_CHILD=1` or a checkout under a temp directory. A disabled switch stops it before it starts a poller. Otherwise it prints a `[live-sync]` status line and backgrounds a follower when no live PID lock exists.

Without `--live`, the script follows the current branch. A manual run on a detached `HEAD` exits 1. `--start` on a detached `HEAD` exits silently. `--once` calls `check_once()` once and exits 0.

`check_once()` fetches the selected remote and compares its tip with local `HEAD`. When the local tip is behind, it runs `git merge --ff-only`. A failed merge records `fast-forward-blocked`. An untracked file blocks a fast-forward only when an incoming tracked path would overwrite it. If local `HEAD` is not an ancestor of the remote tip, it records `diverged` with ahead and behind counts and prints a warning. It leaves that branch unchanged.

`log_state_change()` writes a line only when the poll state changes. A follower started by `--start` writes to `<git-common-dir>/live-follow/<checkout-key>.log`. It rotates the log to `.1` at the `LIVE_FOLLOW_LOG_MAX_BYTES` limit, which defaults to `262144` bytes. A manual `--once` prints state lines to stderr. The poll interval defaults to 5 seconds.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `SessionStart` | `claude/git-live-follow.sh` | `.skilled/bin/git-live-follow.sh` | The `[live-sync]` status line on stderr when the follower starts. |
| Codex | `SessionStart` | `codex/git-live-follow.sh` | `.skilled/bin/git-live-follow.sh` | The `[live-sync]` status line on stderr when the follower starts. |
| Cursor | `sessionStart` | `cursor/git-live-follow.sh` | `.skilled/bin/git-live-follow.sh` | The `[live-sync]` status line on stderr when the follower starts. |
| Devin | `SessionStart` | `devin/git-live-follow.sh` | `.skilled/bin/git-live-follow.sh` | The `[live-sync]` status line on stderr when the follower starts. |
| OpenCode | `session.created` | `.opencode/plugins/session-cleanup.js` | `.skilled/bin/git-live-follow.sh` | Captured in the startup safety warnings added to system context. |
| Pi | `session_start` | `.pi/extensions/session-start-advisories.ts` | `.skilled/bin/git-live-follow.sh` | A warning notification when the script prints output. |
| DSH | `agent/created` (`startup`) | `.dsh/plugins/repo-guards/index.mjs` | `.skilled/bin/git-live-follow.sh` | An injected `live-sync-follow` notice when the script prints output. |
| Vibe | `session_start` | `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` | `.skilled/bin/git-live-follow.sh` | Captured in `additional_context`. |

Claude and Codex use the `git-live-follow` id in `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`. Their generated entries are in `.claude/settings.json` and `.codex/hooks.json`. Both run at `SessionStart` with a 3-second timeout. Cursor registers in `.cursor/hooks.json` at `sessionStart` with a 10-second timeout. Devin registers in `.devin/hooks.v1.json` at `SessionStart` with a 3-second timeout.

OpenCode finds `.opencode/plugins/session-cleanup.js` through the flat `.opencode/plugins/` glob. Its `session.created` handler runs the script with `--start`. Pi loads `.pi/extensions/session-start-advisories.ts`, which re-exports the session-start adapter. DSH's `.dsh/plugins/repo-guards/index.mjs` bundle registers its session-start adapter. The `session_start` entry in `.vibe/hooks.toml` runs the Vibe session-start composer.

Claude and Codex print a `mk-hook-drift` line and a fallback envelope after a nonzero exit. Cursor prints that drift line with an allow message. Devin calls the script without a shell fallback. Pi swallows a thrown `ctx.exec()` error. DSH injects the output of a check that exits nonzero and logs a check that throws, then continues. OpenCode records a subprocess failure through its session-cleanup plugin. Vibe catches a failed startup part and exits 0.

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

Each runtime folder holds a relative link for browsing. Runtime entries call the script or an adapter that runs it.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.skilled/bin/git-live-follow.sh` | Fetches the selected branch, advances by fast-forward and records poll state. |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Declares the Claude, Codex, Cursor and Devin hooks and the Pi extension entry. |
| `.skilled/hooks/shared/hook-flags.sh` | Resolves the shell switches used by the follower. |
| `.opencode/plugins/session-cleanup.js` | Starts the follower from OpenCode's `session.created` handler. |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | Runs the follower from Pi's `session_start` handler. |
| `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs` | Runs the follower from DSH's `agent/created` handler. |
| `.dsh/plugins/repo-guards/index.mjs` | Registers the DSH session-start adapter. |
| `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` | Composes Vibe's session-start output, including startup warnings. |
| `.vibe/hooks.toml` | Registers the Vibe `session_start` entry. |

---

## 6. CONFIGURATION

The concern is on by default. Values `1`, `true`, `yes` and `on` disable a switch, in any case. The shell resolver reads the environment before `.skilled/hooks/hook-flags.env`.

| Setting | Effect |
|---|---|
| `SYSTEM_LIVE_FOLLOW_DISABLED=1` | Keeps `--start` from starting a follower. A running follower ignores it. |
| `SYSTEM_LIVE_SYNC_DISABLED=1` | Keeps `--start` from starting a follower through the live-sync check. A running follower ignores it. |
| `SYSTEM_HOOKS_DISABLED=1` | Disables this concern along with other hooks that honor the master switch. |
| `SPECKIT_LIVE_REMOTE=<name>` | Selects the remote. The default is `origin`. |
| `--remote <name>` | Selects the remote for one run. The default is `SPECKIT_LIVE_REMOTE` or `origin`. |
| `--live <branch>` | Selects the branch. The default is the current branch. |
| `--interval <seconds>` | Sets the poll interval. The default is `5`. |
| `LIVE_FOLLOW_LOG_MAX_BYTES=<bytes>` | Sets the managed log cap. The default is `262144`. |

Copy `.skilled/hooks/hook-flags.env.example` to `.skilled/hooks/hook-flags.env` to keep switch values between sessions. An environment value takes precedence over the file.

---

## 7. VALIDATION

Run from the repository root.

```bash
bash -n .skilled/bin/git-live-follow.sh
```

Expected result: no output and exit status 0.

The switch guard can be checked without starting the follower:

```bash
rg -n -F 'hook_enabled live-follow || exit 0' .skilled/bin/git-live-follow.sh
```

Expected result: one line containing `hook_enabled live-follow || exit 0`.

---

## 8. RELATED

- [hooks tree](../README.md): the switch index and runtime coverage matrix.
- [shared hook flags](../shared/README.md): the resolver used by the script.
- [primary reconcile](../git-primary-reconcile/README.md): the other live-sync concern.
- [session cleanup](../session-cleanup/README.md): the OpenCode startup plugin that also runs this script.
- [follower script](../../bin/git-live-follow.sh): the script's real home.
