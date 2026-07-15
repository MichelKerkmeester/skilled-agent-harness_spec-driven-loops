---
title: "Implementation Plan: catalog and playbook generators (017 phase 003 child 002)"
description: "Align the catalog and playbook workflow packets with hyphenated output paths, then run the generated trees through phase 002's dual-name and fail-closed consumer matrix."
trigger_phrases:
  - "catalog and playbook generator implementation plan"
  - "feature catalog hyphen naming plan"
  - "manual testing playbook hyphen naming plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/003-create-generators-and-templates/002-catalog-and-playbook-generators"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/003-create-generators-and-templates/002-catalog-and-playbook-generators"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the implementation plan for hyphenated catalog and playbook output"
    next_safe_action: "Load phase 002's consumer contract and build the four-state fixture matrix"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Catalog and Playbook Generators

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `sk-doc/create-feature-catalog` and `sk-doc/create-manual-testing-playbook` |
| **Change class** | Generator templates, path guidance, and compatibility evidence |
| **Execution** | Temporary generated trees checked against phase 002 on the pinned BASE worktree |

### Overview
Change the two workflow packets at the point where they choose root, category, leaf, and link names. Use one canonical hyphenated output vocabulary for both packets, keep the current source template filenames untouched, and prove the output against phase 002's old-only/new-only/both/missing root matrix before accepting it.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 002's dual-name read tolerance and fail-closed coexistence behavior are available for testing.
- [ ] The current catalog and playbook output trees, templates, links, and path-valued frontmatter are inventoried.
- [ ] The distinction between output names, source template filenames, and YAML/JSON keys is recorded.
- [ ] Temporary fixture inputs can be generated without writing existing skill trees.

### Definition of Done
- [ ] Both generator families emit only canonical hyphenated roots, categories, leaves, and links.
- [ ] Generated hyphenated trees classify and load correctly through phase 002.
- [ ] Both-root coexistence fails closed and no silent `readme` downgrade remains.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- The catalog packet owns the root catalog, category directory, and per-feature output vocabulary.
- The playbook packet owns the root playbook, scenario/category directory, and per-scenario output vocabulary.
- Templates and packet guidance define path segments and links; field names such as `trigger_phrases` remain data-schema keys and are not renamed.
- Phase 002 remains the consumer authority during coexistence: it accepts one physical root at a time, supports old/new reads, and rejects both roots.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 002 has landed or provide its consumer fixtures at the candidate SHA.
- [ ] Inventory every output example and path-valued field in both workflow packets.
- [ ] Prepare isolated catalog and playbook fixture inputs with representative category and feature/scenario slugs.

### Phase 2: Implementation
- [ ] Update catalog root, category, feature-file, link, and path-value output patterns to kebab-case.
- [ ] Update playbook root, category, scenario-file, link, and path-value output patterns to kebab-case.
- [ ] Keep current source template filenames and schema keys unchanged; document their later migration boundary.

### Phase 3: Verification
- [ ] Generate both output trees into temporary directories and list every relative path.
- [ ] Run the phase 002 consumer matrix for old-only, new-only, both, and missing roots, including typed classification.
- [ ] Record link/path resolution, conflict diagnostics, and the absence of underscore output names.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Generate a catalog fixture and assert the exact `feature-catalog/feature-catalog.md`, `category-name/`, and `feature-name.md` tree. |
| REQ-002 | Generate a playbook fixture and assert the exact `manual-testing-playbook/manual-testing-playbook.md` tree plus hyphenated scenario paths. |
| REQ-003 | Resolve every root-index, leaf, related-reference, and filesystem-valued frontmatter path from the temporary output tree; assert schema keys are unchanged. |
| REQ-004 | Run phase 002's old-only/new-only/both/missing matrix; new-only classifies as catalog/playbook, old-only remains readable, and no case silently becomes `readme`. |
| REQ-005 | Add both physical roots to each fixture and record the expected fail-closed diagnostic and nonzero exit. |
| REQ-006 | Recursively scan generated paths and path-valued links; report zero non-exempt underscore segments. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 002 is a hard external dependency for acceptance because the generator must not emit a name its consumers cannot resolve. The child also relies on the program policy in the 001 decision record and the existing packet-local catalog/playbook templates. Later phases own existing on-disk renames and are not required to run this generator fixture.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert only the packet guidance/template changes for this child. Delete the disposable generated fixture trees. Do not revert or rename phase 002 consumer logic, and do not touch existing catalog/playbook trees during rollback.
<!-- /ANCHOR:rollback -->
