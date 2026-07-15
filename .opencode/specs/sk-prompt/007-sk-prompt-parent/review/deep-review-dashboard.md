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
- Review Target: .opencode/specs/sk-prompt/007-sk-prompt-parent (spec-folder)
- Started: 2026-07-09T17:30:43.446Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-07-09T17:30:43.446Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 6 |
| P2 (Suggestions) | 4 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-001 | correctness | correctness | 1.00 | 0/1/1 | complete |
| run-002 | security | security | 0.45 | 0/1/0 | complete |
| run-003 | traceability | traceability | 0.25 | 0/0/1 | complete |
| run-004 | maintainability | maintainability | 0.20 | 0/1/0 | complete |
| run-005 | correctness | correctness | 0.00 | 0/0/0 | complete |
| run-006 | security | security | 0.25 | 0/1/0 | complete |
| run-007 | traceability | traceability | 0.17 | 0/1/0 | complete |
| run-008 | maintainability | maintainability | 0.22 | 0/0/2 | complete |
| run-009 | correctness | correctness | 0.10 | 0/1/0 | complete |
| run-010 | security | security | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 10 |
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
- graphConvergenceScore: 0.40
- graphDecision: STOP_BLOCKED
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.22 -> 0.10 -> 0.00
- convergenceScore: 1.00
- openFindings: 10
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
- candidateCoverage: covered=21, ruledOut=21, deferred=7, blocked=2

### Search Debt
- iteration 2 playbook_capability_security_coverage (deferred): Defer broader playbook capability coverage to traceability or maintainability dimension.; evidence=.opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/manual_testing_playbook.md:59
- iteration 5 bundle_route_gap (deferred): author a bundle gold scenario before severity escalation; evidence=.opencode/skills/sk-prompt/hub-router.json:8-14, .opencode/skills/sk-prompt/benchmark/router-final/skill-benchmark-report.json:108-117
- iteration 7 checklist_evidence_gap (blocked): checklist artifact absent by documented Level-1 phase decision; evidence=.opencode/specs/sk-prompt/007-sk-prompt-parent/008-cutover-and-rollout/implementation-summary.md:118-122, .opencode/specs/sk-prompt/007-sk-prompt-parent/008-cutover-and-rollout/implementation-summary.md:118-122
- iteration 8 benchmark_followup_clarity (deferred): covered as benchmark hardening follow-up, not an additional iteration-008 finding; evidence=.opencode/skills/sk-prompt/benchmark/BENCHMARK-SUMMARY.md:41-47
- iteration 9 active_model_index_drift (deferred): duplicate-class maintainer-doc drift already registered; evidence=.opencode/specs/sk-prompt/007-sk-prompt-parent/review/deep-review-findings-registry.json:214-228
- iteration 10 path_traversal (deferred): covered by active findings R2-P1-001 and R6-P1-001; evidence=.opencode/specs/sk-prompt/007-sk-prompt-parent/review/deep-review-findings-registry.json:40-67, .opencode/specs/sk-prompt/007-sk-prompt-parent/review/deep-review-findings-registry.json:97-124, .opencode/commands/prompt-improve.md:437-457

### Ruled-Out Candidates
- iteration 1 hub_router_contract (ruled_out): Direct reads show registry and router match the approved two-workflow-mode contract.; evidence=.opencode/skills/sk-prompt/SKILL.md:32-85, .opencode/skills/sk-prompt/mode-registry.json:16-40, .opencode/skills/sk-prompt/hub-router.json:4-26
- iteration 2 prompt_injection_execution_boundary (ruled_out): Verified by direct reads of both runtime agent definitions.; evidence=.opencode/agents/prompt-improver.md:6-19, .opencode/agents/prompt-improver.md:101-103, .opencode/agents/prompt-improver.md:151-158, .claude/agents/prompt-improver.md:1-5, .claude/agents/prompt-improver.md:86-88, .claude/agents/prompt-improver.md:136-143
- iteration 2 router_resource_path_escape (ruled_out): Verified skill-root relative path guards by direct read.; evidence=.opencode/skills/sk-prompt/SKILL.md:47-57, .opencode/skills/sk-prompt/SKILL.md:151-156, .opencode/skills/sk-prompt/prompt-models/SKILL.md:136-140
- iteration 2 readonly_packet_mutation (ruled_out): Verified by direct read of registry and packet rules.; evidence=.opencode/skills/sk-prompt/mode-registry.json:29-40, .opencode/skills/sk-prompt/prompt-models/SKILL.md:234-240
- iteration 3 spec_code_mismatch (ruled_out): verified by direct read and glob; evidence=.opencode/specs/sk-prompt/007-sk-prompt-parent/spec.md:88-93, .opencode/skills/sk-prompt/SKILL.md:20-23, .opencode/skills/sk-prompt/mode-registry.json:16-40, .opencode/skills/sk-prompt/hub-router.json:4-27
- iteration 3 overlay_playbook_capability (ruled_out): live playbook files and spec decision align; evidence=.opencode/skills/sk-prompt/manual_testing_playbook/manual_testing_playbook.md:23-48
- iteration 4 stale_runtime_agent_reference (ruled_out): duplicate of R1-P1-001; evidence=.opencode/agents/prompt-improver.md:62-83, .claude/agents/prompt-improver.md:47-68
- iteration 4 playbook_capability_gap (ruled_out): playbook scope is routing behavior, not packet permission metadata parity; evidence=.opencode/skills/sk-prompt/manual_testing_playbook/manual_testing_playbook.md:23-41
- iteration 5 router_contract_drift (ruled_out): direct file and benchmark evidence showed the guard remains in place; evidence=.opencode/skills/sk-prompt/hub-router.json:16-25, .opencode/skills/sk-prompt/benchmark/router-final/skill-benchmark-report.md:40-45, .opencode/skills/sk-prompt/benchmark/live-final/skill-benchmark-report.md:40-45
- iteration 5 benchmark_claim_mismatch (ruled_out): no new contradiction beyond already-registered advisory; evidence=.opencode/skills/sk-prompt/benchmark/BENCHMARK-SUMMARY.md:12-16, .opencode/skills/sk-prompt/benchmark/BENCHMARK-SUMMARY.md:41-47, .opencode/skills/sk-prompt/benchmark/live-final/skill-benchmark-report.json:29-60
- iteration 5 metadata_rollup_drift (ruled_out): direct read found the folded edge and single-identity contract intact; evidence=.opencode/skills/sk-prompt/graph-metadata.json:6-19, .opencode/skills/sk-prompt/SKILL.md:104-107
- iteration 6 prompt_injection_execution_boundary (ruled_out): verified by direct reads of both runtime agent definitions; evidence=.opencode/agents/prompt-improver.md:1-19, .opencode/agents/prompt-improver.md:101-103, .opencode/agents/prompt-improver.md:151-158, .claude/agents/prompt-improver.md:1-5, .claude/agents/prompt-improver.md:86-88, .claude/agents/prompt-improver.md:136-143
- iteration 6 router_resource_path_escape (ruled_out): verified by direct read of router/resource guard pseudocode; evidence=.opencode/skills/sk-prompt/SKILL.md:47-57, .opencode/skills/sk-prompt/prompt-improve/SKILL.md:151-156, .opencode/skills/sk-prompt/hub-router.json:13-18
- iteration 6 readonly_packet_mutation (ruled_out): verified by direct read of registry tool surfaces; evidence=.opencode/skills/sk-prompt/mode-registry.json:16-40
- iteration 7 spec_code_mismatch (ruled_out): direct read found correct packet-local references; evidence=.opencode/skills/sk-prompt/prompt-improve/SKILL.md:76-99, .opencode/skills/sk-prompt/prompt-improve/README.md:213-221
- iteration 7 hub_router_contract (ruled_out): direct read confirms registry/router/graph identity alignment; evidence=.opencode/skills/sk-prompt/SKILL.md:32-85, .opencode/skills/sk-prompt/mode-registry.json:16-40, .opencode/skills/sk-prompt/hub-router.json:16-27, .opencode/skills/sk-prompt/graph-metadata.json:127-136
- iteration 8 router_contract_drift (ruled_out): direct reads show router metadata remains coherent; evidence=.opencode/skills/sk-prompt/SKILL.md:32-85, .opencode/skills/sk-prompt/mode-registry.json:16-40, .opencode/skills/sk-prompt/hub-router.json:16-27
- iteration 8 duplicate_relation_docs (ruled_out): boundary remains understandable and lower than P2 threshold for this review; evidence=.opencode/skills/sk-prompt/prompt-improve/README.md:143-158
- iteration 9 router_contract_drift (ruled_out): direct reads match the approved two-mode hub contract; evidence=.opencode/skills/sk-prompt/SKILL.md:32-85, .opencode/skills/sk-prompt/mode-registry.json:16-40, .opencode/skills/sk-prompt/hub-router.json:16-27
- iteration 9 stale_command_path (ruled_out): covered by R1-P1-001; evidence=.opencode/agents/prompt-improver.md:62-83, .claude/agents/prompt-improver.md:47-68, .opencode/specs/sk-prompt/007-sk-prompt-parent/review/deep-review-findings-registry.json:10-38
- iteration 10 secret_exposure (ruled_out): verified by scoped Grep with direct placeholder evidence; evidence=.opencode/skills/sk-prompt/prompt-models/references/vision-audit-benchmark.md:28
- iteration 10 resource_escape (ruled_out): guard present in both hub and packet pseudocode; evidence=.opencode/skills/sk-prompt/SKILL.md:47-57, .opencode/skills/sk-prompt/prompt-improve/SKILL.md:151-156
- iteration 10 agent_boundary_escape (ruled_out): permissions and rules deny mutation/execution paths; evidence=.opencode/agents/prompt-improver.md:6-19, .opencode/agents/prompt-improver.md:151-160, .claude/agents/prompt-improver.md:1-5, .claude/agents/prompt-improver.md:136-147

### Clean Search Proof
- iteration 1 hub_router_contract (ruled_out): Direct reads show registry and router match the approved two-workflow-mode contract.; evidence=.opencode/skills/sk-prompt/SKILL.md:32-85, .opencode/skills/sk-prompt/mode-registry.json:16-40, .opencode/skills/sk-prompt/hub-router.json:4-26
- iteration 2 prompt_injection_execution_boundary (ruled_out): Verified by direct reads of both runtime agent definitions.; evidence=.opencode/agents/prompt-improver.md:6-19, .opencode/agents/prompt-improver.md:101-103, .opencode/agents/prompt-improver.md:151-158, .claude/agents/prompt-improver.md:1-5, .claude/agents/prompt-improver.md:86-88, .claude/agents/prompt-improver.md:136-143
- iteration 2 router_resource_path_escape (ruled_out): Verified skill-root relative path guards by direct read.; evidence=.opencode/skills/sk-prompt/SKILL.md:47-57, .opencode/skills/sk-prompt/SKILL.md:151-156, .opencode/skills/sk-prompt/prompt-models/SKILL.md:136-140
- iteration 2 readonly_packet_mutation (ruled_out): Verified by direct read of registry and packet rules.; evidence=.opencode/skills/sk-prompt/mode-registry.json:29-40, .opencode/skills/sk-prompt/prompt-models/SKILL.md:234-240
- iteration 3 spec_code_mismatch (ruled_out): verified by direct read and glob; evidence=.opencode/specs/sk-prompt/007-sk-prompt-parent/spec.md:88-93, .opencode/skills/sk-prompt/SKILL.md:20-23, .opencode/skills/sk-prompt/mode-registry.json:16-40, .opencode/skills/sk-prompt/hub-router.json:4-27
- iteration 3 overlay_playbook_capability (ruled_out): live playbook files and spec decision align; evidence=.opencode/skills/sk-prompt/manual_testing_playbook/manual_testing_playbook.md:23-48
- iteration 4 stale_runtime_agent_reference (ruled_out): duplicate of R1-P1-001; evidence=.opencode/agents/prompt-improver.md:62-83, .claude/agents/prompt-improver.md:47-68
- iteration 4 playbook_capability_gap (ruled_out): playbook scope is routing behavior, not packet permission metadata parity; evidence=.opencode/skills/sk-prompt/manual_testing_playbook/manual_testing_playbook.md:23-41
- iteration 4 feature_catalog_code (not_applicable): feature catalog file absent from declared scope; evidence=.opencode/specs/sk-prompt/007-sk-prompt-parent/review/deep-review-config.json:18-91
- iteration 5 router_contract_drift (ruled_out): direct file and benchmark evidence showed the guard remains in place; evidence=.opencode/skills/sk-prompt/hub-router.json:16-25, .opencode/skills/sk-prompt/benchmark/router-final/skill-benchmark-report.md:40-45, .opencode/skills/sk-prompt/benchmark/live-final/skill-benchmark-report.md:40-45
- iteration 5 benchmark_claim_mismatch (ruled_out): no new contradiction beyond already-registered advisory; evidence=.opencode/skills/sk-prompt/benchmark/BENCHMARK-SUMMARY.md:12-16, .opencode/skills/sk-prompt/benchmark/BENCHMARK-SUMMARY.md:41-47, .opencode/skills/sk-prompt/benchmark/live-final/skill-benchmark-report.json:29-60
- iteration 5 metadata_rollup_drift (ruled_out): direct read found the folded edge and single-identity contract intact; evidence=.opencode/skills/sk-prompt/graph-metadata.json:6-19, .opencode/skills/sk-prompt/SKILL.md:104-107
- iteration 6 prompt_injection_execution_boundary (ruled_out): verified by direct reads of both runtime agent definitions; evidence=.opencode/agents/prompt-improver.md:1-19, .opencode/agents/prompt-improver.md:101-103, .opencode/agents/prompt-improver.md:151-158, .claude/agents/prompt-improver.md:1-5, .claude/agents/prompt-improver.md:86-88, .claude/agents/prompt-improver.md:136-143
- iteration 6 router_resource_path_escape (ruled_out): verified by direct read of router/resource guard pseudocode; evidence=.opencode/skills/sk-prompt/SKILL.md:47-57, .opencode/skills/sk-prompt/prompt-improve/SKILL.md:151-156, .opencode/skills/sk-prompt/hub-router.json:13-18
- iteration 6 readonly_packet_mutation (ruled_out): verified by direct read of registry tool surfaces; evidence=.opencode/skills/sk-prompt/mode-registry.json:16-40
- iteration 7 spec_code_mismatch (ruled_out): direct read found correct packet-local references; evidence=.opencode/skills/sk-prompt/prompt-improve/SKILL.md:76-99, .opencode/skills/sk-prompt/prompt-improve/README.md:213-221
- iteration 7 hub_router_contract (ruled_out): direct read confirms registry/router/graph identity alignment; evidence=.opencode/skills/sk-prompt/SKILL.md:32-85, .opencode/skills/sk-prompt/mode-registry.json:16-40, .opencode/skills/sk-prompt/hub-router.json:16-27, .opencode/skills/sk-prompt/graph-metadata.json:127-136
- iteration 8 router_contract_drift (ruled_out): direct reads show router metadata remains coherent; evidence=.opencode/skills/sk-prompt/SKILL.md:32-85, .opencode/skills/sk-prompt/mode-registry.json:16-40, .opencode/skills/sk-prompt/hub-router.json:16-27
- iteration 8 duplicate_relation_docs (ruled_out): boundary remains understandable and lower than P2 threshold for this review; evidence=.opencode/skills/sk-prompt/prompt-improve/README.md:143-158
- iteration 9 router_contract_drift (ruled_out): direct reads match the approved two-mode hub contract; evidence=.opencode/skills/sk-prompt/SKILL.md:32-85, .opencode/skills/sk-prompt/mode-registry.json:16-40, .opencode/skills/sk-prompt/hub-router.json:16-27
- iteration 9 stale_command_path (ruled_out): covered by R1-P1-001; evidence=.opencode/agents/prompt-improver.md:62-83, .claude/agents/prompt-improver.md:47-68, .opencode/specs/sk-prompt/007-sk-prompt-parent/review/deep-review-findings-registry.json:10-38
- iteration 10 secret_exposure (ruled_out): verified by scoped Grep with direct placeholder evidence; evidence=.opencode/skills/sk-prompt/prompt-models/references/vision-audit-benchmark.md:28
- iteration 10 resource_escape (ruled_out): guard present in both hub and packet pseudocode; evidence=.opencode/skills/sk-prompt/SKILL.md:47-57, .opencode/skills/sk-prompt/prompt-improve/SKILL.md:151-156
- iteration 10 agent_boundary_escape (ruled_out): permissions and rules deny mutation/execution paths; evidence=.opencode/agents/prompt-improver.md:6-19, .opencode/agents/prompt-improver.md:151-160, .claude/agents/prompt-improver.md:1-5, .claude/agents/prompt-improver.md:136-147

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 6 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 6 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
