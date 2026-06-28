# Iteration 1: S1-01 Persisted Remaining-Delay Crash Resume

## Focus

[S1-01] How does `loop-cli-main` persist `remainingDelayMs` in `src/core/loop-controller.ts` and reconstruct a partially elapsed wait after a crash without restarting the interval?

## Actions Taken

- Read the deep-research iteration contract and output references for iteration markdown plus JSONL state writes.
- Source-mined `loop-cli-main` `LoopController` state shape, constructor restore path, metadata snapshot, `waitForDelay`, first-run resume branch, and daemon persistence wiring.
- Checked OUR runtime targets: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`, and `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts`.

## Findings

### Finding S1-01: Resumable Wait Snapshot

`loop-cli-main` models a wait as durable schedule state plus a refreshed remaining-duration snapshot. The state interface includes both `nextRunAt` and `remainingDelayMs`, and the constructor restores both from saved state [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:13`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:70`]. `getMeta()` exposes those fields for persistence [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:189`].

Inside `waitForDelay`, the controller initializes `remainingDelayMs`, announces `waiting` with `nextRunAt = now + remaining`, sleeps in chunks, subtracts actual elapsed time, and refreshes `remainingDelayMs` after every chunk [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:228`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:266`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:273`]. The daemon wires `waiting` to `persist`, serializes only changed metadata, and saves the resulting loop record [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:257`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:273`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/state.ts:87`].

On daemon restart, saved metadata is loaded back into a new `LoopController`, including `nextRunAt` and `remainingDelayMs`; if the restored controller is not stopped or idle, it starts again [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:38`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:69`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:87`]. The first loop pass reconstructs the delay from persisted `nextRunAt` minus current wall-clock time, so a crash during a wait does not restart the full interval [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:311`].

Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`. This would improve fanout/autonomous loop resilience by adding a persisted wait snapshot for retry/backoff/cadence sleeps, instead of relying on live process timers only. The existing support layer is `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` for durable writes and `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts` for single-owner resume/reclaim semantics; those already provide atomic JSON writes and stale-lock acquisition [SOURCE: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:42`] [SOURCE: `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:234`].

Current OUR gap: `fanout-run.cjs` has live timers for progress heartbeat and child timeout, but no durable wait-in-progress record or crash-resume schedule reconstruction [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:303`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:358`].

Port difficulty: med.

Tag: quick-win.

## Questions Answered

- Answered S1-01: `loop-cli-main` persists wait state by exposing `nextRunAt` and `remainingDelayMs` through controller metadata, persisting on `waiting` events, restoring those fields into a new controller, and recomputing the initial post-crash delay from `nextRunAt`.

## Questions Remaining

- S1-02 remains open: inspect `shared/sleep.ts`, `SLEEP_CHUNK_MS`, and abort composition for a reusable runtime sleep primitive.
- S1-03 through S1-12 remain open for later Segment S1 iterations.

## Next Focus

[S1-02] Mine `loop-cli-main` abortable chunked sleep and `AbortSignal.any` usage, then map it to a shared deep-loop-runtime sleep primitive.
