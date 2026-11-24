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
- Started: 2026-11-24T20:00:20Z
- Status: COMPLETE
- Iteration: 7 of 7
- Provisional Verdict: FAIL
- Failed required gates at stop: coverage
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-deepseek-max-1-1795550334883-gjbarh
- Parent Session: 2026-11-24T19:58:39.000Z
- Lifecycle Mode: new
- Generation: 8
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
| P2 (Suggestions) | 1 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/1 | complete |
| 2 | security | security | 0.00 | 0/0/0 | complete |
| 3 | traceability | traceability | 0.00 | 0/0/0 | complete |
| 4 | traceability | traceability | 0.00 | 0/0/0 | complete |
| 5 | traceability | traceability | 0.00 | 0/0/0 | complete |
| 6 | maintainability | maintainability | 0.00 | 0/0/0 | complete |
| 7 | cross-reference closing pass | traceability/maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
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
- openFindings: 1
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
- candidateCoverage: covered=16, ruledOut=20, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 served_head_ordering (ruled_out): The ordering ADR-005 requires is present on both paths.; evidence=.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:442, .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:570
- iteration 2 command_injection (ruled_out): No shell is used on any spawn site.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:285, .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:334
- iteration 2 prompt_disclosure (ruled_out): Neither path puts the prompt in argv.; evidence=.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:276, .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:300
- iteration 2 unbounded_input (ruled_out): Both the input length and the per-match scan are bounded.; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5230
- iteration 2 supplied_command_confusion (ruled_out): The check is an allowlist keyed on the owning skill.; evidence=.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489, .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1571
- iteration 3 document_claim_absent (ruled_out): Every presence claim matched in both named files.; evidence=.skilled/commands/deep/assets/deep-review-presentation.txt:1, .skilled/commands/deep/research.md:86
- iteration 3 probe_evidence_missing (ruled_out): The record holds every id checked, with the stated value.; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-final-958fa81-worktree.json:1
- iteration 3 requirement_unimplemented (ruled_out): The rules are built from lists, not from prompt literals.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:944, .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1147
- iteration 4 decision_not_implemented (ruled_out): Each decision names a symbol and a fixture column that exist and read as the decision says.; evidence=.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:442, .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:330
- iteration 4 requirement_symbol_missing (ruled_out): Both apparent misses were a wrong-file guess, not a missing symbol.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1074, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5141
- iteration 4 closure_doc_stale (ruled_out): The stale sentence is absent and the changelog states the built behaviour.; evidence=.skilled/changelog/skilled/v4.2.0.0.md:482, .skilled/changelog/skilled/v4.2.0.0.md:484
- iteration 5 ticked_task_missing_artifact (ruled_out): Every cited path resolves once the packet, runtime, skill, command and sibling roots are tried.; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:107
- iteration 5 acceptance_row_unevidenced (ruled_out): No row is met on assertion alone.; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:64
- iteration 5 status_outside_enum (ruled_out): The only fourth value is Unmet, which the packet documents as waiting on this run.; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:97
- iteration 6 comment_hygiene (ruled_out): The search found no identifier or spec path in any code comment.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1
- iteration 6 generated_artifact_drift (ruled_out): The generated contracts carry the lines the sources carry.; evidence=.skilled/commands/deep/assets/deep-review.yaml:664
- iteration 6 dead_code (ruled_out): No named symbol is defined without a call site.; evidence=.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2449
- iteration 6 duplicated_rule (ruled_out): Both programs apply the same two tests.; evidence=.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:406
- iteration 7 column_value_mismatch (ruled_out): All twelve row groups read as the requirements state.; evidence=.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:269, .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:359
- iteration 7 unaccounted_pattern (ruled_out): Compared plus named equals the compiled set, and the test asserts it.; evidence=.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:571, .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:699

### Clean Search Proof
- iteration 1 served_head_ordering (ruled_out): The ordering ADR-005 requires is present on both paths.; evidence=.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:442, .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:570
- iteration 2 command_injection (ruled_out): No shell is used on any spawn site.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:285, .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:334
- iteration 2 prompt_disclosure (ruled_out): Neither path puts the prompt in argv.; evidence=.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:276, .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:300
- iteration 2 unbounded_input (ruled_out): Both the input length and the per-match scan are bounded.; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5230
- iteration 2 supplied_command_confusion (ruled_out): The check is an allowlist keyed on the owning skill.; evidence=.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489, .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1571
- iteration 3 document_claim_absent (ruled_out): Every presence claim matched in both named files.; evidence=.skilled/commands/deep/assets/deep-review-presentation.txt:1, .skilled/commands/deep/research.md:86
- iteration 3 probe_evidence_missing (ruled_out): The record holds every id checked, with the stated value.; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-final-958fa81-worktree.json:1
- iteration 3 requirement_unimplemented (ruled_out): The rules are built from lists, not from prompt literals.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:944, .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1147
- iteration 4 decision_not_implemented (ruled_out): Each decision names a symbol and a fixture column that exist and read as the decision says.; evidence=.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:442, .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:330
- iteration 4 requirement_symbol_missing (ruled_out): Both apparent misses were a wrong-file guess, not a missing symbol.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1074, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5141
- iteration 4 closure_doc_stale (ruled_out): The stale sentence is absent and the changelog states the built behaviour.; evidence=.skilled/changelog/skilled/v4.2.0.0.md:482, .skilled/changelog/skilled/v4.2.0.0.md:484
- iteration 5 ticked_task_missing_artifact (ruled_out): Every cited path resolves once the packet, runtime, skill, command and sibling roots are tried.; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:107
- iteration 5 acceptance_row_unevidenced (ruled_out): No row is met on assertion alone.; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:64
- iteration 5 status_outside_enum (ruled_out): The only fourth value is Unmet, which the packet documents as waiting on this run.; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:97
- iteration 6 comment_hygiene (ruled_out): The search found no identifier or spec path in any code comment.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1
- iteration 6 generated_artifact_drift (ruled_out): The generated contracts carry the lines the sources carry.; evidence=.skilled/commands/deep/assets/deep-review.yaml:664
- iteration 6 dead_code (ruled_out): No named symbol is defined without a call site.; evidence=.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2449
- iteration 6 duplicated_rule (ruled_out): Both programs apply the same two tests.; evidence=.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:406
- iteration 7 column_value_mismatch (ruled_out): All twelve row groups read as the requirements state.; evidence=.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:269, .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:359
- iteration 7 unaccounted_pattern (ruled_out): Compared plus named equals the compiled set, and the test asserts it.; evidence=.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:571, .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:699

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none — the dimension queue is exhausted and all four dimensions have a full pass. Synthesis follows.
- Focus area: synthesis compiles the report, records the terminal gates, and settles the verdict from the registry.
- Reason: seven iterations are the configured cap (`stopPolicy: max-iterations`, `maxIterations: 7`).
- Rotation status: D1, D2, D3 and D4 all covered; every dimension has one full pass.
- Blocked/productive carry-forward: DR1-P2-001 is the one open finding and is a docs row, so it is a change a `/speckit:plan` follow-up can make without touching code.
- Required evidence: the terminal gates and the registry-derived verdict.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
