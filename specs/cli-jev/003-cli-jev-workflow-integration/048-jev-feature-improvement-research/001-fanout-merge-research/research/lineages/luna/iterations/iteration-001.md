# Iteration 1: Score and Merge Mechanics

## Focus

Trace the production merge rule, the scored pair population, and the arithmetic behind the keep verdict.

## Findings

1. The measured row is K=60 labeled, M=60 measured, Jev correct A=53, baseline correct B=12, with 44 paired wins and 3 losses. This is 88.3% versus 20.0% on the scored pairs, a net 41 more correct. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:18] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1155-1204]

2. The 60 labeled rows were all cross-body pairs. The arbiter labeled 48 same and 12 different, defining same as the same defect at the same concrete location where one fix closes both. The 030 inventory had 124 cross-body candidates, while the 60-row sheet cap selected the scored set; the near-line class was empty. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:7-15] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/spec.md:58] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:543-552]

3. The incumbent baseline says different on every cross-body pair under both dedup settings, so it gets exactly the 12 different labels right. The production near-duplicate rule requires matching normalized body content plus title overlap of at least 0.15; that rule cannot join distinct bodies. This leaves the measured win concentrated in a real blind spot of the current merge. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:17-20] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:345-402] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:488-536]

4. The reported p=1.232e-10 is the exact one-sided binomial tail for W=44 wins among W+L=47 discordant pairs. It is not a test over 60 independent successes. The calculation treats discordant pairs as sign outcomes and does not model clustering among pairs from the same run or repeated findings. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1090-1128] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1177-1188]

5. The keep rule passes full coverage, margin, sign test, and stability gates: 60/60 measured; 10*(53-12) >= 60; p < 0.05; and F=3 is below the 18-vote ceiling (10% of C=180 calls). F counts minority votes against each pair's modal call, so 3 is not a count of three misclassified pairs. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1120-1128] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1155-1186]

6. A constant-same decision would score 48/60, or 80%, on this label mix. This is a derived majority-class reference, not a scorer arm. Jev is five pairs, or 8.3 percentage points, above it; the much larger 41-pair lift is against the incumbent that always says different for cross-body candidates. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:13-20] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:18]

## Sources Consulted

- .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:47-70, 80-93, 488-536, 543-552, 1083-1204
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:345-402, 504-553, 572-606
- specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:1-20
- specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/spec.md:58, 128-146
- specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:3, 18
- specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/001-fanout-merge-research/spec.md:60, 71-78

## Assessment

- newInfoRatio: 0.95
- Novelty justification: The source trace explains the 41-pair win, the pair-class limitation, and the exact denominators behind F and p. These details were not present in the headline result.
- Confidence: High for the row arithmetic and incumbent behavior because the result row, label decisions, scorer, and production merge agree. Medium for generalizing beyond this candidate sample because the near-line class had no examples and pair independence is unproven.

## Reflection

- What worked: Joining the label decisions to the scorer and production merge revealed that the score tests the cross-body blind spot rather than the title-aware same-body path.
- What failed: Aggregate output does not expose Jev's full confusion matrix by label or by source run.
- Ruled out: Treating the keep as validation of near-line dedup, or treating the p-value as evidence that pair rows are independent.

## Recommended Next Focus

Measure the limits of the label and sampling procedure, then identify accuracy and call-cost changes that preserve the scorer's useful checks.
