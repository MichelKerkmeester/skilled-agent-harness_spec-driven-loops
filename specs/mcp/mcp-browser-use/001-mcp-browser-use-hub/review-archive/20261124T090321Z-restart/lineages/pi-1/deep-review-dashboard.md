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
- Started: 2026-11-24T07:09:56.019Z
- Status: COMPLETE
- Iteration: 5 of 7
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-pi-1-1795504079797-ay97sx
- Parent Session: 2026-11-24T07:07:48.877Z
- Lifecycle Mode: new
- Generation: 3
- continuedFromRun: none
- stopReason: converged

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
| P2 (Suggestions) | 5 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/1/1 | complete |
| 2 | security | security | 0.50 | 0/1/1 | complete |
| 3 | traceability | traceability | 0.08 | 0/0/1 | complete |
| 4 | maintainability | maintainability | 0.15 | 0/0/2 | complete |
| 5 | cross-reference | correctness/security/traceability/maintainability | 0.00 | 0/0/0 | complete |

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
- graphConvergenceScore: 1.00
- graphDecision: STOP_ALLOWED
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.08 -> 0.15 -> 0.00
- convergenceScore: 1.00
- openFindings: 7
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
- graphCoverageMode: graph
- candidateCoverage: covered=6, ruledOut=4, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): install.sh never replaces an existing install and doctor.sh verifies it; evidence=.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh:112
- iteration 1 config_precedence (ruled_out): the resolver binds the snapshot to the manifest's selected policy; evidence=.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:104
- iteration 2 config_precedence (ruled_out): the wrapper is never invoked by a workflow and the docs state the gate; evidence=.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:5
- iteration 2 error_handling (ruled_out): the example parses its own JSON envelope, never page text; evidence=.skilled/skills/mcp-browser-use/mcp-bladebro/examples/attach-read.sh:117
- iteration 3 state_transition (ruled_out): the exact search prints no match; evidence=.skilled/skills/mcp-tooling/mode-registry.json:1
- iteration 3 config_precedence (ruled_out): all three mode versions match their changelogs; evidence=.skilled/skills/mcp-browser-use/mcp-chrome-devtools/SKILL.md:5
- iteration 3 evidence_integrity (ruled_out): verdict and reason are recorded; evidence=.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/README.md:25

### Clean Search Proof
- iteration 1 state_transition (ruled_out): install.sh never replaces an existing install and doctor.sh verifies it; evidence=.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh:112
- iteration 1 config_precedence (ruled_out): the resolver binds the snapshot to the manifest's selected policy; evidence=.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:104
- iteration 2 config_precedence (ruled_out): the wrapper is never invoked by a workflow and the docs state the gate; evidence=.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:5
- iteration 2 error_handling (ruled_out): the example parses its own JSON envelope, never page text; evidence=.skilled/skills/mcp-browser-use/mcp-bladebro/examples/attach-read.sh:117
- iteration 3 state_transition (ruled_out): the exact search prints no match; evidence=.skilled/skills/mcp-tooling/mode-registry.json:1
- iteration 3 config_precedence (ruled_out): all three mode versions match their changelogs; evidence=.skilled/skills/mcp-browser-use/mcp-chrome-devtools/SKILL.md:5
- iteration 3 evidence_integrity (ruled_out): verdict and reason are recorded; evidence=.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/README.md:25

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: synthesis - Focus area: hand the seven findings, the six bug classes and the goal-criteria ledger to the report, and stop the loop. - Reason: every dimension is swept, the depth ledger is complete, and the last iteration added no new finding. - Rotation status: correctness, security, traceability, maintainability and cross-reference complete. - Blocked/productive carry-forward: productive — the re-read confirmed all seven findings against HEAD. - Required evidence: a stop decision from the convergence script and a complete synthesis record.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
