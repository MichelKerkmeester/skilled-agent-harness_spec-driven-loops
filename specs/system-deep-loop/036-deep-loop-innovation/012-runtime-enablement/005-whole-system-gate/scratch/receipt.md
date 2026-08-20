# Whole-System Gate Receipt

- Candidate SHA: `8bbe1335e309f7d3c61b289665eaa09ace4770b4`
- Baseline SHA: `8c9f0b6944ac4e43e99d26f9cf61dab74b600640`
- Generated: 2026-08-20T04:11:41.261Z

| Check | Status | Detail |
| --- | --- | --- |
| tree-clean | pass | tree clean apart from the gate's own artifacts; excluded specs/system-deep-loop/036-deep-loop-innovation/012-runtime-en… |
| candidate-frozen | fail | .../tests/unit/per-mode-authority-flip.vitest.ts   \| 69 ----------------------
 1 file changed, 69 deletions(-) |
| authority-state | fail | Cannot find module '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/022-012-runtime-enable… |
| runtime-suite | pass | failed 15 vs 15 (Δ+0); passed 4188 vs 4111 (Δ+77); skipped 39 vs 39 (Δ+0); total 4242 vs 4165 (Δ+77); files 188 vs 182 … |
| consumer-reachability | pass | all 7 scripts exist and spawned; non-zero exits are expected when required args are absent — this proves reachability o… |
| reader-contracts | not-run | An end-to-end reader contract requires files projected by an enabled mode. No mode is currently enabled, so running one… |
| fanout-real-run | pass | run_id 1787198541887-w6k53d: total 1, succeeded 1, failed 0, all_failed false, orphaned 0; iteration artifact /Users/mi… |

## Suite delta (candidate − baseline)

- failed: +0
- passed: +77
- skipped: +0
- total: +77
- files: +6

## Verdict: **FAIL**

