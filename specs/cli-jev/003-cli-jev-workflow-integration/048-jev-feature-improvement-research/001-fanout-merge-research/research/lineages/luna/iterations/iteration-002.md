# Iteration 2: Label Trust and Cost

## Focus

Audit who produced the gold labels, what population the 60-row sheet represents, and the recurring call and latency cost.

## Findings

1. The label provenance is explicit: Luna and SWE labeled independently under neutral IDs and agreed on 57 of 60; an Opus 5.5 medium arbiter, delegated by the operator, settled every pair. The arbiter's rubric is concrete: same defect at the same location where one fix closes both. This follows the parent rule that only operator-confirmed labels or labels settled by an operator-named arbiter count. It is model-mediated gold rather than an independent row-by-row operator read. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:7-15] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/goal.md:49-52]

2. The measured set is conditional on the scorer's candidate filter. It draws same-body rows only in a narrow title-overlap band and cross-body rows only when title or finding-text overlap reaches 0.5. The label sheet takes at most 60 per class in stable hash order. With 60 cross-body examples and no near-line examples, the result does not estimate how many true same findings the candidate filter misses, nor performance across the full merge population. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:47-70] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:357-376] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:543-585] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:7]

3. The artifact trail is deliberately private but not self-contained in the repository: the label file is outside the tree with mode 600, and the 047 results note that reports and call logs are also outside the tree. The public result identifies a real corpus, delegated arbiter, client version, and model, but a reviewer still needs authorized access to the row labels and per-call output to reproduce the counts. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:3] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:3,18]

4. The measurement costs 3 calls per callable labeled pair plus one auth test. At 60 pairs this is 181 planned Jev calls. The three calls run in AB, BA, AB order without answer reuse; each has a 90-second timeout and one two-second backoff retry for exit 4. The scorer estimates input tokens and logs call wall time, but the result row provides no dollar spend. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:80-94] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:913-919] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:979-1025] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:20]

5. To make a follow-up score more trustworthy, stratify rows by research versus review, candidate class, and source run; require enough rows in each class; reserve entire runs for a holdout; and report class-specific precision, recall, and the confusion matrix alongside paired wins. Keep the 3-order scorer protocol for comparability, but add an operator audit of a random subset and every adjudicated disagreement. Store hashes and version metadata for the private label sheet, report, call log, scorer commit, provider, and model. The current gate requires 40 labels and 10 cross-body labels, so it can pass without measuring near-line behavior. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md:127-140] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:7-15]

6. A lower-cost production path should avoid asking Jev about pairs already resolved by exact ID or normalized-content identity, use a high-recall candidate shortlist, then send only ambiguous cross-body pairs. A one-call default with a second call only for borderline probabilities is a separate protocol and needs its own held-out evaluation; reducing the scorer's three calls would change the current stability statistic and weaken comparison with this result. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:345-402] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:84-86, 1155-1186]

## Sources Consulted

- .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:47-70, 80-94, 357-376, 543-585, 858-920, 979-1025, 1155-1204
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:345-402, 504-553, 572-606
- specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md:85-96, 127-146, 156-159
- specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/goal.md:49-52
- specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:3-20
- specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:3, 18

## Assessment

- newInfoRatio: 0.82
- Novelty justification: This pass traced label authority, the lexical candidate boundary, private artifact provenance, and the 181-call cost to source records and code.
- Confidence: High for the logged label process, class rules, and planned call count. Medium for generalization and audit completeness because the private row-level artifacts are outside the repository and no near-line rows were scored.

## Reflection

- What worked: The 042 decision log and 030 scorer contract separate label authority from candidate selection and model scoring.
- What failed: The repository result row alone cannot reproduce per-class error rates, actual spend, or observed latency.
- Ruled out: Treating 53/60 as accuracy over all merge comparisons or claiming a measured dollar cost.

## Recommended Next Focus

Identify the safest adjacent .skilled surfaces and the runtime changes, failure handling, and scaling costs a default-on path would require.
