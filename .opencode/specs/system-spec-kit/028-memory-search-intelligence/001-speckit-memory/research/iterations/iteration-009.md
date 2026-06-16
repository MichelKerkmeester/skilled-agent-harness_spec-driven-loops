# Iteration 9: Adversarial Verification — RRF k=40-vs-60 Tuning Coupling

## Focus
Round A verification of the Memory open item: is k=40→60 (aionforge uses 60) a safe isolated change, or co-tuned with the calibrated-overlap-bonus constants? Read-only.

## Actions Taken
1. Read the k constant + resolver in `rrf-fusion.ts` (`:38` DEFAULT_K=40, `:150-164` resolveRrfK precedence).
2. Read the production fusion site (`hybrid-search.ts:1582`) and the eval harness (`k-value-analysis.ts:131,154,622`).
3. Read the calibrated-overlap-bonus constants + math (`rrf-fusion.ts:49,55,310,356-386,590-622`).

## Findings (file:line)

**k=40 is a single shared env-overridable constant — [CONFIRMED].** `DEFAULT_K=40` [rrf-fusion.ts:38]; precedence caller-k > `SPECKIT_RRF_K` > 40 (`:150-164`). Production `fuseResultsMulti(fusionLists)` passes NO k → uses shared 40 [hybrid-search.ts:1582]. Only the eval harness overrides per-call, with `BASELINE_K=60` [k-value-analysis.ts:131] — so aionforge's 60 matches the EVAL baseline, not prod. Flipping prod to 60 is one env/constant change.

**k is NOT isolated — co-tuned with the bonus regime — [CONFIRMED].** Base RRF = `1/(k+rank+1)` (~0.0244@k40 → ~0.0164@k60, ≈33% shrink), but the calibrated overlap bonus `beta*overlapRatio*meanNorm` is clamped to an ABSOLUTE ceiling `CALIBRATED_OVERLAP_MAX=0.06` (`:55`, beta=0.15 `:49`). Raising k shrinks the base while the absolute-capped bonus does not → bonus-to-base ratio grows (~2.5×→~3.7×) and meanNorm lifts for non-top candidates. The flat-path `CONVERGENCE_BONUS=0.10` (`:39,:383`) is k-independent-additive (even more coupled). So MAX/BETA/CONVERGENCE_BONUS are tuned to the k=40 regime; raising k needs JOINT re-calibration. [CONFIRMED — roadmap's "leave at 40 unless benchmark says otherwise" upheld; raising it is a co-tuned change.]

## Questions Answered
- Is k 40→60 safe-isolated? **NO** — structurally coupled to CALIBRATED_OVERLAP_MAX/BETA + CONVERGENCE_BONUS; treat as a co-tuned change validated by the judged NDCG@10 sweep.

## Questions Remaining
- (new) Does the judged K sweep co-vary CALIBRATED_OVERLAP_MAX/BETA, or hold them fixed while sweeping only k (under-reporting the true best-k under joint tuning)?
- (new) Production never consumes the harness's per-intent best-K selection (hybrid-search.ts:1582 passes no k) — wire it?

## Next Focus
k-tuning is an implementation-packet calibration task, not an isolated flip. New candidate: production best-K wiring + harness-baseline(60)/prod-default(40) reconciliation.
