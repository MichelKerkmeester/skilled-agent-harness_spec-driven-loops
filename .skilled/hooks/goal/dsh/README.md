---
title: "Goal (DSH): Packet Context and Manage Surface"
description: "Two DSH goal adapters: the packet slice injected at agent creation and the command, tool and per-turn brief for the interactive session."
trigger_phrases:
  - "dsh goal context"
  - "dsh_goal tool"
  - "packet goal injection"
version: 1.0.0.0
---

# Goal (DSH): Packet Context and Manage Surface

---

## 1. OVERVIEW

`.skilled/hooks/goal/dsh/` holds two DSH goal adapters, one for the packet and one for the session. `goal-context.mjs` serves the packet projection, and it reads `DSH_SPEC_FOLDER` on `agent/created`. It calls `describePacketGoal` and injects the packet's `chatSlice` as one user notice. Every DSH session in a bound packet sees the directive without a management call.

`goal-manage.mjs` serves the interactive session, and it registers the `/goal-dsh` command and the `dsh_goal` tool. On `agent/pre-step` it appends the brief and resend reminder to an operator turn. It verifies on `agent/turn-stopping` and holds the `[goal_verify]` note until `agent/status` reports `idle`.

DSH loads both adapters through `.dsh/plugins/repo-guards/index.mjs`, and no other runtime runs them. A fan-out leaf gets no manage surface, so it never writes the operator's goal record.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `goal-context.mjs` | The packet projection on `agent/created`. |
| `goal-manage.mjs` | The command, tool and per-turn surface. |

`goal-context.mjs` reads `DSH_SPEC_FOLDER` and injects `packet.chatSlice` as one user notice. It injects nothing when the folder is empty or the slice is blank. It exports `ERROR_POLICY` as `fail-open`, and a failure logs `repo-guards goal-context: ...` and continues without an injection.

`goal-manage.mjs` listens on four events: `agent/created`, `agent/pre-step`, `agent/turn-stopping` and `agent/status`. It registers `/goal-dsh` and `dsh_goal` over the shared manage CLI. The tool exposes the same action set as the OpenCode goal tool.

Every command and tool call shells to `.skilled/hooks/goal/bin/goal.cjs` with `--runtime dsh`, the native session id and the resolved workspace. The per-turn brief and the turn-stopping verify, including its turn record, call the core in process. `goal-manage.mjs` exports `ERROR_POLICY` as `fail-open`, and a failure logs `repo-guards goal-manage: ...`. On `agent/pre-step` the failure returns the downstream step unchanged, so the turn continues.

Every other handler logs and returns nothing, so the event proceeds unchanged. In a leaf only the command returns an error, saying the goal surface is off. A command that cannot reach the CLI returns a failure line. An empty CLI result becomes a `STATUS=FAIL` line instead of a silent success.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/goal/tests/dsh-goal.test.mjs
```

Expected result: every test passes and the run exits 0.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern index, with the scope model and the state layout.
- [`./goal-context.mjs`](./goal-context.mjs): the packet slice adapter.
- [`./goal-manage.mjs`](./goal-manage.mjs): the command, tool and per-turn surface.
- [`../lib/goal-core.cjs`](../lib/goal-core.cjs): the shared core both adapters import.
