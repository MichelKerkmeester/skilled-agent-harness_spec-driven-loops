---
title: "Checklist: fixture corpus and dry-run harness (020 phase 005.003)"
description: "Blocking SOL verifier contract for deterministic disposable fixtures, engine/checker dry runs, exemption and collision coverage, reference ledger completeness, idempotency, rollback, and real-worktree safety."
trigger_phrases:
  - "fixture corpus checklist"
  - "dry-run harness verifier"
  - "pre-migration tooling SOL contract"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness"
    last_updated_at: "2026-07-18T08:32:34Z"
    last_updated_by: "codex"
    recent_action: "Verified and signed off the fixture corpus"
    next_safe_action: "Use the evidence hash before freezing the repository map"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/rename_tooling_fixture_core.py"
      - ".opencode/skills/sk-doc/shared/scripts/rename_tooling_fixture_harness.py"
      - ".opencode/skills/sk-doc/scripts/tests/test_rename_tooling_fixture_harness.py"
      - ".opencode/skills/sk-doc/scripts/tests/fixtures/rename-tooling/corpus.json"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Fixture Corpus and Dry-Run Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 005.003. The verifier records the candidate SHA, BASE SHA,
scenario seed or corpus version, scenario counts, commands, exit codes, plan and ledger hashes, fixture baseline manifests, and
the real-worktree before/after status. It fails on missing scenario classes, zero executed scenarios, unexpected writes outside a
temporary repository, non-deterministic evidence, or a harness apply against the real migration worktree.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `semantic-rename-tooling-fixtures-v1` pins BASE `1ec0ad2947b19ac3053c7b031b7d43e67bf42bbe`, explicit map rows, plan identity, ledger evidence and failure states.
- [x] CHK-002 [P1] `test_corpus_declares_a_non_zero_explicit_scenario_matrix` passes with 10/10 declared scenarios and the complete coverage contract.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P0] `corpus.json` declares map rows, SCC members, exemptions, reference sites, dynamic sites and expected outcomes for every scenario.
- [x] CHK-004 [P1] `test_explicit_apply_and_rollback_remain_inside_disposable_repositories` and `test_boundary_and_flag_guards_fail_before_fixture_mutation` pass.
- [x] CHK-005 [P1] The `m-python`, `m-python-package`, `m-vendor`, `m-generated`, `m-lockfile`, `m-tool`, `m-test-magic` and `m-frozen` rows remain non-rename classifications.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-006 [P0] `test_explicit_apply_and_rollback_remain_inside_disposable_repositories` preserves `120000` and `100755`; the 10/10 corpus includes exact, casefold, NFC and mixed-extension SCC cases.
- [x] CHK-007 [P0] `test_default_cli_is_dry_run_deterministic_and_non_mutating` passes and the final report records `protected_unchanged=true`.
- [x] CHK-008 [P0] `test_explicit_apply_and_rollback_remain_inside_disposable_repositories` applies and rolls back both rename and rewrite plans, records an idempotent rerun and restores the baseline.
- [x] CHK-009 [P0] The final ledger records 7/7 static reference kinds plus three dispositioned dynamic sites.
- [x] CHK-010 [P0] The 10/10 scenario run includes exact, casefold and NFC collision failures, missing source, ambiguous reference, undispositioned dynamic site and zero-file scan failures.
- [x] CHK-011 [P1] The final repeat produced 2/2 identical hashes: `9284358d8df93d56f152c0f3b000ddfd32320e263755fa8b8364b6cd6f161b7a`.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-012 [P1] The report records `plan_id`, `rewrite_plan_id`, `map_hash`, `ledger_hash`, scenario results, scan counts and mode states for phase 006.
- [x] CHK-013 [P1] The final lifecycle scan records 29 tracked files, 28 regular files, one symlink and 7/7 static reference kinds.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-014 [P1] `test_boundary_and_flag_guards_fail_before_fixture_mutation` rejects protected, outside-root and rollback-only requests without executing fixture content.
- [x] CHK-015 [P2] Executable changes are limited to `rename_tooling_fixture_core.py`, `rename_tooling_fixture_harness.py`, their test and declarative corpus.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-016 [P2] `spec.md`, `plan.md` and `tasks.md` use the same explicit-map, fixed-seed, disposable-repository and no-real-migration contract.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-017 [P1] `rename_tooling_fixture_*.py`, `test_rename_tooling_fixture_harness.py`, `fixtures/rename-tooling/corpus.json` and this child packet are the only authored scope. No real rename or rewrite ran.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is accepted only when every P0 scenario and safety check passes, repeated seeded runs are deterministic, rollback
restores the fixture baseline, and the real migration worktree remains untouched.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, the scenario evidence is non-empty and reproducible, and
`git diff-index --quiet HEAD --` shows no unexpected tracked mutation outside the phase scope.
<!-- /ANCHOR:sign-off -->
