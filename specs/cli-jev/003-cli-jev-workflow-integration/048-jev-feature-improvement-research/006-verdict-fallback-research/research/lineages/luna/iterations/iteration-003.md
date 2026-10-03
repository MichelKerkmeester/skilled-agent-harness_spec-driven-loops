# Iteration 3: Measurement Trust, Neighboring Judgments, and Rollout

## Focus
Determine what evidence would make the 24-row result representative, identify neighboring bounded judgments in .skilled, and define the prerequisites, cost model, and risks for a default-on Jev fallback.

## Actions Taken
Compared the benchmark result table with the reviewer scorer and feature contract; inspected the measurement contracts for the hallucination grader, completion-claim audit, fan-out merge, stop-rater, and debug next-check; reviewed the lineage strategy and current state before this pass.

## Findings

1. **The 24-row result is conditional on a deliberately selected miss set, and its labels answer a narrower question than reviewer correctness.** All 24 fixture reports were chosen because the regex missed them; the blind arbiter matched the author's intended verdict on all 24. The feature contract says the label is what the reviewer decided and warns against treating expectedVerdict as truth because a reviewer can be wrong. This supports accurate extraction of intended wording on this corpus, not a 100% production accuracy or miss-rate claim. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/spec.md:71,96-97]

2. **The independent measurement unit is the reviewer report, not each Jev call.** The scorer asks each report in three rotated option orders, and the reported K remains 24. Those repeated calls test position stability; they do not turn the corpus into 72 independent reviewer examples. Keep paired report-level accuracy and the flip count separate, and report uncertainty over reports or reviewer lineages. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:775-815] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:317-356] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14]

3. **A trustworthy follow-up needs a natural-use census plus a separately labeled miss sample.** Count hits and misses across ordinary consecutive or randomly sampled reviewer reports, across reviewer/model versions, before enriching the corpus with stress cases. The feature already supports zero-call counts from outputs and report verdict-method counts. Estimate miss prevalence from the full census, then estimate fallback quality on a held-out sample of natural misses; keep the constructed 24-row corpus as a stress set. Blind two human readers to Jev's answer and adjudicate disagreements, labeling explicit PASS/FAIL/BLOCK separately from no decision or ambiguous wording. Report prevalence and conditional accuracy separately, since whole-run uplift depends on both. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md:28-40] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/spec.md:83-97] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:190-204]

4. **The strongest neighboring opportunities are bounded judgments with direct comparative evidence, not a universal fallback.** The hallucination grader kept on 56 labeled answers, beating its majority and deterministic baselines; the fan-out merge shadow kept on 60 real recorded pairs. By contrast, completion-claim audit stopped on margin, stop second-rater was killed on 25 real lineages, and debug next-check stopped on margin. Reuse the census, operator-label, paired-baseline, and explicit-gate pattern for other semantic gaps, but require each task's own representative labels and keep rule. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:13,15-19] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/feature-catalog/scoring-system/hallucination-grader-agreement.md:18-40] [SOURCE: .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md:812-815]

5. **Default-on wiring requires a separate integration decision and a privacy/failure contract.** The current reviewer scorer invokes only its opt-in llm grader after a deterministic miss; feature 025 explicitly excludes a Jev grader setting, classifier output in the reviewer report, a global switch, and shared client. A later phase should first establish natural miss prevalence and held-out quality, then specify the provider/version and credential policy, data-owner approval for sending reviewer text off-machine, one-call behavior, and transparent unknown/abstain behavior for timeout, invalid choice, or no explicit verdict. Keep the deterministic result when it parses; do not silently turn backend failure into BLOCK or an alternate grader result. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:155-187] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/spec.md:91-97] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md:38-40]

6. **The call cost can be bounded, but neither dollar cost nor production volume is established.** At 24 selected misses the three-order benchmark plans 73 calls including auth; one production judgment per miss would plan 25, about 66% fewer. The table reports 334 ms p50 and 377 ms p95 per measured call, but no billing or natural miss rate. Budget calls as natural reports multiplied by observed miss prevalence, then include provider pricing, token usage, retries, and latency from a real gated run before estimating dollars. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:700-708,775-794,1071-1077] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14]

## Sources Consulted
- specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:13-19
- specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/spec.md:68-97
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:117-123,155-204
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:212-219,317-356,700-708,775-815,840-849,1071-1077
- .skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md:28-40
- .skilled/skills/system-deep-loop/deep-improvement/feature-catalog/scoring-system/hallucination-grader-agreement.md:18-40
- .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/completion-claim-audit.md:20-36
- .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/debug-next-check.md:18-40
- .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md:812-815
- .skilled/skills/system-deep-loop/runtime/README.md:49-52
- Luna steer.md checked before this iteration; absent.
- Luna config, state log, strategy, and earlier iteration files read before this iteration.
- User prompt premise: ordinary reviewers rarely miss the verdict regex.

## Assessment
- newInfoRatio: 0.62
- Novelty: This pass adds the measurement-unit distinction, a naturalistic sampling and labeling plan, a cross-feature comparison with both positive and negative outcomes, and rollout gates. It refines the earlier prevalence and cost findings.
- Confidence: High for source behavior and the reported benchmark rows; moderate for label validity beyond matching author intent; unknown for natural miss prevalence, actual reviewer-text privacy acceptance, and billed cost.
- Convergence telemetry: 0.62 exceeds 0.05. Continue to synthesis because max-iterations controls stopping.

## Reflection
- Worked: Comparing result rows across adjacent evaluators prevents a single positive benchmark from being generalized across .skilled.
- Limitation: The 24 source report bodies, raw human annotations, and call-level billing details are outside the available repository evidence; no live-output prevalence estimate can be computed here.
- Ruled out: Treating the 72 rotated calls as 72 independent reviewer reports, or treating author-intent agreement as proof the reviewer verdict itself was correct.
- Ruled out: Default-on Jev integration based only on the constructed miss corpus.

## Recommended Next Focus
Synthesize the three completed passes into the five requested answers, preserve the production-prevalence caveat, and record maxIterationsReached.
