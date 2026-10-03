---
title: "Deep Research: Improving Jev Fan-Out Merge [lineage: luna]"
description: "Three-iteration evidence review of the Jev fan-out merge score, measurement limits, cost controls, adjacent uses, and default-on requirements."
trigger_phrases:
  - "Jev fan-out merge accuracy"
  - "Jev pair measurement"
  - "semantic merge default-on"
importance_tier: "important"
contextType: "research"
---
# Deep Research: Improving Jev Fan-Out Merge

Three inline iterations examined the measured score and production merge, the label and sample process, and integration plus adjacent uses. The answers below distinguish reported measurements from arithmetic derived from them and from forward-looking proposals.

## Table of Contents

1. Research Metadata
2. Request Summary
3. What Drove the Result
4. Raising Accuracy and Lowering Cost
5. Making the Measurement More Trustworthy
6. Other .skilled Judgment Opportunities
7. Default-On Integration: Requirements, Cost, and Risk
8. Confirmed, Inferred, and Unknown
9. Scope and Non-Goals
10. Recommendation
11. Eliminated Alternatives
12. Open Questions
13. Staged Evaluation Plan
14. Evidence Ledger
15. Method and Evidence Limits
16. References
17. Convergence Report

---

## 1. Research Metadata

- **Research ID**: cli-jev/048/001, detached lineage `luna`
- **Feature**: `cli-jev/030-fanout-merge-shadow-record`
- **Status**: Complete for this three-iteration research pass; no implementation or promotion decision was made
- **Date**: 2026-10-03
- **Executor**: inline `cli-codex`, model `gpt-6-luna`
- **Iterations**: 3 of 3; new-information ratios 0.95, 0.82, 0.76
- **Stop policy**: `max-iterations`

## 2. Request Summary

Explain the measured Jev keep result; identify accuracy and cost improvements; make the measurement more trustworthy; locate other `.skilled` tasks where equivalent semantic judgment could help; and define what a default-on integration would require, cost, and risk. Each answer is tied to repository evidence. The measured result is `K=60 M=60 A=53 B=12 W=44 L=3 F=3 p=1.232e-10` on 60 labeled fan-out pairs. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:3,18]

## 3. What Drove the Result

**Answer.** Jev addressed the incumbent’s measured cross-body blind spot. Every scored row was cross-body; the labels called 48 pairs the same finding and 12 different. The incumbent returned “different” for every cross-body pair and therefore matched only the 12 different labels. The existing production rule relies on normalized body identity plus title overlap, so it does not join findings whose bodies differ even when one defect and one fix connect them. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:7-20] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:345-402] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:488-536]

The reported arm scored 53/60 (88.3%) against the incumbent’s 12/60 (20.0%), a net 41 more correct pairs. The paired comparison is 44 Jev-only wins and 3 baseline-only wins. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:18] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1155-1204]

**Derived class view.** Since the incumbent got all 12 “different” labels correct and all 48 “same” labels wrong, W=44 and L=3 imply this Jev confusion table for the selected set:

| Gold label | Jev says same | Jev says different | Total |
|---|---:|---:|---:|
| Same | 44 | 4 | 48 |
| Different | 3 | 9 | 12 |

This yields 91.7% recall on “same” pairs and 75% specificity on “different” pairs. These are reconstructed from the reported class totals and paired wins/losses, not separately published metrics. The class mix also makes a constant-same guess 48/60 (80%); Jev is five pairs, or 8.3 percentage points, above that reference. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:13-20] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1155-1204]

The p-value is an exact one-sided sign tail over 47 discordant pairs, not a test of 60 independent observations; it does not account for pair clustering by run or repeated findings. F=3 is three minority votes across C=180 calls, not three classification errors. The keep gates pass, but that does not expand the evaluated population. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1090-1128,1155-1188]

## 4. Raising Accuracy and Lowering Cost

**Answer.** Improve the candidate population first, then use a measured call policy. The scorer’s classes are lexical: a narrow same-body title-overlap band and cross-body candidates with title or text overlap of at least 0.5. It stably hash-sorts and caps each class at 60. These rules make the set reproducible, but the current set contains no near-line examples and cannot reveal same findings missed by the candidate filter. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:47-70,357-376,543-585] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:7]

For accuracy, add a measured high-recall candidate stage and label samples from both sides of its boundary: lexical matches, low-overlap cross-body pairs, near-line pairs, and hard negatives that share terms but need separate fixes. Stratify by research versus review, candidate class, and source run; hold whole runs out of tuning; publish each stratum’s confusion matrix and precision/recall. This estimates both judgment quality and candidate-generation misses. The current scorer pools loop results and does not publish those per-class metrics. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:357-376,1306-1320,1444-1470]

For lower runtime cost, skip exact-ID or normalized-content identity pairs already settled deterministically, then call Jev only for ambiguous cross-body candidates. Keep the current three-order scorer protocol for comparable measurement. A one-call first pass with a second call only for an uncertainty band is a plausible production policy, but must be evaluated on held-out runs before relying on this three-call result. At 60 eligible pairs, one call instead of three would reduce planned Jev calls from 180 to 60; actual call volume, error rate, and price remain unknown. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:345-402] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:80-94,1155-1186]

Bound candidate count, tokens, elapsed time, retries, and concurrency per run. The scorer constructs cross-lineage finding pairs before applying its lexical filter, so an unbounded set can grow with the cross-product of findings. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:427-461]

## 5. Making the Measurement More Trustworthy

**Answer.** Preserve the blinded, adjudicated label process and extend its coverage, auditability, and statistical unit. Two blind drafts agreed on 57/60 rows; an operator-delegated Opus 5.5 medium arbiter settled all rows under the concrete rule “same defect, same location, one fix closes both.” The parent packet accepts operator-confirmed labels or labels settled by an operator-named arbiter, so this set satisfies that procedure. It remains model-mediated gold, with three initial disagreements and a private row-level artifact. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:3,7-15] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/goal.md:49-52]

A follow-up should include enough examples in each class and loop, sample beyond the lexical candidate filter to measure its recall, reserve entire runs for a locked holdout, and have an operator audit a random subset plus every adjudicated disagreement. Publish class- and loop-specific precision, recall, false-merge and missed-merge counts beside paired wins. Recompute uncertainty by run or finding cluster, rather than treating all pair rows as independent. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md:127-140] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1090-1128,1306-1320]

Keep raw labels and finding text in restricted storage, but make authorized reproduction possible through a content hash, redacted sampling manifest, rubric version, scorer source hash, prompt version, client/provider/model version, per-call order/status, and retained output references. Today the label file, reports, and call logs live outside the repository, so the checked-in result cannot reproduce the row counts on its own. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:3] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:3,18]

## 6. Other .skilled Judgment Opportunities

**Answer.** Two offline evaluation candidates appear in `.skilled`; neither is proven to benefit from this merge rubric.

- **RRF retrieval fusion:** the implementation de-duplicates and fuses by canonical ID. Equivalent content with distinct IDs can therefore remain as separate ranked results. A separately labeled semantic-redundancy evaluation could test whether grouping those results improves retrieval without collapsing complementary evidence. [SOURCE: .skilled/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts:197-213,385-435]
- **Context compaction:** the merger can remove a later line after seeing the same file path in an earlier section. Semantic judgment could distinguish a redundant reference from new evidence about that file, but a false duplicate would discard useful context. Evaluate against task-specific gold labels and a deletion-safety review before proposing any live change. [SOURCE: .skilled/skills/system-spec-kit/shared/compact-merger.ts:128-155,198-203]

RRF and compaction have different error costs and labels. The Jev fan-out pair set is not evidence for either surface.

## 7. Default-On Integration: Requirements, Cost, and Risk

**Answer.** A safe default-on path requires a new bounded judgment stage, a named owner, explicit text-egress rules, and a deterministic no-loss fallback. The current result is a shadow score: it compares Jev with imported production merge functions, while the 030 contract says a keep applies only to its pair/model, names no reader, and does not promote behavior. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:23-26,488-536] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md:93-96,156-158]

The existing `SPECKIT_FANOUT_NEAR_DUP_DEDUP` flag is not this integration: it controls same-body title-aware matching, the current deterministic functions are synchronous, and the CLI writes the merged registry with attribution after reduction. Put any remote decision in a separately bounded asynchronous pre-resolution stage; preserve the current merge as fallback and retain both findings whenever judgment is unavailable or uncertain. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:345-402,504-553,724-754,835-870,1357-1400]

Use an explicit finding-text allowlist or consent rule; record pair IDs, judgment status, reason, and provider/model/prompt versions; pin the client; enforce budgets and timeouts; and make retries bounded. The measurement arm gates calls on provider authentication and published registry state at origin/main; a live default must define its own privacy and availability contract rather than silently broadening that policy. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:701-761,858-919,979-1025] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md:127-141]

**Measured protocol cost:** three Jev calls per eligible pair plus one auth check, or 181 planned calls for the 60-pair run. Calls are serial, each with a 90-second timeout; the scorer can retry a specific provider exit once. This does not establish observed latency or dollars. At 60 pairs, 180 serial model calls at their full timeout alone would total 4.5 hours, before auth and retries; that is a timeout-based upper-bound illustration, not a measured duration. Actual production spend is **UNKNOWN** because the checked-in result has no price. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:20] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:80-94,913-919,979-1025]

The largest risk is a false same judgment hiding a distinct defect or remediation. Deep-review raises that risk because it merges active findings while choosing the strongest restriction; a pooled research/review keep result does not establish review-specific safety or severity behavior. Require a separate review holdout and preserve severity and attribution, with uncertain decisions retaining both findings. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:835-914] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1306-1320,1444-1470]

## 8. Confirmed, Inferred, and Unknown

### Confirmed

- The 60 labeled records are cross-body; the labels are 48 same and 12 different, and the baseline is correct on the 12 different pairs. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:7-20]
- The Jev arm reports 53 correct against baseline 12, with W=44, L=3, F=3, and p=1.232e-10; the scorer defines the corresponding denominators and keep gates. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:18] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1120-1204]
- The current production rule and 030 contract remain deterministic/shadow scoped; no reader or promotion is named in the packet. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:345-402,504-553] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md:93-96,156-158]

### Derived

- The class-specific Jev counts (44/4 same, 3/9 different) follow from 48/12 labels, baseline’s 12 correct rows, and W/L=44/3. This arithmetic assumes the scorer’s paired correctness signs correspond to those labels as documented. It was not separately emitted as a confusion matrix. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:13-20] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1155-1204]
- A single call instead of three would reduce Jev requests by two thirds at a fixed eligible-pair count, before any escalation calls; the resulting quality has not been measured. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:80-94]

### Unknown

- Accuracy outside the scorer’s lexical candidates, near-line accuracy, and separate research/review error rates.
- Pair clustering effects on uncertainty estimates and whole-run holdout performance.
- Production eligible-pair volume, measured end-to-end latency distribution, provider dollar rate, and the privacy/retention policy for live finding text.
- Whether either RRF fusion or context compaction improves under a task-specific semantic judge.

## 9. Scope and Non-Goals

This is source and artifact research for the `luna` lineage. It did not change the production merge, enable a live call, alter the existing dedup flag, or establish a global default. The two adjacent `.skilled` modules are candidates for independent offline evaluation only. The measurement’s `keep` verdict remains specific to its scored candidates, label rubric, provider/client, and Jev model version. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md:93-96,127-141,156-158] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:3,18]

## 10. Recommendation

Keep this Jev result as evidence to design the next shadow experiment, not as authority to turn on semantic merging. First measure candidate-generation recall and rebuild a run-stratified, class-balanced holdout with operator-audited labels. Then compare the three-call scorer protocol with a separately evaluated cheap-first uncertainty cascade. Promote only after research and review have separate safety evidence, a named reader accepts the results, and production has budgets, privacy gates, per-pair logs, pinned versions, and a no-loss fallback. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md:127-141,156-158] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:47-70,80-94,1306-1320]

## 11. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat this keep result as validation of near-line dedup | No near-line examples were in the scored 60, and the measured class was cross-body. | [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:7] | 1 |
| Generalize 53/60 to every merge candidate or assign it a dollar price | The scorer evaluated a narrow candidate sample; actual spend and private row-level artifacts are absent from the checked-in result. | [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:357-376,543-585] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:3,18] | 2 |
| Flip `SPECKIT_FANOUT_NEAR_DUP_DEDUP` as the default-on Jev integration | That flag only governs same-body title-aware matching, while the measured Jev lift is cross-body; the shadow contract grants no promotion authority. | [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:345-402,504-553] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md:156-158] | 3 |

## 12. Open Questions

1. How many semantically identical findings fall below the current lexical candidate threshold, by loop and source run?
2. Does the derived confusion matrix reproduce from authorized row-level labels and call outputs, and what are class-specific confidence intervals when runs/findings are the statistical units?
3. Does a one-call plus uncertainty escalation policy maintain false-merge safety on locked research and review holdouts?
4. What are actual eligible-pair volume, measured latency, dollar cost, provider retention behavior, and acceptable finding-text egress rules in normal workflow runs?
5. Does a separate review evaluation show acceptable severity preservation and attribution for duplicate findings?
6. Do the RRF and compaction candidates yield net value under their own gold labels and deletion-safety tests?

## 13. Staged Evaluation Plan

1. **Coverage audit:** enumerate candidate and non-candidate pairs across held-out runs; label a stratified sample to quantify candidate recall and false-merge/missed-merge rates.
2. **Protocol comparison:** freeze the three-call scorer as the reference, then compare any one-call or uncertainty escalation policy on the same locked pairs. Pre-register the error metrics and promotion thresholds.
3. **Mode separation:** report research and review separately; include review severity and remediation outcomes, not only pair accuracy.
4. **Shadow deployment:** if offline gates pass, run an asynchronous bounded stage that logs judgments while the existing deterministic result remains authoritative. Keep uncertain or failed judgments as separate findings.
5. **Promotion review:** require a named reader, authorized text-egress policy, measured per-run cost/latency, pinned versions, and a documented rollback switch before changing default behavior.

## 14. Evidence Ledger

| Claim area | Primary evidence |
|---|---|
| Measured score and test arithmetic | `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:3,18`; `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1090-1204` |
| Gold labels, rubric, sampling and privacy | `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:3-20`; `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/goal.md:49-52` |
| Candidate classes and calls | `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:47-94,357-376,427-461,543-585,858-1025` |
| Existing production merge and runtime seam | `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:345-402,504-606,724-754,835-914,1357-1400`; `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md:21-43,56-77` |
| Existing shadow boundary | `specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md:93-96,127-141,156-158` |
| Adjacent surfaces | `.skilled/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts:197-213,385-435`; `.skilled/skills/system-spec-kit/shared/compact-merger.ts:128-155,198-203` |

## 15. Method and Evidence Limits

The three iterations read the score/merge path, label provenance and call protocol, and adjacent uses/integration seam. The observed result is supported by the result row, label decision summary, and scorer source. The reconstructed confusion matrix and call-reduction percentage are arithmetic inferences, labeled as such above. Generalization is limited because all scored rows are cross-body and no near-line row was measured; the p-value does not model clustering; raw labels and call logs are private; and actual dollar spend is missing. The resource map beside this report inventories the cited source and lineage artifacts.

## 16. References

- `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs`
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md`
- `.skilled/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts`
- `.skilled/skills/system-spec-kit/shared/compact-merger.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/goal.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md`

## 17. Convergence Report

Three iterations completed at the configured maximum of three. Convergence below the cap was telemetry only; the run continued through all three angles and then synthesized. The required terminal stop reason is `maxIterationsReached`. The work was written to the detached `luna` lineage artifacts; no production files or parent research packet were changed.
