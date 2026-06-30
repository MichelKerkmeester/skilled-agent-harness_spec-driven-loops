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

The goal plugin gives OpenCode a session-level completion objective. Users call `/goal set <objective>`, and the plugin persists the state, injects an active-goal block on each turn, and exposes tool-backed status and mutation operations.

This feature is cataloged under UX hooks because it is a runtime-injection and operator-feedback surface. It is not part of the Spec Kit Memory MCP server and does not use a daemon CLI bridge.

---

## 2. HOW IT WORKS

`.opencode/plugins/mk-goal.js` is auto-loaded by OpenCode. It registers:

- `experimental.chat.system.transform` to append `[active_goal:<goalId>]` when the session has an active goal.
- `event` to restore goals, record message activity, track prompt blockers, verify on idle, and gate continuation.
- `mk_goal` and `mk_goal_status` plugin tools for command routing and diagnostics.

`.opencode/commands/goal.md` is intentionally thin. It parses `$ARGUMENTS`, calls exactly one plugin tool, and never reads or writes `.opencode/skills/.goal-state` directly.

Stored state keeps both the raw sanitized `objective` and the deterministic `goalPrompt`. The raw objective is audit data; `goalPrompt` is the model-facing execution brief. Autonomy is disabled unless `MK_GOAL_AUTONOMY=active` or smoke-tested with `MK_GOAL_AUTONOMY=smoke`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/plugins/mk-goal.js` | OpenCode plugin | State, injection, lifecycle, verifier, continuation gates, and plugin tools. |
| `.opencode/commands/goal.md` | Slash command | Thin `/goal` router for `set`, `show`, `clear`, `complete`, and `pause`. |
| `.opencode/skills/.goal-state/` | Runtime state | Per-session JSON goal records and bounded debug logs. |
| `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md` | Operator reference | Contract, env vars, boundaries, verification, and restart guidance. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/plugins/__tests__/mk-goal-state.test.cjs` | Automated test | State, generated prompt fields, injection, caps, and sanitization. |
| `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs` | Automated test | Plugin tool context persistence and status output. |
| `.opencode/plugins/__tests__/mk-goal-export-contract.test.cjs` | Automated test | Export contract. |
| `.opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs` | Automated test | Event/lifecycle behavior. |
| `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs` | Automated test | Verifier completion behavior. |
| `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs` | Automated test | Guarded continuation decisions. |

---

## 4. SOURCE METADATA

- Group: UX Hooks
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `18--ux-hooks/goal-opencode-plugin.md`
- Related reference: `references/hooks/goal_plugin.md`
