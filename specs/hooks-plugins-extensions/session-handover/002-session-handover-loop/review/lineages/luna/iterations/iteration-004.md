# Iteration 4 — security

## Dimension

Security and lifecycle integrity: arm-event identity, killer spawn failure, and re-arm behavior across the five automatic runtimes.

## Files Reviewed

- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:357-415,689-703,871-876
- .skilled/hooks/session-relaunch/claude/stop-arm.mjs:48-71,88-155
- .skilled/hooks/session-relaunch/codex/stop-arm.mjs:48-70,87-135
- .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:41-109
- .skilled/hooks/session-relaunch/pi/session-relaunch.ts:235-307,374-390
- .skilled/hooks/session-relaunch/opencode/session-relaunch.js:155-185,274-295
- .skilled/hooks/session-relaunch/lib/killer.cjs:146-185,610-627
- .skilled/bin/skilled-loop:423-436
- .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:375-455,619-632
- .skilled/hooks/session-relaunch/tests/codex-adapters.test.cjs:566-642
- .skilled/hooks/session-relaunch/tests/hermes-adapters.test.cjs:375-408
- .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts:463-532,891-896
- .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:469-493
- .opencode/plugins/tests/session-relaunch.test.cjs:932-960
- specs/hooks/023-session-relaunch-loop/016-handover-trigger-review/spec.md:60-78,102-106,125-127
- specs/hooks/023-session-relaunch-loop/review-archive/20261018T184826Z/iterations/iteration-005.md:46-53
- specs/hooks/023-session-relaunch-loop/review-archive/20261018T184826Z/review-report.md:65-80
- specs/hooks/023-session-relaunch-loop/review/lineages/luna/steer.md:1-23

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **LUNA-FANOUT-P1-003 — killer spawn errors leave interactive runtimes armed without a retry trigger**
   - **Case:** During a threshold handoff, the first killer `spawn` throws or emits `error` for Claude Stop, Codex Stop, Pi `agent_end`, or OpenCode `session.idle`, and the user does not start another turn.
   - **File:** .skilled/hooks/session-relaunch/claude/stop-arm.mjs:60-70.
   - **Evidence:** The adapters arm the record before starting the killer. Claude and Codex catch the async spawn error and only log it at `stop-arm.mjs:59-70` and `codex/stop-arm.mjs:59-69`; Pi and OpenCode likewise only log at `pi/session-relaunch.ts:263-275` and `opencode/session-relaunch.js:170-184`. The record therefore remains `armed` without a live killer. The killer is the process that waits for idle and sends SIGTERM (`killer.cjs:146-185,610-627`). `skilled-loop` waits for the runtime command to exit before checking `should-relaunch` (`skilled-loop:423-432`), so a still-open interactive runtime has no actor left to stop it. `armableRecord` allows a later event to re-arm an `armed` record only after the killer lock is gone (`relaunch-core.cjs:403-415`); recovery consequently depends on another host event. Existing adapter tests explicitly assert that sync/async spawn failures leave the record armed (`claude-adapters.test.cjs:375-455`, `codex-adapters.test.cjs:566-642`, `pi/session-relaunch.test.ts:463-532`).
   - **Impact:** A single transient killer launch error can strand the automatic hop until the user submits another turn or manually exits the runtime. This fails the phase's stated question of whether automatic handover fires every time it should; the error is logged, but the wrapper cannot act on the armed record while the runtime remains open.
   - **findingClass:** lifecycle-reliability
   - **scopeProof:** claude/stop-arm.mjs:139-155; codex/stop-arm.mjs:119-135; pi/session-relaunch.ts:263-307; opencode/session-relaunch.js:170-184,274-292; killer.cjs:610-627; skilled-loop:423-432.
   - **affectedSurfaceHints:** all five arm adapters, killer launch, and the wrapper's post-exit relaunch decision. The persistence is directly relevant to the four interactive Stop/idle flows; Hermes' `on_session_end` path also leaves an armed record on spawn error, while whether Hermes exits at that point is deferred to the runtime-lifecycle pass.
   - **Recommendation:** Retry killer startup once within the arm flow, and if the retry also fails, expose a controlled fallback that prevents the wrapper from waiting indefinitely on a record with no supervising killer.
   - **Prior-review check:** The archived M5-P2-001 concerned Claude spawning a duplicate killer for an already-armed record. Current `armableRecord` checks armed status and the live lock before re-arming, so that defect is not repeated here. The archived report did not identify this spawn-failure recovery gap; current adapter tests still confirm the armed-without-killer state.

### P2 Findings

None.

## Traceability Checks

- Phase 016 states that the review must determine whether automatic handover fires every time on the five automatic runtimes and requires confirmed P1 findings to be fixed.
- Shared `armableRecord` checks loop, session, runtime, status, and live-killer ownership. `arm()` restamps `armedAt` and cwd; the earlier duplicate-Claude-arm defect is guarded in current code.
- Full event registration and Hermes process-exit timing remain scheduled for the later hook-registration/runtime-lifecycle passes.

## Edge Cases and Ruled Out

- Wrong loop, session, runtime, or non-armable status is refused by `armableRecord` before the adapters call `arm()`.
- An armed record with a live killer is not re-armed; an armed record whose killer is gone can be re-armed with a fresh `armedAt` and cwd.
- The prior Claude duplicate-killer finding is fixed in the current shared guard. This finding is distinct: it concerns failure to start the first killer and the absence of an immediate retry or fallback.
- Hermes has the same best-effort spawn-error logging, but its event is `on_session_end`; the exact point at which that host process exits needs a lifecycle read before asserting the same stranded-session impact.

## SCOPE VIOLATIONS

- scope_violation: the workflow step_graph_upsert writes shared coverage-graph storage outside this lineage; it was skipped under the lineage-only write boundary.
- scope_violation: the workflow step_graph_convergence normally invokes convergence.cjs in write mode, which appends observability data to shared graph storage. No default write-mode graph command was run. Graph work remains graphless_fallback; maxIterationsReached is the configured stop policy.
- These are workflow mutations outside the authorized write surface, not product findings.

## EXECUTION CONFLICT

The reducer strategy continues to label some deferred directions BLOCKED after one attempt. The lead's steer requires all runtimes and chain stages; review continues against that steer and the configured ten-iteration cap.

## Next Focus

Follow killer idle detection, signal, grace, timeout, and record-change paths, including Hermes process lifetime after `on_session_end`.

## Claim Adjudication

- **Finding:** LUNA-FANOUT-P1-003
- **claim:** For interactive runtime arm events, a killer spawn error can leave the record armed without a supervisor; the wrapper only evaluates relaunch after the runtime exits, and no retry is scheduled until another host event.
- **evidenceRefs:** .skilled/hooks/session-relaunch/claude/stop-arm.mjs:59-70,139-155; .skilled/hooks/session-relaunch/codex/stop-arm.mjs:59-69,119-135; .skilled/hooks/session-relaunch/pi/session-relaunch.ts:263-307; .skilled/hooks/session-relaunch/opencode/session-relaunch.js:170-184,274-292; .skilled/hooks/session-relaunch/lib/killer.cjs:146-185,610-627; .skilled/bin/skilled-loop:423-432.
- **counterevidenceSought:** The arm guards, core retry eligibility, runtime handlers, killer signal path, wrapper exit loop, existing spawn-error adapter tests, and prior review findings were checked. The adapters do permit a later event to re-arm after the failed spawn, but none starts a retry from the failure callback.
- **alternativeExplanation:** The hop still completes if the runtime exits on its own after the hook, or if a later host event reaches the re-arm path. That does not cover an interactive session left open after the one spawn error.
- **finalSeverity:** P1
- **confidence:** 0.96
- **downgradeTrigger:** A current bounded retry or fallback that reliably causes the wrapper to reach its relaunch decision after a failed killer spawn, without requiring a new user turn or manual exit.

Review verdict: CONDITIONAL
