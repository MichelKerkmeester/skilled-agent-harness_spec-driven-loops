---
title: "Cross-seat critique blocks premature convergence"
description: "Verify cross-seat critique is required before convergence."
trigger_phrases:
  - "cross-seat critique blocks premature convergence"
  - "convergence_signals"
  - "require critique before convergence"
  - "premature agreement prevention"
  - "pressure-test plan with council"
---

# Cross-seat critique blocks premature convergence

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify cross-seat critique is required before convergence.

Immediate agreement can hide shared assumptions; critique forces the council to test that agreement.

Operators use this feature when the real request is: Use the council to pressure-test this plan before we implement it.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `deep-ai-council`. The playbook scenario `02--council-deliberation-and-seat-diversity/cross-seat-critique-blocks-premature-convergence.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-004.

Current behavior is grounded in `.opencode/agents/ai-council.md`, which the scenario identifies as deliberation workflow. Validation is anchored by `manual_testing_playbook/02--council-deliberation-and-seat-diversity/cross-seat-critique-blocks-premature-convergence.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify cross-seat critique is required before convergence. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/agents/ai-council.md` | Runtime Mirror | Deliberation workflow |
| `.opencode/skills/deep-ai-council/references/convergence/convergence_signals.md` | Reference | Convergence escape hatches |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/02--council-deliberation-and-seat-diversity/cross-seat-critique-blocks-premature-convergence.md` | Automated test | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Council Deliberation And Seat Diversity
- Feature ID: DAC-004
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/02--council-deliberation-and-seat-diversity/cross-seat-critique-blocks-premature-convergence.md`
- Playbook scenario: `manual_testing_playbook/02--council-deliberation-and-seat-diversity/cross-seat-critique-blocks-premature-convergence.md`
Related references:
- [three-seat-diverse-deliberation.md](three-seat-diverse-deliberation.md) — Three-seat diverse deliberation
