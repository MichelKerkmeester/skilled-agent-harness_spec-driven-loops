## Verdict

**AGREE-WITH-CHANGES** — confidence 0.72 — The structure is sound but the spec has a circular-validation trap and unresolved design questions that will make the final evidence untrustworthy without fixes.

## What GPT-5.5 got right

- Separating the adoption gate from the measured re-run is correct — the gate is a pure decision function, the driver is measurement, cleanly decoupled.
- The five-sub-gate AND structure (geometry + contrast + casing + palette + MiniMax) with failing-gate recording is the right architecture. Opaque pass/fail would be worse.
- The `recovered-2D` / `downgraded-to-linear` / `improved-linear` tagging (REQ-005) correctly identifies the inflation problem. Most specs this complex miss it entirely.
- The paired tile-level delta requirement (REQ-003) is critical and properly called out — independent angle-sum deltas would overcount.
- The resumable JSONL ledger with idempotent per-tile writes (NFR-R02) is practical engineering, not over-design.
- The linear no-regression check (REQ-006) on prior winners is good defensive measurement.

## Gaps / risks / errors

**1. Circular validation (critical).** The gate determines SHIP. SHIP is measured against the gate. The gate's thresholds are defined by this spec. Success criteria (SC-001: 80-84%) are predictions from the same pipeline research. There is no independent ground truth. If the five sub-gates are systematically permissive for linear tiles and strict for 2D tiles, the SHIP rate rises by converting 2D → linear, the gate "validates" itself, and the report says ADOPT. The spec lists "human spot-check for slop" under Testing (plan.md §5) — that's a throwaway line, not a benchmark. **Fix:** Before the batch run, pre-label 20-30 tiles with independent human SHIP/REJECT judgments. Measure gate precision, recall, and accuracy against those labels. Report them in the lift report.

**2. Open questions are load-bearing design decisions, not footnotes.** The three open questions in spec.md §10 (contrast exit-0 as headline, ADOPT vs ITERATE on downgrade-only gains, MiniMax scope) each change the recommendation output. They are listed as "open" but the acceptance criteria assume answers. REQ-007 says "report ends with exactly one recommendation tied to the decision rule thresholds in checklist.md" — but the decision rule isn't defined yet if these questions are open. **Fix:** Resolve all three before implementation begins. Write the decision rule explicitly in checklist.md as a deterministic function, not prose.

**3. Over-gating as silent ADOPT path.** Requiring all five sub-gates to pass is conservative, which is fine. But the predicted lift table (iter-r4-pipeline.md) assumes the mechanism is "improve 2D tiles," not "reject 2D tiles and count linear survivors." If the gate rejects 8 of 18 baseline-failing 2D tiles and the other 10 improve enough to pass, the SHIP rate rises by ~18% — but 8 tiles are now downgraded, not recovered. The spec's SC-001 range (80-84%) doesn't distinguish this from genuine 2D recovery. **Fix:** Add a hard success criterion: at least 5 of the 18 baseline-failing 2D tiles must be tagged `recovered-2D` (not `downgraded-to-linear`). Without that, the recommendation is ITERATE regardless of SHIP rate.

**4. Cost ceiling is theoretical, not measured.** The "~63 GLM calls" figure (SC-004) comes from the predicted-lift table, which assumes the A1 + gate + one-repair path. But the actual pipeline has six repair sub-stages (steps 6-10), each potentially making API calls. The cost of step 7 (skeleton computation), step 8 (best-of-3 skeletons), and step 10 (MiniMax audit) is not accounted for in the 63-call figure. **Fix:** Before the batch run, dry-run 3-5 tiles and measure actual GLM + paid-call counts. Adjust the ceiling based on observed cost, not predicted cost.

**5. N=45 gives ~±10pt confidence bands, not ±3pt.** With 45 tiles, each tile is 2.2 percentage points. The conservative/optimistic bands in SC-001 (80-84% vs 87-91%) imply ±3-4pt precision. But with binomial variance on n=45 and the tile-level heterogeneity (some are easy linear winners, some are hard 2D diagrams), the 95% confidence interval on SHIP rate is roughly ±10-12 points. The predicted lift table's bands are overconfident. **Fix:** Report the actual confidence interval alongside the point estimate. Don't claim "80-84% conservative" when the real interval is 68-92%. Be honest about what n=45 can and cannot distinguish.

**6. Skeleton quality bottleneck is an unmeasured dependency.** Step 7 (skeleton-first 2D) is the novel mechanism. If skeleton scoring is weak, GLM faithfully renders bad geometry, the gate rejects it, and the tile gets downgraded. The spec's risk table mentions this (Risk: "Skeleton quality bottleneck — skeleton-first moves the hard problem upstream") but the mitigation is just "keep MiniMax status in the gate + human spot-check." That's not a mitigation — it's a detection mechanism that doesn't prevent the problem. **Fix:** Add a pre-batch skeleton quality check: generate skeletons for 5 representative 2D tiles, have a human score them for geometric plausibility before running the full batch.

## Strongest improvement or alternative

**Add an independent human-labeled ground-truth set of 25-30 tiles before the batch run.** This is the single highest-value change because it (a) breaks the circular validation trap, (b) calibrates the adoption gate's precision/recall, (c) provides a real baseline for measuring lift, and (d) makes the adopt/iterate/recommendation credible. Without it, the entire program's evidence rests on a self-validating gate. Cost: 1-2 hours of human labeling. Value: makes the result trustworthy.

## One thing to test or verify before building this phase

Run the adoption gate (step 11) on the *existing* 004 baseline output — the 45 tiles already rendered. Measure what SHIP rate the gate produces on the baseline tiles *without any pipeline changes*. If the gate's SHIP rate on the baseline is already 70-75% (because it's more permissive than the human labels that produced the 60% figure), then the "lift" from the re-run is partly gate-tuning, not pipeline improvement. This calibration takes 30 minutes and prevents the biggest confound in the entire experiment.