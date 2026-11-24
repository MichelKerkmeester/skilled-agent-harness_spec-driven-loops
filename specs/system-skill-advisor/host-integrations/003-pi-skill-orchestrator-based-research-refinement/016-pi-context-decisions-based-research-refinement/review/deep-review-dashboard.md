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
- Review Target: .skilled/skills/system-skill-advisor (skill)
- Started: 2026-11-23T21:41:17.101Z
- Status: COMPLETE
- Iteration: 11 of 11
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-11-23T21:41:17.101Z
- Parent Session: 2026-11-23T21:02:32.908Z
- Lifecycle Mode: completed-continue
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
| P2 (Suggestions) | 0 |
| Resolved | 22 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness: unread lifecycle/derived/skill-graph modules + fusion.ts gen-4 recheck | correctness | 1.00 | 0/1/4 | complete |
| 2 | security: socket_hijack, trust default recheck, shadow sink, prompt-time refusal; python_ts_parity by test run; cross-skill-edges and query handler | security | 0.44 | 0/1/2 | complete |
| 3 | traceability (spec_code, feature_catalog_code) and maintainability (TS/Python duplication), plus recheck of all generation-5 findings | traceability/maintainability | 0.11 | 0/0/2 | complete |
| 4 | correctness: lifecycle_and_derived_defect_scan, handler_defect_scan, recheck of seven generation-4 P2s | correctness | 0.25 | 0/0/6 | complete |
| 5 | traceability: playbook_capability overlay, spec_code rerun, R1-P2-005 probe | traceability | 0.04 | 0/2/15 | complete |
| 6 | security: trust_boundary_scan, Python twin of G5-I5-P2-001, P1 recheck | security/maintainability | 0.17 | 0/3/15 | complete |
| 7 | maintainability: skeptic recheck of G5-I6-P1-001, seed-bound parity, unread-module sweep | maintainability | 0.03 | 0/0/1 | complete |
| 8 | correctness: verification of every registry finding against the current tree | correctness | 0.03 | 0/0/1 | complete |
| 9 | security: verification of both open P2s against the current tree, then introduced-defect scan over the files the fixes changed | security/correctness/maintainability | 0.50 | 0/0/2 | complete |
| 10 | correctness: final verification pass over the four active P2s and the HEAD fix diff | correctness/security/traceability/maintainability | 0.00 | 0/0/0 | complete |
| 11 | traceability | traceability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 0 |
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
- graphConvergenceScore: 1.00
- graphDecision: STOP_ALLOWED
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.50 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 0
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
- candidateCoverage: covered=22, ruledOut=24, deferred=1, blocked=0

### Search Debt
- iteration 11 state_transition (deferred): no budget in the final max-iterations pass; evidence=UNKNOWN

### Ruled-Out Candidates
- iteration 1 attribution (ruled_out): lowest-scored holder is the binding ceiling; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:545
- iteration 1 nan_propagation (ruled_out): not reachable on live path; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1334
- iteration 2 python_ts_parity (ruled_out): no disagreement within the shared corpus; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1
- iteration 2 path_traversal (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/metadata-loader.ts:42, .skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/index.ts:62
- iteration 3 contract_drift (ruled_out): verified by direct read and manifest parity test; evidence=.skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/status.ts:142
- iteration 3 trust_predicate (ruled_out): untrusted no-op refused, no unguarded write; evidence=.skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/index.ts:39
- iteration 4 lifecycle_and_derived_defect_scan (ruled_out): verified by full read of all 12 files plus caller sweep; z_archive precedence edge unreachable at HEAD (no such folder); evidence=.skilled/skills/system-skill-advisor/runtime/lib/derived/provenance.ts:48, .skilled/skills/system-skill-advisor/runtime/lib/derived/anti-stuffing.ts:58, .skilled/skills/system-skill-advisor/runtime/lib/lifecycle/supersession.ts:33, .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1275, .skilled/skills/system-skill-advisor/runtime/lib/df-idf.ts:155, .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/derived.ts:94
- iteration 4 handler_defect_scan (ruled_out): no success-on-failure path and no unvalidated input found; the only half-write does not stale the cache; evidence=.skilled/skills/system-skill-advisor/runtime/handlers/advisor-rebuild.ts:65, .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:67, .skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:370, .skilled/skills/system-skill-advisor/runtime/lib/prompt-cache.ts:87
- iteration 5 playbook_capability (ruled_out): searched-clean by name-existence sweep plus spot reads; degraded-daemon.md:139 stale fixture path is out-of-scope doc drift; evidence=.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:138, .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:74, .skilled/skills/system-skill-advisor/runtime/lib/render.ts:603
- iteration 5 spec_code_contradiction (ruled_out): already covered by registered findings; evidence=.skilled/skills/system-skill-advisor/runtime/advisor-server.ts:324, .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:976
- iteration 6 python_twin_held_below (ruled_out): _apply_graph_boosts is additive only and the gate drops rows; ambiguity cluster at :5056-5065 has no held-below exception; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1607-1652, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4848-4855
- iteration 6 p1_recheck_mitigation (ruled_out): trust gate passes every caller; socket scope subfolder is computable and no level checks uid; evidence=.skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:35, .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1095
- iteration 7 severity_recheck (ruled_out): downgrade rejected; P1 kept at confidence 0.7; evidence=.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:259-266, .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:422-428
- iteration 7 python_ts_parity (ruled_out): intentional TS-only behaviour; outcome parity is enforced by the ratchet; evidence=.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:204-207, .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json, .skilled/skills/system-skill-advisor/runtime/tests/scorer/typed-command-routing.vitest.ts:59-70
- iteration 8 path_traversal (ruled_out): containment is checked on the resolved path and on the realpath, so a linked root cannot widen the delete; evidence=.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:770
- iteration 8 permission_boundary (ruled_out): every in-repo client path calls the shared check before handing over a prompt; evidence=.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1368, .skilled/bin/lib/launcher-session-proxy.cjs:674
- iteration 8 comment_doc_drift (ruled_out): all three corrected comments match the reviewed code and the removed watcher; evidence=.skilled/skills/system-skill-advisor/runtime/lib/shared/shared-payload.ts:4
- iteration 9 toctou (ruled_out): the private owned directory removes the swap window; evidence=.skilled/bin/lib/launcher-ipc-bridge.cjs:205, .skilled/bin/lib/launcher-ipc-bridge.cjs:228
- iteration 9 crash_on_missing_config (ruled_out): probe returned a recommendation with a warning, not a traceback; evidence=runtime/scripts/skill_advisor.py:4085, runtime/tests/python/test_skill_advisor.py:2944
- iteration 9 sensitive_data_at_rest (ruled_out): both the default path and its rotations resolve to ignore rules; evidence=.gitignore:212, .gitignore:214
- iteration 10 silent_failure_regression (ruled_out): probe at HEAD exits 0 with a usable payload; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4085
- iteration 10 permission_boundary (ruled_out): read plus two check-ignore probes; evidence=.skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:151, .skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:214, .gitignore:212
- iteration 10 unshipped_dependency (ruled_out): git ls-files --error-unmatch exit 0; evidence=.skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:29
- iteration 10 state_transition (ruled_out): direct read of the delete predicate and its caller; evidence=.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:748
- iteration 10 toctou (ruled_out): direct read of the predicate and its call site; evidence=.skilled/bin/lib/launcher-ipc-bridge.cjs:202
- iteration 11 contract_drift (ruled_out): verified by executing the AC-006 command pair at HEAD 5c5b9fe3e5b; evidence=.skilled/skills/system-skill-advisor/runtime/tests/scorer/sk-git-worktree-sweep-vocabulary.vitest.ts:1
- iteration 11 constant_parity_drift (ruled_out): verified by executing AC-007; evidence=.skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-constant-parity.vitest.ts:43
- iteration 11 stage_order_regression (ruled_out): verified by executing AC-008; evidence=.skilled/skills/system-skill-advisor/runtime/tests/scorer/score-stage-order.vitest.ts:82
- iteration 11 gate_baseline_regression (ruled_out): verified by executing AC-013 and a skip probe over the skip-bearing suites; evidence=.skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:175, specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/029-advisor-logic-review-fixes/acceptance-criteria.md:66

### Clean Search Proof
- iteration 1 attribution (ruled_out): lowest-scored holder is the binding ceiling; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:545
- iteration 1 nan_propagation (ruled_out): not reachable on live path; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1334
- iteration 2 python_ts_parity (ruled_out): no disagreement within the shared corpus; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1
- iteration 2 path_traversal (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/metadata-loader.ts:42, .skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/index.ts:62
- iteration 3 contract_drift (ruled_out): verified by direct read and manifest parity test; evidence=.skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/status.ts:142
- iteration 3 trust_predicate (ruled_out): untrusted no-op refused, no unguarded write; evidence=.skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/index.ts:39
- iteration 4 lifecycle_and_derived_defect_scan (ruled_out): verified by full read of all 12 files plus caller sweep; z_archive precedence edge unreachable at HEAD (no such folder); evidence=.skilled/skills/system-skill-advisor/runtime/lib/derived/provenance.ts:48, .skilled/skills/system-skill-advisor/runtime/lib/derived/anti-stuffing.ts:58, .skilled/skills/system-skill-advisor/runtime/lib/lifecycle/supersession.ts:33, .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1275, .skilled/skills/system-skill-advisor/runtime/lib/df-idf.ts:155, .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/derived.ts:94
- iteration 4 handler_defect_scan (ruled_out): no success-on-failure path and no unvalidated input found; the only half-write does not stale the cache; evidence=.skilled/skills/system-skill-advisor/runtime/handlers/advisor-rebuild.ts:65, .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:67, .skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:370, .skilled/skills/system-skill-advisor/runtime/lib/prompt-cache.ts:87
- iteration 5 playbook_capability (ruled_out): searched-clean by name-existence sweep plus spot reads; degraded-daemon.md:139 stale fixture path is out-of-scope doc drift; evidence=.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:138, .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:74, .skilled/skills/system-skill-advisor/runtime/lib/render.ts:603
- iteration 5 spec_code_contradiction (ruled_out): already covered by registered findings; evidence=.skilled/skills/system-skill-advisor/runtime/advisor-server.ts:324, .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:976
- iteration 6 python_twin_held_below (ruled_out): _apply_graph_boosts is additive only and the gate drops rows; ambiguity cluster at :5056-5065 has no held-below exception; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1607-1652, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4848-4855
- iteration 6 p1_recheck_mitigation (ruled_out): trust gate passes every caller; socket scope subfolder is computable and no level checks uid; evidence=.skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:35, .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1095
- iteration 7 severity_recheck (ruled_out): downgrade rejected; P1 kept at confidence 0.7; evidence=.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:259-266, .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:422-428
- iteration 7 python_ts_parity (ruled_out): intentional TS-only behaviour; outcome parity is enforced by the ratchet; evidence=.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:204-207, .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json, .skilled/skills/system-skill-advisor/runtime/tests/scorer/typed-command-routing.vitest.ts:59-70
- iteration 8 path_traversal (ruled_out): containment is checked on the resolved path and on the realpath, so a linked root cannot widen the delete; evidence=.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:770
- iteration 8 permission_boundary (ruled_out): every in-repo client path calls the shared check before handing over a prompt; evidence=.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1368, .skilled/bin/lib/launcher-session-proxy.cjs:674
- iteration 8 comment_doc_drift (ruled_out): all three corrected comments match the reviewed code and the removed watcher; evidence=.skilled/skills/system-skill-advisor/runtime/lib/shared/shared-payload.ts:4
- iteration 9 toctou (ruled_out): the private owned directory removes the swap window; evidence=.skilled/bin/lib/launcher-ipc-bridge.cjs:205, .skilled/bin/lib/launcher-ipc-bridge.cjs:228
- iteration 9 crash_on_missing_config (ruled_out): probe returned a recommendation with a warning, not a traceback; evidence=runtime/scripts/skill_advisor.py:4085, runtime/tests/python/test_skill_advisor.py:2944
- iteration 9 sensitive_data_at_rest (ruled_out): both the default path and its rotations resolve to ignore rules; evidence=.gitignore:212, .gitignore:214
- iteration 10 silent_failure_regression (ruled_out): probe at HEAD exits 0 with a usable payload; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4085
- iteration 10 permission_boundary (ruled_out): read plus two check-ignore probes; evidence=.skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:151, .skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:214, .gitignore:212
- iteration 10 unshipped_dependency (ruled_out): git ls-files --error-unmatch exit 0; evidence=.skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:29
- iteration 10 state_transition (ruled_out): direct read of the delete predicate and its caller; evidence=.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:748
- iteration 10 toctou (ruled_out): direct read of the predicate and its call site; evidence=.skilled/bin/lib/launcher-ipc-bridge.cjs:202
- iteration 11 contract_drift (ruled_out): verified by executing the AC-006 command pair at HEAD 5c5b9fe3e5b; evidence=.skilled/skills/system-skill-advisor/runtime/tests/scorer/sk-git-worktree-sweep-vocabulary.vitest.ts:1
- iteration 11 constant_parity_drift (ruled_out): verified by executing AC-007; evidence=.skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-constant-parity.vitest.ts:43
- iteration 11 stage_order_regression (ruled_out): verified by executing AC-008; evidence=.skilled/skills/system-skill-advisor/runtime/tests/scorer/score-stage-order.vitest.ts:82
- iteration 11 gate_baseline_regression (ruled_out): verified by executing AC-013 and a skip probe over the skip-bearing suites; evidence=.skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:175, specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/029-advisor-logic-review-fixes/acceptance-criteria.md:66

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none. Final iteration of a `max-iterations` run; all four dimensions are complete (4/4). - Focus area: synthesis. - Reason: the last outstanding traceability gap is closed. `spec_code` moves `partial` to `pass` on six observed command runs at HEAD `5c5b9fe3e5b`, `checklist_evidence` re-confirmed, and the registry holds no active P0, P1 or P2. - Rotation status: complete (4/4). - Blocked/productive carry-forward: `SL-004` (`state_transition`) remains the single deferred search row. Nothing is blocked. - Required evidence: synthesis should recompute the registry from the deltas and confirm the merged verdict is PASS with `hasAdvisories=false`, and the packet owner should apply the AC-006 path amendment named in Edge Case 3. - Recovery note: not applicable. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
