---
title: "Tasks: fixture corpus and dry-run harness (020 phase 005.003)"
description: "Tasks for deterministic disposable fixtures and a dry-run harness covering engine plans, exemptions, collisions, references, dynamic sites, idempotency, rollback, and zero-scan failure."
trigger_phrases:
  - "fixture corpus tasks"
  - "dry-run harness tasks"
  - "rename tooling scenario tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness"
    last_updated_at: "2026-07-18T08:32:34Z"
    last_updated_by: "codex"
    recent_action: "Completed the fixture corpus and dry-run tasks"
    next_safe_action: "Use the verified report as phase 006 input evidence"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/rename_tooling_fixture_core.py"
      - ".opencode/skills/sk-doc/shared/scripts/rename_tooling_fixture_harness.py"
      - ".opencode/skills/sk-doc/scripts/tests/test_rename_tooling_fixture_harness.py"
      - ".opencode/skills/sk-doc/scripts/tests/fixtures/rename-tooling/corpus.json"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The harness has no apply path to the real migration worktree."
---
# Tasks: Fixture Corpus and Dry-Run Harness

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

- [x] T001 Define the scenario schema, deterministic seed, expected outcome fields, and baseline path/content/mode manifest. Evidence: `corpus.json` and `snapshot_git_worktree`.
- [x] T002 Create the disposable Git repository lifecycle with a hard boundary that excludes the real migration worktree. Evidence: `FixtureRepository` and `assert_fixture_boundary`.
- [x] T003 [P] Add single-purpose fixtures for semantic targets, dependency closure, symlink mode `120000`, executable bits, and policy exemptions. Evidence: `semantic-lifecycle`.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add exact, case-folded, NFC, leading-underscore, and double-underscore collision scenarios. Evidence: `collision-exact`, `collision-casefold` and `collision-nfc`.
- [x] T005 Add JS/TS, Markdown, JSON/YAML/TOML path-value, shell, registry, symlink, and dynamic-site reference scenarios. Evidence: `7/7` static kinds plus three dynamic sites.
- [x] T006 Add dry-run, explicit apply, idempotent rerun, rollback, missing-target, ambiguous-reference, and zero-scan scenarios. Evidence: `10/10` scenarios pass.
- [x] T007 Implement runners and assertions for plan output, ledger rows, exit codes, content, names, modes, and Git status. Evidence: `rename_tooling_fixture_core.py`.
- [x] T008 Add repeated-seed comparison so plans, ledgers, counts, and outcomes are deterministic. Evidence: `repeat_hashes` contains two equal values.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify: The full fixture matrix covers every supported engine/checker reference and exemption class. Evidence: `test_corpus_declares_a_non_zero_explicit_scenario_matrix`.
- [x] T010 Verify: Dry-run leaves the disposable repository and real worktree unchanged; explicit apply is confined to the disposable repository. Evidence: `test_default_cli_is_dry_run_deterministic_and_non_mutating`.
- [x] T011 Verify: Apply, rerun, and rollback restore the fixture baseline and preserve symlink and executable semantics. Evidence: `test_explicit_apply_and_rollback_remain_inside_disposable_repositories`.
- [x] T012 Verify: Collision, missing-target, ambiguous-reference, undispositioned dynamic-site, and zero-scan scenarios fail non-zero for the intended reason. Evidence: `10/10` scenario results match their expected states.
- [x] T013 Verify: Two runs from the same seed produce identical plans, ledger statuses, counts, and exit codes. Evidence: `9284358d8df93d56f152c0f3b000ddfd32320e263755fa8b8364b6cd6f161b7a`.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All harness tasks complete with evidence in the phase checklist. Evidence: `17/17` checklist items are complete.
- [x] All requirements in `spec.md` meet their acceptance criteria. Evidence: `REQ-001` through `REQ-007` are covered by named tests.
- [x] The harness is ready to validate phase 005 tooling before phase 006 freezes the repository map. Evidence: `evidence_hash` is stable across repeats.
- [x] No real migration rename was executed. Evidence: `protected_unchanged=true`.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verifier contract**: See `checklist.md`
- **Parent map**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
