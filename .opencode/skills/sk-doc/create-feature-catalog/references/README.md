---
title: Feature Catalog Creation References
description: Route-map for the create-feature-catalog reference overflow — a worked live-catalog example and a deep-dive pitfalls companion, with the primary workflow held in SKILL.md.
trigger_phrases:
  - "feature catalog references"
  - "feature catalog reference map"
  - "feature catalog overflow guidance"
  - "feature catalog examples and pitfalls"
  - "create feature catalog reference index"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Create Feature Catalog - References

Route-map for the `create-feature-catalog` reference set. The primary authoring contract lives in the packet `SKILL.md`; these references carry only the overflow depth that does not belong inline.

---

## 1. OVERVIEW

`../SKILL.md` is the single source of truth for the feature-catalog workflow and rules — when to build a catalog, the canonical package shape, the numbered creation workflow, root-catalog and per-feature requirements, the catalog/playbook boundary, and the ALWAYS/NEVER/ESCALATE rules. Read it first. Load a reference below only when you need the extra depth it names; the workflow is not re-stated here.

**Core Principle**: Keep the workflow and contract in `SKILL.md`; keep worked depth (a real example, extended pitfall fixes) in single-concern references.

Two scaffolds live in `../assets/feature_catalog/` and are the starting point for actual files:

- `feature_catalog_template.md` — root catalog scaffold, plus its own when-to-create table, category/file design, authoring notes, and publishing checklist.
- `feature_catalog_snippet_template.md` — per-feature file scaffold, plus its frontmatter contract, authoring notes, and per-feature checklist.

---

## 2. REFERENCE MAP

Load the file that matches the current task:

| Concern | Reference | Load When |
| --- | --- | --- |
| **The workflow and rules** — when to create, package shape, the numbered creation workflow, root-catalog and per-feature requirements, playbook boundary, ALWAYS/NEVER/ESCALATE | [../SKILL.md](../SKILL.md) | Authoring or restructuring any catalog — this is the primary contract, read it first |
| **A worked real-world example** — an annotated walkthrough of the shipped `system-spec-kit/feature_catalog/` package: root-catalog anatomy and a real per-feature file, section by section | [examples.md](examples.md) | Modeling a new catalog on a proven layout, or checking what a good root entry and per-feature file actually look like |
| **Deep-dive pitfalls** — the recurring catalog defects with worked before/after fixes, plus the template-versus-reference split | [common_pitfalls.md](common_pitfalls.md) | A catalog drifts toward roadmap, loses source anchors, breaks slugs, or reads as a wall of prose; reviewing a freshly authored catalog |

---

## 3. RELATED RESOURCES

### Packet

- [../SKILL.md](../SKILL.md) - the primary feature-catalog workflow and rules contract
- [../assets/feature_catalog/feature_catalog_template.md](../assets/feature_catalog/feature_catalog_template.md) - root catalog scaffold
- [../assets/feature_catalog/feature_catalog_snippet_template.md](../assets/feature_catalog/feature_catalog_snippet_template.md) - per-feature file scaffold

### Shared sk-doc backbone

- [quick_reference.md](../../shared/references/quick_reference.md) - condensed commands and file locations
- [validation.md](../../shared/references/validation.md) - quality scoring and validation workflows
- [frontmatter_versioning.md](../../shared/references/frontmatter_versioning.md) - 4-part version field rules

### Companion packets

- [create-manual-testing-playbook references](../../create-manual-testing-playbook/references/README.md) - the validation-package side of the catalog/playbook boundary
- [workflows.md](../../create-quality-control/references/workflows.md) - create-quality-control execution modes

### Live example

- `.opencode/skills/system-spec-kit/feature_catalog/` - the shipped catalog walked through in [examples.md](examples.md)
