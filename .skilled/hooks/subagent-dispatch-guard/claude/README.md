---
title: "Task Dispatch Hooks: Claude Adapters"
description: "The two Claude adapters for deep-loop dispatch policy and the Fable-model subagent guard."
trigger_phrases:
  - "claude task dispatch guard"
  - "fable subagent guard"
  - "claude deep loop guard"
version: 1.0.0.0
---

# Task Dispatch Hooks: Claude Adapters

---

## 1. OVERVIEW

`claude/` holds the two Claude adapters for the Task Dispatch concern. Claude wires both to `PreToolUse` in `.claude/settings.json`. The deep-loop guard runs on `Task` and the Fable guard runs on `Task` and `Agent`.

The deep-loop guard evaluates the shared core and reports its verdict. A reject becomes `permissionDecision: deny` with the core's detail. A warning becomes `additionalContext` and leaves the permission decision alone.

The Fable guard reads the main-loop model from the session transcript. It denies a dispatch that would inherit Fable into a subagent. Both adapters check `isHookEnabled('task-dispatch')` first, so `SYSTEM_TASK_DISPATCH_DISABLED=1` silences them.

Claude registers `task-dispatch-guard.cjs` on the `Task` matcher and `fable-subagent-guard.mjs` on `Task|Agent`. Cursor's own adapter spawns `task-dispatch-guard.cjs` by repository-relative path. No other runtime runs either file.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `task-dispatch-guard.cjs` | The deep-loop adapter. It calls `evaluateDispatch` and returns a deny or a warning. |
| `fable-subagent-guard.mjs` | The Fable adapter. It denies a dispatch that would inherit Fable into a subagent. |

`task-dispatch-guard.cjs` reads `subagent_type`, the prompt and the project directory. It calls `evaluateDispatch` from the shared core. It appends the audits and warnings to the state directory the core resolves. A reject writes `permissionDecision: deny` with the core's detail. A warning writes `additionalContext` and leaves the permission decision alone. A missing payload, another tool name or an internal error all exit 0 with no output.

`fable-subagent-guard.mjs` reads the main-loop model from the last `model` field in `payload.transcript_path`. It reads the final 2 MB of the transcript and skips sidechain entries. It acts only while a Fable model drives the main loop. It denies `fork`, a missing `model` or a model outside `opus` or `sonnet`. A `claude-` prefixed `opus` or `sonnet` id also passes. A missing or unreadable transcript, malformed stdin or another tool name returns with no output.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .opencode/plugins/tests/claude-task-dispatch-guard.test.cjs .opencode/plugins/tests/claude-fable-subagent-guard.test.cjs
```

Each test file spawns an adapter from this folder. A clean run reports no failing test.

---

## 4. RELATED

- [`../README.md`](../README.md): the Task Dispatch concern, its per-runtime table and its env flags.
- [`../lib/subagent-dispatch-guard.cjs`](../lib/subagent-dispatch-guard.cjs): the shared policy core the deep-loop guard calls.
- [`../../shared/hook-flags.cjs`](../../shared/hook-flags.cjs): the switch resolver the deep-loop guard imports.
- [`../../shared/hook-flags.mjs`](../../shared/hook-flags.mjs): the ESM facade over that resolver, which the Fable guard imports.
- [`../../../../.claude/settings.json`](../../../../.claude/settings.json): the Claude settings file that wires both events.
