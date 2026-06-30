# Iteration 048 — Empirical (host-run): deltaE threshold correction

## Focus
The deferred experiment from the completeness critic: measure deltaE<3 (current) vs deltaE<10 (proposed in research.md TIER-1 A3) color-merge behavior on the real anobel `tokens.json`.

## Method
Computed pairwise OKLCH ΔE (the cluster.ts euclidean-on-×100-OKLCH metric) across anobel's 15 color tokens; counted merges at each threshold and inspected the new merges in the 3..10 band.

## Findings
1. **[P0] deltaE<10 OVER-MERGES distinct brand colors — TIER-1 recommendation A3 is REFUTED by data.** At deltaE<3 (current): 0 merges. At deltaE<10 (proposed): 9 new merges, including:
   - `#06458c ~ #043367` (ΔE=7.9) — Nobel Navy and Deep Navy, the TWO DISTINCT endpoints of anobel's gradient scale. Merging them destroys the gradient.
   - `#b4120e ~ #d31510` (ΔE=6.6), `#b4120e ~ #bb3a12` (ΔE=5.3) — distinct brand red + campaign red/orange.
   - `#fefefe ~ #e2e2e2` (ΔE=8.4), `#cfcfcf ~ #e2e2e2` (ΔE=5.8) — distinct surface grays.
   Raising deltaE to <10 would collapse these into single tokens, LOSING real brand colors — the opposite of the fidelity goal.
2. **[P0] The correct fix is the COVERAGE-ELECTION pre-gate, not loosening deltaE.** iter-044 verified the prevalence/coverage pre-gate as SOUND + ADDITIVE (excludes one-off L4 leaks without merging distinct colors). The L4 leakage (#646464) should be fixed by coverage gating, while deltaE stays tight (<3) to preserve distinct brand colors. research.md's own "regression risk on visually distinct colors" caveat is empirically confirmed as a blocking risk, not a minor one.
3. **[P1] research.md correction required.** Demote A3's "raise deltaE <3→<10" from TIER-1 to REFUTED/DEFER; promote the coverage pre-gate as the primary clustering fix. The deltaE value should only change with a measured per-site review (the regression guard), never as a blanket default.

## Questions Answered
- Does deltaE<10 over-merge on real data? YES — 9 distinct-color pairs including the brand navies.
- Is the deltaE change a slam-dunk? NO — it is refuted by the anobel measurement; coverage-gating is the safe fix.

## Questions Remaining
- RESERVED: emergent angles/risks (permanently open)
- Re-measure deltaE on the 4 gold-standard examples to set a defensible per-corpus threshold (future packet).

## Next Focus
Apply this correction to research.md; integrate red-team + pre-mortem; finalize.

## Summary
A live measurement reversed a TIER-1 recommendation: raising the deltaE clustering threshold to <10 would wrongly merge 9 distinct-color pairs on anobel (incl. the two brand navies and brand reds), so it is REFUTED. The coverage-election pre-gate — verified SOUND/additive — is the correct clustering fix, with deltaE kept tight. This is the "measure live before changing" discipline catching a plausible-but-wrong recommendation.
