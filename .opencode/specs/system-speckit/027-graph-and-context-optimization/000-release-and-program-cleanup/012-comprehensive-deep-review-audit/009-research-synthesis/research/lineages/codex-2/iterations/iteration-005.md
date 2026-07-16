# Iteration 005 - Deep-Loop Fan-Out Blast Radius

## Focus

Assess whether deep-loop fan-out defects can produce false success, serial execution, or unbounded lineage behavior.

## Findings

1. Current CLI fan-out is not serial. `fanout-run.cjs` wires CLI lineages through `runCappedPool` with the configured concurrency, and the pool starts items while `active < concurrency`. [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:307`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:309`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:174`]

2. The concurrency cap is also covered by unit tests that expect max active workers to stay at 2 while all five items are eventually processed. [SOURCE: `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts:100`] [SOURCE: `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts:102`]

3. Non-zero CLI subprocess exits are still misaccounted. The worker uses `spawnSync`, saves stdout, runs salvage, computes `exitCode`, and returns it as ordinary output instead of throwing or marking the pool item rejected. [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:360`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:362`]

4. The pool summary counts success from `result.status === "fulfilled"`, not from `output.exitCode === 0`. The script then exits 0/2/3 based on that pool summary. [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:207`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:209`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:376`]

5. Tests do not lock the desired non-zero-exit behavior. The fanout-run integration test allows exit 0 or 2 in the happy-path stub case, but there is no failing-stub assertion that a subprocess exit 1 becomes pool failure. [SOURCE: `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:143`]

6. Per-lineage `iterations` currently sizes timeout, not the prompt's loop budget. `computeLineageTimeoutMs` multiplies `lineage.iterations` by timeout, while `buildLoopPrompt` tells the child to run the loop to convergence without passing a max-iteration parameter. [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:150`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:154`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:142`]

## Sources Consulted

- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`
- `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts`
- `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts`
- `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml`

## Assessment

Blast radius is high for audit reliability but narrower than the stale "serial fan-out" claim. Current code can run lineages concurrently, but it can also report success when every CLI subprocess exits non-zero, because subprocess exit codes are nested inside fulfilled worker output. That can produce false confidence in review/research synthesis and hide missing lineage artifacts behind salvage output.

The `iterations` issue is a budget-control bug. It can create unexpected runtime/cost variance because the configured per-lineage iteration count does not constrain the child loop directly; it only changes timeout.

## Reflection

The correct remediation target is fanout-run's worker contract: a lineage should be rejected, or at least counted failed, when the subprocess exit code is non-zero after salvage cannot prove completion.

## Recommended Next Focus

Synthesize all five answers into a remediation priority order.
