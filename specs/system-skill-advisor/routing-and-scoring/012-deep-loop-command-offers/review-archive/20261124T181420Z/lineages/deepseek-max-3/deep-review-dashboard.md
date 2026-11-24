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
- Review Target: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers (spec-folder)
- Started: 2026-11-24T11:16:55.033Z
- Status: COMPLETE
- Iteration: 7 of 7
- Provisional Verdict: FAIL
- Failed required gates at stop: coverage
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: fanout-deepseek-max-3-1795518961022-7ms9ak
- Parent Session: 2026-11-24T11:16:00.000Z
- Lifecycle Mode: new
- Generation: 5
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
| P2 (Suggestions) | 3 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | traceability: sixth fix round, REQ-023 to REQ-030 and AC-030 to AC-037 | traceability | 0.00 | 0/0/0 | complete |
| 2 | traceability: ninth fix round (REQ-031 to REQ-039) and every Met acceptance evidence cell | traceability | 1.00 | 0/0/2 | complete |
| 3 | traceability: first five fix rounds, REQ-001 to REQ-022 and AC-001 to AC-029 | traceability | 0.00 | 0/0/0 | complete |
| 4 | correctness: the two gate copies, with the traceability focus as the input | correctness | 1.00 | 0/0/1 | complete |
| 5 | security: trust boundary of the child-supplied command path, prompt cap and renderer | security | 0.00 | 0/0/0 | complete |
| 6 | maintainability and the four overlay traceability protocols | maintainability | 0.00 | 0/0/0 | complete |
| 7 | cross-reference and final coverage: packet status, acceptance coverage and state integrity | traceability/correctness/security/maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 3 |
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
- Last 3 ratios: 0.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 3
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
- candidateCoverage: covered=3, ruledOut=12, deferred=1, blocked=0

### Search Debt
- iteration 1 test_execution (deferred): test execution writes outside the lineage write surface; evidence=.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2875

### Ruled-Out Candidates
- iteration 1 spec_code_drift (ruled_out): read at the producer; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:581, .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:629, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4993
- iteration 1 checklist_evidence_drift (ruled_out): line and count verification; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:99, .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:129
- iteration 2 spec_code_drift (ruled_out): producer read for each requirement; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:330, .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:995
- iteration 3 spec_code_drift (ruled_out): captured evidence and cited files read; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json, specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/fresh-review-hook.txt:1
- iteration 5 command_injection (ruled_out): guards read at both hops; evidence=.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489, .skilled/skills/system-skill-advisor/runtime/lib/render.ts:163
- iteration 5 prompt_dos (ruled_out): cap and window read; evidence=.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5009
- iteration 5 secret_exposure (ruled_out): no credential read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:641
- iteration 6 comment_hygiene (ruled_out): scan found only the policy string; evidence=.skilled/skills/system-skill-advisor/runtime/lib/render.ts:131
- iteration 6 mirror_drift (ruled_out): body diff reviewed; evidence=.claude/agents/deep-review.md:5
- iteration 6 catalog_drift (ruled_out): no applicable claim; evidence=.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md:21
- iteration 7 status_contradiction (ruled_out): four-surface read; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:50
- iteration 7 waiver_backing (ruled_out): ADR existence checked; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33
- iteration 7 count_drift (ruled_out): boxes counted; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:309

### Clean Search Proof
- iteration 1 spec_code_drift (ruled_out): read at the producer; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:581, .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:629, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4993
- iteration 1 checklist_evidence_drift (ruled_out): line and count verification; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:99, .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:129
- iteration 2 spec_code_drift (ruled_out): producer read for each requirement; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:330, .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:995
- iteration 3 spec_code_drift (ruled_out): captured evidence and cited files read; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json, specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/fresh-review-hook.txt:1
- iteration 5 command_injection (ruled_out): guards read at both hops; evidence=.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489, .skilled/skills/system-skill-advisor/runtime/lib/render.ts:163
- iteration 5 prompt_dos (ruled_out): cap and window read; evidence=.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5009
- iteration 5 secret_exposure (ruled_out): no credential read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:641
- iteration 6 comment_hygiene (ruled_out): scan found only the policy string; evidence=.skilled/skills/system-skill-advisor/runtime/lib/render.ts:131
- iteration 6 mirror_drift (ruled_out): body diff reviewed; evidence=.claude/agents/deep-review.md:5
- iteration 6 catalog_drift (ruled_out): no applicable claim; evidence=.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md:21
- iteration 7 status_contradiction (ruled_out): four-surface read; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:50
- iteration 7 waiver_backing (ruled_out): ADR existence checked; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33
- iteration 7 count_drift (ruled_out): boxes counted; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:309

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining; synthesis follows. - Focus area: compile the report from the three active P2 advisories, state the coverage and the search debt, and derive the verdict from the refreshed registry. - Reason: the iteration cap is reached with every dimension covered. - Rotation status: all four dimensions complete; the cross-reference fallback is done. - Carry-forward: R2-P2-001, R2-P2-002 and R4-P2-001 enter synthesis as active advisories; the one deferred test-execution row enters as search debt. - Required evidence: the refreshed registry counts, the merged verdict inputs, the stop reason `maxIterationsReached` and the report's nine sections. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
