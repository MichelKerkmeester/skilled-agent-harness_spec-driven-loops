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
- Review Target: .skilled/skills/cli-orca (skill)
- Started: 2026-09-20T12:27:04Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-09-20T12:27:04Z
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
| P1 (Required) | 1 |
| P2 (Suggestions) | 6 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 0.38 | 0/1/2 | complete |
| 2 | security | security | 0.17 | 0/0/1 | complete |
| 3 | traceability | traceability | 0.40 | 0/0/2 | complete |
| 4 | maintainability | maintainability | 0.14 | 0/0/1 | complete |
| 5 | correctness | correctness | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 7 |
| security | covered | 0 |
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
- Last 3 ratios: 0.40 -> 0.14 -> 0.00
- convergenceScore: 1.00
- openFindings: 7
- persistentSameSeverity: 1
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 1

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=5, ruledOut=18, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 byte_integrity (ruled_out): byte-identical on all three legs; evidence=.skilled/skills/cli-orca/assets/PROVENANCE.md:50, .skilled/skills/cli-orca/assets/PROVENANCE.md:57
- iteration 1 stale_reference (ruled_out): all hits inside the REQ-003 carve-out; evidence=.skilled/skills/mcp-tooling/changelog/v1.8.0.0.md:18
- iteration 1 dead_path (ruled_out): upstream guide section names; evidence=.skilled/skills/cli-orca/references/orca-skills/orca-cli.md:41
- iteration 1 config_consistency (ruled_out): no malformed config or script in scope; evidence=.skilled/skills/system-skill-advisor/runtime/lib/routing/route-exclusions.ts:12
- iteration 1 cross_runtime_drift (ruled_out): single source via symlink; evidence=.skilled/skills/cli-orca/SKILL.md:1
- iteration 2 secret_exposure (ruled_out): verified by acceptance-command replay plus direct read; evidence=specs/cli-orca/002-consolidate-official-orca-skills/acceptance-criteria.md:54, specs/cli-orca/002-consolidate-official-orca-skills/context/orca-main/mobile/google-services.json:23, .skilled/skills/cli-orca/assets/PROVENANCE.md:50
- iteration 2 credential_leak (ruled_out): doctrine present and consistent; evidence=.skilled/skills/cli-orca/references/mutation-and-browser-boundaries.md:110, .skilled/skills/cli-orca/SKILL.md:265, .skilled/skills/cli-orca/references/troubleshooting.md:25
- iteration 2 prompt_injection (ruled_out): contract verified and corpus clean; evidence=.skilled/skills/cli-orca/references/mutation-and-browser-boundaries.md:100, .skilled/skills/cli-orca/SKILL.md:264
- iteration 2 command_injection (ruled_out): exec surfaces bounded to fixed-command list-form calls; evidence=.skilled/bin/skill-advisor.cjs:105, .skilled/bin/skill-advisor.cjs:91, .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:336, .skilled/skills/sk-doc/scripts/validate_skill_package.py:40
- iteration 2 authority_bypass (ruled_out): four-document consistency check passed; evidence=.skilled/skills/cli-orca/references/mutation-and-browser-boundaries.md:62, .skilled/skills/cli-orca/references/troubleshooting.md:43, .skilled/skills/cli-orca/feature-catalog/safety/mutation-and-ownership-boundaries.md:29, .skilled/skills/cli-orca/references/orca-cli-reference.md:197
- iteration 3 cross_runtime_drift (ruled_out): verified by recursive byte comparison; evidence=.pi/skills/cli-orca
- iteration 3 stale_reference (ruled_out): byte comparison plus link graph both clean; evidence=.skilled/skills/cli-orca/assets/PROVENANCE.md, .skilled/skills/cli-orca/feature-catalog/feature-catalog.md
- iteration 3 missing_evidence (ruled_out): ledger and verdict-line contract observed intact; evidence=specs/cli-orca/002-consolidate-official-orca-skills/review/iterations/iteration-002.md
- iteration 4 stale_generated_metadata (ruled_out): false positives: bare name fields and keyword phrases, verified against find output; evidence=.skilled/skills/cli-orca/graph-metadata.json:88-117, .skilled/skills/system-skill-advisor/graph-metadata.json:103-143, .skilled/skills/mcp-tooling/graph-metadata.json:198-201
- iteration 4 comment_hygiene_violation (ruled_out): clean across all scoped scripts; evidence=.skilled/bin/compiled-route-status.cjs, .skilled/skills/sk-doc/scripts/validate_skill_package.py
- iteration 4 script_copy_paste (ruled_out): helpers already extracted to shared lib modules; evidence=.skilled/bin/compiled-route-status.cjs:41,44
- iteration 4 version_drift (ruled_out): versions consistent; evidence=.skilled/skills/cli-orca/SKILL.md:14, .skilled/skills/cli-orca/README.md:10, .skilled/skills/cli-orca/changelog/v0.1.0.0.md:1
- iteration 4 snapshot_maintenance_gap (ruled_out): refresh procedure documented and digest-pinned; evidence=.skilled/skills/cli-orca/assets/PROVENANCE.md:48, .skilled/skills/cli-orca/assets/PROVENANCE.md:76
- iteration 5 false_negative_routing (ruled_out): defer/fallback paths present for every foreign phrase in the when-NOT table; no owner escapes to an Orca lane; evidence=.skilled/skills/cli-orca/SKILL.md:159-161, .skilled/skills/cli-orca/SKILL.md:119-123
- iteration 5 authority_bypass (ruled_out): guard covers path escape, suffix and registration on all branches; evidence=.skilled/skills/cli-orca/SKILL.md:134-140, .skilled/skills/cli-orca/SKILL.md:163-166
- iteration 5 coverage_gap (ruled_out): no NEW coverage gap this pass; the observed gaps are already recorded as P2-002/P2-005 and applied/T-*.md remains absent; evidence=specs/cli-orca/002-consolidate-official-orca-skills/resource-map.md:62-65, specs/cli-orca/002-consolidate-official-orca-skills/applied/

### Clean Search Proof
- iteration 1 byte_integrity (ruled_out): byte-identical on all three legs; evidence=.skilled/skills/cli-orca/assets/PROVENANCE.md:50, .skilled/skills/cli-orca/assets/PROVENANCE.md:57
- iteration 1 stale_reference (ruled_out): all hits inside the REQ-003 carve-out; evidence=.skilled/skills/mcp-tooling/changelog/v1.8.0.0.md:18
- iteration 1 dead_path (ruled_out): upstream guide section names; evidence=.skilled/skills/cli-orca/references/orca-skills/orca-cli.md:41
- iteration 1 config_consistency (ruled_out): no malformed config or script in scope; evidence=.skilled/skills/system-skill-advisor/runtime/lib/routing/route-exclusions.ts:12
- iteration 1 cross_runtime_drift (ruled_out): single source via symlink; evidence=.skilled/skills/cli-orca/SKILL.md:1
- iteration 2 secret_exposure (ruled_out): verified by acceptance-command replay plus direct read; evidence=specs/cli-orca/002-consolidate-official-orca-skills/acceptance-criteria.md:54, specs/cli-orca/002-consolidate-official-orca-skills/context/orca-main/mobile/google-services.json:23, .skilled/skills/cli-orca/assets/PROVENANCE.md:50
- iteration 2 credential_leak (ruled_out): doctrine present and consistent; evidence=.skilled/skills/cli-orca/references/mutation-and-browser-boundaries.md:110, .skilled/skills/cli-orca/SKILL.md:265, .skilled/skills/cli-orca/references/troubleshooting.md:25
- iteration 2 prompt_injection (ruled_out): contract verified and corpus clean; evidence=.skilled/skills/cli-orca/references/mutation-and-browser-boundaries.md:100, .skilled/skills/cli-orca/SKILL.md:264
- iteration 2 command_injection (ruled_out): exec surfaces bounded to fixed-command list-form calls; evidence=.skilled/bin/skill-advisor.cjs:105, .skilled/bin/skill-advisor.cjs:91, .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:336, .skilled/skills/sk-doc/scripts/validate_skill_package.py:40
- iteration 2 authority_bypass (ruled_out): four-document consistency check passed; evidence=.skilled/skills/cli-orca/references/mutation-and-browser-boundaries.md:62, .skilled/skills/cli-orca/references/troubleshooting.md:43, .skilled/skills/cli-orca/feature-catalog/safety/mutation-and-ownership-boundaries.md:29, .skilled/skills/cli-orca/references/orca-cli-reference.md:197
- iteration 3 cross_runtime_drift (ruled_out): verified by recursive byte comparison; evidence=.pi/skills/cli-orca
- iteration 3 stale_reference (ruled_out): byte comparison plus link graph both clean; evidence=.skilled/skills/cli-orca/assets/PROVENANCE.md, .skilled/skills/cli-orca/feature-catalog/feature-catalog.md
- iteration 3 missing_evidence (ruled_out): ledger and verdict-line contract observed intact; evidence=specs/cli-orca/002-consolidate-official-orca-skills/review/iterations/iteration-002.md
- iteration 4 stale_generated_metadata (ruled_out): false positives: bare name fields and keyword phrases, verified against find output; evidence=.skilled/skills/cli-orca/graph-metadata.json:88-117, .skilled/skills/system-skill-advisor/graph-metadata.json:103-143, .skilled/skills/mcp-tooling/graph-metadata.json:198-201
- iteration 4 comment_hygiene_violation (ruled_out): clean across all scoped scripts; evidence=.skilled/bin/compiled-route-status.cjs, .skilled/skills/sk-doc/scripts/validate_skill_package.py
- iteration 4 script_copy_paste (ruled_out): helpers already extracted to shared lib modules; evidence=.skilled/bin/compiled-route-status.cjs:41,44
- iteration 4 version_drift (ruled_out): versions consistent; evidence=.skilled/skills/cli-orca/SKILL.md:14, .skilled/skills/cli-orca/README.md:10, .skilled/skills/cli-orca/changelog/v0.1.0.0.md:1
- iteration 4 snapshot_maintenance_gap (ruled_out): refresh procedure documented and digest-pinned; evidence=.skilled/skills/cli-orca/assets/PROVENANCE.md:48, .skilled/skills/cli-orca/assets/PROVENANCE.md:76
- iteration 5 false_negative_routing (ruled_out): defer/fallback paths present for every foreign phrase in the when-NOT table; no owner escapes to an Orca lane; evidence=.skilled/skills/cli-orca/SKILL.md:159-161, .skilled/skills/cli-orca/SKILL.md:119-123
- iteration 5 authority_bypass (ruled_out): guard covers path escape, suffix and registration on all branches; evidence=.skilled/skills/cli-orca/SKILL.md:134-140, .skilled/skills/cli-orca/SKILL.md:163-166
- iteration 5 coverage_gap (ruled_out): no NEW coverage gap this pass; the observed gaps are already recorded as P2-002/P2-005 and applied/T-*.md remains absent; evidence=specs/cli-orca/002-consolidate-official-orca-skills/resource-map.md:62-65, specs/cli-orca/002-consolidate-official-orca-skills/applied/

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
