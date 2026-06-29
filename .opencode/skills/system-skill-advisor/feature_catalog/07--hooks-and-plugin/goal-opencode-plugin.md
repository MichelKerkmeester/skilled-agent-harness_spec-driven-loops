---
title: "Goal OpenCode Plugin"
description: "OpenCode plugin and /goal command for passive session-goal injection, per-session state, supervisor verification and guarded continuation."
trigger_phrases:
  - "goal opencode plugin"
  - "/goal command"
  - "mk_goal"
  - "active goal injection"
  - "MK_GOAL_AUTONOMY"
version: 0.8.0.33
---

# Goal OpenCode Plugin

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The `/goal` OpenCode plugin persists a session-local objective and injects a compact active-goal block into the system context so long-running work stays oriented toward the same completion condition.

This entry lives with the Skill Advisor hook/plugin documentation because it uses the same OpenCode plugin surface: command markdown stays state-free, plugin tools own state mutation, and runtime hooks add bounded context without exposing raw state files to slash commands.

## 2. HOW IT WORKS

### State Store And Command Router

`.opencode/plugins/mk-goal.js` stores one JSON goal record per OpenCode session under `.opencode/skills/.goal-state/` by default, keyed by a sanitized session id. Writes go through an in-process mutation queue and atomic temp-file rename. `.opencode/commands/goal.md` is a thin router: empty arguments and `show` call `mk_goal_status`, while `set`, bare text, `clear`, `complete` and `pause` call `mk_goal`.

### Passive Injection

The plugin registers `experimental.chat.system.transform`. When a session has an active goal, it appends a bounded `[active_goal:<goal-id>]` block containing status, objective, last verifier result, usage counters and a directive to continue toward the objective. Objective and evidence text are sanitized before storage or injection.

### Tools And Lifecycle

The plugin exposes two OpenCode tools: `mk_goal` for mutation and `mk_goal_status` for readback with the exact injection preview. Goal state supports `active`, `paused`, `blocked`, `usage_limited`, `budget_limited` and `complete`. Idle events run supervisor verification; `met` marks the goal complete, `blocked` marks it blocked, and ambiguous or missing evidence keeps it active while incrementing iterations.

### Guarded Continuation

Continuation is default-off. `MK_GOAL_AUTONOMY=smoke` logs that a continuation would fire without calling the runtime, and `MK_GOAL_AUTONOMY=active` may call `ctx.client.session.promptAsync` only after all gates pass: plugin enabled, real session id, active unsuppressed goal, no in-flight continuation, no pending permission or question, idle runtime status, cooldown elapsed, cap not exceeded and budget not exhausted. Continuation is capped at eight auto-turns, thirty minutes wall time and a 1500 ms cooldown.

Known limitation: the `promptAsync` continuation path is implemented and covered by plugin tests, but live OpenCode-run tool invocation is still under investigation. Treat active continuation as opt-in until the live runtime path is verified in a real OpenCode session.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/plugins/mk-goal.js` | OpenCode plugin | State store, passive injection, tools, supervisor verification and guarded continuation |
| `.opencode/commands/goal.md` | Slash command | Thin command router for `mk_goal` and `mk_goal_status` |
| `.opencode/skills/.goal-state/` | State directory | Default per-session JSON state location |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/plugins/__tests__/mk-goal-state.test.cjs` | Automated test | Session-keyed persistence, tool output and passive injection |
| `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs` | Automated test | Real tool execute path and ToolContext session resolution |
| `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs` | Automated test | Supervisor verdict mapping and evidence redaction |
| `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs` | Automated test | Default-off autonomy gates, smoke mode, active promptAsync dispatch and caps |
| `.opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs` | Automated test | Usage accounting, lifecycle suppression and budget limits |
| `manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md` | Manual playbook | Operator scenario for `/goal` command and plugin behavior |

## 4. SOURCE METADATA

- Group: Hooks and plugin
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--hooks-and-plugin/goal-opencode-plugin.md`

Related references:
- [opencode-plugin-bridge.md](opencode-plugin-bridge.md)
- [`06--mcp-surface/skill-advisor-cli.md`](../06--mcp-surface/skill-advisor-cli.md)
