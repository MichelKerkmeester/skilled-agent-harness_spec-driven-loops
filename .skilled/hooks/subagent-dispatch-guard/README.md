---
title: "Task Dispatch Guard: Deep-Loop and Child Model Policy"
description: "Checks dispatches for mode mismatches and repeated hand-offs across runtime adapters. A separate Claude hook checks child model overrides when the parent uses a restricted model."
trigger_phrases:
  - "task dispatch guard"
  - "deep loop guard"
  - "fable subagent guard"
  - "opencode task dispatch guard"
  - "opencode deep loop guard"
  - "opencode task execute before"
importance_tier: "normal"
contextType: "reference"
---

# Task Dispatch Guard: Deep-Loop and Child Model Policy

---

## 1. OVERVIEW

`subagent-dispatch-guard/` checks subagent hand-offs before covered runtimes run them. Its shared core compares declared modes with the deep-loop registry and tracks repeated hand-offs to loop executors. Claude also runs a separate child-model check.

The shared policy lives in `lib/subagent-dispatch-guard.cjs`. The Claude model check lives in `claude/fable-subagent-guard.mjs`.

The concern key is `task-dispatch`. Its kill switch is `SYSTEM_TASK_DISPATCH_DISABLED`. `SYSTEM_HOOKS_DISABLED=1` is the master switch.

---

## 2. HOW IT WORKS

`evaluateDispatch` returns a decision and optional details.

| Decision | Meaning |
|---|---|
| `allow` | The core found no policy issue. |
| `warn` | The core returned warning text for the adapter. |
| `reject` | The core returned a rejection detail. |

`resolveTargetIdentity` reads `target_agent=@name` or an `Agent: @name` line from the prompt. It falls back to the subagent type unless that value is `general`. `loadRegistryAgents` reads `.skilled/skills/system-deep-loop/mode-registry.json`. For a registered target, a declared mode outside its registered modes warns when `SYSTEM_DEEP_LOOP_GUARD_REJECT` is unset and rejects when it is `1`. The Vibe adapter sets it to `1` when unset, so Vibe rejects a mismatch by default.

`isCommandDrivenIteration` checks the `Iteration: N of M` marker and a `Config:` path to an existing JSON file inside the project whose object has a string `mode` and a numeric `maxIterations`. For dispatches with a session ID, `recordLoopDispatch` counts non-command-driven hand-offs to `deep-research` and `deep-review`. The second such hand-off warns. The third rejects when `SYSTEM_DEEP_LOOP_GUARD_REJECT_LOOP=1`.

The shared-core adapters append warnings and degraded-mode audit lines to `.skilled/skills/.state/loop-guard/guard-warnings.log` when the state directory is writable. The core stores the loop counts there. OpenCode runs `sweepStaleLoopGuardStates` when a session starts.

Claude's `fable-subagent-guard.mjs` reads the last main-loop model in the transcript tail and skips sidechain entries. When that model matches `fable`, the hook denies a fork or a dispatch without an allowed model override. A missing or unreadable transcript returns without output.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `PreToolUse` on `Task` and `Task|Agent` | `claude/task-dispatch-guard.cjs` and `claude/fable-subagent-guard.mjs` | `.skilled/hooks/subagent-dispatch-guard/claude/task-dispatch-guard.cjs` and `.skilled/hooks/subagent-dispatch-guard/claude/fable-subagent-guard.mjs` | Denies policy rejects and adds shared-core warnings as context. Malformed input or an internal error approves silently. The model check denies calls without an allowed override. |
| Codex | None | None | None | No task-dispatch adapter runs. |
| Cursor | `preToolUse` on `Task` | `cursor/task-dispatch-guard.mjs` | `.skilled/hooks/subagent-dispatch-guard/cursor/task-dispatch-guard.mjs` | Returns an allow or deny object. Warnings appear in `agent_message`. A spawn error or non-JSON output allows the call. |
| Devin | `PreToolUse` on `run_subagent` | `devin/task-dispatch-guard.cjs` | `.skilled/hooks/subagent-dispatch-guard/devin/task-dispatch-guard.cjs` | Denies policy rejects and adds warnings as `additionalContext`. Malformed input or an internal error approves silently. |
| OpenCode | `tool.execute.before` on `task` and `session.created` for the state sweep | `opencode/system-deep-loop-guard.js` | `.opencode/plugins/system-deep-loop-guard.js` | Throws on a policy reject and swallows other plugin errors. Warnings go to the shared state log. |
| Pi | `tool_call` on `subagent` | `pi/task-dispatch-guard.ts` | `.skilled/hooks/subagent-dispatch-guard/pi/task-dispatch-guard.ts` | Returns advisory text in `reason` and never blocks the call. An error returns no reason. |
| DSH | `tools/pre-execute` on `subagent` or `subagent_fork` | `dsh/task-dispatch-guard.mjs` | `.skilled/hooks/subagent-dispatch-guard/dsh/task-dispatch-guard.mjs` | Logs warnings and audits, then calls `next()`. An error is logged and the hand-off proceeds. |
| Vibe | `pre_tool` on `agents_spawn` | `vibe/deep-loop-guard.mjs` | `.vibe/plugins/repo-guards/deep-loop-guard.mjs` | Denies policy rejects and writes warnings to stderr. An internal error writes a warning and exits 0. |

Claude registers both guards in `.claude/settings.json` under `PreToolUse`. Its matchers are `Task` and `Task|Agent`, with a 5-second timeout for each. Codex has no task-dispatch entry in `.codex/hooks.json`.

Cursor registers `preToolUse` with the `Task` matcher in `.cursor/hooks.json` and sets a 10-second timeout. Devin registers `PreToolUse` in `.devin/hooks.v1.json` with the `^run_subagent$` matcher and a 5-second timeout.

OpenCode discovers JavaScript plugins through the flat glob over `.opencode/plugins/`. Pi's extension entry is `.pi/extensions/task-dispatch-guard.ts`. The DSH `repo-guards` bundle imports this adapter through `.dsh/plugins/repo-guards/index.mjs`. Vibe registers `deep-loop-guard` in `.vibe/hooks.toml`.

The OpenCode and Vibe entries in this folder are links to their runtime files.

---

## 4. DIRECTORY TREE

```text
subagent-dispatch-guard/
+-- claude/     task-dispatch-guard.cjs, fable-subagent-guard.mjs
+-- cursor/     task-dispatch-guard.mjs
+-- devin/      task-dispatch-guard.cjs
+-- dsh/        task-dispatch-guard.mjs
+-- lib/        subagent-dispatch-guard.cjs
+-- opencode/   system-deep-loop-guard.js (link)
+-- pi/         task-dispatch-guard.ts
+-- tests/      dsh-task-dispatch-guard.test.mjs
`-- vibe/      deep-loop-guard.mjs (link)
```

The OpenCode link points to `.opencode/plugins/system-deep-loop-guard.js`. The Vibe link points to `.vibe/plugins/repo-guards/deep-loop-guard.mjs`.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/subagent-dispatch-guard.cjs` | Exports the shared mode and loop-repeat policy. |
| `.claude/settings.json` | Registers both Claude adapters. |
| `.codex/hooks.json` | Codex hook settings. It has no task-dispatch entry. |
| `.cursor/hooks.json` | Registers the Cursor Task adapter. |
| `.devin/hooks.v1.json` | Registers the Devin `run_subagent` adapter. |
| `.opencode/plugins/system-deep-loop-guard.js` | OpenCode plugin that calls the shared core. |
| `.pi/extensions/task-dispatch-guard.ts` | Pi extension re-export. |
| `.dsh/plugins/repo-guards/index.mjs` | Registers the adapter in the DSH guard bundle. |
| `.vibe/hooks.toml` | Registers the Vibe pre-tool hook. |
| `.skilled/hooks/shared/hook-flags.cjs` | Resolves the concern switch and the master switch. |

---

## 6. CONFIGURATION

The concern is on by default. Its kill switches resolve from the process environment or `.skilled/hooks/hook-flags.env`. The environment wins over that file.

| Variable | Effect |
|---|---|
| `SYSTEM_TASK_DISPATCH_DISABLED=1` | Disables this concern on every runtime with an adapter. |
| `MK_TASK_DISPATCH_DISABLED=1` | Legacy alias for the concern switch. |
| `SYSTEM_HOOKS_DISABLED=1` | Disables this concern and the other hooks that honor the master switch. |
| `SYSTEM_DEEP_LOOP_GUARD_REJECT=1` | Rejects a mode mismatch instead of warning. The core reads exactly `1`. |
| `SYSTEM_DEEP_LOOP_GUARD_REJECT_LOOP=1` | Rejects the third non-command-driven hand-off. The core reads exactly `1`. |
| `SYSTEM_DEEP_LOOP_GUARD_WARNING_LOG_MAX_BYTES` | Warning-log size cap. The default is 256 KiB. |
| `SYSTEM_DEEP_LOOP_GUARD_ACTIVE_RETENTION_DAYS` | Days before the sweep archives an untouched session state file. The default is 2. |
| `SYSTEM_DEEP_LOOP_GUARD_ARCHIVE_RETENTION_DAYS` | Days before the sweep removes an archived state file. The default is 90. |
| `SYSTEM_DEEP_LOOP_GUARD_SWEEP_INTERVAL_MS` | Sweep throttle. The default is one hour. |

The kill switch accepts all four values: `1`, `true`, `yes` and `on`, regardless of case. The two reject switches and tuning values are read from the process environment.

---

## 7. VALIDATION

The [Claude adapter suite](../../../.opencode/plugins/tests/claude-task-dispatch-guard.test.cjs) exercises its hook. The [OpenCode plugin suite](../../../.opencode/plugins/tests/system-deep-loop-guard.test.cjs) covers the plugin. The [DSH adapter suite](./tests/dsh-task-dispatch-guard.test.mjs) covers its bundle adapter.

Run this smoke check from the repository root.

```bash
SYSTEM_TASK_DISPATCH_DISABLED=1 node .skilled/hooks/subagent-dispatch-guard/claude/task-dispatch-guard.cjs < /dev/null
```

Expected result: no output and exit status 0.

---

## 8. RELATED

- [hooks index](../README.md): the hook coverage matrix and switch index.
- [shared switch resolver](../shared/README.md): the shared kill-switch rules.

