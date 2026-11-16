---
title: "Task Dispatch Hooks: Devin Adapter"
description: "Real Devin adapter that applies the shared deep-loop dispatch policy to run_subagent calls."
trigger_phrases:
  - "devin task dispatch guard"
  - "devin run subagent guard"
  - "devin deep loop guard"
version: 1.0.0.0
---

# Task Dispatch Hooks: Devin Adapter

---

## 1. OVERVIEW

`devin/` holds the Devin adapter for the Task Dispatch concern. Devin registers it in `.devin/hooks.v1.json` under `PreToolUse`, matched to `run_subagent`, with a 5-second timeout. No other runtime in the repository registers this adapter file.

The adapter reads four field aliases: `subagent_type`, `subagentType`, `agent_type` and `agentType`. It keeps the first one that holds a non-blank string. A malformed payload therefore never masks a real alias value.

It calls `evaluateDispatch` in the shared policy core. The Claude and Cursor adapters reach that same core. A blank `cwd` falls back to `DEVIN_PROJECT_DIR`, then to `process.cwd()`.

The adapter fails open on every path it takes. A disabled switch, a missing payload or an internal error all exit 0 with no output, so the dispatch proceeds.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `task-dispatch-guard.cjs` | The Devin adapter for `run_subagent` dispatches. |

The adapter approves at once when the `task-dispatch` concern is off. It approves the same way when the payload names a tool other than `run_subagent`.

On a reject it writes `permissionDecision: deny` with the core's detail as the reason. On a warn it writes `additionalContext` with the warnings joined by newlines. On an allow it writes nothing and exits 0.

Before either envelope it appends each audit through `appendRejectModeDegradedAudit` and each warning through `appendWarningLog`. Both write under the state directory that `resolveGuardPaths` returns.

---

## 3. RELATED

- [`../README.md`](../README.md): the Task Dispatch concern, its per-runtime table and its env flags.
- [`../lib/subagent-dispatch-guard.cjs`](../lib/subagent-dispatch-guard.cjs): the shared policy core the adapter calls.
- [`../../shared/hook-flags.cjs`](../../shared/hook-flags.cjs): the switch resolver the adapter imports.
- [`../../shared/hook-flags.mjs`](../../shared/hook-flags.mjs): the ESM facade over that resolver, which the Cursor adapter imports.
- [`../../../../.devin/hooks.v1.json`](../../../../.devin/hooks.v1.json): the Devin registration file.
- [`../../../skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`](../../../skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json): the registry entry that carries the same Devin binding.
