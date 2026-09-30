# Iteration 5: grok-05 — Finding triage, what jev-review and claude-jev actually do

## Focus

Whether the jev-review funnel and the claude-jev review catalogue carry over to deep-review and fan-out merge, and where they fail. Focus Area is `grok-05`. Iteration 1 already killed a live drop at `real` 0.5. This iteration asks whether a staged funnel with a higher bar and an escape option is a different idea.

Sibling check: DeepSeek's newest file is still `iteration-002.md`. MiMo still has no iteration file. Nothing new there about triage.

## Actions Taken

Opened jev-review's orchestrator, its threshold constants, its hunk `choice`, deep-review's completion rules, and fan-out merge's near-duplicate test. No live `jev` call.

## Findings

jev-review screens every file, keeps signals at or above `SCREEN_THRESHOLD` (0.7), profiles at most `MAX_PROFILES` (5), and follows at most `MAX_FOLLOW_UPS` (8). One thrown screen aborts the whole run. The catch wraps the error and rethrows. It does not skip the file. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-review-main/src/domain/config.ts:4-17] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-review-main/src/review/workflow.ts:48-55] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-review-main/src/review/workflow.ts:64-80]

The locate step asks a `choice` with an explicit `noMatch` option. `noMatch`, or confidence under `MIN_LOCATION_CONFIDENCE` (0.55), returns null and the signal dies. That is an escape hatch, which iteration 2's guidelines said every closed set needs. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-review-main/src/review/judgments.ts:180-196]

Deep-review already separates a number from a verdict. `riskScore` may appear as non-gating context. Verdict logic must ignore it. PASS, CONDITIONAL, and FAIL are functions of P0, P1, and P2 counts after an adversarial self-check. Every P0 must survive that check or be downgraded. [SOURCE: .skilled/skills/system-deep-loop/deep-review/references/protocol/completion-criteria.md:61-63] [SOURCE: .skilled/skills/system-deep-loop/deep-review/references/protocol/completion-criteria.md:75]

Fan-out merge collapses two findings only when the body-content key matches and title Jaccard overlap is at least 0.15. When both sides are reviews, the higher severity rank wins the canonical record. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:341] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:348-351] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:413-418]

claude-jev's four-question catalogue from iteration 1 is a different funnel. It drops below 0.5. jev-review follows up at 0.7 and still caps the queue. The cap is the part worth keeping. The drop-before-read is the part iteration 1 already rejected.

### Idea: shadow `choice` of P0, P1, P2, or not_a_finding on an existing finding

| Field | Content |
|---|---|
| **Idea** | A Python `jev-cli` `choice` replays each P0. The keys are `P0`, `P1`, `P2`, and `not_a_finding`. The result is stored beside the finding. Verdict counts ignore it, the way they ignore `riskScore`. |
| **Value** | A later gold comparison can ask whether the choice agrees with the adjudicated severity often enough to skip a human reread. |
| **Seam** | `.skilled/skills/system-deep-loop/deep-review/references/protocol/completion-criteria.md:62` is the line that already forbids a number from gating. The call would be recorded in the iteration delta, not read by the PASS line at `:75`. |
| **Metric, baseline, harness** | Agreement with the final adjudicated severity. Baseline UNKNOWN. The measurement digest names this as the finding-triage gap (H9 fixtures grade verdicts, not per-finding severity). |
| **Cost, latency, privacy** | One `choice` per P0, offline after the review iteration. The finding text and the cited snippet leave the machine. |
| **Opt-in and no key** | A review-config flag defaulting off. No key: the field is absent. The adversarial self-check still runs. Exit 3 does not downgrade a P0 and does not confirm one. |
| **Complexity** | About 40 lines in the review iteration writer. The completion gates stay untouched. |
| **Verdict** | later. The escape key `not_a_finding` matches `noMatch`. The protocol already says the number is not the verdict. There is no gold set, so the call would only add a column. |
| **Confidence** | Confirmed that verdict logic must ignore `riskScore`. Agreement is inferred. |
| **Kill criterion** | If a labeled replay agrees with adjudicated severity no more often than the reviewer's own P0 self-check, drop it. Also drop it the moment the choice is read by the PASS, CONDITIONAL, or FAIL rule. |

### Idea: copy jev-review's whole-run abort

| Field | Content |
|---|---|
| **Idea** | One failed Python `jev-cli` call aborts merge or review, as `runReview` rethrows on the first screen error. |
| **Value** | No partial report that hides a failed file. |
| **Seam** | The outside behavior is `workflow.ts:52-55`. The local merge that must keep going is `fanout-merge.cjs:348`. |
| **Metric, baseline, harness** | None. An abort is a availability failure, not a quality gain. |
| **Cost, latency, privacy** | A single exit 4 or exit 3 ends the run. |
| **Opt-in and no key** | Unacceptable. No key would abort every review. |
| **Complexity** | A few lines, and a broken loop. |
| **Verdict** | drop. |
| **Confidence** | Confirmed from `workflow.ts`. |

### Idea: `noul` "same point" instead of Jaccard 0.15

| Field | Content |
|---|---|
| **Idea** | Replace `nearDuplicateMatches` with a Python `jev-cli` `noul`. |
| **Value** | Catch paraphrases whose bodies differ, which the key match never sees. |
| **Seam** | `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:348` |
| **Metric, baseline, harness** | Duplicate-collapse precision against a hand-labeled pair set. That set was not opened. Baseline is the current rule, which is deterministic. |
| **Cost, latency, privacy** | One call per candidate pair. Finding text leaves the machine during merge. |
| **Opt-in and no key** | No key must keep the Jaccard rule. A missing `noul` must not collapse and must not refuse to collapse by becoming 0. |
| **Complexity** | Replaces a pure function with a network call on the merge path. |
| **Verdict** | drop. Body equality plus token overlap is a repository fact. The skill contract says a judgment must not stand in for one. |
| **Confidence** | Confirmed from the merge function and from `cli-usage` (opened in iteration 6's source set; the line is `.skilled/skills/cli-jev/cli-usage/SKILL.md:219`, read while preparing this wave). |

## Sources Consulted

- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-review-main/src/review/workflow.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-review-main/src/review/judgments.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-review-main/src/domain/config.ts`
- `.skilled/skills/system-deep-loop/deep-review/references/protocol/completion-criteria.md`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs`
- claude-jev `review.ts`, opened in iteration 1
- DeepSeek `iteration-002.md` rechecked; MiMo iterations directory still empty

## Assessment

newInfoRatio: 0.58

Novelty justification: The 0.7 screen cap, the `noMatch` null, the whole-run rethrow, and the explicit ban on gating with `riskScore` are new. The near-threshold warning and the "do not replace a fact" posture were already in play.

Convergence telemetry: the series is 1.0, 0.72, 0.7, 0.64, 0.58. Mode is off.

## Reflection

What worked: the cap and the escape option are the parts of the funnel that survive. The abort does not.

What failed: hoping Jaccard was a soft judgment. It is a pure function with a named constant.

Ruled out: abort-on-one-failure, and a `noul` that replaces `nearDuplicateMatches`.

## Recommended Next Focus

`grok-06`: which wave-2 seams are repository facts Jev must not replace, and whether a `screen` gate on fetched content survives.

## Hand-off

- Funnel stages that fit, as a log only: a capped follow-up list and a `noMatch` escape. They do not change PASS, CONDITIONAL, or FAIL.
- Shapes that must not be copied: whole-run abort on one failed call (`workflow.ts:52-55`), and a severity number that gates the verdict (`completion-criteria.md:62`).
- Kill criterion for a shadow severity `choice`: it agrees no better than the existing P0 self-check, or any verdict rule reads it.
- Near-duplicate collapse stays code.
