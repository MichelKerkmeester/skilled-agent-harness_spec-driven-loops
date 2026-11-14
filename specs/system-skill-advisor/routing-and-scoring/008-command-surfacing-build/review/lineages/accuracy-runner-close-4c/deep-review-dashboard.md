---
title: Deep Review Dashboard
description: Auto-generated reducer view over the review packet.
---

# Deep Review Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active review packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Review Target: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build (spec-folder)
- Started: 2026-11-14T19:11:54Z
- Status: COMPLETE
- Iteration: 2 of 2
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: fanout-accuracy-runner-close-4c-1794682797954-pcdanq
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:dimension-expansion -->
## 2A. DIMENSION EXPANSION
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:dimension-expansion -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 0 |
| P2 (Suggestions) | 3 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness and security | correctness/security | 1.00 | 0/0/1 | complete |
| 2 | traceability and maintainability | traceability/maintainability | 0.67 | 0/0/2 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
| security | covered | 0 |
| traceability | covered | 2 |
| maintainability | covered | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: none
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 1.00 -> 0.67
- convergenceScore: 0.33
- openFindings: 3
- persistentSameSeverity: 0
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 0

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=8, ruledOut=5, deferred=1, blocked=0

### Search Debt
- iteration 2 deferred_scope (deferred): The 027 remediation spec assigns these three items to phase 026; re-reporting them here would duplicate a deferred workstream.; evidence=027-review-pass-four-remediation/spec.md:214

### Ruled-Out Candidates
- iteration 1 offered_as_persistence (ruled_out): The field is present on both writer paths; the head-moved line is the documented exception and carries none of the four.; evidence=command-offer.mjs:496, run-command-behaviour.mjs:824, run-command-behaviour.mjs:1203
- iteration 1 heredoc_parsing (ruled_out): The character class and backreference cover the hyphen and dot cases the T008 tests name.; evidence=score-command-transcripts.mjs:648
- iteration 1 path_containment (ruled_out): The read is the file containment resolved; the caller's locator is only used to compare the recorded id.; evidence=codex.mjs:163, codex.mjs:169, codex.mjs:180
- iteration 1 holdout_publication (ruled_out): The live capture is checked and the helper reads all four published maps.; evidence=command-routing-slice.vitest.ts:134-149, command-routing-slice.vitest.ts:201-210
- iteration 2 checklist_evidence (ruled_out): AR4B-P2-001 and AR4B-P2-002 are fixed by the T030 edits; no third list or exception is missing.; evidence=README.md:70, README.md:76, README.md:125, run-command-behaviour.mjs:1180-1184, run-command-behaviour.mjs:1201-1205

### Clean Search Proof
- iteration 1 offered_as_persistence (ruled_out): The field is present on both writer paths; the head-moved line is the documented exception and carries none of the four.; evidence=command-offer.mjs:496, run-command-behaviour.mjs:824, run-command-behaviour.mjs:1203
- iteration 1 heredoc_parsing (ruled_out): The character class and backreference cover the hyphen and dot cases the T008 tests name.; evidence=score-command-transcripts.mjs:648
- iteration 1 path_containment (ruled_out): The read is the file containment resolved; the caller's locator is only used to compare the recorded id.; evidence=codex.mjs:163, codex.mjs:169, codex.mjs:180
- iteration 1 holdout_publication (ruled_out): The live capture is checked and the helper reads all four published maps.; evidence=command-routing-slice.vitest.ts:134-149, command-routing-slice.vitest.ts:201-210
- iteration 2 checklist_evidence (ruled_out): AR4B-P2-001 and AR4B-P2-002 are fixed by the T030 edits; no third list or exception is missing.; evidence=README.md:70, README.md:76, README.md:125, run-command-behaviour.mjs:1180-1184, run-command-behaviour.mjs:1201-1205

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining within the cap; synthesis - Focus area: compile the lineage report from the registry, the two deltas and the three active P2 findings. - Reason: two iterations are complete; the cap is reached with three active P2 advisories and no P0/P1. - Rotation status: correctness and security complete in iteration 1; traceability and maintainability complete in iteration 2. - Required evidence: the registry's active counts, the two iteration final lines and the synthesis report. - Blocked/productive carry-forward: no blocked approach; the redirect P2 is carried. - Recovery note: none; the cap is reached before a legal convergence stop.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
