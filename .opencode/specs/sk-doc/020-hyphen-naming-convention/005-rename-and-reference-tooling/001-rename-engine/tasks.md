---
title: "Tasks: semantic rename engine (020 phase 005.001)"
description: "Tasks for the semantic rename engine: explicit map validation, dependency-closure batching, exemption-aware preflight, dry-run/apply state, idempotency, mode preservation, and rollback."
trigger_phrases:
  - "semantic rename engine tasks"
  - "dependency-closure rename tasks"
  - "git-mv rollback tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine"
    last_updated_at: "2026-07-18T07:35:59Z"
    last_updated_by: "codex"
    recent_action: "Completed the engine and disposable-repository tests"
    next_safe_action: "Hand the dry-run report schema to the reference checker child"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Task evidence must come from disposable repositories or read-only plan output, never from a real migration run."
---
# Tasks: Semantic Rename Engine

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the semantic map fields, path normalization rules and operation states in `rename_engine_core.py:172` and `rename_engine_core.py:622`.
- [x] T002 Define the exemption classifier in `rename_engine_core.py:287` with imported guard and resolver policy.
- [x] T003 [P] Seed disposable Git repositories through `FixtureRepository` in `test_semantic_rename_engine.py:37`.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Validate explicit paths and collision keys in `rename_engine_core.py:119`, `rename_engine_core.py:153` and `rename_engine_core.py:462`.
- [x] T005 Build SCC batches in `rename_engine_core.py:340` and `rename_engine_core.py:382`.
- [x] T006 Emit exemption reasons through `rename_engine_core.py:287` and `build_plan` report rows.
- [x] T007 Keep the CLI dry-run default in `semantic_rename_engine.py:66`; only `--apply` reaches `apply_plan`.
- [x] T008 Compare tracked mode manifests in `rename_engine_core.py:584`; fixture evidence covers `120000` and `100755`.
- [x] T009 Journal low-level inverses in `rename_engine_core.py:918` and replay them in `rename_engine_core.py:1075`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Verify: `test_dry_run_is_repeatable_and_changes_nothing` and `test_cli_defaults_to_a_read_only_dry_run` pass.
- [x] T011 Verify: `test_mixed_extension_cycle_is_one_dependency_scc` passes.
- [x] T012 Verify: `test_exact_casefold_and_nfc_target_collisions_abort`, `test_existing_casefold_and_nfc_collisions_abort_without_writes` and semantic-target fixtures pass.
- [x] T013 Verify: `test_policy_exemptions_are_skipped_and_rename_misclassification_fails` passes.
- [x] T014 Verify: `test_apply_preserves_symlink_and_executable_modes_and_is_idempotent` passes.
- [x] T015 Verify: `test_injected_failure_is_journaled_and_explicit_rollback_restores_clean_tree` passes.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All engine tasks have evidence in `checklist.md`.
- [x] All requirements in `spec.md` have named fixture coverage.
- [x] The report exposes a row for every map entry plus ordered SCC batch membership.
- [x] All mutating evidence ran inside `FixtureRepository`; the worktree received no migration rename.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verifier contract**: See `checklist.md`
- **Engine decisions**: See `decision-record.md`
- **Parent map**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
