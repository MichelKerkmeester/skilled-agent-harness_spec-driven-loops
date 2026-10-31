# Iteration 3 — Reuse and default-on design

## Focus
Identify existing .skilled workflows that benefit from checking claims against source evidence, then define the prerequisites, measured costs, and failure risks for enabling D4 in ordinary 5-dimension runs.

## Actions Taken
- Read the citation-drift scan contract, deep-review claim-adjudication requirements, and deep-research evidence graph schema.
- Traced current benchmark defaults, the LLM grader input/report path, cache identity, confidence escalation module, and D4 weight/error handling.
- Checked for steer.md immediately before this iteration; it was absent.

## Findings

1. **The closest reuse is already present in sk-doc's citation-drift scan.** It checks whether a cited code window still supports the sentence, compares Jev with two fixed baselines, and uses a labeled sample; its default makes no model calls and writes no file ([scan contract](.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md:18)). This is the most direct adjacent fit. Reuse the source-grounded evaluation pattern there, with a citation-support rubric distinct from D4's unsupported-symbol rubric ([scan question and gates](.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md:26)).

2. **Deep-review findings are a second high-value target.** Every new P0/P1 already requires a claim, evidence references, searched counterevidence, an alternative explanation, severity, confidence, and a downgrade trigger ([claim adjudication](.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl:73)). A source checker could verify that referenced files, lines, symbols, and quoted evidence exist and support the finding before it reaches a release gate. Keep human severity and reasoning review separate; D4's current rubric does not decide whether a code finding is important.

3. **Deep-research synthesis has a natural evidence graph to audit.** Its records distinguish claims from sources and encode SUPPORTS, CONTRADICTS, DERIVED_FROM, and CITES relations ([graph schema](.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:50)); the delta stream carries findings, observations, and ruled-out directions ([delta contract](.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:79)). A claim checker could verify that cited source spans exist and actually support each synthesis claim, especially when a research result is handed to an implementation workflow.

4. **A one-flag default change is not enough.** `run-benchmark.cjs` defaults to the pattern scorer and `grader=noop`; LLM D4 runs only when the 5-dimension path and `--grader llm` are selected ([opt-in defaults](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:569)). The D4 contribution is 15% of the weighted score ([rubric](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:53)). The current caller also drops task, visible specification, and allowlist context before building the virtual fixture ([caller](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:453)); fix that seam before interpreting any default-on score.

5. **Default-on should require explicit data, cost, independence, and failure controls.** The real grader prompt contains fixture metadata and the full candidate output ([prompt assembly](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:202)); this is hosted grading of benchmark output, so default-on needs a payload policy comparable to the existing `--accept-payload` gate on the Jev measurement ([payload rule](specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/spec.md:138)). Keep the runner's different-family check when generator models are declared ([independence gate](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:621)), and expose model/rubric/prompt provenance. For N fixtures and S samples, the primary-grader ceiling is N×S cache misses; the 56-row Jev agreement exercise planned 169 calls (168 judgments plus auth), but is a separate calibration protocol, not the default runner's measured price ([sample loop](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:279), [Jev plan](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:707)). Neither path provides dollar cost here.

6. **Surface uncertainty and retain evidence in the report.** The grader catches errors as D4 score 0.0 ([failure handling](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:218)); with a 0.15 D4 weight, an infrastructure or parse failure can cost up to 15 aggregate points. The grader returns confidence, rationale, evidence, and parse status, but `scoreFixture5dim` returns only numeric dimensions and failure modes ([grader result](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:313), [benchmark row](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:475)). Change failures to an explicit unavailable/inconclusive state and preserve evidence, confidence, and parse status per row before enabling it broadly.

7. **Low-confidence recovery exists as a separate module, but the 5dim adapter calls the primary harness directly.** The LLM grader wrapper directly calls `harness.gradeD4` ([adapter](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:218)), while `dispute.cjs` separately supports a skeptic second call on confidence below 0.7 and returns a dispute result ([escalation](.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/dispute.cjs:110)). Before default-on, either wire this recovery path with a bounded extra-call budget or make low confidence an explicit abstention; do not imply the prompt's recovery hook is active in the benchmark path.

## Questions Answered
- **Where else would the same judgment pay off?** First, citation-drift scan in sk-doc, where the claim is whether a cited code span supports its sentence; second, deep-review P0/P1 evidence refs; third, deep-research claim-to-source links. Each needs a task-specific rubric and should keep model output advisory until its own held-out agreement is measured.
- **What would default-on require, cost, and risk?** Forward task/spec/allowlist, keep model-family independence, define payload consent, use a bounded cache and call budget, wire low-confidence handling, and retain per-row confidence/evidence/provenance. Cost is roughly one primary judge per new fixture/sample output, with cache hits reducing calls and low-confidence escalation adding a second; exact dollars and workload latency are unknown. Risks include outbound output data, prompt injection despite the existing sentinel defense, same-family blind spots, errors scored as zero, hidden low confidence, and up to 15 points of aggregate-score movement. Feature 024 explicitly says a keep verdict wires nothing without a later integration decision ([verdict scope](specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/spec.md:168)).

## Questions Remaining
- Exact dollars, end-to-end latency, and default-path accuracy remain unmeasured; the supplied agreement run is not a production cost study.

## Next Focus
Write the ranked synthesis from the three completed iterations, preserve the remaining measurement caveats, and record the required max-iterations terminal reason.

## Sources
- .skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md:18-30
- .skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl:73-75
- .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:50-52,79-89
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:435-485,569-660,733-773
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:53-60,198-230,269-326
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:55-69,98-107,202-220,375-467
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/dispute.cjs:7-19,110-129
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:679-712
- specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/spec.md:138,168
- steer.md checked immediately before iteration 3; absent.
