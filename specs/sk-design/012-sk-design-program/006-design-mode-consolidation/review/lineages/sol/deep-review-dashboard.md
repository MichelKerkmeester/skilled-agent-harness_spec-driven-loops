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
- Review Target: .opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation (spec-folder)
- Started: 2026-07-27T05:10:48Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-sol-1785128932566-ou7z2l
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
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
| P1 (Required) | 4 |
| P2 (Suggestions) | 3 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | [object Object] | - | 1.00 | 0/0/0 | complete |
| 2 | [object Object] | - | 0.45 | None./Two active P1 findings: prior retired-identity handoff correctness issue plus new md-generator guided-run designMd write-boundary bypass./One active prior P2: proof-token example uses invalid foundations workflow mode. | complete |
| 3 | [object Object] | - | 0.35 | None./Three active P1 findings: prior retired-identity handoff correctness issue, prior md-generator guided-run write-boundary bypass, and new active spec NFR that still requires retired audit shell/path gates to remain intact./Two active P2 findings: prior invalid foundations proof-token example and new stale checklist frontmatter describing the superseded permanent-subworkflow verification target. | complete |
| 4 | [object Object] | - | 0.26 | None./Four active P1 findings: prior retired sk-code handoff identities, prior md-generator designMd write-boundary bypass, prior active audit-gate NFR mismatch, and new retained foundations procedure cards omitted from live interface selection contracts./Three active P2 findings: prior invalid foundations proof-token example, prior stale checklist frontmatter, and new shared procedure/proof contracts still blessing retired foundations/audit owners. | complete |
| 5 | [object Object] | - | 0.50 | None./Four active P1 findings reconfirmed as refinements: stale retired sk-code handoff identities, unchecked md-generator --design-md mutation path, active retired-audit security NFR, and retained foundations procedure-card selection drift./Three active P2 findings reconfirmed: invalid foundations proof-token example, stale checklist frontmatter, and shared procedure/proof contracts retaining retired owner examples. | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 2 |
| security | covered | 2 |
| traceability | covered | 1 |
| maintainability | covered | 2 |

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
- Last 3 ratios: 0.35 -> 0.26 -> 0.50
- convergenceScore: 0.50
- openFindings: 7
- persistentSameSeverity: 7
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 7

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
- dimension: synthesis - focus area: reducer/final report synthesis with four active P1s and three active P2s - reason: iteration 5 is the final mandatory stabilization pass; no new findings were added and all active P1/P2 findings are synthesis-ready - rotation status: all dimensions complete; final synthesis should preserve CONDITIONAL verdict while P1s remain active - blocked/productive carry-forward: do not retry broad historical searches; use the cited direct evidence and current checker outputs - required evidence: final reducer registry refresh, review report generation, and remediation plan for P1-001 through P1-004 Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 4 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
