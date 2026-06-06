---
title: Feature Catalog Creation - Standards and Workflow
description: Standards and workflow guidance for creating feature catalogs with a rooted inventory, numbered category folders, stable per-feature files, and current-reality source references.
---

# Feature Catalog Creation - Standards and Workflow

Standards and workflow guidance for creating feature catalogs with a rooted inventory, numbered category folders, stable per-feature files, and current-reality source references.

---

## 1. OVERVIEW

Feature catalogs are the canonical inventory for what a system does today. They organize capabilities by category, summarize current behavior in a root catalog, and link to per-feature files that carry implementation anchors, tests, and metadata.

**Core Principle**: Use the root catalog for stable inventory and navigation, and use per-feature files for implementation truth and traceable source anchors.

**Primary Sources**:
- [feature_catalog_template.md](../assets/feature_catalog/feature_catalog_template.md)
- [feature_catalog_snippet_template.md](../assets/feature_catalog/feature_catalog_snippet_template.md)
- `.opencode/skills/system-spec-kit/feature_catalog/`

**Package Highlights**:
- feature catalogs use frontmatter (including `trigger_phrases`) and a short H1 intro
- no Table of Contents and no `<!-- ANCHOR -->` navigation comments
- numbered H2 sections begin with `## 1. OVERVIEW`
- per-feature files live in numbered root-level category folders
- per-feature files describe shipped behavior, not speculative aspirations
- long `## 2. HOW IT WORKS` sections (>3 paragraphs) use H3 sub-headings for navigation

## 2. WHEN TO CREATE A FEATURE CATALOG

Create a feature catalog when the system needs a canonical capability inventory.

**Strong signals**:
- the feature surface is too large for a trustworthy README-only summary
- multiple docs need a stable source of truth for feature names and links
- reviewers or operators need one place to see what the system does now
- manual playbooks or specs need a canonical feature list to cross-reference

**Use a lighter alternative when**:
- the system has only a handful of features
- a README already provides a complete and stable inventory
- the product is too volatile for a maintained catalog to stay accurate

Decision rule:

```text
Need a stable, reviewable current-state inventory?
  YES -> Create a feature catalog package
  NO  -> Keep capability summary in README or install guide
```

## 3. CANONICAL PACKAGE SHAPE

The current catalog contract is:

```text
feature_catalog/
├── feature_catalog.md
├── 01--category-name/
│   ├── feature-name.md
│   └── another-feature-name.md
└── 02--another-category/
    └── feature-name.md
```

**Invariants**:
- root file is always `feature_catalog.md` (lowercase)
- category directories use `NN--category-name`
- per-feature files use `feature-name.md` (no numeric prefix)
- one root entry maps to one per-feature file
- slugs should remain stable after publication

**Naming rule**:
- category numbering defines root section order
- per-feature snippet order is defined by the root catalog listing order; filenames no longer encode order. Category folders keep `NN--` numbering for section order.

## 4. ROOT CATALOG RESPONSIBILITIES

The root catalog is the top-level inventory and navigation layer.

It should own:
- frontmatter and H1 intro
- `## 1. OVERVIEW`
- numbered capability sections by category
- short per-feature summaries
- explicit links to per-feature files

**Root summaries should answer**:
- what this feature does
- what its current reality is
- where to find source-file and test detail

**Do not overload the root catalog with**:
- exhaustive file tables
- full scenario matrices
- speculative future-state design

That information belongs in per-feature files, playbooks, or specs.

## 5. PER-FEATURE FILE RESPONSIBILITIES

Each per-feature file is the detailed reference entry for one catalog item.

Required structure:
1. `## 1. OVERVIEW`
2. `## 2. HOW IT WORKS`
3. `## 3. SOURCE FILES`
4. `## 4. SOURCE METADATA`

**Per-feature files must include**:
- frontmatter with stable `title`, one-line `description`, and `trigger_phrases` list
- a concise overview of the feature
- HOW IT WORKS behavior description (see sub-heading rule below)
- implementation source tables with `File | Layer | Role` columns
- validation or test anchors with `File | Type | Role` columns
- metadata including group, canonical file path, and related references

**HOW IT WORKS sub-heading rule**:
- ≤3 paragraphs: write plain prose, no sub-headings needed
- >3 paragraphs: break into H3 sub-headings (e.g. `### Core Behavior`, `### Quality Gates`, `### Configuration`, `### Edge Cases`, `### Async & Safety`)
- describe behavior from the caller's perspective, not the implementation

**Content rule**:
- describe behavior that exists now
- if a rollout or compatibility layer is documented, label it explicitly
- avoid roadmap or speculative wording unless the feature itself is a documented compatibility or feature-flag surface

## 6. AUTHORING WORKFLOW

Recommended workflow:

1. Decide the category taxonomy.
2. Create `feature_catalog/feature_catalog.md`.
3. Create numbered category folders.
4. Create one per-feature file for each root entry using the snippet template.
5. Write concise root summaries and link each feature file.
6. Fill per-feature `HOW IT WORKS` — use plain prose for short features, H3 sub-headings for long ones.
7. Fill source-file tables and SOURCE METADATA (including `Related references`).
8. Validate the root document and manually verify feature-file links.

**Authoring order matters**:
- stabilize names and slugs before polishing prose
- finish root taxonomy before expanding file-level detail
- use implementation and test anchors to justify every feature summary

**Template/reference split**:
- use the template bundle to scaffold the docs
- use this reference to decide what belongs in the root, what belongs in the per-feature file, and how to keep the package aligned with current standards

## 7. RELATIONSHIP TO PLAYBOOKS AND VALIDATION

Feature catalogs and manual testing playbooks serve different purposes:

| Document | Primary Question |
|---|---|
| Feature catalog | What does the system do today? |
| Manual testing playbook | How do we validate that behavior manually? |

**Cross-reference rule**:
- playbooks should link back to the matching catalog entry when one exists
- catalogs should stay focused on current behavior, not test execution detail

**Validation workflow**:
- validate the root catalog with `validate_document.py`
- manually check per-feature file links and source anchors
- confirm the root entry list matches the per-feature file set

**Current validator limitation**:
- validation is strongest at the root-doc level
- per-feature file link and source-anchor quality still require manual review

## 8. COMMON MISTAKES

| Mistake | Why It Breaks | Correct Fix |
|---|---|---|
| Treating the catalog like a roadmap | Readers cannot trust current-state claims | Keep speculative material out or label it explicitly |
| Unstable renaming of category or feature slugs | Breaks links from playbooks and other docs | Keep published slugs stable unless there is a deliberate rename migration |
| Missing source anchors | Catalog claims become hard to audit | Add implementation and validation file references in the per-feature file |
| Writing execution-heavy scenario detail in the catalog | Blurs the boundary with playbooks | Keep execution matrices in playbooks, not the catalog |
| Playbook cross-references drifting from catalog names | Inventory and validation no longer match | Update catalog and playbook links together when a feature name changes |
| Wall of prose in HOW IT WORKS | Long unbroken sections lose scannability and navigation anchors | Add H3 sub-headings whenever the section exceeds 3 paragraphs |
| Missing `trigger_phrases` in frontmatter | Feature is invisible to skill-advisor routing and memory search | Add at least 3 trigger phrases matching the H3 heading in the root catalog |

## 9. RELATED RESOURCES

- [feature_catalog_template.md](../assets/feature_catalog/feature_catalog_template.md) - root catalog scaffold
- [feature_catalog_snippet_template.md](../assets/feature_catalog/feature_catalog_snippet_template.md) - per-feature file scaffold
- [manual_testing_playbook_creation.md](./manual_testing_playbook_creation.md) - companion reference for validation-package design
- [quick_reference.md](global/quick_reference.md) - condensed commands and file locations
- [workflows.md](global/workflows.md) - execution-mode reference
