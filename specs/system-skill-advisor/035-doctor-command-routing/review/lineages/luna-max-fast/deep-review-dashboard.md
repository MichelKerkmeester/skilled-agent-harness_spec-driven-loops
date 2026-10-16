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
- Review Target: specs/system-skill-advisor/035-doctor-command-routing (spec-folder)
- Started: 2026-10-16T04:51:56Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: fanout-luna-max-fast-1792125949812-grdnrc
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
| P1 (Required) | 0 |
| P2 (Suggestions) | 7 |
| Resolved | 1 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | advisor code correctness | correctness | 1.00 | 0/0/2 | complete |
| 2 | doctor command behavior and runtime mirrors | correctness/traceability | 0.33 | 0/0/3 | complete |
| 3 | advisor skill documentation, feature catalogs, and scenario side-effect claims | correctness/traceability/maintainability | 0.50 | 0/0/6 | complete |
| 4 | cross-repository doctor command inventories and README accuracy | correctness/traceability/maintainability | 0.14 | 0/0/7 | complete |
| 5 | release changelogs and final cross-check | correctness/traceability/maintainability | 0.14 | 0/0/7 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 7 |
| security | pending | 0 |
| traceability | covered | 0 |
| maintainability | covered | 0 |

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
- Last 3 ratios: 0.50 -> 0.14 -> 0.14
- convergenceScore: 0.86
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
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=12, ruledOut=10, deferred=0, blocked=1

### Search Debt
- iteration 2 doctor_probe_execution (blocked): Runtime probe intentionally not executed under the bound write-surface restriction.; evidence=.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs:152

### Ruled-Out Candidates
- iteration 1 generated_bridge_parity (ruled_out): No generator or generated-artifact mismatch was found by direct inspection; executable validation remains for a permitted validator pass.; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:180, .skilled/skills/system-skill-advisor/runtime/tests/doctor-command-bridges.vitest.ts:71
- iteration 1 UNKNOWN (ruled_out): No missing stress scenario was identified in the test source; implementation and executable test behavior were outside this iteration's permitted execution.; evidence=.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/single-writer-lease-stress.vitest.ts:35
- iteration 2 route_manifest_parity (ruled_out): The validator passed; its two warnings are informational duplicate flags on other targets.; evidence=.skilled/commands/doctor/_routes.yaml:292, .skilled/commands/doctor/assets/doctor-setup.yaml:49
- iteration 2 runtime_mirror_parity (ruled_out): The mirror validator passed and the wrapper bodies name the canonical source.; evidence=.skilled/commands/doctor/setup.md:1, .codex/prompts/doctor-setup.md:1, .hermes/prompts/doctor-setup.md:1
- iteration 3 doc_format_contract (ruled_out): No structural issue was found by the applicable single-file validators; the explicit backlink and missing-leaf requirements were evaluated separately and are recorded as findings.; evidence=.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:1, .skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:1
- iteration 4 doctor_command_list_alignment (ruled_out): No omission or route-name drift was found in the in-scope command lists.; evidence=README.md:1231-1235, .skilled/commands/README.txt:156-172, .skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:17-29
- iteration 4 cross_repo_reference_integrity (ruled_out): The cited path exists and no setup route was missing from the category overview.; evidence=.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:43-49
- iteration 5 warm_only_daemon_start (ruled_out): warm-only suppresses daemon spawning when the daemon is unavailable.; evidence=.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1342-1355
- iteration 5 changelog_format_contract (ruled_out): All three changelogs pass document validation and HVR has no hard blockers.; evidence=.skilled/skills/sk-doc/sk-create-changelog/SKILL.md, .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:123-150

### Clean Search Proof
- iteration 1 generated_bridge_parity (ruled_out): No generator or generated-artifact mismatch was found by direct inspection; executable validation remains for a permitted validator pass.; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:180, .skilled/skills/system-skill-advisor/runtime/tests/doctor-command-bridges.vitest.ts:71
- iteration 1 UNKNOWN (ruled_out): No missing stress scenario was identified in the test source; implementation and executable test behavior were outside this iteration's permitted execution.; evidence=.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/single-writer-lease-stress.vitest.ts:35
- iteration 2 route_manifest_parity (ruled_out): The validator passed; its two warnings are informational duplicate flags on other targets.; evidence=.skilled/commands/doctor/_routes.yaml:292, .skilled/commands/doctor/assets/doctor-setup.yaml:49
- iteration 2 runtime_mirror_parity (ruled_out): The mirror validator passed and the wrapper bodies name the canonical source.; evidence=.skilled/commands/doctor/setup.md:1, .codex/prompts/doctor-setup.md:1, .hermes/prompts/doctor-setup.md:1
- iteration 3 doc_format_contract (ruled_out): No structural issue was found by the applicable single-file validators; the explicit backlink and missing-leaf requirements were evaluated separately and are recorded as findings.; evidence=.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:1, .skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:1
- iteration 4 doctor_command_list_alignment (ruled_out): No omission or route-name drift was found in the in-scope command lists.; evidence=README.md:1231-1235, .skilled/commands/README.txt:156-172, .skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:17-29
- iteration 4 cross_repo_reference_integrity (ruled_out): The cited path exists and no setup route was missing from the category overview.; evidence=.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:43-49
- iteration 5 warm_only_daemon_start (ruled_out): warm-only suppresses daemon spawning when the daemon is unavailable.; evidence=.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1342-1355
- iteration 5 changelog_format_contract (ruled_out): All three changelogs pass document validation and HVR has no hard blockers.; evidence=.skilled/skills/sk-doc/sk-create-changelog/SKILL.md, .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:123-150

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
security

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
