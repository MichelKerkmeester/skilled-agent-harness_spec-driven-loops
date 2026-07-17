---
title: "Feature Specification: Design-foundations (032 phase 003)"
description: "The design-foundations mode contains underscore-bearing visual-system references and fixture directories, and its Python checker paths must remain executable under the exemption boundary."
trigger_phrases:
  - "design-foundations naming phase"
  - "sk-design design-foundations phase"
  - "032 design-foundations"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/003-design-foundations"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored design-foundations spec"
    next_safe_action: "Execute phase on pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-foundations/SKILL.md"
      - ".opencode/skills/sk-design/design-foundations/references/"
      - ".opencode/skills/sk-design/design-foundations/scripts/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Design-foundations (032 phase 003)

> Phase 003 of the sk-design component migration under `sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design`. This document defines the future execution scope; this authoring pass performs no migration.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/003-design-foundations |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-design |
| **Origin** | Phase 3 of the sk-design subtree in the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The design-foundations mode contains underscore-bearing visual-system references and fixture directories, and its Python checker paths must remain executable under the exemption boundary.

**Purpose:** Rename non-exempt design-foundations filesystem names to kebab-case while preserving Python tooling and all resource references.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename the listed Markdown assets, procedures, references, and the non-Python fixture directory.
- Update SKILL.md, README.md, checker documentation, fixture references, and all local path links.
- Leave baseline_rhythm_check.py, contrast_check.py, naming_doc_check.py, and every other Python file unchanged.
- Keep catalog/playbook trees for phases 008/009 and preserve design-token identifiers and frontmatter/data keys.

### Live candidate boundary
- `assets/contrast_pair_inventory.md` and `assets/token_starter.md` become hyphenated
- `procedures/component_system_inventory.md`, `hierarchy_rhythm_review.md`, and `tweakable_design_controls.md` become hyphenated
- `references/color/`, `references/layout/`, and `references/type/` keep their roles while underscore-bearing files such as `oklch_workflow.md`, `palette_theming.md`, `adaptation_matrix.md`, `layout_responsive.md`, `typography_system.md`, and `worked_examples.md` become hyphenated
- `references/data_viz.md`, `design_system_artifact_contract.md`, `smart_router_pseudocode.md`, and `corpus_map.md` become hyphenated
- `scripts/fixtures/naming_doc/` → `scripts/fixtures/naming-doc/`; `scripts/*.py` remains exact

### Out of Scope
- Python script filenames, Python package directories, executable behavior, token names, and data keys.
- Feature-catalog, manual-testing-playbook, shared, benchmark, and changelog surfaces.
- Changing the naming checker rules; only filesystem paths and path-valued references move.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|-------|-------|-------|
| REQ-001 | The foundations candidate map separates Markdown/fixture paths from Python exemptions. | Every underscore-bearing path is classified exactly once, with all .py paths explicitly exempt. |
| REQ-002 | Foundations resources resolve after the rename. | SKILL.md, README.md, checker docs, and local references contain no stale old path. |
| REQ-003 | Python execution remains intact. | The phase evidence proves the Python script paths and import/package boundaries were not renamed. |
| REQ-004 | Catalog/playbook ownership remains clean. | No phase-003 task changes paths owned by phases 008 or 009. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The design-foundations non-exempt tree is kebab-clean.
- **SC-002**: The naming checker fixture path is hyphenated without changing Python code or fixture semantics.
- **SC-003**: Resource and reference resolution passes with Python exemptions documented.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|-------|-------|-------|-------|
| Risk | A fixture directory is confused with a Python package directory. | High | Inspect package markers and classify the fixture directory separately from .py and import-package exemptions. |
| Risk | Reference tables silently retain old filenames. | Medium | Sweep Markdown links and code-formatted paths from SKILL.md, README.md, and references. |

Dependencies: the canonical convention and exemption boundary in `001-convention-policy-and-scope/`; the pinned BASE and rename-map evidence from the program's earlier baseline/tooling phases; and the sibling handoffs named in this phase's plan.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- No blocking questions; the only special case is the explicitly preserved Python script set.
<!-- /ANCHOR:questions -->
