# Iteration 001 - Correctness Fan-Out Orchestration

Session: fanout-codex-5-1780596001496-uhn96t
Executor: cli-codex model=gpt-5.5
Focus: correctness: fan-out orchestration

## Scope Reviewed

- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`
- `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts`
- `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts`

## Findings

### F001 - P0 - Non-zero CLI lineage exits are counted as successful fan-out results

Evidence:

- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:362` computes a child `exitCode`.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:363` returns the record instead of rejecting or marking it as failed.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:85` to `:99` treats resolved worker outputs as fulfilled results.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:207` to `:218` counts fulfilled records as succeeded.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:376` to `:378` exits based on `summary.failed`, so a failed subprocess can produce a successful fan-out run.

Impact:

This breaks the core review-loop accounting contract. A lineage can fail its CLI review process while the fan-out controller reports success, allowing a parent deep review to converge on incomplete or missing evidence.

Concrete fix:

Treat non-zero child `status` as a failed pool result. Either reject from the worker or propagate a failure flag into `runPool()` summary accounting and set the top-level process exit accordingly.

### F002 - P1 - Synchronous CLI worker serializes fan-out despite the concurrency cap

Evidence:

- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:307` to `:311` passes an async worker into the pool.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344` invokes `spawnSync()`.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:174` to `:179` admits concurrent promises, but the event loop is blocked while each sync subprocess runs.

Impact:

The configured fan-out concurrency does not materialize for CLI executors. This undermines the packet's parallel review objective and makes timeout behavior misleading.

Concrete fix:

Use async `spawn()` with promise completion and keep stdout/stderr capture semantics explicit.

### F003 - P1 - Per-lineage iterations only sizes timeout and never reaches the loop bound

Evidence:

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:291` to `:299` documents `iterations` as a per-lineage max-iterations override.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:154` to `:157` uses `iterations` only to calculate timeout.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:122` to `:146` builds the loop prompt without binding `max_iterations` or equivalent loop configuration.

Impact:

Operators can set a lineage iteration budget that silently does not constrain the deep-review loop, except by timeout side effects.

Concrete fix:

Pass the lineage iteration budget into the child loop prompt/config and assert it in tests by inspecting the generated prompt or child argv/env contract.

## Typed Claim Adjudication

```json
[
  {
    "findingId": "F001",
    "claim": "Non-zero CLI child exits are counted as successful fan-out results.",
    "status": "confirmed",
    "evidence": [
      ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:362",
      ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:376",
      ".opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:207"
    ]
  },
  {
    "findingId": "F002",
    "claim": "The fan-out worker blocks the event loop with spawnSync.",
    "status": "confirmed",
    "evidence": [
      ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344",
      ".opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:174"
    ]
  },
  {
    "findingId": "F003",
    "claim": "Lineage iterations are not passed as a loop bound.",
    "status": "confirmed",
    "evidence": [
      ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:291",
      ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:154",
      ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:122"
    ]
  }
]
```

Review verdict: FAIL
