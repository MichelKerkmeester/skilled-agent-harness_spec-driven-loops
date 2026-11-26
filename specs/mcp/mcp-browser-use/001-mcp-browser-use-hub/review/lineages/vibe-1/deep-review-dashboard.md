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
- Started: 2026-11-24T09:04:58.187Z
- Status: COMPLETE
- Iteration: 7 of 7
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-vibe-1-1795511024070-2cuwlj
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
| 3 | traceability | traceability | 0.42 | 0/0/0 | complete |
| 4 | maintainability | maintainability | 0.14 | 0/0/1 | complete |
| 5 | correctness | correctness | 0.36 | 0/1/0 | complete |
| 6 | traceability | traceability | 0.00 | 0/0/0 | complete |
| 7 | cross-reference | cross-reference | 0.07 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 4 |
| security | covered | 2 |
| traceability | covered | 0 |
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
- Last 3 ratios: 0.36 -> 0.00 -> 0.07
- convergenceScore: 0.93
- openFindings: 7
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
- candidateCoverage: covered=21, ruledOut=21, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): verified by direct read that prompt text never reaches the reject branch; evidence=.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:109
- iteration 1 boundary_handling (ruled_out): verified by direct read that discovery classes are never referenced by a routerSignal; evidence=.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs:97
- iteration 2 supply_chain (ruled_out): verified by direct read that the digest gate precedes execution; evidence=.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:94
- iteration 2 path_traversal (ruled_out): verified by direct read that the .. check runs before the prefix check; evidence=.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:35
- iteration 2 secret_exposure (ruled_out): verified by exact search that every capture site restricts output to names and domains; evidence=.skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/cdp-patterns.md:197
- iteration 3 missing_evidence (ruled_out): six of seven criteria verified against shipped evidence; the seventh is a lineage coverage limit, not a packet defect; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1
- iteration 3 stale_claim (ruled_out): every changelog claim checked against a shipped surface; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:110
- iteration 4 version_drift (ruled_out): every occurrence is honest recording inside the transcript, not a pin; evidence=.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md:341
- iteration 4 version_drift (ruled_out): each pin is single-valued across the packet; evidence=.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/README.md:21
- iteration 5 regression_in_fix (ruled_out): the fix holds on every form the fixture covers; evidence=.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:96
- iteration 5 stale_capability_claim (ruled_out): all eleven advisor probes match the changelog; evidence=.skilled/skills/system-skill-advisor/changelog/v2.0.3.0.md:1
- iteration 5 stale_capability_claim (ruled_out): the correction is complete and matches the Aside packet matrix; evidence=.skilled/skills/mcp-browser-use/SKILL.md:40
- iteration 6 mirror_drift (ruled_out): both mirrors are byte-identical to canonical; evidence=.claude/skills/mcp-browser-use/SKILL.md:5
- iteration 6 broken_cross_reference (ruled_out): every relative link resolves; evidence=.skilled/skills/mcp-browser-use/README.md:1
- iteration 6 phantom_command (ruled_out): no phantom command; evidence=.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md:34
- iteration 6 stage_vocabulary_drift (ruled_out): discovery classes are documented as defer evidence only, so the defer is the design working; evidence=.skilled/skills/mcp-browser-use/hub-router.json:1
- iteration 6 overclaiming_scenario (ruled_out): the scenario is capability-honest; evidence=.skilled/skills/mcp-browser-use/mcp-aside-devtools/manual-testing-playbook/devtools-parity/console-network-capture.md:33
- iteration 7 scope_widening (ruled_out): each packet states its own correct requirement, so the finding does not widen; evidence=.skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md:187
- iteration 7 merged_workstream (ruled_out): both are real defects but one edit fixes both, so they merge as a workstream rather than as a finding; evidence=.skilled/skills/mcp-browser-use/README.md:8
- iteration 7 undocumented_control (ruled_out): consent is gated everywhere; only the digest disclosure is missing; evidence=.skilled/skills/mcp-browser-use/mcp-aside-devtools/INSTALL-GUIDE.md:21

### Clean Search Proof
- iteration 1 state_transition (ruled_out): verified by direct read that prompt text never reaches the reject branch; evidence=.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:109
- iteration 1 boundary_handling (ruled_out): verified by direct read that discovery classes are never referenced by a routerSignal; evidence=.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs:97
- iteration 2 supply_chain (ruled_out): verified by direct read that the digest gate precedes execution; evidence=.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:94
- iteration 2 path_traversal (ruled_out): verified by direct read that the .. check runs before the prefix check; evidence=.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:35
- iteration 2 secret_exposure (ruled_out): verified by exact search that every capture site restricts output to names and domains; evidence=.skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/cdp-patterns.md:197
- iteration 3 missing_evidence (ruled_out): six of seven criteria verified against shipped evidence; the seventh is a lineage coverage limit, not a packet defect; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1
- iteration 3 stale_claim (ruled_out): every changelog claim checked against a shipped surface; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:110
- iteration 4 version_drift (ruled_out): every occurrence is honest recording inside the transcript, not a pin; evidence=.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md:341
- iteration 4 version_drift (ruled_out): each pin is single-valued across the packet; evidence=.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/README.md:21
- iteration 5 regression_in_fix (ruled_out): the fix holds on every form the fixture covers; evidence=.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:96
- iteration 5 stale_capability_claim (ruled_out): all eleven advisor probes match the changelog; evidence=.skilled/skills/system-skill-advisor/changelog/v2.0.3.0.md:1
- iteration 5 stale_capability_claim (ruled_out): the correction is complete and matches the Aside packet matrix; evidence=.skilled/skills/mcp-browser-use/SKILL.md:40
- iteration 6 mirror_drift (ruled_out): both mirrors are byte-identical to canonical; evidence=.claude/skills/mcp-browser-use/SKILL.md:5
- iteration 6 broken_cross_reference (ruled_out): every relative link resolves; evidence=.skilled/skills/mcp-browser-use/README.md:1
- iteration 6 phantom_command (ruled_out): no phantom command; evidence=.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md:34
- iteration 6 stage_vocabulary_drift (ruled_out): discovery classes are documented as defer evidence only, so the defer is the design working; evidence=.skilled/skills/mcp-browser-use/hub-router.json:1
- iteration 6 overclaiming_scenario (ruled_out): the scenario is capability-honest; evidence=.skilled/skills/mcp-browser-use/mcp-aside-devtools/manual-testing-playbook/devtools-parity/console-network-capture.md:33
- iteration 7 scope_widening (ruled_out): each packet states its own correct requirement, so the finding does not widen; evidence=.skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md:187
- iteration 7 merged_workstream (ruled_out): both are real defects but one edit fixes both, so they merge as a workstream rather than as a finding; evidence=.skilled/skills/mcp-browser-use/README.md:8
- iteration 7 undocumented_control (ruled_out): consent is gated everywhere; only the digest disclosure is missing; evidence=.skilled/skills/mcp-browser-use/mcp-aside-devtools/INSTALL-GUIDE.md:21

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining - Focus area: synthesis - Reason: iteration 7 of 7 is complete, every dimension has been covered at least once and the two that carried the most risk twice, and the last two iterations returned no new P1 or P0 - Rotation status: correctness twice, traceability twice, security once, maintainability once, cross-reference once; rotation complete - Blocked/productive carry-forward: productive -- the cross-reference pass found the one new P2 of this iteration by comparing a control that exists in code against the docs that never mention it - Required evidence: none for a further iteration; synthesis needs the six active findings, their merged workstreams, and the unverified criterion 7 Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
