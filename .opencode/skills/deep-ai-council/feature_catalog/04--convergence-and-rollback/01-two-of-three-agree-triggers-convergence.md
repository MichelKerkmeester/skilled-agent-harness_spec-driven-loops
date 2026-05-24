---
title: "Two-of-three agree triggers convergence"
description: "Verify two-of-three agreement triggers convergence."
---

# Two-of-three agree triggers convergence

## 1. OVERVIEW

Verify two-of-three agreement triggers convergence.

Operators need a clear stop rule that does not pretend unanimity is required.

Operators use this feature when the real request is: Check whether this council has enough agreement to proceed.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `deep-ai-council`. The playbook scenario `04--convergence-and-rollback/001-two-of-three-agree-triggers-convergence.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-008.

Current behavior is grounded in `.opencode/skills/deep-ai-council/references/convergence_signals.md`, which the scenario identifies as convergence rule. Validation is anchored by `manual_testing_playbook/04--convergence-and-rollback/001-two-of-three-agree-triggers-convergence.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify two-of-three agreement triggers convergence. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-ai-council/references/convergence_signals.md` | Reference | Convergence rule |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/04--convergence-and-rollback/001-two-of-three-agree-triggers-convergence.md` | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Convergence And Rollback
- Feature ID: DAC-008
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/04--convergence-and-rollback/01-two-of-three-agree-triggers-convergence.md`
- Playbook scenario: `manual_testing_playbook/04--convergence-and-rollback/001-two-of-three-agree-triggers-convergence.md`
