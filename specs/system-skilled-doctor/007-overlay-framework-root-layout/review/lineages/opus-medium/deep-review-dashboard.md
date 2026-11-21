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
- Review Target: specs/system-skilled-doctor/007-overlay-framework-root-layout (spec-folder)
- Started: 2026-11-20T16:34:59.815Z
- Status: COMPLETE
- Iteration: 17 of 24
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-opus-medium-1795192401900-xpt66n
- Parent Session: 2026-11-20T16:33:02.758Z
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
| P1 (Required) | 1 |
| P2 (Suggestions) | 10 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | Frontier node F-1-001: correctness | correctness | 1.00 | 0/0/2 | complete |
| 2 | Frontier node F-1-003: correctness | correctness | 0.50 | 0/0/2 | complete |
| 3 | Frontier node F-1-005: correctness | correctness | 0.33 | 0/0/2 | complete |
| 4 | Frontier node F-1-007: traceability | traceability | 0.25 | 0/0/2 | complete |
| 5 | Frontier node F-1-001: security | security | 0.43 | 0/1/1 | complete |
| 6 | Frontier node F-1-003: security | security | 0.07 | 0/0/1 | complete |
| 7 | Frontier node F-1-005: security | security | 0.00 | 0/0/0 | complete |
| 8 | Frontier node F-1-007: correctness | correctness | 0.00 | 0/0/0 | complete |
| 9 | Frontier node F-1-001: traceability and maintainability | traceability/maintainability | 0.06 | 0/0/1 | complete |
| 10 | Frontier node F-1-003: traceability and maintainability | traceability/maintainability | 0.06 | 0/0/1 | complete |
| 11 | Frontier node F-1-005: traceability and maintainability | traceability/maintainability | 0.00 | 0/0/0 | complete |
| 12 | Frontier node F-1-007: security and maintainability | security/maintainability | 0.00 | 0/0/0 | complete |
| 13 | Recovery replay: R5-P1-001 against its downgrade triggers | correctness | 0.00 | 0/0/0 | complete |
| 14 | Recovery: severity escalation and function-level pass on relayoutUnderLock | maintainability/correctness | 0.06 | 0/0/1 | complete |
| 15 | Recovery: traceability protocol replay and registry repair | traceability | 0.19 | 0/1/2 | complete |
| 16 | Test strength against the pre-fix engine, and P1 record repair | correctness | 0.12 | 0/1/0 | complete |
| 17 | Core protocol adjudication across phases 006-008 | traceability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 6 |
| security | covered | 3 |
| traceability | covered | 2 |
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
- Last 3 ratios: 0.19 -> 0.12 -> 0.00
- convergenceScore: 1.00
- openFindings: 11
- persistentSameSeverity: 2
- severityChanged: 1
- repeatedFindings (deprecated combined bucket): 3

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=21, ruledOut=18, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 rollback_completeness (ruled_out): every completed step is undone newest first; snapshot tests prove it; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:6420, .skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs:1208
- iteration 2 workflow_sequence (ruled_out): workflow runs apply as a second call; evidence=.skilled/commands/doctor/assets/doctor-overlay-apply.yaml:105
- iteration 3 fail_open_gate (ruled_out): blocks with exit 1 when vendored paths are staged; evidence=barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:134
- iteration 4 unevidenced_completion (ruled_out): b5a630c6efa is an ancestor of origin/main; evidence=specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/tasks.md:47
- iteration 5 sibling_escape (ruled_out): refused by the git top-level check; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:474
- iteration 6 unsafe_guidance (ruled_out): protected reads and bypass text match the engine; evidence=.skilled/skills/system-skilled-doctor/references/overlays.md:140, .skilled/commands/doctor/scripts/overlay-engine.cjs:2755
- iteration 7 fail_open_gate (ruled_out): null root refuses every write; evidence=barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:226, barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:1731
- iteration 7 test_coverage (ruled_out): real-bridge case imports the applied plugin; evidence=barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs:157
- iteration 8 unevidenced_completion (ruled_out): status, pre-commit and engine parity all match; evidence=specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/tasks.md:62
- iteration 8 doc_code_drift (ruled_out): JSDoc names framework/ and root/; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:3434
- iteration 9 comment_hygiene (ruled_out): none in added comment lines; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:6413
- iteration 10 stale_pointer (ruled_out): no engine line pointers in doctor docs; evidence=.skilled/skills/system-skilled-doctor/references/overlays.md:92
- iteration 11 record_contradiction (ruled_out): all eight rows trace; evidence=barter/ai-speckit/specs/skilled-barter-overlays/002-spec-tracks-restructure/039-overlays-framework-root-layout/implementation-summary.md:80
- iteration 11 duplication (ruled_out): three copies agree; reason recorded; evidence=barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:60, barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:177
- iteration 12 secret_exposure (ruled_out): credential scan clean; evidence=specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/goal.md:87
- iteration 12 hidden_bypass (ruled_out): bypass disclosed in limitations and goal; evidence=specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/implementation-summary.md:113
- iteration 13 fail_open_gate (ruled_out): AGENTS.md offers worktrees and core.hooksPath is shared, so it is reachable; evidence=barter/ai-speckit/AGENTS.md:222
- iteration 13 secret_exposure (ruled_out): hook prints only engine lines and the bypass name; evidence=barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:156
- iteration 13 hidden_bypass (ruled_out): SPECKIT_SKIP_OVERLAY_SYNC is printed beside every refusal; evidence=barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:142
- iteration 14 severity_escalation (ruled_out): none reaches a broken tree or bypassed gate; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:6534
- iteration 16 test_strength (ruled_out): 3 of 3 fail on the pre-fix engine; evidence=.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs:1196
- iteration 17 spec_code_alignment (ruled_out): all 19 REQ rows met; evidence=specs/system-skilled-doctor/007-overlay-framework-root-layout/006-review-remediation/spec.md:128
- iteration 17 checklist_evidence (ruled_out): all rerunnable clauses reproduce; evidence=specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/tasks.md:62

### Clean Search Proof
- iteration 1 rollback_completeness (ruled_out): every completed step is undone newest first; snapshot tests prove it; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:6420, .skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs:1208
- iteration 2 workflow_sequence (ruled_out): workflow runs apply as a second call; evidence=.skilled/commands/doctor/assets/doctor-overlay-apply.yaml:105
- iteration 3 fail_open_gate (ruled_out): blocks with exit 1 when vendored paths are staged; evidence=barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:134
- iteration 4 unevidenced_completion (ruled_out): b5a630c6efa is an ancestor of origin/main; evidence=specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/tasks.md:47
- iteration 5 sibling_escape (ruled_out): refused by the git top-level check; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:474
- iteration 6 unsafe_guidance (ruled_out): protected reads and bypass text match the engine; evidence=.skilled/skills/system-skilled-doctor/references/overlays.md:140, .skilled/commands/doctor/scripts/overlay-engine.cjs:2755
- iteration 7 fail_open_gate (ruled_out): null root refuses every write; evidence=barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:226, barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:1731
- iteration 7 test_coverage (ruled_out): real-bridge case imports the applied plugin; evidence=barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs:157
- iteration 8 unevidenced_completion (ruled_out): status, pre-commit and engine parity all match; evidence=specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/tasks.md:62
- iteration 8 doc_code_drift (ruled_out): JSDoc names framework/ and root/; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:3434
- iteration 9 comment_hygiene (ruled_out): none in added comment lines; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:6413
- iteration 10 stale_pointer (ruled_out): no engine line pointers in doctor docs; evidence=.skilled/skills/system-skilled-doctor/references/overlays.md:92
- iteration 11 record_contradiction (ruled_out): all eight rows trace; evidence=barter/ai-speckit/specs/skilled-barter-overlays/002-spec-tracks-restructure/039-overlays-framework-root-layout/implementation-summary.md:80
- iteration 11 duplication (ruled_out): three copies agree; reason recorded; evidence=barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:60, barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:177
- iteration 12 secret_exposure (ruled_out): credential scan clean; evidence=specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/goal.md:87
- iteration 12 hidden_bypass (ruled_out): bypass disclosed in limitations and goal; evidence=specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/implementation-summary.md:113
- iteration 13 fail_open_gate (ruled_out): AGENTS.md offers worktrees and core.hooksPath is shared, so it is reachable; evidence=barter/ai-speckit/AGENTS.md:222
- iteration 13 secret_exposure (ruled_out): hook prints only engine lines and the bypass name; evidence=barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:156
- iteration 13 hidden_bypass (ruled_out): SPECKIT_SKIP_OVERLAY_SYNC is printed beside every refusal; evidence=barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:142
- iteration 14 severity_escalation (ruled_out): none reaches a broken tree or bypassed gate; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:6534
- iteration 16 test_strength (ruled_out): 3 of 3 fail on the pre-fix engine; evidence=.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs:1196
- iteration 17 spec_code_alignment (ruled_out): all 19 REQ rows met; evidence=specs/system-skilled-doctor/007-overlay-framework-root-layout/006-review-remediation/spec.md:128
- iteration 17 checklist_evidence (ruled_out): all rerunnable clauses reproduce; evidence=specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/tasks.md:62

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:frontier -->
## 10B. FRONTIER
- Frontier size: 4 nodes (0 open, 0 active, 4 answered, 0 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 0
- Revisits: 0
- Budget depth1: 12 of 12 iterations spent
- Budget depth2: 0 of 8.4 iterations spent
- Budget depth3: 0 of 12 iterations spent
- Active node: none

<!-- /ANCHOR:frontier -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none - Focus area: synthesis if the stop decision allows it - Reason: core protocols adjudicated - Rotation status: complete - Required evidence: stop decision Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
