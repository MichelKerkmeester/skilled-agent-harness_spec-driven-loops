---
title: "Cross-seat critique blocks premature convergence"
description: "Verify cross-seat critique is required before convergence."
---

# Cross-seat critique blocks premature convergence

## 1. OVERVIEW

Verify cross-seat critique is required before convergence.

Immediate agreement can hide shared assumptions; critique forces the council to test that agreement.

Operators use this feature when the real request is: Use the council to pressure-test this plan before we implement it.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `sk-ai-council`. The playbook scenario `02--council-deliberation-and-seat-diversity/002-cross-seat-critique-blocks-premature-convergence.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-004.

Current behavior is grounded in `.opencode/agents/sk-ai-council.md`, which the scenario identifies as deliberation workflow. Validation is anchored by `manual_testing_playbook/02--council-deliberation-and-seat-diversity/002-cross-seat-critique-blocks-premature-convergence.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify cross-seat critique is required before convergence. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/agents/sk-ai-council.md` | Runtime Mirror | Deliberation workflow |
| `.opencode/skills/sk-ai-council/references/convergence_signals.md` | Reference | Convergence escape hatches |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/02--council-deliberation-and-seat-diversity/002-cross-seat-critique-blocks-premature-convergence.md` | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Council Deliberation And Seat Diversity
- Feature ID: DAC-004
- Canonical catalog source: `manual_testing_playbook.md`
- Feature file path: `feature_catalog/02--council-deliberation-and-seat-diversity/02-cross-seat-critique-blocks-premature-convergence.md`
- Playbook scenario: `manual_testing_playbook/02--council-deliberation-and-seat-diversity/002-cross-seat-critique-blocks-premature-convergence.md`
