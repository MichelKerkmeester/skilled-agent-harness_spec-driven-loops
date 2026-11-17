---
title: "Pi Task Dispatch Guard: tool_call Adapter"
description: "Pi extension that turns shared deep-loop dispatch verdicts into advisory reasons on subagent calls."
trigger_phrases:
  - "pi task dispatch guard"
  - "pi subagent guard"
  - "pi deep loop guard"
version: 1.0.0.0
---

# Pi Task Dispatch Guard: tool_call Adapter

---

## 1. OVERVIEW

`.skilled/hooks/subagent-dispatch-guard/pi/` holds the Pi adapter for the Task Dispatch Guard concern. It runs at `tool_call` and turns the shared policy's verdict into advisory text on a `subagent` call. That text never blocks the call.

Pi loads the adapter through [the Pi extension entry](../../../../.pi/extensions/task-dispatch-guard.ts). That entry is a re-export statement pointing at this folder's adapter, and it carries no fallback. If the target file is missing, the import fails. The entry names no event, so the adapter registers one itself with `pi.on('tool_call', ...)`. Its handler returns at once for any tool name other than `subagent`.

The adapter checks `isHookEnabled('task-dispatch')` before it registers a handler, so a disabled concern adds no handler at all. The call reaches `.skilled/hooks/shared/hook-flags.mjs`, the ESM facade over the CommonJS resolver, so `SYSTEM_HOOKS_DISABLED` is the master switch. The concern key is `task-dispatch` and its own switch is `SYSTEM_TASK_DISPATCH_DISABLED`.

The handler reads `event.toolName` first. It then builds a request from `event.input`. A call with a string `action` or `resume` returns at once, and so does one with no prompt. The prompt is the first non-blank of `task` or `message`, with `workflowScript` after both. The target is the first non-blank of `agent` or `subagent_type`, and `subagentType` answers when those are blank.

The request goes to `evaluateDispatch` with the session id from `ctx.sessionManager.getSessionId()` and `ctx.cwd` as the project directory. `process.env` arrives as the environment. The adapter resolves the state folder with `resolveGuardPaths(ctx.cwd)` and appends each audit through `appendRejectModeDegradedAudit` and each warning through `appendWarningLog`. Both write to `guard-warnings.log` under `.skilled/skills/.state/loop-guard/` in the project.

A reject returns its detail as `reason` and appends that detail to the log. A warn returns the warnings joined with a newline. Every failure ends the same way. A throw returns nothing, so Pi runs the call with no advisory.

---

## 2. DIRECTORY TREE

The folder is flat and holds no test of its own.

| File | Responsibility |
|---|---|
| `task-dispatch-guard.ts` | The adapter. It checks the concern switch, registers the `tool_call` handler and calls the shared core for a `subagent` call. |

---

## 3. VALIDATION

Run the command from the repository root.

```bash
(cd .skilled/skills/system-spec-kit && npx vitest run --project root runtime/tests/hook-adapter-path-parity.vitest.ts)
```

Expected result: every test passes and the command exits 0. The suite follows each re-export entry in `.pi/extensions/`, this adapter's included, and fails when the file it re-exports is missing.

---

## 4. RELATED

- [Task Dispatch Guard README](../README.md): the concern, its runtime table and its switches.
- [Shared dispatch core](../lib/subagent-dispatch-guard.cjs): the policy core behind `evaluateDispatch`.
- [Pi extension entry](../../../../.pi/extensions/task-dispatch-guard.ts): the re-export that Pi loads.
- [Shared switch resolver](../../shared/hook-flags.mjs): the ESM facade over `hook-flags.cjs`.
