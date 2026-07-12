---
title: "Two-of-three agree triggers convergence"
description: "Verify two-of-three agreement triggers convergence."
trigger_phrases:
  - "two-of-three agree triggers convergence"
  - "convergence_signals"
  - "majority agreement stop rule"
  - "convergence threshold"
  - "check council agreement to proceed"
version: 2.3.0.9
---

# Two-of-three agree triggers convergence

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify two-of-three agreement triggers convergence.

Operators need a clear stop rule that does not pretend unanimity is required.

Operators use this feature when the real request is: Check whether this council has enough agreement to proceed.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `deep-ai-council`. The playbook scenario `convergence-and-rollback/two-of-three-agree-triggers-convergence.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-008.

Current behavior is grounded in `.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/convergence_signals.md`, which the scenario identifies as convergence rule. Validation is anchored by `manual_testing_playbook/convergence_and_rollback/two_of_three_agree_triggers_convergence.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify two-of-three agreement triggers convergence. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/convergence_signals.md` | Reference | Convergence rule |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/convergence_and_rollback/two_of_three_agree_triggers_convergence.md` | Automated test | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Convergence And Rollback
- Feature ID: DAC-008
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature_catalog/convergence_and_rollback/two_of_three_agree_triggers_convergence.md`
- Playbook scenario: `manual_testing_playbook/convergence_and_rollback/two_of_three_agree_triggers_convergence.md`
Related references:
- [max-rounds-without-convergence-emits-non-converged.md](../convergence_and_rollback/max_rounds_without_convergence_emits_non_converged.md) — Max rounds without convergence emits non-converged
