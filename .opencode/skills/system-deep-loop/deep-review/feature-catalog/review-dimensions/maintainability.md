---
title: "Maintainability"
description: "Audits codebase clarity and the safety of follow-on change."
trigger_phrases:
  - "maintainability"
  - "audit codebase clarity"
  - "follow-on change safety"
  - "fourth review dimension"
  - "documentation quality review"
version: 1.11.0.6
---

# Maintainability

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Audits codebase clarity and the safety of follow-on change.

Maintainability is the loop's fourth default audit dimension. It looks at patterns, readability, documentation quality, and how hard the reviewed system will be to change safely after the current review.

## 2. HOW IT WORKS

The contract ranks maintainability fourth and does not mark it as required for severity coverage, but it is still part of the mandatory four-dimension coverage model. The dimension's checks focus on codebase patterns, documentation quality, clarity, and ease of safe follow-on changes.

This dimension often becomes the least-covered pivot target during stuck recovery because it is lower priority than correctness and security but still required before STOP is legal. Its findings usually land as P2 or P1, yet they still shape the final remediation workstreams and the strategy's exhaustion history.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `assets/review-mode-contract.yaml` | Contract | Declares maintainability as dimension `4` and defines its checks. |
| `SKILL.md` | Skill contract | Summarizes maintainability in the four-dimension model. |
| `references/protocol/loop-protocol.md` | Protocol | Orders maintainability last by default and uses it as a recovery pivot when coverage lags. |
| `assets/deep-review-strategy.md` | Template | Provides the maintainability checkbox and completed-dimension tracking surface. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/initialization-and-state-setup/scope-discovery-and-dimension-ordering.md` | Manual scenario | Verifies maintainability appears in the default dimension ordering. |
| `manual-testing-playbook/convergence-and-recovery/stuck-recovery-widens-dimension-focus.md` | Manual scenario | Confirms recovery pivots toward less-covered dimensions such as maintainability. |
| `manual-testing-playbook/convergence-and-recovery/dimension-coverage-convergence-signal.md` | Manual scenario | Verifies maintainability is still required for the full stop signal. |

---

## 4. SOURCE METADATA

- Group: Review dimensions
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `review-dimensions/maintainability.md`
- Primary sources: `assets/review-mode-contract.yaml`, `SKILL.md`, `references/protocol/loop-protocol.md`, `assets/deep-review-strategy.md`
Related references:
- [traceability.md](traceability.md) — Traceability
