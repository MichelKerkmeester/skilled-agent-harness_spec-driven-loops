---
title: "Session Cleanup Hook: Startup Guards + Teardown"
description: "Runs bounded startup guards and teardown cleanup across the editor runtimes plus the OpenCode plugin. The shell script kills only proven session-descendant MCP helpers; the OpenCode plugin also runs startup guards and primary-reconcile on session start."
trigger_phrases:
  - "session cleanup hook"
  - "startup guard teardown"
  - "mcp helper teardown"
importance_tier: "reference"
contextType: "reference"
---

# Session Cleanup Hook: Startup Guards + Teardown

---

## 1. OVERVIEW

`session-cleanup/` is the index for the concern that runs bounded startup guards and teardown cleanup. It has two faces that share one teardown script:

- **Shell script** (`.opencode/scripts/session-cleanup.sh`) backs the editor runtimes at session teardown. It kills only MCP helper processes it can **prove** are descendants of an explicit session PID, re-proving ancestry immediately before each kill, so a teardown never reaches into a sibling session's transports. There is deliberately no fallback to the hook's PPID: under a shared terminal that PPID can resolve to an ancestor common to many live sessions.
- **OpenCode plugin** (`.opencode/plugins/session-cleanup.js`) runs the same teardown script on dispose, and additionally runs startup guards (worktree-guard, check-git-hooks, git-live-follow `--start`) plus a backgrounded primary-reconcile on `session.created`, surfacing any guard warnings once per session through the system context.

Both faces are bounded and fail-open: subprocesses wait at most eight seconds (plugin) or run inline (shell), and any failure is a no-op that never blocks session start or teardown. Neither writes into spec docs.

---

## 2. WHAT IT DOES

### Shell script (teardown)

`session-cleanup.sh` runs at session teardown (Claude `SessionEnd`, OpenCode `dispose`), never per response. Session identity comes only from the environment (`SESSION_CLEANUP_PID` / `CLAUDE_SESSION_PID`), never from stdin, so the same script is correct from any teardown invocation point.

1. Checks the shared kill-switch (`hook_enabled session-cleanup`, fail-open if the resolver is absent). Disabled → exit 0.
2. With no session PID, runs the orphan-sweep fallback controlled by `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` (default `off` → skip no-op; `dry-run` → log candidate reaps; `1`/`on`/`live` → reap ownerless MCP processes via `orphan-mcp-sweeper.sh`, which can never touch a live sibling session). Then exits.
3. With a session PID that is not alive → skip. Otherwise walks the descendant tree (`pgrep -P`) and, for each descendant whose command matches a known MCP helper target, **re-proves ancestry at kill time** by walking the live ppid chain upward (max 15 hops, stopping at `0`/`1` = launchd/init). Ancestry not confirmed → `skip-kill`. Confirmed → `kill -15` (TERM).
4. Logs every action to `~/.local/share/session-cleanup.log` (10 MB, rotated through `.1`/`.2`/`.3`).

The matched MCP helper targets are: `system-skill-advisor-launcher.cjs`, `system-skill-advisor/mcp-server/dist/*advisor-server.js`, `mcp-code-mode-launcher.cjs`, `mcp-code-mode/mcp-server/dist/index.js`, `@modelcontextprotocol/server-sequential-thinking`, `server-sequential-thinking`, and `clickup-mcp-server`.

### OpenCode plugin (startup guards + teardown)

`sessionCleanupPlugin(ctx)` registers three hooks:

| Hook | Trigger | Action |
|---|---|---|
| `event` (`session.created`) | New session | Dedupes by session id, background-spawns `git-primary-reconcile.sh` (detached, `stdio: 'ignore'`), then runs the guard scripts synchronously: `worktree-guard.sh`, `check-git-hooks.sh`, `git-live-follow.sh --start`. Captures their stdout/stderr as per-session warnings. |
| `experimental.chat.system.transform` | First chat turn after startup | Injects `[session-cleanup] Startup safety warnings:\n<...>` into `output.system` once, then clears the warning so it is one-shot. |
| `event` (`session.deleted`) | Session removed | Drops the session from the guarded/warnings maps. |
| `dispose` | Plugin teardown | Runs `session-cleanup.sh` once with `SESSION_CLEANUP_PID=''` and `SPECKIT_STOP_HOOK_ORPHAN_SWEEP='off'`. Process signaling stays disabled until the host can prove a session-owned PID; the workspace-scoped server PID is not sufficient ownership evidence, so on OpenCode the teardown kill is a no-op by design and the startup guards + primary-reconcile are the active parts. |

The plugin never writes stdout/stderr (OpenCode's TUI paints plugin console output onto the prompt input line); it logs to the same bounded workspace log instead.

---

## 3. PER-RUNTIME DELIVERY

| Runtime | Adapter | Event / wiring | Delivery |
|---|---|---|---|
| **Claude** | `claude/session-cleanup.sh` (symlink → `../../../scripts/session-cleanup.sh`) | `SessionEnd` teardown | Kills proven session-descendant MCP helpers (TERM); bounded log; never uses PPID |
| **Codex** | `codex/session-cleanup.sh` (symlink) | Session teardown | Same |
| **Cursor** | `cursor/session-cleanup.sh` (symlink) | Session teardown | Same |
| **Devin** | `devin/session-cleanup.sh` (symlink) | Session teardown | Same |
| **OpenCode** | `.opencode/plugins/session-cleanup.js` (mirrored at `opencode/`) | Plugin `event` on `session.created` / `session.deleted`; `experimental.chat.system.transform`; `dispose` | Startup guards + backgrounded primary-reconcile on start; one-shot warning injection; teardown script on dispose (kill disabled by design) |
| **Pi** | — | — | Not applicable. |

The hub holds relative symlinks for the editor runtimes and a browsability symlink for the OpenCode plugin.

---

## 4. DIRECTORY TREE

```text
session-cleanup/
+-- README.md
+-- claude/   session-cleanup.sh (symlink -> ../../../scripts/session-cleanup.sh)
+-- codex/    session-cleanup.sh (symlink)
+-- cursor/   session-cleanup.sh (symlink)
+-- devin/    session-cleanup.sh (symlink)
`-- opencode/ session-cleanup.js (browsability symlink -> ../../../plugins/session-cleanup.js)
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.opencode/scripts/session-cleanup.sh` | The teardown script. Session-scoped descendant walk, target-command matching, re-proven-ancestry kill (TERM), orphan-sweep fallback, bounded rotated log. Never uses PPID. |
| `.opencode/plugins/session-cleanup.js` | The OpenCode plugin. Startup guards + backgrounded primary-reconcile on `session.created`, one-shot warning injection, teardown script on `dispose`. Bounded (8s subprocess timeout), fail-open, never writes to the TUI. |
| `.opencode/scripts/orphan-mcp-sweeper.sh` | The ownerless-MCP sweeper the no-session-PID fallback delegates to (reaps only reparented MCP processes). Not in this folder. |
| `.opencode/hooks/shared/hook-flags.sh` | The shared shell kill-switch resolver (`hook_enabled session-cleanup`). Sourced fail-open. |

---

## 6. CONFIGURATION

The concern is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive) for the shared resolver.

| Variable | Effect |
|---|---|
| `SYSTEM_SESSION_CLEANUP_DISABLED=1` | Canonical kill-switch. The shell script short-circuits to exit 0. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |
| `SESSION_CLEANUP_PID=<pid>` / `CLAUDE_SESSION_PID=<pid>` | The session PID the shell script proves ancestry against. Without it the teardown kill is a no-op (orphan-sweep fallback aside). |
| `SPECKIT_STOP_HOOK_ORPHAN_SWEEP=<mode>` | No-session-PID fallback: `off` (default, skip), `dry-run` (log candidate reaps), `1`/`on`/`live` (reap ownerless MCP processes). |
| `SESSION_CLEANUP_LOG_PATH=<path>` / `CLAUDE_SESSION_CLEANUP_LOG_PATH=<path>` | Log file path (default `~/.local/share/session-cleanup.log`). |
| `SESSION_CLEANUP_LOG_MAX_BYTES=<n>` / `CLAUDE_SESSION_CLEANUP_LOG_MAX_BYTES=<n>` | Log rotation cap (default `10485760`, 10 MB). |

Set a flag inline for one command, export it for a session, or persist it in `.opencode/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Proven ancestry only | The shell script kills only descendants it can prove at kill time via the live ppid chain. No PPID fallback: a shared terminal's PPID is common to many sessions. Missing session identity → no-op (or orphan-sweep when explicitly enabled). |
| Bounded | Plugin subprocesses: 8s timeout, 4 KiB capture. Shell: inline, rotated 10 MB log. |
| Fail-open | Any guard, kill, spawn, or log failure is a no-op that never blocks session start or teardown. |
| No spec writes | Sweeps runtime/MCP state only; never touches spec-folder docs. |
| OpenCode kill disabled by design | The plugin's `dispose` runs the teardown script with no session PID, so the kill path is a no-op on OpenCode; the startup guards + primary-reconcile are the active parts. |
| Imports | Shell: bash only, sources `hook-flags.sh` fail-open. Plugin: Node builtins only. Nothing outside the repo. |
| Real code | Stays in `.opencode/scripts/` and `.opencode/plugins/`; the hub entries are relative symlinks. |

---

## 8. VALIDATION

```bash
# Verify the OpenCode plugin loads without error
node -e "import('./.opencode/plugins/session-cleanup.js').then(m => console.log('ok', typeof m.default))"
```

Expected result: `ok function`.

```bash
# Verify the shell script is a no-op without a session PID (default orphan-sweep off)
bash .opencode/scripts/session-cleanup.sh; echo "exit: $?"
```

Expected result: `exit: 0`, with an `action=skip reason=no-session-pid` log line.

```bash
# Verify the kill-switch short-circuits the shell script
SYSTEM_SESSION_CLEANUP_DISABLED=1 bash .opencode/scripts/session-cleanup.sh; echo "exit: $?"
```

Expected result: `exit: 0`, no output (kill-switch short-circuits before any walk).

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`../session-lifecycle/README.md`](../session-lifecycle/README.md): the related session start/stop continuity hooks.
- [`../git-primary-reconcile/README.md`](../git-primary-reconcile/README.md): the reconcile script the OpenCode plugin background-spawns on `session.created`.
- [`../git-worktree-guard/README.md`](../git-worktree-guard/README.md), [`../git-hooks-check/README.md`](../git-hooks-check/README.md): the startup guards the OpenCode plugin runs on `session.created`.
- [`../../scripts/session-cleanup.sh`](../../scripts/session-cleanup.sh), [`../../plugins/session-cleanup.js`](../../plugins/session-cleanup.js): the two faces' real homes.
