## Dimension

correctness: error handling & resource cleanup (timeouts, aborts, child processes)

## Files Reviewed

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:1`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:1`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:1`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs:1`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/lifecycle-taxonomy.cjs:1`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/observability-events.cjs:1`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:1`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/evidence-contract.ts:1`
- `.opencode/skills/deep-loop-runtime/tests/unit/post-dispatch-validate.vitest.ts:560`
- `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:1`
- `.opencode/skills/deep-loop-runtime/tests/unit/lifecycle-taxonomy-guards.vitest.ts:1`
- `.opencode/skills/deep-loop-runtime/tests/unit/observability-events.vitest.ts:1`

## Findings by Severity

### P0

None.

### P1

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:364` - Immediate judge rejection leaves the fast timeout alive. `callJudgeWithDualTimeouts` creates the judge promise, starts a fast timer, then awaits `Promise.race`; `clearTimeout(fastTimer)` only runs after the race fulfills. If `invoke()` rejects before the fast timeout, the await throws before lines 373-375 execute, and `runJudgeWithHardening` catches the model error at lines 907-918 while the fast timer remains scheduled until `fastTimeoutMs` (default 10 seconds). In normal retry paths with fast model errors, this can keep the event loop open and accumulate idle timers.
  - Claim: immediate model errors leak the fast timeout timer until it fires.
  - Evidence: `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:361`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:364`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:370`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:373`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:867`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:907`
  - Counterevidence sought: I looked for a `finally` around the first race or a catch that clears `fastTimer`; the only cleanup is after a fulfilled race. The unit tests cover retry after a model error and the slow path, but do not assert pending timer cleanup.
  - Alternative explanation: Vitest and short configured timeouts can hide this because the leaked timer eventually fires; production defaults make the delay visible.
  - Final severity: P1
  - Confidence: high
  - Downgrade trigger: downgrade if `invoke()` implementations are proven to never reject after scheduling the fast timer, or if callers always run under an external process timeout that forcibly tears down pending timers.
  - Suggested fix direction: wrap the initial `Promise.race` in `try/finally` so `fastTimer` is cleared on both fulfillment and rejection; keep the existing slow-path rejection suppression for operations that outlive the slow timeout.

### P2

None.

## Verdict

CONDITIONAL

## Notes

No additional P0/P1 findings held up in `executor-config.ts`, `fallback-router.ts`, `runtime-capabilities.cjs`, `lifecycle-taxonomy.cjs`, or `observability-events.cjs` for this resource-cleanup slice. The review was read-only for target files.
