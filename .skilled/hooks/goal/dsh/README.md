---
title: "Goal (DSH): Packet Context and Manage Surface"
description: "Two DSH adapters for the goal concern: the packet slice injected on agent creation and the goal-dsh command, dsh_goal tool and per-turn brief for the interactive session."
trigger_phrases:
  - "dsh goal context"
  - "dsh_goal tool"
  - "packet goal injection"
version: 1.0.0.0
---

# Goal (DSH): Packet Context and Manage Surface

---

## 1. OVERVIEW

`goal/dsh/` holds the two DSH goal adapters. `goal-context.mjs` serves the packet projection. On `agent/created` it reads `DSH_SPEC_FOLDER`, calls `describePacketGoal` and injects the packet's `chatSlice`, so every DSH session in a bound packet sees the directive without a management call.

`goal-manage.mjs` serves the interactive session. It registers the `/goal-dsh` command and the `dsh_goal` tool, injects the brief and resend reminder on `agent/pre-step` when the step claims an operator message, verifies on `agent/turn-stopping`, then holds the `[goal_verify]` note until `agent/status` reports `idle`. Every write shells to `.skilled/hooks/goal/bin/goal.cjs` with `--runtime dsh`, the native session id and the resolved workspace. A fan-out leaf gets no manage surface.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `goal-context.mjs` | `agent/created` | Reads `DSH_SPEC_FOLDER`, describes the packet goal against the agent's workspace and injects `packet.chatSlice` as one user notice. Injects nothing when the folder is empty or the slice is blank. | Exports `ERROR_POLICY` as `fail-open`. Logs `repo-guards goal-context: ...` and continues without an injection. |
| `goal-manage.mjs` | `agent/created`, `agent/pre-step`, `agent/turn-stopping`, `agent/status` | Registers `/goal-dsh` and `dsh_goal`, exposes the same action set as the OpenCode tool, runs the manage CLI, appends the brief and reminder to operator turns and queues one verify note for the next idle status. | Exports `ERROR_POLICY` as `fail-open`. Logs `repo-guards goal-manage: ...` and returns the downstream step unchanged. A leaf returns an error only on the command. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the action set, the scope model and the state layout.
- [`./goal-context.mjs`](./goal-context.mjs): the packet slice adapter.
- [`./goal-manage.mjs`](./goal-manage.mjs): the command, tool and per-turn surface.
- [`../lib/goal-core.cjs`](../lib/goal-core.cjs): the shared core both adapters import.
