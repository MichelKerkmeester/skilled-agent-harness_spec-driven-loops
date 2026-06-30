# Iteration 3: S1-03 Forced Run Schedule Preservation

## Focus

[S1-03] How does `loop-cli-main` `triggerNow()` save and restore the schedule around a forced run, and how does it guard against double-run? Target mapping: `.opencode/commands/deep/assets/deep_research_auto.yaml` run-now control.

## Actions Taken

- Read the deep-research hub, research packet, output reference, current strategy, and last two iteration artifacts.
- Source-mined `loop-cli-main` `LoopController.triggerNow()`, the forced-run branch in `waitForDelay`, the post-run saved-schedule restoration path, daemon trigger admission, event persistence, and trigger-focused tests.
- Checked OUR target workflow surface in `.opencode/commands/deep/assets/deep_research_auto.yaml`, especially state paths, main-loop state read, pause sentinel, convergence handling, dispatch, output validation, and loop-decision steps.

## Findings

### Finding S1-03A: Forced Run Intent Is Separate From Schedule State

Reference mechanism: `LoopController` keeps forced-run intent in `_forceRun` and the interrupted countdown in `_savedRemainingMs` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:32`]. `triggerNow()` refuses an active run, snapshots `remainingDelayMs`, sets `_forceRun`, starts only when idle/stopped, otherwise resumes a paused/waiting loop, and emits `triggered` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:161`].

During a wait, the scheduler sees `_forceRun`, updates `_savedRemainingMs` to the current remaining countdown, clears visible wait metadata, and returns `true` so the main loop immediately proceeds into a run [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:233`]. At run start, `_forceRun` is cleared before incrementing `runCount`, preventing the forced-run latch from leaking into subsequent cadence decisions [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:333`].

Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`. This helps because the workflow currently has pause-sentinel handling and state-log validation, but no first-class `run-now` request state between `step_read_state` and `step_dispatch_iteration` [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:448`] [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:582`]. A portable backlog item is to add a `step_check_run_now_request` that records forced-run intent separately from cadence/convergence state, then clears the latch once dispatch starts.

Port difficulty: med.

Tag: quick-win.

### Finding S1-03B: Schedule Restore Subtracts Forced Run Duration From The Saved Countdown

Reference mechanism: after a run completes, `loop-cli-main` reads `_savedRemainingMs`, clears it, subtracts the just-finished run duration, and resumes waiting only for the leftover time [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:475`]. If there is no saved countdown, normal fixed-rate interval scheduling takes over [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:483`].

Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`. This helps because a manual research run-now control should not reset `max_iterations`, `stuck_count`, or the existing cadence-derived loop variables; the YAML already increments tracking only after output evaluation [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:841`] and returns to `step_read_state` [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:848`]. The backlog item is to persist a saved cadence snapshot around manual dispatch and restore the next scheduled evaluation relative to the forced run's duration, instead of treating run-now as a fresh loop start.

Port difficulty: med.

Tag: quick-win.

### Finding S1-03C: Double-Run Prevention Is Two-Layered And User-Visible

Reference mechanism: the daemon server rejects trigger requests when max-runs has already blocked the loop or the loop is currently running [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/server.ts:151`]. The controller repeats the active-run guard at the core entry point with `if (this._status === "running") return false` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:161`]. Tests assert that `triggerNow()` returns `false` while the loop is running and does not increment `runCount` a second time [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/tests/loop-controller.test.ts:162`].

Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`. This helps because `deep_research_auto.yaml` has a single-writer lock at session acquisition [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:225`] and post-dispatch output validation [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:756`], but no run-now-specific admission rule. A portable backlog item is to reject a manual run-now request when an iteration is already dispatching or output validation has not yet completed, and to append a canonical rejection event rather than silently dropping the request.

Port difficulty: med.

Tag: quick-win.

### Finding S1-03D: Idle Trigger Runs Once And Returns To Idle

Reference mechanism: if `triggerNow()` is called while the loop is stopped or idle, it sets `_stopAfterRun`, starts the controller, runs once, then the post-run branch returns the loop to idle and clears schedule metadata [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:164`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:465`]. Tests also cover `triggerNow()` with `maxRuns=1`, where the forced run completes and the loop pauses because the max-run gate wins [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/tests/loop-controller.test.ts:177`].

Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`. This helps because run-now control should support an operator-forced one-shot iteration without restarting or reinitializing the whole research session. The YAML's resume classification already treats complete state artifacts as the same lineage [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:243`], so the backlog item is a one-shot run-now branch that dispatches exactly one iteration and returns to the prior lifecycle state unless max-iteration or pause/convergence rules intervene.

Port difficulty: hard.

Tag: deep-rewrite.

### Finding S1-03E: Trigger State Is Persisted Through The Same Event Stream As Runs And Waits

Reference mechanism: the manager persists after successful trigger requests [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:213`], and also wires `triggered`, `run:start`, `run:end`, `waiting`, `paused`, `resumed`, and `stopped` to the same persist function [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:257`]. The persist function skips unchanged snapshots before writing [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:273`].

Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`. This helps because deep-research already treats the JSONL state log and per-iteration delta file as canonical reducer inputs [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:99`] [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:109`]. The backlog item is to record run-now lifecycle events (`run_now_requested`, `run_now_accepted`, `run_now_rejected`, `run_now_restored`) in the same append-only channel, so reducers and dashboards can explain manual cadence overrides.

Port difficulty: easy.

Tag: quick-win.

## Questions Answered

- Answered S1-03: `loop-cli-main` saves the current countdown into `_savedRemainingMs`, uses `_forceRun` as a separate latch to break out of waiting, clears the latch at run start, then restores the prior cadence by waiting for `savedRemainingMs - result.duration` after the forced run.
- Answered S1-03 double-run guard: the server rejects trigger requests when the loop is already running or max-runs-blocked, and the controller repeats the active-run guard so a forced run cannot overlap a current run.

## Questions Remaining

- S1-04 remains open: inspect legal running/waiting/paused/idle/stopped transitions and how `resumeResolve` gates the wait loop.
- S1-05 through S1-12 remain open for later Segment S1 iterations.

## Next Focus

[S1-04] Mine `loop-cli-main` lifecycle transitions and `resumeResolve` gating, then map the portable lifecycle model to deep-loop-runtime lifecycle handling.
