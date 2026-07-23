# Iteration 8: Fresh joined RRF calibration and bounded proposal

## Focus

Produce the fresh joined RRF calibration report and a bounded numeric calibration proposal without rebuilding stale distribution artifacts or modifying the investigated advisor surface.

## Actions Taken

1. Re-read the append-only state, reducer-owned strategy, prior blocked iteration, and deep-research iteration contract.
2. Inspected the current-source scorer, frozen accuracy fixtures, ratchet test, and calibration entry points.
3. Tested non-writing source runners; Bun exposed a dependency-resolution failure, while the installed TSX loader's CLI IPC was sandbox-blocked.
4. Ran the scorer through Node with TSX's loader hook, using the ratchet's frozen filesystem-projection environment, and joined full-corpus, holdout, ambiguity-slice, confidence-floor, uncertainty-band, and threshold-grid measurements.

## Findings

### 1. The fresh joined report now exists

Under the reproducible filesystem projection with built-in semantic scoring disabled and test-fixture semantics enabled, current source scores:

| Slice | Correct | Accuracy | Covered | Coverage | Selective precision |
|---|---:|---:|---:|---:|---:|
| Full corpus | 148/193 | 76.68% | 180/193 | 93.26% | 75.00% |
| Independent holdout | 57/78 | 73.08% | 61/78 | 78.21% | 85.25% |
| Frozen ambiguity slice | 16/25 | 64.00% | 20/25 | 80.00% | 55.00% |

This is current-source evidence rather than stale `dist` output. The holdout narrowly clears the ratchet's 72.5% release floor; the ambiguity slice remains materially weaker than the aggregate. [SOURCE: command: Node + TSX loader joined scorer run, 2026-07-16] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:1-220]

### 2. The `0.82` task-intent floor is saturated and not probability-like

Exactly `0.82` was the leading confidence for 60/193 full-corpus rows (31.09%), 20/78 holdout rows (25.64%), and 12/25 ambiguity-slice rows (48.00%). Lead-label correctness inside those plateaus was only 38/60, 13/20, and 7/12 respectively. A quarter of holdout prompts sharing one confidence while differing substantially in correctness confirms that this value is a policy floor, not calibrated likelihood. [SOURCE: command: Node + TSX loader joined scorer run, 2026-07-16] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts:45] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:385-443]

### 3. Ambiguity is common, and the hardest slice validates the warning

The scorer marked 90/193 corpus rows (46.63%), 24/78 holdout rows (30.77%), and 19/25 ambiguity-slice rows (76.00%) ambiguous. Correctness among marked rows was 58/90, 20/24, and 11/19. The slice's 64% overall result and 55% selective precision show that ambiguity is not cosmetic: contested prompts are where routing quality is weakest. Several holdout executor-delegation results were globally ambiguous while their leading recommendation carried no local `ambiguousWith` members, indicating that result-level ambiguity and per-recommendation cluster attribution should be reconciled in the future joined evaluator. [SOURCE: command: Node + TSX loader joined scorer run, 2026-07-16] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts:10-57] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:752-868]

### 4. Uncertainty and external thresholds have discrete plateaus

Holdout leading uncertainties fell into four bands: 24 at `<=0.15`, 33 at `0.16-0.25`, 6 at `0.26-0.35`, and 15 above `0.35`. Across a 12-cell grid, confidence thresholds `0.78`, `0.80`, and `0.82`, crossed with uncertainty thresholds `0.30`, `0.35`, and `0.40`, all produced the same 57/78 correctness, 61/78 coverage, and 85.25% selective precision. Raising confidence to `0.84` reduced coverage to 42/78 (53.85%) and correctness to 41/78 (52.56%) for only a 2.85-point selective-precision gain. Threshold-only tuning therefore cannot repair the floor saturation. [SOURCE: command: Node + TSX loader joined scorer run, 2026-07-16] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:443-470] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:752-848]

### 5. Bounded numeric calibration proposal

Keep the compatibility contract at confidence `0.80` and uncertainty `0.35` (deltas `0.00/0.00`), and keep the `0.05` ambiguity margins unchanged. The current grid supplies no evidence for moving those public gates.

As a shadow-only scorer experiment, change only `SCORING_CALIBRATION.confidence.taskIntentFloor` from `0.82` to `0.80`. Re-run the same joined evaluator and reject the change unless all three current-source guards hold: holdout correctness at least 57/78, holdout coverage at least 61/78, and ambiguity-slice correctness at least 16/25. This trial is intentionally narrow: it tests whether reported confidence can stop overstating weak task-intent evidence without sacrificing routing. It is not evidence to ship the change yet. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts:45] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/compat/contract.ts:5-35]

## Questions Answered

- Q1: Exact RRF normalization was answered previously; this iteration adds the missing current-source floor frequency, ambiguity composition, uncertainty bands, holdout correctness, and threshold sensitivity.
- The final numeric proposal is now answered: public thresholds remain `0.80/0.35`; the sole shadow candidate is internal task-intent floor `0.82 -> 0.80`, gated by the three unchanged empirical floors above.

## Questions Remaining

- Does the shadow `0.80` floor candidate preserve the three gates when implemented in a separate, authorized change packet?
- Why can result-level ambiguity remain true while the leading executor recommendation has no `ambiguousWith` attribution?
- The joined evaluator should add calibration error or reliability bins; accuracy and floor frequency establish miscalibration risk but do not estimate probability calibration directly.

## Next Focus

Stress-test the bounded floor proposal and ambiguity-attribution mismatch against adversarial and executor-delegation slices, without changing the production scorer.

## Sources Consulted

- Current scorer and calibration policy: `lib/scorer/fusion.ts`, `lib/scorer/ambiguity.ts`, and the calibration constants located by `taskIntentFloor`.
- Frozen corpora and accuracy gates: `scripts/routing-accuracy/*.jsonl`, `tests/scorer/ambiguity-slice.vitest.ts`, and `tests/parity/scorer-eval-baseline-ratchet.vitest.ts`.
- Non-writing execution evidence: Bun import failure, TSX CLI IPC failure, and successful Node TSX-loader joined run.

## Reflection

The failed runner direction from iteration 7 was narrower than recorded: the standalone TSX binary was unavailable, but another checked-in skill carried TSX's loader hook. Running through that loader preserved the read-only target boundary and eliminated the stale-`dist` dependency.

## Ruled-Out Directions

- Raising the public confidence threshold to `0.84`: it drops holdout coverage by 24.36 points for only 2.85 points of selective-precision gain.
- Moving the public uncertainty threshold anywhere from `0.30` to `0.40`: the current holdout behavior is unchanged across that interval.
- Treating exact `0.82` confidence as empirical 82% correctness: observed plateau correctness is materially lower.

## Assessment

- `newInfoRatio`: 0.78
- Novelty justification: the iteration produced the previously missing joined measurements and converted an open calibration question into a bounded, falsifiable numeric proposal.
- Confidence: high for the reported counts under the frozen test environment; medium for the shadow-floor proposal until the authorized experiment runs.

