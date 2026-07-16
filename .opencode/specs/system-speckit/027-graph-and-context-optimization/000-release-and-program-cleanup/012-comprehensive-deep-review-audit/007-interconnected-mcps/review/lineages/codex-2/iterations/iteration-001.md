# Iteration 001 - Correctness

## Focus

Fan-out runtime correctness: `fanout-pool.cjs`, `fanout-run.cjs`, executor config, and fan-out tests.

## Files Reviewed

- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts`
- `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts`
- `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts`

## Findings

### F001 - P1 - Fan-out CLI lineages are serialized by the real worker

The pool primitive admits work while `active < concurrency`, then calls `settleItem()` for each admitted item [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:174]. The fan-out driver passes an async worker to that pool [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:307], but inside the worker it starts the actual CLI subprocess with `spawnSync()` [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344]. Because `spawnSync()` blocks the Node event loop until the child exits, the first admitted worker prevents the pump from admitting additional long-running CLI lineages. The documented and configured `concurrency` cap therefore does not produce concurrent real CLI runs.

Impact: fan-out review/research campaigns configured for multiple concurrent CLI lineages run serially, stretching runtime and invalidating the parent packet's concurrency assumptions.

Concrete fix: replace the real worker's `spawnSync()` path with async `spawn()` or an equivalent promise-based subprocess helper, stream/capture stdout into the same log path, preserve timeout handling, and add a delayed-stub integration test that proves overlap by start timestamps or wall-clock duration.

Claim adjudication:

```json
{
  "findingId": "F001",
  "claim": "The real fan-out CLI worker serializes lineages despite the pool concurrency cap because it uses spawnSync inside the async worker.",
  "evidenceRefs": [
    ".opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:174",
    ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:307",
    ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344"
  ],
  "counterevidenceSought": "Checked fanout-pool tests and fanout-run tests for a delayed real-subprocess overlap assertion.",
  "alternativeExplanation": "The pool primitive itself is correct for asynchronous workers; the bug is specifically in the synchronous subprocess worker wired by fanout-run.",
  "finalSeverity": "P1",
  "confidence": 0.93,
  "downgradeTrigger": "Downgrade if the driver is changed to spawn child processes asynchronously or a wrapper proves spawnSync runs in separate worker threads.",
  "transitions": []
}
```

### F002 - P1 - Per-lineage `iterations` is only used for timeout sizing

The fan-out schema documents `iterations` as a per-lineage max-iterations override [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:292]. In the actual driver, the full-loop prompt built for each lineage includes the spec folder, artifact override, session id, executor, and "Run phase_init, phase_main_loop (to convergence), and phase_synthesis" [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:128], but it does not pass `iterations` or `max_iterations` into the child loop. The only runtime use is `computeLineageTimeoutMs()`, where `lineage.iterations` multiplies the timeout budget [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:155].

Impact: operators can configure `iterations` believing it bounds the child loop, while the lineage still runs with the child command's default max iteration count. This can overrun or underrun planned fan-out depth and makes timeout sizing diverge from loop semantics.

Concrete fix: include an explicit max-iteration binding in the child prompt/config, make the child phase_init persist that value in `deep-review-config.json`, and add a fanout-run test that uses a stub lineage prompt capture to assert `max_iterations` appears when `iterations` is set.

Claim adjudication:

```json
{
  "findingId": "F002",
  "claim": "Fan-out per-lineage iterations is parsed as a max-iteration override but does not reach the child loop; it only changes subprocess timeout sizing.",
  "evidenceRefs": [
    ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:292",
    ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:128",
    ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:155"
  ],
  "counterevidenceSought": "Searched fanout-run and deep review command YAML for lineage.iterations being bound into phase_init or prompt pack variables.",
  "alternativeExplanation": "The field could have been intended as timeout-only, but the schema comment calls it a max-iterations override and tests name it per-lineage iterations.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if documentation is changed to define iterations as timeout sizing only, or if command wiring proves the child loop consumes it through an external config path.",
  "transitions": []
}
```

## P0 Replay

No P0 finding asserted.

Review verdict: CONDITIONAL
