---
title: "Goal OpenCode plugin"
description: "Local /goal OpenCode plugin that persists session objectives, injects active-goal context, exposes mk_goal tools, and documents restart and validation boundaries."
trigger_phrases:
  - "goal opencode plugin"
  - "mk-goal"
  - "/goal command"
  - "active_goal injection"
  - "goalPrompt"
version: 3.7.0.1
---

# Goal OpenCode plugin

This catalog entry maps the current `/goal` OpenCode plugin behavior to its implementation files, validation tests, and operator reference.

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The goal plugin gives OpenCode a session-level completion objective. Users call `/goal set <objective>` or `/goal set <objective> --budget N`, and the plugin persists the state, injects an active-goal block on each turn, and exposes tool-backed status, history, doctor/health, resume, and mutation operations.

This feature is cataloged under UX hooks because it is a runtime-injection and operator-feedback surface. It is not part of the Spec Kit Memory MCP server and does not use a daemon CLI bridge.

---

## 2. HOW IT WORKS

`.opencode/plugins/mk-goal.js` is auto-loaded by OpenCode. It registers:

- `experimental.chat.system.transform` to append `[active_goal:<goalId>]` when the session has an active goal.
- `event` to restore goals, record message activity, track prompt blockers, verify on idle, and gate continuation.
- `mk_goal` and `mk_goal_status` plugin tools for command routing and diagnostics.

`.opencode/commands/goal_opencode.md` is intentionally thin. It parses `$ARGUMENTS`, calls exactly one plugin tool, and never reads or writes `.opencode/skills/.goal-state` directly.

Stored state keeps both the raw sanitized `objective` and the deterministic `goalPrompt`. The raw objective is audit data; `goalPrompt` is the model-facing execution brief. Idle verification uses an injected `supervisorVerifier` when present; otherwise `MK_GOAL_VERIFIER=heuristic` applies a deterministic fail-closed verifier over the latest assistant evidence and goal objective. `MK_GOAL_VERIFIER=llm` opts into `ctx.client.session.promptAsync` semantic verdicts. Status output includes verifier provenance as `verifier_source` with `injected`, `default-heuristic`, or `default-llm` when a verdict has run. Autonomy is disabled unless `MK_GOAL_AUTONOMY=active` or smoke-tested with `MK_GOAL_AUTONOMY=smoke`. `MK_GOAL_MAX_AUTO_TURNS` and `MK_GOAL_MAX_WALL_MS` tune the guarded continuation caps; status output includes `remaining_auto_turns`, `remaining_wall_ms`, and `provider_retry_after_ms`.

State does not grow unboundedly: on `session.deleted` the goal-state file is archived then pruned past a retention window, `/goal history` lists archived records read-only, and a throttled sweep on `session.created` archives orphaned active-state files past their own age threshold. `/goal doctor` and `/goal health` report active/archive counts, log sizes, last sweep time, and orphan candidates. `/goal resume` reactivates only `paused` or `usage_limited` goals. See `references/hooks/goal_plugin.md` for the retention/sweep env vars and the `store_health`/`mutation` output fields.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/plugins/mk-goal.js` | OpenCode plugin | State, injection, lifecycle, verifier, continuation gates, and plugin tools. |
| `.opencode/commands/goal_opencode.md` | Slash command | Thin `/goal` router for `set`, `show`, `history`, `doctor`, `health`, `clear`, `complete`, `pause`, and `resume`. |
| `.opencode/skills/.goal-state/` | Runtime state | Per-session JSON goal records and bounded debug logs. |
| `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md` | Operator reference | Contract, env vars, boundaries, verification, and restart guidance. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/plugins/tests/mk-goal-state.test.cjs` | Automated test | State persistence, generated prompt fields, injection, caps, sanitization, redaction, and status output. |
| `.opencode/plugins/tests/mk-goal-tool-path.test.cjs` | Automated test | Plugin tool context persistence and status output. |
| `.opencode/plugins/tests/mk-goal-export-contract.test.cjs` | Automated test | Export contract. |
| `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` | Automated test | Speckit goal-offer presentation and router contract. |
| `.opencode/plugins/tests/mk-goal-capabilities.test.cjs` | Automated test | History, doctor/health, resume, budget, env caps, provider-limit detection, and retry-after recovery. |
| `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs` | Automated test | Event/lifecycle behavior. |
| `.opencode/plugins/tests/mk-goal-supervisor.test.cjs` | Automated test | Injected verifier precedence, default heuristic positive/negative matrix, LLM verifier mode, provenance, and evidence redaction. |
| `.opencode/plugins/tests/mk-goal-continuation.test.cjs` | Automated test | Guarded continuation decisions. |

---

## 4. SOURCE METADATA

- Group: UX Hooks
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `ux-hooks/goal-opencode-plugin.md`
- Related reference: `references/hooks/goal_plugin.md`
