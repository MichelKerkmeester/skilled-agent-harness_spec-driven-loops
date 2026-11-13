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
- Started: 2026-11-13T10:15:00.000Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-doctor-install-1794550137809-1ecgc7
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
| P1 (Required) | 2 |
| P2 (Suggestions) | 14 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/1/3 | complete |
| 2 | correctness | correctness | 0.27 | 0/0/3 | complete |
| 3 | traceability | traceability | 0.21 | 0/0/4 | complete |
| 4 | security | security | 0.29 | 0/1/1 | complete |
| 5 | maintainability | maintainability | 0.13 | 0/0/3 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 7 |
| security | covered | 2 |
| traceability | covered | 4 |
| maintainability | covered | 3 |

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
- Last 3 ratios: 0.21 -> 0.29 -> 0.13
- convergenceScore: 0.88
- openFindings: 16
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
- candidateCoverage: covered=14, ruledOut=5, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 runtime_branch_coverage (ruled_out): no advisor hook entry exists for opencode, pi or dsh here; evidence=.skilled/commands/doctor/scripts/hook-wiring-check.cjs:39, .opencode/hooks/skill-advisor
- iteration 2 mutation_authorization (ruled_out): mcp install uses approval per mutation; the other four writing steps own plan or approval phases; evidence=.skilled/commands/doctor/assets/doctor-mcp-install.yaml:84
- iteration 3 runtime_coverage (ruled_out): duplicate of DR2-P2-001; evidence=INSTALL-SKILLED.md:57, .skilled/commands/doctor/scripts/git-setup-check.cjs:64
- iteration 4 holdout_isolation (ruled_out): file-name search plus count-only inspection found no consumer in this lineage and an explicit refusal in the runner; evidence=.skilled/commands/doctor, routing-accuracy/command-prompts.jsonl, .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:588
- iteration 4 secret_emission (ruled_out): the approvalFound helper returns a boolean and the report builds no hash field; evidence=.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs:184

### Clean Search Proof
- iteration 1 runtime_branch_coverage (ruled_out): no advisor hook entry exists for opencode, pi or dsh here; evidence=.skilled/commands/doctor/scripts/hook-wiring-check.cjs:39, .opencode/hooks/skill-advisor
- iteration 2 mutation_authorization (ruled_out): mcp install uses approval per mutation; the other four writing steps own plan or approval phases; evidence=.skilled/commands/doctor/assets/doctor-mcp-install.yaml:84
- iteration 3 runtime_coverage (ruled_out): duplicate of DR2-P2-001; evidence=INSTALL-SKILLED.md:57, .skilled/commands/doctor/scripts/git-setup-check.cjs:64
- iteration 4 holdout_isolation (ruled_out): file-name search plus count-only inspection found no consumer in this lineage and an explicit refusal in the runner; evidence=.skilled/commands/doctor, routing-accuracy/command-prompts.jsonl, .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:588
- iteration 4 secret_emission (ruled_out): the approvalFound helper returns a boolean and the report builds no hash field; evidence=.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs:184

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- None: this is the final iteration under `maxIterations: 5`. Synthesis follows. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
