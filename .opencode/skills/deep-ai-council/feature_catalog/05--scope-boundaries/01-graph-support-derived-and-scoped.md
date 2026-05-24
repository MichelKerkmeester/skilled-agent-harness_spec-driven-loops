---
title: "Graph support stays derived and scoped"
description: "Verify graph support is derived and scoped."
---

# Graph support stays derived and scoped

## 1. OVERVIEW

Verify graph support is derived and scoped.

The skill must not imply council seats write graph storage directly or that graph rows replace append-only ai-council-state.jsonl.

Operators use this feature when the real request is: Does the council write to graph storage yet?

---

## 2. CURRENT REALITY

The shipped surface is anchored by `deep-ai-council`. The playbook scenario `05--scope-boundaries/001-graph-support-derived-and-scoped.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-011.

Current behavior is grounded in `.opencode/skills/deep-ai-council/SKILL.md`, which the scenario identifies as skill scope rules. Validation is anchored by `manual_testing_playbook/05--scope-boundaries/001-graph-support-derived-and-scoped.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify graph support is derived and scoped. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-ai-council/SKILL.md` | Skill | Skill scope rules |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/05--scope-boundaries/001-graph-support-derived-and-scoped.md` | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Scope Boundaries
- Feature ID: DAC-011
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/05--scope-boundaries/01-graph-support-derived-and-scoped.md`
- Playbook scenario: `manual_testing_playbook/05--scope-boundaries/001-graph-support-derived-and-scoped.md`
