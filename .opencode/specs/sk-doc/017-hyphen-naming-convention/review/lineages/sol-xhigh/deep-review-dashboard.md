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
- Review Target: .opencode/specs/sk-doc/017-hyphen-naming-convention (spec-folder)
- Started: 2026-07-14T21:25:23.694Z
- Status: COMPLETE
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: fanout-sol-xhigh-1784064061456-29xqh9
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
| P1 (Required) | 6 |
| P2 (Suggestions) | 1 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness: phase topology coherence | correctness | 1.00 | 0/2/0 | complete |
| 2 | security: rename apply boundary | security | 0.50 | 0/2/0 | complete |
| 3 | traceability: topology cross-links | traceability | 0.00 | 0/1/0 | complete |
| 4 | traceability: executable handoff evidence | traceability | 0.20 | 0/1/0 | complete |
| 5 | correctness: graph metadata integrity | correctness | 0.00 | 0/0/0 | complete |
| 6 | maintainability: generator provenance and portability | maintainability | 0.17 | 0/1/1 | complete |
| 7 | traceability: frozen-map interface completeness | traceability/maintainability | 0.14 | 0/1/0 | complete |
| 8 | correctness and security: compatibility lifecycle | correctness/security | 0.00 | 0/0/0 | complete |
| 9 | maintainability: template-copy drift | maintainability | 0.00 | 0/1/0 | complete |
| 10 | all dimensions: adversarial stabilization | correctness/security/traceability/maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 5 |
| security | covered | 2 |
| traceability | covered | 0 |
| maintainability | covered | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.97
- graphDecision: STOP
- graphBlockers: {"type":"strict_validator_runtime","reason":"@spec-kit/shared remains unresolved."}

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 7
- persistentSameSeverity: 3
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 3

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=12, ruledOut=27, deferred=0, blocked=1

### Search Debt
- iteration 4 strict_validator_runtime (blocked): Dependency resolution failed outside target.; evidence=captured validator output

### Ruled-Out Candidates
- iteration 2 repository_boundary (ruled_out): Executable negative criteria cover the boundary.; evidence=.opencode/specs/sk-doc/017-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/checklist.md:71-75, .opencode/specs/sk-doc/017-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness/checklist.md:71-75
- iteration 3 broken_relative_links (ruled_out): Every explicit target exists.; evidence=packet-wide resolver output: markdownFiles=674, brokenLinks=0
- iteration 4 missing_checklist_protocols (ruled_out): Leaf structure is present.; evidence=checklist inventory output
- iteration 5 graph_referential_integrity (ruled_out): Machine topology and current sources agree.; evidence=metadataFiles=176; ids=176; all error counters=0
- iteration 7 candidate_denominator (ruled_out): Denominator semantics are explicit.; evidence=phase 006 spec:72-75
- iteration 8 compatibility_state_machine (ruled_out): No lifecycle gap found.; evidence=phase 002 spec:61-103, phase 009 plan:41-109, phase 010 spec:56-113
- iteration 10 active_finding_drift (ruled_out): Registry is stable.; evidence=iteration-010 active-finding table
- iteration 10 missing_dimension (ruled_out): Coverage is synthesis-ready.; evidence=iteration-010 coverage accounting

### Clean Search Proof
- iteration 2 repository_boundary (ruled_out): Executable negative criteria cover the boundary.; evidence=.opencode/specs/sk-doc/017-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/checklist.md:71-75, .opencode/specs/sk-doc/017-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness/checklist.md:71-75
- iteration 3 broken_relative_links (ruled_out): Every explicit target exists.; evidence=packet-wide resolver output: markdownFiles=674, brokenLinks=0
- iteration 4 missing_checklist_protocols (ruled_out): Leaf structure is present.; evidence=checklist inventory output
- iteration 5 graph_referential_integrity (ruled_out): Machine topology and current sources agree.; evidence=metadataFiles=176; ids=176; all error counters=0
- iteration 7 candidate_denominator (ruled_out): Denominator semantics are explicit.; evidence=phase 006 spec:72-75
- iteration 8 compatibility_state_machine (ruled_out): No lifecycle gap found.; evidence=phase 002 spec:61-103, phase 009 plan:41-109, phase 010 spec:56-113
- iteration 10 active_finding_drift (ruled_out): Registry is stable.; evidence=iteration-010 active-finding table
- iteration 10 missing_dimension (ruled_out): Coverage is synthesis-ready.; evidence=iteration-010 coverage accounting

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Phase: synthesis - Focus area: registry-based remediation packet and final conditional verdict - Required evidence: active counts, workstream dependencies, traceability status, and audit appendix

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 6 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
