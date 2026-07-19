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

Shipped playbook content models to study, plus the scaffold templates that seed a new canonical package. Existing trees retain their legacy underscore roots until the repository content migration; new output uses kebab-case filesystem names.

---

## 1. OVERVIEW

The fastest way to author a correct playbook is to model it on one that already ships and validates. The reference implementations below are live packages built to the current contract; the templates are the scaffolds to copy from.

**Core Principle**: Model a new package on a shipped, validating playbook rather than authoring the structure from scratch.

---

## 2. REFERENCE IMPLEMENTATIONS

**Shipped legacy playbook packages** (study the root-vs-feature split and the scenario tables, not their pending root spelling):

- `.opencode/skills/system-spec-kit/manual-testing-playbook/` - multi-category package with orchestration-heavy scenarios
- `.opencode/skills/system-code-graph/manual-testing-playbook/` - structural and runtime validation package

**Scaffold templates** (copy from these to seed a new package):

- [manual-testing-playbook-template.md](../assets/manual-testing-playbook-template.md) - source scaffold for `manual-testing-playbook/manual-testing-playbook.md`
- [manual-testing-playbook-snippet-template.md](../assets/manual-testing-playbook-snippet-template.md) - source scaffold for `manual-testing-playbook/{CATEGORY_DIR}/{FEATURE_SLUG}.md`, with kebab-case placeholder values

---

## 3. RELATED RESOURCES

- [../SKILL.md](../SKILL.md) - § Output Package Contract and § How It Works carry the shape these examples instantiate
- [README.md](README.md) - Reference map for all overflow detail
- [references/README.md](../../create-feature-catalog/references/README.md) - companion reference for the feature-catalog side of the contract
