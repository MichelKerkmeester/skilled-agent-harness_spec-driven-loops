# Whole-System Gate Receipt

- Candidate SHA: `81949212b7c94c6f094b77b6bc24739fc0ed14ca`
- Baseline SHA: `8c9f0b6944ac4e43e99d26f9cf61dab74b600640`
- Generated: 2026-08-20T03:31:21.154Z

| Check | Status | Detail |
| --- | --- | --- |
| tree-clean | pass | tree clean apart from the gate's own artifacts; excluded specs/system-deep-loop/036-deep-loop-innovation/012-runtime-en… |
| candidate-frozen | pass | identical |
| authority-state | fail | Cannot find module '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/022-012-runtime-enable… |
| runtime-suite | pass | failed 15 vs 15 (Δ+0); passed 4188 vs 4111 (Δ+77); skipped 39 vs 39 (Δ+0); total 4242 vs 4165 (Δ+77); files 188 vs 182 … |
| consumer-reachability | pass | all 7 scripts exist and spawned; non-zero exits are expected when required args are absent — this proves reachability o… |
| reader-contracts | not-run | An end-to-end reader contract requires files projected by an enabled mode. No mode is currently enabled, so running one… |
| fanout-real-run | not-run | Requires a real fan-out dispatching external CLI subprocesses. Not run: the authority check already fails, so the verdi… |

## Suite delta (candidate − baseline)

- failed: +0
- passed: +77
- skipped: +0
- total: +77
- files: +6

## Verdict: **FAIL**

