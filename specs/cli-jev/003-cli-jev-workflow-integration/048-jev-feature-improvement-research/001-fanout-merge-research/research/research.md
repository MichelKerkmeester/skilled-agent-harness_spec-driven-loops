---
title: "Deep Research: Improving the Jev Fan-Out Merge (feature 030)"
description: "Merged two-lineage research on why the Jev fan-out merge measured keep, how to raise its accuracy and lower its cost, how to make the measurement trustworthy, where else the judgment pays off, and what default-on would need."
trigger_phrases:
  - "jev fan-out merge improvement"
  - "fanout merge semantic dedup research"
  - "score-fanout-pairs early stop"
importance_tier: "important"
contextType: "research"
---
# Deep Research: Improving the Jev Fan-Out Merge (feature 030)

Two lineages researched the same five questions independently: DeepSeek V4.1 Flash at max thinking through cli-pi (5 iterations) and GPT-6 Luna at max reasoning on the fast tier through cli-codex (3 iterations). This report merges them. Where the lineages disagree the disagreement is named. Four numeric claims were recomputed by the orchestrating session from the call log and labels and are marked **[session-verified]**. Everything else is a lineage claim with its cited source.

## Table of Contents

1. Research Metadata
2. Request Summary
3. What Drove the Result
4. Raising Accuracy and Lowering Cost
5. Making the Measurement More Trustworthy
6. Other .skilled Judgment Opportunities
7. Default-On Integration: Requirements, Cost, and Risk
8. Ranked Recommendations
9. Confirmed, Inferred, and Unknown
10. Eliminated Alternatives
11. Divergence Map
12. Open Questions
13. Lineage Agreement and Disagreement
14. Evidence Ledger
15. Method and Evidence Limits
16. References
17. Convergence Report

---

## 1. Research Metadata

- **Feature**: 030 fan-out merge shadow record, measured `keep` in phase 047
- **Measured row**: `verdict jev: keep K=60 M=60 A=53 B=12 W=44 L=3 F=3 p=1.232e-10` [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:18]
- **Lineages**: `deepseek` 5 of 5 iterations, `luna` 3 of 3, both `maxIterationsReached`
- **Merge**: `fanout-merge.cjs` merged 2 lineages, 0 skipped; attribution in `fanout-attribution.md`
- **Date**: 2026-10-03

## 2. Request Summary

Answer five questions with `file:line` evidence: what drove the result, how to raise accuracy or lower cost, how to make the measurement more trustworthy, where else in `.skilled` the same judgment would pay off, and what a default-on integration would need, cost and risk. Research only. Nothing in production changed.

## 3. What Drove the Result

**The baseline was blind to the class being measured.** All 60 labeled pairs are cross-body, and the census found no near-line pairs at all. The production merge collapses two findings only when their body keys match and their titles overlap, so on cross-body pairs it answers "different" every time. B=12 is exactly what a constant "different" guess scores against 48 same and 12 different labels. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:345-354] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:399-402] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:7-20]

**Jev's own record is solid on that class.** Derived from the class totals and W/L, Jev found 44 of 48 same pairs and cleared 9 of 12 different pairs, with 3 false merges and 4 misses. The 53/60 total reproduces from the call log at the scorer's 0.5 cut **[session-verified]**. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1155-1204]

**The keep depends on the comparison frame.** A constant "same" guess scores 48/60, and the margin gate `10*(A-B) >= M` gives 50 < 60 against it. DeepSeek also reports that a zero-call lexical Jaccard rule over the same text ties Jev at 53/60. Against either non-blind baseline the verdict would be `stop (margin)`. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1120-1129]

**The p-value is real but narrow.** It is the exact one-sided sign tail over 47 discordant pairs. It does not model clustering by run or repeated findings. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1090-1128]

## 4. Raising Accuracy and Lowering Cost

1. **Stop after two agreeing orders.** The first two calls (AB, BA) agree on 58 of 60 pairs **[session-verified]**, and under the modal rule a third call cannot overturn a 2-0. Stopping there cuts the run from 181 calls to about 123 with every verdict unchanged. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:86-87]
2. **Replace the AB-repeat tiebreak.** `JEV_ORDERS = ['AB', 'BA', 'AB']` breaks a 1-1 split toward the AB reading. DeepSeek reports both recorded splits were labeled same with BA on the right side, so a symmetric tiebreak lifts the column to 55/60. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:86-87]
3. **Calibrate the cut on held-out data.** At 0.4 the column scores 57/60 and at 0.45 it scores 55/60 **[session-verified]**. The three residual false merges are confident (0.59 to 0.93), so no cut removes them. Tune on held-out runs only, since tuning on these 60 overfits.
4. **Know the cheap ceiling.** DeepSeek's lexical rule tie at 53/60 means model value only exists above that line. Luna adds the cascade form: skip pairs that exact-ID or normalized-content identity already settles, and call Jev only for ambiguous cross-body candidates. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:345-402]
5. **Bound the spend.** The scorer builds cross-lineage pairs before its lexical filter, so candidate count grows with the cross-product of findings. A per-run cap on pairs, tokens, elapsed time and retries is needed before any live use. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:427-461]

**Cost as measured.** Mean call latency is 323 ms, median 318 ms, across the 181 logged calls **[session-verified]**, against a 90-second per-call timeout. Dollar cost is UNKNOWN: no price is recorded. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:93]

## 5. Making the Measurement More Trustworthy

1. **Report against more than one baseline.** Publish constant-same and a lexical rule beside the merge oracle so a blind incumbent cannot carry a keep on its own.
2. **Disclose oracle dropouts.** DeepSeek reports 4 of 60 pairs are undecidable for the merge (inactive review findings), all labeled same and counted as baseline errors without disclosure. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:488-508]
3. **Thicken the different class.** DeepSeek reports 8 of the 12 different labels are bare dimension-name pairs from one run, leaving 4 with real discrimination. Luna asks for stratification by loop, candidate class and source run, with whole runs held out.
4. **Re-adjudicate the contested labels.** DeepSeek flags 3 different-labeled pairs as near-verbatim restatements Jev confidently called same. Relabeling them would move the column to 56/60. The rubric's notion of identity ("one fix closes both") and the question asked ("describe the same problem?") may diverge. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:3-15]
5. **Make the verdict self-describing.** `report.json` records no label digest, labeler, date or per-pair oracle decision, so the census reproduces in-tree and the verdict does not. Add a label content hash, rubric version, scorer hash and per-call order and status. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1475-1486]
6. **Fix the statistical unit.** Recompute uncertainty by run or finding cluster, not by pair row. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1306-1320]

## 6. Other .skilled Judgment Opportunities

The lineages found different candidates. DeepSeek stayed inside the deep-loop runtime. Luna looked across spec-kit.

- **The merge's own question and ruled-out streams (DeepSeek, highest payoff).** These still match by exact id, so restated questions and directions reach synthesis as duplicates. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:759-787]
- **`claim-continuity` (DeepSeek).** The matcher already accepts `equivalent`, `distinct` and `topical_only` semantic candidates with a similarity score in [0, 1]. The missing piece is a producer. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/claim-continuity/claim-matching.ts:109-123]
- **`conditional-fanin` (DeepSeek).** Branch agreement is exact `agreementKey` equality, so substantive agreement under different keys reads as none. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/conditional-fanin/sufficiency.ts:22-34]
- **`contradiction-supersession` (DeepSeek).** Pair identity exists. Whether a pair contradicts is caller-supplied. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/contradiction-supersession/event-registry.ts:157-181]
- **RRF retrieval fusion (Luna).** Fuses by canonical ID, so equivalent content under distinct IDs stays as separate results. [SOURCE: .skilled/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts:197-213]
- **Context compaction (Luna).** Removes a later line after seeing the same file path, where a semantic judge could tell redundancy from new evidence, at real deletion risk. [SOURCE: .skilled/skills/system-spec-kit/shared/compact-merger.ts:128-155]

None of these is proven by the 030 pair set. Each needs its own labels.

## 7. Default-On Integration: Requirements, Cost, and Risk

**Requirements.** A named reader, since 030 names none and grants no promotion. A no-loss fallback that degrades byte-identically to today's hermetic merge and keeps both findings whenever judgment is unavailable or uncertain. A separately bounded asynchronous stage, because the existing merge functions are synchronous. An explicit finding-text egress rule. Pinned client, model and prompt versions. A decision on the publication guard, which today withholds live pre-commit pairs as `unmeasured_unpublished`. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md:93-96] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1357-1400] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:886-911]

**Not the existing flag.** `SPECKIT_FANOUT_NEAR_DUP_DEDUP` governs same-body title-aware matching. The measured lift is cross-body, so flipping it is not this integration. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:504-553]

**Cost.** About 323 ms per call and 2 to 3 calls per pair. DeepSeek counts 124 candidate pairs across 104 runs, about 1.2 per run, so seconds per typical run.

**Risk.** 3 of 47 same calls were false merges (6.4%) and 4 of 48 true pairs were missed (8.3%). A false merge in review hides a distinct defect, and a collapse changes the P0/P1/P2 counts bound into synthesis. Review needs its own holdout. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:835-914]

**Tiers (DeepSeek, consistent with Luna's staged plan).** T0: zero-call census line in the attribution, default-on now. T1: shadow judgment with a named reader. T2: non-collapsing annotation. T3: model as the collapse decision stays dropped.

## 8. Ranked Recommendations

| # | Recommendation | Evidence | Effort | Cost |
|---|---|---|---|---|
| R1 | Report Jev against constant-same and a lexical rule beside the merge oracle | 10*(53-48)=50<60; lexical tie 53/60 | Low | Zero |
| R2 | Stop after two agreeing orders and use a symmetric tiebreak | 58/60 agree after two calls [session-verified]; 181 to ~123 calls | Low | Negative |
| R3 | Make `report.json` self-describing: label digest, rubric and scorer hash, per-pair oracle decision, disclosed dropouts | scorer:1475-1486, 488-508 | Low | Zero |
| R4 | Second rater on the different class, re-adjudicate the 3 contested pairs, stratified holdout by run | 8 of 12 different labels from one run; relabel gives 56/60 | Medium | One labeling session |
| R5 | Calibrate the cut on held-out runs, expecting 0.4 to 0.45 | 57/60 at 0.4 [session-verified] | Low | One held-out batch |
| R6 | Ship T0 census now, T1 shadow with a named reader next, keep T3 dropped | reader unnamed; 6.4% false merge | Low to Medium | Zero at T0 |
| R7 | Extend the judgment to the merge's exact-id question and ruled-out streams as candidate evidence | fanout-merge.cjs:759-787; claim-matching.ts:109-123 | Medium | Per R6 tiers |
| R8 | Build near-line fixtures or declare that class unmeasured | 0 near-line pairs in 124 candidates | Medium | Fixture work |

## 9. Confirmed, Inferred, and Unknown

**Confirmed by the session.** 53/60 at the 0.5 cut, 57/60 at 0.4, 55/60 at 0.45, first-two agreement on 58/60, mean latency 323 ms, all from `~/.skilled/.labels/runs/047-030-jev-20261002/calls.jsonl` joined to `~/.skilled/.labels/030-labels.jsonl`. The tiebreak order at `score-fanout-pairs.cjs:86`, the body-key collapse at `fanout-merge.cjs:345-354` and the claim-matching contract at `claim-matching.ts:109-123` were read directly.

**Lineage claims, not re-run.** The lexical-rule tie at 53/60, the 4 undecidable pairs, the 3 contested labels, the 8-of-12 single-run different class, the 55/60 symmetric-tiebreak figure and the 124-pair census count.

**Unknown.** Dollar cost. Accuracy below the lexical candidate filter. Near-line accuracy. Separate research and review error rates. Clustered uncertainty. Live pair volume in busy workspaces.

## 10. Eliminated Alternatives

| Approach | Reason eliminated | Lineage |
|---|---|---|
| Read the keep as validating near-line dedup | No near-line pair was scored | both |
| Flip `SPECKIT_FANOUT_NEAR_DUP_DEDUP` as the integration | It governs same-body matching, the lift is cross-body | luna |
| More calls per pair | 58/60 already agree after two | deepseek |
| Remove false merges with a cut | They sit at 0.59 to 0.93 | deepseek |
| Model as the collapse decision (T3) | 6.4% false merge, no named reader, review severity risk | both |
| Default-on under the unchanged publication guard | The guard withholds live pairs | deepseek |

## 11. Divergence Map

- **Saturated.** The measured verdict's arithmetic and its blind baseline, covered by both lineages.
- **Pivots.** DeepSeek went into the private call log for per-pair behavior. Luna stayed on checked-in artifacts and treated row-level data as unavailable.
- **Remaining frontier.** Candidate recall below the lexical filter, review-specific safety, and labels for the adjacent surfaces.

## 12. Open Questions

1. How many identical findings fall below the lexical candidate threshold, by loop and run?
2. Does a two-call stop with a symmetric tiebreak hold on a locked holdout?
3. What do the three contested pairs look like under a second rater?
4. What are live pair volume, dollar cost and an acceptable text-egress rule?
5. Does review show acceptable severity preservation on its own holdout?

## 13. Lineage Agreement and Disagreement

Both lineages agree on the blind baseline, on the keep being frame-dependent, on keeping 030 in shadow and on no-loss fallback as a precondition.

They disagree on cost. Luna calls latency and price UNKNOWN because it read only checked-in artifacts. DeepSeek reads 323 ms per call from the private call log, which the session confirmed. Price stays UNKNOWN in both.

They also diverge on adjacent surfaces. DeepSeek names four deep-loop runtime sites. Luna names RRF fusion and context compaction in spec-kit. These are complementary, not conflicting.

## 14. Evidence Ledger

| Claim area | Evidence |
|---|---|
| Measured row | `047-measure-every-jev-feature/scratch/evidence/results.md:18` |
| Labels and rubric | `042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:3-20` |
| Call protocol and gates | `score-fanout-pairs.cjs:80-94, 1090-1204` |
| Production merge | `fanout-merge.cjs:345-402, 504-553, 759-787, 835-914` |
| Adjacent surfaces | `claim-matching.ts:109-123`; `sufficiency.ts:22-34`; `event-registry.ts:157-181`; `rrf-fusion.ts:197-213`; `compact-merger.ts:128-155` |
| Session recomputation | `~/.skilled/.labels/runs/047-030-jev-20261002/calls.jsonl`, `~/.skilled/.labels/030-labels.jsonl` (private, outside the repository) |

## 15. Method and Evidence Limits

Each lineage ran in its own detached directory under `research/lineages/`. The merge rebuilt the registry from lineage state and deltas. Row-level labels and call logs are private and outside the repository, so the session-verified figures cannot be reproduced from the checked-in tree. The adjacent-surface candidates are unmeasured.

## 16. References

- `research/lineages/deepseek/research.md`
- `research/lineages/luna/research.md`
- `research/fanout-attribution.md`
- `research/resource-map.md`
- `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md`

## 17. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 8 (deepseek 5, luna 3)
- Questions answered: 5 / 5
- Remaining questions: 0 of the five; open follow-ups in section 12
- Convergence threshold: 0.05, telemetry only under the max-iterations stop policy
- Divergence summary: see section 11
