---
title: "Output schema strict required sections fail closed"
description: "Verify missing required report sections exit 1."
---

# Output schema strict required sections fail closed

## 1. OVERVIEW

Verify missing required report sections exit 1.

Lossy persistence would make council artifacts look complete while hiding missing planning evidence.

Operators use this feature when the real request is: Try to persist this incomplete council report and tell me whether it is accepted.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `persist-artifacts.cjs`, `sk-ai-council`. The playbook scenario `03--artifact-persistence-and-state-format/003-output-schema-strict-required-sections-fail-closed.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-007.

Current behavior is grounded in `.opencode/skills/sk-ai-council/references/output_schema.md`, which the scenario identifies as requiredness contract. Validation is anchored by `manual_testing_playbook/03--artifact-persistence-and-state-format/003-output-schema-strict-required-sections-fail-closed.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify missing required report sections exit 1. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/sk-ai-council/references/output_schema.md` | Reference | Requiredness contract |
| `.opencode/skills/sk-ai-council/scripts/persist-artifacts.cjs` | Script | Parser entrypoint |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/03--artifact-persistence-and-state-format/003-output-schema-strict-required-sections-fail-closed.md` | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Artifact Persistence And State Format
- Feature ID: DAC-007
- Canonical catalog source: `manual_testing_playbook.md`
- Feature file path: `feature_catalog/03--artifact-persistence-and-state-format/03-output-schema-strict-required-sections-fail-closed.md`
- Playbook scenario: `manual_testing_playbook/03--artifact-persistence-and-state-format/003-output-schema-strict-required-sections-fail-closed.md`
