# Iteration 003: Traceability — Spec/Code + Checklist Evidence Protocols

## Focus
- Dimension: traceability
- Files reviewed: `.opencode/specs/deep-loops/032-goal-opencode-plugin/016-plugin-correctness-fixes/checklist.md`, `.opencode/specs/deep-loops/032-goal-opencode-plugin/016-plugin-correctness-fixes/spec.md`, `.opencode/plugins/mk-goal.js`
- Scope: Cross-check the phase 016 checklist completion claims against the live pre-fix code and the phase's own spec status.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 3
- New findings: P0=0 P1=3 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.88 (P1=5*3=15, P2=1*1=1; new weighted = 16; total weighted = 16)

## Findings

### P1, Required
- **F008**: Phase 016 checklist overclaims completion while live code still contains the defects it purports to fix, `.opencode/specs/deep-loops/032-goal-opencode-plugin/016-plugin-correctness-fixes/checklist.md:40-90`. CHK-F2 and CHK-F3 are marked `[x]` with RED/GREEN evidence, but `mk-goal.js:2091-2095` still uses a check-then-act in-flight lock and `mk-goal.js:1231-1262` still sweeps outside the mutation queue. The same checklist also claims `completion_pct: 100` while the phase `spec.md:52` says `Status: Planned` and `completion_pct: 0`.
- **F009**: Continuation in-flight lock is a check-then-act race, `.opencode/plugins/mk-goal.js:2091-2095`. Two concurrent `session.idle` events for the same session can both observe `!continuationLocks.has(sessionID)` before either calls `add`, resulting in two `promptAsync` dispatches and two auto-turn charges for one logical idle event.
- **F010**: Sweep/archive path can resurrect active goals, `.opencode/plugins/mk-goal.js:1231-1262`. `sweepOrphanedActiveStates` reads file metadata and then calls `archiveGoalStateFile`, which uses the per-session mutation queue. A queued mutator that read the goal before the archive can write a fresh active file after the rename, resurrecting the supposedly archived goal.

### P2, Suggestion
- **F011**: `.goal-events.log` grows unbounded when `MK_GOAL_DEBUG=1`, `.opencode/plugins/mk-goal.js:735-742`. `logDebugEvent` appends one line for every event without sampling, rotation, or a size cap; a high-frequency event stream can exhaust disk space.

## Claim Adjudication
- **F008**: Re-read `mk-goal.js:2091-2095` and `mk-goal.js:1231-1262` to confirm the defects remain. Counterevidence sought: prior commits or branches that might have landed the fixes elsewhere; none found in the working tree. The phase spec status (`Planned`, 0%) supports the interpretation that the checklist is premature.
- **F009**: Confirmed by direct code inspection; no atomic compare-and-set is used. Downgrade trigger: refactor to check-and-set inside the queue or use a single synchronous lock acquisition before any await.
- **F010**: Confirmed by tracing sweep -> archiveGoalStateFile -> enqueueGoalMutation -> mutateGoal read/write interleaving.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:89-92 vs goal_opencode.md:3,30-33 | Original command scope drift remains from iteration 001 |
| checklist_evidence | fail | hard | 016-plugin-correctness-fixes/checklist.md:40-90 vs mk-goal.js:2091-2095,1231-1262 | Checked completion claims for F2/F3 contradict live code |
| feature_catalog_code | pass | advisory | goal_plugin.md:28-31 | No new drift detected |
| playbook_capability | pending | advisory | - | Not exercised |

## Assessment
- New findings ratio: 0.88
- Dimensions addressed: [traceability]
- Novelty justification: Three new P1 findings and one new P2. The checklist overclaim is the most significant traceability defect because it undermines release-readiness evidence.

## Ruled Out
- F5-F12 fixes appear largely present in live code (whitelisted fields, per-call env evaluation, root-targeted fsync logging, punctuation/homoglyph sanitizer tests pass), so the checklist is not uniformly false — it is specifically overbroad for the race and queue findings.

## Dead Ends
- Searching for an alternate implementation branch or patch file that might contain the F2/F3 fixes yielded none.

## Recommended Next Focus
Maintainability: review tests, docs, dead code, and the test architecture to confirm coverage for the P1 findings and identify documentation drift.

Review verdict: CONDITIONAL
