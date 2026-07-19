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

`.opencode/plugins/mk-goal.js` stores one JSON goal record per OpenCode session under `.opencode/skills/.goal-state/` by default, keyed by a sanitized session id. Writes go through an in-process mutation queue and atomic temp-file rename. `.opencode/commands/goal_opencode.md` is a thin router: empty arguments and `show` call `mk_goal_status`, while `set`, `set --budget N`, bare text, `history`, `doctor`, `health`, `clear`, `complete`, `pause` and `resume` call `mk_goal`.

### Passive Injection

The plugin registers `experimental.chat.system.transform`. When a session has an active goal, it appends a bounded `[active_goal:<goal-id>]` block containing status, objective, last verifier result, usage counters and a directive to continue toward the objective. Objective and evidence text are sanitized before storage or injection.

### Tools And Lifecycle

The plugin exposes two OpenCode tools: `mk_goal` for mutation/read-only command verbs and `mk_goal_status` for readback with the exact injection preview. Goal state supports `active`, `paused`, `blocked`, `usage_limited`, `budget_limited` and `complete`; `/goal resume` reactivates only `paused` and `usage_limited`. Idle events run supervisor verification; `met` marks the goal complete, `blocked` marks it blocked, and ambiguous or missing evidence keeps it active while incrementing iterations. Injected verifiers keep precedence. Without an injected verifier, `MK_GOAL_VERIFIER=heuristic` uses the deterministic fail-closed default; `MK_GOAL_VERIFIER=llm` opts into `ctx.client.session.promptAsync`. Status output includes `verifier_source` with `injected`, `default-heuristic`, or `default-llm` provenance after a verifier run.

### Archive And Cleanup

Goal state does not accumulate unboundedly. `session.deleted` archives the session's state file then prunes the archive past a configurable retention window; `/goal history` lists archived records read-only; `/goal doctor` and `/goal health` report active/archive counts, log sizes, last sweep time and orphan candidates; a throttled sweep on `session.created` archives orphaned active-state files past their own age threshold. Retention windows and the sweep interval are env-configurable (`MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, `MK_GOAL_STATE_SWEEP_INTERVAL_MS`).

### Guarded Continuation

Continuation is default-off. `MK_GOAL_AUTONOMY=smoke` logs that a continuation would fire without calling the runtime, and `MK_GOAL_AUTONOMY=active` may call `ctx.client.session.promptAsync` only after all gates pass: plugin enabled, real session id, active unsuppressed goal, no in-flight continuation, no pending permission or question, idle runtime status, cooldown elapsed, cap not exceeded and budget not exhausted. Continuation is capped by `MK_GOAL_MAX_AUTO_TURNS` (default `8`), `MK_GOAL_MAX_WALL_MS` (default `1800000`) and a 1500 ms cooldown; status output includes `remaining_auto_turns`, `remaining_wall_ms` and `provider_retry_after_ms`.

Live verification: the plugin is registered and driven end-to-end in a real OpenCode session. A `opencode serve` run lists `mk_goal` and `mk_goal_status` in the session tool set, and a live model turn calls `mk_goal` and persists per-session state. Earlier the tools failed to surface because the file carried multiple named exports — OpenCode treats every export of a plugin module as its own plugin, so the helper exports broke whole-file loading; the module now exports only its `default` plugin (the test surface hangs off `MkGoalPlugin.__test`), matching the sibling plugins. Coverage: unit suite + tool-path test (real `ToolContext` persist/read/clear) + the live serve smoke. Active continuation remains opt-in (default-off) by design.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/plugins/mk-goal.js` | OpenCode plugin | State store, passive injection, tools, supervisor verification and guarded continuation |
| `.opencode/commands/goal_opencode.md` | Slash command | Thin command router for `mk_goal` and `mk_goal_status` |
| `.opencode/skills/.goal-state/` | State directory | Default per-session JSON state location |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/plugins/tests/mk-goal-state.test.cjs` | Automated test | State persistence, generated prompt fields, injection, caps, sanitization, redaction, and status output. |
| `.opencode/plugins/tests/mk-goal-export-contract.test.cjs` | Automated test | Export surface contract and full test helper key list |
| `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` | Automated test | Speckit goal-offer presentation and router contract. |
| `.opencode/plugins/tests/mk-goal-capabilities.test.cjs` | Automated test | History, doctor/health, resume, budget, env caps, provider-limit detection and retry-after recovery |
| `.opencode/plugins/tests/mk-goal-tool-path.test.cjs` | Automated test | Real tool execute path and ToolContext session resolution |
| `.opencode/plugins/tests/mk-goal-supervisor.test.cjs` | Automated test | Supervisor verdict mapping, injected precedence, default verifier safety matrix, LLM verifier mode and provenance |
| `.opencode/plugins/tests/mk-goal-continuation.test.cjs` | Automated test | Default-off autonomy gates, smoke mode, active promptAsync dispatch and caps |
| `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs` | Automated test | Usage accounting, lifecycle suppression and budget limits |
| `manual-testing-playbook/cli-hooks-and-plugin/goal-opencode-plugin.md` | Manual playbook | Operator scenario for `/goal` command and plugin behavior |

## 4. SOURCE METADATA

- Group: Hooks and plugin
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `hooks-and-plugin/goal-opencode-plugin.md`

Related references:
- [opencode-plugin-bridge.md](../../feature-catalog/hooks-and-plugin/opencode-plugin-bridge.md)
- [`mcp-surface/skill-advisor-cli.md`](../../feature-catalog/mcp-surface/skill-advisor-cli.md)
