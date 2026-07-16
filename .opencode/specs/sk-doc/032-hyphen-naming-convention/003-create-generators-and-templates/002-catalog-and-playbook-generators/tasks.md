---
title: "Tasks: catalog and playbook generators (032 phase 003 child 002)"
description: "Tasks for changing feature-catalog and manual-testing-playbook generators to emit hyphenated artifact trees and proving phase 002 compatibility."
trigger_phrases:
  - "catalog and playbook generator tasks"
  - "feature catalog output naming tasks"
  - "manual testing playbook output naming tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/003-create-generators-and-templates/002-catalog-and-playbook-generators"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/003-create-generators-and-templates/002-catalog-and-playbook-generators"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the task breakdown for catalog/playbook generator output naming"
    next_safe_action: "Confirm phase 002 consumer fixtures and inventory current output patterns"
    blockers: []
    key_files: []
    completion_pct: 0
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

- [ ] T001 Confirm phase 002's dual-name and fail-closed consumer fixture contract at the candidate SHA.
- [ ] T002 Inventory catalog/playbook root, category, leaf, link, and path-valued frontmatter output patterns.
- [ ] T003 [P] Prepare isolated catalog and playbook fixture inputs with representative hyphenated slugs.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Update feature-catalog output roots, category directories, per-feature files, links, and path values to kebab-case.
- [ ] T005 Update manual-testing-playbook output roots, category/scenario directories, per-scenario files, links, and path values to kebab-case.
- [ ] T006 Keep schema keys, current source-template filenames, and existing on-disk content outside this child unchanged.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify: a catalog fixture emits `feature-catalog/feature-catalog.md`, `category-name/`, and `feature-name.md`.
- [ ] T008 Verify: a playbook fixture emits `manual-testing-playbook/manual-testing-playbook.md` and hyphenated scenario paths.
- [ ] T009 Verify: all generated links and filesystem-valued frontmatter resolve from the temporary output trees.
- [ ] T010 Verify: phase 002's old-only/new-only/both/missing matrix passes with typed classification and fail-closed conflicts.
- [ ] T011 Verify: a recursive generated-output scan reports zero non-exempt underscore path segments.
- [ ] T012 Record the generator and consumer commands, exit codes, fixture counts, and conflict diagnostics.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete.
- [ ] All requirements in `spec.md` are met with evidence.
- [ ] The phase 002 compatibility gate is green for both generated families.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Consumer contract**: See `../../002-root-name-consumer-migration/spec.md` and its `checklist.md`.
<!-- /ANCHOR:cross-refs -->
