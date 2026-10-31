---
title: Deep Research Strategy
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy

## 2. TOPIC
Improve, refine and expand the Jev citation drift scan (feature 032), using the recorded Phase 047 result and repository evidence. This is research only; no scorer changes or remeasurement.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] What in the scorer, sample, and paired comparison drove the recorded result, and what does it not establish?
- [ ] Which changes could raise semantic accuracy or reduce Jev call cost while retaining the zero-call structural scan?
- [ ] What label, sampling, and reporting changes would make the measurement more trustworthy?
- [ ] Where else inside `.skilled` would claim-to-source semantic judgment produce useful signal?
- [ ] What would a default-on integration require, cost, and risk?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS
- Do not edit implementation, tests, labels, packet documents, or workflows.
- Do not rerun the Jev measurement; Phase 047 owns it.
- Do not write outside this Luna lineage.

## 5. STOP CONDITIONS
- Stop after three iterations even if the default convergence telemetry would nominate an earlier stop.
- Record the terminal stop reason as `maxIterationsReached`.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- How can label quality, sample representativeness, uncertainty reporting, and cost controls improve without weakening the deterministic zero-call scan? (iteration 1)
- What lifecycle, consent, privacy, and latency controls would a default-on semantic arm require? (iteration 1)
- Which other `.skilled` checks make decisions about meaning that deterministic rules cannot settle? (iteration 1)
- What would a default-on lifecycle, consent, privacy, latency, budget, and failure policy need to specify? (iteration 2)
- Which other `.skilled` tools make a semantic judgment that deterministic rules cannot settle? (iteration 2)
- What independent live-only holdout performance and operating budget would justify changing the default contract? (iteration 3)
- What provider retention and exact historical output contents applied to the 047 run? The packet note and inspected call logger do not agree. (iteration 3)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
What provider retention and exact historical output contents applied to the 047 run? The packet note and inspected call logger do not agree.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT
- The scan checks path-and-line resolution deterministically, while Jev judges whether the live code window supports the citing sentence. `.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md:18-30`
- The Phase 047 record says 40/40 rows measured; Jev was right on 35, identifier overlap on 13, with 22 paired wins and no losses; three flips were recorded. `specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/goal.md:122`
- The labels are based on a small mixed sample and are tied to a commit and labels hash. The evaluation should not be rerun in this packet.

## 13. RESEARCH BOUNDARIES
- Max iterations: 3; convergence threshold: 0.05; stop policy: max-iterations.
- Maximum iteration tool calls: 12; maximum iteration duration: 10 minutes.
- Executor provenance: cli-codex, model gpt-6-luna, reasoning effort max, service tier fast.
- Artifact root is the caller-supplied Luna lineage directory.
- Research sources are read-only. Only workflow artifacts inside the lineage may be written.
