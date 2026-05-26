---
title: Deep Review Dashboard
description: Auto-generated reducer view over the review packet.
---

# Deep Review Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

## 1. OVERVIEW

Reducer-generated observability surface for the active review packet.

## 2. STATUS
- Review Target: blocked-stop-session fixture (fixture)
- Started: 2026-04-11T12:00:00Z
- Status: RUNNING
- Iteration: 3 of 7
- Provisional Verdict: FAIL
- hasAdvisories: false
- Session ID: rvw-blocked-stop-fixture
- Lifecycle Mode: new
- Generation: 1

## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 1 |
| P1 (Required) | 2 |
| P2 (Suggestions) | 0 |
| Resolved | 0 |

## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | Correctness review of reducer fixture state transitions | correctness | 0.55 | 0/1/1 | complete |
| 2 | Security review after export-path escalation | correctness/security | 0.68 | 1/1/1 | complete |
| 3 | Security verification of the blocked-stop path | correctness/security | 0.15 | 1/2/0 | complete |

## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 2 |
| security | covered | 1 |
| traceability | pending | 0 |
| maintainability | pending | 0 |

## 6. BLOCKED STOPS
### Iteration 3 — blocked by [dimensionCoverageGate, p0ResolutionGate]
- Recovery: Resolve active P0 (F001) and cover traceability + maintainability dimensions before next iteration.
- Gate results: convergenceGate: true, dimensionCoverageGate: false, p0ResolutionGate: false, evidenceDensityGate: true, hotspotSaturationGate: true
- Timestamp: 2026-04-11T12:45:00Z

## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: none
- graphBlockers: none

## 8. TREND
- Last 3 ratios: 0.55 -> 0.68 -> 0.15
- convergenceScore: 0.15
- openFindings: 3
- persistentSameSeverity: 2
- severityChanged: 1
- repeatedFindings (deprecated combined bucket): 3

## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

## 10. NEXT FOCUS
Resolve F001 first, then add traceability and maintainability coverage so the legal-stop gates can be re-evaluated without an active blocker.

## 11. ACTIVE RISKS
- 1 active P0 finding(s) blocking release.
