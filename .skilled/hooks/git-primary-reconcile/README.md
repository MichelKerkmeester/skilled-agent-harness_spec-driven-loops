---
title: "Git Primary Reconcile: Live-Checkout Convergence"
description: "Reconciles the primary checkout with its live branch at session start for Claude, Codex, Cursor, Devin, OpenCode, Pi, DSH and Vibe."
trigger_phrases:
  - "primary checkout reconcile"
  - "live branch reconcile"
  - "primary reconcile"
  - "claude primary reconcile"
  - "live branch convergence"
  - "sessionstart git reconcile"
  - "codex primary reconcile"
  - "cursor primary reconcile"
  - "devin primary reconcile"
  - "dsh primary reconcile"
  - "repo-guards session start"
  - "pi primary reconcile"
  - "session start advisories"
importance_tier: "normal"
contextType: "reference"
---

# Git Primary Reconcile: Live-Checkout Convergence

---

## 1. OVERVIEW

Runtime hooks start `.skilled/bin/git-primary-reconcile.sh` to reconcile the primary checkout with its configured live branch. Each of the six runtime directories contains a symlink to that script. Runtime startup paths reach the script directly or through a shared plugin, not through those symlinks.

The concern key is `primary-reconcile`, which differs from the folder name. `SYSTEM_PRIMARY_RECONCILE_DISABLED` disables this concern. `SYSTEM_LIVE_SYNC_DISABLED` disables it with the live-sync concern. `SYSTEM_HOOKS_DISABLED` is the master switch.

---

## 2. HOW IT WORKS

The script resolves Git's directory and common directory first. A linked worktree has different paths, so the script exits before it reads flags or fetches. It then sources `.skilled/hooks/shared/hook-flags.sh` and checks the `live-sync` and `primary-reconcile` switches.

`try_acquire_lock()` keeps two runs from reconciling at once. `SPECKIT_PRIMARY_RECONCILE_LOCK_TTL` sets the stale-lock age. It defaults to 45 seconds. When `SPECKIT_LIVE_BRANCH` is unset, the script accepts a current branch matching `skilled/v*`. When set, the configured branch must match the current branch.

`bounded_run()` caps fetch and push with `SPECKIT_PRIMARY_RECONCILE_TIMEOUT`, which defaults to 12 seconds. The script tries `timeout` first. It falls back to `gtimeout`. Perl `alarm` is the last option. Without a bounded runner, the script skips network work.

Equal local and remote tips record `skip`. A branch behind the remote tries `git merge --ff-only`. Fast-forwards preserve nonconflicting tracked edits. A conflict records `block`. The dirty check ignores untracked files.

When a branch is ahead, tracked edits defer the rebase and leave local commits unpublished. A clean checkout with no rebase in progress rebases onto the remote tip and pushes to the live branch. A pre-existing rebase is left untouched.

If a rebase fails, the script aborts it and checks that HEAD returned to the original commit. If it did not, the script tries `git reset --hard` to that commit. It then checks that no rebase state or tracked edits remain.

`classify_push_gate()` maps a rejected push to a gate name and a fix hint. After the script resolves the primary checkout's Git common directory, it records outcomes in `<common-dir>/git-primary-reconcile.log`. The exit handler returns 0 so a reconcile failure does not stop session start.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Runtime entry | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `SessionStart` | `.claude/settings.json` | `.skilled/bin/git-primary-reconcile.sh` | Background run. Both output streams are discarded. |
| Codex | `SessionStart` | `.codex/hooks.json` | `.skilled/bin/git-primary-reconcile.sh` | Background run. Both output streams are discarded. |
| Cursor | `sessionStart` | `.cursor/hooks.json` | `.skilled/bin/git-primary-reconcile.sh` | Background run. Both output streams are discarded. |
| Devin | `SessionStart` | `.devin/hooks.v1.json` | `.skilled/bin/git-primary-reconcile.sh` | Background run. Both output streams are discarded. |
| OpenCode | `session.created` | `.opencode/plugins/session-cleanup.js` | `.skilled/bin/git-primary-reconcile.sh` | Detached run. The plugin logs launch failures. |
| Pi | `session_start` | `.pi/extensions/session-start-advisories.ts` | `.skilled/bin/git-primary-reconcile.sh` | Background run. Both output streams are discarded. |
| DSH | `agent/created` on startup | `.dsh/plugins/repo-guards/index.mjs` | `.skilled/bin/git-primary-reconcile.sh` | Detached run. Both output streams are ignored. |
| Vibe | `session_start` | `.vibe/hooks.toml` | `.skilled/bin/git-primary-reconcile.sh` | Detached run. Reconcile output is ignored. |

Claude registers `SessionStart` in [its settings file](../../../.claude/settings.json) with a 3-second timeout. Codex uses [its hooks file](../../../.codex/hooks.json) with the same event and timeout. Cursor registers `sessionStart` in [its hooks file](../../../.cursor/hooks.json) with a 10-second timeout. Devin registers `SessionStart` in [its hooks file](../../../.devin/hooks.v1.json) with a 3-second timeout.

OpenCode loads [the session-cleanup plugin](../../../.opencode/plugins/session-cleanup.js) from the `.opencode/plugins/*.js` glob. Its `session.created` handler starts the reconcile script detached with both streams ignored.

Pi loads [the extension entry](../../../.pi/extensions/session-start-advisories.ts), which re-exports [the shared Pi adapter](../../../.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts). The adapter starts this check for `startup` and `new` session reasons. It redirects both streams and backgrounds the command.

DSH registers session-start advisories in [the repo-guards bundle](../../../.dsh/plugins/repo-guards/index.mjs). The adapter runs at `agent/created` for source `startup` and skips fan-out leaves. It starts the reconcile script detached with ignored streams.

Vibe registers [the session-start hook](../../../.vibe/hooks.toml) to call [the shared session-start adapter](../../../.skilled/hooks/session-lifecycle/vibe/session-start.mjs). That adapter calls [the Vibe guard](../../../.vibe/plugins/repo-guards/session-cleanup.mjs), which starts reconcile through the OpenCode session-cleanup plugin.

The direct shell hooks discard both streams. Pi and DSH also hide reconcile output. OpenCode logs a launch failure. The script records its outcomes in `git-primary-reconcile.log` under Git's common directory.

---

## 4. DIRECTORY TREE

~~~text
git-primary-reconcile/
+-- README.md
+-- claude/
|   `-- git-primary-reconcile.sh -> ../../../bin/git-primary-reconcile.sh
+-- codex/
|   `-- git-primary-reconcile.sh -> ../../../bin/git-primary-reconcile.sh
+-- cursor/
|   `-- git-primary-reconcile.sh -> ../../../bin/git-primary-reconcile.sh
+-- devin/
|   `-- git-primary-reconcile.sh -> ../../../bin/git-primary-reconcile.sh
+-- dsh/
|   `-- git-primary-reconcile.sh -> ../../../bin/git-primary-reconcile.sh
`-- pi/
    `-- git-primary-reconcile.sh -> ../../../bin/git-primary-reconcile.sh
~~~

There is no `opencode/` or `vibe/` subfolder. Those runtimes use shared plugins.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.skilled/bin/git-primary-reconcile.sh` | Resolves the live branch, reconciles its tips and writes the run log. |
| `.skilled/hooks/shared/hook-flags.sh` | Reads the master and per-concern switches for this shell script. |
| `.pi/extensions/session-start-advisories.ts` | Re-exports Pi's shared session-start adapter. |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | Starts the reconcile command from Pi's `session_start` event. |
| `.dsh/plugins/repo-guards/index.mjs` | Registers DSH's session-start advisories adapter. |
| `.dsh/plugins/repo-guards/adapters/session-start-advisories.mjs` | Connects the DSH bundle to the shared DSH adapter. |
| `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs` | Starts the reconcile command for DSH. |
| `.opencode/plugins/session-cleanup.js` | Starts reconcile on OpenCode's `session.created` event. |
| `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` | Calls the Vibe startup guards from the `session_start` hook. |
| `.vibe/plugins/repo-guards/session-cleanup.mjs` | Runs the Vibe startup path through the shared session-cleanup plugin. |

---

## 6. CONFIGURATION

The concern is on by default. A per-concern disable switch turns the concern off when its value is truthy. The resolver treats `1`, `true`, `yes` or `on` as truthy in any case.

| Variable | Effect |
|---|---|
| `SYSTEM_PRIMARY_RECONCILE_DISABLED=1` | Turns off this concern. |
| `SYSTEM_LIVE_SYNC_DISABLED=1` | Turns off the live-sync concern, including this check. |
| `SYSTEM_HOOKS_DISABLED=1` | Turns off repository hooks. |
| `SPECKIT_LIVE_REMOTE=<name>` | Remote for fetch and push. Defaults to `origin`. |
| `SPECKIT_LIVE_BRANCH=<name>` | Branch to reconcile. When unset, only a current `skilled/v*` branch is accepted. |
| `SPECKIT_PRIMARY_RECONCILE_TIMEOUT=<seconds>` | Fetch and push timeout. Defaults to 12 seconds. |
| `SPECKIT_PRIMARY_RECONCILE_LOCK_TTL=<seconds>` | Lock age before reclaim. Defaults to 45 seconds. |

Set a switch in your environment for one session. To keep it, use `.skilled/hooks/hook-flags.env`. The environment wins over that file. Start from [the example config](../hook-flags.env.example).

---

## 7. VALIDATION

Run this syntax check from the repository root.

~~~bash
bash -n .skilled/bin/git-primary-reconcile.sh
~~~

Expected result: no output and exit status 0. This checks shell syntax and does not run reconciliation.

---

## 8. RELATED

- [The hooks overview](../README.md): the hook tree and runtime coverage matrix.
- [The shared helpers](../shared/README.md): the switch resolver used by shell hooks.
- [The reconcile script](../../bin/git-primary-reconcile.sh): the script runtime hooks start.

