# Iteration 006: Security — Lifecycle / Autonomy Safety

## Focus
- Dimension: security
- Files reviewed: `.opencode/plugins/mk-goal.js`
- Scope: Inspect auto-continuation gates, kill switches, caps, and lifecycle safety boundaries.

## Scorecard
- Dimensions covered: security
- Files reviewed: 1
- New findings: P0=0 P1=0 P2=3
- Refined findings: P0=0 P1=1 P2=0
- New findings ratio: 0.13 (3 P2 * 1 = 3; refined P1 * 5 * 0.5 = 2.5; total new weighted = 5.5; cumulative weighted = 24; 5.5/24)

## Findings

### P1, Required (refinement)
- **F009-R1**: Continuation in-flight lock race is reachable from the `session.idle` autonomy seam, `.opencode/plugins/mk-goal.js:2091-2095`. Re-examined under the lifecycle lens: the `session.idle` handler adds the session to `inFlightContinuations` only after testing membership. Because OpenCode may dispatch multiple `session.idle` events for the same session in rapid succession, the race can fire two autonomous continuations, violating the `maxAutoTurns` cap semantics.

### P2, Suggestion
- **F022**: Smoke mode reports `would_fire` without verifying `promptAsync` availability, `.opencode/plugins/mk-goal.js:2143-2149`. `autonomyMode === 'smoke'` returns a `would_fire` decision before reaching the `promptAsync` availability check. An operator running smoke tests may conclude continuation is ready when the runtime actually lacks the required client method.
- **F023**: Autonomy kill switch is global only, `.opencode/plugins/mk-goal.js:660-666`. `MK_GOAL_AUTONOMY` is read from `process.env` per call, but there is no per-session pause or kill switch beyond the goal-level `paused` status. A runaway session cannot be emergency-stopped without changing the global env or clearing the goal.
- **F024**: Wall-clock cap measures from goal creation, not from last resume, `.opencode/plugins/mk-goal.js:1972-1978`. `continuationCapReason` computes `timestamp - goal.startedAtMs`. If a long-running goal is paused and later resumed, the remaining wall budget is already depleted by the pre-pause elapsed time, making resume effectively useless for old goals.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | goal_plugin.md:45-62 vs mk-goal.js:660-666 | Env-based autonomy switch matches docs; per-session kill switch is not promised |
| checklist_evidence | pass | hard | - | No checklist checked |
| feature_catalog_code | pass | advisory | - | No drift |
| playbook_capability | pending | advisory | - | Not exercised |

## Assessment
- New findings ratio: 0.13
- Dimensions addressed: [security]
- Novelty justification: One P1 refinement (F009) and three new P2 autonomy-safety findings.

## Ruled Out
- The `paused` status and `MK_GOAL_PLUGIN_DISABLED` env do provide coarse-grained stop mechanisms.
- `maxAutoTurns` and `maxWallMs` are enforced before dispatch, apart from the race in F009.

## Dead Ends
- Searching for unconditional auto-run paths found none; continuation is gated by autonomy mode, active status, caps, and cooldown.

## Recommended Next Focus
Traceability (cross-phase references): reconcile parent spec status with child phase statuses and the undocumented 009-diagnostic-review folder.

Review verdict: PASS
