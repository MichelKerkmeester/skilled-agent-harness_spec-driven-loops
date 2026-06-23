---
title: "Graph support stays derived and scoped"
description: "Verify graph support is derived and scoped."
trigger_phrases:
  - "graph support stays derived and scoped"
  - "ai-council-state.jsonl"
  - "council graph scope boundary"
  - "derived graph projection"
  - "does council write to graph storage"
version: 2.3.0.8
---

# Graph support stays derived and scoped

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify graph support is derived and scoped.

The skill must not imply council seats write graph storage directly or that graph rows replace append-only ai-council-state.jsonl.

Operators use this feature when the real request is: Does the council write to graph storage yet?

---

## 2. HOW IT WORKS

The shipped surface is anchored by `deep-ai-council`. The playbook scenario `05--scope-boundaries/graph-support-derived-and-scoped.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-011.

Current behavior is grounded in `.opencode/skills/deep-loop-workflows/ai-council/SKILL.md`, which the scenario identifies as skill scope rules. Validation is anchored by `manual_testing_playbook/05--scope-boundaries/graph-support-derived-and-scoped.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify graph support is derived and scoped. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-loop-workflows/ai-council/SKILL.md` | Skill | Skill scope rules |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/05--scope-boundaries/graph-support-derived-and-scoped.md` | Automated test | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Scope Boundaries
- Feature ID: DAC-011
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature_catalog/05--scope-boundaries/graph-support-derived-and-scoped.md`
- Playbook scenario: `manual_testing_playbook/05--scope-boundaries/graph-support-derived-and-scoped.md`
Related references:
- [planning-only-boundary-rejects-implementation-writes.md](planning-only-boundary-rejects-implementation-writes.md) — Planning-only boundary rejects implementation writes
