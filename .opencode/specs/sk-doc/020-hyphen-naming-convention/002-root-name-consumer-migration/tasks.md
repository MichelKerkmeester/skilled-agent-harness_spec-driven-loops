---
title: "Tasks: root-name consumer migration (020 phase 002)"
description: "Tasks for phase 002 of the 020 kebab-case filesystem-naming program: root-name consumer migration."
trigger_phrases:
  - "root-name consumer migration tasks"
  - "hyphen naming phase 002 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/002-root-name-consumer-migration"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/002-root-name-consumer-migration"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Added implementation and verification tasks for per-skill fail-closed coexistence"
    next_safe_action: "Build the consumer-manifest matrix and run each unsupported-name fixture"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Root-name consumer migration

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

- [x] T001 Confirm predecessor phases landed and the pinned tracked baseline is clean; evidence: `git rev-parse HEAD` and BASE `1ec0ad2947b`
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Update `validate_document.py` and preserve the `sk-doc/scripts/` symlink; evidence: mode `120000`
- [x] T003 Harden `load-playbook-scenarios.cjs` and `playbook-generator.cjs`; evidence: Lane C 32/30
- [x] T004 Correct the absent `parent-skill-check.cjs` premise, update `post-edit-router.cjs`, and harden `package_skill.py`; evidence: 13/13 matrix rows
- [x] T005 Redefine `check_no_hyphenated_catalog_content.py` and `test_category_classification_denumbered.py`; evidence: 14/14 checks
- [x] T006 Add bounded dual-name tolerance and fail on physical coexistence; evidence: `RootCoexistenceError`
- [x] T007 Add the per-skill fail-closed coexistence matrix; evidence: `test_root_name_consumer_matrix.py`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Verify every runtime consumer; evidence: `consumer-manifest.md` and 13/13 filesystem rows
- [x] T009 Verify classifier typing and symlink preservation; evidence: `test_category_classification_denumbered.py` and mode `120000`
- [x] T010 Verify alias parity and coexistence refusal; evidence: `test_root_name_consumer_matrix.py`
- [x] T011 Verify Lane C discovery parity; evidence: `sk-doc=32` and `sk-code=30`
- [x] T012 Verify the inverse guard target mode; evidence: `--enforce-hyphen-target`
- [x] T013 Verify POSIX and Windows-style separators; evidence: `test_root_name_consumer_matrix.py`
- [x] T014 Verify all active filesystem consumers and skill families; evidence: 13/13 rows and 11/11 families
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete; evidence: T001-T014 14/14
- [x] All requirements in `spec.md` met with matrix evidence
- [x] Phase gate green; evidence: `validate.sh --strict`
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
