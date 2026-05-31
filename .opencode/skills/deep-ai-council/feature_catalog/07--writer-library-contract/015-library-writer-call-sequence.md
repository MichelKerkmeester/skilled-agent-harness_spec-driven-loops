---
title: "Library writer call sequence"
description: "Verify lib/persist-artifacts.js exports the 7 named writers and that they emit artifact_written events."
trigger_phrases:
  - "library writer call sequence"
  - "lib/persist-artifacts.js"
  - "council writer sequence"
  - "artifact_written event"
  - "7 named writers contract"
---

# Library writer call sequence

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify lib/persist-artifacts.js exports the 7 named writers and that they emit artifact_written events.

Council persistence depends on a stable writer library. Missing writers or missing audit events break artifact recovery and completion evidence.

Operators use this feature when the real request is: Show me the canonical writer sequence the council uses.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `deep-ai-council`. The playbook scenario `07--writer-library-contract/015-library-writer-call-sequence.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-013.

Current behavior is grounded in `.opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.js`, which the scenario identifies as writer library and audit event implementation. Validation is anchored by `manual_testing_playbook/07--writer-library-contract/015-library-writer-call-sequence.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify lib/persist-artifacts.js exports the 7 named writers and that they emit artifact_written events. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.js` | Library | Writer library and audit event implementation |
| `.opencode/agents/ai-council.md` | Runtime Mirror | Canonical writer sequence in invocation contract |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/07--writer-library-contract/015-library-writer-call-sequence.md` | Automated test | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Writer Library Contract
- Feature ID: DAC-013
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/07--writer-library-contract/015-library-writer-call-sequence.md`
- Playbook scenario: `manual_testing_playbook/07--writer-library-contract/015-library-writer-call-sequence.md`
Related references:
- [016-five-dimension-scoring-rubric-application.md](016-five-dimension-scoring-rubric-application.md) — Five-dimension scoring rubric application
