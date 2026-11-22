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
- Started: 2026-11-21T22:09:31Z
- Status: INITIALIZED
- Iteration: 3 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-vibe-1795298930568-k8qdqy
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
| P1 (Required) | 2 |
| P2 (Suggestions) | 8 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/2/3 | complete |
| 2 | security | security | 1.00 | 0/1/2 | complete |
| 3 | traceability | traceability | 0.83 | 0/0/3 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 5 |
| security | covered | 3 |
| traceability | covered | 2 |
| maintainability | pending | 0 |

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
- Last 3 ratios: 1.00 -> 1.00 -> 0.83
- convergenceScore: 0.17
- openFindings: 10
- persistentSameSeverity: 0
- severityChanged: 1
- repeatedFindings (deprecated combined bucket): 1

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=9, ruledOut=4, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): Unreachable with the current all-actor mode set; recorded as P2 hardening instead of an active defect.; evidence=.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs:128
- iteration 1 contract_mismatch (ruled_out): Every reachable tie set has a compiled rule, so exactBundle cannot return null.; evidence=.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs:139
- iteration 2 authorization (ruled_out): The packet restates the R-SEC-1 prohibition exactly.; evidence=.skilled/skills/mcp-browser-use/mcp-aside-devtools/references/aside-cli-reference.md:95
- iteration 2 authorization (ruled_out): approverDestinationId always equals toDestinationId.; evidence=.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs:246
- iteration 3 missing_artifact (ruled_out): Both sweeps and the two extra metadata files print no match.; evidence=.skilled/skills/mcp-tooling/mode-registry.json:1

### Clean Search Proof
- iteration 1 state_transition (ruled_out): Unreachable with the current all-actor mode set; recorded as P2 hardening instead of an active defect.; evidence=.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs:128
- iteration 1 contract_mismatch (ruled_out): Every reachable tie set has a compiled rule, so exactBundle cannot return null.; evidence=.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs:139
- iteration 2 authorization (ruled_out): The packet restates the R-SEC-1 prohibition exactly.; evidence=.skilled/skills/mcp-browser-use/mcp-aside-devtools/references/aside-cli-reference.md:95
- iteration 2 authorization (ruled_out): approverDestinationId always equals toDestinationId.; evidence=.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs:246
- iteration 3 missing_artifact (ruled_out): Both sweeps and the two extra metadata files print no match.; evidence=.skilled/skills/mcp-tooling/mode-registry.json:1

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: maintainability - Focus area: the hub's `SKILL.md`, `ROUTER.md`, `README.md` and `graph-metadata.json` for pattern compliance against the `mcp-tooling` template; the three mode packets' `ROUTER.md` and `description.json`; and the `benchmark/reports/README.md` indexes - Reason: traceability is complete; maintainability is the last canonical dimension and the hub's documentation set is the largest unreviewed surface in scope - Rotation status: first pass on maintainability - Blocked/productive carry-forward: re-executing both routing stages was productive for traceability; do not re-derive the stale-hash root cause, which is already `R1-P1-002` - Required evidence: file:line for every pattern deviation and every documentation gap Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
