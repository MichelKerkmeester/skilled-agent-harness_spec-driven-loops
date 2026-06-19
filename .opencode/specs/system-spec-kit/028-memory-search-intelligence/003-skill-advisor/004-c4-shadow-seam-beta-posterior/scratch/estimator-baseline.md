# Estimator / Proposal Baseline (before any delta-shape change)

Captured before wiring the Beta posterior, the asymmetric helper, or the C4-seam
promoter. The asymmetric threshold change ships **default-off** (`thresholdRaiseGain`
undefined), so this before-state is also the default after-state — proven by the
`asymmetric threshold wiring stays default-off` test (byte-identical at gain 0).

Source of truth read live (HEAD `03d0b01eb6`):
`lib/scorer/feedback-calibration.ts`, `lib/scorer/weights-config.ts`,
`lib/scorer/lane-registry.ts`.

## Live estimator constants

| Constant | Value |
|---|---|
| `DEFAULT_MIN_SAMPLES` | 8 |
| `DEFAULT_MAX_SKILL_SHARE` | 0.6 |
| `MAX_WEIGHT_DELTA` | 0.03 |
| `MAX_THRESHOLD_DELTA` | 0.05 |
| `MAX_RECORDS` (ring) | 50 |

## Live formulas (raw-frequency, NOT Bayesian)

- Lane weight delta (`:176`, symmetric, unchanged):
  `round4(clamp((acceptancePressure − correctionPressure) * MAX_WEIGHT_DELTA, MAX_WEIGHT_DELTA))`
- Confidence threshold delta (`:200`, sink-only):
  `round4(clamp(correctionRate * MAX_THRESHOLD_DELTA, MAX_THRESHOLD_DELTA))`
- Uncertainty threshold delta (`:201`):
  `round4(clamp(-ignoredRate * MAX_THRESHOLD_DELTA, MAX_THRESHOLD_DELTA))`

There is **no** prior/posterior/alpha/beta math in the scorer at baseline
(grep `posterior|prior|alpha|beta` over `lib/scorer/` = 0 before this sub-phase).

## Worked baseline example (pinned by the existing suite)

Records: 4× `alpha` accepted + 4× `beta` corrected, `minSamples=4`,
attribution `{alpha: explicit_author, beta: lexical}`.

| Output | Baseline value |
|---|---|
| `explicit_author.proposedDelta` | `+0.03` |
| `lexical.proposedDelta` | `-0.03` |
| `confidenceThresholdDelta` | `0.025` (= correctionRate 0.5 × 0.05) |
| `uncertaintyThresholdDelta` | `0` |
| `proposedWeights.explicit_author` | `0.45` |
| `proposedWeights.lexical` | `0.25` |

The "8 vs 10,000 all-accepted" cliff at baseline: both yield the **same**
capped `proposedDelta` (`+0.03`) — the flood the Beta posterior removes
(8 → 0.9, 10,000 → 0.9999, not identical).

## Default shadow-weight channel (resolved at module load)

`{ explicit_author: 0.40, lexical: 0.25, graph_causal: 0.20, derived_generated: 0.10, semantic_shadow: 0.05 }`

## Leverage number

No leverage / "~13% confidence skew" figure is quoted. That number is unsourced
(grep = 0); per the regression-baseline rule it is not cited anywhere in this
sub-phase. The only numbers above are read directly from live code and the
pinned test suite.
