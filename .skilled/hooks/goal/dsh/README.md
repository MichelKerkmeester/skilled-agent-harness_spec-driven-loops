---
title: "DSH Goal: agent/created, agent/pre-step, agent/turn-stopping and agent/status Adapters"
description: "Two DSH goal adapters: the packet slice injected at agent creation and the command, tool and per-turn brief for the interactive session."
trigger_phrases:
  - "dsh goal context"
  - "dsh_goal tool"
  - "packet goal injection"
version: 1.0.0.0
---

# DSH Goal: agent/created, agent/pre-step, agent/turn-stopping and agent/status Adapters

---

## 1. OVERVIEW

`.skilled/hooks/goal/dsh/` holds the DSH adapters for the goal concern. `goal-context.mjs` adds the packet directive when a DSH agent starts. `goal-manage.mjs` adds the management surface to an interactive session, so an operator can read the goal or change its state from that session.

`goal-context.mjs` writes one handler, `ctx.on('agent/created', ...)`. `goal-manage.mjs` writes four handlers: `agent/created`, `agent/pre-step`, `agent/turn-stopping`, `agent/status`.

`.dsh/plugins/repo-guards/index.mjs` is the file that registers both adapters. Its imports, `.dsh/plugins/repo-guards/adapters/goal-context.mjs` and `.dsh/plugins/repo-guards/adapters/goal-manage.mjs`, are links that resolve into this folder. It calls `registerGoalContext(ctx, options.goalContext)`. It calls `registerGoalManage` through `withServices(ctx, ['commands', 'tools'], ...)`, so that adapter registers only after the command and tool services exist.

`goal-context.mjs` reads `DSH_SPEC_FOLDER` first. An empty value or a value that is not a string ends the handler with no injection. Otherwise it calls `describePacketGoal` with the agent's working directory. The returned `chatSlice` becomes one user message.

`goal-manage.mjs` reads the goal switch first. `core.isPluginDisabled()` reaches `isHookEnabled('goal', env)` in `.skilled/hooks/shared/hook-flags.cjs`. Setting `OPENCODE_GOAL_DISABLED` stops registration. The master switch `SYSTEM_HOOKS_DISABLED` stops it too. `goal-context.mjs` reaches the same resolver through `describePacketGoal`, which throws `PLUGIN_DISABLED` when the concern is off. That handler catches the error and injects nothing.

On an operator turn the adapter appends the brief that the core renders. The brief is empty when no goal is active or a bound packet has gone, so the turn proceeds without one. A turn that ends without meeting the goal leaves a `[goal_verify]` note for the next idle.

Both files export `ERROR_POLICY` as `fail-open`. A failure in `goal-context.mjs` writes one `repo-guards goal-context: ...` line through `ctx.logger.warn` and returns `undefined`, so the agent starts without the packet slice. A failure in `goal-manage.mjs` writes `repo-guards goal-manage: ...` and leaves the event result unchanged, so the turn continues. A command that throws returns `STATUS=FAIL` with `code=GOAL_CLI_UNAVAILABLE`. An empty CLI reply becomes a `STATUS=FAIL` line with `code=GOAL_CLI_EMPTY`. In a fan-out leaf the command returns an error that reads `The goal surface is off in a fan-out leaf.` The tool is never registered.

---

## 2. DIRECTORY TREE

```text
dsh/
+-- README.md
+-- goal-context.mjs
`-- goal-manage.mjs
```

The folder is flat, so this table names every file beside this README.

| File | Responsibility |
|---|---|
| `goal-context.mjs` | The packet adapter. It reads `DSH_SPEC_FOLDER`, calls `describePacketGoal` and injects the `chatSlice` as one user message. |
| `goal-manage.mjs` | The session adapter. It registers `/goal-dsh` and the `dsh_goal` tool, appends the brief to operator turns, verifies a stopping turn and delivers the queued note at idle. |

`goal-manage.mjs` calls `.skilled/hooks/goal/bin/goal.cjs` for each command and tool call, with `--runtime dsh`, the native session id and the resolved workspace. The per-turn brief and the turn record call the core in process.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/goal/tests/dsh-goal.test.mjs
```

Expected result: every test passes and the command exits 0, with `fail 0` in the summary.

The suite imports both adapter files. It replays the command and tool envelopes, the leaf gate, the per-turn brief, the verify note at idle and the packet slice.

---

## 4. RELATED

- [`../README.md`](../README.md): the goal concern, with the runtime coverage table and the state layout.
- [`./goal-context.mjs`](./goal-context.mjs): the packet adapter.
- [`./goal-manage.mjs`](./goal-manage.mjs): the session adapter.
- [`../lib/goal-core.cjs`](../lib/goal-core.cjs): the core both adapters import.
- [`../../shared/hook-flags.cjs`](../../shared/hook-flags.cjs): the switch resolver behind `isPluginDisabled`.
- [`../../../../.dsh/plugins/repo-guards/index.mjs`](../../../../.dsh/plugins/repo-guards/index.mjs): the bundle that registers both adapters.
