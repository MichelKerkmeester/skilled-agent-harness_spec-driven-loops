# Whole-System Gate Receipt

- Candidate SHA: `b8cf7ab74e919760a8169496d66536896b08b937`
- Baseline SHA: `f5676ec691e8ae78b63040290ac442a8857abbbc`
- Generated: 2026-08-21T00:39:19.142Z

| Check | Status | Detail |
| --- | --- | --- |
| tree-clean | pass | tree clean apart from the gate's own artifacts; excluded specs/system-deep-loop/036-deep-loop-innovation/012-runtime-en… |
| candidate-frozen | pass | identical |
| authority-state | fail | read 8 modes; 8 on legacy_authoritative; 0 from a stored record, 8 from the absent-record default |
| runtime-suite | pass | failed 15 vs 24 (Δ-9); passed 4241 vs 4218 (Δ+23); skipped 39 vs 39 (Δ+0); total 4295 vs 4281 (Δ+14); files 192 vs 192 … |
| consumer-reachability | pass | all 7 scripts exist and spawned; non-zero exits are expected when required args are absent — this proves reachability o… |
| reader-contracts | not-run | An end-to-end reader contract requires files projected by an enabled mode. No mode is currently enabled, so running one… |
| fanout-real-run | pass | run_id 1787198541887-w6k53d: total 1, succeeded 1, failed 0, all_failed false, orphaned 0; iteration artifact /Users/mi… |

## Suite delta (candidate − baseline)

- failed: -9
- passed: +23
- skipped: +0
- total: +14
- files: +0

## Verdict: **FAIL**

