# Deep Research Strategy - Session Tracking

## 2. TOPIC
Improve, refine and expand the Jev hallucination grader (cli-jev feature 024). Its scorer is .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs in system-deep-loop/deep-improvement, and it measures the D4 hallucination dimension of the model-benchmark 5-dimension scorer, run today by deterministic/hallucination-flag.cjs; run-benchmark.cjs already accepts --grader noop|mock|llm. Measured result: verdict jev: keep K=56 M=56 A=55 B=47 W=8 L=0 F=1 p_win=0.003906, baselines: majority 47 of 56, deterministic check 22 of 56. Fixture corpus. 42 honest DeepSeek answers held 0 invented names, so all 9 hallucinations came from 14 deliberately careless answers.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] What drove the Jev result against majority and deterministic baselines on this fixture corpus?
- [ ] Which changes could raise grader accuracy or lower grading cost, and what evidence supports each tradeoff?
- [ ] How can the D4 measurement become more trustworthy across labels, sampling, leakage, and uncertainty?
- [ ] Where else in .skilled would the same source-grounded hallucination judgment pay off?
- [ ] What would default-on integration require, cost, and risk?
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS
- Do not implement grader changes or modify benchmark sources.
- Do not rerun a live model benchmark; assess the supplied measured result and existing offline evidence.
- Do not write outside this lineage directory.

## 5. STOP CONDITIONS
- Complete exactly 3 iterations. Treat convergence before the cap as telemetry only.
- Stop with maxIterationsReached after iteration 3.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[To be updated from iteration evidence]
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[To be updated from iteration evidence]
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
None recorded.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
None yet.
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: all five key questions
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
All five key questions remain open pending repository evidence.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Trace the scorer, its label and fixture distribution, and the benchmark decision logic to explain the observed Jev result and baselines.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT
- The operator supplied one benchmark outcome and fixture-corpus facts; those are inputs to verify against repository sources, not a rerun.
- The target resource-map.md is absent; resource-map coverage is not yet established.
- Source pointers supplied by the operator: score-d4-agreement.cjs, deterministic/hallucination-flag.cjs, and run-benchmark.cjs.

## BOUNDED CONTEXT SNAPSHOT
- Initial sources: scorer, deterministic D4 check, model-benchmark runner, label/fixture corpus.
- Reuse scan: other source-grounded judgment points in .skilled.
- Gaps: corpus provenance, grading cost telemetry, and default-on runtime budget.
