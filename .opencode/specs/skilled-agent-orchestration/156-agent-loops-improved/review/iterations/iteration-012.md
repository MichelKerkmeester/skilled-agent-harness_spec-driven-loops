## Dimension

Correctness: concurrency & crash-safety of per-session goal-state writes (atomic write, queue, restore)

## Files Reviewed

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:1`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:416`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:761`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:1166`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/goal.md:1`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/__tests__/mk-goal-continuation.test.cjs:1`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs:1`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/__tests__/mk-goal-state.test.cjs:1`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:1`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs:1`

## Findings by Severity

### P0

None.

### P1

#### R12-P1-001 - Continuation reservation failure leaves the session locked in memory

- File: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:1138`
- Why: `maybeContinueGoal()` adds the session to `runtimeState.inFlightContinuations` before calling `reserveContinuationTurn()`, but the cleanup branches only run after that reservation call returns. If the queued read/write path throws during reservation, the function exits before either the `!reserved.didReserve` cleanup or the later `finally` block, so the in-memory continuation lock stays set. Subsequent idle handling suppresses the same session as `continuation_in_flight`, and the plugin event wrapper swallows the original error.
- Concrete trigger: a durable-state write failure during `reserveContinuationTurn()` after autonomy gates pass. I reproduced this with a temp state directory made unwritable after goal creation: `maybeContinueGoal()` rejected and `runtimeState.inFlightContinuations.has('s')` remained true.
- Claim: a transient goal-state write failure can permanently suppress active continuation for that session until plugin process restart.
- Evidence refs:
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:1095`
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:1138`
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:1139`
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:1141`
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:1145`
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:1162`
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:1427`
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:1429`
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:1430`
- Counterevidence sought: I checked the continuation tests for a reservation-write failure or stale-lock recovery case. They cover default-off, smoke, successful active prompting, and auto-turn caps, but not a thrown `reserveContinuationTurn()` path.
- Alternative explanation: If `runtimeState` is always reconstructed for every idle event, the stale lock would not persist. In this plugin factory it is created once and captured by the event handler, so the lock persists for the plugin instance.
- Final severity: P1
- Confidence: high
- Downgrade trigger: downgrade if OpenCode guarantees a fresh plugin instance for every event or the filesystem write path cannot throw after the continuation lock is added.
- Suggested fix direction: wrap reservation and prompt submission in a single `try/finally` after adding `inFlightContinuations`, or acquire the volatile lock only after a successful reservation while keeping a compare-safe durable reservation guard.

### P2

None.

## Verdict

CONDITIONAL

## Notes

The per-session mutation queue itself is correctly serialized in-process: `mutateGoal()` chains each session/state-dir key, ignores prior failures before scheduling the next mutation, and deletes only the current queue promise. Atomic writes use temp file, file sync, rename, and directory sync. The command file stays state-free and does not bypass the plugin store.

The remaining correctness risk is at the volatile-lock boundary around active continuation. The durable write can fail without corrupting the JSON file, but the in-memory continuation lock is left behind and turns a transient storage failure into a persistent same-process suppression.
