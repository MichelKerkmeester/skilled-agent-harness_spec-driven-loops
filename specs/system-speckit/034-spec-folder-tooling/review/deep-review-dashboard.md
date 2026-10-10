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
- Review Target: specs/system-speckit/034-spec-folder-tooling (spec-folder)
- Started: 2026-10-09T20:38:08.524Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-10-09T20:38:08.524Z
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
| P1 (Required) | 21 |
| P2 (Suggestions) | 5 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 0.00 | 0/0/0 | complete |
| 2 | security | security | 1.00 | 0/4/0 | complete |
| 3 | traceability | traceability | 1.00 | 0/2/0 | complete |
| 4 | maintainability | maintainability | 1.00 | 0/6/1 | complete |
| 5 | correctness | correctness | 1.00 | 0/7/1 | complete |
| 6 | security (broadened second pass) | security | 0.00 | 0/7/1 | complete |
| 7 | traceability (broadened: overlay protocols) | traceability | 1.00 | 0/1/1 | complete |
| 8 | correctness (phase 016 children 001-004) | correctness | 1.00 | 0/1/0 | complete |
| 9 | correctness (phase 016 children 005-007, 009, 013-014 and phase 017 simplifications) | correctness | 0.00 | 0/0/0 | complete |
| 10 | correctness (final adversarial replay across all dimensions) | correctness/security/traceability/maintainability | 0.00 | 0/9/2 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 22 |
| security | covered | 4 |
| traceability | covered | 0 |
| maintainability | covered | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.92
- graphDecision: STOP_BLOCKED
- graphBlockers: {"count":11,"description":"Dimension coverage (67%) is below threshold (80%). 11 gap(s) found. STOP is blocked until all required dimensions have meaningful coverage.","severity":"blocking","type":"uncovered_dimensions"}

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 1.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 26
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
- candidateCoverage: covered=36, ruledOut=43, deferred=6, blocked=0

### Search Debt
- iteration 1 individual_lane_transform_edge_cases (deferred): Review individual transform boundary behavior in a later correctness pass.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:155
- iteration 2 upgrade_apply_symlink_containment (deferred): Continue the upgrade apply/move symlink boundary in a later security pass before treating it as closed.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:167, .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:230
- iteration 5 runtime_test_execution (deferred): Tests were inspected for claimed coverage but not run.; evidence=.skilled/skills/system-spec-kit/runtime/cli/tests/heal-anchor-repair.vitest.ts:381, .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:911
- iteration 6 workflow_command_log_injection (deferred): Trace the report producer and determine whether packet-controlled newlines can reach Actions workflow-command parsing.; evidence=.github/workflows/strict-pass-freshness-report.yml:149, .github/workflows/strict-pass-freshness-report.yml:150
- iteration 7 spec_code (deferred): Core spec-to-code remains pending for a later traceability pass.; evidence=UNKNOWN
- iteration 7 checklist_evidence (deferred): Checklist evidence remains pending for a later traceability pass.; evidence=UNKNOWN

### Ruled-Out Candidates
- iteration 1 manifest_scope_drift (ruled_out): No missing or extra paths.; evidence=specs/system-speckit/034-spec-folder-tooling/review/iterations/iteration-001.md:9
- iteration 1 lane_order_and_dry_run (ruled_out): No ordering or dry-run write defect found in the inspected path.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:153, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1332
- iteration 1 upgrade_reversibility (ruled_out): Before-images precede repair execution.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:364, .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:461, .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1420
- iteration 1 compat_approval_and_recovery (ruled_out): No approval-order or terminal-log defect found.; evidence=.skilled/commands/doctor/assets/doctor-update-compat-action.yaml:112, .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:125
- iteration 1 gate_and_leaf_scope (ruled_out): No gate-selection or path-scope defect appeared in inspected excerpts.; evidence=.skilled/scripts/git-hooks/lib/gates.tsv:1, .skilled/scripts/git-hooks/pre-commit:1, .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:70, .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-scopes.test.cjs:184
- iteration 1 workflow_gate_coverage (ruled_out): No silent skip found in inspected ranges.; evidence=.github/workflows/changed-packet-validation.yml:41, .github/workflows/spec-kit-check.yml:92, .github/workflows/trigger-index-rebuild.yml:83
- iteration 2 common_literal_secret_exposure (ruled_out): No common literal credential signatures or populated .env.example values were found; this does not rule out unknown formats.; evidence=.env.example:1, specs/system-speckit/034-spec-folder-tooling/review/deep-review-config.json:1
- iteration 2 workflow_shell_injection (ruled_out): The reviewed workflow interpolates SHA/event identifiers and has read-only contents permission.; evidence=.github/workflows/changed-packet-validation.yml:9, .github/workflows/changed-packet-validation.yml:45
- iteration 2 clone_controlled_hook_execution (ruled_out): The reviewed hook does not execute clone-controlled gates without a same-common-dir or explicit local trust condition.; evidence=.skilled/scripts/git-hooks/pre-commit:28, .skilled/scripts/git-hooks/pre-commit:43, .skilled/scripts/git-hooks/pre-commit:636
- iteration 3 spec_code_claim_drift (ruled_out): No additional implementation mismatch was observed in the required child set.; evidence=.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:49, .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1937, .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:181, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1360, .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:126
- iteration 3 planned_surface_or_evidence_pointer_gap (ruled_out): The resolved source/test anchors exist and the explicit unverified CI criterion remains a separate completion-evidence finding.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:39, .skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs:47, .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-scopes.test.cjs:1
- iteration 4 test_fixture_isolation (ruled_out): heal-lane-modes and repair-derived create temporary roots; doctor compatibility suites create temporary repositories and remove them in test teardown.; evidence=.skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:46, .skilled/skills/system-spec-kit/runtime/cli/tests/repair-derived.vitest.ts:29, .skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs:105, .skilled/commands/doctor/scripts/tests/doctor-update-compat-integration.test.cjs:101
- iteration 4 healer_cli_documentation_drift (ruled_out): Directly compared the selected catalog, playbook, CLI README, and changelog text against runLaneModesCli and main.; evidence=.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/heal-spec-docs-lane-modes.md:38, .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/heal-spec-docs-lane-modes.md:81, .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:116, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1360
- iteration 4 comment_hygiene_ephemeral_labels (ruled_out): No matching code-comment pattern was found in the selected source/test files.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1, .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:2, .skilled/skills/system-spec-kit/runtime/cli/tests/repair-derived.vitest.ts:2
- iteration 4 git_hook_gate_inventory_drift (ruled_out): The apparent 8-versus-13 count differs by scope: README counts all blocking pre-commit checks; the table and test count configurable gates across hooks.; evidence=.skilled/scripts/git-hooks/lib/gates.tsv:7, .skilled/commands/doctor/scripts/tests/git-hook-gates.test.cjs:47, .skilled/scripts/git-hooks/README.md:20
- iteration 5 anchor_boundary (ruled_out): No additional anchor repair or nesting defect was confirmed in the reviewed paths.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:372, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:417, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:495, .skilled/skills/system-spec-kit/runtime/cli/tests/heal-anchor-repair.vitest.ts:531, .skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts:97
- iteration 5 lane_mode_invariance (ruled_out): No additional lane-mode defect was confirmed in the selected branch and tests.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:998, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1180, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1295, .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:579, .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:834, .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:1149
- iteration 5 upgrade_reversibility (ruled_out): No additional upgrade reversibility failure was confirmed in the reviewed path.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:810, .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:835, .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:881, .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:959, .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:979, .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1006, .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1090
- iteration 5 report_aggregation (ruled_out): No additional report-total or era-classification defect was confirmed in the reviewed branches.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:343, .skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:378, .skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:418, .skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:101, .skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:217, .skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:346
- iteration 6 doctor_update_argument_injection (ruled_out): Argument arrays and explicit remote/release validation prevent the tested injection paths.; evidence=.skilled/commands/doctor/scripts/release-update.cjs:281, .skilled/commands/doctor/scripts/release-update.cjs:445, .skilled/commands/doctor/scripts/release-update.cjs:2507, .skilled/commands/doctor/scripts/release-update.cjs:2510
- iteration 6 compat_command_injection (ruled_out): No data-derived shell command was found in the compatibility invocation paths reviewed.; evidence=.skilled/commands/doctor/scripts/tests/doctor-update-compat-integration.test.cjs:35, .skilled/commands/doctor/scripts/tests/doctor-update-compat-integration.test.cjs:209, .skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs:929
- iteration 6 git_hook_gate_command_injection (ruled_out): The inspected code does not execute gate metadata or interpolate staged names as shell source.; evidence=.skilled/scripts/git-hooks/lib/gates.tsv:7, .skilled/scripts/git-hooks/lib/gate-config.sh:24, .skilled/scripts/git-hooks/lib/gate-config.sh:34, .skilled/scripts/git-hooks/pre-commit:109, .skilled/scripts/git-hooks/pre-commit:118
- iteration 6 workflow_shell_interpolation (ruled_out): No direct shell interpolation of attacker-controlled names or writable token was found in these workflows.; evidence=.github/workflows/changed-packet-validation.yml:9, .github/workflows/changed-packet-validation.yml:45, .github/workflows/changed-packet-validation.yml:117, .github/workflows/changed-packet-validation.yml:121, .github/workflows/spec-kit-check.yml:55
- iteration 6 workflow_shell_interpolation (ruled_out): Workflow data is quoted or printed to logs; it is not evaluated as shell source.; evidence=.github/workflows/strict-pass-freshness-report.yml:18, .github/workflows/strict-pass-freshness-report.yml:65, .github/workflows/strict-pass-freshness-report.yml:80, .github/workflows/strict-pass-freshness-report.yml:149, .github/workflows/strict-pass-freshness-report.yml:150
- iteration 7 anchor_integrity_catalog_drift (ruled_out): No catalog-to-code mismatch was found for anchor integrity.; evidence=.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/anchor-integrity-and-nesting-check.md:28, .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:796, .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:839, .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:109
- iteration 7 anchor_repair_catalog_drift (ruled_out): No unsupported anchor-repair behavior was found.; evidence=.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/heal-spec-docs-anchor-repair.md:32, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:417, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:597, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:616
- iteration 7 lane_modes_catalog_drift (ruled_out): No lane-mode catalog mismatch was found.; evidence=.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/heal-spec-docs-lane-modes.md:28, .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/heal-spec-docs-lane-modes.md:38, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1332, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1341, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1354, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1360
- iteration 7 playbook_capability_mismatch (ruled_out): Static contract comparison found no unsupported playbook capability.; evidence=.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-check.md:14, .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-compat.md:14, .skilled/commands/doctor/assets/doctor-update-check.yaml:16, .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:5
- iteration 7 agent_cross_runtime_drift (ruled_out): Differences are adapter-specific metadata and path references.; evidence=.codex/agents/deep-review.toml:15, .claude/agents/deep-review.md:11, .hermes/agents/deep-review.md:24, .opencode/agents/deep-review.md:24, .pi/agents/deep-review.md:18
- iteration 7 release_claim_mismatch (ruled_out): Static source comparison supported the selected claims.; evidence=.skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:47, .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:65, .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:81, .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:85, .skilled/changelog/skilled/v4.0.0.4.md:49, .skilled/changelog/skilled/v4.0.0.4.md:67, .skilled/changelog/skilled/v4.0.0.4.md:83, .skilled/changelog/skilled/v4.0.0.4.md:87
- iteration 8 template_anchor_pairing (ruled_out): Per-level openers and snapshot assertions check pairing and nesting for the rendered variants.; evidence=.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:302, .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:49
- iteration 8 phase_graph_metadata_backfill (ruled_out): The non-positive count is rejected, blank folder arguments are skipped, and missing optional inputs have warning paths.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:197, .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1002, .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts:98
- iteration 8 archive_path_rederivation (ruled_out): The selected archive and restore cases update derived paths for nested packets and phases, with explicit failure recovery behavior.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:181, .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:312, .skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts:342, .skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts:380, .skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts:411
- iteration 9 phrase_seed_consistency (ruled_out): The repair and its equality check share the deterministic seeder; no contrary phrase source was found.; evidence=specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/005-healer-phrase-seeding/spec.md:89, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:717, .skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-integration.vitest.ts:99, .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:1089
- iteration 9 provenance_stamp_evidence (ruled_out): The selected implementation and test entry point align with evidence-gated stamping; no mismatch was confirmed in this static pass.; evidence=specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/006-evidence-gated-provenance/spec.md:86, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:42, .skilled/skills/system-spec-kit/runtime/cli/tests/heal-provenance.vitest.ts:145
- iteration 9 ci_rule_set_baseline_comparison (ruled_out): The PR comparison is rule-oriented and the scheduled sweep test exercises the baseline argument path.; evidence=specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/007-ci-rule-set-comparison/spec.md:98, .github/workflows/changed-packet-validation.yml:98, .skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts:323
- iteration 9 compat_action_approval_and_failure_handling (ruled_out): The checked workflow keeps preview, explicit approval, move execution, and fail-stop handling in the specified order.; evidence=specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md:110, .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:114, .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:126
- iteration 9 anchor_nesting_and_duplicate_closer_contract (ruled_out): The validator and focused contract test are present at the spec-linked surface; no discrepancy was established in this pass.; evidence=specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment/spec.md:105, .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:784, .skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts:43
- iteration 9 gate3_menu_parity (ruled_out): The parity assertion checks the rendered menu line against the canonical constant for every listed file.; evidence=specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/014-gate-3-menu-parity/spec.md:131, .skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs:20, .skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs:46
- iteration 9 refusal_order_regression (ruled_out): The direct test pins the required deterministic refusal order.; evidence=specs/system-speckit/034-spec-folder-tooling/017-heal-cli-and-compat-yaml-simplification/spec.md:108, .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1293, .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1320
- iteration 9 removed_lane_mode_flag_callers (ruled_out): The only removed-flag mention found is a changelog warning, and no repository caller or usage line supplies either flag.; evidence=specs/system-speckit/034-spec-folder-tooling/017-heal-cli-and-compat-yaml-simplification/spec.md:109, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1360, .skilled/changelog/skilled/v4.0.0.4.md:122
- iteration 9 compat_failed_step_field_consumers (ruled_out): The old field name appears only in a negative assertion that proves its removal; consumers use the merged field.; evidence=specs/system-speckit/034-spec-folder-tooling/017-heal-cli-and-compat-yaml-simplification/spec.md:111, .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:126, .skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs:954

### Clean Search Proof
- iteration 1 manifest_scope_drift (ruled_out): No missing or extra paths.; evidence=specs/system-speckit/034-spec-folder-tooling/review/iterations/iteration-001.md:9
- iteration 1 lane_order_and_dry_run (ruled_out): No ordering or dry-run write defect found in the inspected path.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:153, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1332
- iteration 1 upgrade_reversibility (ruled_out): Before-images precede repair execution.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:364, .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:461, .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1420
- iteration 1 compat_approval_and_recovery (ruled_out): No approval-order or terminal-log defect found.; evidence=.skilled/commands/doctor/assets/doctor-update-compat-action.yaml:112, .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:125
- iteration 1 gate_and_leaf_scope (ruled_out): No gate-selection or path-scope defect appeared in inspected excerpts.; evidence=.skilled/scripts/git-hooks/lib/gates.tsv:1, .skilled/scripts/git-hooks/pre-commit:1, .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:70, .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-scopes.test.cjs:184
- iteration 1 workflow_gate_coverage (ruled_out): No silent skip found in inspected ranges.; evidence=.github/workflows/changed-packet-validation.yml:41, .github/workflows/spec-kit-check.yml:92, .github/workflows/trigger-index-rebuild.yml:83
- iteration 2 common_literal_secret_exposure (ruled_out): No common literal credential signatures or populated .env.example values were found; this does not rule out unknown formats.; evidence=.env.example:1, specs/system-speckit/034-spec-folder-tooling/review/deep-review-config.json:1
- iteration 2 workflow_shell_injection (ruled_out): The reviewed workflow interpolates SHA/event identifiers and has read-only contents permission.; evidence=.github/workflows/changed-packet-validation.yml:9, .github/workflows/changed-packet-validation.yml:45
- iteration 2 clone_controlled_hook_execution (ruled_out): The reviewed hook does not execute clone-controlled gates without a same-common-dir or explicit local trust condition.; evidence=.skilled/scripts/git-hooks/pre-commit:28, .skilled/scripts/git-hooks/pre-commit:43, .skilled/scripts/git-hooks/pre-commit:636
- iteration 3 spec_code_claim_drift (ruled_out): No additional implementation mismatch was observed in the required child set.; evidence=.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:49, .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1937, .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:181, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1360, .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:126
- iteration 3 planned_surface_or_evidence_pointer_gap (ruled_out): The resolved source/test anchors exist and the explicit unverified CI criterion remains a separate completion-evidence finding.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:39, .skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs:47, .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-scopes.test.cjs:1
- iteration 4 test_fixture_isolation (ruled_out): heal-lane-modes and repair-derived create temporary roots; doctor compatibility suites create temporary repositories and remove them in test teardown.; evidence=.skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:46, .skilled/skills/system-spec-kit/runtime/cli/tests/repair-derived.vitest.ts:29, .skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs:105, .skilled/commands/doctor/scripts/tests/doctor-update-compat-integration.test.cjs:101
- iteration 4 healer_cli_documentation_drift (ruled_out): Directly compared the selected catalog, playbook, CLI README, and changelog text against runLaneModesCli and main.; evidence=.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/heal-spec-docs-lane-modes.md:38, .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/heal-spec-docs-lane-modes.md:81, .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:116, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1360
- iteration 4 comment_hygiene_ephemeral_labels (ruled_out): No matching code-comment pattern was found in the selected source/test files.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1, .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:2, .skilled/skills/system-spec-kit/runtime/cli/tests/repair-derived.vitest.ts:2
- iteration 4 git_hook_gate_inventory_drift (ruled_out): The apparent 8-versus-13 count differs by scope: README counts all blocking pre-commit checks; the table and test count configurable gates across hooks.; evidence=.skilled/scripts/git-hooks/lib/gates.tsv:7, .skilled/commands/doctor/scripts/tests/git-hook-gates.test.cjs:47, .skilled/scripts/git-hooks/README.md:20
- iteration 5 anchor_boundary (ruled_out): No additional anchor repair or nesting defect was confirmed in the reviewed paths.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:372, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:417, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:495, .skilled/skills/system-spec-kit/runtime/cli/tests/heal-anchor-repair.vitest.ts:531, .skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts:97
- iteration 5 lane_mode_invariance (ruled_out): No additional lane-mode defect was confirmed in the selected branch and tests.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:998, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1180, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1295, .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:579, .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:834, .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:1149
- iteration 5 upgrade_reversibility (ruled_out): No additional upgrade reversibility failure was confirmed in the reviewed path.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:810, .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:835, .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:881, .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:959, .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:979, .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1006, .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1090
- iteration 5 report_aggregation (ruled_out): No additional report-total or era-classification defect was confirmed in the reviewed branches.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:343, .skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:378, .skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:418, .skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:101, .skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:217, .skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:346
- iteration 6 doctor_update_argument_injection (ruled_out): Argument arrays and explicit remote/release validation prevent the tested injection paths.; evidence=.skilled/commands/doctor/scripts/release-update.cjs:281, .skilled/commands/doctor/scripts/release-update.cjs:445, .skilled/commands/doctor/scripts/release-update.cjs:2507, .skilled/commands/doctor/scripts/release-update.cjs:2510
- iteration 6 compat_command_injection (ruled_out): No data-derived shell command was found in the compatibility invocation paths reviewed.; evidence=.skilled/commands/doctor/scripts/tests/doctor-update-compat-integration.test.cjs:35, .skilled/commands/doctor/scripts/tests/doctor-update-compat-integration.test.cjs:209, .skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs:929
- iteration 6 git_hook_gate_command_injection (ruled_out): The inspected code does not execute gate metadata or interpolate staged names as shell source.; evidence=.skilled/scripts/git-hooks/lib/gates.tsv:7, .skilled/scripts/git-hooks/lib/gate-config.sh:24, .skilled/scripts/git-hooks/lib/gate-config.sh:34, .skilled/scripts/git-hooks/pre-commit:109, .skilled/scripts/git-hooks/pre-commit:118
- iteration 6 workflow_shell_interpolation (ruled_out): No direct shell interpolation of attacker-controlled names or writable token was found in these workflows.; evidence=.github/workflows/changed-packet-validation.yml:9, .github/workflows/changed-packet-validation.yml:45, .github/workflows/changed-packet-validation.yml:117, .github/workflows/changed-packet-validation.yml:121, .github/workflows/spec-kit-check.yml:55
- iteration 6 workflow_shell_interpolation (ruled_out): Workflow data is quoted or printed to logs; it is not evaluated as shell source.; evidence=.github/workflows/strict-pass-freshness-report.yml:18, .github/workflows/strict-pass-freshness-report.yml:65, .github/workflows/strict-pass-freshness-report.yml:80, .github/workflows/strict-pass-freshness-report.yml:149, .github/workflows/strict-pass-freshness-report.yml:150
- iteration 7 anchor_integrity_catalog_drift (ruled_out): No catalog-to-code mismatch was found for anchor integrity.; evidence=.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/anchor-integrity-and-nesting-check.md:28, .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:796, .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:839, .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:109
- iteration 7 anchor_repair_catalog_drift (ruled_out): No unsupported anchor-repair behavior was found.; evidence=.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/heal-spec-docs-anchor-repair.md:32, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:417, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:597, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:616
- iteration 7 lane_modes_catalog_drift (ruled_out): No lane-mode catalog mismatch was found.; evidence=.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/heal-spec-docs-lane-modes.md:28, .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/heal-spec-docs-lane-modes.md:38, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1332, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1341, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1354, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1360
- iteration 7 playbook_capability_mismatch (ruled_out): Static contract comparison found no unsupported playbook capability.; evidence=.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-check.md:14, .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-compat.md:14, .skilled/commands/doctor/assets/doctor-update-check.yaml:16, .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:5
- iteration 7 agent_cross_runtime_drift (ruled_out): Differences are adapter-specific metadata and path references.; evidence=.codex/agents/deep-review.toml:15, .claude/agents/deep-review.md:11, .hermes/agents/deep-review.md:24, .opencode/agents/deep-review.md:24, .pi/agents/deep-review.md:18
- iteration 7 release_claim_mismatch (ruled_out): Static source comparison supported the selected claims.; evidence=.skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:47, .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:65, .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:81, .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:85, .skilled/changelog/skilled/v4.0.0.4.md:49, .skilled/changelog/skilled/v4.0.0.4.md:67, .skilled/changelog/skilled/v4.0.0.4.md:83, .skilled/changelog/skilled/v4.0.0.4.md:87
- iteration 8 template_anchor_pairing (ruled_out): Per-level openers and snapshot assertions check pairing and nesting for the rendered variants.; evidence=.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:302, .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:49
- iteration 8 phase_graph_metadata_backfill (ruled_out): The non-positive count is rejected, blank folder arguments are skipped, and missing optional inputs have warning paths.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:197, .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1002, .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts:98
- iteration 8 archive_path_rederivation (ruled_out): The selected archive and restore cases update derived paths for nested packets and phases, with explicit failure recovery behavior.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:181, .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:312, .skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts:342, .skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts:380, .skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts:411
- iteration 9 phrase_seed_consistency (ruled_out): The repair and its equality check share the deterministic seeder; no contrary phrase source was found.; evidence=specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/005-healer-phrase-seeding/spec.md:89, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:717, .skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-integration.vitest.ts:99, .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:1089
- iteration 9 provenance_stamp_evidence (ruled_out): The selected implementation and test entry point align with evidence-gated stamping; no mismatch was confirmed in this static pass.; evidence=specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/006-evidence-gated-provenance/spec.md:86, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:42, .skilled/skills/system-spec-kit/runtime/cli/tests/heal-provenance.vitest.ts:145
- iteration 9 ci_rule_set_baseline_comparison (ruled_out): The PR comparison is rule-oriented and the scheduled sweep test exercises the baseline argument path.; evidence=specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/007-ci-rule-set-comparison/spec.md:98, .github/workflows/changed-packet-validation.yml:98, .skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts:323
- iteration 9 compat_action_approval_and_failure_handling (ruled_out): The checked workflow keeps preview, explicit approval, move execution, and fail-stop handling in the specified order.; evidence=specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md:110, .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:114, .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:126
- iteration 9 anchor_nesting_and_duplicate_closer_contract (ruled_out): The validator and focused contract test are present at the spec-linked surface; no discrepancy was established in this pass.; evidence=specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment/spec.md:105, .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:784, .skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts:43
- iteration 9 gate3_menu_parity (ruled_out): The parity assertion checks the rendered menu line against the canonical constant for every listed file.; evidence=specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/014-gate-3-menu-parity/spec.md:131, .skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs:20, .skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs:46
- iteration 9 refusal_order_regression (ruled_out): The direct test pins the required deterministic refusal order.; evidence=specs/system-speckit/034-spec-folder-tooling/017-heal-cli-and-compat-yaml-simplification/spec.md:108, .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1293, .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1320
- iteration 9 removed_lane_mode_flag_callers (ruled_out): The only removed-flag mention found is a changelog warning, and no repository caller or usage line supplies either flag.; evidence=specs/system-speckit/034-spec-folder-tooling/017-heal-cli-and-compat-yaml-simplification/spec.md:109, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1360, .skilled/changelog/skilled/v4.0.0.4.md:122
- iteration 9 compat_failed_step_field_consumers (ruled_out): The old field name appears only in a negative assertion that proves its removal; consumers use the merged field.; evidence=specs/system-speckit/034-spec-folder-tooling/017-heal-cli-and-compat-yaml-simplification/spec.md:111, .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:126, .skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs:954

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 21 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 6 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
