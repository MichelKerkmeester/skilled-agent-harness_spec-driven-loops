# Tare leaderboard

*Zero your scale. Measure decisions, not vibes.*

Every number below is re-derived from a results file in this repo at
build time (or, for third-party submissions, cited to an artifact
supplied by the submitter). Entries whose numbers cannot be traced
are rejected — see `leaderboard.py`.

| # | Model | Backbone | Macro acc | ECE (pre) | ECE (post) | Flip rate | Neg err | Neg paired acc | Exact Brier |
|---|---|---|---|---|---|---|---|---|---|
| 1 | deem-v6 | Qwen3-1.7B-Base | 0.7718 | 0.1219 | 0.0433 | 0.0773 | 0.0073 | 0.8200 | 0.0332 |
| 2 | deem-v3 | Qwen3-1.7B-Base | 0.7682 | 0.1064 | 0.0621 | 0.0800 | 0.8949 | 0.2133 | — |
| 3 | deem-v4 | Qwen3-1.7B-Base | 0.7657 | 0.1134 | 0.0683 | 0.1000 | 0.0128 | 0.8267 | 0.3284 |
| 4 | deem-v5 | Qwen3-1.7B-Base | 0.7627 | 0.1216 | 0.0612 | 0.0773 | 0.0073 | 0.8200 | 0.0332 |
| 5 | deem-rlcd-v1 | Qwen3-1.7B-Base (SFT v5 + RLCD) | 0.7623 | 0.1209 | 0.0424 | 0.0787 | 0.0071 | 0.8200 | 0.0291 |
| 6 | deem-v2 | Qwen3.5-0.8B | 0.6788 | 0.0532 | — | 0.9680 | 0.2437 | 0.4333 | — |

## Per-entry provenance

### deem-v6
- Backbone: Qwen3-1.7B-Base
- Date: 2026-09-21
- Note: Post-hoc per-class temperature calibrator (scripts/sft/calibration_v6.json, per-class temperature vectors, arm b_temp) on the frozen v5 checkpoint v5_17b — no retraining, checkpoint byte-identical to deem-v5.
- Note: Accuracy and ECE (pre/post) are the system numbers on the untouched eval half of the held-out split (sha256(prompt) parity; the calibrator was fit on the dev half only).
- Note: Flip rate, negation and exact-laws metrics are the v5 raw-readout probes, unchanged: the calibrator is post-hoc and not permutation-equivariant, so the consistency probes are the checkpoint's own numbers.
- Note: Macro ECE gate closes at 0.0433 (target <= 0.06); amazon's 5-way ordinal confusion was the one place a scalar temperature had to serve five miscalibrations.
- Metrics:
  - macro_accuracy = 0.7718 (v6 honest split: untouched eval half (calibrator fit on the dev half only), frozen v5 checkpoint + per-class calibrator; calibrated readout) — artifact: `scripts/sft/results_v6.json`
  - macro_ece_pre_scaling = 0.1219 (v6 honest split: untouched eval half (calibrator fit on the dev half only), frozen v5 checkpoint + per-class calibrator; raw (uncalibrated) readout) — artifact: `scripts/sft/results_v6.json`
  - macro_ece_post_scaling = 0.0433 (v6 honest split: untouched eval half (calibrator fit on the dev half only), frozen v5 checkpoint + per-class calibrator; chosen arm b_temp (per-class calibration)) — artifact: `scripts/sft/results_v6.json`
  - flip_rate = 0.0773 (mean over 5 probe datasets: ag_news, amazon_reviews_multi_en, fever, mmlu, snli) — artifact: `scripts/sft/consistency_v5.json`
  - negation_consistency_error = 0.0073 (boolq negation probe, mean |P(a) - (1 - P(not a))|) — artifact: `scripts/sft/consistency_v5.json`
  - negation_paired_accuracy = 0.8200 (boolq negation probe, worse of the two directions) — artifact: `scripts/sft/consistency_v5.json`
  - exact_laws_brier = 0.0332 (held-out exact-laws split (ground truth by construction)) — artifact: `scripts/sft/exact_eval_v5.json`

### deem-v3
- Backbone: Qwen3-1.7B-Base
- Date: 2026-09-21
- Note: Order-randomized retrain: flip-rate catastrophe fixed, but negation blindness exposed (consistency error 0.895).
- Note: Exact-laws environments were not trained or evaluated at this checkpoint.
- Metrics:
  - macro_accuracy = 0.7682 (held-out test split (argmax, per-dataset macro)) — artifact: `scripts/sft/results_v3.json`
  - macro_ece_pre_scaling = 0.1064 (held-out test split, before temperature scaling) — artifact: `scripts/sft/results_v3.json`
  - macro_ece_post_scaling = 0.0621 (after frozen temperature scaling (macro over per-dataset ECE)) — artifact: `scripts/sft/temperature_v4.json`
  - flip_rate = 0.0800 (mean over 5 probe datasets: ag_news, amazon_reviews_multi_en, fever, mmlu, snli) — artifact: `scripts/sft/consistency_v3.json`
  - negation_consistency_error = 0.8949 (boolq negation probe, mean |P(a) - (1 - P(not a))|) — artifact: `scripts/sft/consistency_v3.json`
  - negation_paired_accuracy = 0.2133 (boolq negation probe, worse of the two directions) — artifact: `scripts/sft/consistency_v3.json`
- Not measured: exact_laws_brier (— in the table)

### deem-v4
- Backbone: Qwen3-1.7B-Base
- Date: 2026-09-21
- Note: Negation-pair retrain: negation blindness fixed at zero accuracy cost.
- Note: Exact-laws macro Brier 0.328 is the pre-v5 baseline (v4 never trained on the domain).
- Metrics:
  - macro_accuracy = 0.7657 (held-out test split (argmax, per-dataset macro)) — artifact: `scripts/sft/results_v4.json`
  - macro_ece_pre_scaling = 0.1134 (held-out test split, before temperature scaling) — artifact: `scripts/sft/results_v4.json`
  - macro_ece_post_scaling = 0.0683 (after frozen temperature scaling (macro over per-dataset ECE)) — artifact: `scripts/sft/temperature_v4.json`
  - flip_rate = 0.1000 (mean over 5 probe datasets: ag_news, amazon_reviews_multi_en, fever, mmlu, snli) — artifact: `scripts/sft/consistency_v4.json`
  - negation_consistency_error = 0.0128 (boolq negation probe, mean |P(a) - (1 - P(not a))|) — artifact: `scripts/sft/consistency_v4.json`
  - negation_paired_accuracy = 0.8267 (boolq negation probe, worse of the two directions) — artifact: `scripts/sft/consistency_v4.json`
  - exact_laws_brier = 0.3284 (held-out exact-laws split (ground truth by construction)) — artifact: `scripts/sft/exact_eval_v5.json`

### deem-v5
- Backbone: Qwen3-1.7B-Base
- Date: 2026-09-21
- Note: Exact-laws mix + per-dataset calibration; best checkpoint on every consistency probe.
- Note: ECE (post) uses per-dataset temperature scaling; macro gate 0.0612 vs <= 0.06 near-miss.
- Note: mmlu flip rate 0.347 is an honest-uncertainty outlier (near-uniform targets); the other four probes are <= 0.02.
- Metrics:
  - macro_accuracy = 0.7627 (held-out test split (argmax, per-dataset macro)) — artifact: `scripts/sft/results_v5.json`
  - macro_ece_pre_scaling = 0.1216 (held-out test split, before temperature scaling) — artifact: `scripts/sft/results_v5.json`
  - macro_ece_post_scaling = 0.0612 (after frozen temperature scaling (macro over per-dataset ECE)) — artifact: `scripts/sft/temperature_v5.json`
  - flip_rate = 0.0773 (mean over 5 probe datasets: ag_news, amazon_reviews_multi_en, fever, mmlu, snli) — artifact: `scripts/sft/consistency_v5.json`
  - negation_consistency_error = 0.0073 (boolq negation probe, mean |P(a) - (1 - P(not a))|) — artifact: `scripts/sft/consistency_v5.json`
  - negation_paired_accuracy = 0.8200 (boolq negation probe, worse of the two directions) — artifact: `scripts/sft/consistency_v5.json`
  - exact_laws_brier = 0.0332 (held-out exact-laws split (ground truth by construction)) — artifact: `scripts/sft/exact_eval_v5.json`

### deem-rlcd-v1
- Backbone: Qwen3-1.7B-Base (SFT v5 + RLCD)
- Date: 2026-09-21
- Note: RLCD run over the v5 checkpoint (KL anchor lambda=10, 1 epoch), chosen by dev macro Brier.
- Note: Full held-out test split (4,970 rows), same protocol as deem-v5: macro accuracy holds at 0.7623 vs 0.7627.
- Note: Exact-laws macro Brier improves to 0.0291 (v5: 0.0332); counting zero-answer rows stay perfect (55/55).
- Note: Post-scaling ECE uses a v6-style per-class temperature calibrator (scripts/rl/calibration_rlcd_v6.json, arm b_temp) fit on the dev half of the held-out rows, scored on the untouched eval half.
- Note: Negation consistency and flip rates are unchanged from v5 (mmlu flip 0.347 is the same honest-uncertainty outlier).
- Metrics:
  - macro_accuracy = 0.7623 (held-out test split (argmax, per-dataset macro)) — artifact: `scripts/rl/results_rlcd_full.json`
  - macro_ece_pre_scaling = 0.1209 (held-out test split, before temperature scaling) — artifact: `scripts/rl/results_rlcd_full.json`
  - macro_ece_post_scaling = 0.0424 (v6 honest split: untouched eval half (calibrator fit on the dev half only), frozen v5 checkpoint + per-class calibrator; chosen arm b_temp (per-class calibration)) — artifact: `scripts/rl/results_rlcd_v6.json`
  - flip_rate = 0.0787 (mean over 5 probe datasets: ag_news, amazon_reviews_multi_en, fever, mmlu, snli) — artifact: `scripts/rl/consistency_rlcd.json`
  - negation_consistency_error = 0.0071 (boolq negation probe, mean |P(a) - (1 - P(not a))|) — artifact: `scripts/rl/consistency_rlcd.json`
  - negation_paired_accuracy = 0.8200 (boolq negation probe, worse of the two directions) — artifact: `scripts/rl/consistency_rlcd.json`
  - exact_laws_brier = 0.0291 (held-out exact-laws split (ground truth by construction)) — artifact: `scripts/rl/exact_eval_rlcd.json`

### deem-v2
- Backbone: Qwen3.5-0.8B
- Date: 2026-09-21
- Note: First 8-anchor SFT run; position-shortcut catastrophe (SPEC §3) — flip rates 0.92-0.99.
- Note: Evaluated on the earlier 8-anchor split; per-dataset row counts differ from v3-v5 (see leaderboard.json extra).
- Note: No exact-laws training or eval; no temperature scaling was fit for this checkpoint.
- Metrics:
  - macro_accuracy = 0.6788 (held-out test split (argmax, per-dataset macro)) — artifact: `scripts/sft/results_v2_qwen35_08b.json`
  - macro_ece_pre_scaling = 0.0532 (held-out test split, before temperature scaling) — artifact: `scripts/sft/results_v2_qwen35_08b.json`
  - flip_rate = 0.9680 (mean over 5 probe datasets: ag_news, amazon_reviews_multi_en, fever, mmlu, snli) — artifact: `scripts/sft/consistency_v2.json`
  - negation_consistency_error = 0.2437 (boolq negation probe, mean |P(a) - (1 - P(not a))|) — artifact: `scripts/sft/consistency_v2.json`
  - negation_paired_accuracy = 0.4333 (boolq negation probe, worse of the two directions) — artifact: `scripts/sft/consistency_v2.json`
- Not measured: macro_ece_post_scaling, exact_laws_brier (— in the table)

Generated by `eval/tare/leaderboard.py` from the entries in `eval/tare/entries/`. Lower is better for ECE (pre/post), flip rate, negation error and exact-laws Brier; higher is better for accuracy and negation paired accuracy. `—` means not measured — never zero.