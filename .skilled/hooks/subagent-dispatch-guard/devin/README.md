---
title: "Devin Task Dispatch: PreToolUse Adapter"
description: "Real Devin adapter that applies the shared deep-loop dispatch policy to run_subagent calls."
trigger_phrases:
  - "devin task dispatch guard"
  - "devin run subagent guard"
  - "devin deep loop guard"
version: 1.0.0.0
---

# Devin Task Dispatch: PreToolUse Adapter

---

## 1. OVERVIEW

`.skilled/hooks/subagent-dispatch-guard/devin/` holds the Devin adapter for the task dispatch concern. It runs at `PreToolUse`, on a `run_subagent` call, before Devin dispatches the hand-off. A policy reject prints a deny object. A warning prints an advisory. Anything else prints nothing.

`.devin/hooks.v1.json` registers the command in its `"PreToolUse"` array under the matcher `^run_subagent$`, with a 5-second timeout. The command is `bash -c 'cd "${DEVIN_PROJECT_DIR:-$PWD}" && node .skilled/hooks/subagent-dispatch-guard/devin/task-dispatch-guard.cjs'`. The entry carries no drift fallback. The `task-dispatch-guard` entry in `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` holds the same event, matcher and timeout, with `fallback` set to `none`. No other runtime loads this file.

The adapter checks the switch before it reads any stdin. `isHookEnabled('task-dispatch')` comes from `.skilled/hooks/shared/hook-flags.cjs`, so `SYSTEM_TASK_DISPATCH_DISABLED` turns this concern off and `SYSTEM_HOOKS_DISABLED` is the master switch. A disabled concern returns at once and Devin sees no output.

Then it reads the payload, and it stops when the JSON does not parse or when `tool_name` is not `run_subagent`. Otherwise it takes the agent from `target_agent=` or `Agent:` in the prompt, then from `subagent_type`, `subagentType`, `agent_type` or `agentType`. It keeps the first of those that is a non-blank string. `payload.cwd` supplies the project directory, with `DEVIN_PROJECT_DIR` or `process.cwd()` behind it. The session id comes from `payload.session_id`, and the core counts repeat hand-offs against it.

`evaluateDispatch()` in `.skilled/hooks/subagent-dispatch-guard/lib/subagent-dispatch-guard.cjs` returns the decision, the warnings and the audits. The adapter appends each audit and warning to the shared loop-guard state log, then prints one envelope on stdout. A reject sets `permissionDecision` to `deny` and puts the core's detail in `permissionDecisionReason`. A warning sets `additionalContext` with the warnings joined by newlines.

Every failure ends at exit 0 with nothing on either stream. A malformed payload, an internal error, a dispatch with no agent identity and a tool name outside `run_subagent` all let the hand-off proceed.

---

## 2. DIRECTORY TREE

The folder is flat, so the table names every file beside this README.

| File | Responsibility |
|---|---|
| `task-dispatch-guard.cjs` | The adapter. It checks the switch, reads the payload, calls `evaluateDispatch()` and prints the decision. |

---

## 3. VALIDATION

Run from the repository root.

```bash
printf '%s' '{"tool_name":"run_subagent","tool_input":{"subagent_type":"deep-review","prompt":"Deep Route: mode=research target_agent=deep-review"}}' | SYSTEM_DEEP_LOOP_GUARD_REJECT=1 node .skilled/hooks/subagent-dispatch-guard/devin/task-dispatch-guard.cjs
```

Expected result: one JSON line with `permissionDecision` set to `deny` and a `permissionDecisionReason` that reports the mode mismatch, then exit status 0. The payload declares `mode=research` for `deep-review`, and the mode registry lists that agent for `review` only, so the reject branch runs.

---

## 4. RELATED

- [`../README.md`](../README.md): the task dispatch concern, the runtime table and the flag list.
- [`../lib/subagent-dispatch-guard.cjs`](../lib/subagent-dispatch-guard.cjs): the policy core that returns the decision.
- [`../../shared/hook-flags.cjs`](../../shared/hook-flags.cjs): the resolver behind `isHookEnabled()`.
- [`../../../skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`](../../../skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json): the registry entry with the same Devin binding.
- [`../../../../.devin/hooks.v1.json`](../../../../.devin/hooks.v1.json): the Devin hook config that registers this adapter.
