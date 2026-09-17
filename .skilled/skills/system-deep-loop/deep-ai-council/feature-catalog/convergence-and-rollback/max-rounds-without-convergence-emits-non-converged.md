---
title: "Max rounds without convergence emits non-converged"
description: "Verify non-converged completion behavior."
trigger_phrases:
  - "max rounds without convergence emits non-converged"
  - "convergence_signals escape hatch"
  - "council max rounds exceeded"
  - "non-converged completion"
  - "truthful stop without consensus"
version: 2.3.0.9
---

# Max rounds without convergence emits non-converged

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify non-converged completion behavior.

The council must stop truthfully when agreement fails instead of forcing a fake consensus.

Operators use this feature when the real request is: Tell me what happens if the council reaches max rounds without agreement.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `deep-ai-council`. The playbook scenario `convergence-and-rollback/max-rounds-without-convergence-emits-non-converged.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-009.

Current behavior is grounded in `.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/convergence-signals.md`, which the scenario identifies as escape hatch guidance. Validation is anchored by `manual-testing-playbook/convergence-and-rollback/max-rounds-without-convergence-emits-non-converged.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify non-converged completion behavior. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/convergence-signals.md` | Reference | Escape hatch guidance |
| `.opencode/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md` | Reference | Completion event semantics |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/convergence-and-rollback/max-rounds-without-convergence-emits-non-converged.md` | Automated test | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Convergence And Rollback
- Feature ID: DAC-009
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `feature-catalog/convergence-and-rollback/max-rounds-without-convergence-emits-non-converged.md`
- Playbook scenario: `manual-testing-playbook/convergence-and-rollback/max-rounds-without-convergence-emits-non-converged.md`
Related references:
- [two-of-three-agree-triggers-convergence.md](../../feature-catalog/convergence-and-rollback/two-of-three-agree-triggers-convergence.md) — Two-of-three agree triggers convergence
- [rollback-failed-round-preserves-forensic-trail.md](../../feature-catalog/convergence-and-rollback/rollback-failed-round-preserves-forensic-trail.md) — Rollback failed round preserves forensic trail
