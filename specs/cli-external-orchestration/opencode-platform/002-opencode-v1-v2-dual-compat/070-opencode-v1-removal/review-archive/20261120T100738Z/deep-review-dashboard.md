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
- Review Target: Branch worktrees/477-opencode-v1-removal, its own commits since origin/main: ba9720f2f08 (runtime code), fc8b3a9a241 (CI and packages), af87a2aa13a (docs), 96e3d8a8f24 (spec packet), 3ef324c3de1 (renames), 4c72145b752 (live evidence), plus the a793f3ad733 merge conflict resolution in cli-opencode/references/providers-and-models.md. The work removes OpenCode 1 support; OpenCode 2 (@opencode/cli 2.3.2) is the only supported major. (files)
- Started: 2026-11-19T15:56:57.978Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: FAIL
- Failed required gates at stop: coverage
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-11-19T15:56:57.978Z
- Parent Session: 2026-11-19T15:28:38.046Z
- Lifecycle Mode: restart
- Generation: 2
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
| P2 (Suggestions) | 7 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness (inventory pass) | correctness | 1.00 | 0/0/3 | complete |
| 2 | security | security | 1.00 | 0/0/1 | complete |
| 3 | traceability | traceability | 1.00 | 0/1/2 | complete |
| 4 | maintainability | maintainability/correctness | 1.00 | 0/1/1 | complete |
| 5 | traceability (checklist_evidence completion + consumer sweep of removed keys) | traceability | 0.50 | 0/2/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 9 |
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
- graphConvergenceScore: 0.84
- graphDecision: CONTINUE
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 1.00 -> 1.00 -> 0.50
- convergenceScore: 0.50
- openFindings: 9
- persistentSameSeverity: 2
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 2

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=12, ruledOut=15, deferred=1, blocked=0

### Search Debt
- iteration 5 mirror_check_capability (deferred): iteration budget spent on the checklist sweep and consumer sweep; whether the mirror check compares bytes only is unverified; evidence=003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:64

### Ruled-Out Candidates
- iteration 1 removed_feature_residue (ruled_out): refusal precedes every lineage start and the removed builder has no caller; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3505
- iteration 1 state_transition (ruled_out): verified by direct read of the only remaining producer; evidence=.skilled/hooks/shared/session-readers/opencode.mjs:102
- iteration 1 boundary_handling (ruled_out): corpus coverage confirmed against the parser body; evidence=.skilled/hooks/cli-dispatch/lib/opencode-version-corpus.json:9
- iteration 2 authorization_bypass (ruled_out): verified by direct read of the registration and the documented contract; evidence=.opencode/plugins/lib/v2-bridge.js:516, .opencode/plugins/ARCHITECTURE.md:130
- iteration 2 authorization_bypass (ruled_out): code read plus event inventory evidence; evidence=.opencode/plugins/ARCHITECTURE.md:142, .opencode/plugins/ARCHITECTURE.md:224
- iteration 2 trust_boundary_violation (ruled_out): verified by direct read of the identity check; evidence=.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:139
- iteration 2 command_injection (ruled_out): direct read of both surfaces; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2379, .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:222
- iteration 3 spec_code_drift (ruled_out): direct read plus reproduced verification commands on both sides; evidence=specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/spec.md:105, specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/spec.md:109, .github/workflows/opencode-v2-battery.yml:84, .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:30, .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/pure-and-print-logs.md:52, .skilled/skills/cli-external-orchestration/cli-opencode/references/destructive-scope-violations.md:44
- iteration 3 stale_completion_claim (ruled_out): parent and child rows agree for the two non-phase-003 blockers; evidence=specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/tasks.md:116, specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/spec.md:18
- iteration 4 orphaned_helper (ruled_out): documented v2 event with an uncaptured delivery, not a v1 leftover; evidence=.opencode/plugins/system-dist-freshness-guard.js:221, .opencode/plugins/ARCHITECTURE.md:224
- iteration 4 stale_cross_reference (ruled_out): the text states the refusal rather than a supported path; evidence=.skilled/commands/deep/assets/deep-review-presentation.txt:474
- iteration 5 cross_runtime_contract_multi_consumer (ruled_out): no second consumer of the removed key exists; every other dualPlugin user reaches OpenCode through setup; evidence=.vibe/plugins/README.md:103, .opencode/plugins/session-cleanup.js:375
- iteration 5 stale_plugin_count (ruled_out): the folder holds 20 .js files, matching the row; evidence=003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:58

### Clean Search Proof
- iteration 1 removed_feature_residue (ruled_out): refusal precedes every lineage start and the removed builder has no caller; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3505
- iteration 1 state_transition (ruled_out): verified by direct read of the only remaining producer; evidence=.skilled/hooks/shared/session-readers/opencode.mjs:102
- iteration 1 boundary_handling (ruled_out): corpus coverage confirmed against the parser body; evidence=.skilled/hooks/cli-dispatch/lib/opencode-version-corpus.json:9
- iteration 2 authorization_bypass (ruled_out): verified by direct read of the registration and the documented contract; evidence=.opencode/plugins/lib/v2-bridge.js:516, .opencode/plugins/ARCHITECTURE.md:130
- iteration 2 authorization_bypass (ruled_out): code read plus event inventory evidence; evidence=.opencode/plugins/ARCHITECTURE.md:142, .opencode/plugins/ARCHITECTURE.md:224
- iteration 2 trust_boundary_violation (ruled_out): verified by direct read of the identity check; evidence=.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:139
- iteration 2 command_injection (ruled_out): direct read of both surfaces; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2379, .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:222
- iteration 3 spec_code_drift (ruled_out): direct read plus reproduced verification commands on both sides; evidence=specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/spec.md:105, specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/spec.md:109, .github/workflows/opencode-v2-battery.yml:84, .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:30, .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/pure-and-print-logs.md:52, .skilled/skills/cli-external-orchestration/cli-opencode/references/destructive-scope-violations.md:44
- iteration 3 stale_completion_claim (ruled_out): parent and child rows agree for the two non-phase-003 blockers; evidence=specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/tasks.md:116, specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/spec.md:18
- iteration 4 orphaned_helper (ruled_out): documented v2 event with an uncaptured delivery, not a v1 leftover; evidence=.opencode/plugins/system-dist-freshness-guard.js:221, .opencode/plugins/ARCHITECTURE.md:224
- iteration 4 stale_cross_reference (ruled_out): the text states the refusal rather than a supported path; evidence=.skilled/commands/deep/assets/deep-review-presentation.txt:474
- iteration 5 cross_runtime_contract_multi_consumer (ruled_out): no second consumer of the removed key exists; every other dualPlugin user reaches OpenCode through setup; evidence=.vibe/plugins/README.md:103, .opencode/plugins/session-cleanup.js:375
- iteration 5 stale_plugin_count (ruled_out): the folder holds 20 .js files, matching the row; evidence=003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:58

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remains. The iteration cap (5 of 5) is reached with all four dimensions covered. - Focus area for synthesis: the fix surface for the two P1 findings. For the Vibe break, compare (a) restoring a `server` accessor on the wrapper, (b) giving the adapter a `setup`-shaped call path, and (c) retiring the adapter and its two `hooks.toml` entries; (b) and (c) keep the v1-facing surface gone, (a) re-adds it. For the checklist, re-scope 001 AC-007 to the repository root and reconcile 003 AC-004 with a written waiver or an `Unmet` row. - Reason: both P1s are confirmed against current content and neither is a candidate for downgrade; the remaining decision is the operator's, not a further read. - Rotation status: D1 complete, D2 complete, D3 complete, D4 complete. - Blocked/productive carry-forward: the "removal against consumers, not against its own tests" reading produced both P1s; it is exhausted for the removed keys now that the sweep is complete. - Required evidence: the chosen fix shape applied, then a re-read of `.vibe/plugins/repo-guards/session-cleanup.mjs` against the new wrapper, plus the re-scoped AC-007 cell and the reconciled AC-004 row. - Recovery note: none; no iteration was stuck.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
