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
- Review Target: All shipped work of the sk-code Ponytail refinement epic (specs/sk-code/011-sk-code-poinytail-based-refinement, children 002-029) plus the v4.0.0.4 release changelog (.skilled/changelog/skilled/v4.0.0.4.md): the sk-code hub and its modes and surfaces, /doctor:sk-code setup, create-skill-parent surface ordering, drift guards, hooks, skill routing, sk-git Commit-Id hooks, Pi Fast Mode, unknown-option refusals and the changelog accuracy against the tree. Scope: the 478 files in review/scope-files.txt, changed by the epic focused commits and ranked by how many of them touched each file, plus the changelog. (files)
- Started: 2026-10-14T16:51:44.000Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-10-14T16:51:44.000Z
- Parent Session: none
- Lifecycle Mode: new
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
| P2 (Suggestions) | 1 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 0.00 | 0/0/0 | complete |
| 2 | security | security | 1.00 | 0/1/0 | complete |
| 3 | traceability | traceability | 0.00 | 0/0/0 | complete |
| 4 | maintainability | maintainability | 1.00 | 0/0/1 | complete |
| 5 | correctness | correctness | 1.00 | 0/1/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 2 |
| security | covered | 1 |
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
- Last 3 ratios: 0.00 -> 1.00 -> 1.00
- convergenceScore: 0.00
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
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=10, ruledOut=11, deferred=15, blocked=2

### Search Debt
- iteration 1 commit_id_hook_enrollment (deferred): This iteration did not inspect all callers, installation paths, and first-commit cases.; evidence=.skilled/scripts/git-hooks/lib/commit-id-policy.sh:23
- iteration 1 model_default_coverage (deferred): No code finding is made from a source path outside the enumerated review file set; the named feature needs an explicit scope entry or later scoped pass.; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/030-epic-deep-review/review/scope-files.txt:1
- iteration 1 release_claim_tree_drift (deferred): A line-by-line claim-to-tree audit remains for a later review pass.; evidence=.skilled/changelog/skilled/v4.0.0.4.md:18
- iteration 1 compiled_route_surface_parity (deferred): Full front-door, manifest, and engine parity analysis is reserved for a later correctness pass.; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/030-epic-deep-review/review/scope-files.txt:441
- iteration 2 pi_fast_mode_context_boundary (deferred): The Pi Fast Mode implementation is outside the supplied review scope and was not inspected.; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/030-epic-deep-review/review/scope-files.txt:478
- iteration 3 spec_code_child_claim_drift (deferred): A full child-by-child spec-to-code pass remains outside the selected target subset for this iteration.; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity/acceptance-criteria.md:54, specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/acceptance-criteria.md:54, specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/spec.md:90
- iteration 3 checklist_evidence_gap (deferred): Not every shipped child tasks.md, acceptance-criteria.md, and implementation-summary.md was checked.; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/acceptance-criteria.md:54, specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/tasks.md:54, specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/acceptance-criteria.md:54
- iteration 3 skill_agent_route_drift (deferred): A full skill-to-agent contract comparison across supported runtime surfaces remains.; evidence=.skilled/skills/sk-code/SKILL.md:23, .codex/agents/deep-review.toml:1, .opencode/agents/deep-review.md:1, .claude/agents/deep-review.md:1, .pi/agents/deep-review.md:1, .hermes/skills/agent-deep-review/SKILL.md:1
- iteration 3 feature_catalog_code_drift (deferred): A complete feature-catalog entry audit needs a dedicated pass over catalog rows and source targets.; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/001-clone-path-and-messages/acceptance-criteria.md:58, .skilled/skills/sk-code/SKILL.md:160
- iteration 3 playbook_capability_route_gap (deferred): A full playbook scenario expected-resource reconciliation remains.; evidence=.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:14, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1487, .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:52
- iteration 3 release_changelog_tree_drift (deferred): The full v4.0.0.4 changelog-to-tree audit remains.; evidence=.skilled/changelog/skilled/v4.0.0.4.md:295, .skilled/skills/sk-code/SKILL.md:40, .skilled/skills/sk-code/hub-router.json:1
- iteration 3 commit_id_hook_traceability (blocked): The source helper is not in the current review file manifest and the prompt forbids widening the target.; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/030-epic-deep-review/review/scope-files.txt:1, specs/sk-code/011-sk-code-poinytail-based-refinement/030-epic-deep-review/review/deep-review-state.jsonl:4
- iteration 3 pi_fast_mode_traceability (blocked): The source is not in the current review file manifest and the prompt forbids widening the target.; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/030-epic-deep-review/review/scope-files.txt:1, specs/sk-code/011-sk-code-poinytail-based-refinement/030-epic-deep-review/review/deep-review-state.jsonl:2
- iteration 4 cross_surface_projection_maintenance (deferred): A separate pass should trace all surface maps and their drift guards before judging maintenance cost.; evidence=.skilled/skills/sk-code/SKILL.md:55, .skilled/skills/sk-code/ROUTER.md:309
- iteration 5 release_claim_tree_accuracy (deferred): Requires a separate claim-to-tree pass across the release entry.; evidence=.skilled/changelog/skilled/v4.0.0.4.md:277, specs/sk-code/011-sk-code-poinytail-based-refinement/018-create-sh-unknown-options/spec.md:99
- iteration 5 commit_id_policy_validation (deferred): A separately scoped manifest is required before reading the helper.; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/030-epic-deep-review/review/deep-review-strategy.md:118, specs/sk-code/011-sk-code-poinytail-based-refinement/030-epic-deep-review/review/deep-review-strategy.md:121
- iteration 5 pi_fast_mode_model_default (deferred): A separately scoped manifest is required before reviewing the source.; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/030-epic-deep-review/review/deep-review-strategy.md:153, specs/sk-code/011-sk-code-poinytail-based-refinement/030-epic-deep-review/review/deep-review-strategy.md:161

### Ruled-Out Candidates
- iteration 1 unknown_option_fail_open (ruled_out): The inspected branch exits before any later scaffold handling.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:351
- iteration 1 doctor_probe_false_positive (ruled_out): The setup judge verifies the parsed decision and explicitly rejects legacy serving.; evidence=.skilled/commands/doctor/scripts/sk-code-setup-check.cjs:182, .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:245
- iteration 1 surface_tie_order_false_negative (ruled_out): No false-negative was found for the check's declared ordering case; missing-native and broader router invariants were not adjudicated here.; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1165
- iteration 2 compiled_route_hub_path_traversal (ruled_out): The inspected loader rejects unknown hub IDs before path construction or require.; evidence=.skilled/bin/compiled-route.cjs:41-59, .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:55-85
- iteration 2 setup_probe_command_injection (ruled_out): spawnSync is called with an argv array and no shell option.; evidence=.skilled/commands/doctor/scripts/sk-code-setup-check.cjs:76-87, .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:138-141
- iteration 2 native_bridge_input_or_environment_leak (ruled_out): The inspected call passes serialized input via stdin and filters environment keys through NATIVE_BRIDGE_ENV_ALLOWLIST.; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:664-722
- iteration 3 sk-code_mode_surface_projection (ruled_out): The current prose, registry, and router agree on the selected mode/surface projection.; evidence=.skilled/skills/sk-code/SKILL.md:15, .skilled/skills/sk-code/SKILL.md:40, .skilled/skills/sk-code/mode-registry.json:1, .skilled/skills/sk-code/hub-router.json:1, .skilled/skills/sk-code/ROUTER.md:37
- iteration 3 scope_manifest_duplicate_target (ruled_out): No repeated path appeared.; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/030-epic-deep-review/review/scope-files.txt:1, specs/sk-code/011-sk-code-poinytail-based-refinement/030-epic-deep-review/review/scope-files.txt:2
- iteration 4 probe_input_shell_execution (ruled_out): Direct inspection confirms argv-based spawning; the finding is limited to the string displayed for humans.; evidence=.skilled/commands/doctor/scripts/sk-code-setup-check.cjs:77, .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:80, .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:140
- iteration 5 unknown_option_multichar_refusal (ruled_out): Static branch and regression assertions agree for --goal.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:351, .skilled/skills/system-spec-kit/runtime/cli/tests/create-unknown-options.vitest.ts:60
- iteration 5 valid_option_preservation (ruled_out): Existing happy-path assertions cover --with-goal.; evidence=.skilled/skills/system-spec-kit/runtime/cli/tests/create-unknown-options.vitest.ts:71, .skilled/skills/system-spec-kit/runtime/cli/tests/create-unknown-options.vitest.ts:78

### Clean Search Proof
- iteration 1 unknown_option_fail_open (ruled_out): The inspected branch exits before any later scaffold handling.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:351
- iteration 1 doctor_probe_false_positive (ruled_out): The setup judge verifies the parsed decision and explicitly rejects legacy serving.; evidence=.skilled/commands/doctor/scripts/sk-code-setup-check.cjs:182, .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:245
- iteration 1 surface_tie_order_false_negative (ruled_out): No false-negative was found for the check's declared ordering case; missing-native and broader router invariants were not adjudicated here.; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1165
- iteration 2 compiled_route_hub_path_traversal (ruled_out): The inspected loader rejects unknown hub IDs before path construction or require.; evidence=.skilled/bin/compiled-route.cjs:41-59, .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:55-85
- iteration 2 setup_probe_command_injection (ruled_out): spawnSync is called with an argv array and no shell option.; evidence=.skilled/commands/doctor/scripts/sk-code-setup-check.cjs:76-87, .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:138-141
- iteration 2 native_bridge_input_or_environment_leak (ruled_out): The inspected call passes serialized input via stdin and filters environment keys through NATIVE_BRIDGE_ENV_ALLOWLIST.; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:664-722
- iteration 3 sk-code_mode_surface_projection (ruled_out): The current prose, registry, and router agree on the selected mode/surface projection.; evidence=.skilled/skills/sk-code/SKILL.md:15, .skilled/skills/sk-code/SKILL.md:40, .skilled/skills/sk-code/mode-registry.json:1, .skilled/skills/sk-code/hub-router.json:1, .skilled/skills/sk-code/ROUTER.md:37
- iteration 3 scope_manifest_duplicate_target (ruled_out): No repeated path appeared.; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/030-epic-deep-review/review/scope-files.txt:1, specs/sk-code/011-sk-code-poinytail-based-refinement/030-epic-deep-review/review/scope-files.txt:2
- iteration 4 probe_input_shell_execution (ruled_out): Direct inspection confirms argv-based spawning; the finding is limited to the string displayed for humans.; evidence=.skilled/commands/doctor/scripts/sk-code-setup-check.cjs:77, .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:80, .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:140
- iteration 5 unknown_option_multichar_refusal (ruled_out): Static branch and regression assertions agree for --goal.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:351, .skilled/skills/system-spec-kit/runtime/cli/tests/create-unknown-options.vitest.ts:60
- iteration 5 valid_option_preservation (ruled_out): Existing happy-path assertions cover --with-goal.; evidence=.skilled/skills/system-spec-kit/runtime/cli/tests/create-unknown-options.vitest.ts:71, .skilled/skills/system-spec-kit/runtime/cli/tests/create-unknown-options.vitest.ts:78

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- Claim-adjudication gate last failed at run 5 (missing packets: R5-P1-001). STOP is vetoed until every active P0/P1 has a typed claim-adjudication packet.
- 17 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
