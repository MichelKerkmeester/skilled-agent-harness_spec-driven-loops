# Deep Research Strategy

## 2. TOPIC
Improve and assess the deterministic-miss Jev verdict fallback in the reviewer-regression benchmark, using the measured 24-row result as a starting point. Real reviewer outputs rarely miss the verdict regex, so prevalence and production value must be treated separately from conditional accuracy.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] What drove the measured 24/24 Jev agreement and keep verdict?
- [ ] How can accuracy improve or per-miss cost fall?
- [ ] How can the measurement better represent real use and uncertainty?
- [ ] Where else in .skilled would the same bounded judgment help?
- [ ] What would default-on integration require, cost, and risk?
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS
No source-code changes, live reviewer integration, model call, payload export, or claim that this selected miss corpus estimates production prevalence. No dollar cost estimate is available in the supplied evidence.

## 5. STOP CONDITIONS
Complete all three iterations because stopPolicy is max-iterations. Convergence is telemetry only. Stop only for a hard evidence or scope blocker; record it without writing outside this lineage.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
None yet.
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
Not yet assessed.
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
Not yet assessed.
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES
None.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
None yet.
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
No pivots recorded.
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
Can the false-miss rate be measured on ordinary reviewer traffic with privacy-safe labels?
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Use the next not-yet-completed pass, in order: (1) iteration 1, reconstruct the sample, baselines, metrics, and keep decision; (2) iteration 2, identify accuracy levers and avoidable call cost; (3) iteration 3, design a representative measurement and assess adjacent judgments and default-on integration.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT
- The measurement is an offline benchmark and defaults to zero model calls. The online scorer already has an opt-in llm fallback.
- The supplied 24 outputs were all selected because the deterministic regex missed; a separate feature spec says the built-in fixture profile has 8 cases and all 8 matched the regex.
- Relevant implementation: score-verdict-fallback.cjs, reviewer-scorer.cjs, reviewer-regression profile, feature 025 spec, and the phase 047 evidence table.
- resource-map.md not present; skipping coverage gate.
- Candidate comparisons from phase 047 include hallucination grading, completion-claim audit, stop second-rater, fan-out merge, and debug next-check.

## 13. RESEARCH BOUNDARIES
- Max iterations: 3
- Convergence threshold: 0.05
- Convergence mode: default; stop policy: max-iterations
- Executor: inline current process bound to cli-codex / gpt-6-luna
- All writes: this Luna lineage directory
- Registry and dashboard are reducer-owned; no reducer output is synthesized by hand.
