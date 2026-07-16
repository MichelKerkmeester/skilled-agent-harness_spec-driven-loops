---
title: "Implementation Summary: Phase 20 Capability Additions"
description: "Goal plugin capability additions for history, doctor/health, resume, budget routing, autonomy caps, provider-limit recovery, and documentation sync."
trigger_phrases:
  - "goal plugin capability additions implementation"
  - "history resume doctor health budget"
  - "retry-after recovery"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/026-goal-opencode-plugin/020-capability-additions"
    last_updated_at: "2026-07-03T16:33:00Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Implemented capability additions"
    next_safe_action: "Run metadata refresh"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/tests/mk-goal-capabilities.test.cjs"
      - ".opencode/commands/goal_opencode.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "020-capability-additions-implementation-20260703"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "e-3.8 uses lazy retry-after recovery on message.updated/session.idle with no timer."
      - "e-3.10 multi-goal and goal-queue support is deferred."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-capability-additions |
| **Completed** | 2026-07-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The goal plugin now has the missing operator capabilities around an otherwise working session-goal loop. Operators can inspect archived goals, check plugin health, resume paused or provider-limited goals, set token budgets from `/goal`, tune continuation caps by environment, and rely on lazy retry-after recovery after provider 429s.

### Operator Verbs

`/goal history` lists archived records from `.opencode/skills/.goal-state/.archive/` without creating or mutating active state. `/goal doctor` and `/goal health` report active state-file count, archive-file count, `.continuation.log` and `.goal-events.log` sizes, last-sweep time, and orphan-candidate count. `/goal resume` reactivates only `paused` and `usage_limited` goals through the status-transition map, clears continuation suppression, and still rejects `complete` to `active` resurrection.

### Budget And Autonomy Controls

`/goal set <objective> --budget N` now routes a positive integer budget to the existing `tokenBudget` tool argument and fails closed for missing, non-numeric, zero, or negative values. `MK_GOAL_MAX_AUTO_TURNS` and `MK_GOAL_MAX_WALL_MS` mirror the existing env-override pattern and status output now includes `max_auto_turns`, `remaining_auto_turns`, `max_wall_ms`, `remaining_wall_ms`, and `provider_retry_after_ms`.

### Provider-Limit Recovery

Provider-limit detection now accepts numeric and string `429` status codes, non-`APIError` classes carrying a 429, and specific quota/rate-limit message patterns. When a 429 payload carries a valid retry-after value, the plugin records a recovery deadline and lazily reactivates the goal on the next relevant `message.updated` or `session.idle` path after that deadline. Malformed or missing retry-after payloads keep suppression in place.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/mk-goal.js` | Modified | Added history, doctor/health, resume, env caps, status fields, provider-limit detection, and lazy retry-after recovery. |
| `.opencode/plugins/tests/mk-goal-capabilities.test.cjs` | Created | Added 8 subtests for all new capability paths. |
| `.opencode/commands/goal_opencode.md` | Modified | Routed new verbs and documented `--budget N` validation. |
| `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md` | Modified | Synced operator contract with verbs, envs, status fields, and validation. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Added `MK_GOAL_MAX_AUTO_TURNS` and `MK_GOAL_MAX_WALL_MS`. |
| `.opencode/skills/system-spec-kit/feature_catalog/ux-hooks/goal-opencode-plugin.md` | Modified | Synced feature catalog. |
| `.opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/goal-opencode-plugin.md` | Modified | Synced feature catalog. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/goal-opencode-plugin.md` | Modified | Added manual validation steps for new capabilities. |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md` | Modified | Added manual validation steps for new capabilities. |
| `.opencode/specs/system-deep-loop/026-goal-opencode-plugin/020-capability-additions/tasks.md` | Modified | Marked tasks complete with evidence. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work shipped as additive plugin and command-router changes with one new focused `node:test` file. Baseline before edits was 85 tests, 85 pass, 0 fail; the final full suite is 93 tests, 93 pass, 0 fail.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `history`, `doctor`, and `health` read-only | These actions are operator inspection surfaces and must not create active state or mutate archives. |
| Route `resume` through the status-transition map | Phase 019 made transitions explicit; widening only `paused` to `active` and `usage_limited` to `active` preserves the terminal-state invariant. |
| Use lazy retry-after recovery instead of timers | The plugin is event-driven and has no timer machinery; evaluating deadlines on `message.updated` and `session.idle` fits the existing lifecycle. |
| Defer e-3.10 multi-goal and goal-queue support | The current state file, injection, continuation, verification, usage accounting, and command contract all assume a single goal object. A queue needs a separate schema and consumer design phase, so no multi-goal code shipped here. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline full suite | PASS: `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` -> 85 tests, 85 pass, 0 fail, duration 1801.736166ms. |
| RED resume probe | CONFIRMED BEFORE: `resume` normalized to `show`, leaving status `paused` and suppression true. |
| RED retry-after probe | CONFIRMED BEFORE: no `providerRetryAfterMs` was stored and continuation stayed `goal_not_active`. |
| Capability subtests | PASS: `node --test .opencode/plugins/tests/mk-goal-capabilities.test.cjs` -> 8 tests, 8 pass, 0 fail, duration 386.70725ms. |
| Final full suite | PASS: `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` -> 93 tests, 93 pass, 0 fail, duration 2002.763334ms. |
| Syntax checks | PASS: `node --check .opencode/plugins/mk-goal.js` and `node --check .opencode/plugins/tests/mk-goal-capabilities.test.cjs`. |
| Doc sync grep | PASS: `history`, `resume`, `doctor`, `health`, `MK_GOAL_MAX_AUTO_TURNS`, and `MK_GOAL_MAX_WALL_MS` hit all six required doc surfaces plus `.opencode/commands/goal_opencode.md`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. `description.json` and `graph-metadata.json` were not refreshed because they are outside the allowed write paths for this dispatch. Run the metadata refresh after review.
2. e-3.10 multi-goal and goal-queue support is intentionally deferred to a separate design phase; this phase ships no queue state or multi-goal data structure.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
