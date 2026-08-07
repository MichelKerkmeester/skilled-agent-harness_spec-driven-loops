---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Root-cause and fix-design deep-dive on the 029 vague-query benchmark findings: the good-verdict-beside-evidence-gap-banner contradiction (detector vs verdict-cap desync in stage4-filter and confidence-scoring), the binary citeCorrect metric, the inert intent classifier, the dashboard presentation issues, and the model-sensitivity / retrieval-determinism finding. Investigate root causes against the live search-results render path and the graduated verdict flags, then design prioritized fixes. Report findings only, no implementation.
- Started: 2026-06-23T00:00:00Z
- Status: INITIALIZED
- Iteration: 1 of 10
- Session ID: 2026-06-23-029-search-findings-research
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | Q1 evidence-gap detector-vs-cap desync | - | 1.00 | 1 | insight |

- iterationsCompleted: 1
- keyFindings: 0
- openQuestions: 7
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/7
- [ ] Q1 (keystone): Why does the `[EVIDENCE GAP DETECTED]` banner fire on 19 of 144 cells while `requestQuality` stays `good`? Trace `detectEvidenceGap` in `stage4-filter.ts` versus the verdict cap in `confidence-scoring.ts:668` that reads `safeExtraData.evidenceGap` at `search-results.ts:1141`. Is the graduated `SPECKIT_EVIDENCE_GAP_VERDICT_V1` cap actually reaching the live render path, or are the banner signal and the cap signal decoupled?
- [ ] Q2: How do `requestQuality`, `citationPolicy`, the evidence-gap detector, and the graduated noise-floor / lexical-grounding / cite-with-caveat flags compose in the live `search-results.ts` render path? Where could two confidence signals diverge?
- [ ] Q3: The `citeCorrect` metric in `extract-metrics.mjs:66` scores against the binary cite-iff-good rule and mislabels every `cite_with_caveat` cell. Design the three-tier-aware fix and confirm no other consumer depends on the binary rule.
- [ ] Q4: Why does the intent classifier return `understand` for 132 of 144 cells with `weightsApplied off`? Where is intent classified, what gates the retrieval-class weights, and should one-word queries differentiate or is the inert default correct?
- [ ] Q5: Root-cause the dashboard presentation issues: the bare-dash score on graph-channel and degree-channel rows, the result-count header that exceeds the rows shown under token-budget truncation, and the truncated long-path titles. Locate each in the formatter or the presentation contract.
- [ ] Q6: Why is retrieval model-deterministic for clearly-aligned queries (graph spread 0.0) but model-sensitive for ambiguous ones (agent spread 0.88, deep-loop 0.61)? What in the dispatch or the query path makes the same word resolve differently, and what stabilizes it?
- [ ] Q7: Across Q1 to Q6, which fixes are highest-value and lowest-risk? Produce a sequenced fix plan with effort and blast-radius estimates.

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 7
- [ ] Q1 (keystone): Why does the `[EVIDENCE GAP DETECTED]` banner fire on 19 of 144 cells while `requestQuality` stays `good`? Trace `detectEvidenceGap` in `stage4-filter.ts` versus the verdict cap in `confidence-scoring.ts:668` that reads `safeExtraData.evidenceGap` at `search-results.ts:1141`. Is the graduated `SPECKIT_EVIDENCE_GAP_VERDICT_V1` cap actually reaching the live render path, or are the banner signal and the cap signal decoupled?
- [ ] Q2: How do `requestQuality`, `citationPolicy`, the evidence-gap detector, and the graduated noise-floor / lexical-grounding / cite-with-caveat flags compose in the live `search-results.ts` render path? Where could two confidence signals diverge?
- [ ] Q3: The `citeCorrect` metric in `extract-metrics.mjs:66` scores against the binary cite-iff-good rule and mislabels every `cite_with_caveat` cell. Design the three-tier-aware fix and confirm no other consumer depends on the binary rule.
- [ ] Q4: Why does the intent classifier return `understand` for 132 of 144 cells with `weightsApplied off`? Where is intent classified, what gates the retrieval-class weights, and should one-word queries differentiate or is the inert default correct?
- [ ] Q5: Root-cause the dashboard presentation issues: the bare-dash score on graph-channel and degree-channel rows, the result-count header that exceeds the rows shown under token-budget truncation, and the truncated long-path titles. Locate each in the formatter or the presentation contract.
- [ ] Q6: Why is retrieval model-deterministic for clearly-aligned queries (graph spread 0.0) but model-sensitive for ambiguous ones (agent spread 0.88, deep-loop 0.61)? What in the dispatch or the query path makes the same word resolve differently, and what stabilizes it?
- [ ] Q7: Across Q1 to Q6, which fixes are highest-value and lowest-risk? Produce a sequenced fix plan with effort and blast-radius estimates.

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 1.00
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 1.00
- coverageBySources: {}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Threshold mismatch between detector and cap (both ultimately trace to the same Stage-4 TRM signal; the gap is in field-bridging, not thresholds). (iteration 1)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Q1 (keystone): Why does the `[EVIDENCE GAP DETECTED]` banner fire on 19 of 144 cells while `requestQuality` stays `good`? Trace `detectEvidenceGap` in `stage4-filter.ts` versus the verdict cap in `confidence-scoring.ts:668` that reads `safeExtraData.evidenceGap` at `search-results.ts:1141`. Is the graduated `SPECKIT_EVIDENCE_GAP_VERDICT_V1` cap actually reaching the live render path, or are the banner signal and the cap signal decoupled?

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
