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
- Review Target: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement (spec-folder)
- Started: 2026-11-23T05:51:03.170Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: FAIL
- Failed required gates at stop: coverage
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-11-23T05:51:03.170Z
- Parent Session: 2026-11-19T04:18:26.591Z
- Lifecycle Mode: restart
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
| P1 (Required) | 0 |
| P2 (Suggestions) | 6 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 0.00 | 0/0/0 | complete |
| 2 | security | security | 1.00 | 0/0/1 | complete |
| 3 | traceability | traceability | 0.75 | 0/0/3 | complete |
| 4 | maintainability | maintainability | 0.33 | 0/0/2 | complete |
| 5 | traceability stabilization: checklist_evidence closeout, recheck of six P2s, pasted-reply strip differential | traceability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 0 |
| security | covered | 1 |
| traceability | covered | 3 |
| maintainability | covered | 2 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 1.00
- graphDecision: STOP_ALLOWED
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.75 -> 0.33 -> 0.00
- convergenceScore: 1.00
- openFindings: 6
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
- candidateCoverage: covered=6, ruledOut=12, deferred=1, blocked=0

### Search Debt
- iteration 1 env_parity (deferred): carried to iteration 2; evidence=UNKNOWN

### Ruled-Out Candidates
- iteration 1 cross_runtime_drift (ruled_out): verified by read and test run; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:464, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4504
- iteration 1 stale_cache (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/route-exclusions.ts:94
- iteration 1 idempotence (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:267
- iteration 1 state_transition (ruled_out): verified by read and test; evidence=.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:75
- iteration 2 secret_env_leak (ruled_out): verified by direct read and drift test; evidence=.skilled/bin/system-skill-advisor-launcher.cjs:289, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:697, .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2787
- iteration 2 argv_disclosure (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:247, .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:279
- iteration 2 path_traversal_delete (ruled_out): verified by direct read; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1792-1854, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1873
- iteration 3 removed_feature_residue (ruled_out): grep shows only a scrub-list prefix; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1014
- iteration 4 mirror_drift (ruled_out): differential probe agreed on every prompt; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:475, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4595
- iteration 4 dead_code (ruled_out): registry holds only live lanes; validator checks per-weight range only; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:9
- iteration 4 comment_hygiene (ruled_out): hits are path-shape placeholders; evidence=.skilled/skills/system-skill-advisor/runtime/advisor-server.ts:103
- iteration 5 mirror_drift (ruled_out): differential probe agreed on all 14013 prompts; evidence=.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:243, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5029
- iteration 5 checklist_evidence_gap (ruled_out): the no-ship decision is recorded in the implementation summary; evidence=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/003-follow-up-routing-benchmark/tasks.md:70, specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/003-follow-up-routing-benchmark/implementation-summary.md:78

### Clean Search Proof
- iteration 1 cross_runtime_drift (ruled_out): verified by read and test run; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:464, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4504
- iteration 1 stale_cache (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/route-exclusions.ts:94
- iteration 1 idempotence (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:267
- iteration 1 state_transition (ruled_out): verified by read and test; evidence=.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:75
- iteration 2 secret_env_leak (ruled_out): verified by direct read and drift test; evidence=.skilled/bin/system-skill-advisor-launcher.cjs:289, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:697, .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2787
- iteration 2 argv_disclosure (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:247, .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:279
- iteration 2 path_traversal_delete (ruled_out): verified by direct read; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1792-1854, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1873
- iteration 3 removed_feature_residue (ruled_out): grep shows only a scrub-list prefix; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1014
- iteration 4 mirror_drift (ruled_out): differential probe agreed on every prompt; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:475, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4595
- iteration 4 dead_code (ruled_out): registry holds only live lanes; validator checks per-weight range only; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:9
- iteration 4 comment_hygiene (ruled_out): hits are path-shape placeholders; evidence=.skilled/skills/system-skill-advisor/runtime/advisor-server.ts:103
- iteration 5 mirror_drift (ruled_out): differential probe agreed on all 14013 prompts; evidence=.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:243, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5029
- iteration 5 checklist_evidence_gap (ruled_out): the no-ship decision is recorded in the implementation summary; evidence=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/003-follow-up-routing-benchmark/tasks.md:70, specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/003-follow-up-routing-benchmark/implementation-summary.md:78

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none, the rotation is complete (5 of 5 iterations). - Focus area: synthesis. Six P2s are active and no P0 or P1. - Reason: the iteration cap has been reached, and every carried finding was confirmed at HEAD. - Carry-forward: `checklist_evidence` final partial (AC-006); `feature_catalog_code` partial (R3-P2-002); the strip call-site parity check was not run. - Required evidence: none further for this run. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
