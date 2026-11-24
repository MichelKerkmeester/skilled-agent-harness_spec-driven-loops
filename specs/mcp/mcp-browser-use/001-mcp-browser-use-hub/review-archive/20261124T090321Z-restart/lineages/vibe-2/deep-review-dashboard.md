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
- Started: 2026-11-24T07:08:51.849Z
- Status: COMPLETE
- Iteration: 5 of 7
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-vibe-2-1795504079797-ay97sx
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
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
| P1 (Required) | 3 |
| P2 (Suggestions) | 6 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/1/1 | complete |
| 2 | security | security | 1.00 | 0/1/1 | complete |
| 3 | traceability | traceability | 1.00 | 0/0/3 | complete |
| 4 | maintainability | maintainability | 1.00 | 0/1/1 | complete |
| 5 | cross-reference | correctness/security/traceability/maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 2 |
| security | covered | 2 |
| traceability | covered | 3 |
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
- Last 3 ratios: 1.00 -> 1.00 -> 0.00
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
- candidateCoverage: covered=14, ruledOut=13, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): verified by direct read and by the parent-skill checker; evidence=.skilled/skills/mcp-browser-use/mode-registry.json:1-140, .skilled/commands/doctor/scripts/parent-skill-check.cjs
- iteration 1 incomplete_fix (ruled_out): verified by the commit diff; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:43-46
- iteration 2 supply_chain (ruled_out): verified by direct read and by the packet own rg criterion; evidence=.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:151-190, .skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:30
- iteration 2 credential_exposure (ruled_out): verified by direct read; evidence=.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/policy-card.cjs:22-52
- iteration 3 dropped_item (ruled_out): verified by direct read of tasks.md; evidence=specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/tasks.md:45-64
- iteration 3 stale_reference (ruled_out): verified by direct read; evidence=.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/results.csv, .skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/README.md
- iteration 4 dead_reference (ruled_out): verified by direct read after correcting the path form; evidence=.skilled/skills/mcp-browser-use/ROUTER.md:60-80, .skilled/skills/mcp-browser-use/leaf-manifest.json:1-40
- iteration 4 stale_prose (ruled_out): verified by direct read; evidence=.skilled/skills/mcp-browser-use/description.json:1-30, .skilled/skills/mcp-browser-use/mode-registry.json:1-140
- iteration 5 hash_drift (ruled_out): recomputation matched; evidence=.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json:1, .skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json:1
- iteration 5 mode_set_drift (ruled_out): 15 of 15 cases agree; evidence=.skilled/skills/mcp-browser-use/mode-registry.json:1-140, .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json:1-260
- iteration 5 cross_hub_leak (ruled_out): no browser pointer and six non-browser modes; evidence=.skilled/skills/mcp-tooling/hub-router.json, .skilled/skills/mcp-tooling/mode-registry.json:1-140
- iteration 5 stale_compiled_artifact (ruled_out): symlink resolves to the canonical hub; evidence=.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/harness/build-artifacts.cjs:39, .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/harness/build-artifacts.cjs:39
- iteration 5 stale_compiled_artifact (ruled_out): count matches and no listed file is missing; evidence=.skilled/bin/lib/compiled-routing/serving-closure.manifest.json:1-90, .skilled/bin/lib/compiled-routing/serving-closure.manifest.json:1-90

### Clean Search Proof
- iteration 1 state_transition (ruled_out): verified by direct read and by the parent-skill checker; evidence=.skilled/skills/mcp-browser-use/mode-registry.json:1-140, .skilled/commands/doctor/scripts/parent-skill-check.cjs
- iteration 1 incomplete_fix (ruled_out): verified by the commit diff; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:43-46
- iteration 2 supply_chain (ruled_out): verified by direct read and by the packet own rg criterion; evidence=.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:151-190, .skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:30
- iteration 2 credential_exposure (ruled_out): verified by direct read; evidence=.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/policy-card.cjs:22-52
- iteration 3 dropped_item (ruled_out): verified by direct read of tasks.md; evidence=specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/tasks.md:45-64
- iteration 3 stale_reference (ruled_out): verified by direct read; evidence=.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/results.csv, .skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/README.md
- iteration 4 dead_reference (ruled_out): verified by direct read after correcting the path form; evidence=.skilled/skills/mcp-browser-use/ROUTER.md:60-80, .skilled/skills/mcp-browser-use/leaf-manifest.json:1-40
- iteration 4 stale_prose (ruled_out): verified by direct read; evidence=.skilled/skills/mcp-browser-use/description.json:1-30, .skilled/skills/mcp-browser-use/mode-registry.json:1-140
- iteration 5 hash_drift (ruled_out): recomputation matched; evidence=.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json:1, .skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json:1
- iteration 5 mode_set_drift (ruled_out): 15 of 15 cases agree; evidence=.skilled/skills/mcp-browser-use/mode-registry.json:1-140, .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json:1-260
- iteration 5 cross_hub_leak (ruled_out): no browser pointer and six non-browser modes; evidence=.skilled/skills/mcp-tooling/hub-router.json, .skilled/skills/mcp-tooling/mode-registry.json:1-140
- iteration 5 stale_compiled_artifact (ruled_out): symlink resolves to the canonical hub; evidence=.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/harness/build-artifacts.cjs:39, .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/harness/build-artifacts.cjs:39
- iteration 5 stale_compiled_artifact (ruled_out): count matches and no listed file is missing; evidence=.skilled/bin/lib/compiled-routing/serving-closure.manifest.json:1-90, .skilled/bin/lib/compiled-routing/serving-closure.manifest.json:1-90

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: cross-reference (continued) - Focus area: the three mode packets' own cross-references — the Aside and Chrome DevTools playbooks against their recorded `results.csv` rows, and the Bladebro install guide against `install.sh` - Reason: the compiled-routing surface is now clean, and the remaining unexamined cross-reference is packet-internal evidence against recorded runs - Rotation status: all four configured dimensions complete; cross-reference pass one of two done - Blocked/productive carry-forward: `validate.sh --strict --recursive` stays blocked for this lineage - Required evidence: file:line citations from the pre-bound scope list Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 3 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
