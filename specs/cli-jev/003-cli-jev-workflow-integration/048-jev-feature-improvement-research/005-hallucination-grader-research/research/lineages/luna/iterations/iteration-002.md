# Iteration 2 — Accuracy, cost, and measurement trust

## Focus
Trace how fixture context reaches D4, quantify the measured protocol's call cost, and identify controls that would make the reported agreement more generalizable.

## Actions Taken
- Read the agreement scorer's input construction, call plan, retries, report, and vote aggregation.
- Followed the 5-dimension benchmark caller into its virtual fixture and grader factory.
- Read Feature 024's frozen label gates, keep rule, and current allowlist/payload risks.
- Checked for steer.md immediately before this iteration; it was absent.

## Findings

1. **The agreement arm and the 5-dimension integration do not currently give D4 the same context.** The agreement scorer constructs Jev input from the fixture's task, visible specification, allowlist when present, and output ([input builder](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:188)). The D4 prompt expects the task and allowlist to judge named flags, symbols, and paths ([grader contract](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader.md:3)). But `run-benchmark.cjs` sends the 5-dim scorer only acceptance criteria, headings, and patterns ([caller](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:453)); the virtual fixture then defaults allowlist to `{}` and does not carry task or visibleSpec ([virtual fixture](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:269)). This is an actionable accuracy and integration gap: forward task/spec/allowlist through the caller before making LLM D4 routine. The exact accuracy effect is unmeasured.

2. **The measured Jev protocol costs 169 planned calls at K=56.** It uses three hosted `noul` calls per labeled row plus one auth test, so this run planned 168 grader calls and one auth call; estimated input tokens are printed, but no dollar estimate is ([cost plan](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:679)). Exit-4 calls can be retried once, which increases realized calls ([retry path](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:777)). Per-call records retain output name, latency, exit code, numeric answer, status, Jev version, provider, and model, not a rationale or supporting claim ([call record](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:761)). A confidence/threshold-based repeat policy could reduce calls on a future run, but it would change the measurement protocol: keep the three-call result as the reference, then compare any one-call or adaptive policy on a separately labeled holdout and report measured calls and latency, not assumed savings.

3. **Fixture coverage and the comparator constrain the result.** Feature 024 records zero allowlists across 21 fixtures and says the empty allowlist limits the deterministic check ([fixture risk](specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/spec.md:133)). On the supplied 56 labels, majority is correct on 47 while the deterministic check is correct on 22; the scorer selects the better of those two baselines ([baseline selection](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:240)). This makes the reported comparison conservative against the stronger observed baseline, but does not establish real-world prevalence or performance on less obvious unsupported claims. Improve accuracy evidence with fixture-owned, source-verified allowlists and separate slices for invented flags, symbols, and paths.

4. **The protocol has useful guardrails, but its p-value is narrow evidence.** The label file is hashed; the run requires at least 30 labeled matched outputs and at least five in each class; Jev needs three finite scores per row and uses their modal class ([label and verdict gates](specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/spec.md:134), [vote logic](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:316)). The keep rule is fixed and includes coverage, a margin, an exact paired sign test, and a rerun-flip limit ([gates](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:296)). Here the sign test has eight discordant pairs, all Jev wins; p=0.003906 therefore supports this paired fixture result, not a production accuracy interval. A stronger next measurement should use blind independent labels with adjudication, a predeclared baseline, an untouched holdout from multiple task/model sources, and a confusion table by claim type. Keep the current label hash and three-call stability measure so the new evidence remains auditable.

5. **Do not treat an adaptive one-call policy as validated by this result.** The current `F=1` and `M=56` demonstrate repeat stability on this fixed corpus and three-call configuration; neither estimates single-call error. A cheaper policy is a candidate to measure, not an evidence-backed replacement.

## Questions Answered
- **How could accuracy improve or cost fall?** First repair the context seam so the 5-dim D4 receives the task, visible spec, and source-backed allowlist. Then evaluate verified allowlists and claim-type slices. Keep three-call aggregation for comparable confirmatory runs; test any one-call/adaptive policy on held-out labels and include actual calls, latency, and token usage. Exact accuracy gains and dollar cost are not available from the current artifacts.
- **How can the measurement be more trustworthy?** Preserve the fixed gates and label digest, then add blind independent annotation/adjudication, a frozen comparator, an untouched multi-source holdout, and class/claim-type confusion reporting. Interpret p_win against the eight discordant pairs only.

## Questions Remaining
- Which other .skilled workflows make source-grounded judgments worth checking?
- What does default-on integration require, cost, and risk?

## Next Focus
Map concrete evidence-bearing workflows that could reuse this judgment, then trace the current grader's opt-in boundaries, score impact, provenance, data flow, and failure semantics before recommending a default.

## Sources
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:30-49,188-195,240-257,276-304,316-358,679-712,761-840
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:435-485,569-660,733-740
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:53-60,198-230,269-326
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader.md:3-45
- specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/spec.md:133-168,202-204
- specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/005-hallucination-grader-research/spec.md:59-78
- steer.md checked immediately before iteration 2; absent.
