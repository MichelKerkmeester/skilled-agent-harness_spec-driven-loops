---
title: "Feature Specification: catalog and playbook generators (032 phase 003 child 002)"
description: "The feature-catalog and manual-testing-playbook generators still describe and emit underscore roots, categories, and artifact files. They must emit kebab-case output only after phase 002's bounded consumer tolerance can resolve the new names without a silent readme downgrade."
trigger_phrases:
  - "catalog and playbook generator naming"
  - "hyphenated feature catalog output"
  - "hyphenated testing playbook output"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/003-create-generators-and-templates"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/003-create-generators-and-templates/002-catalog-and-playbook-generators"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the Level 2 contract for catalog and playbook generator output names"
    next_safe_action: "Confirm phase 002 consumer fixtures before changing generator output guidance"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Catalog and Playbook Generators

> Parallel child under `003-create-generators-and-templates`; it has an external compatibility dependency on phase 002's consumer contract.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/032-hyphen-naming-convention/003-create-generators-and-templates/002-catalog-and-playbook-generators |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Child 002 of phase 003 in the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The feature-catalog and manual-testing-playbook workflows currently teach and emit underscore roots, category folders, and per-artifact filenames. Their runtime consumers key on those roots, so changing only the generator would either make new artifacts unreadable or silently classify them as generic `readme` documents.

After phase 002 establishes bounded dual-name tolerance, update both generator packets and their templates so new catalog/playbook trees use hyphenated roots, categories, files, links, and path-derived frontmatter values. The generator must emit only the new form while the consumer matrix proves that the coexistence window remains fail-closed.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `create-feature-catalog` and `create-manual-testing-playbook` `SKILL.md`, `README.md`, references, and output templates that describe or scaffold artifact paths.
- Feature-catalog output: `feature-catalog/feature-catalog.md`, hyphenated category directories, and hyphenated per-feature `.md` files.
- Playbook output: `manual-testing-playbook/manual-testing-playbook.md`, hyphenated scenario/category directories, and hyphenated per-scenario `.md` files.
- Generated relative links and filesystem-valued frontmatter such as category or feature slugs.
- Temporary output fixtures and the phase 002 consumer-compatibility matrix.

### Out of Scope
- Implementing phase 002's classifier, Lane C, guard, or other consumer logic.
- Renaming existing catalog/playbook trees; that belongs to the later migration phases.
- Renaming current source asset filenames such as `feature_catalog_template.md` or `manual_testing_playbook_template.md`; source-file renames are separate migration work.
- The `/create:*` YAML/presentation asset emitters; child 004 owns those instructions.
- Code identifiers, YAML/JSON keys, frontmatter field names, and Python filenames/package directories.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The feature-catalog generator emits a canonical hyphenated tree | A temporary generation contains `feature-catalog/feature-catalog.md`, a `category-name/` directory, and a `feature-name.md` leaf with no underscore output alias. |
| REQ-002 | The manual-testing-playbook generator emits a canonical hyphenated tree | A temporary generation contains `manual-testing-playbook/manual-testing-playbook.md`, hyphenated scenario/category directories, and hyphenated scenario files. |
| REQ-003 | Links, path values, and category/feature slugs agree with emitted names | Root indexes, per-artifact links, and filesystem-valued frontmatter resolve to the generated hyphenated paths; field keys remain unchanged. |
| REQ-004 | Generation is compatible with phase 002's dual-name consumer contract | The phase 002 matrix resolves a generated hyphenated tree as its typed catalog/playbook document, not `readme`, while old-only reads remain supported during coexistence. |
| REQ-005 | Coexisting physical roots fail closed | A fixture containing both the underscore and hyphen root fails with the phase 002 conflict diagnostic rather than choosing one silently. |
| REQ-006 | Generated output contains no non-exempt underscore filesystem name | A recursive temporary-tree scan passes for the hyphenated output and reports no underscore root, category, leaf, or path-valued link. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: New catalogs and playbooks are born with hyphenated roots, categories, leaves, and links.
- **SC-002**: The generator output is readable by phase 002 consumers throughout the bounded coexistence window, with both-root conflicts rejected.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The blocking dependency is phase 002's consumer matrix. A generator-only change can create a valid-looking tree that the classifier or Lane C loader cannot resolve, so the generated hyphenated fixture must be run through old-only, new-only, both-root, and missing-root cases. Existing source templates and repository content retain their current filenames until their assigned migration phases; this child proves emitted output, not retroactive cleanup.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; the root-name tolerance, fail-closed coexistence rule, and exemption boundary are fixed by phase 002 and DR-002/DR-003/DR-005.
<!-- /ANCHOR:questions -->
