---
title: Manual Testing Playbook Reference Implementations
description: Shipped manual testing playbook packages to model new packages on, plus the scaffold templates that seed a fresh package.
trigger_phrases:
  - "manual testing playbook examples"
  - "playbook reference implementation"
  - "shipped playbook to model on"
  - "playbook scaffold templates"
  - "system-spec-kit playbook example"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Manual Testing Playbook Reference Implementations

Canonical, shipped playbook packages to model a new package on, plus the scaffold templates that seed one. Study a shipped package before authoring a new one - the layout, root-vs-feature split, and scenario tables are already proven.

---

## 1. OVERVIEW

The fastest way to author a correct playbook is to model it on one that already ships and validates. The reference implementations below are live packages built to the current contract; the templates are the scaffolds to copy from.

**Core Principle**: Model a new package on a shipped, validating playbook rather than authoring the structure from scratch.

---

## 2. REFERENCE IMPLEMENTATIONS

**Shipped playbook packages** (study the root-vs-feature split and the scenario tables):

- `.opencode/skills/system-spec-kit/manual_testing_playbook/` - multi-category package with orchestration-heavy scenarios
- `.opencode/skills/system-code-graph/manual_testing_playbook/` - structural and runtime validation package

**Scaffold templates** (copy from these to seed a new package):

- [manual_testing_playbook_template.md](../assets/manual_testing_playbook_template.md) - root playbook scaffold for `manual_testing_playbook/manual_testing_playbook.md`
- [manual_testing_playbook_snippet_template.md](../assets/manual_testing_playbook_snippet_template.md) - per-feature scaffold for `manual_testing_playbook/{category_name}/{feature_name}.md`

---

## 3. RELATED RESOURCES

- [../SKILL.md](../SKILL.md) - § Output Package Contract and § How It Works carry the shape these examples instantiate
- [README.md](README.md) - Reference map for all overflow detail
- [references/README.md](../../create-feature-catalog/references/README.md) - companion reference for the feature-catalog side of the contract
