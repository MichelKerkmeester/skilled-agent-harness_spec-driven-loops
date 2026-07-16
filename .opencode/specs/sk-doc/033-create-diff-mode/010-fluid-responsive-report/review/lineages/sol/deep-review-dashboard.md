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
- Review Target: .opencode/specs/sk-doc/033-create-diff-mode/010-fluid-responsive-report (spec-folder)
- Started: 2026-07-16T13:09:03.751Z
- Status: COMPLETE
- Iteration: 10 of 10
- Provisional Verdict: FAIL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-sol-1784207165086-152crx
- Parent Session: fanout-sol-1784207165086-152crx
- Lifecycle Mode: resume
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
| P0 (Blockers) | 1 |
| P1 (Required) | 1 |
| P2 (Suggestions) | 1 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness: renderer behavior, fluid CSS assumptions, fallback behavior, and regression proof | - | 1.00 | 0/0/0 | complete |
| 2 | security: renderer escaping, CSP preservation, hostile-content handling, validator allowlist boundaries, and unsafe file/state operations | security | 0.63 | 1/0/0 | complete |
| 3 | traceability: spec_code, checklist_evidence, feature_catalog_code, and playbook_capability | traceability | 0.00 | 0/0/0 | complete |
| 4 | maintainability: state validation, destructive-operation boundaries, regression matrix, and durable documentation | maintainability | 0.00 | 0/0/0 | complete |
| 5 | correctness stabilization: unsupported-unit fallback and current-path behavior | correctness | 0.00 | 0/0/0 | complete |
| 6 | security adversarial replay: manifest producer, consumers, and destructive sink | security | 0.00 | 0/0/0 | complete |
| 7 | traceability stabilization: core and overlay protocol replay | traceability | 0.00 | 0/0/0 | complete |
| 8 | maintainability saturation: producer-consumer ownership and test obligations | maintainability | 0.00 | 0/0/0 | complete |
| 9 | security negative-test replay: traversal, malformed manifests, and preview parity | security | 0.00 | 0/0/0 | complete |
| 10 | final stabilization: verdict consistency, evidence density, and release readiness | correctness | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 2 |
| security | covered | 1 |
| traceability | covered | 0 |
| maintainability | covered | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
### Iteration 5 — blocked by [dimensionCoverageGate, p0ResolutionGate]
- Recovery: Age full dimension coverage and adversarially replay the active P0 before another stop vote.
- Gate results: convergenceGate: true, dimensionCoverageGate: false, p0ResolutionGate: false, evidenceDensityGate: true, hotspotSaturationGate: true, claimAdjudicationGate: true, fixCompletenessReplayGate: true, candidateCoverageGate: true, graphlessFallbackGate: true
- Timestamp: 2026-07-16T14:09:05Z

### Iteration 6 — blocked by [p0ResolutionGate]
- Recovery: Continue saturation passes; P0-001 remains active and prevents legal convergence.
- Gate results: convergenceGate: true, dimensionCoverageGate: true, p0ResolutionGate: false, evidenceDensityGate: true, hotspotSaturationGate: true, claimAdjudicationGate: true, fixCompletenessReplayGate: true, candidateCoverageGate: true, graphlessFallbackGate: true
- Timestamp: 2026-07-16T14:10:05Z

### Iteration 7 — blocked by [p0ResolutionGate]
- Recovery: Continue review breadth until the hard ceiling; target mutation is forbidden.
- Gate results: convergenceGate: true, dimensionCoverageGate: true, p0ResolutionGate: false, evidenceDensityGate: true, hotspotSaturationGate: true, claimAdjudicationGate: true, fixCompletenessReplayGate: true, candidateCoverageGate: true, graphlessFallbackGate: true
- Timestamp: 2026-07-16T14:11:05Z

### Iteration 8 — blocked by [p0ResolutionGate]
- Recovery: Inspect adjacent negative tests before the terminal pass.
- Gate results: convergenceGate: true, dimensionCoverageGate: true, p0ResolutionGate: false, evidenceDensityGate: true, hotspotSaturationGate: true, claimAdjudicationGate: true, fixCompletenessReplayGate: true, candidateCoverageGate: true, graphlessFallbackGate: true
- Timestamp: 2026-07-16T14:12:05Z

### Iteration 9 — blocked by [p0ResolutionGate]
- Recovery: Proceed to the final stabilization pass and stop at maxIterationsReached.
- Gate results: convergenceGate: true, dimensionCoverageGate: true, p0ResolutionGate: false, evidenceDensityGate: true, hotspotSaturationGate: true, claimAdjudicationGate: true, fixCompletenessReplayGate: true, candidateCoverageGate: true, graphlessFallbackGate: true
- Timestamp: 2026-07-16T14:13:05Z

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: none
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
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
- No search-depth state captured (legacy v1 record).
- graphCoverageMode: none

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Synthesis: deduplicate the three findings, preserve active severities, and route remediation planning from a final FAIL verdict. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P0 finding(s) blocking release.
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- Latest blocked_stop at run 9: p0ResolutionGate. Recovery: Proceed to the final stabilization pass and stop at maxIterationsReached..

<!-- /ANCHOR:active-risks -->
