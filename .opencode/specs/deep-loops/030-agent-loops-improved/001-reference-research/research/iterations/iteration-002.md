# Iteration 2: S1-02 Abortable Chunked Sleep

## Focus

[S1-02] How does `loop-cli-main` compose abortable chunked sleep so a long wait is promptly cancellable and pause-interruptible, and what should map into a deep-loop-runtime sleep primitive?

## Actions Taken

- Read the deep-research skill contract plus output-file reference for iteration narratives and JSONL deltas.
- Source-mined `loop-cli-main` `src/shared/sleep.ts`, `SLEEP_CHUNK_MS`, `LoopController.waitForDelay`, and the run-interrupt `AbortSignal.any` boundary.
- Checked OUR runtime targets where timers and cancellation currently live: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`, `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts`, and the `lib/deep-loop/` helper surface.

## Findings

### Finding S1-02A: Minimal Abortable Sleep Primitive

`loop-cli-main` isolates sleep as a tiny shared helper that rejects immediately when the signal is already aborted, clears the timeout on abort, removes the abort listener after normal completion, and rejects with `signal.reason` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/shared/sleep.ts:1`]. The loop-wide chunk size is a named constant, `SLEEP_CHUNK_MS = 200`, rather than an inline magic delay [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/config/constants.ts:13`].

Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/sleep.ts`. This would add a shared runtime helper for abortable sleeps and chunked waits alongside the existing helper surface documented in `.opencode/skills/deep-loop-runtime/lib/deep-loop/README.md` [SOURCE: `.opencode/skills/deep-loop-runtime/lib/deep-loop/README.md:13`]. It helps because our runtime currently repeats timer handling inside process runners and pool logic instead of sharing one cancellation-safe primitive.

Port difficulty: easy.

Tag: quick-win.

### Finding S1-02B: Chunked Waits Bound Cancellation Latency

`LoopController.waitForDelay` does not await a full interval in one timer. It loops while `remaining > 0`, caps each sleep with `Math.min(remaining, SLEEP_CHUNK_MS)`, records `startedAt`, awaits the abortable helper, then subtracts actual elapsed wall-clock time from `remaining` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:228`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:273`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:276`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:283`]. That caps scheduler-observation latency to the chunk size and avoids drift from assuming a timer slept exactly as long as requested.

Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`. The target currently owns long lineage subprocess timeouts and progress heartbeats using raw timers [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:299`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:303`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:358`]. A shared chunked delay primitive would let fanout waits, progress heartbeat sleeps, retry/backoff waits, and timeout grace periods become promptly cancellable by one runtime signal instead of relying on isolated `setTimeout`/`setInterval` cleanup paths.

Port difficulty: med.

Tag: quick-win.

### Finding S1-02C: Signal Composition Belongs at the Run Boundary

The prompt expectation needed a correction: in this vendored snapshot, `AbortSignal.any` is not part of the shared sleep helper or `waitForDelay`; the only source-mined occurrence in this path is at command execution. `LoopController` creates a per-run `AbortController`, then passes `AbortSignal.any([signal, this.runAbortController.signal])` to `executeCommand`, so a global stop or an interrupt-current-run action can cancel the same running command [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:357`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:367`]. The pause path can abort only the current run when `interruptCurrentRun` is true [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:102`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:107`].

Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts`. This target already owns audited executor timeout and kill escalation via raw timers [SOURCE: `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:780`] [SOURCE: `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:791`] [SOURCE: `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:794`]. Porting the signal-composition shape there would separate global loop cancellation from current-dispatch interruption, while preserving the existing SIGTERM-to-SIGKILL grace behavior.

Port difficulty: med.

Tag: quick-win.

## Questions Answered

- Answered S1-02: `loop-cli-main` uses an abortable shared `sleep(ms, signal)` helper, a 200ms chunk cap, elapsed-time accounting after each chunk, and a separate `AbortSignal.any` composition at the command execution boundary. The portable runtime backlog item is a shared deep-loop abortable sleep/chunked-delay primitive plus a consistent signal-composition convention for executor runs.

## Questions Remaining

- S1-03 remains open: inspect `triggerNow()` save/restore schedule behavior and double-run guards for run-now control.
- S1-04 through S1-12 remain open for later Segment S1 iterations.

## Next Focus

[S1-03] Mine `loop-cli-main` `triggerNow()` save/restore behavior around forced runs and map it to `deep_research_auto.yaml` run-now control.
