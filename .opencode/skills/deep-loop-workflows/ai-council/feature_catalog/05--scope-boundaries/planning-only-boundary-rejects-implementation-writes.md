---
title: "Planning-only boundary rejects implementation writes"
description: "Verify the council writes only packet-local ai-council/** artifacts."
trigger_phrases:
  - "planning-only boundary rejects implementation writes"
  - "ai-council/** artifacts"
  - "council write scope enforcement"
  - "planning agent boundary"
  - "council cannot implement"
version: 2.3.0.8
---

# Planning-only boundary rejects implementation writes

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify the council writes only packet-local ai-council/** artifacts.

The council is useful only if it remains a planning agent and hands implementation to the right actor.

Operators use this feature when the real request is: Have the council pick a plan and implement it.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `deep-ai-council`. The playbook scenario `05--scope-boundaries/planning-only-boundary-rejects-implementation-writes.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-012.

Current behavior is grounded in `.opencode/skills/deep-loop-workflows/ai-council/SKILL.md`, which the scenario identifies as skill rules and integration points. Validation is anchored by `manual_testing_playbook/05--scope-boundaries/planning-only-boundary-rejects-implementation-writes.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify the council writes only packet-local ai-council/** artifacts. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-loop-workflows/ai-council/SKILL.md` | Skill | Skill rules and integration points |
| `.opencode/agents/ai-council.md` | Runtime Mirror | Runtime permission boundary |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/05--scope-boundaries/planning-only-boundary-rejects-implementation-writes.md` | Automated test | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Scope Boundaries
- Feature ID: DAC-012
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature_catalog/05--scope-boundaries/planning-only-boundary-rejects-implementation-writes.md`
- Playbook scenario: `manual_testing_playbook/05--scope-boundaries/planning-only-boundary-rejects-implementation-writes.md`
Related references:
- [graph-support-derived-and-scoped.md](graph-support-derived-and-scoped.md) — Graph support stays derived and scoped
