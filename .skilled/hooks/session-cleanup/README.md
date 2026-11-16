---
title: "Session Cleanup Hook: Startup Guards + Teardown"
description: "Runs bounded startup guards and teardown cleanup across the editor runtimes plus the OpenCode plugin. The shell script kills only proven session-descendant MCP helpers. The OpenCode plugin also runs startup guards and primary-reconcile on session start."
trigger_phrases:
  - "session cleanup hook"
  - "startup guard teardown"
  - "mcp helper teardown"
  - "claude session cleanup"
  - "claude session end teardown"
  - "codex session cleanup"
  - "codex stop teardown"
  - "cursor session cleanup"
  - "cursor session end teardown"
  - "devin session cleanup"
  - "devin session end teardown"
  - "opencode session cleanup"
  - "opencode startup guards"
  - "opencode teardown plugin"
importance_tier: "normal"
contextType: "reference"
---

# Session Cleanup Hook: Startup Guards + Teardown

---

## 1. OVERVIEW

`session-cleanup/` indexes one concern with two faces that share one teardown script. The shell script `.skilled/scripts/session-cleanup.sh` backs the editor runtimes. It runs at session teardown on Claude, Cursor, Devin, OpenCode and Vibe, and at the end of each turn on Codex.

It kills only MCP helper processes it can prove descend from an explicit session PID. It re-proves that ancestry immediately before each kill. There is no fallback to the hook's PPID. Under a shared terminal that PPID can resolve to an ancestor common to many live sessions.

The OpenCode plugin `.opencode/plugins/session-cleanup.js` runs the same script on dispose. It also runs startup guards when a session is created. Those guards are `worktree-guard.sh`, `check-git-hooks.sh` and `git-live-follow.sh --start`, all run together. A backgrounded primary-reconcile starts alongside them, detached from the session. Any guard warning reaches the system context once per session.

Both faces are bounded and neither writes into spec docs. Plugin subprocesses wait at most eight seconds and capture 4 KiB. The shell script runs inline and rotates a 10 MB log.

---

## 2. HOW IT WORKS

### Shell script

`session-cleanup.sh` runs at session teardown on Claude, Cursor, Devin, OpenCode and Vibe, and at the end of each turn on Codex. Session identity comes only from the environment, never from stdin. The same script is therefore correct from any invocation point.

1. **Kill-switch.** It sources `.skilled/hooks/shared/hook-flags.sh` when the repository root resolves and the file is readable. It then asks `hook_enabled session-cleanup`. A disabled concern exits 0. A missing resolver leaves the concern enabled.
2. **No session PID.** It runs the orphan-sweep fallback and exits 0. `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` picks the mode. `off` is the default and logs `action=skip reason=no-session-pid`. `dry-run` logs the candidates and runs `orphan-mcp-sweeper.sh` with `--dry-run`. `1`, `on` and `live` run it live.
3. **Dead session PID.** It logs `action=skip reason=session-pid-not-alive` and exits 0.
4. **Descendant walk.** It walks the tree with `pgrep -P` and logs `action=start` with the descendant count.
5. **Target match.** It reads each descendant's command and keeps the ones matching a known MCP helper target.
6. **Ancestry proof.** It walks the live ppid chain upward, at most 15 hops, stopping at `0` or `1`. An unconfirmed candidate logs `skip-kill`. A confirmed one gets `kill -15`.
7. **Failed kill.** It logs `action=kill-failed` and sets the exit code to 1.
8. **Log.** Every action goes to `~/.local/share/session-cleanup.log`, rotated through `.1`, `.2` and `.3` at 10 MB.

The matched targets are `system-skill-advisor-launcher.cjs`, `system-skill-advisor/runtime/dist/runtime/advisor-server.js`, `mcp-code-mode-launcher.cjs`, `mcp-code-mode/mcp-server/dist/index.js`, `@modelcontextprotocol/server-sequential-thinking`, `server-sequential-thinking` and `clickup-mcp-server`.

The orphan sweeper reaps stale MCP helpers and a parentless own-uid process 6+ hours old. That process must sit in the user temp dir, a Claude scratchpad or a worktree scratch folder. It can never touch a live sibling session.

### OpenCode plugin

`sessionCleanupPlugin(ctx)` registers three hooks. A disabled concern returns a no-op version of each one.

| Hook | Trigger | Action |
|---|---|---|
| `event` | `session.created` | Dedupes by session id, starts `git-primary-reconcile.sh` detached with `stdio: 'ignore'`, then runs the guards together. |
| `experimental.chat.system.transform` | First chat turn | Awaits the pending guards, then pushes `[session-cleanup] Startup safety warnings:\n<...>` onto `output.system` once. |
| `event` | `session.deleted` | Drops the session from the guarded set, the promise map and the warnings map. |
| `dispose` | Plugin teardown | Runs `session-cleanup.sh` once with `SESSION_CLEANUP_PID=''` and `SPECKIT_STOP_HOOK_ORPHAN_SWEEP='off'`. |

The plugin never writes stdout or stderr, because OpenCode paints plugin output onto the prompt line. It appends to the same bounded log instead. Every subprocess is bounded at eight seconds, then a 250 ms grace before SIGKILL. A stream past 8 KiB escalates to SIGTERM. Every error inside the plugin ends as a no-op.

A `session.created` event with no session id logs `startup guards skipped: missing session id` and returns. The startup sweep runs only when `SPECKIT_SESSION_START_ORPHAN_SWEEP` is truthy. Absent means skipped, and the warning says so.

The teardown kill is a no-op on OpenCode by design. The workspace-scoped server PID is not sufficient ownership evidence. The startup guards and the primary-reconcile are the active parts.

The shell script uses bash only and sources `hook-flags.sh` fail-open. The plugin imports Node builtins and two local modules, and neither face reaches outside the repository.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `SessionEnd [id session-cleanup, timeout 10]` | `claude/session-cleanup.sh` | `.skilled/scripts/session-cleanup.sh` | The script's log lines on stdout. The registration does not silence them. |
| Codex | `Stop [id session-cleanup, timeout 10]` | `codex/session-cleanup.sh` | `.skilled/scripts/session-cleanup.sh` | Nothing. The registration silences both streams. |
| Cursor | `sessionEnd [id session-cleanup, timeout 10]` | `cursor/session-cleanup.sh` | `.skilled/scripts/session-cleanup.sh` | The script's log lines on stdout. The registration does not silence them. |
| Devin | `SessionEnd [id session-cleanup, timeout 10]` | `devin/session-cleanup.sh` | `.skilled/scripts/session-cleanup.sh` | The script's log lines on stdout. The registration does not silence them. |
| OpenCode | `experimental.chat.system.transform, session.created, session.deleted` | `opencode/session-cleanup.js` | `.opencode/plugins/session-cleanup.js` | Nothing on the prompt line. Guard warnings arrive once in the system context. |
| Vibe | `session_start` (through the session-start hook), `session_end [id session-cleanup-end]` | `vibe/session-cleanup.mjs` | `.vibe/plugins/repo-guards/session-cleanup.mjs` | Startup warnings arrive as `additional_context`. `session_end` shows nothing, because the kill path has no session PID and the sweep signals nothing. |
| Pi | None | None | None | Nothing. No registration runs the script. |

Claude, Codex, Cursor and Devin register the script in `hook-registry.json` under the id `session-cleanup`, each with 10 seconds. Claude, Codex and Cursor answer a non-zero exit with a drift line on stderr and an envelope on stdout. Codex carries the message as a plain `systemMessage`, because `Stop` rejects `hookSpecificOutput`. Devin names no fallback, so a failed run prints nothing extra.

No registration names a path in this folder, so the links exist for browsing only. The real code stays in `.skilled/scripts/` and `.opencode/plugins/`.

OpenCode loads the plugin from `.opencode/plugins/`, so the link in `opencode/` is for browsing. The plugin runs the guards once per session id. It remembers the guarded ids in a set and drops one on `session.deleted`.

Vibe registers one `session_end` hook named `session-cleanup-end` in `.vibe/hooks.toml`. That hook runs `.vibe/plugins/repo-guards/session-cleanup.mjs`, which runs the cleanup script and then the process sweep. The cleanup script has no session PID there, so its kill path is a no-op. The sweep reports ownership evidence and signals nothing today.

`.vibe/hooks.toml` registers `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` on `session_start`, and that file calls `.vibe/plugins/repo-guards/session-cleanup.mjs`. On that event the hook fires the OpenCode plugin's `session.created` startup guards and returns their warnings as `additional_context`. On Vibe, a hook error goes to stderr and the hook exits 0, and a failed sweep is swallowed.

---

## 4. DIRECTORY TREE

```text
session-cleanup/
+-- README.md
+-- claude/   session-cleanup.sh -> ../../../scripts/session-cleanup.sh
+-- codex/    session-cleanup.sh -> ../../../scripts/session-cleanup.sh
+-- cursor/   session-cleanup.sh -> ../../../scripts/session-cleanup.sh
+-- devin/    session-cleanup.sh -> ../../../scripts/session-cleanup.sh
+-- opencode/ session-cleanup.js -> ../../../../.opencode/plugins/session-cleanup.js
`-- vibe/     session-cleanup.mjs -> ../../../../.vibe/plugins/repo-guards/session-cleanup.mjs
```

Each runtime folder holds one relative link. The link survives a move of the checkout.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.skilled/scripts/session-cleanup.sh` | The teardown script. Kill-switch, session-scoped descendant walk, target matching, re-proved-ancestry kill (TERM), orphan-sweep fallback and a rotated log. Never uses PPID. |
| `.opencode/plugins/session-cleanup.js` | The OpenCode plugin. Startup guards and a detached primary-reconcile on `session.created`, one-shot warning injection, the teardown script on `dispose`. Bounded at 8 seconds, fail-open, never writes to the TUI. |
| `.skilled/scripts/orphan-mcp-sweeper.sh` | The orphan sweeper the no-session-PID fallback delegates to. Not in this folder. |
| `.skilled/hooks/shared/hook-flags.sh` | The shared shell kill-switch resolver. Sourced fail-open. |
| `.vibe/plugins/repo-guards/session-cleanup.mjs` | The Vibe hook. Runs the startup guards at `session_start`, and the cleanup script and process sweep at `session_end`. |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Holds the `session-cleanup` entry for Claude, Codex, Cursor and Devin. |

---

## 6. CONFIGURATION

The concern is on by default. The `_DISABLED` switches are on when their value is `1`, `true`, `yes` or `on`, in any case. `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` is not a switch. It takes `1`, `on` or `live` to reap, and `dry-run`, `dryrun` or `dry` to log the candidates only.

| Variable | Effect |
|---|---|
| `SYSTEM_SESSION_CLEANUP_DISABLED=1` | Canonical kill-switch. The shell script exits 0 at once. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch. Turns off this concern along with every other repo hook. |
| `SESSION_CLEANUP_PID=<pid>` / `CLAUDE_SESSION_PID=<pid>` | The session PID the script proves ancestry against. Without it the kill is a no-op, apart from the orphan-sweep fallback. |
| `SPECKIT_STOP_HOOK_ORPHAN_SWEEP=<mode>` | No-session-PID fallback. `off` is the default and skips. `dry-run` logs candidate reaps. `1`, `on` and `live` reap. |
| `SESSION_CLEANUP_LOG_PATH=<path>` / `CLAUDE_SESSION_CLEANUP_LOG_PATH=<path>` | Log file path. The default is `~/.local/share/session-cleanup.log`. |
| `SESSION_CLEANUP_LOG_MAX_BYTES=<n>` / `CLAUDE_SESSION_CLEANUP_LOG_MAX_BYTES=<n>` | Log rotation cap. The default is 10 MB. |
| `SPECKIT_SESSION_START_ORPHAN_SWEEP=<mode>` | The OpenCode plugin's startup sweep. Absent means skipped. |

The log cap falls back to this value when the setting is not a positive integer:

```text
SESSION_CLEANUP_LOG_MAX_BYTES=10485760
```

Set a switch inline for one command or export it for a session. To keep it, write it in `.skilled/hooks/hook-flags.env`, a gitignored copy of `hook-flags.env.example`. The environment wins over the file.

---

## 7. VALIDATION

Run from the repository root.

```bash
node -e "import('./.opencode/plugins/session-cleanup.js').then(m => console.log('ok', typeof m.default))"
```

Expected result: `ok object`, the dual plugin export.

```bash
bash .skilled/scripts/session-cleanup.sh; echo "exit: $?"
```

Expected result: `exit: 0`, with an `action=skip reason=no-session-pid` log line.

```bash
SYSTEM_SESSION_CLEANUP_DISABLED=1 bash .skilled/scripts/session-cleanup.sh; echo "exit: $?"
```

Expected result: `exit: 0` and no output, because the kill-switch short-circuits before any walk.

---

## 8. RELATED

- [`../README.md`](../README.md): the hooks tree, with the switch index and the coverage matrix.
- [`../shared/README.md`](../shared/README.md): the switch resolver the script sources.
- [`../session-lifecycle/README.md`](../session-lifecycle/README.md): the session start and stop continuity hooks.
- [`../git-primary-reconcile/README.md`](../git-primary-reconcile/README.md): the reconcile script the OpenCode plugin starts on `session.created`.
- [`../git-worktree-guard/README.md`](../git-worktree-guard/README.md) and [`../git-hooks-check/README.md`](../git-hooks-check/README.md): the startup guards the OpenCode plugin runs.
- [`../../scripts/session-cleanup.sh`](../../scripts/session-cleanup.sh) and [`../../../.opencode/plugins/session-cleanup.js`](../../../.opencode/plugins/session-cleanup.js): the two faces' real homes.
