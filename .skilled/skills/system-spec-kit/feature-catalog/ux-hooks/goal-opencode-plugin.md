---
title: "Goal OpenCode plugin"
description: "Local /goal-opencode OpenCode plugin that binds a session to a packet goal.md, injects its durable slice as active-goal context, exposes opencode_goal tools including bind, resent and packet, and documents restart and validation boundaries."
trigger_phrases:
  - "goal opencode plugin"
  - "opencode-goal"
  - "/goal-opencode command"
  - "active_goal injection"
  - "goalPrompt"
  - "bind packet goal"
version: 3.9.0.0
---

# Goal OpenCode plugin

This catalog entry maps the current `/goal-opencode` OpenCode plugin behavior to its implementation files, validation tests, and operator reference.

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The goal plugin gives OpenCode a session-level completion objective. Users call `/goal-opencode bind <packet-path>` to make a packet's `goal.md` the directive, or `/goal-opencode set <objective>` for a text goal, and the plugin persists the per-session record, injects an active-goal block on each turn (rendered from the packet file when bound, frontmatter never included, the packet's completion criteria carried as their own `criteria:` lines in both the full and compact block), and exposes tool-backed status, history, doctor/health, resume, resent, packet read and mutation operations.

This feature is cataloged under UX hooks because it is a runtime-injection and operator-feedback surface. It runs entirely inside the OpenCode plugin host: no daemon, no CLI bridge, and no dependency on anything else in this package.

---

## 2. HOW IT WORKS

`.opencode/plugins/opencode-goal.js` is auto-loaded by OpenCode. It registers:

- `experimental.chat.system.transform` to append `[active_goal:<goalId>]` when the session has an active goal.
- `event` to restore goals, record message activity, track prompt blockers, verify on idle, and gate continuation.
- `opencode_goal` and `opencode_goal_status` plugin tools for command routing and diagnostics.

`.opencode/commands/goal-opencode.md` is intentionally thin. It parses `$ARGUMENTS`, calls exactly one plugin tool, and never reads or writes `.opencode/skills/.state/goal` directly.

Stored state keeps the packet pointer when bound, plus the raw sanitized `objective` and the deterministic `goalPrompt`. The packet projections come from `.opencode/hooks/goal/lib/goal-slice.cjs`, shared with the runtime-neutral core, so the frontmatter boundary is defined once. `resend_pending` in status output tells the agent the packet's durable slice changed since it was last resent in chat; `resent` clears it. The raw objective is audit data; `goalPrompt` is the model-facing execution brief. Idle verification uses an injected `supervisorVerifier` when present; otherwise `OPENCODE_GOAL_VERIFIER=heuristic` applies a deterministic fail-closed verifier over the latest assistant evidence and goal objective. `OPENCODE_GOAL_VERIFIER=llm` opts into `ctx.client.session.promptAsync` semantic verdicts. Status output includes verifier provenance as `verifier_source` with `injected`, `default-heuristic`, or `default-llm` when a verdict has run. Autonomy is disabled unless `OPENCODE_GOAL_AUTONOMY=active` or smoke-tested with `OPENCODE_GOAL_AUTONOMY=smoke`. `OPENCODE_GOAL_MAX_AUTO_TURNS` and `OPENCODE_GOAL_MAX_WALL_MS` tune the guarded continuation caps; status output includes `remaining_auto_turns`, `remaining_wall_ms`, and `provider_retry_after_ms`.

Each OpenCode session resolves to a fixed 64-character SHA-256 state key, so long native ids cannot exceed the filesystem component limit and raw identity is not reversible from the filename. Valid active and archived files from the previous hex-key format migrate lazily after embedded-id validation; an occupied digest target wins without deleting the conflicting source.

State does not grow unboundedly: on `session.deleted` the goal-state file is archived then pruned past a retention window, `/goal-opencode history` lists archived records read-only, and a throttled sweep on `session.created` archives orphaned active-state files past their own age threshold. `/goal-opencode doctor` and `/goal-opencode health` report active/archive counts, log sizes, last sweep time, and orphan candidates. `/goal-opencode resume` reactivates a `paused`, `usage_limited` or `budget_limited` goal on the OpenCode plugin; the runtime-neutral core resumes a `paused` goal only, because it has none of the other three states. See `.opencode/hooks/goal/goal-plugin.md` for the retention/sweep env vars and the `store_health`/`mutation` output fields.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/plugins/opencode-goal.js` | OpenCode plugin | State, injection, lifecycle, verifier, continuation gates, and plugin tools. |
| `.opencode/commands/goal-opencode.md` | Slash command | Thin `/goal-opencode` router for `bind`, `unbind`, `resent`, `log`, `packet`, `set`, `show`, `history`, `doctor`, `health`, `clear`, `complete`, `pause`, and `resume`. |
| `.opencode/hooks/goal/lib/goal-slice.cjs` | Shared module | Packet `goal.md` projections: durable slice, chat slice, objective slice, hash. |
| `.opencode/skills/.state/goal/` | Runtime state | Per-session JSON records (pointer, operator copy, liveness, telemetry) and bounded debug logs. |
| `.opencode/hooks/goal/goal-plugin.md` | Operator reference | Contract, env vars, boundaries, verification, and restart guidance. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/plugins/tests/opencode-goal-state.test.cjs` | Automated test | State persistence, generated prompt fields, injection, caps, sanitization, redaction, and status output. |
| `.opencode/plugins/tests/opencode-goal-tool-path.test.cjs` | Automated test | Plugin tool context persistence, status output, packet bind, resent, packet read and the injected resend reminder. |
| `.opencode/plugins/tests/opencode-goal-export-contract.test.cjs` | Automated test | Export contract. |
| `.opencode/plugins/tests/opencode-goal-render-parity.test.cjs` | Automated test | Shared injection label set across both renderers; brief cache key sensitivity. |
| `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` | Automated test | Speckit goal-offer presentation and router contract. |
| `.opencode/plugins/tests/opencode-goal-capabilities.test.cjs` | Automated test | History, doctor/health, resume, budget, env caps, provider-limit detection, and retry-after recovery. |
| `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` | Automated test | Event/lifecycle behavior. |
| `.opencode/plugins/tests/opencode-goal-supervisor.test.cjs` | Automated test | Injected verifier precedence, default heuristic positive/negative matrix, LLM verifier mode, provenance, and evidence redaction. |
| `.opencode/plugins/tests/opencode-goal-continuation.test.cjs` | Automated test | Guarded continuation decisions. |

---

## 4. SOURCE METADATA

- Group: UX Hooks
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `ux-hooks/goal-opencode-plugin.md`
- Related reference: `.opencode/hooks/goal/goal-plugin.md`
