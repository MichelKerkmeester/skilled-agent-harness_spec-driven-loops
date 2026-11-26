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
- Review Target: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub (spec-folder)
- Started: 2026-11-24T09:05:15Z
- Status: COMPLETE
- Iteration: 7 of 7
- Provisional Verdict: FAIL
- Failed required gates at stop: coverage
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-pi-1-1795511024070-2cuwlj
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
| P2 (Suggestions) | 8 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/3 | complete |
| 2 | correctness | correctness | 1.00 | 0/0/2 | complete |
| 3 | security | security | 1.00 | 0/1/0 | complete |
| 4 | traceability | traceability | 1.00 | 0/0/2 | complete |
| 5 | maintainability | maintainability | 1.00 | 0/0/1 | complete |
| 6 | maintainability | maintainability | 0.00 | 0/0/0 | complete |
| 7 | traceability | traceability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 5 |
| security | covered | 1 |
| traceability | covered | 2 |
| maintainability | covered | 1 |

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
- Last 3 ratios: 1.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 9
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
- candidateCoverage: covered=10, ruledOut=10, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 injection (ruled_out): bash does not re-expand the result of a parameter expansion; the single-quote and backslash guard covers the JS string boundary the script claims; evidence=.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:38
- iteration 2 contract_drift (ruled_out): observed hash equality at generation 1; evidence=.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json:1
- iteration 2 contract_drift (ruled_out): symlinked root, identical bytes; evidence=.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/harness/build-artifacts.cjs:39
- iteration 3 secret_exposure (ruled_out): all provider credentials are ${VAR} interpolations; evidence=.utcp_config.json:130
- iteration 3 injection (ruled_out): lifecycle scripts stay off and digests are verified before any use; evidence=.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:151
- iteration 3 guard_bypass (ruled_out): each mode has an explicit row; evidence=.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:61
- iteration 4 contract_drift (ruled_out): both artifacts present as stated; evidence=.skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/feature-catalog.md:243
- iteration 4 contract_drift (ruled_out): direct read contradicted the tool output; evidence=.skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md:1
- iteration 5 index_integrity (ruled_out): no dangling row; evidence=.skilled/skills/mcp-browser-use/benchmark/reports/README.md:24
- iteration 5 doc_drift (ruled_out): contract-legal shape; evidence=.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:92
- iteration 5 index_integrity (ruled_out): counts agree; evidence=.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled--follow-up/results.csv:1
- iteration 6 doc_drift (ruled_out): wrong base directory in the first test; files exist; evidence=.skilled/skills/mcp-browser-use/mcp-aside-devtools/ROUTER.md:60
- iteration 6 doc_drift (ruled_out): intentional unreferenced class; evidence=.skilled/skills/mcp-browser-use/hub-router.json:70
- iteration 6 placeholder_shipping (ruled_out): no placeholder text; evidence=.skilled/skills/mcp-browser-use/mcp-bladebro/examples/run-step-plan.sh:57
- iteration 6 doc_drift (ruled_out): P1 remains active and is carried, not re-raised; evidence=.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/doctor.sh:36
- iteration 7 regression (ruled_out): no flip between pass and fail; evidence=.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled--follow-up/results.csv:1
- iteration 7 claim_mismatch (ruled_out): artifact agrees; evidence=.skilled/skills/system-skill-advisor/changelog/v2.0.3.0.md:44
- iteration 7 claim_mismatch (ruled_out): P1 remains active; evidence=.skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md:75

### Clean Search Proof
- iteration 1 injection (ruled_out): bash does not re-expand the result of a parameter expansion; the single-quote and backslash guard covers the JS string boundary the script claims; evidence=.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:38
- iteration 2 contract_drift (ruled_out): observed hash equality at generation 1; evidence=.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json:1
- iteration 2 contract_drift (ruled_out): symlinked root, identical bytes; evidence=.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/harness/build-artifacts.cjs:39
- iteration 3 secret_exposure (ruled_out): all provider credentials are ${VAR} interpolations; evidence=.utcp_config.json:130
- iteration 3 injection (ruled_out): lifecycle scripts stay off and digests are verified before any use; evidence=.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:151
- iteration 3 guard_bypass (ruled_out): each mode has an explicit row; evidence=.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:61
- iteration 4 contract_drift (ruled_out): both artifacts present as stated; evidence=.skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/feature-catalog.md:243
- iteration 4 contract_drift (ruled_out): direct read contradicted the tool output; evidence=.skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md:1
- iteration 5 index_integrity (ruled_out): no dangling row; evidence=.skilled/skills/mcp-browser-use/benchmark/reports/README.md:24
- iteration 5 doc_drift (ruled_out): contract-legal shape; evidence=.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:92
- iteration 5 index_integrity (ruled_out): counts agree; evidence=.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled--follow-up/results.csv:1
- iteration 6 doc_drift (ruled_out): wrong base directory in the first test; files exist; evidence=.skilled/skills/mcp-browser-use/mcp-aside-devtools/ROUTER.md:60
- iteration 6 doc_drift (ruled_out): intentional unreferenced class; evidence=.skilled/skills/mcp-browser-use/hub-router.json:70
- iteration 6 placeholder_shipping (ruled_out): no placeholder text; evidence=.skilled/skills/mcp-browser-use/mcp-bladebro/examples/run-step-plan.sh:57
- iteration 6 doc_drift (ruled_out): P1 remains active and is carried, not re-raised; evidence=.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/doctor.sh:36
- iteration 7 regression (ruled_out): no flip between pass and fail; evidence=.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled--follow-up/results.csv:1
- iteration 7 claim_mismatch (ruled_out): artifact agrees; evidence=.skilled/skills/system-skill-advisor/changelog/v2.0.3.0.md:44
- iteration 7 claim_mismatch (ruled_out): P1 remains active; evidence=.skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md:75

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Loop ends at the iteration cap. Synthesis consolidates six finding rows (one P1, eight P2) and the four traceability protocol statuses. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
