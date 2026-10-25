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
- Review Target: specs/sk-code/013-private-surface-skills (spec-folder)
- Started: 2026-10-25T17:20:00Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-deepseek-1792944728998-cwb2cp
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
| P1 (Required) | 4 |
| P2 (Suggestions) | 13 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/2 | complete |
| 2 | security | security | 1.00 | 0/0/1 | complete |
| 3 | traceability | traceability | 1.00 | 0/4/5 | complete |
| 4 | maintainability | maintainability | 1.00 | 0/0/3 | complete |
| 5 | completeness | completeness | 1.00 | 0/0/2 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 17 |
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
- Last 3 ratios: 1.00 -> 1.00 -> 1.00
- convergenceScore: 0.00
- openFindings: 17
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
- candidateCoverage: covered=14, ruledOut=7, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 tracked_path_leak (ruled_out): No private path is present and the walker cannot follow a directory symlink.; evidence=.skilled/skills/system-spec-kit/runtime/data/trigger-index.json, .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:287
- iteration 2 tracked_writer_leak (ruled_out): All tracked writers skip the name and the compiled graph is clean.; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py:203, .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:59, .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json
- iteration 2 containment_escape (ruled_out): Both implementations reject traversal, absolute results and a self-link.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts:21, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:155
- iteration 3 closure_row_drift (ruled_out): Only phases 002 and 003 carry unmet or contradictory rows.; evidence=specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/acceptance-criteria.md
- iteration 4 test-parity (ruled_out): Both implementations carry dedicated coverage.; evidence=.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2215
- iteration 5 waiver_without_adr (ruled_out): ADR-008 exists and explains the gap at ADR-007.; evidence=specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/decision-record.md:541
- iteration 5 cross_runtime_drift (ruled_out): Both mirrors carry the routing doctrine.; evidence=.claude/agents/code.md:95

### Clean Search Proof
- iteration 1 tracked_path_leak (ruled_out): No private path is present and the walker cannot follow a directory symlink.; evidence=.skilled/skills/system-spec-kit/runtime/data/trigger-index.json, .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:287
- iteration 2 tracked_writer_leak (ruled_out): All tracked writers skip the name and the compiled graph is clean.; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py:203, .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:59, .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json
- iteration 2 containment_escape (ruled_out): Both implementations reject traversal, absolute results and a self-link.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts:21, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:155
- iteration 3 closure_row_drift (ruled_out): Only phases 002 and 003 carry unmet or contradictory rows.; evidence=specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/acceptance-criteria.md
- iteration 4 test-parity (ruled_out): Both implementations carry dedicated coverage.; evidence=.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2215
- iteration 5 waiver_without_adr (ruled_out): ADR-008 exists and explains the gap at ADR-007.; evidence=specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/decision-record.md:541
- iteration 5 cross_runtime_drift (ruled_out): Both mirrors carry the routing doctrine.; evidence=.claude/agents/code.md:95

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 4 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
