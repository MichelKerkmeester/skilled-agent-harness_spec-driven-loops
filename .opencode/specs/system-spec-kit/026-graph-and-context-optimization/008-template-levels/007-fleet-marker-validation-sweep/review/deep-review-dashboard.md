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
- Review Target: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep (spec_folder)
- Started: 2026-05-04T08:16:07.000Z
- Status: MAX_ITERATIONS_REACHED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasAdvisories: false
- Session ID: 2026-05-04T08:16:07.000Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 5 |
| P2 (Suggestions) | 0 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | D1 implementation-spec-alignment - target packet vs marker sweep intent and 010 graph context | traceability/implementation-spec-alignment | 0.62 | 0/2/0 | complete |
| 2 | D2 code-correctness - marker emission and validator comment-consumer assumptions | correctness/code-correctness | 0.31 | 0/3/0 | complete |
| 3 | D3 template-rendering-correctness - scaffold marker placement, template-source contracts, inline gates, and snapshot coverage | correctness/template-rendering-correctness | 0.18 | 0/3/0 | complete |
| 4 | D4 validator-coverage - default validation orchestration, semantic marker validators, and negative fixture coverage | validator-coverage | 0.24 | 0/4/0 | complete |
| 5 | D5 cross-runtime-mirror-consistency - command, agent, mirror, and cli-copilot target-authority parity | cross-runtime-mirror-consistency/traceability | 0.20 | 0/5/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
| security | pending | 0 |
| traceability | covered | 3 |
| maintainability | covered-by-custom-validator-dimension | 1 |

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
- Last 3 ratios: 0.18 -> 0.24 -> 0.20
- convergenceScore: 0.00
- openFindings: 5
- persistentSameSeverity: 0
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 0

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:next-focus -->
## 10. NEXT FOCUS
- Dimension: `synthesis/max-iterations` - Focus area: Compile final review-report.md with active P1 findings and CONDITIONAL verdict. - Carry-forward: F001/P1-001, F002/P1-002, F003/P1-003, F004/P1-004, and F005/P1-005 remain active and should inform synthesis.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 11. ACTIVE RISKS
- 5 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
