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
- Review Target: files changed in commits 169da2e8cba..1c7bc3d9d63: the history lookup engine move into .skilled/hooks/session-handover/history and everything that followed it (files)
- Started: 2026-11-15T17:33:23.837Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-11-15T17:33:23.837Z
- Parent Session: 1794748073879-re9m5r
- Lifecycle Mode: restart
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
| P1 (Required) | 2 |
| P2 (Suggestions) | 10 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/1/3 | complete |
| 2 | security | security | 0.11 | 0/0/1 | complete |
| 3 | traceability | traceability | 0.25 | 0/0/3 | complete |
| 4 | maintainability | maintainability | 0.00 | 0/0/0 | complete |
| 5 | cross-reference | correctness/security/traceability/maintainability | 0.00 | 0/0/0 | complete |
| 6 | recovery: function-level correctness and cross-reference consolidation | correctness/traceability | 0.00 | 0/0/0 | complete |
| 7 | traceability — carried-finding consolidation and synthesis prep | traceability | 0.00 | 0/0/0 | complete |
| 8 | recovery: consolidation and synthesis prep at HEAD 5bd9d54 with the four operator residuals re-checked | correctness/security/traceability/maintainability | 0.00 | 0/0/0 | complete |
| 9 | consolidation: direct re-confirmation of the four remaining P2 anchors at HEAD 5bd9d54 with synthesis prep | correctness/security/traceability/maintainability | 0.00 | 0/0/0 | complete |
| 10 | recovery: severity escalation review plus terminal re-confirmation of the eight active findings at HEAD 5bd9d54ef96 | correctness/security/traceability/maintainability | 0.00 | 0/1/7 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 8 |
| security | covered | 1 |
| traceability | covered | 3 |
| maintainability | covered | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.78
- graphDecision: STOP_BLOCKED
- graphBlockers: {"count":13,"description":"Dimension coverage (40%) is below threshold (80%). 13 gap(s) found. STOP is blocked until all required dimensions have meaningful coverage.","severity":"blocking","type":"uncovered_dimensions"}

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 12
- persistentSameSeverity: 4
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 4

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=16, ruledOut=21, deferred=1, blocked=0

### Search Debt
- iteration 5 unbounded_resource (deferred): measurement requires executing the engine against a synthetic store; evidence=navigator.ts:490-503

### Ruled-Out Candidates
- iteration 1 stale_path_reference (ruled_out): exact search over live surfaces returned no hits; evidence=.skilled/skills/system-spec-kit/runtime/hooks/lib/README.md:25, .skilled/skills/sk-git/scripts/worktree-provision-paths.txt:41
- iteration 2 path_traversal (ruled_out): the id is hashed into the filename, so no separator or parent segment survives; evidence=hook-state.ts:484-487, cli.ts:187-190
- iteration 2 trust_boundary_spoof (ruled_out): every gate is checked before a store is read and ambiguity refuses rather than ranks; evidence=cli.ts:385-390, cli.ts:570, hook-state.ts:325-331
- iteration 2 secret_exposure (ruled_out): the public projection drops private blocks and every refusal prints only {ok:false,code}; evidence=projection.ts:39-49, cli.ts:526-529
- iteration 2 authz_gap (ruled_out): the handle is not a privilege boundary and the actor able to rewrite state already reads the store directly; evidence=locator-digest.ts:33-35, cli.ts:214-219
- iteration 3 spec_mismatch (ruled_out): The table is a historical action list, not a live contract; the shipped path matches the phase outcome.; evidence=spec.md:97-102
- iteration 3 false_completion_claim (ruled_out): Status is Draft and no task or acceptance box is checked; there is no completion claim to falsify.; evidence=008/tasks.md:36-61, 008/spec.md:24
- iteration 3 missing_reference (ruled_out): Every spot-checked catalog anchor resolves to the moved engine or an existing reader test.; evidence=compaction-history-lookup.md:69-76,82-93
- iteration 3 broken_command (ruled_out): The relative binary path resolves and equals the package test script.; evidence=compaction-history-lookup.md:63, history/package.json:13
- iteration 4 cursor_arithmetic (ruled_out): direct read of the paging path found no off-by-one or split-surrogate case; evidence=.skilled/hooks/session-handover/history/lib/pages.ts:351-361, .skilled/hooks/session-handover/history/lib/pages.ts:396-422, .skilled/hooks/session-handover/history/lib/pages.ts:441-469
- iteration 4 constant_drift (ruled_out): equality holds today with identical arithmetic; evidence=.skilled/hooks/session-handover/history/lib/lookup-offer.ts:33, .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:278, .skilled/hooks/session-handover/history/tests/history-locator.vitest.ts:164-172
- iteration 4 stale_path_reference (ruled_out): no live import or runnable entry resolves to the retired tree; evidence=.skilled/hooks/session-handover/history/tests/history-projection.vitest.ts:228-232, .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs:3596-3603
- iteration 5 spec_mismatch (ruled_out): plan, description and graph metadata agree with spec/tasks and are fresh; evidence=plan.md:3,12,37-38,76,92, description.json:2,9,11-18, graph-metadata.json:35,40, graph-metadata.json:177-179
- iteration 5 doc_code_drift (ruled_out): the previously untraced success exit is now traced end to end; evidence=compaction-history-lookup.md:51, README.md:144, cli.ts:577-580, cli.ts:592-593
- iteration 6 spec_mismatch (ruled_out): direct read of both the derivation and its assertions found no mismatch; evidence=.skilled/hooks/session-handover/history/lib/history.ts:70-105, .skilled/hooks/session-handover/history/tests/history-entry-contract.vitest.ts:34-73
- iteration 6 constant_drift (ruled_out): direct read of both copies found identical arithmetic; evidence=.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:278-284, .skilled/hooks/session-handover/history/lib/lookup-offer.ts:33-58
- iteration 6 stale_path_reference (ruled_out): repo-wide exact search returned no live hit; evidence=.skilled/hooks/session-handover/history/lib/history.ts:330-335, .skilled/hooks/session-handover/history/lib/history.ts:330-335
- iteration 7 stale_path_reference (ruled_out): the fixture states older transcripts still hold the earlier path and asserts both paths; evidence=.skilled/hooks/session-handover/history/tests/history-projection.vitest.ts:228-232
- iteration 8 constant_drift (ruled_out): Both copies are 66 with identical quoted-length arithmetic, so the drift hypothesis is ruled out.; evidence=.skilled/hooks/session-handover/history/lib/lookup-offer.ts:33, .skilled/hooks/session-handover/history/lib/lookup-offer.ts:52-58, .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:278-284, .skilled/hooks/session-handover/history/tests/history-locator.vitest.ts:164-172
- iteration 8 stale_path_reference (ruled_out): No live old-path reference outside the owned harness line and documented compatibility fixtures.; evidence=specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/001-hop-recall-baseline/scratch/harness/hop-recall.sh:18, .skilled/hooks/session-handover/history/tests/history-projection.vitest.ts:230, .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs:3598
- iteration 10 dependency_path_resolution (ruled_out): hypothesis refuted at HEAD; P1 stands with corrected anchor package.json:11; evidence=.skilled/hooks/session-handover/history/package.json:11, .github/workflows/spec-kit-check.yml:227, .github/workflows/spec-kit-check.yml:230, .skilled/package.json:1-25
- iteration 10 ci_trigger_coverage (ruled_out): hypothesis refuted; I1-P2-002 stands; evidence=.github/workflows/spec-kit-check.yml:7-8, .github/workflows/spec-kit-check.yml:48-49, .github/workflows/spec-kit-check.yml:296-302
- iteration 10 silent_test_skip (ruled_out): hypothesis refuted; skip is latent because the schema exists; evidence=.skilled/hooks/shared/tests/session-readers/project.test.mjs:141-142
- iteration 10 duplicate_constant_drift (ruled_out): hypothesis refuted; copies agree, pinning asymmetry remains P2; evidence=.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:278, .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:281-284, .skilled/hooks/session-handover/history/lib/lookup-offer.ts:33, .skilled/hooks/session-handover/history/lib/lookup-offer.ts:52-58
- iteration 10 command_interpolation (ruled_out): hypothesis refuted; I2-P2-001 stands; evidence=.skilled/hooks/session-handover/history/lib/lookup-offer.ts:68-75
- iteration 10 doc_anchor_drift (ruled_out): hypothesis refuted; I3-P2-001 stands; evidence=.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:185-186
- iteration 10 doc_capability_omission (ruled_out): hypothesis refuted; I3-P2-002 stands; evidence=.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:147, .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:166
- iteration 10 doc_internal_contradiction (ruled_out): hypothesis refuted; I3-P2-003 stands; evidence=.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md:18, .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md:22
- iteration 10 severity_miscalibration (ruled_out): all seven P2 stay P2; no upgrade; evidence=.skilled/hooks/session-handover/history/package.json:11, .github/workflows/spec-kit-check.yml:301, .skilled/hooks/shared/tests/session-readers/project.test.mjs:141, .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:278, .skilled/hooks/session-handover/history/lib/lookup-offer.ts:69, .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:185, .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md:18

### Clean Search Proof
- iteration 1 stale_path_reference (ruled_out): exact search over live surfaces returned no hits; evidence=.skilled/skills/system-spec-kit/runtime/hooks/lib/README.md:25, .skilled/skills/sk-git/scripts/worktree-provision-paths.txt:41
- iteration 2 path_traversal (ruled_out): the id is hashed into the filename, so no separator or parent segment survives; evidence=hook-state.ts:484-487, cli.ts:187-190
- iteration 2 trust_boundary_spoof (ruled_out): every gate is checked before a store is read and ambiguity refuses rather than ranks; evidence=cli.ts:385-390, cli.ts:570, hook-state.ts:325-331
- iteration 2 secret_exposure (ruled_out): the public projection drops private blocks and every refusal prints only {ok:false,code}; evidence=projection.ts:39-49, cli.ts:526-529
- iteration 2 authz_gap (ruled_out): the handle is not a privilege boundary and the actor able to rewrite state already reads the store directly; evidence=locator-digest.ts:33-35, cli.ts:214-219
- iteration 3 spec_mismatch (ruled_out): The table is a historical action list, not a live contract; the shipped path matches the phase outcome.; evidence=spec.md:97-102
- iteration 3 false_completion_claim (ruled_out): Status is Draft and no task or acceptance box is checked; there is no completion claim to falsify.; evidence=008/tasks.md:36-61, 008/spec.md:24
- iteration 3 missing_reference (ruled_out): Every spot-checked catalog anchor resolves to the moved engine or an existing reader test.; evidence=compaction-history-lookup.md:69-76,82-93
- iteration 3 broken_command (ruled_out): The relative binary path resolves and equals the package test script.; evidence=compaction-history-lookup.md:63, history/package.json:13
- iteration 4 cursor_arithmetic (ruled_out): direct read of the paging path found no off-by-one or split-surrogate case; evidence=.skilled/hooks/session-handover/history/lib/pages.ts:351-361, .skilled/hooks/session-handover/history/lib/pages.ts:396-422, .skilled/hooks/session-handover/history/lib/pages.ts:441-469
- iteration 4 constant_drift (ruled_out): equality holds today with identical arithmetic; evidence=.skilled/hooks/session-handover/history/lib/lookup-offer.ts:33, .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:278, .skilled/hooks/session-handover/history/tests/history-locator.vitest.ts:164-172
- iteration 4 stale_path_reference (ruled_out): no live import or runnable entry resolves to the retired tree; evidence=.skilled/hooks/session-handover/history/tests/history-projection.vitest.ts:228-232, .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs:3596-3603
- iteration 5 spec_mismatch (ruled_out): plan, description and graph metadata agree with spec/tasks and are fresh; evidence=plan.md:3,12,37-38,76,92, description.json:2,9,11-18, graph-metadata.json:35,40, graph-metadata.json:177-179
- iteration 5 doc_code_drift (ruled_out): the previously untraced success exit is now traced end to end; evidence=compaction-history-lookup.md:51, README.md:144, cli.ts:577-580, cli.ts:592-593
- iteration 5 constant_drift (not_applicable): direction recorded BLOCKED and not re-entered; evidence=lookup-offer.ts:33,58, hook-state.ts:278,283
- iteration 5 stale_path_reference (not_applicable): direction recorded BLOCKED and not re-entered; evidence=.skilled/hooks/session-handover/history/tests/history-projection.vitest.ts:230, .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs:3598
- iteration 6 spec_mismatch (ruled_out): direct read of both the derivation and its assertions found no mismatch; evidence=.skilled/hooks/session-handover/history/lib/history.ts:70-105, .skilled/hooks/session-handover/history/tests/history-entry-contract.vitest.ts:34-73
- iteration 6 constant_drift (ruled_out): direct read of both copies found identical arithmetic; evidence=.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:278-284, .skilled/hooks/session-handover/history/lib/lookup-offer.ts:33-58
- iteration 6 stale_path_reference (ruled_out): repo-wide exact search returned no live hit; evidence=.skilled/hooks/session-handover/history/lib/history.ts:330-335, .skilled/hooks/session-handover/history/lib/history.ts:330-335
- iteration 7 stale_path_reference (ruled_out): the fixture states older transcripts still hold the earlier path and asserts both paths; evidence=.skilled/hooks/session-handover/history/tests/history-projection.vitest.ts:228-232
- iteration 7 constant_drift (not_applicable): constant-drift direction recorded BLOCKED in iteration 6; evidence=.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:278-284, .skilled/hooks/session-handover/history/lib/lookup-offer.ts:33-58
- iteration 8 package_build_wiring (not_applicable): Re-confirmation of active carried I1-P1-001; evidence=.skilled/hooks/session-handover/history/package.json:6, .github/workflows/spec-kit-check.yml:276-286, .github/workflows/spec-kit-check.yml:296-302, .skilled/package.json:1-25
- iteration 8 silent_test_skip (not_applicable): Re-confirmation of active carried I1-P2-003; evidence=.skilled/hooks/shared/tests/session-readers/project.test.mjs:141-142, .skilled/hooks/shared/tests/session-readers/project.test.mjs:26-34
- iteration 8 constant_drift (ruled_out): Both copies are 66 with identical quoted-length arithmetic, so the drift hypothesis is ruled out.; evidence=.skilled/hooks/session-handover/history/lib/lookup-offer.ts:33, .skilled/hooks/session-handover/history/lib/lookup-offer.ts:52-58, .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:278-284, .skilled/hooks/session-handover/history/tests/history-locator.vitest.ts:164-172
- iteration 8 stale_path_reference (ruled_out): No live old-path reference outside the owned harness line and documented compatibility fixtures.; evidence=specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/001-hop-recall-baseline/scratch/harness/hop-recall.sh:18, .skilled/hooks/session-handover/history/tests/history-projection.vitest.ts:230, .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs:3598
- iteration 8 ci_gate_coverage (not_applicable): Re-confirmation of active carried I1-P2-002; evidence=.github/workflows/spec-kit-check.yml:3-85
- iteration 8 doc_code_drift (not_applicable): Re-confirmation of active carried I3-P2-001, I3-P2-002 and I3-P2-003; evidence=.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:147, .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:185-186, .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md:18
- iteration 10 dependency_path_resolution (ruled_out): hypothesis refuted at HEAD; P1 stands with corrected anchor package.json:11; evidence=.skilled/hooks/session-handover/history/package.json:11, .github/workflows/spec-kit-check.yml:227, .github/workflows/spec-kit-check.yml:230, .skilled/package.json:1-25
- iteration 10 ci_trigger_coverage (ruled_out): hypothesis refuted; I1-P2-002 stands; evidence=.github/workflows/spec-kit-check.yml:7-8, .github/workflows/spec-kit-check.yml:48-49, .github/workflows/spec-kit-check.yml:296-302
- iteration 10 silent_test_skip (ruled_out): hypothesis refuted; skip is latent because the schema exists; evidence=.skilled/hooks/shared/tests/session-readers/project.test.mjs:141-142
- iteration 10 duplicate_constant_drift (ruled_out): hypothesis refuted; copies agree, pinning asymmetry remains P2; evidence=.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:278, .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:281-284, .skilled/hooks/session-handover/history/lib/lookup-offer.ts:33, .skilled/hooks/session-handover/history/lib/lookup-offer.ts:52-58
- iteration 10 command_interpolation (ruled_out): hypothesis refuted; I2-P2-001 stands; evidence=.skilled/hooks/session-handover/history/lib/lookup-offer.ts:68-75
- iteration 10 doc_anchor_drift (ruled_out): hypothesis refuted; I3-P2-001 stands; evidence=.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:185-186
- iteration 10 doc_capability_omission (ruled_out): hypothesis refuted; I3-P2-002 stands; evidence=.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:147, .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:166
- iteration 10 doc_internal_contradiction (ruled_out): hypothesis refuted; I3-P2-003 stands; evidence=.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md:18, .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md:22
- iteration 10 severity_miscalibration (ruled_out): all seven P2 stay P2; no upgrade; evidence=.skilled/hooks/session-handover/history/package.json:11, .github/workflows/spec-kit-check.yml:301, .skilled/hooks/shared/tests/session-readers/project.test.mjs:141, .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:278, .skilled/hooks/session-handover/history/lib/lookup-offer.ts:69, .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:185, .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md:18

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Loop terminated by `stopPolicy=max-iterations` (10 of 10). Synthesis consumes this record; no further iteration is dispatched. Planning Packet fix order and owners: 1. `I1-P1-001` — engine owner. Replace the hardcoded `tsc` path at `package.json:11` with a workspace-relative invocation, or add an install step that provisions `.skilled/skills/system-spec-kit/node_modules`. 2. `I1-P2-002` — CI owner. Add `.skilled/hooks/**` to both trigger filters (`spec-kit-check.yml:7-8,48-49`). 3. `I1-P2-003` — shared-session-readers owner. Make the missing-schema branch fail rather than skip (`project.test.mjs:141-142`). 4. `I1-P2-004` — hook-state owner. Pin the two constants equal in both directions (compare constants, not only behavior). 5. `I2-P2-001` — engine owner. Quote or allowlist `locator.runtime` before interpolation (`lookup-offer.ts:69-70`). 6. `I3-P2-001` to `I3-P2-003` — manual-testing-playbook owner. Refresh the two Source Files rows, add Vibe to `:147,:166`, and reconcile `:18` with `:22`. All eight findings remain active (0 resolved). Active P1 `I1-P1-001` remains and no P0 exists, so the verdict is CONDITIONAL.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
