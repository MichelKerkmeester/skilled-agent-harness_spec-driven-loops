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
- Review Target: .skilled/skills/system-skill-advisor (skill)
- Started: 2026-11-23T21:41:17.101Z
- Status: COMPLETE
- Iteration: 3 of 3
- Provisional Verdict: FAIL
- Failed required gates at stop: coverage
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-11-23T21:41:17.101Z
- Parent Session: 2026-11-23T21:02:32.908Z
- Lifecycle Mode: restart
- Generation: 5
- continuedFromRun: none

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
| P1 (Required) | 2 |
| P2 (Suggestions) | 8 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness: unread lifecycle/derived/skill-graph modules + fusion.ts gen-4 recheck | correctness | 1.00 | 0/1/4 | complete |
| 2 | security: socket_hijack, trust default recheck, shadow sink, prompt-time refusal; python_ts_parity by test run; cross-skill-edges and query handler | security | 0.44 | 0/1/2 | complete |
| 3 | traceability (spec_code, feature_catalog_code) and maintainability (TS/Python duplication), plus recheck of all generation-5 findings | traceability/maintainability | 0.11 | 0/0/2 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 10 |
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
- graphConvergenceScore: 0.88
- graphDecision: STOP_BLOCKED
- graphBlockers: {"count":2,"description":"Dimension coverage (50%) is below threshold (80%). 2 gap(s) found. STOP is blocked until all required dimensions have meaningful coverage.","severity":"blocking","type":"uncovered_dimensions"}

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 1.00 -> 0.44 -> 0.11
- convergenceScore: 0.89
- openFindings: 10
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
- candidateCoverage: covered=10, ruledOut=6, deferred=3, blocked=0

### Search Debt
- iteration 1 lifecycle_and_derived_defect_scan (deferred): 24-call budget exhausted; carried to iteration 2; evidence=UNKNOWN
- iteration 2 handler_defect_scan (deferred): not reached within 24-call budget; iteration 3; evidence=UNKNOWN
- iteration 3 playbook_capability (deferred): 24-call budget exhausted; protocol not run; evidence=UNKNOWN

### Ruled-Out Candidates
- iteration 1 attribution (ruled_out): lowest-scored holder is the binding ceiling; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:545
- iteration 1 nan_propagation (ruled_out): not reachable on live path; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1334
- iteration 2 python_ts_parity (ruled_out): no disagreement within the shared corpus; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1
- iteration 2 path_traversal (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/metadata-loader.ts:42, .skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/index.ts:62
- iteration 3 contract_drift (ruled_out): verified by direct read and manifest parity test; evidence=.skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/status.ts:142
- iteration 3 trust_predicate (ruled_out): untrusted no-op refused, no unguarded write; evidence=.skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/index.ts:39

### Clean Search Proof
- iteration 1 attribution (ruled_out): lowest-scored holder is the binding ceiling; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:545
- iteration 1 nan_propagation (ruled_out): not reachable on live path; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1334
- iteration 2 python_ts_parity (ruled_out): no disagreement within the shared corpus; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1
- iteration 2 path_traversal (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/metadata-loader.ts:42, .skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/index.ts:62
- iteration 3 contract_drift (ruled_out): verified by direct read and manifest parity test; evidence=.skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/status.ts:142
- iteration 3 trust_predicate (ruled_out): untrusted no-op refused, no unguarded write; evidence=.skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/index.ts:39

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining; all four dimensions are covered (3 of 3 iterations used). - Focus area: synthesis. Carry G5-I1-P1-001 and G5-I2-P1-001 as the two active P1s, eight P2s. - Reason: max-iterations stop policy reached. - Rotation status: correctness, security, traceability, maintainability covered (4/4). - Blocked/productive carry-forward: do not reopen parity or the cross-skill-edges symlink path; playbook_capability was never run. - Required evidence: synthesis rechecks the two P1s at file:line before the verdict. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 3 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
