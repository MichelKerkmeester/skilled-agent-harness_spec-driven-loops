---
title: "Whole-System Gate Receipt"
trigger_phrases: []
---
# Whole-System Gate Receipt

- Candidate SHA: `07c1bd5f22f0831de1bebdc822b7394ded7884b8`
- Baseline SHA: `8c9f0b6944ac4e43e99d26f9cf61dab74b600640`
- Generated: 2026-08-24T08:15:22.796Z

| Check | Status | Detail |
| --- | --- | --- |
| tree-clean | pass | tree clean apart from the gate's own artifacts; excluded specs/system-deep-loop/036-deep-loop-innovation/012-runtime-en… |
| candidate-frozen | pass | identical |
| authority-state | pass | read 8 modes; 8 on new_authoritative_final; 8 from a stored record, 0 from the absent-record default |
| runtime-suite | pass | failed 13 vs 19 (Δ-6); passed 2698 vs 4395 (Δ-1697); skipped 7 vs 39 (Δ-32); total 2718 vs 4453 (Δ-1735); files 161 vs … |
| consumer-reachability | pass | all 7 scripts exist and spawned; non-zero exits are expected when required args are absent — this proves reachability o… |
| reader-contracts | pass | all 8 modes read cleanly via their real consumers |
| fanout-real-run | pass | run_id 1787198541887-w6k53d: total 1, succeeded 1, failed 0, all_failed false, orphaned 0; iteration artifact /Users/mi… |

## Suite delta (candidate − baseline)

- failed: -6
- passed: -1697
- skipped: -32
- total: -1735
- files: -38

## Verdict: **PASS**

