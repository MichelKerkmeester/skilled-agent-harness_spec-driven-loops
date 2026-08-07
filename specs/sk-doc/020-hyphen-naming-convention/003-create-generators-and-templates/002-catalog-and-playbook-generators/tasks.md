---
title: "Tasks: catalog and playbook generators (020 phase 003 child 002)"
description: "Tasks for changing feature-catalog and manual-testing-playbook generators to emit hyphenated artifact trees and proving phase 002 compatibility."
trigger_phrases:
  - "catalog and playbook generator tasks"
  - "feature catalog output naming tasks"
  - "manual testing playbook output naming tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/002-catalog-and-playbook-generators"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/002-catalog-and-playbook-generators"
    last_updated_at: "2026-07-18T06:46:43Z"
    last_updated_by: "codex"
    recent_action: "Completed catalog and playbook generator output naming tasks"
    next_safe_action: "No child work remains"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-feature-catalog/SKILL.md"
      - ".opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md"
      - ".opencode/skills/sk-doc/scripts/tests/test_root_name_consumer_matrix.py"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Catalog and Playbook Generators

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

- [x] T001 Confirm phase 002's dual-name and fail-closed consumer fixture contract at the candidate SHA. Evidence: `test_root_name_consumer_matrix.py` passed 28 checks.
- [x] T002 Inventory catalog/playbook root, category, leaf, link, and path-valued frontmatter output patterns. Evidence: `create-feature-catalog/SKILL.md:174` and `create-manual-testing-playbook/SKILL.md:157`.
- [x] T003 [P] Prepare isolated catalog and playbook fixture inputs with representative hyphenated slugs. Evidence: `EMISSION_FIXTURE_PASS=2/2`.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Update feature-catalog output roots, category directories, per-feature files, links, and path values to kebab-case. Evidence: `create-feature-catalog/assets/feature_catalog_template.md:35`.
- [x] T005 Update manual-testing-playbook output roots, category/scenario directories, per-scenario files, links, and path values to kebab-case. Evidence: `create-manual-testing-playbook/assets/manual_testing_playbook_template.md:36`.
- [x] T006 Keep schema keys, current source-template filenames, and existing on-disk content outside this child unchanged. Evidence: `feature_catalog_template.md` and `manual_testing_playbook_template.md` remain source filenames.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Verify: a catalog fixture emits `feature-catalog/feature-catalog.md`, `category-name/`, and `feature-name.md`.
- [x] T008 Verify: a playbook fixture emits `manual-testing-playbook/manual-testing-playbook.md` and hyphenated scenario paths.
- [x] T009 Verify: all generated links and filesystem-valued frontmatter resolve from the temporary output trees. Evidence: `LINKS_RESOLVED=2/2`.
- [x] T010 Verify: phase 002's old-only/new-only/both/missing matrix passes with typed classification and fail-closed conflicts. Evidence: `PY_JS_MATRIX_PASS=28` and `RootCoexistenceError`.
- [x] T011 Verify: a recursive generated-output scan reports zero non-exempt underscore path segments. Evidence: `PATH_SCAN_UNDERSCORE_SEGMENTS=0`.
- [x] T012 Record the generator and consumer commands, exit codes, fixture counts, and conflict diagnostics.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete.
- [x] All requirements in `spec.md` are met with evidence.
- [x] The phase 002 compatibility gate is green for both generated families.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Consumer contract**: See `../../002-root-name-consumer-migration/spec.md` and its `checklist.md`.
<!-- /ANCHOR:cross-refs -->
