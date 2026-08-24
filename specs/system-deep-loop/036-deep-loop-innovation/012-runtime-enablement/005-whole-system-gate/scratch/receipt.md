# Whole-System Gate Receipt

- Candidate SHA: `f2d4d01d083f1df30d9d973d4e2c4ec65145c50b`
- Baseline SHA: `8c9f0b6944ac4e43e99d26f9cf61dab74b600640`
- Generated: 2026-08-23T17:41:57.047Z

| Check | Status | Detail |
| --- | --- | --- |
| tree-clean | fail | excluded specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate/scratch (gate out… |
| candidate-frozen | pass | identical |
| authority-state | pass | read 8 modes; 8 on new_authoritative_reversible; 8 from a stored record, 0 from the absent-record default |
| runtime-suite | pass | failed 15 vs 19 (Δ-4); passed 4437 vs 4395 (Δ+42); skipped 39 vs 39 (Δ+0); total 4491 vs 4453 (Δ+38); files 209 vs 199 … |
| consumer-reachability | pass | all 7 scripts exist and spawned; non-zero exits are expected when required args are absent — this proves reachability o… |
| reader-contracts | fail | 1 of 8 mode(s) failed: deep-research (verify-iteration: iter1 ok=false reason=delta_file_malformed; iter2 ok=true reaso… |
| fanout-real-run | pass | run_id 1787198541887-w6k53d: total 1, succeeded 1, failed 0, all_failed false, orphaned 0; iteration artifact /Users/mi… |

## Suite delta (candidate − baseline)

- failed: -4
- passed: +42
- skipped: +0
- total: +38
- files: +10

## Verdict: **FAIL**

