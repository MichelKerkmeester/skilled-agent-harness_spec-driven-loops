# Iteration 2: Improve Accuracy and Reduce Calls

## Focus
Find accuracy improvements and lower per-miss cost without changing the meaning from reading the reviewer's stated verdict to re-reviewing the change.

## Actions Taken
Read the reviewer-output contract, the scorer's exact regex and optional grader branch, Jev's question/options, the three-order call loop, and the label/report handling. Compared measurement overhead with the existing p50/p95 evidence.

## Findings

1. **Fix the source format before adding more judgment.** The reviewer schema already says output should include a parseable line such as VERDICT: FAIL, and the existing pattern accepts that form case-insensitively. Have the reviewer producer emit a typed verdict field or enforce this line as a format requirement. This reduces misses at near-zero marginal inference cost and keeps the deterministic parser as the first choice. Do not broaden the regex to any occurrence of pass/fail/block in prose: that could turn a mention or example into a verdict. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md:80-88] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:117-123]

2. **Preserve the fallback's narrow question.** The current question asks which verdict the reviewer output gives, with options for approval, rejection, and inability to give a verdict. Keep Jev classifying the reviewer's stated language; it should not inspect or reassess the change. Some regex misses may contain no explicit decision, which is not the same as an explicit BLOCK. Add an abstain/unclear path that leaves the scorer at unknown unless the text states one of the three verdicts, then label that class in measurement. The existing option descriptions should remain mutually exclusive and cover the states Jev can return. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:34-42] [SOURCE: .skilled/skills/cli-classifier/cli-jev/references/integration-patterns.md:61-72]

3. **Reduce calls in production, retain permutations as a measurement tool.** The benchmark asks each output in three rotated option orders and includes one authentication test. That means 72 judgments plus one auth call for K=24. One judgment per production miss would plan 24 plus one auth check (25 total), a reduction of 48/73 or about 66%. Keep the three orders for offline robustness checks, or repeat a sampled subset after a version/prompt change. This sacrifices an individual-output order-flip signal in production, so the reduced policy needs its own labeled holdout before promotion. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:700-708] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:775-794] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:1071-1077]

4. **Treat probabilities as an unvalidated signal.** The scorer records Jev's probability for its selected key, but the code does not use that value to gate, abstain, or retry. Do not add a confidence cutoff until calibration is measured against labels. A safer early retry policy is a fixed, pre-registered small audit sample, with disagreements measured separately from the main one-call result. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:809-815]

5. **Cache only exact, versioned repeats if duplicate misses occur.** Reviewer reports currently retain a truncated 16-character output hash rather than the output body. An integration cache could key a full content digest together with question/options digest, Jev version, provider, and model, and store only the accepted choice plus provenance. The current 16-hex output hash is not a full-content cache key. Since real misses are rare, measure duplicate frequency before building a cache. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:190-204] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:845-849]

The measured run reports p50 334 ms and p95 377 ms per recorded Jev call. One-call production behavior therefore avoids two of the three judgment requests on each miss, but no dollar cost can be inferred without provider billing and output-token records. Reviewer outputs are sent off-machine in the Jev arm, so this path needs an explicit data-handling policy even when the miss rate is low. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md:38-40]

## Questions Answered
- Q2: Prefer a structured verdict from the producer, exact parse and abstention on no stated decision; reserve repeated option orders for measurement/audits; use one validated choice per production miss.
- Still open: representative miss prevalence, adjacent tasks, and default-on release gates.

## Sources Consulted
- .skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md:80-88
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:117-123, 155-187, 190-204
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:34-55, 505-547, 700-708, 775-815, 840-849, 1068-1084
- .skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md:18-40
- .skilled/skills/cli-classifier/cli-jev/references/integration-patterns.md:48-72
- .skilled/skills/cli-classifier/cli-jev/feature-catalog/judgment-primitives/judgment-primitives.md:38-54
- specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14
- specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/spec.md:82-97
- Luna steer.md checked before iteration 2; absent.
- Prior state: the preserved config row, config file, strategy, and iteration 1 artifacts were read. The canonical state log is awaiting regeneration after the documented projection migration.

## Assessment
- newInfoRatio: 0.58
- Novelty: This pass distinguished an upstream format guarantee from a model fallback, identified a no-verdict abstention case, and quantified a one-call serving policy against the benchmark's three-order audit policy.
- Confidence: High on source behavior and arithmetic; moderate on operational savings because actual production miss prevalence, duplicate frequency, output tokens, and provider billing are unknown.
- Convergence telemetry: 0.58 is above 0.05. Continue through iteration 3 because max-iterations is authoritative.

## Reflection
- Worked: Tracing both the producer contract and the call loop found a cheaper first fix than broadening a free-text regex.
- Limitation: The supplied run summary lacks the 24 row texts and call log, so neither individual ambiguity nor probability calibration can be recomputed here.
- Ruled out for default serving: Three sequential judgments for every miss. Retain them only where their stability evidence is needed.

## Recommended Next Focus
Measure how representative the miss set is, map comparable judgment points in .skilled, and define the privacy, fail-closed, cost, and evidence gates a default-on integration would need.
