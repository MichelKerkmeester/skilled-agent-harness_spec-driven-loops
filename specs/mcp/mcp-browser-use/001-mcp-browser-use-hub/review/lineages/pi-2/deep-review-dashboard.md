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
- Started: 2026-11-24T09:05:31.434Z
- Status: COMPLETE
- Iteration: 5 of 7
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-pi-2-1795511024070-2cuwlj
- Parent Session: 2026-11-24T09:03:35.256Z
- Lifecycle Mode: new
- Generation: 4
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
| P1 (Required) | 0 |
| P2 (Suggestions) | 4 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness: hub routing tables (mode-registry, hub-router, leaf manifests, SKILL/ROUTER clauses) against compiled front-door behaviour | correctness | 1.00 | 0/0/1 | complete |
| 2 | security: hub install/doctor mutation surfaces, the mutation-class guard, and the pre-commit comment-hygiene gate | security | 0.50 | 0/0/1 | complete |
| 3 | traceability: phase 015 and epic goal criteria against shipped evidence, advisor 2.0.3.0 claim to effect, checklist rows re-executed | traceability | 0.33 | 0/0/1 | complete |
| 4 | maintainability: hub doc consistency -- layout completeness, link integrity, version parity, changelog index and entry format, benchmark index | maintainability | 0.25 | 0/0/1 | complete |
| 5 | correctness: coverage graph reconciliation, hotspot saturation, registry citation integrity, stop-decision re-evaluation | correctness | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
| security | covered | 1 |
| traceability | covered | 1 |
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
- Last 3 ratios: 0.33 -> 0.25 -> 0.00
- convergenceScore: 1.00
- openFindings: 4
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
- candidateCoverage: covered=5, ruledOut=19, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 vocabulary_orphan (ruled_out): Every alias resolves to a class and no class is orphaned.; evidence=.skilled/skills/mcp-browser-use/hub-router.json:52-78, .skilled/skills/mcp-browser-use/mode-registry.json:36-112
- iteration 1 stale_compiled_policy (ruled_out): No drift between authored vocabulary and served policy.; evidence=.skilled/bin/compiled-route.cjs:29-52, .skilled/skills/mcp-browser-use/hub-router.json:117
- iteration 1 generated_manifest_drift (ruled_out): Manifest and stage-two map agree.; evidence=.skilled/skills/mcp-browser-use/leaf-manifest.json:1-40, .skilled/skills/mcp-browser-use/ROUTER.md:59-76
- iteration 1 capability_matrix_overstatement (ruled_out): Verified by direct read of the owning leaf.; evidence=.skilled/skills/mcp-browser-use/SKILL.md:43-44, .skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/mcp-parallel-instances/lighthouse-and-performance-trace.md:17-28
- iteration 2 secret_exposure (ruled_out): No credential literal present.; evidence=.utcp_config.json:2-6, .utcp_config.json:70-72
- iteration 2 privileged_execution (ruled_out): Only a printed suggestion matches.; evidence=.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:237
- iteration 2 readonly_label_misclassification (ruled_out): Bounded stdio handshake is inside the class's allowed set.; evidence=.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh:24-36, .skilled/skills/mcp-browser-use/mcp-aside-devtools/feature-catalog/feature-catalog.md:81, .skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/doctor.sh:53-77
- iteration 2 hook_gate_bypass (ruled_out): No bypass path present.; evidence=.skilled/scripts/git-hooks/pre-commit:224-248, .skilled/scripts/git-hooks/pre-commit:724-740
- iteration 3 goal_evidence_stale (ruled_out): Zero drift across 52 rows.; evidence=.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled--follow-up/results.csv:1
- iteration 3 version_mismatch (ruled_out): Shipped and documented.; evidence=.skilled/skills/system-skill-advisor/SKILL.md:5
- iteration 3 changelog_missing (ruled_out): No missing evidence found.; evidence=specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/015-fix-follow-up-review-findings/tasks.md:46-68
- iteration 4 layout_entry_stale (ruled_out): No stale entry.; evidence=.skilled/skills/mcp-browser-use/SKILL.md:80-99
- iteration 4 broken_link (ruled_out): Zero broken links.; evidence=.skilled/skills/mcp-browser-use/README.md:70-72
- iteration 4 index_incomplete_elsewhere (ruled_out): The gap is confined to README section 4.; evidence=.skilled/skills/mcp-browser-use/benchmark/reports/README.md:1
- iteration 5 citation_integrity (ruled_out): All citations resolve.; evidence=.skilled/skills/mcp-browser-use/README.md:66, .skilled/skills/mcp-browser-use/README.md:68
- iteration 5 gate_blocked_by_missing_artifact (ruled_out): Remaining gates are arithmetic.; evidence=specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review/lineages/pi-2/graph-db/deep-loop-graph.sqlite

### Clean Search Proof
- iteration 1 vocabulary_orphan (ruled_out): Every alias resolves to a class and no class is orphaned.; evidence=.skilled/skills/mcp-browser-use/hub-router.json:52-78, .skilled/skills/mcp-browser-use/mode-registry.json:36-112
- iteration 1 stale_compiled_policy (ruled_out): No drift between authored vocabulary and served policy.; evidence=.skilled/bin/compiled-route.cjs:29-52, .skilled/skills/mcp-browser-use/hub-router.json:117
- iteration 1 generated_manifest_drift (ruled_out): Manifest and stage-two map agree.; evidence=.skilled/skills/mcp-browser-use/leaf-manifest.json:1-40, .skilled/skills/mcp-browser-use/ROUTER.md:59-76
- iteration 1 capability_matrix_overstatement (ruled_out): Verified by direct read of the owning leaf.; evidence=.skilled/skills/mcp-browser-use/SKILL.md:43-44, .skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/mcp-parallel-instances/lighthouse-and-performance-trace.md:17-28
- iteration 2 secret_exposure (ruled_out): No credential literal present.; evidence=.utcp_config.json:2-6, .utcp_config.json:70-72
- iteration 2 privileged_execution (ruled_out): Only a printed suggestion matches.; evidence=.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:237
- iteration 2 readonly_label_misclassification (ruled_out): Bounded stdio handshake is inside the class's allowed set.; evidence=.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh:24-36, .skilled/skills/mcp-browser-use/mcp-aside-devtools/feature-catalog/feature-catalog.md:81, .skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/doctor.sh:53-77
- iteration 2 hook_gate_bypass (ruled_out): No bypass path present.; evidence=.skilled/scripts/git-hooks/pre-commit:224-248, .skilled/scripts/git-hooks/pre-commit:724-740
- iteration 3 goal_evidence_stale (ruled_out): Zero drift across 52 rows.; evidence=.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled--follow-up/results.csv:1
- iteration 3 version_mismatch (ruled_out): Shipped and documented.; evidence=.skilled/skills/system-skill-advisor/SKILL.md:5
- iteration 3 changelog_missing (ruled_out): No missing evidence found.; evidence=specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/015-fix-follow-up-review-findings/tasks.md:46-68
- iteration 4 layout_entry_stale (ruled_out): No stale entry.; evidence=.skilled/skills/mcp-browser-use/SKILL.md:80-99
- iteration 4 broken_link (ruled_out): Zero broken links.; evidence=.skilled/skills/mcp-browser-use/README.md:70-72
- iteration 4 index_incomplete_elsewhere (ruled_out): The gap is confined to README section 4.; evidence=.skilled/skills/mcp-browser-use/benchmark/reports/README.md:1
- iteration 5 citation_integrity (ruled_out): All citations resolve.; evidence=.skilled/skills/mcp-browser-use/README.md:66, .skilled/skills/mcp-browser-use/README.md:68
- iteration 5 gate_blocked_by_missing_artifact (ruled_out): Remaining gates are arithmetic.; evidence=specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review/lineages/pi-2/graph-db/deep-loop-graph.sqlite

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: maintainability and security, second pass - Focus area: the in-scope surfaces no iteration has opened yet -- the Chrome DevTools shared helper script, the hub `shared/` folder, the feature-catalog and playbook claims that assert counts, and the mode safety contracts the hub delegates to. - Reason: evidence density is the one thing this run can still improve honestly; the four findings are all documentation-level, and the unread half of the scope is where a behavioural defect would hide. - Required evidence: file:line for anything raised, and one command per asserted count. - Rotation status: D1 to D4 covered; this is depth, not rotation. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 4 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
