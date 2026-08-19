# Whole-System Gate Receipt

- Candidate SHA: `8cb16fba480d1f0c8bd4cff2f63695934d2d6b8c`
- Baseline SHA: `8c9f0b6944ac4e43e99d26f9cf61dab74b600640`
- Generated: 2026-08-19T19:40:58.971Z

| Check | Status | Detail |
| --- | --- | --- |
| tree-clean | pass | tree clean apart from the gate's own artifacts; excluded specs/system-deep-loop/036-deep-loop-innovation/012-runtime-en… |
| candidate-frozen | pass | identical |
| authority-state | fail | read 8 modes; 8 on legacy_authoritative |
| runtime-suite | pass | failed 15 vs 15 (Δ+0); passed 4152 vs 4111 (Δ+41); skipped 39 vs 39 (Δ+0); total 4206 vs 4165 (Δ+41); files 184 vs 182 … |
| reader-contracts | pass | all 7 scripts spawned; non-zero exits are expected when required args are absent — this proves reachability only, not e… |
| fanout-real-run | not-run | Requires a real fan-out dispatching external CLI subprocesses. Not run: the authority check already fails, so the verdi… |

## Suite delta (candidate − baseline)

- failed: +0
- passed: +41
- skipped: +0
- total: +41
- files: +2

## Verdict: **FAIL**

