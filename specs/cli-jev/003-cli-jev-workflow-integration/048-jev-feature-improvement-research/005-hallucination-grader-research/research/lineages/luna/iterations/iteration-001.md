# Iteration 1 — Result attribution

## Focus
Explain the measured Jev advantage from the scorer’s decision mechanics and fixture composition, while separating measured facts from what the aggregate report cannot establish.

## Actions Taken
- Read the D4 scorer’s rubric, prompt construction, repeated-call summary, baseline selection, verdict gates, and payload accounting.
- Read the deterministic D4 checker and the phase 005 measurement statement; checked the existing fixture JSON corpus without modifying it.
- Checked for steer.md immediately before this iteration; it was absent.

## Findings

1. **The measured win is eight paired cases, not an eight-case raw accuracy delta over every row.** The Jev column has A=55 correct and the selected baseline B=47 correct, so Jev adds eight net correct rows (98.2% versus 83.9%). W=8 and L=0 show all eight discordant pairs favor Jev. The one-sided paired sign tail is 1/256 = 0.003906; the verdict’s gates also require coverage, a margin of at least 10% of measured rows, the sign test, and a rerun-flip ceiling ([scorer](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:276), [verdict gates](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:296)). The sample is small: the p-value is over the eight discordant pairs, not a production-population accuracy interval.

2. **Three-call majority voting limits single-call noise, and F=1 is one dissenting vote.** A row is measured only with three finite answers; the scorer takes the majority class and counts votes that dissent from that class ([summarizer](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:315)). Here F=1 is not an F1 metric. The grading prompt supplies each answer with its task, visible specification, and allowlist when present ([prompt state](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:188)). That is a plausible mechanism for identifying unsupported names, but the aggregate result alone cannot attribute individual wins to a particular prompt feature.

3. **The corpus makes the task intentionally high-signal and negative-heavy.** The phase report says 42 honest DeepSeek answers contained zero invented names, while nine hallucinations were found among 14 deliberately careless answers ([measurement statement](specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/005-hallucination-grader-research/spec.md:59)). This composition explains why the 47/56 majority baseline is already strong and why the reported gain is promising on curated fixtures, but it cannot estimate real-use prevalence or performance on subtle hallucinations.

4. **The deterministic comparator appears under-equipped for the current fixture assets.** The checker extracts CLI flags and function-call symbols, then compares them with an allowlist; it does not claim to verify file names ([checker rubric](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/hallucination-flag.cjs:9)). The current 21 fixture JSON files contain no allowlist property (read-only corpus census); feature 024 also records the absence of that key when its fixtures were built ([feature 024](specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/spec.md:70)). The scorer selects deterministic only when it beats majority, otherwise majority, so B=47 is the stronger baseline here ([baseline selection](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:240)). This points to a weak comparator configuration, not proof that deterministic grading is inherently poor.

5. **The current aggregate does not reveal the error classes behind the 55 correct rows.** The reported summary has no per-row confusion matrix or raw output/label pairs in the sources read. Do not infer Jev’s false-positive rate, false-negative rate, or which claim types drove W=8 from A/B/W/L totals alone.

## Questions Answered
- **What drove this result?** The observed advantage is eight paired wins with no losses, under a three-answer majority-vote Jev protocol, on a curated fixture set dominated by honest negatives. Majority is already strong on that distribution. The deterministic baseline’s current allowlist inputs are structurally sparse, so the selected comparator is majority. The causal contribution of specific answer categories remains unknown without row-level evidence.

## Questions Remaining
- How to improve Jev accuracy or reduce the three-call cost without losing useful stability.
- How to make the benchmark estimate more trustworthy and expose errors by class.
- Which other .skilled workflows have similar source-grounded judgment needs.
- What an enabled-by-default integration must change and what it would cost or risk.

## Next Focus
Inspect the benchmark runner, report artifacts, and fixture/label handling to identify concrete accuracy-cost options and measurement controls. Then map the existing grader hook and its opt-in defaults before proposing any default-on design.

## Sources
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:188-195,240-257,276-304,315-358,679-712
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/hallucination-flag.cjs:9-27
- .skilled/skills/system-deep-loop/deep-improvement/feature-catalog/scoring-system/hallucination-grader-agreement.md:28-40
- specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/spec.md:70-72
- specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/005-hallucination-grader-research/spec.md:59-78
- steer.md checked immediately before iteration 1; absent.
