# Advisor Suite Parallel Trial

Local measurement, run from the repository root on 2026-11-12, with `npm test` in
`.skilled/skills/system-skill-advisor/runtime`. `real` is `/usr/bin/time -p`'s wall
clock; `vitest Duration` is the suite's own number. A run passes when its summary
prints the baseline's `Test Files` total with no failing test.

The published CI reference for the serial config is 309 s for the default-suite step
of `skill-advisor-stress.yml` in run 43168892360, with `Duration 308.84s` and
`Test Files 161 passed (161)`, `Tests 1387 passed | 8 skipped (1395)`.

## Runs

| Run | Config | Result | real (s) | vitest Duration (s) | Test Files | Tests |
|-----|--------|--------|----------|---------------------|------------|-------|
| Baseline | serial | pass | 213.09 | 212.76 | 161 passed (161) | 1387 passed \| 8 skipped (1395) |
| Trial 1 | projects | fail | 101.58 | 101.28 | 1 failed \| 160 passed (161) | 1 failed \| 1386 passed \| 8 skipped (1395) |
| Trial 2 | projects | fail | 108.88 | 108.09 | 1 failed \| 160 passed (161) | 1 failed \| 1386 passed \| 8 skipped (1395) |
| Trial 3 | projects | pass | 97.67 | 97.23 | 161 passed (161) | 1387 passed \| 8 skipped (1395) |

## Failure

Trials 1 and 2 each reported one failed test in one failed file; trial 3 passed. Two
further untimed runs were used to identify the failure: the first passed, the second
failed with a JSON reporter and named it:
`tests/legacy/advisor-freshness.vitest.ts`, test "getAdvisorFreshness bench records
cold and warm probe p50/p95/p99 over 30 samples", measured a warm probe p95 of
`7.526` ms against its `5` ms budget (assertion at
`tests/legacy/advisor-freshness.vitest.ts:327`). That file measures elapsed time, not
a shared surface, so it sat in the parallel group and was starved by the other 148
files. It was not on the twelve-file serial list, so the split fails its bar.

## Gate

Baseline: 213.09
Median: 101.58
Saved: 52.3
Decision: Revert
