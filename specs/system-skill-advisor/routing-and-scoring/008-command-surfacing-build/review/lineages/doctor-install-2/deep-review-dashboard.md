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
- Review Target: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build (spec-folder)
- Started: 2026-11-13T12:40:00.000Z
- Status: COMPLETE
- Iteration: 6 of 7
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-doctor-install-2-1794570021136-noekp0
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
| P1 (Required) | 0 |
| P2 (Suggestions) | 5 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness/traceability | 1.00 | 0/0/1 | complete |
| 2 | correctness and traceability | correctness/traceability | 0.00 | 0/0/0 | complete |
| 3 | correctness and security | correctness/security | 0.50 | 0/0/1 | complete |
| 4 | traceability and maintainability | traceability/maintainability | 0.33 | 0/0/1 | complete |
| 5 | maintainability and traceability | maintainability/traceability | 0.40 | 0/0/2 | complete |
| 6 | final consistency pass | correctness/security/traceability/maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 2 |
| security | covered | 0 |
| traceability | covered | 3 |
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
- Last 3 ratios: 0.33 -> 0.40 -> 0.00
- convergenceScore: 1.00
- openFindings: 5
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
- candidateCoverage: covered=28, ruledOut=23, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 partial_write (ruled_out): write failure restores from the backup and exits 3; evidence=.skilled/commands/doctor/scripts/agents-md-embed.cjs:1425, .skilled/commands/doctor/scripts/agents-md-embed.cjs:1436
- iteration 1 proof_contract (ruled_out): the new foreign branch restores and exits 1, and the planted-foreign test passes; evidence=.skilled/commands/doctor/scripts/agents-md-embed.cjs:1377, .skilled/commands/doctor/scripts/agents-md-embed.cjs:1461
- iteration 1 symlink_write_target (ruled_out): compose refuses a symlink whose action would write; evidence=.skilled/commands/doctor/scripts/agents-md-embed.cjs:819
- iteration 2 false_clean_diagnostic (ruled_out): expectsAbsent precedes the symlink verdict; evidence=.skilled/commands/doctor/scripts/agents-md-check.cjs:713
- iteration 2 misleading_evidence (ruled_out): wording matches the condition proved; evidence=.skilled/commands/doctor/scripts/agents-md-check.cjs:740
- iteration 2 pointer_count (ruled_out): pointerMissing is subtracted and named; evidence=.skilled/commands/doctor/scripts/agents-md-check.cjs:650
- iteration 2 malformed_router_row (ruled_out): malformed rows are kept and reported; evidence=.skilled/commands/doctor/scripts/agents-md-check.cjs:824
- iteration 2 readme_child_count (ruled_out): the README says four children; evidence=.skilled/commands/doctor/scripts/README.markdown:102
- iteration 3 mention_as_wiring (ruled_out): descriptions are never read as commands; evidence=.skilled/commands/doctor/scripts/hook-wiring-check.cjs:114
- iteration 3 absent_repair_routing (ruled_out): absent entry prints the repair line; evidence=.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs:171
- iteration 3 symlink_exit_mapping (ruled_out): the exit map is complete; evidence=.skilled/commands/doctor/assets/doctor-symlink-check.yaml:69
- iteration 3 flag_value_swallow (ruled_out): flag-like values are refused; evidence=.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs:58
- iteration 4 runtime_list_count (ruled_out): the list matches the manifest; evidence=.skilled/commands/doctor/assets/doctor-install-presentation.txt:78
- iteration 4 embedder_host_binding (ruled_out): both steps bind OLLAMA_HOST and the refusal precedes them; evidence=.skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:125
- iteration 4 socket_mutation_boundary (ruled_out): both name the socket directory; evidence=.skilled/commands/doctor/assets/doctor-setup.yaml:28
- iteration 4 hook_health_message (ruled_out): the absent state is printed; evidence=.skilled/commands/doctor/assets/doctor-setup.yaml:61
- iteration 5 route_runtime_list (ruled_out): no route-level runtime mismatch; evidence=.skilled/commands/doctor/_routes.yaml:512
- iteration 5 command_summary_subset (ruled_out): the summary is a subset, not a false universal; evidence=.skilled/commands/doctor/agents-md.md:87
- iteration 5 shared_spec_create (ruled_out): no doctor route in the script; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:973
- iteration 6 pass_one_fix_replay (ruled_out): all pass-one fixes hold with test evidence; evidence=.skilled/commands/doctor/scripts/agents-md-embed.cjs:1425
- iteration 6 state_integrity (ruled_out): state is internally consistent; evidence=deep-review-findings-registry.json
- iteration 6 convergence_vote (ruled_out): legal STOP; evidence=deep-review-state.jsonl
- iteration 6 holdout_hygiene (ruled_out): not applicable to this area; evidence=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-scope.txt

### Clean Search Proof
- iteration 1 partial_write (ruled_out): write failure restores from the backup and exits 3; evidence=.skilled/commands/doctor/scripts/agents-md-embed.cjs:1425, .skilled/commands/doctor/scripts/agents-md-embed.cjs:1436
- iteration 1 proof_contract (ruled_out): the new foreign branch restores and exits 1, and the planted-foreign test passes; evidence=.skilled/commands/doctor/scripts/agents-md-embed.cjs:1377, .skilled/commands/doctor/scripts/agents-md-embed.cjs:1461
- iteration 1 symlink_write_target (ruled_out): compose refuses a symlink whose action would write; evidence=.skilled/commands/doctor/scripts/agents-md-embed.cjs:819
- iteration 2 false_clean_diagnostic (ruled_out): expectsAbsent precedes the symlink verdict; evidence=.skilled/commands/doctor/scripts/agents-md-check.cjs:713
- iteration 2 misleading_evidence (ruled_out): wording matches the condition proved; evidence=.skilled/commands/doctor/scripts/agents-md-check.cjs:740
- iteration 2 pointer_count (ruled_out): pointerMissing is subtracted and named; evidence=.skilled/commands/doctor/scripts/agents-md-check.cjs:650
- iteration 2 malformed_router_row (ruled_out): malformed rows are kept and reported; evidence=.skilled/commands/doctor/scripts/agents-md-check.cjs:824
- iteration 2 readme_child_count (ruled_out): the README says four children; evidence=.skilled/commands/doctor/scripts/README.markdown:102
- iteration 3 mention_as_wiring (ruled_out): descriptions are never read as commands; evidence=.skilled/commands/doctor/scripts/hook-wiring-check.cjs:114
- iteration 3 absent_repair_routing (ruled_out): absent entry prints the repair line; evidence=.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs:171
- iteration 3 symlink_exit_mapping (ruled_out): the exit map is complete; evidence=.skilled/commands/doctor/assets/doctor-symlink-check.yaml:69
- iteration 3 flag_value_swallow (ruled_out): flag-like values are refused; evidence=.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs:58
- iteration 4 runtime_list_count (ruled_out): the list matches the manifest; evidence=.skilled/commands/doctor/assets/doctor-install-presentation.txt:78
- iteration 4 embedder_host_binding (ruled_out): both steps bind OLLAMA_HOST and the refusal precedes them; evidence=.skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:125
- iteration 4 socket_mutation_boundary (ruled_out): both name the socket directory; evidence=.skilled/commands/doctor/assets/doctor-setup.yaml:28
- iteration 4 hook_health_message (ruled_out): the absent state is printed; evidence=.skilled/commands/doctor/assets/doctor-setup.yaml:61
- iteration 5 route_runtime_list (ruled_out): no route-level runtime mismatch; evidence=.skilled/commands/doctor/_routes.yaml:512
- iteration 5 command_summary_subset (ruled_out): the summary is a subset, not a false universal; evidence=.skilled/commands/doctor/agents-md.md:87
- iteration 5 shared_spec_create (ruled_out): no doctor route in the script; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:973
- iteration 6 pass_one_fix_replay (ruled_out): all pass-one fixes hold with test evidence; evidence=.skilled/commands/doctor/scripts/agents-md-embed.cjs:1425
- iteration 6 state_integrity (ruled_out): state is internally consistent; evidence=deep-review-findings-registry.json
- iteration 6 convergence_vote (ruled_out): legal STOP; evidence=deep-review-state.jsonl
- iteration 6 holdout_hygiene (ruled_out): not applicable to this area; evidence=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-scope.txt

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none; the loop converges here. - Focus area: synthesis of the five P2 findings into the lineage report. - Reason: all four dimensions have coverage, the last two ratios are 0.40 and 0.00, and the composite vote clears 0.60. - Rotation status: complete. - Blocked/productive carry-forward: none. - Required evidence: the synthesis report, the closeout events and the release-readiness state. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 5 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
