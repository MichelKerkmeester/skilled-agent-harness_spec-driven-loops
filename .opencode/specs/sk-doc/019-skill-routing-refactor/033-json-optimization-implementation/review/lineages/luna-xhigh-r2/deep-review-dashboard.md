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
- Review Target: .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation (spec-folder)
- Started: 2026-07-30T04:22:15.604Z
- Status: INITIALIZED
- Iteration: 5 of 4
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: fanout-luna-xhigh-r2-1785384990122-crx2xm
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
| P1 (Required) | 3 |
| P2 (Suggestions) | 4 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-001 | correctness | correctness | 1.00 | 0/2/1 | complete |
| run-002 | security | security | 0.08 | 0/0/1 | complete |
| run-003 | traceability | traceability | 0.33 | 0/1/1 | complete |
| run-003 | traceability | traceability | 0.33 | 0/1/1 | complete |
| run-004 | maintainability | maintainability | 0.05 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 3 |
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
- Last 3 ratios: 0.33 -> 0.33 -> 0.05
- convergenceScore: 0.95
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
- candidateCoverage: covered=8, ruledOut=11, deferred=0, blocked=1

### Search Debt
- iteration 4 stale_path_declarations (blocked): Prior security slice covered declared_scope_paths partial; this final slice preserved it as an edge case only.; evidence=.opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py:288

### Ruled-Out Candidates
- iteration 1 p0_correctness_blocker (ruled_out): Reviewed issues affect release/readiness truth, not immediate destructive behavior.; evidence=.opencode/skills/sk-code/sk-code-review/references/review-core.md:19
- iteration 2 shell_injection (ruled_out): List-form subprocess calls avoid shell interpretation for the reviewed inputs.; evidence=.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:676, .opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/score-routing-corpus.py:72
- iteration 2 path_traversal (ruled_out): Resolved skillDir outside workspaceRoot throws before write.; evidence=.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:71, .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:95, .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:98
- iteration 2 metadata_prompt_injection (ruled_out): Instruction and markup shaped values are filtered before returning a sanitized value.; evidence=.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sanitizer.ts:28, .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sanitizer.ts:37, .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sanitizer.ts:41, .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sanitizer.ts:48
- iteration 3 playbook_capability_gap (ruled_out): Root index and scenario pass criteria cover the integration surface.; evidence=.opencode/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md:34, .opencode/skills/sk-doc/manual-testing-playbook/compiled-routing/bundle-rules-compiled-routing.md:24, .opencode/skills/sk-doc/manual-testing-playbook/compiled-routing/bundle-rules-compiled-routing.md:61
- iteration 3 p0_traceability_blocker (ruled_out): No immediate destructive or exploitable path was evidenced.; evidence=.opencode/skills/sk-code/sk-code-review/references/review-core.md:19
- iteration 3 playbook_capability_gap (ruled_out): Root index and scenario pass criteria cover the integration surface.; evidence=.opencode/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md:34, .opencode/skills/sk-doc/manual-testing-playbook/compiled-routing/bundle-rules-compiled-routing.md:24, .opencode/skills/sk-doc/manual-testing-playbook/compiled-routing/bundle-rules-compiled-routing.md:61
- iteration 3 p0_traceability_blocker (ruled_out): No immediate destructive or exploitable path was evidenced.; evidence=.opencode/skills/sk-code/sk-code-review/references/review-core.md:19
- iteration 4 generated_projection_drift (ruled_out): No unbounded generated projection drift found in the sampled maintainability slice.; evidence=.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/aliases.ts:21, .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/aliases.ts:23, .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:4418, .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:4428
- iteration 4 review_artifact_noise (ruled_out): Narrative and JSON evidence cite source/spec lines, not older lineage outputs.; evidence=.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/review/lineages/luna-xhigh-r2/iterations/iteration-004.md:52
- iteration 4 p0_maintainability_blocker (ruled_out): No immediate destructive or exploitable path was evidenced.; evidence=.opencode/skills/sk-code/sk-code-review/references/review-core.md:19

### Clean Search Proof
- iteration 1 p0_correctness_blocker (ruled_out): Reviewed issues affect release/readiness truth, not immediate destructive behavior.; evidence=.opencode/skills/sk-code/sk-code-review/references/review-core.md:19
- iteration 2 shell_injection (ruled_out): List-form subprocess calls avoid shell interpretation for the reviewed inputs.; evidence=.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:676, .opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/score-routing-corpus.py:72
- iteration 2 path_traversal (ruled_out): Resolved skillDir outside workspaceRoot throws before write.; evidence=.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:71, .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:95, .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:98
- iteration 2 metadata_prompt_injection (ruled_out): Instruction and markup shaped values are filtered before returning a sanitized value.; evidence=.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sanitizer.ts:28, .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sanitizer.ts:37, .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sanitizer.ts:41, .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sanitizer.ts:48
- iteration 3 playbook_capability_gap (ruled_out): Root index and scenario pass criteria cover the integration surface.; evidence=.opencode/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md:34, .opencode/skills/sk-doc/manual-testing-playbook/compiled-routing/bundle-rules-compiled-routing.md:24, .opencode/skills/sk-doc/manual-testing-playbook/compiled-routing/bundle-rules-compiled-routing.md:61
- iteration 3 p0_traceability_blocker (ruled_out): No immediate destructive or exploitable path was evidenced.; evidence=.opencode/skills/sk-code/sk-code-review/references/review-core.md:19
- iteration 3 playbook_capability_gap (ruled_out): Root index and scenario pass criteria cover the integration surface.; evidence=.opencode/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md:34, .opencode/skills/sk-doc/manual-testing-playbook/compiled-routing/bundle-rules-compiled-routing.md:24, .opencode/skills/sk-doc/manual-testing-playbook/compiled-routing/bundle-rules-compiled-routing.md:61
- iteration 3 p0_traceability_blocker (ruled_out): No immediate destructive or exploitable path was evidenced.; evidence=.opencode/skills/sk-code/sk-code-review/references/review-core.md:19
- iteration 4 generated_projection_drift (ruled_out): No unbounded generated projection drift found in the sampled maintainability slice.; evidence=.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/aliases.ts:21, .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/aliases.ts:23, .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:4418, .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:4428
- iteration 4 review_artifact_noise (ruled_out): Narrative and JSON evidence cite source/spec lines, not older lineage outputs.; evidence=.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/review/lineages/luna-xhigh-r2/iterations/iteration-004.md:52
- iteration 4 p0_maintainability_blocker (ruled_out): No immediate destructive or exploitable path was evidenced.; evidence=.opencode/skills/sk-code/sk-code-review/references/review-core.md:19

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- dimension: none - focus area: synthesis/remediation planning - reason: final configured iteration complete; active P1s require remediation planning before promotion. - rotation status: terminal - blocked/productive carry-forward: do not rerun saturated correctness, security, traceability, or maintainability discovery except to verify remediation. - required evidence: use the accumulated finding details and registry state. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 3 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
