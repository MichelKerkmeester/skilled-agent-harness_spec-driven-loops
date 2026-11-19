---
title: "Session Cleanup Hook: Startup Guards + Teardown"
description: "Runs teardown cleanup for Claude, Codex, Cursor, Devin, OpenCode and Vibe. OpenCode also runs startup guards."
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

`session-cleanup/` indexes teardown cleanup for Claude, Codex, Cursor, Devin, OpenCode and Vibe. Pi and DSH have no adapter here.

Claude, Codex, Cursor and Devin call the [cleanup script](../../scripts/session-cleanup.sh) directly. OpenCode loads the [OpenCode plugin](../../../.opencode/plugins/session-cleanup.js), which also runs startup guards. Vibe calls that plugin through its repo-guards adapter.

For its session-scoped kills, the script checks an explicit session PID and rechecks each matched process's ancestry before sending `SIGTERM`. With no PID, `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` can select the separate orphan sweeper.

The concern key is `session-cleanup`. Set `SYSTEM_SESSION_CLEANUP_DISABLED=1` to disable it. `SYSTEM_HOOKS_DISABLED=1` disables the shared hook layer.

---

## 2. HOW IT WORKS

`session-cleanup.sh` reads `SESSION_CLEANUP_PID` first and `CLAUDE_SESSION_PID` second. With a live PID, it walks descendants with `pgrep -P`, matches known MCP helper commands and rechecks each process's live parent chain before sending `SIGTERM`. The walk stops at PID `0` or `1` and checks at most 15 parent links. A failed signal makes the script exit 1.

The no-PID fallback defaults to `off`. `dry-run` logs candidates through `orphan-mcp-sweeper.sh`. The values `dryrun` and `dry` select the same mode. Set `1` to run live. `on` and `live` also select live mode.

The OpenCode plugin deduplicates startup checks by session id on `session.created`. It starts primary reconcile in the background and runs the guard checks. `SPECKIT_SESSION_START_ORPHAN_SWEEP` enables the process sweep when its value is `1`, `true`, `yes` or `on`. The first `experimental.chat.system.transform` waits for the checks and adds warnings to `output.system` once. On `dispose`, the plugin calls the shell script with both PID values empty and the fallback set to `off`.

Vibe's `session_start` adapter calls the plugin's startup hooks and returns warnings as `additional_context`. On `session_end`, its repo-guards adapter calls plugin disposal and then runs the process sweep.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `SessionEnd` (10 seconds) | `claude/session-cleanup.sh` | `.skilled/scripts/session-cleanup.sh` | Script log lines on stdout. Failure adds a drift line and hook envelope. |
| Codex | `Stop` (10 seconds) | `codex/session-cleanup.sh` | `.skilled/scripts/session-cleanup.sh` | Success output is suppressed. Failure adds a drift line and `systemMessage`. |
| Cursor | `sessionEnd` (10 seconds) | `cursor/session-cleanup.sh` | `.skilled/scripts/session-cleanup.sh` | Script log lines on stdout. Failure adds a drift line and an allow response with `agent_message`. |
| Devin | `SessionEnd` (10 seconds) | `devin/session-cleanup.sh` | `.skilled/scripts/session-cleanup.sh` | Script log lines on stdout. No fallback message is configured. |
| OpenCode | `session.created` and `dispose`. Warnings use `experimental.chat.system.transform`. | `opencode/session-cleanup.js` | `.opencode/plugins/session-cleanup.js` | No stdout or stderr. Startup warnings enter system context once. |
| Pi | None | None | None | No cleanup check appears in the Pi session-start entry. |
| DSH | None | None | None | The guard bundle has no cleanup adapter. |
| Vibe | `session_end` | `vibe/session-cleanup.mjs` | `.vibe/plugins/repo-guards/session-cleanup.mjs` | Startup warnings use `additional_context`. A normal session end prints nothing. |

`.claude/settings.json` registers `SessionEnd` with an empty matcher and a 10-second timeout. `.codex/hooks.json` registers `Stop` with a 10-second timeout and suppresses both streams on success. `.cursor/hooks.json` registers `sessionEnd` with a 10-second timeout. `.devin/hooks.v1.json` registers `SessionEnd` with an empty matcher and a 10-second timeout. The registry records these four command bindings in `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`.

OpenCode loads plugin files from the flat `.opencode/plugins/` glob. Its guard and process-sweep children have an 8,000 ms timeout with a 250 ms kill grace. The primary reconcile runs detached with no timeout, and the end-of-session cleanup runs synchronously with the same 8,000 ms timeout.

The Pi extension entry is `.pi/extensions/session-start-advisories.ts`. Its shared check list does not include cleanup. The DSH guard bundle is `.dsh/plugins/repo-guards/index.mjs`, and it has no cleanup adapter.

`.vibe/hooks.toml` registers `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` on `session_start` and `.vibe/plugins/repo-guards/session-cleanup.mjs` on `session_end`. The Vibe wrapper reports internal errors to stderr and exits 0.

---

## 4. DIRECTORY TREE

```text
session-cleanup/
+-- README.md
+-- claude/    session-cleanup.sh -> ../../../scripts/session-cleanup.sh
+-- codex/     session-cleanup.sh -> ../../../scripts/session-cleanup.sh
+-- cursor/    session-cleanup.sh -> ../../../scripts/session-cleanup.sh
+-- devin/     session-cleanup.sh -> ../../../scripts/session-cleanup.sh
+-- opencode/  session-cleanup.js -> ../../../../.opencode/plugins/session-cleanup.js
`-- vibe/      session-cleanup.mjs -> ../../../../.vibe/plugins/repo-guards/session-cleanup.mjs
```

The Pi and DSH rows have no matching folders here. Each listed runtime folder holds the link shown in the tree.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.skilled/scripts/session-cleanup.sh` | Walks session descendants, verifies ancestry before signaling and writes cleanup logs. |
| `.skilled/scripts/orphan-mcp-sweeper.sh` | Runs the optional fallback when no session PID is available. |
| `.opencode/plugins/session-cleanup.js` | Runs startup guards and calls the cleanup script when the plugin disposes. |
| `.vibe/plugins/repo-guards/session-cleanup.mjs` | Connects Vibe session events to the OpenCode plugin and process sweep. |
| `.skilled/hooks/shared/hook-flags.sh` | Resolves the shell hook switches. |
| `.skilled/hooks/shared/hook-flags.cjs` | Resolves switches for the OpenCode plugin. |
| `.skilled/hooks/shared/hook-flags.mjs` | Exposes the shared resolver to the Vibe adapter. |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Records the Claude, Codex, Cursor and Devin command bindings. |

---

## 6. CONFIGURATION

| Variable | Effect |
|---|---|
| `SYSTEM_SESSION_CLEANUP_DISABLED=1` | Disables this concern. |
| `SYSTEM_HOOKS_DISABLED=1` | Disables the shared hook layer. |
| `SESSION_CLEANUP_PID=<pid>` | Session PID used for ancestry checks. Takes priority over `CLAUDE_SESSION_PID`. |
| `CLAUDE_SESSION_PID=<pid>` | Fallback session PID. |
| `SPECKIT_STOP_HOOK_ORPHAN_SWEEP=<mode>` | Controls the no-PID fallback. Defaults to `off`. |
| `SPECKIT_SESSION_START_ORPHAN_SWEEP=<mode>` | Enables the OpenCode process sweep for `1`, `true`, `yes` or `on`. An unset value skips it. |
| `SESSION_CLEANUP_LOG_PATH=<path>` | Overrides the cleanup log path. |
| `SESSION_CLEANUP_LOG_MAX_BYTES=<n>` | Sets the log rotation byte cap. The default is `10485760`. |

---

## 7. VALIDATION

The suite in `.opencode/plugins/tests/session-cleanup.test.cjs` checks plugin lifecycle and shell safety. It also exercises live descendant cleanup.

Run the disabled-plugin smoke check from the repository root.

```bash
SYSTEM_SESSION_CLEANUP_DISABLED=1 node --input-type=module -e "import('./.opencode/plugins/session-cleanup.js').then(({ default: plugin }) => plugin.factory().then(hooks => hooks.dispose().then(() => console.log('ok disabled'))))"
```

Expected result: `ok disabled` and exit status 0.

---

## 8. RELATED

- [Hooks index](../README.md): the hooks tree and coverage matrix.
- [OpenCode plugin index](../../../.opencode/plugins/README.md): plugin discovery and lifecycle hooks.
