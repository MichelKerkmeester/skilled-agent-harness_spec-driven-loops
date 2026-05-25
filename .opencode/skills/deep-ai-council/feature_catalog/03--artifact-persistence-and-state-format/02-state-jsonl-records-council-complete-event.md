---
title: "State JSONL records council_complete event"
description: "Verify final state includes council_complete."
---

# State JSONL records council_complete event

## 1. OVERVIEW

Verify final state includes council_complete.

Resume and audit workflows need an explicit terminal event to distinguish complete runs from interrupted runs.

Operators use this feature when the real request is: Check whether this council run completed.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `deep-ai-council`. The playbook scenario `03--artifact-persistence-and-state-format/002-state-jsonl-records-council-complete-event.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-006.

Current behavior is grounded in `.opencode/skills/deep-ai-council/references/structure/state_format.md`, which the scenario identifies as state event contract. Validation is anchored by `manual_testing_playbook/03--artifact-persistence-and-state-format/002-state-jsonl-records-council-complete-event.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify final state includes council_complete. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-ai-council/references/structure/state_format.md` | Reference | State event contract |
| `.opencode/skills/deep-ai-council/scripts/advise-council-completion.cjs` | Script | Completion advisory |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/03--artifact-persistence-and-state-format/002-state-jsonl-records-council-complete-event.md` | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Artifact Persistence And State Format
- Feature ID: DAC-006
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/03--artifact-persistence-and-state-format/02-state-jsonl-records-council-complete-event.md`
- Playbook scenario: `manual_testing_playbook/03--artifact-persistence-and-state-format/002-state-jsonl-records-council-complete-event.md`
