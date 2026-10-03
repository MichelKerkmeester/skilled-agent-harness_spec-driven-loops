# Iteration 3: Integration and Adjacent Uses

## Focus

Find the production seam, identify adjacent .skilled uses for semantic duplicate judgment, and define default-on prerequisites, costs, and failure risks.

## Findings

1. The keep is a shadow measurement, not a live merge decision. The scorer imports the production merge functions to compute the incumbent, then calls Jev as a separate arm. The 030 contract says a keep applies only to its measured pair and model, has no named reader, and never promotes the merge. The result alone therefore grants no authority to change production behavior. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:23-26] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:488-536] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1444-1470] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md:93-96, 156-158]

2. Flipping the existing near-duplicate flag would not integrate Jev. That default-off flag only matches normalized body content plus title overlap at or above 0.15. Jev's measured advantage was on cross-body pairs, whose different bodies cannot satisfy that match. A semantic cross-body step needs a new candidate and resolution stage while retaining the current deterministic path. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:345-402, 504-553, 572-606] [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md:29-37]

3. The current merge functions are synchronous reductions and the CLI invokes them before atomically writing the merged registry and attribution. A hosted judgment should be resolved in an explicit asynchronous stage before that reduction, with per-run pair, token, time, and concurrency budgets. The candidate generator compares every finding pair across each pair of lineages before applying its lexical filter, so unbounded model calls can grow with the cross-product of findings. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:724-754, 835-870, 1357-1400] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:427-461]

4. If production kept the evaluator's three-order protocol, an integration would spend about three calls per eligible pair plus one auth test: 181 planned calls for 60 pairs. Calls are sequential, can each take up to 90 seconds, and exit 4 can retry once. A single-call runtime mode would be cheaper but would not inherit this verdict; it needs a fresh held-out measurement. Input tokens depend on finding text, and no dollar amount can be established from the checked-in result. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:86, 91-94, 913-919, 979-991] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:20] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md:96, 140]

5. Privacy, availability, and audit controls must be part of the integration. The measured Jev arm accepts a pinned client version, checks provider authentication, and sends a pair only when both registries exist at origin/main. A default-on path must keep a clear allowlist or consent rule for finding text, bound timeouts and retries, preserve per-pair status and model/provider version, and fall back to the deterministic merge without discarding findings when Jev is unavailable or uncertain. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:701-761, 858-919, 994-1025] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md:132-141]

6. Deep-review is the highest-value adjacent fan-out mode, but needs its own evaluation. The scorer constructs candidates from both research and review loops, then reports one pooled column. Review merges active findings into a strongest-restriction verdict, so a false same decision could hide distinct remediations or lower the visible finding count even when a remaining P0 still keeps FAIL. The 60-pair result does not prove a review-specific or severity-specific benefit. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:427-455, 1306-1320, 1444-1470] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1155-1204] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:835-914]

7. Two lower-confidence .skilled candidates merit offline evaluation, not immediate reuse of this rubric. RRF fusion combines vector and full-text results by canonical ID, so semantically repeated items with distinct IDs may survive as separate ranked entries. The compaction merger removes later lines that mention an already-seen file path; semantic comparison could distinguish a repeated reference from new evidence about that file. Both require their own task-specific gold labels and deletion-safety review. [SOURCE: .skilled/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts:197-213, 385-435] [SOURCE: .skilled/skills/system-spec-kit/shared/compact-merger.ts:128-155, 198-203]

## Sources Consulted

- .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:345-402, 504-553, 572-606, 724-754, 835-914, 1357-1400
- .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:23-26, 427-461, 488-536, 701-761, 858-920, 979-1025, 1155-1204, 1306-1320, 1444-1470
- .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md:21-43, 56-77
- .skilled/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts:197-213, 385-435
- .skilled/skills/system-spec-kit/shared/compact-merger.ts:119-155, 162-203
- specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md:93-96, 127-141, 156-159
- specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/030-decisions.md:7-20

## Assessment

- newInfoRatio: 0.76
- Novelty justification: This pass located the gap between a measured shadow arm and the deterministic production merge, quantified the candidate-pair cost shape, and found two unrelated .skilled surfaces that use identifier-based rather than semantic deduplication.
- Confidence: High for existing merge contracts, call shape, and review severity policy. Medium for the cost of a future deployment because actual pair counts, latency distribution, and provider rates are not reported here. The RRF and compaction surfaces are candidates for separate evaluation, not proven beneficiaries.

## Reflection

- What worked: Reading the scorer, production merger, feature catalog, and adjacent spec-kit modules together showed which behavior exists and which behavior remains only a proposal.
- What failed: No per-loop Jev accuracy, production pair volume, or price data is present in the repository result.
- Ruled out: Turning on the existing environment flag as a substitute for semantic cross-body judging, or treating the 030 keep as permission to promote a live model decision.

## Recommended Next Focus

None. Three distinct angles are complete; synthesize the evidence, recommendations, and unresolved proof gaps.
