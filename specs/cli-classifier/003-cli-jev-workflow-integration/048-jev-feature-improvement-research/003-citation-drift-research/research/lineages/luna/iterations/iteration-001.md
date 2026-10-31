# Iteration 1: Decode the score and sample

## Focus

Explain the recorded Jev result from the scorer and its labeled sample, including what the counts establish and what they do not.

## Actions Taken

- Read the scorer's comparator, verdict, and Jev-arm logic; read the feature-catalog description and the Phase 047 recorded run.
- Traced each displayed count to its calculation and checked the fixed keep gates against the recorded values.
- Compared the sample construction with the stated run size. No code, labels, or source artifacts were changed, and the recorded measurement was not rerun.

## Findings

1. The result is a paired comparison on one 40-row labeled set. `K=40` is the labeled-row count and `M=40` the rows measured; `A=35` is Jev's number correct and `B=13` is the better baseline's number correct. The baseline is the stronger of flag-nothing and identifier overlap, selected on the same rows (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:607-630`). Thus Jev scored 87.5% and identifier overlap 32.5%, a 55-point accuracy gap on this sample.

2. `W=22` and `L=0` count discordant paired outcomes where Jev alone was right or the comparator alone was right; the other 18 rows were ties (derived from `M=40`). The scorer's exact one-sided binomial sign test uses only discordant pairs, so `p = 1/2^22 = 2.384e-7` supports an advantage over this comparator on this sample, not a general claim about future documents (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:674-690,700-707`).

3. `TP=26` and `FP=0` mean every row Jev flagged as drifted was labeled drifted. With `A=35`, these counts imply 9 true negatives and 5 false negatives; precision is 1.0, while recall is 26/31 (about 0.84). This is derived from the scorer's definitions of flagged drift, correctness, and confusion counts (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1157-1174`). A zero false-positive count on 40 rows is encouraging but too small to establish a production false-alarm rate.

4. `F=3` is the sum of dissenting rerun votes from each row's modal flag, not three bad labels or three flipped rows. With 3 reruns per row, that is 3 dissenting votes among 120 measured votes (2.5%). The keep gate permits up to 10% of rerun votes to dissent: `10*F <= 3*M` (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1009-1014,1157-1164,82`). This disambiguates the packet's “flip rate” wording (`specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/goal.md:55`).

5. The keep gates all pass with room: coverage is 40/40; precision is 26/(26+0); margin is 35−13=22 correct rows against a required 4; the paired sign test is below .05; and the rerun dissent rate is 2.5% against a 10% cap (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:82,700-707`). The recorded run identifies the commit, 121 logged subprocess calls, median/p95 latency of 326/423 ms, Brier score .1053, labels hash, Jev version, provider, and model (`specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/goal.md:122`).

6. The sample is mixed rather than a production-prevalence sample: 20 operator-labeled live citations plus 20 constructed cases whose window is moved 60 lines down within its own file and labeled contradictory by construction (`.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md:28`). The reported run is tied to one commit and one labels hash (`specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/goal.md:122`). It demonstrates strong discrimination on this small fixed benchmark; it does not estimate how often citations drift in ordinary docs or guarantee the same rates across skills, claim types, or future revisions.

7. The deterministic scan and Jev answer different questions. The scan checks whether a prose citation resolves to a tracked file and whether its line is in range, while Jev judges whether the cited window supports the claim; the default scan makes zero calls (`.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md:18-20,26,30`). Keep those as separate outputs: structural dead-citation detection remains cheap and exhaustive, while semantic support is an optional or separately gated judgment.

## Questions Answered

- **What drove the result?** Full coverage, perfect observed precision, a 22-row accuracy gain over identifier overlap, 22 paired wins and no paired losses, and only 3 dissenting votes across 120 rerun votes; each fixed keep gate passed.
- **What does it establish?** Jev strongly beat the identifier-overlap baseline on the recorded 40-row mixed sample at the recorded commit.
- **What does it not establish?** Production drift prevalence, future-doc generalization, or precise error rates from an independent representative holdout.
- **Which distinction must later work preserve?** Deterministic path/line resolution is not semantic claim support.

## Questions Remaining

- How can label quality, sample representativeness, uncertainty reporting, and cost controls improve without weakening the deterministic zero-call scan?
- Which other `.skilled` checks make decisions about meaning that deterministic rules cannot settle?
- What lifecycle, consent, privacy, and latency controls would a default-on semantic arm require?

## Next Focus

Inspect the scorer's measurement and call path, identify concrete ways to improve accuracy or reduce cost, and design a more trustworthy evaluation set and report.
