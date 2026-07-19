---
title: "Checklist: semantic rename engine (020 phase 005.001)"
description: "Blocking SOL verifier contract for the semantic rename engine: preflight safety, dependency-closure batching, exemptions, dry-run/apply state, idempotency, mode preservation, and rollback."
trigger_phrases:
  - "semantic rename engine checklist"
  - "dependency-closure rename verifier"
  - "rename engine SOL contract"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine"
    last_updated_at: "2026-07-18T07:35:59Z"
    last_updated_by: "codex"
    recent_action: "Verified all engine checks against disposable repositories"
    next_safe_action: "Use the engine report contract in the reference checker child"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Semantic Rename Engine

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 005.001. The verifier records the candidate SHA, pinned BASE
SHA, semantic-map identifier or hash, commands, exit codes, operation counts, and mode-manifest comparison. It fails on a
zero-operation or zero-fixture run, any unexpected tracked mutation, any unreported partial apply, or any real repository
migration attempt.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Evidence: `rename_engine_core.py:172` defines the map loader and imports policy from `check_no_new_snake_case.py` plus `naming_root_resolver.py`.
- [x] CHK-002 [P1] Evidence: `FixtureRepository` and `test_apply_preserves_symlink_and_executable_modes_and_is_idempotent` seed regular, symlink, executable and leading-hyphen paths; `test_mixed_extension_cycle_is_one_dependency_scc` seeds mixed extensions.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P0] Evidence: `load_semantic_map` requires explicit targets; `test_semantic_targets_are_used_without_character_substitution` proves `_common` and `__fixtures__` use reviewed targets.
- [x] CHK-004 [P0] Evidence: `rename_engine_core.py:340` computes reference-graph SCCs; `test_mixed_extension_cycle_is_one_dependency_scc` reports one TypeScript, JSON and Markdown batch.
- [x] CHK-005 [P1] Evidence: `rename_engine_core.py:287` classifies exemptions; `test_policy_exemptions_are_skipped_and_rename_misclassification_fails` verifies skip reasons.
- [x] CHK-006 [P1] Evidence: `rename_engine_core.py:119` rejects path escape and `.git`; `test_zero_file_and_outside_paths_are_hard_failures` and `test_symlink_ancestor_is_never_followed_as_a_target_path` pass.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-007 [P0] Evidence: `test_dry_run_is_repeatable_and_changes_nothing` and `test_cli_defaults_to_a_read_only_dry_run` compare content, index and status before and after.
- [x] CHK-008 [P0] Evidence: `test_exact_casefold_and_nfc_target_collisions_abort` and `test_existing_casefold_and_nfc_collisions_abort_without_writes` cover exact, casefold, NFC and combined keys.
- [x] CHK-009 [P0] Evidence: `test_apply_preserves_symlink_and_executable_modes_and_is_idempotent` records an empty mode delta for `120000` and `100755`.
- [x] CHK-010 [P0] Evidence: `test_apply_preserves_symlink_and_executable_modes_and_is_idempotent` returns `already-at-target` on the second apply call.
- [x] CHK-011 [P0] Evidence: `test_injected_failure_is_journaled_and_explicit_rollback_restores_clean_tree` records one completed move, then restores a clean tree.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-012 [P1] Evidence: `build_plan` emits every map row and `apply_plan` plus `rollback_plan` persist applied, failed and reverted journal states.
- [x] CHK-013 [P1] Evidence: each `build_plan` row includes `source`, `target`, `classification`, `batch`, `dependencies`, `state` and `reason`.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-014 [P1] Evidence: `test_zero_file_and_outside_paths_are_hard_failures` and `test_symlink_ancestor_is_never_followed_as_a_target_path` pass.
- [x] CHK-015 [P2] Evidence: `git status --short` contains only the engine, its test and child documentation plus two preserved node-version markers.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-016 [P2] Evidence: `plan.md`, `tasks.md`, `decision-record.md` and `implementation-summary.md` use the same explicit-map, SCC, dry-run, journal and rollback contract.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-017 [P1] Evidence: `semantic_rename_engine.py`, `rename_engine_core.py` and `test_semantic_rename_engine.py` are the only code paths added; no real repository path was renamed.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is accepted only when every P0 check passes, the semantic map and operation evidence are pinned, all exemption and
mode checks are visible, and the engine has been exercised in disposable repositories without touching the real migration tree.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, the operation journal can restore an applied fixture batch, and
`git diff-index --quiet HEAD --` shows no unexpected tracked mutation outside the phase scope.
<!-- /ANCHOR:sign-off -->
