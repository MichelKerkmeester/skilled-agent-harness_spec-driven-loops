---
title: "Output schema strict required sections fail closed"
description: "Verify missing required report sections exit 1."
trigger_phrases:
  - "output schema strict required sections fail closed"
  - "output_schema"
  - "reject incomplete council report"
  - "required section validation"
  - "fail-closed schema enforcement"
version: 2.3.0.9
---

# Output schema strict required sections fail closed

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify missing required report sections exit 1.

Lossy persistence would make council artifacts look complete while hiding missing planning evidence.

Operators use this feature when the real request is: Try to persist this incomplete council report and tell me whether it is accepted.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `persist-artifacts.cjs`, `deep-ai-council`. The playbook scenario `03--artifact-persistence-and-state-format/output-schema-strict-required-sections-fail-closed.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-007.

Current behavior is grounded in `.opencode/skills/system-deep-loop/deep-ai-council/references/structure/output_schema.md`, which the scenario identifies as requiredness contract. Validation is anchored by `manual_testing_playbook/03--artifact-persistence-and-state-format/output-schema-strict-required-sections-fail-closed.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify missing required report sections exit 1. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-deep-loop/deep-ai-council/references/structure/output_schema.md` | Reference | Requiredness contract |
| `.opencode/skills/system-deep-loop/deep-ai-council/scripts/persist-artifacts.cjs` | Script | Parser entrypoint |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/03--artifact-persistence-and-state-format/output-schema-strict-required-sections-fail-closed.md` | Automated test | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Artifact Persistence And State Format
- Feature ID: DAC-007
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature_catalog/03--artifact-persistence-and-state-format/output-schema-strict-required-sections-fail-closed.md`
- Playbook scenario: `manual_testing_playbook/03--artifact-persistence-and-state-format/output-schema-strict-required-sections-fail-closed.md`
Related references:
- [state-jsonl-records-council-complete-event.md](state-jsonl-records-council-complete-event.md) — State JSONL records council_complete event
