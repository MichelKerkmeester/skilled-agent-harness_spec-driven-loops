# Iteration 24: S3-10 Stall Watchdog Abort/Requeue Mapping

## Focus

Dimension D2 target-mapping. Investigated whether our `lag_ceiling_exceeded` stall detector in `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` should adopt kasper's stuck-watchdog force-clear pattern so a hung active lineage can be aborted and requeued after the ceiling.

## Actions Taken

- Read the active deep-research strategy/state context and confirmed S3-10 had not already been answered.
- Located kasper's in-flight evaluation latch and watchdog in `external/kasper/src/index.ts`.
- Mapped the reference mechanism onto our pool stall detector, retry ledger, orphan requeue helper, child-process timeout, and existing fanout pool tests.
- Ruled out a literal latch-clear port because our pool runs child processes; freeing a slot without killing or settling the child would oversubscribe the pool.

## Findings

1. Kasper force-clears a hung in-memory poll latch, but our analogous pool path only emits a warning.
   - Reference mechanism: kasper initializes `evaluationRunning` and `evaluationStartedAt`, then its poll timer logs `eval_timeout_skip` and sets `evaluationRunning = false` after `MAX_EVAL_DURATION_MS` [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/index.ts:365] [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/index.ts:424].
   - OUR target file: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`, where `emitLagCeilingWarning()` emits `lag_ceiling_exceeded` with `severity: "warning"` and no recovery action [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:370].
   - Why it helps: a stalled active lineage currently blocks queued lineages until the child-level timeout fires; the pool already has the precise signal needed to start recovery sooner.
   - Port-difficulty: med.
   - Tag: deep-rewrite.

2. The safe port is active-slot abort plus terminal settlement, not merely clearing pool accounting.
   - Reference mechanism: kasper records `evaluationStartedAt` immediately before `pollAndEvaluate()` and clears the latch in `finally`, so the watchdog acts on the same in-flight evaluation boundary [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/index.ts:438] [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/index.ts:440].
   - OUR target file: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`, where `active` is only a count and the worker promise is launched without an abort handle or active-item registry [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:361] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:439].
   - Why it helps: adding an active item registry with an injected abort hook would let the ceiling convert the hung slot into a timeout-like rejected result, then let `finally` decrement `active` exactly once.
   - Port-difficulty: hard.
   - Tag: deep-rewrite.

3. Requeue should reuse the existing timeout/retry ledger instead of inventing a second stuck state.
   - Reference mechanism: kasper emits an explicit timeout-skip event before clearing the latch [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/index.ts:429].
   - OUR target file: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`, where retryable rejected results already flow through `retry_scheduled` and `maxRetries` [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:455]. The failure classifier already treats `timedOut` as retryable [SOURCE: .opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:168].
   - Why it helps: a forced stall abort can be represented as `failure_class: "timeout"` and use the existing retry budget, ledger rows, and summary math.
   - Port-difficulty: med.
   - Tag: quick-win.

4. The implementation needs tests that preserve the false-positive fix while adding one forced recovery path.
   - Reference mechanism: kasper's status output reports in-flight validation duration from `evaluationStartedAt`, so watchdog behavior is visible to operators [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/handlers.ts:43].
   - OUR target file: `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts`, which currently asserts one warning for a hung worker and silence for normal width-greater-than-concurrency backpressure [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts:238] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts:271].
   - Why it helps: the regression suite should prove a hung slot can be aborted/requeued once, while steady completions still reset the stall clock and never trigger recovery.
   - Port-difficulty: easy.
   - Tag: quick-win.

5. Do not duplicate `fanout-run.cjs`'s full-lineage hard timeout; use the lag ceiling as an earlier pool-level progress watchdog.
   - Reference mechanism: kasper's watchdog is a poll-loop reentrancy guard, separate from scorer call timeouts; it protects loop progress rather than replacing all operation-level timeouts [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/index.ts:421].
   - OUR target file: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`, which already kills a child process on the computed lineage timeout and turns that into a failed lineage [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:664] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:698].
   - Why it helps: the backlog item should be scoped as "no pool progress while queued work waits" recovery, not a second global child timeout.
   - Port-difficulty: med.
   - Tag: deep-rewrite.

## Questions Answered

- S3-10: yes, the stall detector should grow an opt-in abort-and-requeue mode, but only if `fanout-pool.cjs` first gets active-item abort handles and settles the aborted lineage through the existing timeout retry path. A literal kasper-style latch clear is unsafe for our pool because it would let another lineage start while the old child process may still be running.

## Questions Remaining

- S2-10 remains worth a dedicated D1 source-mining pass for the full kasper poll-loop contract, including whether `MAX_EVAL_DURATION_MS` is configurable and how it interacts with `evalMutex`.
- The implementation backlog needs to decide the control surface: `lagCeilingAction: "warn" | "abort-requeue"` in fanout config, or a separate `stallRecoveryMs` field so existing warning semantics stay byte-compatible.
- A follow-up mapping should identify whether `fanout-run.cjs` can pass a child-kill abort hook into `runCappedPool()` without leaking child process handles across retries.

## Next Focus

S3-11: map whether fan-out lineages should persist a mid-flight checkpoint so a killed `fanout-run.cjs` resumes in-progress lineages instead of respawning all N.
