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
- Started: 2026-11-24T04:45:27.415Z
- Status: COMPLETE
- Iteration: 7 of 7
- Provisional Verdict: FAIL
- Failed required gates at stop: coverage
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-opus-1-1795495435655-lf6jf3
- Parent Session: 2026-11-24T04:43:48.599Z
- Lifecycle Mode: new
- Generation: 2
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
| 1 | correctness: phase goal criteria re-run | correctness | 1.00 | 0/1/2 | complete |
| 2 | security: install, teardown, consent | security | 0.25 | 0/0/2 | complete |
| 3 | traceability: status claims vs shipped state | traceability | 0.17 | 0/0/2 | complete |
| 4 | maintainability: release history and shared helpers | maintainability | 0.07 | 0/0/1 | complete |
| 5 | correctness second pass: routing and recorded runs | correctness | 0.00 | 0/0/0 | complete |
| 6 | traceability overlay: mirrors, catalogs, playbooks, 010/012 | traceability | 0.06 | 0/0/1 | complete |
| 7 | security+maintainability closing sweep: Code Mode manuals, P1 re-read | security/maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 3 |
| security | covered | 2 |
| traceability | covered | 3 |
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
- Last 3 ratios: 0.00 -> 0.06 -> 0.00
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
- graphCoverageMode: graph
- candidateCoverage: covered=6, ruledOut=9, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 criterion_regression (ruled_out): verified by rg; evidence=.skilled/skills/mcp-tooling/mode-registry.json:1
- iteration 2 destructive_command (ruled_out): verified by direct read; evidence=.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/teardown/uninstall-and-data-root.md:48
- iteration 2 consent_bypass (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:623
- iteration 3 scope_creep (ruled_out): verified by direct read; evidence=specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/013-fix-alignment-findings-for-browser-hub-docs/spec.md:91
- iteration 4 version_mismatch (ruled_out): verified by checker; evidence=.skilled/skills/mcp-browser-use/SKILL.md:5
- iteration 5 routing_regression (ruled_out): verified by replay; evidence=.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:109
- iteration 5 evidence_tally_drift (ruled_out): verified by count; evidence=.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/results.csv:1
- iteration 6 stale_mirror_path (ruled_out): verified by rg; evidence=.skilled/commands/assets/local-doc-alignment/topics.json:286
- iteration 7 secret_exposure (ruled_out): verified by direct read; evidence=.utcp_config.json:1
- iteration 7 consent_bypass (ruled_out): verified by direct read; evidence=.skilled/skills/mcp-browser-use/mcp-chrome-devtools/SKILL.md:86

### Clean Search Proof
- iteration 1 criterion_regression (ruled_out): verified by rg; evidence=.skilled/skills/mcp-tooling/mode-registry.json:1
- iteration 2 destructive_command (ruled_out): verified by direct read; evidence=.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/teardown/uninstall-and-data-root.md:48
- iteration 2 consent_bypass (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:623
- iteration 3 scope_creep (ruled_out): verified by direct read; evidence=specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/013-fix-alignment-findings-for-browser-hub-docs/spec.md:91
- iteration 4 version_mismatch (ruled_out): verified by checker; evidence=.skilled/skills/mcp-browser-use/SKILL.md:5
- iteration 5 routing_regression (ruled_out): verified by replay; evidence=.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:109
- iteration 5 evidence_tally_drift (ruled_out): verified by count; evidence=.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/results.csv:1
- iteration 6 stale_mirror_path (ruled_out): verified by rg; evidence=.skilled/commands/assets/local-doc-alignment/topics.json:286
- iteration 7 secret_exposure (ruled_out): verified by direct read; evidence=.utcp_config.json:1
- iteration 7 consent_bypass (ruled_out): verified by direct read; evidence=.skilled/skills/mcp-browser-use/mcp-chrome-devtools/SKILL.md:86

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Synthesis. Carry O1-I1-P1-001 as the one required fix; seven P2 advisories. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
