---
title: "Tasks: fixture corpus and dry-run harness (017 phase 005.003)"
description: "Tasks for deterministic disposable fixtures and a dry-run harness covering engine plans, exemptions, collisions, references, dynamic sites, idempotency, rollback, and zero-scan failure."
trigger_phrases:
  - "fixture corpus tasks"
  - "dry-run harness tasks"
  - "rename tooling scenario tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Authored the fixture corpus and dry-run harness task contract"
    next_safe_action: "Implement the deterministic scenario schema and repository seeder"
    blockers: []
    key_files: []
    completion_pct: 0
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

- [ ] T001 Define the scenario schema, deterministic seed, expected outcome fields, and baseline path/content/mode manifest.
- [ ] T002 Create the disposable Git repository lifecycle with a hard boundary that excludes the real migration worktree.
- [ ] T003 [P] Add single-purpose fixtures for semantic targets, dependency closure, symlink mode `120000`, executable bits, and policy exemptions.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add exact, case-folded, NFC, leading-underscore, and double-underscore collision scenarios.
- [ ] T005 Add JS/TS, Markdown, JSON/YAML/TOML path-value, shell, registry, symlink, and dynamic-site reference scenarios.
- [ ] T006 Add dry-run, explicit apply, idempotent rerun, rollback, missing-target, ambiguous-reference, and zero-scan scenarios.
- [ ] T007 Implement runners and assertions for plan output, ledger rows, exit codes, content, names, modes, and Git status.
- [ ] T008 Add repeated-seed comparison so plans, ledgers, counts, and outcomes are deterministic.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Verify: The full fixture matrix covers every supported engine/checker reference and exemption class.
- [ ] T010 Verify: Dry-run leaves the disposable repository and real worktree unchanged; explicit apply is confined to the disposable repository.
- [ ] T011 Verify: Apply, rerun, and rollback restore the fixture baseline and preserve symlink and executable semantics.
- [ ] T012 Verify: Collision, missing-target, ambiguous-reference, undispositioned dynamic-site, and zero-scan scenarios fail non-zero for the intended reason.
- [ ] T013 Verify: Two runs from the same seed produce identical plans, ledger statuses, counts, and exit codes.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All harness tasks complete with evidence in the phase checklist.
- [ ] All requirements in `spec.md` meet their acceptance criteria.
- [ ] The harness is ready to validate phase 005 tooling before phase 006 freezes the repository map.
- [ ] No real migration rename was executed.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verifier contract**: See `checklist.md`
- **Parent map**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
