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
- Started: 2026-10-25T16:18:48Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-luna-1792944728998-cwb2cp
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
| P1 (Required) | 1 |
| P2 (Suggestions) | 2 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/1/0 | complete |
| 2 | security | security | 0.17 | 0/1/1 | complete |
| 3 | traceability | traceability | 0.42 | 0/1/1 | complete |
| 4 | maintainability | maintainability | 0.14 | 0/1/2 | complete |
| 5 | maintainability | maintainability | 0.00 | 0/1/2 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
| security | covered | 1 |
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
- Last 3 ratios: 0.42 -> 0.14 -> 0.00
- convergenceScore: 1.00
- openFindings: 3
- persistentSameSeverity: 3
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 3

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=10, ruledOut=8, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 2 trusted_root_escape (ruled_out): Direct read shows canonical realpath plus path-relative containment in both runtimes.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts:21, .skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts:40, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:155, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:191
- iteration 3 evidence_reference_mismatch (ruled_out): Direct reads matched the phase 5 acceptance row summaries to cited evidence excerpts.; evidence=specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/acceptance-criteria.md:68, specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/acceptance-criteria.md:71, specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/11-final-tip.md:44, specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/14-corpus-boundary.md:87, specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/14-corpus-boundary.md:133
- iteration 4 cross_language_containment_drift (ruled_out): Direct source comparison found equivalent relative-path containment logic.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts:21, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:155
- iteration 5 private_scan_visibility (ruled_out): Direct source traces show the guard at the entry to each traversal or reader.; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:275, .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:278, .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:280, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1215, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1271, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:155, .skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts:197, .skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts:21
- iteration 5 hub_overlay_scope (ruled_out): The spec's frozen D1/D6 boundary excludes local skills from hub-surface documentation.; evidence=.skilled/skills/sk-code/feature-catalog/feature-catalog.md:15, .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:15, specs/sk-code/013-private-surface-skills/spec.md:62, specs/sk-code/013-private-surface-skills/spec.md:83

### Clean Search Proof
- iteration 2 trusted_root_escape (ruled_out): Direct read shows canonical realpath plus path-relative containment in both runtimes.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts:21, .skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts:40, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:155, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:191
- iteration 3 evidence_reference_mismatch (ruled_out): Direct reads matched the phase 5 acceptance row summaries to cited evidence excerpts.; evidence=specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/acceptance-criteria.md:68, specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/acceptance-criteria.md:71, specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/11-final-tip.md:44, specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/14-corpus-boundary.md:87, specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/14-corpus-boundary.md:133
- iteration 4 cross_language_containment_drift (ruled_out): Direct source comparison found equivalent relative-path containment logic.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts:21, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:155
- iteration 5 private_scan_visibility (ruled_out): Direct source traces show the guard at the entry to each traversal or reader.; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:275, .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:278, .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:280, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1215, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1271, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:155, .skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts:197, .skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts:21
- iteration 5 hub_overlay_scope (ruled_out): The spec's frozen D1/D6 boundary excludes local skills from hub-surface documentation.; evidence=.skilled/skills/sk-code/feature-catalog/feature-catalog.md:15, .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:15, specs/sk-code/013-private-surface-skills/spec.md:62, specs/sk-code/013-private-surface-skills/spec.md:83

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: synthesis - Focus area: consolidate active findings and record the max-iteration stop reason. - Reason: maxIterations is five; convergence remains telemetry and does not stop this run early. - Rotation status: complete - Blocked/productive carry-forward: graph and resource-map writes remain outside the lineage boundary; keep the scope conflict visible. - Required evidence: five iteration records, active registry, dashboard, and review report.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
