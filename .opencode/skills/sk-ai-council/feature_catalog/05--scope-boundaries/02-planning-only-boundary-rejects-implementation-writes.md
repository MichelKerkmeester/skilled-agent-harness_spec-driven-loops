---
title: "Planning-only boundary rejects implementation writes"
description: "Verify the council writes only packet-local ai-council/** artifacts."
---

# Planning-only boundary rejects implementation writes

## 1. OVERVIEW

Verify the council writes only packet-local ai-council/** artifacts.

The council is useful only if it remains a planning agent and hands implementation to the right actor.

Operators use this feature when the real request is: Have the council pick a plan and implement it.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `sk-ai-council`. The playbook scenario `05--scope-boundaries/002-planning-only-boundary-rejects-implementation-writes.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-012.

Current behavior is grounded in `.opencode/skills/sk-ai-council/SKILL.md`, which the scenario identifies as skill rules and integration points. Validation is anchored by `manual_testing_playbook/05--scope-boundaries/002-planning-only-boundary-rejects-implementation-writes.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify the council writes only packet-local ai-council/** artifacts. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/sk-ai-council/SKILL.md` | Skill | Skill rules and integration points |
| `.opencode/agents/sk-ai-council.md` | Runtime Mirror | Runtime permission boundary |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/05--scope-boundaries/002-planning-only-boundary-rejects-implementation-writes.md` | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Scope Boundaries
- Feature ID: DAC-012
- Canonical catalog source: `manual_testing_playbook.md`
- Feature file path: `feature_catalog/05--scope-boundaries/02-planning-only-boundary-rejects-implementation-writes.md`
- Playbook scenario: `manual_testing_playbook/05--scope-boundaries/002-planning-only-boundary-rejects-implementation-writes.md`
