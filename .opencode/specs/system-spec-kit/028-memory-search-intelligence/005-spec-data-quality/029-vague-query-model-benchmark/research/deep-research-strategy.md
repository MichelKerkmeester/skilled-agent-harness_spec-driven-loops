# Deep Research Strategy - 029 Search-Quality Findings

## 1. OVERVIEW

### Purpose
Deep-dive the benchmark findings to their root cause in the live memory-search code and design prioritized fixes. Research only, no implementation.

### Usage
The orchestrator dispatches one gpt-5.5-fast xhigh read-only analysis per iteration against one focus, then writes the iteration markdown, the JSONL delta and runs the reducer. Findings cite `file:line`.

---

## 2. TOPIC
The 029 vague-query benchmark surfaced one correctness bug and several quality issues in the `/memory:search` verdict and presentation path. This session traces each to its source in the search pipeline and designs a fix, sequenced by value and risk.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1 (keystone): Why does the `[EVIDENCE GAP DETECTED]` banner fire on 19 of 144 cells while `requestQuality` stays `good`? Trace `detectEvidenceGap` in `stage4-filter.ts` versus the verdict cap in `confidence-scoring.ts:668` that reads `safeExtraData.evidenceGap` at `search-results.ts:1141`. Is the graduated `SPECKIT_EVIDENCE_GAP_VERDICT_V1` cap actually reaching the live render path, or are the banner signal and the cap signal decoupled?
- [x] Q2: How do `requestQuality`, `citationPolicy`, the evidence-gap detector, and the graduated noise-floor / lexical-grounding / cite-with-caveat flags compose in the live `search-results.ts` render path? Where could two confidence signals diverge?
- [x] Q3: The `citeCorrect` metric in `extract-metrics.mjs:66` scores against the binary cite-iff-good rule and mislabels every `cite_with_caveat` cell. Design the three-tier-aware fix and confirm no other consumer depends on the binary rule.
- [x] Q4: Why does the intent classifier return `understand` for 132 of 144 cells with `weightsApplied off`? Where is intent classified, what gates the retrieval-class weights, and should one-word queries differentiate or is the inert default correct?
- [x] Q5: Root-cause the dashboard presentation issues: the bare-dash score on graph-channel and degree-channel rows, the result-count header that exceeds the rows shown under token-budget truncation, and the truncated long-path titles. Locate each in the formatter or the presentation contract.
- [x] Q6: Why is retrieval model-deterministic for clearly-aligned queries (graph spread 0.0) but model-sensitive for ambiguous ones (agent spread 0.88, deep-loop 0.61)? What in the dispatch or the query path makes the same word resolve differently, and what stabilizes it?
- [x] Q7: Across Q1 to Q6, which fixes are highest-value and lowest-risk? Produce a sequenced fix plan with effort and blast-radius estimates.

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any fix. This session reports findings and designs only.
- Re-running the benchmark or changing any flag default.
- Touching the model dispatch harness or the benchmark driver.

---

## 5. STOP CONDITIONS
- All seven key questions answered with a cited root cause and a concrete fix design.
- newInfoRatio below 0.05 for two consecutive iterations.
- Ten iterations reached.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: Evidence-gap field-bridging bug. The handler sets evidenceGapWarning (drives the banner) but never evidenceGap (drives the cap), so the graduated SPECKIT_EVIDENCE_GAP_VERDICT_V1 cap is dead on the live render path. Fix: bridge stage4.evidenceGapDetected into extraData. (iteration 1)
- Q4: Intent classifier is by-design (safe understand fallback + dark-launched retrieval-profile weights). The defect is telemetry: weightsApplied:off measures Stage-2 intent weights (always off for hybrid), not the retrieval-class profile weights. (iteration 2)
- Q5 (partial): dashboard bare-dash is a real data gap (graph/degree rows expose only similarity, which is absent; surface the resolved rrfScore/score). Count-vs-rows and the (truncated) title are model-side rendering of imperfect data, not code; tighten the presentation contract. (iteration 3)

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Threshold mismatch between detector and cap (both ultimately trace to the same Stage-4 TRM signal; the gap is in field-bridging, not thresholds). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Threshold mismatch between detector and cap (both ultimately trace to the same Stage-4 TRM signal; the gap is in field-bridging, not thresholds).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Threshold mismatch between detector and cap (both ultimately trace to the same Stage-4 TRM signal; the gap is in field-bridging, not thresholds).

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Threshold mismatch between detector and cap (both ultimately trace to the same Stage-4 TRM signal; the gap is in field-bridging, not thresholds). (iteration 1)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
CONVERGED. All seven questions answered in 5 iterations (Q2 folded into Q1 verdict-path trace). Synthesis in research.md.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
The findings and their evidence are in `../benchmark-results.md` sections 5 through 8 and `../implementation-summary.md`. The graduated flags shipped in `028-scoring-hardening` and graduated in `040-flag-graduation-benchmark`. Key source files already located: `confidence-scoring.ts` (verdict cap, line 668), `search-results.ts` (render, line 1141), `stage4-filter.ts` (detector, line 266), `evidence-gap-detector.ts`, `extract-metrics.mjs` (line 66).

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 12 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
