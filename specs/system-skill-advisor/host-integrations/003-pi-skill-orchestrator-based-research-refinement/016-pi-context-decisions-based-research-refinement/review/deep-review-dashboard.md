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
- Started: 2026-11-23T09:35:31.105Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: 2026-11-23T09:35:31.105Z
- Parent Session: 2026-11-23T05:51:03.170Z
- Lifecycle Mode: restart
- Generation: 3
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
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/1 | complete |
| 2 | security | security | 0.50 | 0/0/1 | complete |
| 3 | traceability | traceability | 0.60 | 0/0/3 | complete |
| 4 | maintainability | maintainability | 0.29 | 0/0/2 | complete |
| 5 | traceability (cross-dimension stabilization) | traceability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
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
- Last 3 ratios: 0.60 -> 0.29 -> 0.00
- convergenceScore: 1.00
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
- candidateCoverage: covered=7, ruledOut=15, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 error_handling (ruled_out): verified by read and passing test; evidence=.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:249, .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:296
- iteration 1 parser_parity (ruled_out): vitest pass and direct Python replay; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:478, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4559
- iteration 1 state_transition (ruled_out): verified by direct read and passing route-exclusions tests; evidence=.skilled/skills/system-skill-advisor/runtime/lib/route-exclusions.ts:94
- iteration 2 path_traversal (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:102, .skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:283
- iteration 2 redos (ruled_out): timing probe; evidence=.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:248
- iteration 2 env_leak (ruled_out): verified by set diff; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:254
- iteration 2 unsafe_delete (ruled_out): verified by direct read; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1792, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1417
- iteration 3 dangling_reference (ruled_out): cross-skill targets exist; line blamed 2026-11-13 before the epic; evidence=.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:31
- iteration 3 unreproducible_evidence (ruled_out): 028 validate failure is covered by its own Unmet AC-006; evidence=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/027-epic-review-fixes/acceptance-criteria.md:59, specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/goal.md:104
- iteration 4 comment_hygiene (ruled_out): grep hits are generic placeholders; evidence=.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:225
- iteration 4 untested_wiring (ruled_out): asserted by contract test; evidence=.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs:222, .skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs:243, .skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs:326
- iteration 5 checklist_evidence_gap (ruled_out): reproduced at HEAD; evidence=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/goal.md:104
- iteration 5 fix_regression (ruled_out): verified by direct read and grep; evidence=.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:251, .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:32, specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/028-second-epic-review-fixes/acceptance-criteria.md:55
- iteration 5 stale_probe_target (ruled_out): mtime ordering; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:408
- iteration 5 open_finding_recheck (ruled_out): findings confirmed and carried; no new finding; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:492, .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:408, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4582, .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:105, .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/pasted-reply-stripping.md:22, specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/spec.md:65, specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/012-plan-text-and-goal-closeout/graph-metadata.json:39, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4509

### Clean Search Proof
- iteration 1 error_handling (ruled_out): verified by read and passing test; evidence=.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:249, .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:296
- iteration 1 parser_parity (ruled_out): vitest pass and direct Python replay; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:478, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4559
- iteration 1 state_transition (ruled_out): verified by direct read and passing route-exclusions tests; evidence=.skilled/skills/system-skill-advisor/runtime/lib/route-exclusions.ts:94
- iteration 2 path_traversal (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:102, .skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:283
- iteration 2 redos (ruled_out): timing probe; evidence=.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:248
- iteration 2 env_leak (ruled_out): verified by set diff; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:254
- iteration 2 unsafe_delete (ruled_out): verified by direct read; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1792, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1417
- iteration 3 dangling_reference (ruled_out): cross-skill targets exist; line blamed 2026-11-13 before the epic; evidence=.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:31
- iteration 3 unreproducible_evidence (ruled_out): 028 validate failure is covered by its own Unmet AC-006; evidence=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/027-epic-review-fixes/acceptance-criteria.md:59, specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/goal.md:104
- iteration 4 comment_hygiene (ruled_out): grep hits are generic placeholders; evidence=.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:225
- iteration 4 untested_wiring (ruled_out): asserted by contract test; evidence=.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs:222, .skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs:243, .skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs:326
- iteration 4 oversized_module (not_applicable): file not in declared review scope; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:323
- iteration 5 checklist_evidence_gap (ruled_out): reproduced at HEAD; evidence=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/goal.md:104
- iteration 5 fix_regression (ruled_out): verified by direct read and grep; evidence=.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:251, .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:32, specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/028-second-epic-review-fixes/acceptance-criteria.md:55
- iteration 5 stale_probe_target (ruled_out): mtime ordering; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:408
- iteration 5 open_finding_recheck (ruled_out): findings confirmed and carried; no new finding; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:492, .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:408, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4582, .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:105, .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/pasted-reply-stripping.md:22, specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/spec.md:65, specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/012-plan-text-and-goal-closeout/graph-metadata.json:39, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4509

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none (iteration cap reached). Focus area: synthesis. - Reason: all four dimensions covered; core protocols spec_code and checklist_evidence pass; overlays feature_catalog_code and playbook_capability stay partial (advisory). - Rotation status: 4/4 dimensions covered. - Carry-forward: seven confirmed P2s; match by title plus file:line because of the id collision with generation 2. - Required evidence: none outstanding for the core gate. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 7 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
