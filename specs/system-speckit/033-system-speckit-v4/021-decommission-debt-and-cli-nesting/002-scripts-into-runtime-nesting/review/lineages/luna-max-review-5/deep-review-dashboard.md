---
title: Deep Review Dashboard
description: Lineage-local review dashboard.
---

# Deep Review Dashboard - Session Overview

## STATUS
- Target: `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting`
- Target Type: `spec-folder`
- Session: `fanout-luna-max-review-5-1788624802460-meehmn`
- Status: COMPLETE
- Stop reason: maxIterationsReached
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- Release Readiness: release-blocking
- hasAdvisories: true

## FINDINGS SUMMARY
- P0 (Critical): 0 active
- P1 (Major): 10 active
- P2 (Minor): 8 active
- Dimensions covered: correctness, security, traceability, maintainability
- Core protocols: 2 / 2 fail
- Overlay protocols: 2 / 2 partial
- Graph convergence: unavailable

## PROGRESS
| # | Focus | Files | Dimensions | New P0/P1/P2 | Ratio | Status |
|---|---|---:|---|---|---:|---|
| 0 | initialization | 0 | none | 0 / 0 / 0 | 0.00 | initialized |
| 1 | workspace and entrypoints | 8 | correctness, maintainability | 0 / 1 / 1 | 1.00 | complete |
| 2 | path containment and hook selection | 5 | security, correctness | 0 / 1 / 1 | 0.50 | complete |
| 3 | packet truth and acceptance evidence | 7 | traceability | 0 / 1 / 1 | 0.75 | complete |
| 4 | documentation and registry | 12 | maintainability, traceability | 0 / 1 / 1 | 0.70 | complete |
| 5 | generated output boundaries | 7 | correctness, maintainability | 0 / 1 / 1 | 0.60 | complete |
| 6 | import direction and root resolution | 7 | correctness, maintainability | 0 / 0 / 1 | 0.40 | complete |
| 7 | external consumers, CI and hooks | 11 | correctness, maintainability | 0 / 1 / 1 | 0.30 | complete |
| 8 | fixtures and wrapper boundaries | 9 | maintainability, correctness | 0 / 0 / 1 | 0.20 | complete |
| 9 | generated metadata and acceptance binding | 8 | traceability, correctness | 0 / 2 / 0 | 0.85 | complete |
| 10 | final adversarial coverage | 12 | all | 0 / 0 / 0 | 0.00 | complete |

## COVERAGE
- Files reviewed: 73 / 450 bounded manifest entries
- Dimensions complete: 4 / 4
- Resource-map coverage: skipped because no map existed at init; lineage evidence map emitted separately

## NEXT FOCUS
synthesis: emit review-report.md and resource-map.md from the ten iteration records

## ACTIVE RISKS
- Ten active P1 findings remain. Repository validation, build, install and test commands were intentionally not run in this detached lineage.
- Coverage-graph writes are unavailable under the lineage-only write constraint.
