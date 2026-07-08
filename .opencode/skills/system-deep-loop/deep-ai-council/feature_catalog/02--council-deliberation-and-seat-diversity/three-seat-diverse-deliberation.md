---
title: "Three-seat diverse deliberation"
description: "Verify three distinct seat lenses are required."
trigger_phrases:
  - "three-seat diverse deliberation"
  - "seat_diversity_patterns"
  - "deliberate with three seats"
  - "seat lens diversity"
  - "council seat roles"
version: 2.3.0.9
---

# Three-seat diverse deliberation

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify three distinct seat lenses are required.

Council value comes from useful disagreement, not repeated copies of one default plan.

Operators use this feature when the real request is: Run a deep AI council to compare these two implementation plans and persist the artifacts.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `deep-ai-council`. The playbook scenario `02--council-deliberation-and-seat-diversity/three-seat-diverse-deliberation.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-003.

Current behavior is grounded in `.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/seat_diversity_patterns.md`, which the scenario identifies as seat diversity contract. Validation is anchored by `manual_testing_playbook/02--council-deliberation-and-seat-diversity/three-seat-diverse-deliberation.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify three distinct seat lenses are required. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/seat_diversity_patterns.md` | Reference | Seat diversity contract |
| `.opencode/agents/ai-council.md` | Runtime Mirror | Runtime strategy rules |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/02--council-deliberation-and-seat-diversity/three-seat-diverse-deliberation.md` | Automated test | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Council Deliberation And Seat Diversity
- Feature ID: DAC-003
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature_catalog/02--council-deliberation-and-seat-diversity/three-seat-diverse-deliberation.md`
- Playbook scenario: `manual_testing_playbook/02--council-deliberation-and-seat-diversity/three-seat-diverse-deliberation.md`
Related references:
- [cross-seat-critique-blocks-premature-convergence.md](cross-seat-critique-blocks-premature-convergence.md) — Cross-seat critique blocks premature convergence
