# Whole-System Gate Receipt

- Candidate SHA: `f58ff5283d1f2213072a1fd3106326976656afe1`
- Baseline SHA: `8c9f0b6944ac4e43e99d26f9cf61dab74b600640`
- Generated: 2026-08-20T07:37:54.132Z

| Check | Status | Detail |
| --- | --- | --- |
| tree-clean | pass | tree clean apart from the gate's own artifacts; excluded specs/system-deep-loop/036-deep-loop-innovation/012-runtime-en… |
| candidate-frozen | pass | identical |
| authority-state | fail | read 8 modes; 8 on legacy_authoritative; 0 from a stored record, 8 from the absent-record default |
| runtime-suite | pass | failed 14 vs 15 (Δ-1); passed 4190 vs 4111 (Δ+79); skipped 39 vs 39 (Δ+0); total 4243 vs 4165 (Δ+78); files 188 vs 182 … |
| consumer-reachability | pass | all 7 scripts exist and spawned; non-zero exits are expected when required args are absent — this proves reachability o… |
| reader-contracts | not-run | An end-to-end reader contract requires files projected by an enabled mode. No mode is currently enabled, so running one… |
| fanout-real-run | pass | run_id 1787198541887-w6k53d: total 1, succeeded 1, failed 0, all_failed false, orphaned 0; iteration artifact /Users/mi… |

## Suite delta (candidate − baseline)

- failed: -1
- passed: +79
- skipped: +0
- total: +78
- files: +6

## Verdict: **FAIL**

