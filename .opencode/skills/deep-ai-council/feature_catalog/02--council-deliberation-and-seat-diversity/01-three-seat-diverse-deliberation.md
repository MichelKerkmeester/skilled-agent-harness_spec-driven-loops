---
title: "Three-seat diverse deliberation"
description: "Verify three distinct seat lenses are required."
---

# Three-seat diverse deliberation

## 1. OVERVIEW

Verify three distinct seat lenses are required.

Council value comes from useful disagreement, not repeated copies of one default plan.

Operators use this feature when the real request is: Run a deep AI council to compare these two implementation plans and persist the artifacts.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `deep-ai-council`. The playbook scenario `02--council-deliberation-and-seat-diversity/001-three-seat-diverse-deliberation.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-003.

Current behavior is grounded in `.opencode/skills/deep-ai-council/references/patterns/seat_diversity_patterns.md`, which the scenario identifies as seat diversity contract. Validation is anchored by `manual_testing_playbook/02--council-deliberation-and-seat-diversity/001-three-seat-diverse-deliberation.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify three distinct seat lenses are required. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-ai-council/references/patterns/seat_diversity_patterns.md` | Reference | Seat diversity contract |
| `.opencode/agents/ai-council.md` | Runtime Mirror | Runtime strategy rules |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/02--council-deliberation-and-seat-diversity/001-three-seat-diverse-deliberation.md` | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Council Deliberation And Seat Diversity
- Feature ID: DAC-003
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/02--council-deliberation-and-seat-diversity/01-three-seat-diverse-deliberation.md`
- Playbook scenario: `manual_testing_playbook/02--council-deliberation-and-seat-diversity/001-three-seat-diverse-deliberation.md`
