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
- Review Target: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers (spec-folder)
- Started: 2026-11-24T09:55:42.987Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: FAIL
- Failed required gates at stop: coverage
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-deepseek-max-2-1795514074741-gl47kr
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
| P1 (Required) | 1 |
| P2 (Suggestions) | 7 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | traceability/spec_code over REQ-001..REQ-034 | traceability | 1.00 | 0/0/3 | complete |
| 2 | traceability/checklist_evidence over tasks.md ticks, AC rows and the Verification Summary | traceability | 0.25 | 0/0/1 | complete |
| 3 | correctness of the gate decision path on inflected and adversarial prompts | correctness | 0.60 | 0/1/1 | complete |
| 4 | security of the prompt-text and child-stdout trust boundaries, process invocation and secret exposure | security | 0.14 | 0/0/1 | complete |
| 5 | maintainability of the two gate copies, the drift guard boundary and the records a maintainer follows | maintainability | 0.13 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 8 |
| security | covered | 0 |
| traceability | covered | 0 |
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
- Last 3 ratios: 0.60 -> 0.14 -> 0.13
- convergenceScore: 0.87
- openFindings: 8
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
- candidateCoverage: covered=15, ruledOut=10, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 spec_drift (ruled_out): producer present and read for every REQ; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:208
- iteration 1 parity_drift (ruled_out): measured agreement, 41 of 41; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5306
- iteration 2 evidence_drift (ruled_out): read every named artefact; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:223
- iteration 3 mode_cue (ruled_out): measured on the deferred route; evidence=.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:963
- iteration 4 redos (ruled_out): measured; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4921
- iteration 4 shell_injection (ruled_out): read the only spawn site; evidence=.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:283
- iteration 5 parity_drift (ruled_out): 0 of 2306 disagreed; evidence=.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:65
- iteration 5 dead_code (ruled_out): counted readers for each symbol; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:191

### Clean Search Proof
- iteration 1 spec_drift (ruled_out): producer present and read for every REQ; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:208
- iteration 1 parity_drift (ruled_out): measured agreement, 41 of 41; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5306
- iteration 2 evidence_drift (ruled_out): read every named artefact; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:223
- iteration 3 mode_cue (ruled_out): measured on the deferred route; evidence=.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:963
- iteration 4 redos (ruled_out): measured; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4921
- iteration 4 shell_injection (ruled_out): read the only spawn site; evidence=.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:283
- iteration 5 parity_drift (ruled_out): 0 of 2306 disagreed; evidence=.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:65
- iteration 5 dead_code (ruled_out): counted readers for each symbol; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:191

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- None: this is iteration 5 of a `max-iterations` run. The loop proceeds to terminal gates and synthesis. - **Carry-forward:** the P1 (plural loop names) is the one finding that needs an operator decision — guard it or record it as a limitation beside limitation 7. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
