---
title: Deep Review Dashboard
description: Auto-generated status view for fan-out lineage codex-1.
---

# Deep Review Dashboard - codex-1

## 1. STATUS
- Review Target: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode`
- Artifact Dir: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/review/lineages/codex-1`
- Session ID: `fanout-codex-1-1780595350529-v1hlrq`
- Status: COMPLETE
- Iteration: 5 of 7
- Stop reason: converged
- Provisional verdict: CONDITIONAL
- hasAdvisories: false

## 2. FINDINGS SUMMARY
| Severity | Count |
|----------|------:|
| P0 | 0 |
| P1 | 3 |
| P2 | 2 |
| Resolved | 0 |

## 3. PROGRESS
| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|------:|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/1/0 | complete |
| 2 | security | security | 0.50 | 0/2/0 | complete |
| 3 | traceability | traceability | 0.38 | 0/3/1 | complete |
| 4 | maintainability | maintainability | 0.09 | 0/3/2 | complete |
| 5 | stabilization | all | 0.00 | 0/3/2 | complete |

## 4. DIMENSION COVERAGE
| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
| security | covered | 1 |
| traceability | covered | 2 |
| maintainability | covered | 1 |

## 5. ACTIVE RISKS
- 3 active P1 findings require remediation before PASS.
- 2 active P2 findings are advisory and should be queued with the same cleanup because they share the same standards-drift surface.
- No P0 blockers were confirmed.

## 6. CONVERGENCE
- Last 3 ratios: 0.38 -> 0.09 -> 0.00
- Rolling average at stop: 0.045
- Dimension coverage: 4/4
- Required traceability protocols: executed
- Stabilization pass: complete
- Blocked stops: none

## 7. NEXT FOCUS
Remediation planning for F001, F002 and F003.
